import json,subprocess
tl=json.loads(open('timeline.js').read()[len('window.TL='):-1]);T=round(tl['total'],2)
sfx=[]
for c in tl['chapters']:
  if c.get('card') is not None: sfx+=[('whoosh',c['card']),('boom',c['card']+.15)]
sfx+=[('shimmer',tl['logo']-.6),('boom',tl['logo'])]
VOL={'whoosh':.22,'boom':.3,'shimmer':.25}
inp=['-i','audio/narration_master.wav','-i','audio/score.wav'];f=[];k=2;fx=[]
f.append("[0]highpass=f=70,equalizer=f=3000:t=q:w=1.2:g=2,acompressor=threshold=0.12:ratio=2.5:attack=8:release=180:makeup=1.6,asplit=2[nar][key]")
f.append("[1]volume=0.5[mus];[mus][key]sidechaincompress=threshold=0.01:ratio=5:attack=60:release=900:makeup=1[musd]")
for typ,t in sfx:
  inp+=['-i',f'../gutiler/audio/sfx_{typ}.mp3'];ms=int(t*1000);f.append(f"[{k}]volume={VOL[typ]},adelay={ms}|{ms}[s{k}]");fx.append(f'[s{k}]');k+=1
f.append('[nar][musd]'+''.join(fx)+f"amix=inputs={2+len(fx)}:normalize=0:duration=first,atrim=0:{T},loudnorm=I=-14:TP=-1.5:LRA=11[out]")
subprocess.run(['ffmpeg','-y','-loglevel','error',*inp,'-filter_complex',';'.join(f),'-map','[out]','-ar','48000','-ac','2','audio/film_mix.wav'],check=True);print('mixed',T)
