#!/usr/bin/env python3
"""
從角色設定圖切出動畫素材 → dist/img/
  assets/characters/allan-sheet.jpg  Allan Lo 講師（正面全身＋8 種表情）
  assets/characters/arale-sheet.jpg  阿拉蕾 AI 小助手（全身＋8 種表情）

輸出：
  allan.png / allan-mouth.png   全身（去背）＋ 張嘴圖層（對嘴用）
  arale.png / arale-mouth.png   全身（嘴巴補成閉合）＋ 原圖張嘴圖層
  face-allan-<表情>.png、face-arale-<表情>.png   字幕頭像
"""
import os
from PIL import Image, ImageChops, ImageDraw, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'assets', 'characters')
OUT = os.path.join(ROOT, 'dist', 'img')
os.makedirs(OUT, exist_ok=True)

ALLAN_FULL = (80, 85, 775, 1465)
ARALE_FULL = (70, 800, 410, 1475)
ALLAN_FACES = {  # 表情包座標
    'smile': (765, 795, 1020, 1120), 'laugh': (1075, 795, 1330, 1120), 'think': (1380, 795, 1640, 1120),
    'scratch': (1640, 795, 1965, 1120), 'surprise': (765, 1135, 1020, 1465), 'point': (1045, 1135, 1330, 1465),
    'wink': (1385, 1135, 1640, 1465), 'talk': (1700, 1135, 1955, 1465),
}
_c = [(441, 1192), (828, 1179), (1215, 1565), (1598, 1950)]
ARALE_FACES = {}
for i, k in enumerate(['laugh', 'think', 'surprise', 'confused', 'explain', 'cry', 'wink', 'cheer']):
    x0, x1 = _c[i % 4]
    y0, y1 = (813, 1111) if i < 4 else (1146, 1445)
    ARALE_FACES[k] = (x0, y0, x1, y1)


def cutout(img, thresh=38):
    """自四邊以近白色做 flood fill 去背（角色有粗黑外框，填色會停在線上）"""
    im = img.convert('RGB').copy()
    key = (255, 0, 255)
    w, h = im.size
    px = im.load()
    edge = [(x, 0) for x in range(w)] + [(x, h - 1) for x in range(w)] + [(0, y) for y in range(h)] + [(w - 1, y) for y in range(h)]
    for p in edge:
        r, g, b = px[p]
        if px[p] != key and min(r, g, b) > 215:
            ImageDraw.floodfill(im, p, key, thresh=thresh)
    mask = Image.new('L', (w, h), 255)
    mp = mask.load()
    for y in range(h):
        for x in range(w):
            if px[x, y] == key:
                mp[x, y] = 0
    # 只保留角色本體（移除鄰近圖稿的碎片）：從畫面中心往下找第一個不透明點做 flood fill
    keep = mask.copy()
    seed = next((w // 2, y) for y in range(h // 3, h) if mp[w // 2, y] == 255)
    ImageDraw.floodfill(keep, seed, 128)
    mask = keep.point(lambda v: 255 if v == 128 else 0)
    mask = mask.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.8))
    out = img.convert('RGBA')
    out.putalpha(mask)
    return out


