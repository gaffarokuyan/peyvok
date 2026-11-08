# Kassites: subtitles (tr/en/ar) + dubbed narration (en/ar) aligned to the Turkish film timeline
import json,html,itertools,math,sys,os,subprocess,urllib.request,concurrent.futures as cf,time
D=os.path.dirname(os.path.abspath(__file__));os.chdir(D)
S=json.load(open('sents.json'));tl=json.loads(open('../timeline.js').read()[len('window.TL='):-1]);T=tl['total']
L={l:open(f'{l}.txt').read().strip('\n').split('\n') for l in ['en','ar','kmr','ckb']};L['tr']=[' '.join(x[0] for x in s['w']) for s in S]
for l in L: assert len(L[l])==len(S),(l,len(L[l]))
def wrap(s,lim=42):
  if len(s)<=lim: return s
  ws=s.split();n=min(len(ws),max(2,math.ceil(len(s)/(lim+2))));best=None
  for cuts in itertools.combinations(range(1,len(ws)),n-1):
    b=(0,)+cuts+(len(ws),);ls=[' '.join(ws[b[i]:b[i+1]]) for i in range(n)];sc=max(map(len,ls))
    if best is None or sc<best[0]: best=(sc,ls)
  return '\n'.join(best[1])
def ts(x): ms=int(round(x*1000));return f"{ms//3600000:02}:{ms//60000%60:02}:{ms//1000%60:02},{ms%1000:03}"
# turkish cue chunks per sentence
groups=[]
for s in S:
  ws=s['w'];cues=[];cur=[]
  for j,x in enumerate(ws):
    cur.append(x);txt=' '.join(y[0] for y in cur);nl=len(txt)+1+len(ws[j+1][0]) if j+1<len(ws) else 0
    if j==len(ws)-1 or (x[0][-1] in ',:;' and len(txt)>24) or nl>78: cues.append(cur);cur=[]
  groups.append(cues)
HEAD='''<?xml version="1.0" encoding="utf-8"?>
<timedtext format="3">
<head>
<pen id="1" b="1" fc="#FFFFFF" fo="254" bc="#140804" bo="170" et="4" ec="#000000" fs="4" sz="110"/>
<pen id="2" b="1" i="1" fc="#FFD65A" fo="254" bc="#140804" bo="190" et="4" ec="#000000" fs="4" sz="115"/>
<wp id="1" ap="7" ah="50" av="92"/>
<ws id="1" ju="2"/>
</head>
<body>
'''
def subs():
  os.makedirs('out',exist_ok=True)
  for lang in ['tr','en','ar','kmr','ckb']:
    cues=[]
    for g,tx in zip(groups,L[lang]):
      tx=tx.replace('Dirok','Dîrok');ws=tx.split()
      if lang=='tr': parts=[' '.join(x[0] for x in c) for c in g]
      else:
        lens=[len(' '.join(x[0] for x in c)) for c in g];tot=sum(lens);cum=0;cuts=[]
        for Ln in lens[:-1]: cum+=Ln;cuts.append(round(len(ws)*cum/tot))
        prev=0;fx=[]
        for q,c in enumerate(cuts): c=max(c,prev+1);c=min(c,len(ws)-(len(cuts)-q));fx.append(c);prev=c
        b=[0]+fx+[len(ws)];parts=[' '.join(ws[b[q]:b[q+1]]) for q in range(len(g))]
      for c,pt in zip(g,parts): cues.append([c[0][1],c[-1][2],pt])
    for i,c in enumerate(cues):
      nxt=cues[i+1][0] if i+1<len(cues) else c[1]+1.5
      c[1]=min(max(c[1]+.3,c[0]+1.0),nxt-.04)
    quote=lambda t: t.strip().startswith(('"','“')) or 'kırk mina' in t or 'forty minas' in t or 'أربعين' in t or 'çil mîna' in t or 'چل مینا' in t
    open(f'out/dirok_kassitler_{lang}.srt','w').write('\n'.join(f"{i+1}\n{ts(a)} --> {ts(b)}\n{wrap(t)}\n" for i,(a,b,t) in enumerate(cues)))
    open(f'out/dirok_kassitler_{lang}.ytt','w').write(HEAD+'\n'.join(f'<p t="{int(a*1000)}" d="{int((b-a)*1000)}" wp="1" ws="1"><s p="{2 if quote(t) else 1}">{html.escape(wrap(t),quote=False)}</s></p>' for a,b,t in cues)+'\n</body>\n</timedtext>\n')
    print(lang,'subs',len(cues))
