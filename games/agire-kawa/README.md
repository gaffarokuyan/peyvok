# Newroz Empire — Newroz Efsanesi

3D **survivor-roguelite** mobil oyun prototipi (Okuyan Studio).
Tek dosya: `index.html` (Three.js r160, vanilla JS, WebAudio sentez ses). Peyvok gibi Expo + WebView ile paketlenebilir.

## Neden bu tür?
Son yılların en çok kazanan hybrid-casual / mid-core mobil türü: tek parmakla oynanır, 4–5 dakikalık seanslar,
her seviyede "3 güçten birini seç" bağımlılık döngüsü ve **kalıcı gelişim (meta)** sayesinde uzun süre oynatır.
Satın alma ve ödüllü reklamın en doğal oturduğu tür (Survivor.io, Archero, Vampire Survivors aynı mekanik ailesi).
Tema ve içerik tamamen özgün: Demirci Kawa, Newroz ateşi ve zalim Dehak efsanesi.

## Çekirdek döngü
1. Sürükle → hareket et. Silahlar **otomatik** saldırır.
2. Düşmanlar kristal düşürür → seviye atla → **3 karttan birini seç** (silah ya da pasif, her biri 5 seviye).
3. 40 sn, 95 sn… **sürü dalgaları**; yarı sürede **seçkin düşman** (hazine sandığı düşürür).
4. Süre bitince boss: **Marê Dehak** (16 halkalı yılan; hücum, halka ateş, yelpaze tükürük; %50 can altında öfke modu).
5. Kazan/kaybet → altın + elmas → kalıcı güçler, yeni kahraman, yeni bölüm.

## İçerik
| | |
|---|---|
| Silahlar | Newroz Ateşi (meşaleden ateş topu), Dövme Çekiçler (dönen çekiçler), Newroz Dalgası (ateş halkası), Birûsk (sekip giden yıldırım) |
| Pasifler | Demir Yürek, Dağ Rüzgârı, Çekim, Kudret, Çabukluk, Bahar Nefesi, Örs Derisi, Keskin Göz |
| Düşmanlar | Imp (hızlı), Ghoul, Wisp (menzilli), Brute (tank), seçkin Brute, boss |
| Kahramanlar | Kawa (ücretsiz), Zîn (300 elmas / Başlangıç Paketi), Şahmaran (650 elmas) |
| Bölümler | Zagros Gecesi → Kül Vadisi → Dehak Kalesi (her biri farklı renk, zorluk ×1 / ×1.9 / ×3.2) |
| Meta | 6 kalıcı güç × 10 seviye (altınla), 7 günlük giriş ödülü, ilk zafer bonusu |

## Gelir modeli (hazır kancalar)
| Ürün (SKU) | Fiyat | İçerik |
|---|---|---|
| `starter_pack` | $2.99 (tek sefer) | 500 elmas + 5.000 altın + Zîn |
| `gems_80` / `gems_500` / `gems_1200` / `gems_3000` | $0.99 / 4.99 / 9.99 / 19.99 | elmas |
| `no_ads` | $3.99 (tek sefer) | ödüllü reklamları atla, ödülü direkt al |

Elmas harcama yerleri: kahraman açma, diriliş (30), kart yenileme (10, her seferinde +10), elmas→altın paketleri.
Ödüllü reklam noktaları: diriliş, ödülü 2× al, mağazada günde 3× 20 elmas.

Sonraki adımda eklenebilecekler: Battle Pass ("Rêya Newrozê" sezon yolu), kahraman kostümleri, silah evrimleri (iki kart 5. seviyede birleşir), enerji sistemi, haftalık etkinlik bölümleri.

## Expo / native entegrasyon
Web tarafı hazır; WebView içinde `window.ReactNativeWebView` varsa demo yerine native'e mesaj atar:
```
{id, type:'iap:buy', sku}      // satın alma
{id, type:'ad:rewarded'}       // ödüllü reklam
{type:'iap:restore'}           // satın alımları geri yükle
```
Native taraf işlemi bitirince: `webview.injectJavaScript("window.__nativeReply(" + id + ", true)")`.
Öneri: satın alma için **RevenueCat** (`react-native-purchases`), reklam için `react-native-google-mobile-ads` (Expo dev build gerekir).

Yayın öncesi: Three.js CDN'den yükleniyor; offline çalışması için Peyvok'taki `tools/build_game.py` gibi bir adımla
three.module.js + addons ve fontlar HTML'e gömülmeli.

## Kayıt
`localStorage["agire-kawa:v1"]` — altın, elmas, kahramanlar, kalıcı güçler, açık bölümler, rekorlar, günlük ödül, ayarlar.

## Test
Masaüstü: WASD/ok tuşları, Esc = duraklat. Mobil: ekranda herhangi bir yerde sürükle.
Konsoldan: `__game.spawnBoss()`, `__game.run.xp=999`.
