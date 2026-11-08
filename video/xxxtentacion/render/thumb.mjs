import { createRequire } from 'module'; const { chromium } = createRequire('/home/user/peyvok/video/gutiler/render/x.js')('playwright'); import path from 'path'; import fs from 'fs';
const b = await chromium.launch({ args: ['--allow-file-access-from-files'] });
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } }); p.on('pageerror', e => console.log('ERR', e.message));
await p.goto('file://' + path.resolve('xxx.html')); await p.evaluate(() => window.ready);
const d = await p.evaluate(() => {
  SH = { t0: 0, t1: 9, T: 2, R: () => 0 };
  X.fillStyle = '#000'; X.fillRect(0, 0, W, H);
  draw3('portrait', 2, { mode: 'bust', turn: -.35, exp: 1.45, cam: [[0, [-.9, 2.3, 2.1], [-.55, 2.2, 0]]] });
  const g = X.createLinearGradient(0, 0, W, 0); g.addColorStop(0, 'rgba(4,3,8,.96)'); g.addColorStop(.42, 'rgba(4,3,8,.75)'); g.addColorStop(.62, 'rgba(4,3,8,0)'); X.fillStyle = g; X.fillRect(0, 0, W, H);
  const T = 1.234;
  txt('THE LIFE & DEATH OF', 90, 250, '800 62px InterB', '#fff', { ls: 6 });
  X.save(); X.font = '250px Anton'; X.letterSpacing = '2px'; X.globalCompositeOperation = 'lighter'; X.fillStyle = 'rgba(255,30,70,.85)'; X.fillText('XXX', 80, 520); X.fillStyle = 'rgba(30,140,255,.85)'; X.fillText('XXX', 100, 520); X.globalCompositeOperation = 'source-over'; X.shadowColor = 'rgba(0,0,0,.8)'; X.shadowBlur = 30; X.fillStyle = '#fff'; X.fillText('XXX', 90, 520);
  X.font = '170px Anton'; X.fillStyle = YEL; X.fillText('TENTACION', 90, 700); X.restore();
  X.save(); X.fillStyle = '#e8202a'; X.beginPath(); X.roundRect(90, 770, 600, 120, 16); X.fill(); X.restore(); txt('ONLY 20 YEARS OLD', 120, 852, '64px Anton', '#fff', { sh: false, ls: 2 });
  txt('1998 — 2018', 96, 980, '800 46px InterB', 'rgba(255,255,255,.85)', { ls: 10 });
  X.save(); X.globalCompositeOperation = 'overlay'; X.drawImage(GRAIN, 0, 0, W, H); X.restore();
  return cv.toDataURL('image/jpeg', .95) });
fs.writeFileSync('../out/kapak_1920.jpg', Buffer.from(d.split(',')[1], 'base64')); await b.close();