def dub(lang):
  DD=f'dub_{lang}';os.makedirs(DD,exist_ok=True)
  def tts(i):
    out=f'{DD}/{i}.mp3'
    if os.path.exists(out) and os.path.getsize(out)>1000: return
    tx=L[lang][i].replace('Dîrok','Dirok').replace("'",'')
    if lang=='kmr' and not os.path.exists(f'{DD}/NOKT'):
      import uuid
      wav=f'{DD}/{i}_kt.wav'
      for at in range(5):
        try:
          if not os.path.exists(wav) or os.path.getsize(wav)<1000:
            r=urllib.request.Request('https://www.kurdishtts.com/api/tts-proxy',data=json.dumps({'text':tx,'speaker_id':'kurmanji_236','model_version':'v4','speed':1.2}).encode(),headers={'Content-Type':'application/json'})
            open(wav,'wb').write(urllib.request.urlopen(r,timeout=180).read())
          b='----'+uuid.uuid4().hex;audio=open(wav,'rb').read()
          body=(f'--{b}\r\nContent-Disposition: form-data; name="model_id"\r\n\r\neleven_multilingual_sts_v2\r\n--{b}\r\nContent-Disposition: form-data; name="audio"; filename="a.wav"\r\nContent-Type: audio/wav\r\n\r\n').encode()+audio+f'\r\n--{b}--\r\n'.encode()
          r=urllib.request.Request('https://api.elevenlabs.io/v1/speech-to-speech/9UoAU5im7Rl44J2IvBHU?output_format=mp3_44100_192',data=body,headers={'xi-api-key':'dummy','Content-Type':f'multipart/form-data; boundary={b}'})
          open(out,'wb').write(urllib.request.urlopen(r,timeout=240).read());return
        except urllib.error.HTTPError as e:
          print('kt err',i,e.code,e.read()[:200],flush=True)
          if e.code in (401,402,403,429) and 'kurdishtts' in e.url: open(f'{DD}/NOKT','w').write(str(e.code));break
          time.sleep(5*(at+1))
        except Exception as e: print('retry',i,e,flush=True);time.sleep(5*(at+1))
    VO='9UoAU5im7Rl44J2IvBHU' if lang=='kmr' else 'aB3kjBYXGX3jTKxg1bsE'
    body=json.dumps({'text':tx,'model_id':'eleven_v4','voice_settings':{'stability':0.5,'similarity_boost':0.8,'style':0.15}}).encode()
    for at in range(6):
      try:
        r=urllib.request.Request('https://api.elevenlabs.io/v1/text-to-speech/'+VO+'?output_format=mp3_44100_192',data=body,headers={'xi-api-key':'dummy','Content-Type':'application/json'})
        open(out,'wb').write(urllib.request.urlopen(r,timeout=180).read());return
      except Exception as e: print('retry',i,e,flush=True);time.sleep(5*(at+1))
    raise SystemExit(f'failed {i}')
  with cf.ThreadPoolExecutor(3) as ex: list(ex.map(tts,range(len(S))))
  dur=lambda f: float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',f]))
  chs=[c for c in tl['chapters'] if c.get('words')];bounds={c['id']:c['start']+c['words'][0][1] for c in chs}
  ids=[c['id'] for c in chs];nextb={ids[k]:(bounds[ids[k+1]]-0.6 if k+1<len(ids) else tl['credits']-0.5) for k in range(len(ids))}
  place=[];tcarry=0;GAP=0.3;rep=[]
  for cid in ids:
    idx=[i for i,s in enumerate(S) if s['ch']==cid];ds={i:dur(f'{DD}/{i}.mp3') for i in idx}
    start=max(bounds[cid],tcarry);end=nextb[cid];need=sum(ds.values())+GAP*(len(idx)-1);tempo=max(1.0,min(1.3,need/(end-start)))
    t=start
    for i in idx:
      t=max(t,min(S[i]['w'][0][1],t+1.0));place.append((i,t,tempo));t+=ds[i]/tempo+GAP
    tcarry=t;rep.append((cid,round(tempo,3),round(t-end,2)))
  inp=[];flt=[]
  for n,(i,t,tempo) in enumerate(place):
    inp+=['-i',f'{DD}/{i}.mp3'];ch='atempo=%.4f'%tempo if tempo>1.001 else 'anull'
    flt.append(f'[{n}]aresample=48000,aformat=channel_layouts=mono,{ch},adelay={int(t*1000)}[d{n}]')
  flt.append(''.join(f'[d{n}]' for n in range(len(place)))+f'amix=inputs={len(place)}:normalize=0:duration=longest,apad=whole_dur={T:.3f},atrim=0:{T:.3f}[o]')
  open(f'{DD}/filter.txt','w').write(';'.join(flt))
  subprocess.run(['ffmpeg','-y','-loglevel','error',*inp,'-filter_complex_script',f'{DD}/filter.txt','-map','[o]','-ar','48000','-ac','1',f'{DD}/narration.wav'],check=True)
  print(lang,'dub (chapter,tempo,overrun):',rep,flush=True)
if 'subs' in sys.argv: subs()
for l in ['en','ar','kmr','ckb']:
  if l in sys.argv: dub(l)
