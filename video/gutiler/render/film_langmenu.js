// ================= 5-LANGUAGE AUDIO/SUBTITLE MENU OVERLAY (video opening) =================
const LANGMENU = {
  t0: 1.2, step: 1.9, out: 12.0,
  ui: [
    { rtl: 0, title: '5 DİLDE SESLENDİRME VE ALTYAZI', head: 'Ses parçası', items: ['Türkçe (orijinal)', 'Kurmancî', 'Soranî', 'Arapça', 'İngilizce'], foot: 'Altyazı: Türkçe' },
    { rtl: 0, title: 'BI 5 ZIMANAN DENG Û BINNIVÎS', head: 'Şopa dengî', items: ['Tirkî (orîjînal)', 'Kurmancî', 'Soranî', 'Erebî', 'Îngilîzî'], foot: 'Binnivîs: Kurmancî' },
    { rtl: 1, title: 'دەنگ و ژێرنووس بە ٥ زمان', head: 'تراکی دەنگ', items: ['تورکی (ڕەسەن)', 'کورمانجی', 'سۆرانی', 'عەرەبی', 'ئینگلیزی'], foot: 'ژێرنووس: سۆرانی' },
    { rtl: 1, title: 'دبلجة وترجمة بخمس لغات', head: 'المسار الصوتي', items: ['التركية (الأصلية)', 'الكرمانجية', 'السورانية', 'العربية', 'الإنجليزية'], foot: 'الترجمة: العربية' },
    { rtl: 0, title: 'AUDIO & SUBTITLES IN 5 LANGUAGES', head: 'Audio track', items: ['Turkish (original)', 'Kurmanji', 'Sorani', 'Arabic', 'English'], foot: 'Subtitles: English' }
  ],
  strip: ['Türkçe', 'Kurmancî', 'سۆرانی', 'العربية', 'English']
};
function drawLangMenu(T) {
  const M = LANGMENU; if (T < M.t0 - .1 || T > M.out + .6) return;
  const aIn = eout(clamp((T - M.t0) / .5)), aOut = 1 - clamp((T - M.out) / .5), a = aIn * aOut; if (a <= 0) return;
  const k = Math.min(4, Math.max(0, Math.floor((T - M.t0) / M.step))), lt = T - M.t0 - k * M.step;
  const U = M.ui[k], ar = !!U.rtl, F = ar ? 'KufiB' : 'InterB';
  const w = 470, h = 392, x = W - 46 - w, y = 122 + (1 - aIn) * -30;
  X.save(); X.globalAlpha = a;
  // title above panel
  X.textAlign = 'center'; X.textBaseline = 'middle'; X.font = `800 ${ar ? 25 : 23}px ${F}`; X.letterSpacing = ar ? '0px' : '2px';
  X.lineJoin = 'round'; X.lineWidth = 6; X.strokeStyle = 'rgba(20,8,4,.85)'; const ty = y + 2; X.strokeText(U.title, x + w / 2, ty); X.fillStyle = goldGrad(X, ty - 14, ty + 14); X.fillText(U.title, x + w / 2, ty);
  // panel
  const py = y + 26; X.shadowColor = 'rgba(0,0,0,.55)'; X.shadowBlur = 26; X.fillStyle = 'rgba(22,12,8,.88)'; X.beginPath(); X.roundRect(x, py, w, h - 26, 16); X.fill(); X.shadowBlur = 0;
  X.lineWidth = 2.5; X.strokeStyle = '#d9a640'; X.stroke();
  const L = ar ? x + w - 26 : x + 26, R = ar ? x + 26 : x + w - 26, al = ar ? 'right' : 'left', dir = ar ? -1 : 1;
  X.letterSpacing = '0px'; X.textAlign = al; X.direction = ar ? 'rtl' : 'ltr';
  // header with headphone + gear icons
  const hy = py + 34; X.font = `800 ${ar ? 25 : 24}px ${F}`; X.fillStyle = '#ffffff';
  X.save(); X.strokeStyle = '#ffd65a'; X.lineWidth = 3; X.beginPath(); X.arc(L + dir * 12, hy + 2, 9, Math.PI, 0); X.stroke(); X.fillStyle = '#ffd65a'; X.fillRect(L + dir * 12 - 11, hy, 5, 9); X.fillRect(L + dir * 12 + 6, hy, 5, 9); X.restore();
  X.fillText(U.head, L + dir * 34, hy + 2);
  X.strokeStyle = 'rgba(217,166,64,.45)'; X.lineWidth = 1.5; X.beginPath(); X.moveTo(x + 16, hy + 24); X.lineTo(x + w - 16, hy + 24); X.stroke();
  // items
  const iy0 = hy + 58, ih = 46;
  U.items.forEach((it, i) => {
    const yy = iy0 + i * ih, sel = i === k;
    if (sel) {
      const pop = 1 + .06 * Math.sin(Math.PI * clamp(lt / .35));
      X.save(); X.translate(x + w / 2, yy); X.scale(pop, pop); X.fillStyle = '#c8201a'; X.beginPath(); X.roundRect(-w / 2 + 14, -20, w - 28, 40, 9); X.fill(); X.strokeStyle = '#ffd65a'; X.lineWidth = 2; X.stroke(); X.restore();
      X.save(); X.strokeStyle = '#fff'; X.lineWidth = 4; X.lineCap = 'round'; X.lineJoin = 'round'; const cx = L + dir * 8; X.beginPath(); X.moveTo(cx - 8 * dir, yy); X.lineTo(cx - 2 * dir, yy + 7); X.lineTo(cx + 10 * dir, yy - 8); X.stroke(); X.restore();
    }
    X.font = `${sel ? 800 : 600} ${ar ? 23 : 22}px ${F}`; X.fillStyle = sel ? '#ffffff' : 'rgba(255,240,220,.78)'; X.fillText(it, L + dir * 34, yy + 1);
  });
  // tap ripple on the newly selected row
  if (lt < .6) { const yy = iy0 + k * ih; X.save(); X.globalAlpha = a * (1 - lt / .6); X.strokeStyle = '#ffd65a'; X.lineWidth = 3; X.beginPath(); X.arc(x + w / 2 + dir * 120, yy, 10 + 40 * lt, 0, TAU); X.stroke(); X.restore() }
  // footer: subtitles
  const fy = iy0 + 5 * ih + 4; X.strokeStyle = 'rgba(217,166,64,.45)'; X.lineWidth = 1.5; X.beginPath(); X.moveTo(x + 16, fy - 22); X.lineTo(x + w - 16, fy - 22); X.stroke();
  X.save(); X.strokeStyle = '#ffd65a'; X.lineWidth = 2.5; X.strokeRect(ar ? L - 24 : L, fy - 9, 24, 18); X.fillStyle = '#ffd65a'; X.fillRect(ar ? L - 20 : L + 4, fy + 1, 7, 3); X.fillRect(ar ? L - 11 : L + 13, fy + 1, 7, 3); X.restore();
  X.font = `700 ${ar ? 21 : 20}px ${F}`; X.fillStyle = '#ffd65a'; X.fillText(U.foot, L + dir * 34, fy + 1);
  // language strip under panel
  X.direction = 'ltr'; X.textAlign = 'left'; const sy = py + h - 26 + 26; let sx = 0; const parts = M.strip.map((s, i) => { X.font = `${i === k ? 800 : 600} 19px ${/[؀-ۿ]/.test(s) ? 'KufiB' : 'InterB'}`; return [s, X.measureText(s).width, X.font] });
  const tot = parts.reduce((q, p) => q + p[1], 0) + 22 * (parts.length - 1); sx = x + w / 2 - tot / 2;
  parts.forEach(([s, pw, f], i) => { X.font = f; X.lineWidth = 4; X.strokeStyle = 'rgba(20,8,4,.8)'; X.strokeText(s, sx, sy); X.fillStyle = i === k ? '#ffd65a' : '#ffffff'; X.fillText(s, sx, sy); if (i < parts.length - 1) { X.fillStyle = '#d9a640'; X.fillText('·', sx + pw + 7, sy) } sx += pw + 22 });
  X.restore();
}
