import json,subprocess
tl=json.loads(open('timeline.js').read()[len('window.TL='):-1]);T=round(tl['total'],2)
d=json.load(open('shots.json'));sfx=list(d['sfx'])
for typ,a,b in d['shots']:
  if typ in('cavalry','clash','siege'):sfx.append(['army',a])
  if typ=='clash':sfx.append(['clash',a+(b-a)*0.45])
VOL={'whoosh':.2,'boom':.28,'clash':.4,'army':.08,'shimmer':.22}
# ezgi (240 s) + ezgi2 (300 s) çapraz geçişle T'ye uzat
inp=['-i','audio/narration_master.wav','-i','audio/ezgi.mp3','-i','audio/ezgi2.mp3'];f=[]
f.append(f"[1][2]acrossfade=d=8:c1=tri:c2=tri,atrim=0:{T},asetpts=PTS-STARTPTS,afade=t=in:d=1.5,afade=t=out:st={T-4}:d=4,volume=0.32[music]")
f.append("[0]highpass=f=70,equalizer=f=3000:t=q:w=1.2:g=2.5,acompressor=threshold=0.12:ratio=2.5:attack=8:release=180:makeup=1.6,asplit=2[nar][key]")
# konuşurken çok kısık: güçlü sidechain
f.append("[music][key]sidechaincompress=threshold=0.004:ratio=14:attack=40:release=1100:makeup=1[musd]")
fx=[];k=3
for typ,t in sfx:
  if t<0 or t>T: continue
  inp+=['-i',f'../gutiler/audio/sfx_{typ}.mp3'];ms=int(t*1000)
  extra=',afade=t=out:st=2.2:d=1.2' if typ=='army' else ''
  f.append(f"[{k}]volume={VOL[typ]}{extra},adelay={ms}|{ms}[s{k}]");fx.append(f'[s{k}]');k+=1
f.append('[nar][musd]'+''.join(fx)+f"amix=inputs={2+len(fx)}:normalize=0:duration=first,apad=whole_dur={T},atrim=0:{T},loudnorm=I=-14:TP=-1.5:LRA=11[out]")
subprocess.run(['ffmpeg','-y','-loglevel','error',*inp,'-filter_complex',';'.join(f),'-map','[out]','-ar','48000','-ac','2','audio/film_mix.wav'],check=True)
print('mixed',len(fx),'sfx',T)
