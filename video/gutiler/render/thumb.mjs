// YouTube thumbnails for the Gutian film (1920x1080 render, also saved at 1280x720)
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)('playwright'); import path from 'path'; import fs from 'fs';
const out = '/home/user/peyvok/video/gutiler/film3/out/';
const b = await chromium.launch({ args: ['--allow-file-access-from-files'] });
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } }); p.on('pageerror', e => console.log('ERR', e.message));
await p.goto('file://' + path.resolve('film3.html')); await p.evaluate(() => window.ready);
await p.evaluate(() => {
  // big outlined text with glow
  window.bigTxt = (txt, x, y, size, fill, o = {}) => {
    X.save(); X.font = `${o.w || 900} ${size}px ${o.font || 'CinzelH'}`; X.textAlign = o.align || 'left'; X.textBaseline = 'alphabetic'; X.letterSpacing = (o.ls || 0) + 'px'; X.lineJoin = 'round';
    X.shadowColor = o.glow || 'rgba(0,0,0,.75)'; X.shadowBlur = o.blur ?? 30; X.lineWidth = o.lw || size * .12; X.strokeStyle = o.stroke || '#1a0703'; X.strokeText(txt, x, y);
    X.shadowBlur = 0; X.fillStyle = typeof fill === 'function' ? fill(y - size * .8, y) : fill; X.fillText(txt, x, y);
    if (o.lw2) { X.lineWidth = o.lw2; X.strokeStyle = o.stroke2 || '#fff6d0'; X.strokeText(txt, x, y) } X.restore()
  };
  window.hero = (x, gy, h, f = -1) => {
    const pp = { x, y: 0, f, h, torso: .02, head: -.05, ua: [.25, .1], ba: [.15, -.2], fl: [.12, -.05], bl: [-.12, -.02] }; ground(pp, gy);
    X.save(); X.shadowColor = 'rgba(255,190,60,.9)'; X.shadowBlur = 60; warriorC(X, pp, PAL.guti, { helmet: 'cone', shield: 'round', spear: 1.45, cloak: true, wind: 1.2 }); X.restore();
    X.save(); X.shadowColor = 'rgba(0,0,0,.4)'; X.shadowBlur = 10; warriorC(X, pp, PAL.guti, { helmet: 'cone', shield: 'round', spear: 1.45, cloak: true, wind: 1.2 }); X.restore()
  };
  window.ribbon = (txt, x, y, size, col = '#c8201a') => {
    X.save(); X.font = `800 ${size}px InterB`; const w = X.measureText(txt).width + size * 1.1, h = size * 1.45;
    X.shadowColor = 'rgba(0,0,0,.55)'; X.shadowBlur = 20; X.fillStyle = col; X.beginPath(); X.roundRect(x, y - h / 2, w, h, 12); X.fill(); X.shadowBlur = 0;
    X.fillStyle = '#fff'; X.textBaseline = 'middle'; X.fillText(txt, x + size * .55, y + size * .05); X.restore(); return w
  };
  window.sunburst = (cx, cy, r, a) => {
    X.save(); X.globalCompositeOperation = 'screen'; const g = X.createRadialGradient(cx, cy, 0, cx, cy, r); g.addColorStop(0, `rgba(255,214,90,${a})`); g.addColorStop(.45, `rgba(255,140,40,${a * .45})`); g.addColorStop(1, 'rgba(255,100,20,0)');
    X.fillStyle = g; X.fillRect(0, 0, W, H); X.translate(cx, cy); for (let i = 0; i < 21; i++) { X.rotate(TAU / 21); X.fillStyle = `rgba(255,220,120,${a * .22})`; X.beginPath(); X.moveTo(-30, 0); X.lineTo(0, -r * 1.3); X.lineTo(30, 0); X.fill() } X.restore()
  };
  window.darkLeft = (k = .82) => { const g = X.createLinearGradient(0, 0, W * .72, 0); g.addColorStop(0, `rgba(25,8,3,${k})`); g.addColorStop(.6, `rgba(25,8,3,${k * .55})`); g.addColorStop(1, 'rgba(25,8,3,0)'); X.fillStyle = g; X.fillRect(0, 0, W, H) };
  window.logo = () => { X.save(); X.font = '900 44px CinzelD'; X.textAlign = 'right'; X.letterSpacing = '6px'; X.lineWidth = 7; X.lineJoin = 'round'; X.strokeStyle = 'rgba(30,10,4,.8)'; X.strokeText('DÎROK', W - 46, 78); X.fillStyle = goldGrad(X, 40, 80); X.fillText('DÎROK', W - 46, 78); X.restore() };
  window.duelBG = (dx = 400) => {
    previewScene('duel', { b: 'sumer', clash: 1 }, .9); const t = mk(W, H), tc = t.getContext('2d'); tc.drawImage(document.getElementById('c'), 0, 0);
    X.setTransform(1, 0, 0, 1, 0, 0); X.drawImage(t, 0, 0); X.drawImage(t, dx, 0);
    X.save(); X.globalCompositeOperation = 'multiply'; const g = X.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#ff9a4a'); g.addColorStop(.6, '#ffc27a'); g.addColorStop(1, '#c8743a'); X.fillStyle = g; X.fillRect(0, 0, W, H); X.restore()
  };
  const gold = (a, b) => goldGrad(X, a, b);
  window.THUMBS = {
    // A: 4000 + KÜRT, warrior over glowing Gutium map
    a() {
      previewScene('map', { cam: [[0, 45.6, 34.2, 15]], show: ['akad', 'gut', 'lul'], glow: [['gut', 0]] }, 3);
      darkLeft(.86); sunburst(1480, 470, 700, .55); hero(1480, 1070, 900);
      bigTxt('4000', 60, 380, 330, gold, { lw: 26, glow: 'rgba(255,170,40,.8)', blur: 50 });
      bigTxt('YILLIK', 70, 470, 92, '#fff', { ls: 14, lw: 12 });
      bigTxt('KÜRT', 52, 760, 300, '#ffffff', { lw: 28, stroke: '#7a0f0a', glow: 'rgba(230,40,20,.9)', blur: 55 });
      bigTxt('ATALARI', 64, 880, 120, gold, { ls: 8, lw: 16 });
      ribbon('GUTİLER · MEZOPOTAMYA’YA HÜKMETTİ', 60, 985, 50);
      logo()
    },
    // B: 21 KRAL — Kürt ataları Mezopotamya'yı yönetti
    b() {
      previewScene('map', { cam: [[0, 44.6, 33.6, 17]], show: ['gut', 'lul', 'akad'], glow: [['gut', 0]] }, 3);
      darkLeft(.84); sunburst(1450, 520, 760, .6); hero(1450, 1070, 920);
      bigTxt('21', 40, 560, 560, gold, { lw: 34, glow: 'rgba(255,170,40,.85)', blur: 60 });
      bigTxt('KRAL', 600, 330, 170, '#fff', { lw: 20, ls: 6 });
      bigTxt('100 YIL', 610, 510, 120, gold, { lw: 16 });
      bigTxt('KÜRT ATALARI', 50, 800, 175, '#ffffff', { lw: 22, stroke: '#7a0f0a', glow: 'rgba(230,40,20,.9)', blur: 50 });
      bigTxt('MEZOPOTAMYA’YI YÖNETTİ', 56, 915, 88, gold, { lw: 12, ls: 2 });
      ribbon('GUTİLER · MÖ 2200', 56, 1012, 46);
      logo()
    },
    // C: question hook
    c() {
      previewScene('map', { cam: [[0, 44.0, 35.0, 21]], show: ['gut', 'lul', 'akad', 'hur', 'elam'], glow: [['gut', 0]] }, 3);
      darkLeft(.88); sunburst(1500, 500, 700, .55); hero(1500, 1070, 880);
      bigTxt('KÜRTLER', 50, 300, 230, '#fff', { lw: 24, stroke: '#7a0f0a', glow: 'rgba(230,40,20,.9)', blur: 50 });
      bigTxt('4200', 50, 620, 330, gold, { lw: 28, glow: 'rgba(255,170,40,.85)', blur: 55 });
      bigTxt('YIL ÖNCE', 60, 740, 110, '#fff', { ls: 10, lw: 14 });
      bigTxt('MEZOPOTAMYA’YA', 56, 870, 96, gold, { lw: 13 });
      bigTxt('HÜKMETTİ Mİ?', 56, 975, 96, '#ffdf6a', { lw: 13 });
      logo()
    }
    ,d() { // 4000 KÜRT + sword duel
      duelBG(420); darkLeft(.9); sunburst(1450, 250, 650, .7);
      bigTxt('4000', 60, 380, 330, gold, { lw: 26, glow: 'rgba(255,170,40,.8)', blur: 50 });
      bigTxt('YILLIK', 70, 470, 92, '#fff', { ls: 14, lw: 12 });
      bigTxt('KÜRT', 52, 760, 300, '#ffffff', { lw: 28, stroke: '#7a0f0a', glow: 'rgba(230,40,20,.9)', blur: 55 });
      bigTxt('ATALARI', 64, 880, 120, gold, { ls: 8, lw: 16 });
      ribbon('GUTİLER · MEZOPOTAMYA’YA HÜKMETTİ', 60, 985, 50); logo()
    },
    e() { // 21 KRAL + duel
      duelBG(420); darkLeft(.9); sunburst(1450, 250, 650, .7);
      bigTxt('21', 40, 560, 560, gold, { lw: 34, glow: 'rgba(255,170,40,.85)', blur: 60 });
      bigTxt('KRAL', 600, 330, 170, '#fff', { lw: 20, ls: 6 });
      bigTxt('100 YIL', 610, 510, 120, gold, { lw: 16 });
      bigTxt('KÜRT ATALARI', 50, 800, 175, '#ffffff', { lw: 22, stroke: '#7a0f0a', glow: 'rgba(230,40,20,.9)', blur: 50 });
      bigTxt('MEZOPOTAMYA’YI YÖNETTİ', 56, 915, 88, gold, { lw: 12, ls: 2 });
      ribbon('GUTİLER · MÖ 2200', 56, 1012, 46); logo()
    }
  };
});
for (const k of ['a', 'b', 'c', 'd', 'e']) {
  const d = await p.evaluate(k => { X.setTransform(1, 0, 0, 1, 0, 0); X.fillStyle = '#000'; X.fillRect(0, 0, W, H); THUMBS[k](); return document.getElementById('c').toDataURL('image/jpeg', .95) }, k);
  fs.writeFileSync(out + `kapak_${k}_1920.jpg`, Buffer.from(d.split(',')[1], 'base64')); console.log(k)
}
await b.close();
