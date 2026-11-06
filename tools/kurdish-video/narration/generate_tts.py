"""Bolumleri ElevenLabs Eleven v4 + Yunus C sesiyle uretir -> build/tts/<bolum>.mp3

ElevenLabs anahtari ortamdan/proxy'den gelir (xi-api-key basligi). Ornek:
    ELEVENLABS_API_KEY=... python3 narration/generate_tts.py
"""
import os, sys, re, requests
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from sections import SECTIONS
OUT = os.path.join(HERE, "..", "build", "tts")
os.makedirs(OUT, exist_ok=True)
HEADERS = {"xi-api-key": os.environ["ELEVENLABS_API_KEY"]} if os.environ.get("ELEVENLABS_API_KEY") else {}
S=[(n, re.sub(r'\s*<break[^>]*/>', '', t)) for n,t in SECTIONS]
for i,(n,t) in enumerate(S):
    body={"text":t,"model_id":"eleven_v4","language_code":"tr",
          "previous_text":S[i-1][1][-300:] if i else None,
          "next_text":S[i+1][1][:300] if i+1<len(S) else None}
    r=requests.post("https://api.elevenlabs.io/v1/text-to-speech/aB3kjBYXGX3jTKxg1bsE?output_format=mp3_44100_192",json=body,headers=HEADERS,timeout=300)
    if r.status_code!=200 and "previous_text" in r.text:
        body.pop("previous_text"); body.pop("next_text")
        r=requests.post("https://api.elevenlabs.io/v1/text-to-speech/aB3kjBYXGX3jTKxg1bsE?output_format=mp3_44100_192",json=body,headers=HEADERS,timeout=300)
    if r.status_code!=200: print(n,r.status_code,r.text[:300]); sys.exit(1)
    open(os.path.join(OUT, f"{n}.mp3"),"wb").write(r.content); print(n,"ok")
