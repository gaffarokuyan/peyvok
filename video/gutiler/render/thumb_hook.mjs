// Hook thumbnails (16:9) for the Annazids film: Kürt + Mezopotamya + year
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)('playwright'); import path from 'path'; import fs from 'fs';
const out = '/home/user/peyvok/video/annaziler/out/'; const b = await chromium.launch({ args: ['--allow-file-access-from-files'] });
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } }); p.on('pageerror', e => console.log('ERR', e.message));
await p.goto('file://' + path.resolve('annazi.html')); await p.evaluate(() => window.ready);
await p.evaluate(async () => { const f = [new FontFace('Anton', 'url(../../alamut/fonts/anton-latin-400-normal.woff2)'), new FontFace('Anton', 'url(../../alamut/fonts/anton-latin-ext-400-normal.woff2)', { unicodeRange: 'U+0100-024F,U+1E00-1EFF' })]; for (const x of f) { document.fonts.add(x); await x.load() } });
for (const v of (process.env.V || 'a,b,c').split(',')) {
  const d = await p.evaluate(v => {
    const c = X; const lb = labelBoxB; labelBoxB = () => { };
    const bgT = { a: 367.55, b: 280, c: 19 }[v]; renderFrame(bgT); labelBoxB = lb;
    const src = document.createElement('canvas'); src.width = W; src.height = H; src.getContext('2d').drawImage(cv, 0, 0);
    c.setTransform(1, 0, 0, 1, 0, 0); c.fillStyle = '#100604'; c.fillRect(0, 0, W, H); c.filter = 'saturate(1.4) contrast(1.12) brightness(1.05)';
    if (v === 'a') c.drawImage(src, 0, 0, 1690, 1060, -150, -40, 1690 * 1.23, 1060 * 1.23);
    if (v === 'b') c.drawImage(src, 0, 0, 1880, 1060, -80, -60, W * 1.12, H * 1.12);
    if (v === 'c') { c.save(); c.translate(W, 0); c.scale(-1, 1); c.drawImage(src, 40, 330, 1500, 700, 0, 0, W, H); c.restore() }
    c.filter = 'none';
    if (v === 'a') { c.save(); c.globalCompositeOperation = 'multiply'; const wg = c.createLinearGradient(0, 0, 0, H); wg.addColorStop(0, '#ff7a40'); wg.addColorStop(1, '#ffc090'); c.fillStyle = wg; c.fillRect(0, 0, W, H); c.restore() }
    const g = c.createLinearGradient(0, 0, W, 0); g.addColorStop(0, 'rgba(14,4,2,.95)'); g.addColorStop(.42, 'rgba(14,4,2,.75)'); g.addColorStop(.62, 'rgba(14,4,2,0)'); c.fillStyle = g; c.fillRect(0, 0, W, H);
    const vg = c.createRadialGradient(W / 2, H / 2, H * .4, W / 2, H / 2, H * 1.1); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.55)'); c.fillStyle = vg; c.fillRect(0, 0, W, H);
    // portrait (a,b)
    if (v !== 'c') { c.save(); const rg = c.createRadialGradient(1520, 600, 0, 1520, 600, 600); rg.addColorStop(0, 'rgba(255,160,50,.55)'); rg.addColorStop(1, 'rgba(255,90,20,0)'); c.fillStyle = rg; c.fillRect(0, 0, W, H); c.shadowColor = 'rgba(0,0,0,.85)'; c.shadowBlur = 60; drawPortrait('emir', 1530, 660, 1.2, .6, { light: 1.25 }); c.restore() }
    const PAL = { g: ['#fff8cf', '#ffd65a', '#f29a1c', '#c4620a'], r: ['#fff0e8', '#ff7a5a', '#e8281a', '#8a1006'], w: ['#ffffff', '#ffffff', '#f2ece0', '#d8cfc0'] };
    const T = (s, x, y, size, k, maxW = 1150, o = {}) => { c.save(); c.font = `${size}px Anton`; let sz = size; while (c.measureText(s).width > maxW) { sz -= 4; c.font = `${sz}px Anton` } c.textAlign = o.al || 'left'; c.lineJoin = 'round'; c.letterSpacing = (o.ls || 0) + 'px';
      c.shadowColor = o.glow || 'rgba(0,0,0,.9)'; c.shadowBlur = o.blur ?? 40; c.lineWidth = sz * .12; c.strokeStyle = o.stroke || '#140502'; c.strokeText(s, x, y); c.shadowBlur = 0;
      const gg = c.createLinearGradient(0, y - sz * .82, 0, y); PAL[k].forEach((q, i) => gg.addColorStop(i / 3, q)); c.fillStyle = gg; c.fillText(s, x, y); c.restore() };
    const pill = (s, x, y, size = 54, col = '#d0181e') => { c.save(); c.font = `${size}px Anton`; c.letterSpacing = '3px'; const w = c.measureText(s).width + 70; c.shadowColor = 'rgba(0,0,0,.6)'; c.shadowBlur = 24; c.fillStyle = col; c.beginPath(); c.roundRect(x, y - size * .9, w, size * 1.6, 16); c.fill(); c.shadowBlur = 0; c.fillStyle = '#fff'; c.textBaseline = 'middle'; c.fillText(s, x + 35, y - size * .1); c.restore() };
    if (v === 'a') {
      pill('1000 YIL ÖNCE', 66, 150, 66);
      T('MEZOPOTAMYA’NIN', 60, 345, 150, 'w', 1150);
      T('KAPISI', 60, 600, 290, 'g', 1150, { glow: 'rgba(255,160,40,.9)', blur: 70 });
      T('KÜRTLERDEYDİ', 60, 830, 205, 'r', 1150, { glow: 'rgba(230,30,10,.9)', blur: 70 });
      T('ANNAZÎLER · 990 – 1117', 66, 985, 80, 'g', 1100) }
    if (v === 'b') {
      T('BAĞDAT’IN ANAHTARI', 60, 200, 140, 'w', 1150);
      T('130 YIL', 60, 500, 300, 'g', 1150, { glow: 'rgba(255,160,40,.9)', blur: 70 });
      T('KÜRTLERDEYDİ', 60, 730, 205, 'r', 1150, { glow: 'rgba(230,30,10,.9)', blur: 70 });
      pill('MEZOPOTAMYA · 990 – 1117', 66, 900, 62) }
    if (v === 'c') {
      T('990 – 1117', 60, 190, 150, 'g', 1300, { glow: 'rgba(255,160,40,.9)', blur: 60 });
      T('MEZOPOTAMYA’YI', 60, 420, 200, 'w', 1300);
      T('KÜRT SÜVARİLERİ', 60, 650, 210, 'r', 1500, { glow: 'rgba(230,30,10,.9)', blur: 70 });
      T('KORUDU', 60, 900, 230, 'g', 1300, { glow: 'rgba(255,160,40,.9)', blur: 70 });
      pill('ANNAZÎLER', 1430, 960, 70) }
    c.save(); c.font = '900 64px CinzelD'; c.textAlign = 'right'; c.letterSpacing = '8px'; c.lineWidth = 8; c.strokeStyle = '#1a0703'; c.strokeText('DÎROK', W - 50, 100); const gg = c.createLinearGradient(0, 50, 0, 100); gg.addColorStop(0, '#fff3b0'); gg.addColorStop(1, '#c4820e'); c.fillStyle = gg; c.fillText('DÎROK', W - 50, 100); c.restore();
    return cv.toDataURL('image/jpeg', .95) }, v);
  fs.writeFileSync(out + `kapak_hook_${v}_1920.jpg`, Buffer.from(d.split(',')[1], 'base64'));
}
await b.close();
