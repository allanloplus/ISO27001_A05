#!/usr/bin/env python3
"""
產生旁白語音與時間軸
  輸入：build/out/lines.json（由 build.mjs 產生）
  輸出：dist/narration.mp3、build/out/timeline.json

語音：Microsoft Edge Neural TTS（edge-tts）
  Allan 老師：zh-TW-YunJheNeural（台灣男聲）
  阿拉蕾助教：zh-TW-HsiaoYuNeural（台灣女聲，調高音調）
"""
import asyncio, hashlib, json, os, re, ssl, struct, subprocess, sys, math

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'build', 'out')
CACHE = os.path.join(ROOT, 'build', 'cache')
DIST = os.path.join(ROOT, 'dist')
SR = 24000          # PCM 取樣率
FPS = 25            # 嘴型包絡線取樣率

VOICES = {
    'A': dict(voice='zh-TW-YunJheNeural', rate='+6%', pitch='+0Hz'),
    'R': dict(voice='zh-TW-HsiaoYuNeural', rate='+8%', pitch='+28Hz'),
}
GAP = 0.42          # 句間停頓
SWITCH_GAP = 0.30   # 換人說話額外停頓
SCENE_LEAD = 0.9    # 場景開頭留白（讓轉場動畫先跑）
SCENE_TAIL = 1.3    # 場景結尾留白

DIG = '零一二三四五六七八九'


def speakable(text: str) -> str:
    """把條文編號等轉成 TTS 好唸的中文"""
    t = text
    t = t.replace('ISO 27001:2022', 'ISO 二七零零一，二零二二年版')
    t = t.replace('2022版', '二零二二年版')
    # 條文編號 5.15 -> 五點一五
    t = re.sub(r'(?<![\d.])([5-8])\.(\d{1,2})(?![\d.])',
               lambda m: DIG[int(m.group(1))] + '點' + ''.join(DIG[int(c)] for c in m.group(2)), t)
    t = t.replace('ERP', 'E R P').replace('AD帳號', 'A D帳號').replace('AD、', 'A D、')
    return t


def ssl_patch():
    import edge_tts.communicate as c
    ca = os.environ.get('TTS_CA_BUNDLE', '/root/.ccr/ca-bundle.crt')
    if os.path.exists(ca):
        c._SSL_CTX = ssl.create_default_context(cafile=ca)
    return c


async def synth(c, spk, say, path):
    v = VOICES[spk]
    comm = c.Communicate(say, v['voice'], rate=v['rate'], pitch=v['pitch'])
    bounds = []
    with open(path + '.tmp', 'wb') as f:
        async for ch in comm.stream():
            if ch['type'] == 'audio':
                f.write(ch['data'])
            elif ch['type'] in ('SentenceBoundary', 'WordBoundary'):
                bounds.append({'t': ch['offset'] / 1e7, 'd': ch['duration'] / 1e7, 'text': ch['text']})
    os.replace(path + '.tmp', path)
    with open(path + '.json', 'w', encoding='utf-8') as f:
        json.dump(bounds, f, ensure_ascii=False)


def decode(path) -> bytes:
    return subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-f', 's16le', '-ac', '1', '-ar', str(SR), '-'],
                          check=True, capture_output=True).stdout


def trim_silence(pcm: bytes, thr=260):
    """去除頭尾靜音，回傳 (pcm, 去掉的開頭秒數)"""
    n = len(pcm) // 2
    s = struct.unpack('<%dh' % n, pcm)
    a, b = 0, n
    while a < n and abs(s[a]) < thr: a += 1
    while b > a and abs(s[b - 1]) < thr: b -= 1
    a = max(0, a - int(0.04 * SR)); b = min(n, b + int(0.08 * SR))
    return pcm[a * 2:b * 2], a / SR


def envelope(pcm: bytes):
    n = len(pcm) // 2
    s = struct.unpack('<%dh' % n, pcm)
    w = SR // FPS
    out = []
    for i in range(0, n, w):
        seg = s[i:i + w]
        out.append(math.sqrt(sum(x * x for x in seg) / max(1, len(seg))))
    return out


def split_display(text):
    parts = re.findall(r'[^。！？]+[。！？]?', text)
    return [p for p in (x.strip() for x in parts) if p]


