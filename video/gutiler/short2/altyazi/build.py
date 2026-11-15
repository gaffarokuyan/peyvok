import json,html,itertools,math
OFF=0.4
a=json.load(open('../audio/align.json'));W=[];w='';s=e=0
for i,c in enumerate(a['characters']):
  if c==' ':
    if w: W.append((w,s+OFF,e+OFF));w=''
  else:
    if not w: s=a['character_start_times_seconds'][i]
    w+=c;e=a['character_end_times_seconds'][i]
if w: W.append((w,s+OFF,e+OFF))
tr=[l.split() for l in open('s_tr.txt').read().strip().split('\n')]
assert sum(map(len,tr))==len(W),(sum(map(len,tr)),len(W))
# turkish cues: split each line into chunks of <=32 chars at word boundaries, preferring punctuation
groups=[];k=0
for ln in tr:
  ws=W[k:k+len(ln)];k+=len(ln);cues=[];cur=[]
  for j,x in enumerate(ws):
    cur.append(x);txt=' '.join(y[0] for y in cur);nxt=len(txt)+1+len(ws[j+1][0]) if j+1<len(ws) else 0
    if j==len(ws)-1 or x[0][-1] in '.,:' and len(txt)>12 or nxt>34: cues.append(cur);cur=[]
  groups.append(cues)
def wrap(s,lim=26):
  if len(s)<=lim: return s
  ws=s.split();n=min(len(ws),max(2,math.ceil(len(s)/(lim+2))));best=None
  for cuts in itertools.combinations(range(1,len(ws)),n-1):
    b=(0,)+cuts+(len(ws),);ls=[' '.join(ws[b[i]:b[i+1]]) for i in range(n)];sc=max(map(len,ls))
    if best is None or sc<best[0]: best=(sc,ls)
  return '\n'.join(best[1])
def ts(x,sep=','): ms=int(round(x*1000));return f"{ms//3600000:02}:{ms//60000%60:02}:{ms//1000%60:02}{sep}{ms%1000:03}"
def at(x): cs=int(round(x*100));return f"{cs//360000}:{cs//6000%60:02}:{cs//100%60:02}.{cs%100:02}"
HEAD='''<?xml version="1.0" encoding="utf-8"?>
<timedtext format="3">
<head>
<pen id="1" b="1" fc="#FFFFFF" fo="254" bc="#140804" bo="170" et="4" ec="#000000" fs="4" sz="120"/>
<pen id="2" b="1" fc="#FFD23A" fo="254" bc="#140804" bo="190" et="4" ec="#000000" fs="4" sz="125"/>
<wp id="1" ap="7" ah="50" av="80"/>
<ws id="1" ju="2"/>
</head>
<body>
'''
for lang in ['tr','en','ar','kmr','ckb']:
  lines=open(f's_{lang}.txt').read().strip().split('\n');cues=[]
  for g,tl in zip(groups,lines):
    ws=tl.split()
    if lang=='tr': parts=[' '.join(x[0] for x in c) for c in g]
    else:
      lens=[len(' '.join(x[0] for x in c)) for c in g];tot=sum(lens);cum=0;cuts=[]
      for L in lens[:-1]: cum+=L;cuts.append(round(len(ws)*cum/tot))
      prev=0;fx=[]
      for q,c in enumerate(cuts): c=max(c,prev+1);c=min(c,len(ws)-(len(cuts)-q));fx.append(c);prev=c
      b=[0]+fx+[len(ws)];parts=[' '.join(ws[b[q]:b[q+1]]) for q in range(len(g))]
    for c,ptxt in zip(g,parts): cues.append([c[0][1],c[-1][2],ptxt])
  for i,c in enumerate(cues):
    nxt=cues[i+1][0] if i+1<len(cues) else c[1]+1
    c[1]=min(max(c[1]+.2,c[0]+.8),nxt-.03)
  hi=lambda t: any(k in t for k in ['Ejderha','Dragon','تنين','Ejdeha','ئەژدیها','Kürt','Kurd','الكرد','کورد','KÜRT'])
  open(f'dirok_gutiler_short_{lang}.srt','w').write('\n'.join(f"{i+1}\n{ts(a)} --> {ts(b)}\n{wrap(t)}\n" for i,(a,b,t) in enumerate(cues)))
  open(f'dirok_gutiler_short_{lang}.ytt','w').write(HEAD+'\n'.join(f'<p t="{int(a*1000)}" d="{int((b-a)*1000)}" wp="1" ws="1"><s p="{2 if hi(t) else 1}">{html.escape(wrap(t),quote=False)}</s></p>' for a,b,t in cues)+'\n</body>\n</timedtext>\n')
  rtl=lang in('ar','ckb');font='Arial' if rtl else 'Arial Black'
  ass=f"""[Script Info]
Title: Dirok - Gutiler Short
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920
WrapStyle: 2
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Dirok,{font},64,&H00FFFFFF,&H00FFFFFF,&H48040814,&H64000000,-1,0,0,0,100,100,0,0,3,16,3,2,90,90,360,1
Style: DirokVurgu,{font},68,&H003AD2FF,&H003AD2FF,&H40040814,&H64000000,-1,0,0,0,100,100,0,0,3,16,3,2,90,90,360,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""+'\n'.join(f"Dialogue: 0,{at(a)},{at(b)},{'DirokVurgu' if hi(t) else 'Dirok'},,0,0,0,,{wrap(t).replace(chr(10),chr(92)+'N')}" for a,b,t in cues)+'\n'
  open(f'dirok_gutiler_short_{lang}.ass','w',encoding='utf-8-sig').write(ass)
  print(lang,len(cues))
