import json,os,subprocess,urllib.request,concurrent.futures as cf,time,sys
os.chdir(os.path.dirname(os.path.abspath(__file__)))
S=json.load(open('sents.json'));lang=sys.argv[1] if len(sys.argv)>1 else 'ar'
L=open(f'{lang}.txt').read().strip('\n').split('\n');assert len(L)==len(S),(len(L),len(S))
VO={'ar':'aB3kjBYXGX3jTKxg1bsE'}[lang];T=json.load(open('../sfx.json'))['total'];DD=f'dub_{lang}';os.makedirs(DD,exist_ok=True)
def tts(i):
  out=f'{DD}/{i}.mp3'
  if os.path.exists(out) and os.path.getsize(out)>1000: return
  body=json.dumps({'text':L[i],'model_id':'eleven_v4','voice_settings':{'stability':0.35,'similarity_boost':0.8,'style':0.15}}).encode()
  for at in range(6):
    try:
      r=urllib.request.Request(f'https://api.elevenlabs.io/v1/text-to-speech/{VO}?output_format=mp3_44100_192',data=body,headers={'xi-api-key':'proxy-injected','Content-Type':'application/json'})
      open(out+'.raw.mp3','wb').write(urllib.request.urlopen(r,timeout=180).read());subprocess.run(['ffmpeg','-y','-loglevel','error','-i',out+'.raw.mp3','-af','silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.05,areverse,silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.08,areverse','-c:a','libmp3lame','-b:a','192k',out],check=True);return
    except Exception as e: print('retry',i,e,flush=True);time.sleep(4*(at+1))
  raise SystemExit(f'fail {i}')
with cf.ThreadPoolExecutor(4) as ex: list(ex.map(tts,range(len(S))))
dur=lambda f: float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',f]))
place=[];t=0;rep=[]
for i,s in enumerate(S):
  st=max(s[0][1],t);nxt=S[i+1][0][1] if i+1<len(S) else T-2.5;d=dur(f'{DD}/{i}.mp3')
  tempo=max(1.0,min(1.3,d/max(.3,nxt-st-.08)));place.append((i,st,tempo));t=st+d/tempo+.08;rep.append(round(t-nxt,2))
inp=[];flt=[]
for n,(i,st,tempo) in enumerate(place):
  inp+=['-i',f'{DD}/{i}.mp3'];flt.append(f"[{n}]aresample=48000,aformat=channel_layouts=mono,{'atempo=%.4f'%tempo if tempo>1.001 else 'anull'},adelay={int(st*1000)}[d{n}]")
flt.append(''.join(f'[d{n}]' for n in range(len(place)))+f'amix=inputs={len(place)}:normalize=0:duration=longest,apad=whole_dur={T:.3f},atrim=0:{T:.3f}[o]')
open(f'{DD}/filter.txt','w').write(';'.join(flt))
subprocess.run(['ffmpeg','-y','-loglevel','error',*inp,'-filter_complex_script',f'{DD}/filter.txt','-map','[o]','-ar','48000','-ac','1',f'{DD}/narration.wav'],check=True)
json.dump(place,open(f'{DD}/place.json','w'));print('tempos',[round(p[2],2) for p in place]);print('overrun',rep)
