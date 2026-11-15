import json,re,urllib.request,base64,subprocess,os,sys
txt=open('SESLENDIRME_METNI.txt').read().split('\n')
chs={};cur=None
for l in txt:
  m=re.match(r'\[(\d\d)\]',l)
  if m: cur='ch'+m.group(1);chs[cur]=[];continue
  if cur and l.strip(): chs[cur].append(l.strip())
for cid,ls in chs.items():
  if os.path.exists(f'audio/{cid}.wav') and '--force' not in sys.argv: continue
  t=' '.join(ls)
  body=json.dumps({'text':t,'model_id':'eleven_v4','voice_settings':{'stability':0.5,'similarity_boost':0.8,'style':0.2}}).encode()
  r=urllib.request.Request('https://api.elevenlabs.io/v1/text-to-speech/aB3kjBYXGX3jTKxg1bsE/with-timestamps?output_format=mp3_44100_192',data=body,headers={'xi-api-key':'dummy','Content-Type':'application/json'})
  d=json.loads(urllib.request.urlopen(r,timeout=300).read())
  open(f'audio/{cid}.mp3','wb').write(base64.b64decode(d['audio_base64']))
  a=d['alignment'];ws=[];w='';s=e=0
  for i,c in enumerate(a['characters']):
    if c==' ':
      if w: ws.append([w,round(s,3),round(e,3)]);w=''
    else:
      if not w: s=a['character_start_times_seconds'][i]
      w+=c;e=a['character_end_times_seconds'][i]
  if w: ws.append([w,round(s,3),round(e,3)])
  json.dump(ws,open(f'audio/{cid}.words.json','w'),ensure_ascii=False)
  subprocess.run(['ffmpeg','-y','-loglevel','error','-i',f'audio/{cid}.mp3','-ar','48000','-ac','1',f'audio/{cid}.wav'],check=True)
  print(cid,len(ws),ws[-1][2],flush=True)
