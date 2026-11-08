import json,base64,urllib.request
L=json.load(open("lines.json"));out=[]
for i,t in enumerate(L):
    req=urllib.request.Request("https://api.elevenlabs.io/v1/text-to-speech/aB3kjBYXGX3jTKxg1bsE/with-timestamps?output_format=mp3_44100_128",
      data=json.dumps({"text":t,"model_id":"eleven_multilingual_v2","language_code":"tr","voice_settings":{"stability":0.55,"similarity_boost":0.8,"style":0.25}}).encode(),
      headers={"xi-api-key":"x","Content-Type":"application/json"})
    d=json.load(urllib.request.urlopen(req))
    open(f"v{i}.mp3","wb").write(base64.b64decode(d["audio_base64"]))
    out.append(d["alignment"]);print(i,d["alignment"]["character_end_times_seconds"][-1])
json.dump(out,open("align.json","w"))
