import json,re,sys
sys.path.insert(0,'..')
ws=json.load(open('audio/words.json'))
PRE=[('Annazi','Annazî'),('Dirok','Dîrok')]
STEMS=['Mezopotamya','Bağdat','Horasan','Şehrizor','Hulvan','Kirmanşah','Dakuk','Dîrok']
def fixw(w):
  m=re.match(r'^(.*?)([.,;:!?]*)$',w);core,p=m.group(1),m.group(2)
  for a,b in PRE:
    if core.startswith(a): core=b+core[len(a):];break
  for st in STEMS:
    if core.startswith(st) and len(core)>len(st) and core[len(st)].islower(): core=st+'’'+core[len(st):];break
  return core+p
OFF=0.6;nar=ws[-1][2];END=OFF+nar+0.35;TOT=END+3.4
tl={'chapters':[{'id':'ch00','title':'','sub':'','num':0,'card':None,'start':OFF,'dur':nar,'words':[[fixw(w),s,e] for w,s,e in ws]}],'credits':9999,'logo':9999,'total':TOT,'narEnd':END}
open('timeline.js','w').write('window.TL='+json.dumps(tl,ensure_ascii=False)+';')
R='../../gutiler/render/'
k=open(R+'kassit_nocap.html').read().split('\n')
head='\n'.join(k[:481]).replace('../../kassitler/timeline.js','../../annaziler/short/timeline.js')
parts=['film_core.js','film_map.js','film_scenes.js','film_people.js','film_langmenu.js','film_kassit.js','film_3d.js','portraits.js','film_annazi.js','film_shots_ann_short.js','film.js']
body='\n'.join(open(R+p).read() for p in parts)
post='\nObject.assign(SCENE,{court:sCourt,cavalry:sCavalry,clash:sClash,siege:sSiege,caravan:sCaravan,castle:sCastle,portrait:sPortrait,feud:sFeud,org:sOrg,houses:sHouses});window.CAPTIONS_ON=false;window.LANGMENU_ON=false;\n'+open(R+'short_ann_v.js').read()
open(R+'annazi_short.html','w').write(head+'\n'+body+post+'</script></body></html>\n')
print('total',round(TOT,2),' '.join(w[0] for w in tl['chapters'][0]['words']))
