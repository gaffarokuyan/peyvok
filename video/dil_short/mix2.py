import json,subprocess
d=json.load(open('sfx2.json'));T=d['total'];OFF=0.5
VOL={'whoosh':.22,'boom':.32,'clash':.55,'shimmer':.25}
inp=['-i','audio/nar2.mp3','-stream_loop','2','-i','../gutiler/film/audio/m1_mystic.mp3'];f=[]
f.append(f"[0]adelay={int(OFF*1000)}|{int(OFF*1000)},highpass=f=70,equalizer=f=3000:t=q:w=1.2:g=2.5,acompressor=threshold=0.12:ratio=2.5:attack=8:release=180:makeup=1.6,asplit=2[nar][key]")
f.append(f"[1]atrim=0:{T},asetpts=PTS-STARTPTS,afade=t=in:d=0.6,afade=t=out:st={T-2.2}:d=2.2,volume=0.2[mus]")
f.append("[mus][key]sidechaincompress=threshold=0.008:ratio=5:attack=50:release=700:makeup=1[musd]")
fx=[];k=2
for typ,t in d['sfx']:
  if t<0 or t>T: continue
  inp+=['-i',f'../gutiler/audio/sfx_{typ}.mp3'];ms=int(t*1000);f.append(f"[{k}]volume={VOL[typ]},adelay={ms}|{ms}[s{k}]");fx.append(f'[s{k}]');k+=1
f.append('[nar][musd]'+''.join(fx)+f"amix=inputs={2+len(fx)}:normalize=0:duration=longest,apad=whole_dur={T},atrim=0:{T},loudnorm=I=-14:TP=-1.5:LRA=11[out]")
subprocess.run(['ffmpeg','-y','-loglevel','error',*inp,'-filter_complex',';'.join(f),'-map','[out]','-ar','48000','-ac','2','audio/short2_mix.wav'],check=True);print('ok',T)
