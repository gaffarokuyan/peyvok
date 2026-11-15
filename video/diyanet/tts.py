import json,urllib.request,base64
t=open('metin.txt').read().strip()
body=json.dumps({'text':t,'model_id':'eleven_v4','voice_settings':{'stability':0.35,'similarity_boost':0.8,'style':0.55}}).encode()
r=urllib.request.Request('https://api.elevenlabs.io/v1/text-to-speech/aB3kjBYXGX3jTKxg1bsE/with-timestamps?output_format=mp3_44100_192',data=body,headers={'xi-api-key':'proxy-injected','Content-Type':'application/json'})
d=json.loads(urllib.request.urlopen(r,timeout=300).read());open('audio/nar.mp3','wb').write(base64.b64decode(d['audio_base64']))
a=d['alignment'];ws=[];w='';s=e=0
for i,c in enumerate(a['characters']):
  if c==' ':
    if w: ws.append([w,round(s,3),round(e,3)]);w=''
  else:
    if not w: s=a['character_start_times_seconds'][i]
    w+=c;e=a['character_end_times_seconds'][i]
if w: ws.append([w,round(s,3),round(e,3)])
open('words.js','w').write('window.WORDS='+json.dumps(ws,ensure_ascii=False)+';');print(len(ws),ws[-1][2])
