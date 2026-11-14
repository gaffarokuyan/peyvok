# Dîrok — Gutiler ve Zagros'un Kadim Halkları

| Dosya | Açıklama |
|---|---|
| `SENARYO.md` | ~19 dakikalık uzun videonun tam metni ve kaynakçası |
| `film/` | Uzun video: bölüm sesleri (Yunus C), müzikler, zaman çizelgesi, miksaj betiği |
| `render/film*.js` | Uzun videonun animasyon motoru (harita, savaşlar, eserler, soy ağacı…) |
| `short/` | 40 sn dikey Short |
| `out/` | 30 sn ilk demo + dikey kapak görseli |

## Uzun videoyu yeniden üretmek
```bash
cd render && npm install && node prep.mjs
python3 relief.py <terrarium-tiles-dir>          # kabartma harita (relief.jpg)
cd ../film && python3 build_timeline.py           # zaman çizelgesi + anlatım
cd ../render && node probe.mjs                     # sahne/cue kontrolü
PAGE=film.html FPS=25 node render.mjs video 0 1127 ../film/out/film_silent.mp4
cd ../film && python3 mix_audio.py                 # müzik + efekt + anlatım miksajı
```
