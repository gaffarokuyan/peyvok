# Dîrok — Gutiler videosu

- `SENARYO.md` — 15–20 dk'lık videonun tam anlatım metni, sahne notları ve kaynakça
- `out/dirok_gutiler_demo.mp4` — 30 sn demo (1080p30)
- `audio/` — Yunus C seslendirmesi (ElevenLabs), müzik ve ses efektleri
- `render/` — kodla üretilen animasyonlar (Canvas + Playwright + ffmpeg)

Yeniden render:
```bash
cd render && npm install && node prep.mjs
node render.mjs video 0 30 ../out/demo_silent.mp4
```