async def main():
    os.makedirs(CACHE, exist_ok=True); os.makedirs(DIST, exist_ok=True)
    data = json.load(open(os.path.join(OUT, 'lines.json'), encoding='utf-8'))
    c = ssl_patch()

    # 1) 合成（有快取）
    jobs = []
    for sc in data['scenes']:
        for ln in sc['lines']:
            say = speakable(ln.get('say') or ln['text'])
            v = VOICES[ln['spk']]
            h = hashlib.sha1(json.dumps([v, say], ensure_ascii=False).encode()).hexdigest()[:16]
            ln['_say'] = say
            ln['_mp3'] = os.path.join(CACHE, h + '.mp3')
            if not os.path.exists(ln['_mp3']):
                jobs.append((ln['spk'], say, ln['_mp3']))
    print(f'TTS: {len(jobs)} new / {sum(len(s["lines"]) for s in data["scenes"])} lines', file=sys.stderr)
    sem = asyncio.Semaphore(4)

    async def run(j):
        async with sem:
            for attempt in range(4):
                try:
                    await synth(c, *j); return
                except Exception as e:  # 網路偶發錯誤重試
                    print('retry', attempt, e, file=sys.stderr); await asyncio.sleep(2 ** attempt)
            raise RuntimeError('TTS failed: ' + j[1])
    await asyncio.gather(*(run(j) for j in jobs))

    # 2) 組時間軸與整段音檔
    pcm_all = bytearray()
    t = 0.0
    def pad(sec):
        nonlocal t
        pcm_all.extend(b'\x00\x00' * int(round(sec * SR)))
        t = len(pcm_all) / 2 / SR

    allenv = []
    tl_scenes = []
    for sc in data['scenes']:
        sc_start = t
        pad(SCENE_LEAD)
        lines = []
        prev = None
        for i, ln in enumerate(sc['lines']):
            if i > 0:
                pad(GAP + (SWITCH_GAP if prev != ln['spk'] else 0) + ln.get('pre', 0))
            pcm, cut = trim_silence(decode(ln['_mp3']))
            start = t
            pcm_all.extend(pcm)
            t = len(pcm_all) / 2 / SR
            dur = t - start
            env = envelope(pcm); allenv.extend(env)
            # 字幕分段：優先用 TTS 句界時間
            bounds = [b for b in json.load(open(ln['_mp3'] + '.json', encoding='utf-8'))]
            disp = split_display(ln['text'])
            if len(bounds) == len(disp) and len(disp) > 1:
                chunks = [{'t': round(max(0, b['t'] - cut), 2), 'text': d} for b, d in zip(bounds, disp)]
            else:
                tot = sum(len(d) for d in disp) or 1
                acc, chunks = 0, []
                for d in disp:
                    chunks.append({'t': round(dur * acc / tot, 2), 'text': d}); acc += len(d)
            # 長句再切：超過 40 字的段落以逗號拆開，依字數比例分時間
            fine = []
            for k, ch in enumerate(chunks):
                end = chunks[k + 1]['t'] if k + 1 < len(chunks) else dur
                if len(ch['text']) <= 40:
                    fine.append(ch); continue
                segs = re.findall(r'[^，；：]+[，；：]?', ch['text'])
                groups, cur = [], ''
                for s_ in segs:
                    if cur and len(cur) + len(s_) > 34:
                        groups.append(cur); cur = s_
                    else:
                        cur += s_
                if cur: groups.append(cur)
                tot = sum(len(g) for g in groups); acc = 0
                for g in groups:
                    fine.append({'t': round(ch['t'] + (end - ch['t']) * acc / tot, 2), 'text': g}); acc += len(g)
            lines.append({'spk': ln['spk'], 'text': ln['text'], 'start': round(start, 3), 'dur': round(dur, 3),
                          'chunks': fine, '_env': env})
            prev = ln['spk']
        pad(SCENE_TAIL)
        tl_scenes.append({'start': round(sc_start, 3), 'end': round(t, 3), 'lines': lines})

    # 包絡線量化成 0-9 字串
    srt = sorted(allenv)
    ref = srt[int(len(srt) * 0.95)] or 1
    for sc in tl_scenes:
        for ln in sc['lines']:
            ln['env'] = ''.join(str(min(9, int(9 * math.sqrt(min(1, v / ref)) + 0.5))) if v > ref * 0.04 else '0'
                                for v in ln.pop('_env'))

    wav = os.path.join(OUT, 'narration.wav')
    with open(wav, 'wb') as f:
        n = len(pcm_all)
        f.write(b'RIFF' + struct.pack('<I', 36 + n) + b'WAVEfmt ' + struct.pack('<IHHIIHH', 16, 1, 1, SR, SR * 2, 2, 16)
                + b'data' + struct.pack('<I', n)); f.write(pcm_all)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', wav, '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11',
                    '-ar', '24000', '-ac', '1', '-c:a', 'libmp3lame', '-b:a', '64k', os.path.join(DIST, 'narration.mp3')],
                   check=True)
    json.dump({'duration': round(t, 3), 'fps': FPS, 'scenes': tl_scenes},
              open(os.path.join(OUT, 'timeline.json'), 'w', encoding='utf-8'), ensure_ascii=False)
    print(f'duration {t:.1f}s', file=sys.stderr)


if __name__ == '__main__':
    asyncio.run(main())
