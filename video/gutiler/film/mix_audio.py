import json, subprocess
tl=json.loads(open('timeline.js').read()[len('window.TL='):-1]); T=1127.0
cards={c['id']:c.get('card') for c in tl['chapters']}
MUS=[('m1_mystic',0,cards['ch03']),('m2_war',cards['ch03'],cards['ch05s']),('m3_royal',cards['ch05s'],cards['ch08']),('m4_empire',cards['ch08'],cards['ch09']),('m5_reflect',cards['ch09'],T)]
sfx=json.load(open('shots.json'))['sfx']
VOL={'whoosh':.35,'boom':.45,'clash':.85,'army':.22,'shimmer':.4}
inp=['-i','audio/narration_master.wav'];f=[];k=1;mus=[]
for name,a,b in MUS:
  a0=max(0,a-1.5);d=b+1.5-a0
  inp+=['-stream_loop','2','-i',f'audio/{name}.mp3'];f.append(f"[{k}]atrim=0:{d:.3f},asetpts=PTS-STARTPTS,afade=t=in:d=1.5,afade=t=out:st={d-2.5:.3f}:d=2.5,volume=0.42,adelay={int(a0*1000)}|{int(a0*1000)}[m{k}]");mus.append(f'[m{k}]');k+=1
f.append(''.join(mus)+f"amix=inputs={len(mus)}:normalize=0:duration=longest,apad=whole_dur={T}[music]")
f.append("[0]asplit=2[nar][key]")
f.append("[music][key]sidechaincompress=threshold=0.015:ratio=8:attack=40:release=600:makeup=1[musd]")
fx=[]
for typ,t in sfx:
  if t<0 or t>T: continue
  inp+=['-i',f'../audio/sfx_{typ}.mp3'];ms=int(t*1000)
  extra=',afade=t=out:st=2.2:d=1.2' if typ=='army' else ''
  f.append(f"[{k}]volume={VOL[typ]}{extra},adelay={ms}|{ms}[s{k}]");fx.append(f'[s{k}]');k+=1
f.append('[nar][musd]'+''.join(fx)+f"amix=inputs={2+len(fx)}:normalize=0:duration=first,atrim=0:{T},loudnorm=I=-14:TP=-1.5:LRA=11[out]")
subprocess.run(['ffmpeg','-y','-loglevel','error',*inp,'-filter_complex',';'.join(f),'-map','[out]','-ar','48000','-ac','2','audio/film_mix.wav'],check=True)
print('mixed',len(fx),'sfx')
