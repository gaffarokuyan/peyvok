import json, subprocess
CH=[('ch00','',''),('ch01','MEZOPOTAMYA’NIN DOĞU KAPISI','Hulvan · Serpol-i Zehab'),('ch02','HANEDANIN DOĞUŞU','Şazencan aşireti · ~990'),('ch03','KERVAN YOLU VE EKONOMİ','Bağdat – Horasan'),
 ('ch04','SARAY VE YÖNETİM','Aşiret düzeni'),('ch05','ORDU VE KALELER','Süvariler ve dağ kaleleri'),('ch06','İKİ KÜRT HANEDANI','Annazîler ve Hasanveyhîler'),('ch07','EBUŞŞEVK DÖNEMİ','Hüsameddevle · 1011–1046'),
 ('ch08','DIŞ İLİŞKİLER','Komşular arasında denge'),('ch09','AİLE İÇİ ÇATIŞMA','Kardeşler ve yeğenler'),('ch10','SELÇUKLU FIRTINASI','Hulvan · 1046'),('ch11','DAĞLARDA SÜREN EMİRLİK','1046 – ~1117'),('ch12','MİRAS','Orta Çağ Kürt hanedanları'),('ch13','','')]
import re
PRE=[('Annazi','Annazî'),('Hasanveyhi','Hasanveyhî'),('Mervani','Mervânî'),('Şeddadi','Şeddâdî'),('Kakuyi','Kâkûyî'),('Ukayli','Ukaylî'),('Mezyedi','Mezyedî'),('Dirok','Dîrok')]
STEMS=['Mezopotamya','Bağdat','Horasan','Hemedan','Zagros','Şehrizor','Hulvan','Kirmanşah','Dinever','Dakuk','Bendenicin','Mühelhil','Ebuşşevk','Dicle','Musul','Hille','İsfahan','Dîrok','Diyala','Babil']
def fixw(w):
  m=re.match(r'^(.*?)([.,;:!?]*)$',w);core,p=m.group(1),m.group(2)
  if core=='Annazdan': return 'Annaz’dan'+p
  for a,b in PRE:
    if core.startswith(a): core=b+core[len(a):];break
  for st in STEMS:
    if core.startswith(st) and len(core)>len(st) and core[len(st)].islower(): core=st+'’'+core[len(st):];break
  return core+p
def dur(f): return float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',f]).decode())
T=1.0;chs=[];num=0
for i,(cid,title,sub) in enumerate(CH):
  d=dur(f'audio/{cid}.wav');ws=json.load(open(f'audio/{cid}.words.json'))
  out=[[fixw(w),s,e] for w,s,e in ws]
  if i==1: chs.append({'id':'TITLE','card':T,'cardDur':7.0}); T+=7.0
  card=None
  if title: num+=1; card=T; T+=4.2
  chs.append({'id':cid,'title':title,'sub':sub,'num':num,'card':card,'start':T,'dur':d,'words':out}); T+=d+(0.6 if i==0 else 0.9)
credits=T;T+=40;logo=T;T+=6.5
open('timeline.js','w').write('window.TL='+json.dumps({'chapters':chs,'credits':credits,'logo':logo,'total':T},ensure_ascii=False)+';')
inp=[];flt=[]
for k,c in enumerate([c for c in chs if c['id']!='TITLE']):
  inp+=['-i',f"audio/{c['id']}.wav"];ms=int(c['start']*1000);flt.append(f"[{k}]adelay={ms}[n{k}]")
n=len(flt);flt.append(''.join(f'[n{k}]' for k in range(n))+f"amix=inputs={n}:normalize=0:duration=longest,apad=whole_dur={T},pan=stereo|c0=c0|c1=c0[o]")
subprocess.run(['ffmpeg','-y','-loglevel','error',*inp,'-filter_complex',';'.join(flt),'-map','[o]','-ar','48000','audio/narration_master.wav'],check=True)
print('total',round(T,2),'min',round(T/60,2))
for c in chs: print(c['id'],c.get('card'),round(c.get('start',0),2),round(c.get('dur',0),1))
