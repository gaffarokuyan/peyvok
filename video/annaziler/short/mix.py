import json,subprocess
d=json.load(open('sfx.json'));T=d['total'];OFF=0.6
VOL={'whoosh':.16,'boom':.3,'clash':.45,'army':.09,'shimmer':.25}
inp=['-i','audio/nar.wav','-i','audio/music.mp3'];f=[]
f.append(f"[0]adelay={int(OFF*1000)},highpass=f=70,equalizer=f=3000:t=q:w=1.2:g=2.5,acompressor=threshold=0.12:ratio=2.5:attack=8:release=180:makeup=1.7,asplit=2[nar][key]")
f.append(f"[1]atrim=0:{T},asetpts=PTS-STARTPTS,afade=t=out:st={T-1.5}:d=1.5,volume=0.42[mus]")
f.append("[mus][key]sidechaincompress=threshold=0.005:ratio=12:attack=30:release=600:makeup=1[musd]")
fx=[];k=2
for typ,t in d['sfx']:
  if t<0 or t>T: continue
  inp+=['-i',f'../../gutiler/audio/sfx_{typ}.mp3'];ms=int(t*1000)
  extra=',afade=t=out:st=1.5:d=1' if typ=='army' else ''
  f.append(f"[{k}]volume={VOL[typ]}{extra},adelay={ms}|{ms}[s{k}]");fx.append(f'[s{k}]');k+=1
f.append('[nar][musd]'+''.join(fx)+f"amix=inputs={2+len(fx)}:normalize=0:duration=longest,apad=whole_dur={T},atrim=0:{T},loudnorm=I=-14:TP=-1.5:LRA=11[out]")
subprocess.run(['ffmpeg','-y','-loglevel','error',*inp,'-filter_complex',';'.join(f),'-map','[out]','-ar','48000','-ac','2','audio/mix.wav'],check=True);print('ok',T,len(fx))
