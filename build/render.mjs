// 以 Playwright 逐格擷取播放器畫面並合成 MP4（畫面與語音時間軸完全同步）
//   node build/render.mjs                    → dist/ISO27001_身分與存取管理.mp4
//   node build/render.mjs --stills 10,60,..  → build/out/still-*.png（檢查版面）
//   選項：--fps 25  --scale 1.5（1920x1080）  --workers 4  --from 0 --to 30（片段）
import { spawn, execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { readFileSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'build', 'out');
const DIST = join(ROOT, 'dist');
const require = createRequire(import.meta.url);
let pw; try { pw = require('playwright'); } catch { pw = require('/opt/node-tools/node_modules/playwright'); }

const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const FPS = +arg('fps', 25), SCALE = +arg('scale', 1.5), WORKERS = +arg('workers', 4);
const url = pathToFileURL(join(DIST, 'index.html')).href + '?capture';
const TL = JSON.parse(readFileSync(join(OUT, 'timeline.json'), 'utf8'));

async function openPage(browser) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: SCALE });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.evaluate(() => window.__ready);
  await page.waitForTimeout(300);
  return page;
}
const launch = () => pw.chromium.launch({
  proxy: process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined,
  args: ['--ignore-certificate-errors', '--font-render-hinting=none'],
});

if (arg('stills')) {
  const browser = await launch();
  const page = await openPage(browser);
  for (const s of arg('stills').split(',').map(Number)) {
    await page.evaluate(t => window.renderAt(t), s);
    await page.screenshot({ path: join(OUT, `still-${String(s).padStart(4, '0')}.png`) });
  }
  await browser.close();
  process.exit(0);
}

const from = +arg('from', 0), to = Math.min(+arg('to', TL.duration), TL.duration);
const total = Math.ceil((to - from) * FPS);
const per = Math.ceil(total / WORKERS);
const tmp = join(OUT, 'parts'); rmSync(tmp, { recursive: true, force: true }); mkdirSync(tmp, { recursive: true });
const W = Math.round(1280 * SCALE), H = Math.round(720 * SCALE);
console.log(`render ${total} frames @${FPS}fps ${W}x${H} with ${WORKERS} workers`);

const browser = await launch();
const t0 = Date.now();
await Promise.all([...Array(WORKERS).keys()].map(async w => {
  const a = w * per, b = Math.min(total, a + per);
  if (a >= b) return;
  const page = await openPage(browser);
  const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-c:v', 'mjpeg', '-framerate', String(FPS), '-i', '-',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '25', '-tune', 'animation', '-pix_fmt', 'yuv420p', '-r', String(FPS), join(tmp, `p${w}.mp4`)], { stdio: ['pipe', 'inherit', 'inherit'] });
  for (let f = a; f < b; f++) {
    await page.evaluate(t => window.renderAt(t), from + f / FPS);
    const buf = await page.screenshot({ type: 'jpeg', quality: 92 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (w === 0 && (f - a) % 250 === 0) console.log(`  worker0 ${f - a}/${b - a}  ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
}));
await browser.close();

writeFileSync(join(tmp, 'list.txt'), [...Array(WORKERS).keys()].map(w => `file 'p${w}.mp4'`).join('\n'));
const outName = arg('out', from === 0 && to === TL.duration ? 'ISO27001_身分與存取管理.mp4' : `clip_${from}-${to}.mp4`);
execFileSync('ffmpeg', ['-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', join(tmp, 'list.txt'),
  '-ss', String(from), '-t', String(to - from), '-i', join(DIST, 'narration.mp3'),
  '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '128k', '-shortest', '-movflags', '+faststart', join(DIST, outName)], { stdio: 'inherit' });
console.log(`done → dist/${outName} in ${((Date.now() - t0) / 1000).toFixed(0)}s`);
