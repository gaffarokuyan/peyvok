import json, subprocess
CH=[('ch00','',''),('ch01','MEZOPOTAMYA VE AKAD','Medeniyetin Beşiği'),('ch02','GUTİUM','Akad’ın Çöküşü'),('ch03','GUTİ DEVLETİ','Yönetim ve Seferler'),
 ('ch04','UTU-HENGAL','Büyük Savaş'),('ch05','GUTİUM','Adın 1.700 Yıllık İzi'),('ch06','GUTİLER VE KÜRTLER','Yabancı Kaynaklar Ne Diyor?'),('ch07','','')]
FIX={'Sarbon':'Sargon',"Laarabuma'a":'La’erabum’a',"Ubbaru'ydu.":'Ugbaru’ydu.','Spicer,':'Speiser,','Safrastyen,':'Safrastian,','Mehdad':'Mehrdad','İzadi':'İzady',
 'Karduklardan':'Kardukhlardan','Corduene':'Korduene','Utuhengal':'Utu-hengal','Utuhengal,':'Utu-hengal,',"Utuhengal'e":'Utu-hengal’e','Kutu':'Qutu','Efraim':'Ephraim',
 'peve':'pê ve,','hevalen':'hevalên','metûne.':'me tune.',"Dirok'a":'Dîrok’a','Naram':'Naram-Sin','Şarkalişarri':'Şar-kali-şarri',"Şarkalişarri'nin":'Şar-kali-şarri’nin',
 '"Şarkalişarri\'nin':'"Şar-kali-şarri’nin','Şarlag\'ı':'Şarlag’ı'}
def dur(f): return float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',f]).decode())
T=1.0;chs=[];num=0
for i,(cid,title,sub) in enumerate(CH):
  d=dur(f'audio/{cid}.wav');ws=json.load(open(f'audio/{cid}.words.json'))
  out=[];kurti=0
  for k,(w,s,e) in enumerate(ws):
    if w=='Sin' and k>0 and ws[k-1][0]=='Naram': continue
    if w=='Kurti' and kurti==0: kurti=1; w='Qurti'
    out.append([FIX.get(w,w),s,e])
  if i==1: chs.append({'id':'TITLE','card':T,'cardDur':7.0}); T+=7.0
  card=None
  if title: num+=1; card=T; T+=4.2
  chs.append({'id':cid,'title':title,'sub':sub,'num':num,'card':card,'start':T,'dur':d,'words':out}); T+=d+(0.6 if i==0 else 0.9)
credits=T;T+=42;logo=T;T+=6.5
open('timeline.js','w').write('window.TL='+json.dumps({'chapters':chs,'credits':credits,'logo':logo,'total':T},ensure_ascii=False)+';')
inp=[];flt=[]
for k,c in enumerate([c for c in chs if c['id']!='TITLE']):
  inp+=['-i',f"audio/{c['id']}.wav"];ms=int(c['start']*1000);flt.append(f"[{k}]adelay={ms}[n{k}]")
n=len(flt);flt.append(''.join(f'[n{k}]' for k in range(n))+f"amix=inputs={n}:normalize=0:duration=longest,apad=whole_dur={T},pan=stereo|c0=c0|c1=c0[o]")
subprocess.run(['ffmpeg','-y','-loglevel','error',*inp,'-filter_complex',';'.join(flt),'-map','[o]','-ar','48000','audio/narration_master.wav'],check=True)
print('total',round(T,2),'min',round(T/60,2))
for c in chs: print(c['id'],c.get('card'),round(c.get('start',0),2),round(c.get('dur',0),1))
