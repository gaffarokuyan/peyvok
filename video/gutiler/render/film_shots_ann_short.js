// ================= ANNAZÎLER SHORT — shot list =================
window.TITLEP = {}; window.CREDITS = [];
PORTRAIT.badr = Object.assign({}, PORTRAIT.muhalhil, {});
const HUL = [45.86, 34.46], BAG = [44.36, 33.31], HEM = [48.51, 34.80], KER = [47.07, 34.31], SEH = [45.90, 35.25], DAK = [44.45, 35.13];
const FOE = Object.assign({}, ANN.sel, { name: 'DÜŞMAN', sub: 'Yol kesiciler', rider: Object.assign({}, ANN.sel.rider, { hat: 'helmet', tunic: '#5a3a26', bow: false }) });
const SHOTS = { ch00: [
  { at: -0.6, type: 'terrain3d', fx: .5, p: { cam: [[0, 43.0, 32.6, 34, 45.6, 34.2], ['bugün', 44.9, 33.6, 16, 46.0, 34.5]], pins: [['bağdat’a', ...BAG, 'BAĞDAT', ''], ['kürt', ...HUL, 'HULVAN', 'Kapı']] } },
  { at: 'annazîler@-0.15', type: 'portrait', fx: .5, p: { who: 'emir', name: ' ', x: 1920 * .5, s: 1.05 } },
  { at: 'mezopotamya’nın@-0.2', type: 'map', fx: .5, p: { cam: [[0, 45.3, 34.0, 7.5], ['hulvan’da', 45.8, 34.4, 5.5]], rivers: 'mezopotamya’nın', show: [['annE', 'hulvan’da']], glow: [['annE', 'hulvan’da']], cities: [['Bağdat', ...BAG, 0, true], ['Hulvan', ...HUL, 'hulvan’da', true]] } },
  { at: 'kürt#2@-0.2', type: 'cavalry', fx: .5, p: { title: '', sub: '' } },
  { at: 'bağdat’tan@-0.2', type: 'caravan', fx: .5, p: { title: '', sub: '', road: 'bağdat’tan' } },
  { at: 'bu yolu@-0.2', type: 'clash', fx: .5, p: { left: ANN.ann, right: FOE, vs: false, clash: 'korurdu' } },
  { at: 'emir@-0.2', type: 'portrait', fx: .5, p: { who: 'emir', name: ' ', x: 1920 * .5, s: 1.05, bg: '#8a3a18' } },
  { at: 'toprakları@-0.2', type: 'map', fx: .5, p: { year: '~1030', cam: [[0, 45.75, 34.75, 16]], show: ['ann'], glow: [['ann', 'toprakları']], cities: [['Hulvan', ...HUL, 'hulvan’dan', true], ['Kirmanşah', ...KER, 'kirmanşah’a', true], ['Şehrizor', ...SEH, 'şehrizor’dan', true], ['Dakuk', ...DAK, 'dakuk’a', true]] } },
  { at: 'sonra@-0.2', type: 'map', fx: .5, p: { year: '1046', cam: [[0, 48.4, 34.8, 10], ['selçuklu', 46.8, 34.6, 7.5]], show: ['ann', 'selj'], cities: [['Hulvan', ...HUL, 0, true]], armies: [['selçuklu', [51.0, 35.2], HUL, '#26345a', '#0a0e1c', 2.2]] } },
  { at: 'hulvan#3@-0.2', type: 'siege', fx: .5, p: { title: '', sub: '', burn: 'düştü' } },
  { at: 'ebuşşevk#2@-0.2', type: 'castle', fx: .5, p: { lines: [] } },
  { at: 'ama@-0.15', type: 'cavalry', fx: .5, p: { warm: .55, title: '', sub: '' } },
  { at: 'dağlara@-0.2', type: 'terrain3d', fx: .5, p: { cam: [[0, 45.2, 33.4, 24, 46.4, 35.0], ['yetmiş', 46.6, 33.9, 14, 46.2, 35.2]], pins: [['yetmiş', ...SEH, 'ŞEHRİZOR', ''], ['ayakta', ...HUL, 'HULVAN', '']] } },
  { at: 'yüz otuz@-0.2', type: 'court', fx: .5, p: { title: '', sub: '', envoy: 'yüz otuz', bow: 'kapısını' } },
  { at: 'daha fazlası@-0.3', type: 'scenic', fx: .5, p: { warm: .3, lines: [] } }] };