def bez(p0, c, p1, n=40):
    return [((1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * c[0] + t * t * p1[0],
             (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * c[1] + t * t * p1[1]) for t in (i / n for i in range(n + 1))]


def allan():
    sheet = Image.open(os.path.join(SRC, 'allan-sheet.jpg'))
    body = cutout(sheet.crop(ALLAN_FULL))
    W, H = body.size
    # 張嘴圖層：沿原本微笑線畫一個卡通嘴（4 倍超取樣抗鋸齒）
    S = 4
    L, R, Y = (212, 281), (332, 280), 281
    top = bez(L, (272, 300), R)            # 蓋住原微笑線
    bot = bez(R, (272, 382), L)            # 下緣
    sc = lambda pts: [(x * S, y * S) for x, y in pts]
    lay = Image.new('RGBA', (W * S, H * S), (0, 0, 0, 0))
    d = ImageDraw.Draw(lay)
    d.polygon(sc(top + bot), fill=(92, 20, 34, 255))
    m = Image.new('L', lay.size, 0); ImageDraw.Draw(m).polygon(sc(top + bot), fill=255)
    inner = Image.new('RGBA', lay.size, (0, 0, 0, 0)); di = ImageDraw.Draw(inner)
    di.polygon(sc(top + [(x, y + 11) for x, y in reversed(top)]), fill=(255, 255, 255, 255))      # 上排牙齒
    di.ellipse([(250 * S, 312 * S), (296 * S, 340 * S)], fill=(240, 110, 125, 255))                # 舌頭
    lay.paste(inner, (0, 0), ImageChops.multiply(inner.split()[3], m))
    d.line(sc(top + bot + [top[0]]), fill=(25, 25, 30, 255), width=5 * S, joint='curve')
    lay = lay.resize((W, H), Image.LANCZOS)
    return body, lay, (272 / W, 284 / H)


def arale():
    sheet = Image.open(os.path.join(SRC, 'arale-sheet.jpg'))
    body = cutout(sheet.crop(ARALE_FULL))
    W, H = body.size
    S = 4
    big = body.resize((W * S, H * S), Image.LANCZOS)
    # 原本張開的嘴 → 張嘴圖層（橢圓遮罩）
    box = (159, 164, 207, 192)
    mask = Image.new('L', big.size, 0)
    ImageDraw.Draw(mask).ellipse([v * S for v in (161, 166, 205, 190)], fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(S * 0.5))
    mouth = Image.new('RGBA', big.size, (0, 0, 0, 0))
    mouth.paste(big, (0, 0), mask)
    # 本體：以嘴巴周圍膚色（環狀取樣平均）補平，邊緣羽化，再畫一條閉合微笑
    cx, cy, rx, ry = (box[0] + box[2]) / 2 * S, (box[1] + box[3]) / 2 * S, (box[2] - box[0]) / 2 * S, (box[3] - box[1]) / 2 * S
    ring = []
    for i in range(72):
        import math
        a = i / 72 * 2 * math.pi
        px_ = big.getpixel((int(cx + (rx + 3 * S) * math.cos(a)), int(cy + (ry + 3 * S) * math.sin(a))))
        if px_[3] > 200 and sum(px_[:3]) > 450: ring.append(px_[:3])
    skin = tuple(sorted(c[k] for c in ring)[len(ring) // 2] for k in range(3))
    patch = Image.new('RGBA', big.size, skin + (255,))
    pm = Image.new('L', big.size, 0)
    ImageDraw.Draw(pm).ellipse([(box[0] - 2) * S, (box[1] - 2) * S, (box[2] + 2) * S, (box[3] + 2) * S], fill=255)
    pm = pm.filter(ImageFilter.GaussianBlur(S * 1.6))
    closed = big.copy()
    closed.paste(patch, (0, 0), pm)
    closed.putalpha(big.split()[3])
    dc = ImageDraw.Draw(closed)
    dc.line([(x * S, y * S) for x, y in bez((170, 174), (183, 184), (197, 173))], fill=(60, 35, 40, 255), width=3 * S, joint='curve')
    return closed.resize((W, H), Image.LANCZOS), mouth.resize((W, H), Image.LANCZOS), (183 / W, 166 / H)


def fit(im, h):
    return im.resize((round(im.width * h / im.height), h), Image.LANCZOS)


if __name__ == '__main__':
    meta = {}
    for name, fn, h in (('allan', allan, 720), ('arale', arale, 480)):
        body, mouth, origin = fn()
        fit(body, h).save(os.path.join(OUT, f'{name}.png'), optimize=True)
        fit(mouth, h).save(os.path.join(OUT, f'{name}-mouth.png'), optimize=True)
        meta[name] = {'origin': origin, 'aspect': body.width / body.height}
    for who, faces in (('allan', ALLAN_FACES), ('arale', ARALE_FACES)):
        sheet = Image.open(os.path.join(SRC, f'{who}-sheet.jpg')).convert('RGB')
        for k, b in faces.items():
            im = sheet.crop(b)
            s = min(im.size)  # 置中裁成正方形（偏上，保留臉）
            x0 = (im.width - s) // 2
            im = im.crop((x0, 0, x0 + s, s)).resize((220, 220), Image.LANCZOS)
            im.save(os.path.join(OUT, f'face-{who}-{k}.jpg'), quality=88)
    print(meta)
