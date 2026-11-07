# Peyvok — proje notu

Peyvok, Words of Wonders tarzı bir **Kurmancî kelime bulmaca oyunu**: harf çarkı + çapraz bulmaca, 200 seviye, her 10 seviyede yeni bir yer (Kürdistan'dan 20 mekân) ve kartpostal.
Geliştirici: Gaffar (Okuyan Studio). Kısa, doğrudan Türkçe cevap tercih eder. Expo kuralları için ayrıca `AGENTS.md`'ye bak.

## Mimari
- **Oyunun tamamı tek HTML dosyası:** `source/peyvok.html` (~4.9 MB, vanilla JS + CSS + canvas, framework yok). **Asıl kaynak budur.**
- **Uygulama:** Expo + `react-native-webview`. `App.tsx`, `assets/web/game.html`'i `expo-asset` ile yükleyip WebView'da açar; Android geri tuşu `BACK_JS` ile oyun içine yönlendirilir.
- **Build akışı:** `source/peyvok.html` düzenle → `python3 tools/build_game.py` → `assets/web/game.html` üretilir (Google Fonts linki `source/fonts-inline.html` içindeki gömülü woff2 fontlarla değiştirilir, böylece offline çalışır). `assets/web/game.html`'i elle düzenleme.
- **Kayıt:** `localStorage["peyvok:v5"]` (seviye, altın, kartlar, ayarlar, ipucu, çark). Sunucu/hesap yok.
- **Görseller:** sahne fotoğrafları base64 webp olarak HTML'e gömülü: `const IMGSRC={c:…,0:…,…,13:…}` (`c` = ana sayfa kapağı). Kaynak dosyalar `source/img/`.
- **Ses/müzik:** WebAudio ile sentez (`initAudio`, `tone`, `startMusic`, `schedule`).

## Klasörler
```
App.tsx, app.json, eas.json, assets/   # Expo uygulaması
assets/web/game.html                   # ÜRETİLEN dosya (tools/build_game.py)
source/peyvok.html                     # OYUN KAYNAĞI
source/fonts-inline.html               # gömülü @font-face (Baloo 2, Cinzel, Nunito; latin+latin-ext)
source/levels56.json                   # 200 seviye (oyuna gömülü olanın kaynağı)
source/gen56.py                        # seviye üretici (max 5 sütun × 6 satır) — source/ içinden çalıştır
source/gen7.py, gen200.py              # eski üreticiler (referans)
source/peyvok-kelimeler.csv            # ~2900 Kurmancî kelime + Türkçe anlam
source/tr/o*.tsv                       # yaygın kelime listeleri (ilk 60 seviye sadece bunlar)
source/img/                            # s0–s13.webp sahne fotoları, cov_*.webp kapak adayları
source/p5/                             # eski ara parçalama (style.css, main.js, spin.js…) — sadece referans
site/                                  # tanıtım sitesi + gizlilik politikası (Netlify)
vid/                                   # tanıtım videosu üretici (make.py, music.py, fonts/)
tools/build_game.py
```

## Oyun kodu — önemli yerler (`source/peyvok.html`)
| Fonksiyon | Görev |
|---|---|
| `load()/save()` | localStorage `peyvok:v5` |
| `SCENES[20]` | `{n:isim, r:bölge 0-3, sun:[x,y], pt:parçacık, f:[TR bilgi, EN bilgi]}`; sahne = `Math.floor(level/10)` |
| `setScene(si,home)` | arka plan; ana sayfada `IMG.c` kapağı |
| `photo()/cover()` + `graded()` | fotoğrafı canvas'a çizer; `graded` = `saturate(.68) brightness(.9) contrast(1.06)`, `GRADE_SKIP={0:1,2:1,c:1}` hariç |
| `newPart()/frame()` | parçacıklar (kar, kuş, toz, sis, kıvılcım…) |
| `startLevel()` → `renderGrid()`, `renderWheel()` | seviye kurulumu |
| `renderGrid()` | kutu boyutu `Math.min(64,(W-gap*(cols-1))/cols,(H-gap*(rows-1))/rows)`, gap=6 |
| `drawLine/hit/submit` | çarkta parmakla seçim, kelime kontrolü |
| `flyIn/praise/checkDone/openDone` | doğru kelime animasyonu, övgü şeridi, seviye sonu kartpostal |
| `openColl()` | kartpostal koleksiyonu |
| `openSpin/doSpin/wheelSVG/updSpinUI` | günlük şans çarkı |
| `updFH()` | ücretsiz ipucu rozeti |

### Seviye formatı (`levels56.json`)
```json
{"l":"karışık harfler","w":[["kelime","türkçe"],...],"x":{"r":satır,"c":sütun,"p":[[row,col,dir],...]},"b":["bonus"]}
```
`dir`: 0 yatay, 1 dikey; `p[i]` ↔ `w[i]`. Yeniden üretim: `cd source && python3 gen56.py` (çıktı `levels.json` adını kontrol et) → oyundaki gömülü seviye dizisini değiştir.

### Onaylı tasarım kararları — bozma
- **"B" teması:** altın/mücevher, koyu gece tonu. Cinzel (logo/başlık), Nunito 900 (çark harfleri, 0.72 oran).
- **Kutular her seviyede 64px (1. seviyedeki gibi). Küçültme.** Bu yüzden ızgara max 5×6; övgü şeridi (`top:-58px`) ve kelime balonu ızgaranın üstüne overlay.
- Fotoğraflar koyu/mat "Ağrı Dağı" tonunda; parlak değil.
- Ana sayfa kapağı: ay ışıklı deniz (`cov_sea`). Çark/butonlar yukarıda (`.home .ring{margin-top:3vh}`).
- Günlük çark: 8 dilim (10–100 altın, 1–2 ipucu), günde 5 çevirme; ilki bedava, gerisi ödüllü reklam; `lvl>0` ise günde bir kez otomatik açılır. Kazanma penceresi "Te qezenc kir" (ışınlar + sayaç + "BIGIRE").
- Arayüz dili: KU / TR / EN.

## YAYIN ÖNCESİ YAPILACAKLAR
1. **Test ayarını geri al:** `openColl()` içinde `SCENES.map((s,i)=>true?` → `true` yerine kartın açık olup olmadığı kontrolü (`S.cards.includes(i)`); "seviyeye git" test butonunu kaldır.
2. **AdMob:** şu an sahte — `window.showRewardedAd=()=>new Promise(r=>setTimeout(()=>r(true),1200))`. `react-native-google-mobile-ads` ekle; WebView'dan `window.ReactNativeWebView.postMessage('ad:rewarded')`, native taraf reklamı gösterip `injectJavaScript` ile Promise'i çözsün. (Expo dev build gerekir, Expo Go'da çalışmaz.)
3. Sahne 14 (Sine) ve 15–19 (Eyndiwer, Girê Mozan, Girê Helef, Efrîn, Nebî Horî) hâlâ çizim. Foto gelince `source/img/s14..s19.webp` (≈1080px, webp q≈80) üret, `IMGSRC`'ye ekle.
4. Gizlilik URL'i: `https://peyvok.netlify.app/privacy.html` (`site/` Netlify'a yüklenecek).
5. `app.json` → `android.versionCode` her Play yüklemesinde artmalı.

## Build
- `npx expo install` ile bağımlılıklar; test: `npx expo start`.
- APK: `eas build -p android --profile preview` · Play (AAB): `eas build -p android --profile production`.
- EAS projesi: owner `gaffardevs-team`, projectId `b3f473a8-4eae-4cf5-83e0-1adc102f1828`, paket `com.okuyanstudio.peyvok`.
