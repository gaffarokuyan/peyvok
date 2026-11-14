import json,subprocess,sys
NAR=sys.argv[1] if len(sys.argv)>1 else 'audio/nar.wav';NOFF=float(sys.argv[2]) if len(sys.argv)>2 else 0.6;OUT=sys.argv[3] if len(sys.argv)>3 else 'audio/mix.wav'
d=json.load(open('sfx.json'));T=d['total'];OFF=0.6
VOL={'whoosh':.18,'boom':.3,'shimmer':.25,'applause':.45,'rimshot':.6,'cough':.75,'drip':.55,'scratch':.5,'ding':.4,'buzz':.4,'stamp':.6,'pop':.35,'tape':.6,'trombone':.5,'tick':.4}
LOC={k:f'audio/sfx_{k}.mp3' for k in VOL};LOC.update({k:f'../gutiler/audio/sfx_{k}.mp3' for k in ['whoosh','boom','shimmer']})
inp=['-i',NAR,'-i','audio/music.mp3'];f=[]
f.append(f"[0]adelay={int(NOFF*1000)},highpass=f=70,equalizer=f=3000:t=q:w=1.2:g=2.5,acompressor=threshold=0.12:ratio=2.5:attack=8:release=180:makeup=1.7,asplit=2[nar][key]")
f.append(f"[1]atrim=0:{T},asetpts=PTS-STARTPTS,afade=t=out:st={T-2}:d=2,volume=0.38[mus]")
f.append("[mus][key]sidechaincompress=threshold=0.006:ratio=8:attack=30:release=500:makeup=1[musd]")
fx=[];k=2
for typ,t in d['sfx']:
  if t<0 or t>T: continue
  inp+=['-i',LOC[typ]];ms=int(t*1000)
  f.append(f"[{k}]volume={VOL[typ]},adelay={ms}|{ms}[s{k}]");fx.append(f'[s{k}]');k+=1
f.append('[nar][musd]'+''.join(fx)+f"amix=inputs={2+len(fx)}:normalize=0:duration=longest,apad=whole_dur={T},atrim=0:{T},loudnorm=I=-14:TP=-1.5:LRA=11[out]")
subprocess.run(['ffmpeg','-y','-loglevel','error',*inp,'-filter_complex',';'.join(f),'-map','[out]','-ar','48000','-ac','2',OUT],check=True);print('ok',T,len(fx))
