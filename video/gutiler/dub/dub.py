# Generate dubbed narration per language with ElevenLabs, fitted to the original sentence timings
import json,subprocess,sys,os,concurrent.futures as cf,urllib.request
ROOT='/home/user/peyvok/video/gutiler'
lang=sys.argv[1]
VOICE={'kmr_tgt':'9UoAU5im7Rl44J2IvBHU','en':'aB3kjBYXGX3jTKxg1bsE','ar':'aB3kjBYXGX3jTKxg1bsE','kmr':{'kmr_tgt':'9UoAU5im7Rl44J2IvBHU'},'ckb':'aB3kjBYXGX3jTKxg1bsE'}[lang]
cues=json.load(open(f'{ROOT}/yayin/cues.json'));groups=json.load(open(f'{ROOT}/yayin/groups.json'))
lines=open(f'{ROOT}/yayin/sentences_{lang}.txt').read().strip('\n').split('\n')
tl=json.loads(open(f'{ROOT}/film3/timeline.js').read()[len('window.TL='):-1]);T=tl['total']
P='Ji çiyan pê ve, hevalên me tune.'
D=f'{ROOT}/dub/{lang}';os.makedirs(D,exist_ok=True)
jobs=[]
for k,(g,tx) in enumerate(zip(groups,lines)):
  a=cues[g[0]][0];nxt=cues[groups[k+1][0]][0] if k+1<len(groups) else T-0.3
  if P in tx:
    pre=tx[:tx.index(P)].strip();pb=cues[g[1]]
    jobs.append((k,pre,a,pb[0]-0.05));jobs.append(('prov',None,pb[0]-0.05,pb[1]+0.25))
  else: jobs.append((k,tx,a,nxt))
def tts(job):
  k,tx,a,b=job
  out=f'{D}/{k}.mp3'
  if k=='prov' or os.path.exists(out) and os.path.getsize(out)>1000: return
  if lang=='kmr':
    import time,uuid
    wav=f'{D}/{k}_kt.wav'
    for attempt in range(5):
      try:
        if not os.path.exists(wav) or os.path.getsize(wav)<1000:
          r=urllib.request.Request('https://www.kurdishtts.com/api/tts-proxy',data=json.dumps({'text':tx,'speaker_id':'kurmanji_236','model_version':'v4'}).encode(),headers={'Content-Type':'application/json'})
          open(wav,'wb').write(urllib.request.urlopen(r,timeout=180).read())
        b='----'+uuid.uuid4().hex;audio=open(wav,'rb').read()
        body=(f'--{b}\r\nContent-Disposition: form-data; name="model_id"\r\n\r\neleven_multilingual_sts_v2\r\n--{b}\r\nContent-Disposition: form-data; name="audio"; filename="a.wav"\r\nContent-Type: audio/wav\r\n\r\n').encode()+audio+f'\r\n--{b}--\r\n'.encode()
        r=urllib.request.Request(f"https://api.elevenlabs.io/v1/speech-to-speech/{'9UoAU5im7Rl44J2IvBHU'}?output_format=mp3_44100_192",data=body,headers={'xi-api-key':'dummy','Content-Type':f'multipart/form-data; boundary={b}'})
        open(out,'wb').write(urllib.request.urlopen(r,timeout=240).read());return
      except Exception as e:
        print('retry',k,e,flush=True);time.sleep(5*(attempt+1))
    raise SystemExit(f'failed {k}')
  body=json.dumps({'text':tx,'model_id':'eleven_v4','voice_settings':{'stability':0.5,'similarity_boost':0.8,'style':0.15}}).encode()
  for attempt in range(5):
    try:
      r=urllib.request.Request(f'https://api.elevenlabs.io/v1/text-to-speech/{VOICE}?output_format=mp3_44100_192',data=body,headers={'xi-api-key':'dummy','Content-Type':'application/json'})
      open(out,'wb').write(urllib.request.urlopen(r,timeout=180).read());return
    except Exception as e:
      import time;print('retry',k,e,flush=True);time.sleep(4*(attempt+1))
  raise SystemExit(f'failed {k}')
with cf.ThreadPoolExecutor(3) as ex: list(ex.map(tts,jobs))
def dur(f): return float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',f]))
# chapters: anchor each chapter's narration to its original start; place sentences back to back, uniform tempo per chapter if needed
chs=[c for c in tl['chapters'] if c.get('words')]
bounds=[(c['start']+c['words'][0][1]) for c in chs]
def chap(t): return max(i for i,b in enumerate(bounds) if b<=t+0.01)
items=[]
for k,tx,a,b in jobs:
  if k=='prov': items.append(dict(k=k,a=a,d=b-a,fixed=True))
  else:
    f=f'{D}/{k}.mp3'
    items.append(dict(k=k,a=a,d=dur(f),fixed=False,f=f))
GAP=0.28
report=[];place=[];tcarry=0
for ci in range(len(bounds)):
  its=[it for it in items if chap(it['a'])==ci]
  if not its: continue
  start=max(bounds[ci],tcarry);end=(bounds[ci+1]-0.6) if ci+1<len(bounds) else T-0.5
  # tempo so that natural back-to-back length fits the chapter span (ignoring fixed items' own length)
  need=sum(it['d'] for it in its if not it['fixed'])+GAP*(len(its)-1)
  room=end-start-sum(it['d'] for it in its if it['fixed'])
  tempo=max(1.0,min(1.35,need/room))
  t=start
  for it in its:
    if it['fixed']: t=max(t,it['a']);place.append((it,t,1.0));t+=it['d']+GAP;continue
    t=max(t,it['a']-0.4) if False else max(t,min(it['a'],t+1.2)) if t<it['a'] else t
    place.append((it,t,tempo));t+=it['d']/tempo+GAP
  tcarry=t
  report.append((ci,round(need,1),round(room,1),round(tempo,3),round(t-end,2)))
inp=[];flt=[];n=0
for it,t,tempo in place:
  if it['fixed']:
    inp+=['-ss',f"{it['a']:.3f}",'-t',f"{it['d']:.3f}",'-i',f'{ROOT}/film3/audio/narration_master.wav'];chain='anull'
  else:
    inp+=['-i',it['f']];chain=f'atempo={tempo:.4f}' if tempo>1.001 else 'anull'
  ms=int(max(t,0)*1000);flt.append(f'[{n}]aresample=48000,aformat=channel_layouts=mono,{chain},adelay={ms}[d{n}]');n+=1
flt.append(''.join(f'[d{i}]' for i in range(n))+f'amix=inputs={n}:normalize=0:duration=longest,apad=whole_dur={T:.3f},atrim=0:{T:.3f}[o]')
open(f'{D}/filter.txt','w').write(';'.join(flt))
subprocess.run(['ffmpeg','-y','-loglevel','error',*inp,'-filter_complex_script',f'{D}/filter.txt','-map','[o]','-ar','48000','-ac','1',f'{D}/narration_{lang}.wav'],check=True)
print(lang,'chapters (idx,need,room,tempo,overrun):',report,flush=True)
json.dump(report,open(f'{D}/report.json','w'))
