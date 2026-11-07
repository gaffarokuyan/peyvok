import csv,random,json,collections
rows=list(csv.DictReader(open('peyvok-kelimeler.csv',encoding='utf-8-sig')))
TR={r['Kelime']:r['Türkçe anlam'] for r in rows}
W=[w for w in TR if w not in {'çêr','leş','xeber','zilm','tade','zalim','qatil','cenaze','dîl','gor','tobe','ceza'}]
COMMON=set(l.split('\t')[0] for f in ['tr/o0.tsv','tr/o1.tsv','tr/o2.tsv','tr/o3.tsv','tr/o4.tsv'] for l in open(f,encoding='utf-8') if '\t' in l)
C=collections.Counter
MS={w:C(w) for w in W}
MAXD=7
def sub(a,b): return all(b[k]>=v for k,v in a.items())
def build(words):
    order=sorted(range(len(words)),key=lambda i:-len(words[i]))
    rnd=random.Random(len(words)*31+sum(map(len,words)))
    orders=[order]+[rnd.sample(order,len(order)) for _ in range(120)]
    for ordr in orders:
        cells={};pl=[None]*len(words)
        def put(wi,r,c,d):
            for k,ch in enumerate(words[wi]):
                rr,cc=(r+k,c) if d else (r,c+k)
                x=cells.setdefault((rr,cc),{'ch':ch,'h':False,'v':False});x['v' if d else 'h']=True
            pl[wi]=(r,c,d)
        def fits(wi,r,c,d):
            w=words[wi];n=len(w);hits=0
            b=(r-1,c) if d else (r,c-1);a=(r+n,c) if d else (r,c+n)
            if b in cells or a in cells: return -1
            for k in range(n):
                rr,cc=(r+k,c) if d else (r,c+k);x=cells.get((rr,cc))
                if x:
                    if x['ch']!=w[k] or x['v' if d else 'h']: return -1
                    hits+=1
                else:
                    s1,s2=((rr,cc-1),(rr,cc+1)) if d else ((rr-1,cc),(rr+1,cc))
                    if s1 in cells or s2 in cells: return -1
            return hits
        put(ordr[0],0,0,0);ok=True
        for wi in ordr[1:]:
            best=None
            for (r,c),x in list(cells.items()):
                for d in (0,1):
                    if x['v' if d else 'h']: continue
                    for i,ch in enumerate(words[wi]):
                        if ch!=x['ch']: continue
                        sr,sc=(r-i,c) if d else (r,c-i);h=fits(wi,sr,sc,d)
                        if h>0:
                            n=len(words[wi]);er,ec=(sr+n-1,sc) if d else (sr,sc+n-1)
                            rs_=[k[0] for k in cells]+[sr,er];cs_=[k[1] for k in cells]+[sc,ec]
                            R,Cc=max(rs_)-min(rs_)+1,max(cs_)-min(cs_)+1
                            if R>MAXD or Cc>MAXD: continue
                            s=h*100-8*max(R,Cc)-3*(R+Cc)
                            if not best or s>best[0]: best=(s,sr,sc,d)
            if not best: ok=False;break
            put(wi,best[1],best[2],best[3])
        if not ok: continue
        rs=[k[0] for k in cells];cs=[k[1] for k in cells];r0,c0=min(rs),min(cs)
        rows_,cols_=max(rs)-r0+1,max(cs)-c0+1
        if cols_>MAXD or rows_>MAXD: continue
        return {'r':rows_,'c':cols_,'p':[[p[0]-r0,p[1]-c0,p[2]] for p in pl]}
    return None
def plan(i):
    if i<8: return (3,2,3)
    if i<30: return (4,3,4)
    if i<60: return (random.choice([4,5]),4,5)
    if i<100: return (5,5,6)
    if i<150: return (6,5,7)
    return (random.choice([6,7]),6,8)
random.seed(42)
used_base=set();recent=collections.deque(maxlen=40);levels=[]
for i in range(200):
    for attempt in range(4000):
        L,nmin,nmax=plan(i)
        if attempt>1500: nmin=max(2,nmin-1)
        pool=[w for w in W if w in COMMON] if i<60 else W
        bases=[w for w in pool if len(w)==L and w not in used_base and len(set(w))>=L-1]
        base=random.choice(bases)
        cand=[w for w in W if 3<=len(w)<=L and w!=base and sub(MS[w],MS[base])]
        pickable=[w for w in cand if (w in COMMON or i>=60)]
        fresh=[w for w in pickable if w not in recent]
        if len(fresh)+1<nmin: continue
        n=random.randint(nmin,min(nmax,len(fresh)+1))
        fresh.sort(key=lambda w:(-len(w),random.random()))
        pick=[base]+random.sample(fresh[:max(n*2,n)],n-1)
        X=build(pick)
        if not X: continue
        bonus=sorted(w for w in cand if w not in pick)
        letters=list(base);random.shuffle(letters)
        levels.append({'l':''.join(letters),'w':[[w,TR[w]] for w in pick],'x':X,'b':bonus})
        used_base.add(base);recent.extend(pick);break
    else: raise SystemExit('fail %d'%i)
json.dump(levels,open('levels7.json','w'),ensure_ascii=False,separators=(',',':'))
print(len(levels),[len(l['w']) for l in levels[::20]],[l['l'] for l in levels[:12]])
print(levels[150])
allw=set(w for l in levels for w,_ in l['w']);print('unique words used',len(allw))
