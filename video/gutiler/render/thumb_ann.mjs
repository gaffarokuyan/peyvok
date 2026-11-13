// YouTube thumbnail for the Annazids film (TR)
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)('playwright'); import path from 'path'; import fs from 'fs';
const out = '/home/user/peyvok/video/annaziler/out/'; fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch({ args: ['--allow-file-access-from-files'] });
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } }); p.on('pageerror', e => console.log('ERR', e.message));
await p.goto('file://' + path.resolve('annazi.html')); await p.evaluate(() => window.ready);
const d = await p.evaluate(() => {
  const lb = labelBoxB; labelBoxB = () => { }; renderFrame(192.3); labelBoxB = lb;
  const src = document.createElement('canvas'); src.width = W; src.height = H; src.getContext('2d').drawImage(cv, 0, 0);
  const c = X; c.setTransform(1, 0, 0, 1, 0, 0); c.fillStyle = '#100604'; c.fillRect(0, 0, W, H);
  c.filter = 'saturate(1.35) brightness(1.08) contrast(1.1)'; c.drawImage(src, 0, 0, 1880, 1060, -150, -60, W * 1.16, H * 1.16); c.filter = 'none';
  // fiery sky tint
  c.save(); c.globalCompositeOperation = 'multiply'; const wg = c.createLinearGradient(0, 0, 0, H); wg.addColorStop(0, '#ff8a50'); wg.addColorStop(.5, '#ffd0a0'); wg.addColorStop(1, '#e0a070'); c.fillStyle = wg; c.fillRect(0, 0, W, H); c.restore();
  const g = c.createLinearGradient(0, 0, W, 0); g.addColorStop(0, 'rgba(20,5,3,.93)'); g.addColorStop(.42, 'rgba(20,5,3,.7)'); g.addColorStop(.62, 'rgba(20,5,3,0)'); c.fillStyle = g; c.fillRect(0, 0, W, H);
  // emir portrait right
  c.save(); const rg = c.createRadialGradient(1500, 560, 0, 1500, 560, 620); rg.addColorStop(0, 'rgba(255,170,60,.55)'); rg.addColorStop(1, 'rgba(255,90,20,0)'); c.fillStyle = rg; c.fillRect(0, 0, W, H); c.restore();
  c.save(); c.shadowColor = 'rgba(0,0,0,.8)'; c.shadowBlur = 60; drawPortrait('emir', 1490, 640, 1.15, 0.6, { light: 1.2 }); c.restore();
  const gold = (y0, y1) => { const gg = c.createLinearGradient(0, y0, 0, y1); gg.addColorStop(0, '#fff3b0'); gg.addColorStop(.45, '#f2c14e'); gg.addColorStop(.75, '#b8801e'); gg.addColorStop(1, '#ffe08a'); return gg };
  const T = (txt, x, y, size, fill, o = {}) => { c.save(); c.font = `900 ${size}px CinzelH`; c.textAlign = 'left'; c.letterSpacing = (o.ls || 0) + 'px'; c.lineJoin = 'round';
    let sz = size; while (o.maxW && c.measureText(txt).width > o.maxW) { sz -= 4; c.font = `900 ${sz}px CinzelH` }
    c.shadowColor = o.glow || 'rgba(0,0,0,.85)'; c.shadowBlur = o.blur ?? 40; c.lineWidth = (o.lw || size * .13) * sz / size; c.strokeStyle = o.stroke || '#1a0703'; c.strokeText(txt, x, y); c.shadowBlur = 0;
    c.fillStyle = fill === 'gold' ? gold(y - sz * .8, y) : fill; c.fillText(txt, x, y); c.restore() };
  const pill = (txt, x, y, size = 46) => { c.save(); c.font = `800 ${size}px InterB`; c.letterSpacing = '2px'; const w = c.measureText(txt).width + 64; c.shadowColor = 'rgba(0,0,0,.6)'; c.shadowBlur = 20; c.fillStyle = '#c4161c'; c.beginPath(); c.roundRect(x, y - size * .85, w, size * 1.7, 18); c.fill(); c.shadowBlur = 0; c.fillStyle = '#fff'; c.textBaseline = 'middle'; c.fillText(txt, x + 32, y + 2); c.restore() };
  T('UNUTULAN', 60, 230, 130, '#fff', { lw: 16 });
  T('KÜRT EMİRLİĞİ', 60, 400, 150, 'gold', { lw: 18, glow: 'rgba(255,170,40,.8)', blur: 55, maxW: 1150 });
  T('ANNAZÎLER', 60, 640, 220, '#fff', { lw: 28, stroke: '#7a0f0a', glow: 'rgba(230,40,20,.95)', blur: 70, maxW: 1200 });
  T('130 YIL ZAGROS KAPISI', 66, 810, 92, 'gold', { lw: 12, maxW: 1150 });
  pill('990 – 1117 · HULVAN · DİNEVER', 66, 975);
  c.save(); c.font = '900 64px CinzelD'; c.textAlign = 'right'; c.letterSpacing = '8px'; c.lineWidth = 8; c.strokeStyle = '#1a0703'; c.strokeText('DÎROK', W - 50, 100); c.fillStyle = gold(50, 100); c.fillText('DÎROK', W - 50, 100); c.restore();
  return cv.toDataURL('image/jpeg', .95);
});
fs.writeFileSync(out + 'kapak_1920.jpg', Buffer.from(d.split(',')[1], 'base64')); await b.close();
