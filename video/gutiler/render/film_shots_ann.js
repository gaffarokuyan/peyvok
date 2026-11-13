// ================= ANNAZÎLER — shot list (cue = word in narration) =================
window.TITLEP = { title: 'ANNAZÎLER', sub: 'ZAGROS KAPISININ KÜRT EMİRLERİ', tag: 'Hulvan · 990 – 1117' };
PORTRAIT.badr = Object.assign({}, PORTRAIT.muhalhil, { robe: ['#123a22', '#2f8a4a'], mantle: '#0c2416', cap: '#1f6a3a', beard: ['#8a8278', '#4a443c', '#1a1612'], age: .8, hollow: .2 });
const HUL = [45.86, 34.46], BAG = [44.36, 33.31], HEM = [48.51, 34.80], KER = [47.07, 34.31], DIN = [47.43, 34.60], SEH = [45.90, 35.25], DAK = [44.45, 35.13];
const SHOTS = {
 ch00: [
  { at: 0, type: 'terrain3d', p: { cam: [[0, 43.6, 32.9, 40, 46.0, 34.6], ['bağdattan', 44.6, 33.5, 28, 46.4, 34.7]], pins: [['kürt', ...HUL, 'HULVAN', 'Zagros kapısı'], ['bağdattan', ...BAG, 'BAĞDAT', ''], ['horasana', ...HEM, 'HEMEDAN', 'Horasan yolu']] } },
  { at: 'yüz otuz@-0.3', type: 'caravan', p: { title: 'HORASAN YOLU', sub: 'Bağdat – Hemedan – Horasan', road: 'yüz otuz' } },
  { at: 'saraylar@-0.2', type: 'court', p: { title: 'ANNAZÎ SARAYI', sub: 'Hulvan' } },
  { at: 'süvari@-0.2', type: 'cavalry', p: { title: 'ŞAZENCAN SÜVARİLERİ', sub: 'Kürt aşiret ordusu' } },
  { at: 'komşu@-0.2', type: 'clash', p: { left: ANN.ann, right: ANN.hsn, vs: true } },
  { at: 'onların@-0.2', type: 'portrait', p: { who: 'emir', name: 'ANNAZÎLER', sub: 'Zagros kapısının Kürt emirleri' } },
  { at: 'dîrok@-0.2', type: 'scenic', p: { warm: .2, lines: [['dîrok', 'DÎROK', 170, .38]] } }],
 ch01: [
  { at: 0, type: 'map', p: { year: '~990', cam: [[0, 46.4, 34.8, 10]], show: [['annE', 'hulvan']], glow: [['annE', 'hulvan']], cities: [['Hulvan', ...HUL, 'hulvan', true]],
      labels: [['şazencan', 47.1, 35.5, 'ŞAZENCAN', 'Kürt aşireti', '']] } },
  { at: 'ebul@-0.3', type: 'portrait', p: { who: 'founder', name: 'MUHAMMED BİN ANNAZ', nsize: 96, sub: 'Ebu’l-Feth · Hanedanın kurucusu', notes: [['hanedan', 'ANNAZ’IN OĞULLARI', 'Hanedan adını babasından aldı']] } },
  { at: 'hulvan sıradan@-0.3', type: 'map', p: { cam: [['hulvan sıradan@-0.3', 46.4, 34.1, 12]], show: ['annE'], cities: [['Bağdat', ...BAG, 0, true], ['Hulvan', ...HUL, 0, true], ['Hemedan', ...HEM, 'hemedana', true]],
      arrows: [['bağdatı', BAG, HUL, '#ffcf3a', 1.4], ['hemedana', HUL, HEM, '#ffcf3a', 1.4]], text: [['zagrosun', 'ZAGROS KAPISI', null, 100]] } },
  { at: 'kervanlar@-0.2', type: 'caravan', p: { title: 'KERVANLAR · ELÇİLER · ORDULAR', sub: 'Hulvan kapısından geçerdi', road: 'kervanlar' } },
  { at: 'bu kapıyı@-0.2', type: 'scenic', p: { warm: .25, lines: [['bu kapıyı', 'KAPIYI TUTAN', 150, .34], ['kaderini', 'bölgenin kaderini de tutuyordu', 62, .5, 'corm']] } }],
 ch02: [
  { at: 0, type: 'org', p: { title: 'ANNAZÎ YÖNETİMİ', sub: 'Aşiret düzeni', nodes: [['süvarilerinden', 'ŞAZENCAN SÜVARİLERİ', 'Gücün kaynağı', .2, .68, 'horse'], ['merkezlerden', 'HANEDAN ÜYELERİ', 'Farklı merkezler', .4, .74, 'city'], ['mühelhil', 'MÜHELHİL', 'Emirin kardeşi · Şehrizor', .62, .74, 'city'], ['şehrizoru', 'ELÇİLER', 'Komşularla ilişkiler', .82, .68, 'envoy']] } },
  { at: 'sarayda@-0.2', type: 'court', p: { title: 'SARAY', sub: 'Elçiler · vergiler · kervan yolları', envoy: 'sarayda', bow: 'kabul', notes: [['vergiler', 'VERGİLER TOPLANIRDI'], ['kervan', 'KERVAN YOLLARI KORUNURDU']] } },
  { at: 'dağlardaki@-0.2', type: 'castle', p: { title: 'DAĞ KALELERİ', sub: 'Sığınak ve hazine' } },
  { at: 'bu düzen@-0.2', type: 'cavalry', p: { warm: .35, title: 'KÜRT AŞİRET GELENEĞİ', sub: 'Yüzyıllarca süren düzen' } }],
 ch03: [
  { at: 0, type: 'map', p: { cam: [[0, 46.9, 34.5, 8.5]], show: ['annE', ['hsn', 'dinever']], tags: [['annE'], ['hsn', 'dinever']], cities: [['Hulvan', ...HUL, 0, true], ['Dinever', ...DIN, 'dinever', true]] } },
  { at: 'iki hanedan@-0.2', type: 'houses', p: { left: ['emir', 'ANNAZÎLER', 'Hulvan'], right: ['badr', 'HASANVEYHÎLER', 'Dinever'], ring: 'evlilik', rival: 'rakiptiler' } },
  { at: 'iki kürt@-0.2', type: 'clash', p: { left: ANN.ann, right: ANN.hsn, vs: true, clash: 'geldi' } },
  { at: 'hasanveyhi emiri@-0.2', type: 'portrait', p: { who: 'badr', name: 'BEDR BİN HASANVEYH', nsize: 96, sub: 'Hasanveyhî emiri', year: '1014', notes: [['öldüğünde', 'ÖLÜMÜYLE', 'Hasanveyhî gücü dağıldı']] } },
  { at: 'onların@-0.2', type: 'map', p: { cam: [['onların@-0.2', 46.4, 34.7, 8]], show: ['ann'], glow: [['ann', 'annazîlere']], cities: [['Hulvan', ...HUL, 0, true], ['Dinever', ...DIN, 0, true]], text: [['annazîlere', 'TOPRAKLAR GENİŞLEDİ', null, 100]] } }],
 ch04: [
  { at: 0, type: 'portrait', p: { who: 'emir', name: 'EBUŞŞEVK FARİS', sub: 'Hüsameddevle', year: '1011 – 1046', notes: [['otuz', '35 YIL', 'Hanedanın en parlak dönemi']] } },
  { at: 'onun@-0.2', type: 'map', p: { year: '~1030', cam: [['onun@-0.2', 46.0, 34.75, 7.5]], show: ['ann'], glow: [['ann', 'onun']], cities: [['Hulvan', ...HUL, 'hulvandan', true], ['Kirmanşah', ...KER, 'kirmanşaha', true], ['Dinever', ...DIN, 'dineverden', true], ['Şehrizor', ...SEH, 'şehrizora', true], ['Dakuk', ...DAK, 'dakuka', true]] } },
  { at: 'komşu@-0.2', type: 'court', p: { title: 'İTTİFAK VE SAVAŞ', sub: 'Komşu hanedanlarla', envoy: 'komşu', bow: 'ittifak', envoyRobe: '#26345a' } },
  { at: 'bağdat ile@-0.2', type: 'cavalry', p: { warm: .3, title: 'ANNAZÎ SÜVARİLERİ', sub: 'Bağdat ile Hemedan arasında' } }],
 ch05: [
  { at: 0, type: 'feud', p: { left: ['muhalhil', 'MÜHELHİL', 'Amca · Şehrizor'], right: ['sadi', 'SADİ', 'Ebuşşevk’in oğlu'], crack: 'taht', text: ['dışarıdan', 'TAHT KAVGASI'] } },
  { at: 'bu bölünme@-0.2', type: 'map', p: { cam: [['bu bölünme@-0.2', 49.5, 34.8, 15]], show: ['ann', ['selj', 'doğudan']], tags: [['selj', 'doğudan']], glow: [['selj', 'fırtınanın']], text: [['fırtınanın', 'DOĞUDAN GELEN FIRTINA', null, 90]] } }],
 ch06: [
  { at: 0, type: 'map', p: { year: '1046', cam: [[0, 49.0, 34.8, 14], ['bin kırk', 47.2, 34.5, 9]], show: ['ann', 'selj'], tags: [['selj']], cities: [['Hulvan', ...HUL, 0, true], ['Hemedan', ...HEM, 0, true]],
      armies: [['bin kırk', [51.5, 35.4], HUL, '#26345a', '#0a0e1c', 2.6]] } },
  { at: 'selçuklu komutanı@-0.2', type: 'portrait', p: { who: 'inal', name: 'İBRAHİM YINAL', sub: 'Selçuklu komutanı', year: '1046', bg: '#2a3a6a' } },
  { at: 'şehir@-0.2', type: 'siege', p: { title: 'HULVAN · 1046', sub: 'Kuşatma ve yangın', burn: 'düştü' } },
  { at: 'aynı@-0.2', type: 'castle', p: { lines: [['sirvan', 'SİRVAN KALESİ', 120, .3], ['kaybetti', 'Ebuşşevk burada hayatını kaybetti · 1046', 56, .42, 'corm']] } },
  { at: 'annazîler ovaları@-0.2', type: 'cavalry', p: { warm: .5, title: 'DAĞLARDAN VAZGEÇMEDİLER', sub: '' } }],
 ch07: [
  { at: 0, type: 'castle', p: { lines: [['yetmiş', 'YETMİŞ YIL DAHA', 130, .3], ['dağlarda', 'Kalelerde ve dağlarda', 62, .42, 'corm']] } },
  { at: 'bin yüz@-0.2', type: 'map', p: { year: '~1117', cam: [['bin yüz@-0.2', 46.4, 34.6, 9]], show: ['annE'], cities: [['Hulvan', ...HUL, 0, true]], text: [['sahnesinden', 'TARİH SAHNESİNDEN ÇEKİLDİ', null, 84]] } },
  { at: 'bu orta@-0.2', type: 'scenic', p: { warm: .25, lines: [['orta', 'ORTA ZAGROS', 140, .32], ['son', 'son büyük Kürt hanedanlarından biri', 60, .48, 'corm']] } },
  { at: 'annaziler mervânîler@-0.2', type: 'list', p: { title: 'ORTA ÇAĞ KÜRT HANEDANLARI', colors: ['#fff3d0', '#ffc06a', '#c8402a'], items: [['mervânîler', 'MERVÂNÎLER · Diyarbakır'], ['şeddâdîler', 'ŞEDDÂDÎLER · Gence'], ['hasanveyhîlerle', 'HASANVEYHÎLER · Dinever'], ['halkasıydı', 'ANNAZÎLER · Hulvan']] } }],
 ch08: [
  { at: 0, type: 'scenic', p: { warm: .3, lines: [['bir aşiret', 'BİR AŞİRET · BİR GEÇİT', 100, .3], ['yüz', '130 YILLIK EMİRLİK', 130, .45], ['kürt', 'Kürt tarihinin unutulmuş sayfaları', 60, .6, 'corm']] } },
  { at: 'bu videoyu@-0.2', type: 'scenic', p: { warm: .2, lines: [['videoyu', 'ABONE OL', 140, .38], ['yorumlarda', 'Görüşlerinizi yorumlarda paylaşın', 62, .55, 'corm']] } }]
};
window.CREDITS = ['# Kaynaklar', 'İbnü’l-Esîr — el-Kâmil fi’t-Târîh', 'V. Minorsky — “ʿAnnāzids”, Encyclopaedia of Islam (2. baskı)', 'Encyclopaedia Iranica — “ʿAnnazids”', 'C. E. Bosworth — The New Islamic Dynasties, Edinburgh, 1996', 'Encyclopaedia Britannica — “ʿAnnazid dynasty”',
 '# Not', 'Kaynaklarda bazı tarihler ve sınırlar farklılık gösterir', 'Portreler temsilîdir', '# Yapım', 'DÎROK'];
