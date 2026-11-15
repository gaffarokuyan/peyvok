# Annazîler: dubbed narration (en/de/fr/ar/kmr/ckb) aligned to the Turkish film timeline
import json,os,sys,subprocess,urllib.request,concurrent.futures as cf,time
D=os.path.dirname(os.path.abspath(__file__));os.chdir(D)
S=json.load(open('sents.json'));tl=json.loads(open('../timeline.js').read()[len('window.TL='):-1]);T=tl['total']
LANGS=['en','de','fr','ar','kmr','ckb']
L={l:open(f'{l}.txt').read().strip('\n').split('\n') for l in LANGS}
for l in L: assert len(L[l])==len(S),(l,len(L[l]))
VOICE={'en':'NNl6r8mD7vthiJatiJt1','de':'kkJxCnlRCckmfFvzDW5Q','fr':'aQROLel5sQbj1vuIVi6B','ar':'aB3kjBYXGX3jTKxg1bsE','kmr':'9UoAU5im7Rl44J2IvBHU','ckb':'aB3kjBYXGX3jTKxg1bsE'}
NUM={'kmr':[('sala 990î','sala neh sed û nodî'),('sala 1014an','sala hezar û çardehan'),('sala 1046an','sala hezar û çil û şeşan'),('sala 1117an','sala hezar û sed û hevdehan')],
     'ckb':[('ساڵی ٩٩٠دا','ساڵی نۆسەد و نەوەددا'),('ساڵی ١٠١٤دا','ساڵی هەزار و چواردەدا'),('ساڵی ١٠٤٦دا','ساڵی هەزار و چل و شەشدا'),('ساڵی ١١١٧دا','ساڵی هەزار و سەد و حەڤدەدا')]}
def ttstext(lang,i):
  tx=L[lang][i].replace('Dîrok','Dirok')
  for a,b in NUM.get(lang,[]): tx=tx.replace(a,b)
  return tx
def dub(lang):
  DD=f'dub_{lang}';os.makedirs(DD,exist_ok=True)
  def tts(i):
    out=f'{DD}/{i}.mp3'
    if os.path.exists(out) and os.path.getsize(out)>1000: return
    body=json.dumps({'text':ttstext(lang,i),'model_id':'eleven_v4','voice_settings':{'stability':0.5,'similarity_boost':0.8,'style':0.2}}).encode()
    for at in range(6):
      try:
        r=urllib.request.Request(f'https://api.elevenlabs.io/v1/text-to-speech/{VOICE[lang]}?output_format=mp3_44100_192',data=body,headers={'xi-api-key':'proxy-injected','Content-Type':'application/json'})
        open(out,'wb').write(urllib.request.urlopen(r,timeout=180).read());return
      except Exception as e: print('retry',lang,i,e,flush=True);time.sleep(5*(at+1))
    raise SystemExit(f'failed {lang} {i}')
  with cf.ThreadPoolExecutor(4) as ex: list(ex.map(tts,range(len(S))))
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
  json.dump(place,open(f'{DD}/place.json','w'))
  print(lang,'dub (chapter,tempo,overrun):',rep,flush=True)
for l in LANGS:
  if l in sys.argv: dub(l)
