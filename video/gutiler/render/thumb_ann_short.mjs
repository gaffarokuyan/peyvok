import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)('playwright'); import path from 'path'; import fs from 'fs';
const out = '/home/user/peyvok/video/annaziler/short/';
const b = await chromium.launch({ args: ['--allow-file-access-from-files'] }); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } }); p.on('pageerror', e => console.log('ERR', e.message));
await p.goto('file://' + path.resolve('annazi_short.html')); await p.evaluate(() => window.ready);
const info = await p.evaluate(() => ({ sfx: window.SFXV, total: TL.total }));
fs.writeFileSync(out + 'sfx.json', JSON.stringify(info));
const d = await p.evaluate(() => {
  renderFrame(23.9); const V = document.getElementById('v'), c = V.getContext('2d'), W = 1080, H = 1920;
  const g0 = c.createLinearGradient(0, 0, 0, 900); g0.addColorStop(0, 'rgba(10,4,2,1)'); g0.addColorStop(.5, 'rgba(10,4,2,.97)'); g0.addColorStop(1, 'rgba(10,4,2,0)'); c.fillStyle = g0; c.fillRect(0, 0, W, 900);
  const g = c.createLinearGradient(0, 1250, 0, H); g.addColorStop(0, 'rgba(10,4,2,0)'); g.addColorStop(.3, 'rgba(10,4,2,1)'); g.addColorStop(1, 'rgba(10,4,2,1)'); c.fillStyle = g; c.fillRect(0, 1250, W, H - 1250);
  const gold = (y0, y1) => { const gg = c.createLinearGradient(0, y0, 0, y1); gg.addColorStop(0, '#fff8cf'); gg.addColorStop(.35, '#ffd65a'); gg.addColorStop(.7, '#f29a1c'); gg.addColorStop(1, '#c4620a'); return gg };
  const red = (y0, y1) => { const gg = c.createLinearGradient(0, y0, 0, y1); gg.addColorStop(0, '#fff0e8'); gg.addColorStop(.4, '#ff8a6a'); gg.addColorStop(.75, '#e8321e'); gg.addColorStop(1, '#9a1408'); return gg };
  const T = (s, y, size, f) => { c.save(); c.font = `${size}px Anton`; let sz = size; while (c.measureText(s).width > 1000) { sz -= 4; c.font = `${sz}px Anton` } c.textAlign = 'center'; c.lineJoin = 'round'; c.shadowColor = 'rgba(0,0,0,.8)'; c.shadowBlur = 40; c.lineWidth = sz * .14; c.strokeStyle = '#1a0703'; c.strokeText(s, W / 2, y); c.shadowBlur = 0; c.fillStyle = f(y - sz * .8, y); c.fillText(s, W / 2, y); c.restore() };
  T('BAĞDAT’IN', 230, 190, gold); T('ANAHTARI', 420, 190, gold);
  T('KÜRTLERDEYDİ', 1500, 175, red); T('ANNAZÎLER', 1690, 150, gold);
  c.save(); c.font = '50px Anton'; c.textAlign = 'center'; c.fillStyle = '#fff'; c.lineWidth = 9; c.strokeStyle = '#120804'; c.lineJoin = 'round'; c.strokeText('UNUTTURULMAYA ÇALIŞILMIŞ KÜRT EMİRLİĞİ', W / 2, 1800); c.fillText('UNUTTURULMAYA ÇALIŞILMIŞ KÜRT EMİRLİĞİ', W / 2, 1800); c.restore();
  c.save(); c.font = '900 44px CinzelD'; c.textAlign = 'center'; c.fillStyle = gold(1840, 1880); c.fillText('DÎROK', W / 2, 1880); c.restore();
  return V.toDataURL('image/jpeg', .95) });
fs.writeFileSync(out + 'out/kapak_short.jpg', Buffer.from(d.split(',')[1], 'base64')); await b.close();
