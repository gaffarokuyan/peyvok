// YouTube 16:9 A/B thumbnails for the Kassites film (TR)
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)('playwright'); import path from 'path'; import fs from 'fs';
const out = '/home/user/peyvok/video/kassitler/out/'; fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch({ args: ['--allow-file-access-from-files'] });
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } }); p.on('pageerror', e => console.log('ERR', e.message));
await p.goto('file://' + path.resolve('kassit_nocap.html')); await p.evaluate(() => window.ready);
for (const v of (process.env.V||'a,b,c').split(',')) {
  const d = await p.evaluate(v => {
    SH = { t0: 0, t1: 30, T: 4.2, R: q => typeof q === 'number' ? q : 0, ch: null }; const lb = labelBoxB; labelBoxB = () => { };
    G3.rd.toneMappingExposure = 1.6;
    if (v === 'c') s3dTerrain(1, { cam: [[0, 45.6, 32.2, 30, 47.4, 34.6]], pins: [] }); else s3dHero(0, {});
    G3.rd.toneMappingExposure = 1.05; labelBoxB = lb;
    const src = document.createElement('canvas'); src.width = W; src.height = H; src.getContext('2d').drawImage(cv, 0, 0);
    const c = X; c.setTransform(1, 0, 0, 1, 0, 0);
    c.fillStyle = '#1a0a08'; c.fillRect(0, 0, W, H);
    c.filter = 'saturate(1.3) brightness(1.1) contrast(1.08)';
    c.save(); c.filter = 'blur(30px) saturate(1.3)'; c.drawImage(src, -200, -120, W * 1.25, H * 1.25); c.restore(); c.filter = 'saturate(1.3) brightness(1.1) contrast(1.08)';
    if (v === 'c') c.drawImage(src, 0, 0, W, H); else if (v === 'a') c.drawImage(src, 380, 30, W * .97, H * .97); else c.drawImage(src, 20, -250, W * 1.3, H * 1.3);
    c.filter = 'none';
    if (v === 'c') { c.save(); c.globalCompositeOperation = 'multiply'; const wg = c.createLinearGradient(0, 0, 0, H); wg.addColorStop(0, '#ff9a5a'); wg.addColorStop(.35, '#ffc890'); wg.addColorStop(1, '#e8b080'); c.fillStyle = wg; c.fillRect(0, 0, W, H); c.restore(); const sk = c.createLinearGradient(0, 0, 0, 470); sk.addColorStop(0, 'rgba(60,24,70,1)'); sk.addColorStop(.55, 'rgba(200,80,50,.95)'); sk.addColorStop(.88, 'rgba(255,170,80,.85)'); sk.addColorStop(1, 'rgba(255,190,110,0)'); c.fillStyle = sk; c.fillRect(0, 0, W, 470) }
    // warm left gradient for text
    const g = c.createLinearGradient(0, 0, W, 0); g.addColorStop(0, 'rgba(24,6,4,.92)'); g.addColorStop(.38, 'rgba(24,6,4,.72)'); g.addColorStop(.58, 'rgba(24,6,4,0)'); c.fillStyle = g; c.fillRect(0, 0, W, H);
    // sun glow
    c.save(); c.globalCompositeOperation = 'screen'; const rg = c.createRadialGradient(560, 420, 0, 560, 420, 900); rg.addColorStop(0, 'rgba(255,170,60,.35)'); rg.addColorStop(1, 'rgba(255,90,20,0)'); c.fillStyle = rg; c.fillRect(0, 0, W, H);
    c.translate(560, 420); for (let i = 0; i < 18; i++) { c.rotate(TAU / 18); c.fillStyle = 'rgba(255,215,110,.045)'; c.beginPath(); c.moveTo(-40, 0); c.lineTo(0, -1400); c.lineTo(40, 0); c.fill() } c.restore();
    const gold = (y0, y1) => { const gg = c.createLinearGradient(0, y0, 0, y1); gg.addColorStop(0, '#fff3b0'); gg.addColorStop(.45, '#f2c14e'); gg.addColorStop(.75, '#b8801e'); gg.addColorStop(1, '#ffe08a'); return gg };
    const T = (txt, x, y, size, fill, o = {}) => { c.save(); c.font = `900 ${size}px CinzelH`; c.textAlign = o.al || 'left'; c.letterSpacing = (o.ls || 0) + 'px'; c.lineJoin = 'round';
      let sz = size; while (o.maxW && c.measureText(txt).width > o.maxW) { sz -= 4; c.font = `900 ${sz}px CinzelH` }
      c.shadowColor = o.glow || 'rgba(0,0,0,.85)'; c.shadowBlur = o.blur ?? 40; c.lineWidth = o.lw || sz * .13; c.strokeStyle = o.stroke || '#1a0703'; c.strokeText(txt, x, y); c.shadowBlur = 0;
      c.fillStyle = fill === 'gold' ? gold(y - sz * .8, y) : fill; c.fillText(txt, x, y); c.restore() };
    const pill = (txt, x, y, size = 46) => { c.save(); c.font = `800 ${size}px InterB`; c.letterSpacing = '2px'; const w = c.measureText(txt).width + 64; c.shadowColor = 'rgba(0,0,0,.6)'; c.shadowBlur = 20; c.fillStyle = '#c4161c'; c.beginPath(); c.roundRect(x, y - size * .85, w, size * 1.7, 18); c.fill(); c.shadowBlur = 0; c.fillStyle = '#fff'; c.textBaseline = 'middle'; c.fillText(txt, x + 32, y + 2); c.restore() };
    if (v === 'a') {
      T('430', 60, 420, 400, 'gold', { lw: 30, glow: 'rgba(255,170,40,.9)', blur: 70 });
      T('YIL', 860, 250, 150, '#fff', { lw: 18 });
      T('TAHTTA', 860, 405, 118, 'gold', { lw: 16, glow: 'rgba(255,170,40,.8)', blur: 50 });
      T('KÜRT ATALARI', 60, 690, 190, '#fff', { lw: 26, stroke: '#7a0f0a', glow: 'rgba(230,40,20,.95)', blur: 70, maxW: 1500 });
      T('BABİL’İ YÖNETTİ', 66, 840, 120, 'gold', { lw: 16, maxW: 1200 });
      pill('KASSİTLER · MÖ 1595–1155', 66, 980);
    } else if (v === 'c') {
      T('36', 60, 430, 420, 'gold', { lw: 30, glow: 'rgba(255,170,40,.9)', blur: 70 });
      T('KRAL', 600, 260, 170, '#fff', { lw: 20 });
      T('ZAGROS’TAN', 600, 410, 104, 'gold', { lw: 14, glow: 'rgba(255,170,40,.8)', blur: 40 });
      T('BABİL TAHTINDA', 60, 660, 150, '#fff', { lw: 22, maxW: 1500 });
      T('KÜRT ATALARI', 60, 850, 190, '#fff', { lw: 26, stroke: '#7a0f0a', glow: 'rgba(230,40,20,.95)', blur: 70, maxW: 1500 });
      pill('KASSİTLER · MÖ 1595', 66, 985);
    } else {
      T('KASSİTLER', 60, 300, 220, 'gold', { lw: 26, glow: 'rgba(255,170,40,.9)', blur: 70, maxW: 1300 });
      T('KÜRTLERİN', 64, 480, 140, '#fff', { lw: 18 });
      T('3600 YILLIK', 64, 640, 150, 'gold', { lw: 18, glow: 'rgba(255,170,40,.7)', blur: 50 });
      T('ATASI', 64, 840, 230, '#fff', { lw: 30, stroke: '#7a0f0a', glow: 'rgba(230,40,20,.95)', blur: 70 });
      pill('36 KRAL · BABİL TAHTINDA', 66, 985);
    }
    c.save(); c.font = '900 64px CinzelD'; c.textAlign = 'right'; c.letterSpacing = '8px'; c.lineWidth = 8; c.strokeStyle = '#1a0703'; c.strokeText('DÎROK', W - 50, 100); c.fillStyle = gold(50, 100); c.fillText('DÎROK', W - 50, 100); c.restore();
    return cv.toDataURL('image/jpeg', .95);
  }, v);
  fs.writeFileSync(out + `kapak_${v}_1920.jpg`, Buffer.from(d.split(',')[1], 'base64'));
}
await b.close();
