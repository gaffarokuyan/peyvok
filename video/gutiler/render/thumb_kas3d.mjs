// Premium vertical covers for the Gutian Short (GUTİ + KÜRT prominent)
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)('playwright'); import path from 'path'; import fs from 'fs';
const out = '/home/user/peyvok/video/kassitler/tiktok/out/'; fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch({ args: ['--allow-file-access-from-files'] });
const p = await b.newPage({ viewport: { width: 1080, height: 1920 } }); p.on('pageerror', e => console.log('ERR', e.message));
await p.goto('file://' + path.resolve('shortk.html')); await p.evaluate(() => window.ready);
for (const v of ['hero']) {
  const d = await p.evaluate(v => {
    const ctx = VX; ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.filter = 'none';
    const main = X; X = cv.getContext('2d'); X.setTransform(1, 0, 0, 1, 0, 0); SH = { t0: 0, t1: 30, T: 4.2, R: q => typeof q === 'number' ? q : 0, ch: null };
    const _lb = labelBoxB; labelBoxB = () => { }; if (v === 'hero') { G3.rd.toneMappingExposure = 1.6; s3dHero(0, {}); G3.rd.toneMappingExposure = 1.05 } else if (v === 'zig') s3dZiggurat(4.2, {}); else s3dTerrain(1, { cam: [[0, 45.0, 32.4, 22, 47.6, 34.4]], pins: [] });
    X = main; labelBoxB = _lb;
    const s = VH / H; ctx.save(); ctx.filter = 'blur(26px) saturate(1.3)'; ctx.drawImage(cv, VW / 2 - W * s / 2, 0, W * s, H * s); ctx.restore();
    if (v === 'hero') ctx.filter = 'saturate(1.3) brightness(1.18)'; const f = v === 'hero' ? 1.0 : v === 'zig' ? 1.02 : 1.25; ctx.drawImage(cv, VW / 2 - (v === 'hero' ? 900 : v === 'zig' ? 880 : 960) * f, VH - H * f + (v === 'hero' ? 40 : v === 'zig' ? 60 : 20), W * f, H * f); ctx.filter = 'none';
    // warm grade
    ctx.save(); ctx.globalCompositeOperation = 'multiply'; const g = ctx.createLinearGradient(0, 0, 0, VH); g.addColorStop(0, '#ffb070'); g.addColorStop(.55, '#ffd8a8'); g.addColorStop(1, '#b8703a'); ctx.fillStyle = g; ctx.fillRect(0, 0, VW, VH); ctx.restore();
    // top darkness for text
    const dg = ctx.createLinearGradient(0, 0, 0, VH); dg.addColorStop(0, v === 'hero' ? 'rgba(40,12,20,.6)' : 'rgba(18,5,2,.96)'); dg.addColorStop(.45, v === 'hero' ? 'rgba(40,12,20,.25)' : 'rgba(18,5,2,.8)'); dg.addColorStop(.6, 'rgba(18,5,2,0)'); dg.addColorStop(.92, 'rgba(18,5,2,0)'); dg.addColorStop(1, 'rgba(18,5,2,.6)'); ctx.fillStyle = dg; ctx.fillRect(0, 0, VW, VH);
    // sunburst at the clash point
    ctx.save(); ctx.globalCompositeOperation = 'screen'; const cx = 760, cy = 1180; const rg = ctx.createRadialGradient(cx, cy, 0, cx, cy, 760); rg.addColorStop(0, 'rgba(255,225,120,.28)'); rg.addColorStop(.35, 'rgba(255,150,40,.3)'); rg.addColorStop(1, 'rgba(255,90,20,0)'); ctx.fillStyle = rg; ctx.fillRect(0, 0, VW, VH);
    ctx.translate(cx, cy); for (let i = 0; i < 21; i++) { ctx.rotate(TAU / 21); ctx.fillStyle = 'rgba(255,215,110,.05)'; ctx.beginPath(); ctx.moveTo(-34, 0); ctx.lineTo(0, -1000); ctx.lineTo(34, 0); ctx.fill() } ctx.restore();
    // embers
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 70; i++) { const x = hash(i + 3) * VW, y = 700 + hash(i + 9) * 1200, r = 1.5 + hash(i + 5) * 5; ctx.fillStyle = `rgba(255,${150 + hash(i) * 90 | 0},60,${.25 + hash(i + 1) * .6})`; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill() } ctx.restore();
    const big = (txt, y, size, fill, o = {}) => { ctx.save(); ctx.font = `900 ${size}px CinzelH`; ctx.textAlign = 'center'; ctx.letterSpacing = (o.ls || 0) + 'px'; ctx.lineJoin = 'round';
      let sz = size; while (ctx.measureText(txt).width > (o.maxW || 900) && sz > 30) { sz -= 4; ctx.font = `900 ${sz}px CinzelH` }
      ctx.shadowColor = o.glow || 'rgba(0,0,0,.8)'; ctx.shadowBlur = o.blur ?? 40; ctx.lineWidth = o.lw || sz * .12; ctx.strokeStyle = o.stroke || '#1a0703'; ctx.strokeText(txt, VW / 2, y); ctx.shadowBlur = 0;
      ctx.fillStyle = fill === 'gold' ? goldGrad(ctx, y - sz * .8, y) : fill; ctx.fillText(txt, VW / 2, y);
      if (o.shine) { ctx.globalCompositeOperation = 'lighter'; const sg = ctx.createLinearGradient(0, y - sz * .8, 0, y - sz * .4); sg.addColorStop(0, 'rgba(255,255,255,.35)'); sg.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = sg; ctx.fillText(txt, VW / 2, y) } ctx.restore() };
    const pill = (txt, y, bg, fg, size = 44) => { ctx.save(); ctx.font = `800 ${size}px InterB`; ctx.letterSpacing = '2px'; const w = ctx.measureText(txt).width + 70; ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 24; ctx.fillStyle = bg; ctx.beginPath(); ctx.roundRect(VW / 2 - w / 2, y - size * .85, w, size * 1.7, size * .85); ctx.fill(); ctx.shadowBlur = 0;
      ctx.lineWidth = 3; ctx.strokeStyle = goldGrad(ctx, y - size, y + size); ctx.stroke(); ctx.fillStyle = fg; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(txt, VW / 2, y + 2); ctx.restore() };
    if (v === 'hero') { const tc = document.createElement('canvas'); tc.width = VW; tc.height = VH; const tx = tc.getContext('2d'); tx.filter = 'saturate(1.3) brightness(1.04) contrast(1.12)';
      tx.drawImage(cv, VW / 2 - 900, VH - H + 40, W, H); tx.filter = 'none'; tx.globalCompositeOperation = 'destination-in'; const mg = tx.createLinearGradient(0, 900, 0, 1100); mg.addColorStop(0, 'rgba(0,0,0,0)'); mg.addColorStop(1, 'rgba(0,0,0,1)'); tx.fillStyle = mg; tx.fillRect(0, 0, VW, VH); ctx.drawImage(tc, 0, 0) }
    // gold frame
    ctx.save(); ctx.lineWidth = 6; ctx.strokeStyle = goldGrad(ctx, 0, VH); ctx.strokeRect(26, 26, VW - 52, VH - 52); ctx.lineWidth = 2; ctx.strokeRect(40, 40, VW - 80, VH - 80); ctx.restore();
    ctx.save(); ctx.font = '900 40px CinzelD'; ctx.textAlign = 'center'; ctx.letterSpacing = '10px'; ctx.fillStyle = goldGrad(ctx, 90, 125); ctx.fillText('DÎROK', VW / 2, 125); ctx.restore();
    if (v === 'a') {
      pill('MÖ 2200 · DAĞLARIN EJDERHASI', 225, 'rgba(160,18,20,.95)', '#fff', 38);
      big('GUTİLER', 470, 230, 'gold', { lw: 22, glow: 'rgba(255,170,40,.9)', blur: 70, shine: 1, ls: 4 });
      big('KÜRTLERİN', 640, 130, '#ffffff', { lw: 16, ls: 6 });
      big('ATALARI', 830, 200, '#ffffff', { lw: 24, stroke: '#7a0f0a', glow: 'rgba(230,40,20,.95)', blur: 70, ls: 6 });
      pill('AKAD’I YIKAN DAĞ HALKI', 960, 'rgba(25,10,4,.9)', '#ffd23a', 46);
    } else {
      big('KÜRTLERİN', 330, 140, '#ffffff', { lw: 16, ls: 6 });
      big('3600 YILLIK', 470, 120, 'gold', { lw: 15, ls: 4 });
      big('ATASI', 640, 190, '#ffffff', { lw: 24, stroke: '#7a0f0a', glow: 'rgba(230,40,20,.95)', blur: 70, ls: 8 });
      big('KASSİTLER', 860, 230, 'gold', { lw: 22, glow: 'rgba(255,170,40,.9)', blur: 70, shine: 1, ls: 4 });
      pill('MÖ 1595–1155 · BABİL’İ 430 YIL YÖNETTİLER', 985, 'rgba(160,18,20,.95)', '#fff', 34);
    }
    return VC.toDataURL('image/jpeg', .95) }, v);
  fs.writeFileSync(out + `dirok_kassitler_tiktok_kapak_${v}.jpg`, Buffer.from(d.split(',')[1], 'base64'));
}
await b.close(); console.log('ok');
