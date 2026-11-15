import json, subprocess
CH=[('ch00','',''),('ch01','MEZOPOTAMYA','Medeniyetin Beşiği'),('ch02','SÜMER ŞEHİRLERİ','Dünyanın İlk Şehirlerinde Hayat'),('ch03','AKAD','Dünyanın İlk İmparatorluğu'),
 ('ch04','GUTİUM','Akad’ın Çöküşü'),('ch05','GUTİ DEVLETİ','Yönetim ve Seferler'),('ch06','UTU-HENGAL','Büyük Savaş'),('ch07','GUTİUM','Kaybolmayan Bir İsim'),
 ('ch08','KATMANLAR','Kürtlerin Ataları'),('ch09','YABANCI KAYNAKLAR','Tarihçiler Ne Diyor?'),('ch10','HAYATTA KALMAK','Çetin Coğrafyanın Gücü'),('ch11','','')]
def dur(f): return float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',f]).decode())
def words(f):
  a=json.load(open(f)); out=[]; w='';s=e=0
  for c,cs,ce in zip(a['characters'],a['character_start_times_seconds'],a['character_end_times_seconds']):
    if c.strip()=='':
      if w: out.append([w,round(s,3),round(e,3)]); w=''
      continue
    if not w: s=cs
    w+=c; e=ce
  if w: out.append([w,round(s,3),round(e,3)])
  return out
T=1.5; chs=[]; num=0
for i,(cid,title,sub) in enumerate(CH):
  d=dur(f'audio/{cid}.mp3'); card=None
  if i==1: chs.append({'id':'TITLE','card':T,'cardDur':7.0}); T+=7.0
  if title: num+=1; card=T; T+=4.2
  chs.append({'id':cid,'title':title,'sub':sub,'num':num,'card':card,'start':T,'dur':d,'words':words(f'audio/{cid}.align.json')})
  T+=d+(0.6 if i==0 else 0.9)
credits=T; T+=42; logo=T; T+=6.5
tl={'chapters':chs,'credits':credits,'logo':logo,'total':T}
open('timeline.js','w').write('window.TL='+json.dumps(tl,ensure_ascii=False)+';')
# narration master
inputs=[];filt=[]
for k,c in enumerate([c for c in chs if c['id']!='TITLE']):
  inputs+=['-i',f"audio/{c['id']}.mp3"]; ms=int(c['start']*1000); filt.append(f"[{k}]adelay={ms}|{ms}[n{k}]")
n=len(filt); filt.append(''.join(f'[n{k}]' for k in range(n))+f"amix=inputs={n}:normalize=0:duration=longest,apad=whole_dur={T}[o]")
subprocess.run(['ffmpeg','-y','-loglevel','error',*inputs,'-filter_complex',';'.join(filt),'-map','[o]','-ar','48000','-ac','2','audio/narration_master.wav'],check=True)
print('total',T,'min',T/60,'credits',credits)
for c in chs: print(c['id'],c.get('card'),c.get('start'),round(c.get('dur',0),1))
