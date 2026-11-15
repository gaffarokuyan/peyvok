import json, subprocess
CH=[('ch00','',''),('ch01','PLANTATION, FLORIDA','1998'),('ch02','THE CELL WHERE IT STARTED','Juvenile detention'),('ch03','LOOK AT ME!','SoundCloud · 2015'),
 ('ch04','CHARGES & CONTROVERSY','2016'),('ch05','17 AND THE STAGE','2017'),('ch06','QUESTION MARK','#1 Billboard 200 · 2018'),('ch07','JUNE 18, 2018','Deerfield Beach'),
 ('ch08','JUSTICE','The 2023 verdict'),('ch09','LEGACY','Gekyume · Skins'),('ch10','','')]
def dur(f): return float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',f]).decode())
T=1.0;chs=[];num=0
for i,(cid,title,sub) in enumerate(CH):
  d=dur(f'audio/{cid}.wav');ws=json.load(open(f'audio/{cid}.words.json'))
  if i==1: chs.append({'id':'TITLE','card':T,'cardDur':7.0}); T+=7.0
  card=None
  if title: num+=1; card=T; T+=4.2
  chs.append({'id':cid,'title':title,'sub':sub,'num':num,'card':card,'start':T,'dur':d,'words':ws}); T+=d+0.9
credits=T;T+=24;logo=T;T+=6
open('timeline.js','w').write('window.TL='+json.dumps({'chapters':chs,'credits':credits,'logo':logo,'total':T},ensure_ascii=False)+';')
inp=[];flt=[]
for k,c in enumerate([c for c in chs if c['id']!='TITLE']):
  inp+=['-i',f"audio/{c['id']}.wav"];ms=int(c['start']*1000);flt.append(f"[{k}]adelay={ms}[n{k}]")
n=len(flt);flt.append(''.join(f'[n{k}]' for k in range(n))+f"amix=inputs={n}:normalize=0:duration=longest,apad=whole_dur={T},pan=stereo|c0=c0|c1=c0[o]")
subprocess.run(['ffmpeg','-y','-loglevel','error',*inp,'-filter_complex',';'.join(flt),'-map','[o]','-ar','48000','audio/narration_master.wav'],check=True)
print('total',round(T,2),'min',round(T/60,2))
for c in chs: print(c['id'],c.get('card'),round(c.get('start',0),2),round(c.get('dur',0),1))
