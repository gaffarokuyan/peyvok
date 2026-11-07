"""Bolumleri ElevenLabs Eleven v4 + Yunus C sesiyle uretir -> build/tts/<bolum>.mp3

ElevenLabs anahtari ortamdan/proxy'den gelir (xi-api-key basligi). Ornek:
    ELEVENLABS_API_KEY=... python3 narration/generate_tts.py [bolum ...]

Uzun bolumler (MAXC karakterden uzun) paragraf paragraf parcalara bolunur, her parca
onceki/sonraki metin baglamiyla uretilir ve parcalar kisa bir sessizlikle birlestirilir.
"""
import os, sys, re, subprocess, time, requests

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from sections import SECTIONS  # noqa: E402

OUT = os.path.join(HERE, "..", "build", "tts")
os.makedirs(OUT, exist_ok=True)
HEADERS = {"xi-api-key": os.environ["ELEVENLABS_API_KEY"]} if os.environ.get("ELEVENLABS_API_KEY") else {}
URL = "https://api.elevenlabs.io/v1/text-to-speech/aB3kjBYXGX3jTKxg1bsE?output_format=mp3_44100_192"
MAXC = 2200


def clean(t):
    return re.sub(r"\s*<break[^>]*/>", "", t)


def tts(text, prev, nxt):
    body = {"text": text, "model_id": "eleven_v4", "language_code": "tr", "previous_text": prev, "next_text": nxt}
    for attempt in range(4):
        r = requests.post(URL, json=body, headers=HEADERS, timeout=300)
        if r.status_code == 200:
            return r.content
        if "previous_text" in r.text:
            body.pop("previous_text", None); body.pop("next_text", None)
            continue
        print("  hata", r.status_code, r.text[:200], "- tekrar deneniyor")
        time.sleep(5 * (attempt + 1))
    raise SystemExit(f"TTS basarisiz: {r.status_code} {r.text[:300]}")


def chunks(raw):
    """Paragraflari (satir sonlari) MAXC sinirina gore gruplar."""
    paras = [clean(p).strip() for p in raw.split("\n") if clean(p).strip()]
    out, cur = [], ""
    for p in paras:
        if cur and len(cur) + 1 + len(p) > MAXC:
            out.append(cur); cur = p
        else:
            cur = (cur + " " + p).strip()
    if cur:
        out.append(cur)
    return out


S = [(n, t) for n, t in SECTIONS]
ONLY = sys.argv[1:]
for i, (n, raw) in enumerate(S):
    if ONLY and n not in ONLY:
        continue
    prev_sec = clean(S[i - 1][1])[-300:] if i else None
    next_sec = clean(S[i + 1][1])[:300] if i + 1 < len(S) else None
    parts = chunks(raw)
    files = []
    for k, c in enumerate(parts):
        prev = parts[k - 1][-300:] if k else prev_sec
        nxt = parts[k + 1][:300] if k + 1 < len(parts) else next_sec
        f = os.path.join(OUT, f"{n}.part{k}.mp3")
        open(f, "wb").write(tts(c, prev, nxt))
        files.append(f)
    dst = os.path.join(OUT, f"{n}.mp3")
    if len(files) == 1:
        os.replace(files[0], dst)
    else:
        sil = os.path.join(OUT, "_gap.mp3")
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "lavfi", "-i", "anullsrc=r=44100:cl=mono", "-t", "0.45",
                        "-c:a", "libmp3lame", "-b:a", "192k", sil], check=True)
        lst = os.path.join(OUT, f"{n}.list.txt")
        with open(lst, "w") as fh:
            for k, f in enumerate(files):
                fh.write(f"file '{f}'\n")
                if k < len(files) - 1:
                    fh.write(f"file '{sil}'\n")
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", lst, "-ac", "1", "-ar",
                        "44100", "-c:a", "libmp3lame", "-b:a", "192k", dst], check=True)
        for f in files + [lst]:
            os.remove(f)
    print(n, "ok", f"({len(parts)} parca)")
