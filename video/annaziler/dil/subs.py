# Annazîler subtitles (.ytt + .srt) for tr/en/de/fr/ar/kmr/ckb, timed on the Turkish narration (+1.5 s cover intro)
import json,html,itertools,math,os
D=os.path.dirname(os.path.abspath(__file__));os.chdir(D)
S=json.load(open('sents.json'));OFF=1.5
LANGS=['tr','en','de','fr','ar','kmr','ckb']
L={l:open(f'{l}.txt').read().strip('\n').split('\n') for l in LANGS if l!='tr'};L['tr']=[' '.join(x[0] for x in s['w']) for s in S]
for l in L: assert len(L[l])==len(S),(l,len(L[l]))
def wrap(s,lim=48):
  if len(s)<=lim: return s
  ws=s.split();n=min(len(ws),max(2,math.ceil(len(s)/(lim+2))));best=None
  for cuts in itertools.combinations(range(1,len(ws)),n-1):
    b=(0,)+cuts+(len(ws),);ls=[' '.join(ws[b[i]:b[i+1]]) for i in range(n)];sc=max(map(len,ls))
    if best is None or sc<best[0]: best=(sc,ls)
  return '\n'.join(best[1])
def ts(x): ms=int(round(x*1000));return f"{ms//3600000:02}:{ms//60000%60:02}:{ms//1000%60:02},{ms%1000:03}"
groups=[]
for s in S:
  ws=s['w'];cues=[];cur=[]
  for j,x in enumerate(ws):
    cur.append(x);txt=' '.join(y[0] for y in cur);nl=len(txt)+1+len(ws[j+1][0]) if j+1<len(ws) else 0
    if j==len(ws)-1 or (x[0][-1] in ',:;' and len(txt)>24) or nl>78: cues.append(cur);cur=[]
  groups.append(cues)
HEAD='''<?xml version="1.0" encoding="utf-8"?>
<timedtext format="3">
<head>
<pen id="1" b="1" fc="#FFFFFF" fo="254" bc="#140804" bo="170" et="4" ec="#000000" fs="4" sz="110"/>
<wp id="1" ap="7" ah="50" av="92"/>
<ws id="1" ju="2"/>
</head>
<body>
'''
os.makedirs('out',exist_ok=True)
for lang in LANGS:
  cues=[]
  for g,tx in zip(groups,L[lang]):
    ws=tx.split()
    if lang=='tr': parts=[' '.join(x[0] for x in c) for c in g]
    else:
      lens=[len(' '.join(x[0] for x in c)) for c in g];tot=sum(lens);cum=0;cuts=[]
      for Ln in lens[:-1]: cum+=Ln;cuts.append(round(len(ws)*cum/tot))
      prev=0;fx=[]
      for q,c in enumerate(cuts):
        cand=[k for k in range(c-5,c+6) if 0<k<len(ws) and ws[k-1][-1] in ',;:،؛']
        if cand: c=min(cand,key=lambda k:abs(k-c))
        c=max(c,prev+1);c=min(c,len(ws)-(len(cuts)-q));fx.append(c);prev=c
      b=[0]+fx+[len(ws)];parts=[' '.join(ws[b[q]:b[q+1]]) for q in range(len(g))]
    if lang!='tr' and len(tx)<=84 and len(g)>1: cues.append([g[0][0][1]+OFF,g[-1][-1][2]+OFF,tx]);continue
    for c,pt in zip(g,parts): cues.append([c[0][1]+OFF,c[-1][2]+OFF,pt])
  for i,c in enumerate(cues):
    nxt=cues[i+1][0] if i+1<len(cues) else c[1]+1.5
    c[1]=min(max(c[1]+.3,c[0]+1.0),nxt-.04)
  open(f'out/dirok_annaziler_{lang}.srt','w').write('\n'.join(f"{i+1}\n{ts(a)} --> {ts(b)}\n{wrap(t)}\n" for i,(a,b,t) in enumerate(cues)))
  open(f'out/dirok_annaziler_{lang}.ytt','w').write(HEAD+'\n'.join(f'<p t="{int(a*1000)}" d="{int((b-a)*1000)}" wp="1" ws="1"><s p="1">{html.escape(wrap(t),quote=False)}</s></p>' for a,b,t in cues)+'\n</body>\n</timedtext>\n')
  print(lang,len(cues))
