// Vertical (1080x1920) cover for the Gutian Short — same design as the main "4000 YILLIK KÜRT ATALARI" thumbnail
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)('playwright'); import path from 'path'; import fs from 'fs';
const out = '/home/user/peyvok/video/gutiler/short2/out/';
const b = await chromium.launch({ args: ['--allow-file-access-from-files'] });
const p = await b.newPage({ viewport: { width: 1080, height: 1920 } }); p.on('pageerror', e => console.log('ERR', e.message));
await p.goto('file://' + path.resolve('shortg.html')); await p.evaluate(() => window.ready);
const d = await p.evaluate(() => {
  const ctx = VX; ctx.setTransform(1, 0, 0, 1, 0, 0);
  // duel frame rendered in the 16:9 engine canvas, cropped to fill the vertical frame
  const main = X; X = cv.getContext('2d'); X.setTransform(1, 0, 0, 1, 0, 0); SH = { t0: 0, t1: 30, T: .95, R: q => typeof q === 'number' ? q : 1, ch: null };
  X.save(); sDuel(.95, { b: 'sumer', clash: 1 }); X.restore(); X = main;
  const s = VH / H; ctx.save(); ctx.filter = 'blur(22px)'; ctx.drawImage(cv, VW / 2 - W * s / 2, 0, W * s, H * s); ctx.restore(); const f = 1.15; ctx.drawImage(cv, VW / 2 - 960 * f - 20, VH - H * f + 40, W * f, H * f);
  ctx.save(); ctx.globalCompositeOperation = 'multiply'; const g = ctx.createLinearGradient(0, 0, 0, VH); g.addColorStop(0, '#ff9a4a'); g.addColorStop(.6, '#ffc27a'); g.addColorStop(1, '#c8743a'); ctx.fillStyle = g; ctx.fillRect(0, 0, VW, VH); ctx.restore();
  const dg = ctx.createLinearGradient(0, 0, 0, VH); dg.addColorStop(0, 'rgba(25,8,3,.92)'); dg.addColorStop(.45, 'rgba(25,8,3,.6)'); dg.addColorStop(.62, 'rgba(25,8,3,0)'); ctx.fillStyle = dg; ctx.fillRect(0, 0, VW, VH);
  // sunburst
  ctx.save(); ctx.globalCompositeOperation = 'screen'; const cx = 620, cy = 1250; const rg = ctx.createRadialGradient(cx, cy, 0, cx, cy, 700); rg.addColorStop(0, 'rgba(255,214,90,.6)'); rg.addColorStop(.5, 'rgba(255,140,40,.25)'); rg.addColorStop(1, 'rgba(255,100,20,0)'); ctx.fillStyle = rg; ctx.fillRect(0, 0, VW, VH);
  ctx.translate(cx, cy); for (let i = 0; i < 21; i++) { ctx.rotate(TAU / 21); ctx.fillStyle = 'rgba(255,220,120,.12)'; ctx.beginPath(); ctx.moveTo(-30, 0); ctx.lineTo(0, -900); ctx.lineTo(30, 0); ctx.fill() } ctx.restore();
  const big = (txt, y, size, fill, o = {}) => { ctx.save(); ctx.font = `900 ${size}px CinzelH`; ctx.textAlign = 'center'; ctx.letterSpacing = (o.ls || 0) + 'px'; ctx.lineJoin = 'round';
    ctx.shadowColor = o.glow || 'rgba(0,0,0,.75)'; ctx.shadowBlur = o.blur ?? 40; ctx.lineWidth = o.lw || size * .12; ctx.strokeStyle = o.stroke || '#1a0703'; ctx.strokeText(txt, VW / 2, y); ctx.shadowBlur = 0;
    ctx.fillStyle = fill === 'gold' ? goldGrad(ctx, y - size * .8, y) : fill; ctx.fillText(txt, VW / 2, y); ctx.restore() };
  big('4000', 440, 330, 'gold', { lw: 28, glow: 'rgba(255,170,40,.85)', blur: 60 });
  big('YILLIK', 555, 100, '#ffffff', { ls: 16, lw: 13 });
  big('KÜRT', 840, 300, '#ffffff', { lw: 28, stroke: '#7a0f0a', glow: 'rgba(230,40,20,.9)', blur: 60 });
  big('ATALARI', 985, 140, 'gold', { ls: 8, lw: 18 });
  // ribbon
  ctx.save(); ctx.font = '800 46px InterB'; const t = 'GUTİLER · MEZOPOTAMYA’YA HÜKMETTİ'; const w = ctx.measureText(t).width + 60; ctx.shadowColor = 'rgba(0,0,0,.55)'; ctx.shadowBlur = 20; ctx.fillStyle = '#c8201a'; ctx.beginPath(); ctx.roundRect(VW / 2 - w / 2, 1030, w, 76, 12); ctx.fill(); ctx.shadowBlur = 0;
  ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(t, VW / 2, 1070); ctx.restore();
  ctx.save(); ctx.font = '900 46px CinzelD'; ctx.textAlign = 'center'; ctx.letterSpacing = '8px'; ctx.lineWidth = 7; ctx.lineJoin = 'round'; ctx.strokeStyle = 'rgba(30,10,4,.8)'; ctx.strokeText('DÎROK', VW / 2, 150); ctx.fillStyle = goldGrad(ctx, 110, 152); ctx.fillText('DÎROK', VW / 2, 150); ctx.restore();
  return VC.toDataURL('image/jpeg', .95) });
fs.writeFileSync(out + 'dirok_gutiler_short_kapak.jpg', Buffer.from(d.split(',')[1], 'base64')); await b.close(); console.log('ok');
