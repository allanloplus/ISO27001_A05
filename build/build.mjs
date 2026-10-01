// 建置：腳本 → 語音（tts.py）→ 互動播放器 HTML
//   node build/build.mjs            產生語音＋HTML
//   node build/build.mjs --no-tts   只重建 HTML（沿用既有語音時間軸）
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { scenes } from '../src/scenes.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'build', 'out');
const DIST = join(ROOT, 'dist');
mkdirSync(OUT, { recursive: true }); mkdirSync(DIST, { recursive: true });

const lines = { scenes: scenes.map(s => ({ lines: s.lines.map(([spk, text, say]) => ({ spk, text, ...(say ? { say } : {}) })) })) };
writeFileSync(join(OUT, 'lines.json'), JSON.stringify(lines, null, 1));

if (!process.argv.includes('--no-tts') || !existsSync(join(OUT, 'timeline.json'))) {
  execFileSync('python3', [join(ROOT, 'build', 'tts.py')], { stdio: 'inherit' });
}
const TL = JSON.parse(readFileSync(join(OUT, 'timeline.json'), 'utf8'));
const META = scenes.map(({ chapter, stage, facet, hat }) => ({ chapter, stage, facet, hat: !!hat }));

const sceneHtml = scenes.map((s, i) => `<section class="scene" data-i="${i}"><div class="content">${s.html}</div></section>`).join('\n');
const page = readFileSync(join(ROOT, 'src', 'template.html'), 'utf8')
  .replace('<!--SCENES-->', sceneHtml)
  .replace('/*TIMELINE*/null', JSON.stringify(TL))
  .replace('/*META*/null', JSON.stringify(META));

// 發佈用（無 doctype 外框）與本機／錄影用（完整 HTML）
writeFileSync(join(DIST, 'player.html'), page);
writeFileSync(join(DIST, 'index.html'),
  `<!doctype html>\n<html lang="zh-Hant-TW">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n</head>\n<body>\n${page}\n</body>\n</html>\n`);

// 講稿（含時間碼）
const fmt = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
let md = `# ISO 27001:2022 身分與存取管理｜動畫課程講稿\n\n講師：Allan Lo（Q 版）／助教：阿拉蕾　總長 ${fmt(TL.duration)}\n\n`;
scenes.forEach((s, i) => {
  md += `## ${fmt(TL.scenes[i].start)}　${s.chapter}${s.facet && s.facet !== s.chapter ? `（${s.facet}）` : ''}\n\n`;
  TL.scenes[i].lines.forEach(l => { md += `- \`${fmt(l.start)}\` **${l.spk === 'A' ? 'Allan 老師' : '阿拉蕾'}**：${l.text}\n`; });
  md += '\n';
});
writeFileSync(join(ROOT, 'docs', '講稿.md'), md);

// SRT 字幕
let srt = '', n = 1;
const ts = s => { const ms = Math.round(s * 1000); const h = Math.floor(ms / 3600000), m = Math.floor(ms / 60000) % 60, sec = Math.floor(ms / 1000) % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')},${String(ms % 1000).padStart(3, '0')}`; };
TL.scenes.forEach(sc => sc.lines.forEach(l => l.chunks.forEach((c, k) => {
  const a = l.start + c.t, b = k + 1 < l.chunks.length ? l.start + l.chunks[k + 1].t : l.start + l.dur + 0.3;
  srt += `${n++}\n${ts(a)} --> ${ts(b)}\n${l.spk === 'A' ? 'Allan' : '阿拉蕾'}：${c.text}\n\n`;
})));
writeFileSync(join(DIST, 'subtitles.srt'), srt);
console.log(`built: ${scenes.length} scenes, ${fmt(TL.duration)}`);
