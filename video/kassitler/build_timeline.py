import json, subprocess
CH=[('ch00','',''),('ch01','ZAGROSTAN GELEN ATLILAR','Kassitlerin Yurdu'),('ch02','BABİLİN TAHTI','Karduniaş · 430 Yıl'),('ch03','BÜYÜK GÜÇLER','Amarna Mektupları'),
 ('ch04','KASSİT MEDENİYETİ','Zigguratlar ve Kudurrular'),('ch05','DÜŞÜŞ','Elam Saldırısı'),('ch06','ZAGROSLARA DÖNÜŞ','Kossaioi'),('ch07','KASSİTLER VE KÜRTLER','Kaynaklar Ne Diyor?'),('ch08','','')]
FIX={'Dîroka':'Dîrok’a','Babile':'Babil’e','Babilin':'Babil’in','Babili':'Babil’i','Babili.':'Babil’i.','Hammurabinin':'Hammurabi’nin','Nehrinin':'Nehri’nin','Mezopotamyanın':'Mezopotamya’nın',
 'Mezopotamyayı':'Mezopotamya’yı','Mezopotamyaya':'Mezopotamya’ya','Mısırda':'Mısır’da','Ahenatona':'Ahenaton’a','Amenhotepe':'Amenhotep’e','Bağdadın':'Bağdat’ın','Zagrosun':'Zagros’un',
 'Zagrostan':'Zagros’tan','Paristeki':'Paris’teki','Müzesinde':'Müzesi’nde','Babildeki':'Babil’deki','İskenderin':'İskender’in','Kassitçeden':'Kassitçe’den'}
def dur(f): return float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',f]).decode())
T=1.0;chs=[];num=0
for i,(cid,title,sub) in enumerate(CH):
  d=dur(f'audio/{cid}.wav') if cid!='ch00' else 33.12;ws=json.load(open(f'audio/{cid}.words.json'))
  out=[[FIX.get(w,w),s,e] for w,s,e in ws]
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
