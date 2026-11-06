// ================= FILM MAP (bright relief, era polities) =================
const PK={};POLITIES.forEach(p=>PK[p.k]={n:p.n,c:p.c,r:p.r,l:p.l});
Object.assign(PK,{
 sub:{n:'SUBARTU',c:'#3fa7e0',l:[41.3,36.9],r:[[38.5,37.4],[40.5,37.8],[42.5,37.8],[44.0,37.0],[44.2,36.2],[43.2,35.6],[41.8,36.0],[40.2,36.1],[38.8,36.4]]},
 mit:{n:'MİTANNİ',c:'#2f7fe0',l:[40.6,36.7],r:[[36.0,36.9],[37.5,37.6],[39.5,38.1],[41.5,38.0],[43.5,37.6],[44.8,36.4],[44.9,35.2],[44.2,35.0],[43.0,35.3],[41.5,35.0],[40.2,35.0],[38.8,35.6],[37.2,35.8],[36.1,36.3]]},
 hit:{n:'HİTİTLER',c:'#d4519f',l:[34.4,39.6],r:[[30.5,39.5],[31.5,41.0],[34.5,41.8],[37.0,41.2],[38.5,39.8],[38.0,38.4],[36.5,37.3],[34.5,36.7],[33.0,37.2],[31.2,38.0]]},
 kas:{n:'KASSİT BABİL',c:'#e0a52a',l:[45.4,32.3],r:[[43.6,34.2],[44.6,34.4],[45.6,33.8],[46.8,32.6],[47.6,31.2],[47.0,30.7],[45.8,30.6],[44.6,31.2],[43.4,32.5],[42.8,33.6]]},
 kasO:{n:'KASSİTLER',c:'#f0c43a',l:[48.0,33.4],r:[[46.8,34.4],[48.6,34.2],[49.4,33.0],[48.6,32.2],[47.4,32.6],[46.6,33.4]]},
 asurM:{n:'ASUR',c:'#7a8fb0',l:[43.3,36.1],r:[[42.8,36.9],[43.8,36.9],[44.0,35.8],[43.4,35.1],[42.7,35.6]]},
 misY:{n:'MISIR',c:'#3db34d',l:[30.6,29.0],r:[[29.6,31.25],[32.3,31.2],[34.3,31.4],[35.0,32.8],[35.6,34.3],[36.0,35.2],[36.6,35.0],[36.3,33.5],[35.6,31.5],[34.6,29.6],[32.8,29.8],[32.6,30.0],[31.6,29.2],[31.4,27.6],[30.6,27.6],[30.8,29.4],[29.8,30.3]]},
 ura:{n:'URARTU',c:'#16a5a5',l:[43.3,39.4],r:[[40.5,40.6],[42.5,41.2],[44.8,40.8],[46.2,39.6],[45.8,38.0],[44.8,37.4],[43.2,37.8],[41.6,38.3],[40.3,39.2]]},
 asurN:{n:'ASUR İMPARATORLUĞU',c:'#5a72b8',l:[40.2,35.3],r:[[33.5,37.0],[36.5,37.8],[40,38.0],[43.5,37.6],[45.5,36.6],[46.6,35.2],[47.2,33.6],[48.2,31.5],[47.6,30.2],[46.4,30.4],[44.8,31.0],[43.0,32.4],[40.8,34.0],[38.6,33.4],[36.5,31.0],[34.4,29.8],[34.2,31.4],[34.9,33.2],[35.8,35.0],[35.6,36.4]]},
 med:{n:'MED İMPARATORLUĞU',c:'#1fa37a',l:[47.6,36.9],r:[[35.5,41.0],[37.5,40.8],[40.5,41.0],[43.5,41.4],[46.5,41.0],[49.5,38.8],[52.0,37.2],[55.5,37.6],[58.5,37.0],[60.5,35.0],[59.5,32.5],[56.0,31.5],[53.0,32.5],[51.0,33.4],[49.0,33.6],[47.6,33.8],[46.0,34.6],[44.6,35.6],[43.5,36.6],[41.5,37.4],[39.0,38.6],[37.0,38.8],[35.5,39.4]]},
 lid:{n:'LİDYA',c:'#9a52c8',l:[30.5,39.2],r:[[26.0,40.2],[28.5,41.1],[31.0,41.2],[33.5,41.6],[35.3,41.4],[35.0,39.6],[34.2,38.4],[32.5,37.4],[30.0,36.9],[27.8,37.0],[26.6,38.4]]},
 babN:{n:'BABİL',c:'#e0a52a',l:[41.0,32.6],r:[[38.6,36.0],[40.5,36.6],[42.8,36.4],[43.6,35.6],[44.6,35.0],[45.6,33.8],[47.4,32.0],[47.8,30.5],[46.4,30.0],[44.5,30.5],[42.0,31.2],[39.5,31.0],[37.0,30.0],[34.6,29.6],[34.3,31.3],[35.0,33.1],[35.9,35.0],[36.8,35.9]]},
 pers:{n:'PERSLER',c:'#d9533a',l:[52.6,29.6],r:[[50.5,31.0],[53.5,30.6],[55.0,29.0],[54.0,27.5],[51.5,28.0],[50.0,29.5]]}
});
PK.gut.n='GUTİUM';PK.akad.n='AKAD';PK.hur.n='HURRİLER';
let SH=null; // current shot
const R=q=>SH.R(q), A=(q,d=.5)=>SH?ss(R(q),R(q)+d,SH.T):0;
function camFromKeys(keys,T){const K=keys.map(k=>[R(k[0]),k[1],k[2],k[3]]);let i=0;while(i<K.length-2&&T>K[i+1][0])i++;
  if(K.length===1){CAM={lon:K[0][1],lat:K[0][2],s:W/(K[0][3]*RAD),rot:0};return}
  const a=K[i],b=K[i+1],f=eio(clamp((T-a[0])/Math.max(.01,b[0]-a[0])));const w=Math.exp(lerp(Math.log(a[3]),Math.log(b[3]),f));CAM={lon:lerp(a[1],b[1],f),lat:lerp(a[2],b[2],f),s:W/(w*RAD),rot:0}}
function drawFilmMap(T,p){
  camFromKeys(p.cam,T);const drift=1+.012*(T-SH.t0);CAM.s*=Math.min(drift,1.25);
  X.fillStyle='#2f78bb';X.fillRect(0,0,W,H);const RB=window.RELIEF;const [x0,y0]=P(RB.lon0,RB.lat0),[x1,y1]=P(RB.lon1,RB.lat1);X.imageSmoothingQuality='high';X.drawImage(RIMG,x0,y0,x1-x0,y1-y0);
  if(!p.modernGulf){pathRing(OLDGULF);X.fillStyle='#5aa9dc';X.fill()}
  const rv=p.rivers!=null?A(p.rivers,3):1;
  for(const k of ['dicle','firat','zap','kzap','diyala','karun','kerhe','kizil','nil','nil2']){const line=partial(RIVERS[k],rv);pathRing(line,false);X.lineCap='round';X.lineJoin='round';
    const main=k==='dicle'||k==='firat';X.strokeStyle='rgba(20,70,130,.55)';X.lineWidth=main?7:4;X.stroke();X.strokeStyle=p.rivers!=null&&main?'#7fe0ff':'#5fc6ff';X.lineWidth=main?(p.rivers!=null?4.5:3.2):2;X.stroke()}
  // mountain range highlight
  (p.lines||[]).forEach(([q,key,col])=>{const a=A(q,.8);if(a<=0)return;const L={zagros:ZAGROS,taurus:TAURUS,cauc:CAUC}[key];pathRing(partial(L,a),false);X.save();X.lineCap='round';X.strokeStyle=col||'rgba(255,200,80,.55)';X.lineWidth=Math.min(CAM.s*.012,70);X.stroke();X.strokeStyle='rgba(255,250,220,.9)';X.lineWidth=5;X.stroke();X.restore()});
  // polities
  (p.show||[]).forEach(e=>{const [key,q]=Array.isArray(e)?e:[e,null];const P0=PK[key];let a=q==null?ss(SH.t0,SH.t0+.6,T):A(q,.6);if(p.hide){const h=p.hide.find(x=>x[0]===key);if(h)a*=1-A(h[1],.6)}if(a<=0)return;
    pathRing(P0.r);X.globalAlpha=.36*a;X.fillStyle=P0.c;X.fill();X.globalAlpha=a;X.setLineDash([16,10]);X.lineWidth=4;X.strokeStyle='rgba(255,255,255,.75)';X.lineDashOffset=0;X.stroke();X.strokeStyle=P0.c;X.lineWidth=3;X.lineDashOffset=3;X.stroke();X.setLineDash([]);X.globalAlpha=1});
  (p.glow||[]).forEach(([key,q,col])=>{const a=A(q,.5);if(a<=0)return;const P0=PK[key];const pulse=.5+.5*Math.sin(T*5);pathRing(P0.r);X.save();X.globalAlpha=a*(.25+.15*pulse);X.fillStyle=col||P0.c;X.fill();X.globalAlpha=a;
    X.shadowColor=col||P0.c;X.shadowBlur=30;X.strokeStyle='#fff8e0';X.lineWidth=5+2*pulse;X.setLineDash([18,10]);X.lineDashOffset=-T*30;X.stroke();X.restore()});
  if(p.spread){const [q,key,col]=p.spread;const a=A(q,1.4);if(a>0){X.save();pathRing(PK[key]?PK[key].r:GUTI_RULE);X.clip();const c=P(46,34.9);const RR=a*CAM.s*.12;const rr=X.createRadialGradient(c[0],c[1],RR*.6,c[0],c[1],RR);
    rr.addColorStop(0,col||'rgba(225,45,35,.5)');rr.addColorStop(.95,col||'rgba(255,80,40,.55)');rr.addColorStop(1,'rgba(255,80,40,0)');X.fillStyle=rr;X.fillRect(0,0,W,H);X.restore();pathRing(PK[key]?PK[key].r:GUTI_RULE);X.setLineDash([16,10]);X.strokeStyle=`rgba(225,40,30,${a})`;X.lineWidth=4;X.stroke();X.setLineDash([])}}
  // arrows
  (p.arrows||[]).forEach(([q,from,to,col,dur,bend])=>{const f=eio(clamp((T-R(q))/(dur||1.4)));if(f<=0)return;const a=P(...from),b=P(...to);const bd=bend==null?.18:bend;const mx=(a[0]+b[0])/2-(b[1]-a[1])*bd,my=(a[1]+b[1])/2+(b[0]-a[0])*bd;
    const N=50;X.beginPath();let px,py;for(let k=0;k<=N*f;k++){const u=k/N;px=(1-u)*(1-u)*a[0]+2*(1-u)*u*mx+u*u*b[0];py=(1-u)*(1-u)*a[1]+2*(1-u)*u*my+u*u*b[1];k?X.lineTo(px,py):X.moveTo(px,py)}
    X.lineCap='round';X.strokeStyle='rgba(60,10,0,.45)';X.lineWidth=20;X.stroke();X.strokeStyle=col||'#ff4a2a';X.lineWidth=9;X.stroke();
    const u=Math.max(.02,f),dx=2*(1-u)*(mx-a[0])+2*u*(b[0]-mx),dy=2*(1-u)*(my-a[1])+2*u*(b[1]-my);X.save();X.translate(px,py);X.rotate(Math.atan2(dy,dx));X.beginPath();X.moveTo(26,0);X.lineTo(-16,-20);X.lineTo(-6,0);X.lineTo(-16,20);X.closePath();X.fillStyle=col||'#ff4a2a';X.strokeStyle='#fff';X.lineWidth=3;X.fill();X.stroke();X.restore()});
  // armies
  (p.armies||[]).forEach(([q,from,to,col,dark,dur,rows,cols])=>{const t0=R(q);if(T<t0)return;const f=eio(clamp((T-t0)/(dur||2.5)));const a=P(...from),b=P(...to);const pp=[lerp(a[0],b[0],f),lerp(a[1],b[1],f)];
    X.save();X.globalAlpha=ss(t0,t0+.4,T);X.strokeStyle=col;X.globalAlpha*=.6;X.lineWidth=8;X.setLineDash([16,12]);X.lineDashOffset=-T*60;X.beginPath();X.moveTo(a[0],a[1]);X.lineTo(pp[0],pp[1]);X.stroke();X.setLineDash([]);X.restore();
    X.save();X.globalAlpha=ss(t0,t0+.4,T);formationF(pp[0],pp[1],Math.atan2(b[1]-a[1],b[0]-a[0]),col,dark,rows||5,cols||7,T,(from[0]*7)|0);X.restore()});
  // cities & sites
  (p.cities||[]).forEach(([nm,lo,la,q,big])=>{const a=q==null?ss(SH.t0+.3,SH.t0+.9,T):A(q,.5);if(a<=0)return;const [x,y]=P(lo,la);const r=big?11:8;
    let col='#ffffff';const fall=(p.fall||[]).find(f=>f[0]===nm);if(fall&&T>R(fall[1])){col='#ff4a2a';const k=(T-R(fall[1]))/1.4;if(k<1){X.save();X.globalCompositeOperation='lighter';X.strokeStyle=`rgba(255,210,140,${1-k})`;X.lineWidth=7;X.beginPath();X.arc(x,y,20+k*300,0,TAU);X.stroke();
      const fg=X.createRadialGradient(x,y,0,x,y,240);fg.addColorStop(0,`rgba(255,245,210,${1-k})`);fg.addColorStop(1,'rgba(255,120,40,0)');X.fillStyle=fg;X.fillRect(x-240,y-240,480,480);X.restore()}}
    X.save();X.globalAlpha=a;X.beginPath();X.arc(x,y,r+4,0,TAU);X.fillStyle='#2a1206';X.fill();X.beginPath();X.arc(x,y,r,0,TAU);X.fillStyle=col;X.fill();
    X.font=`700 ${big?36:28}px Cinzel`;X.letterSpacing='3px';X.textAlign='left';X.textBaseline='middle';X.lineJoin='round';X.lineWidth=7;X.strokeStyle='rgba(30,12,4,.88)';const TT=nm.toLocaleUpperCase('tr');X.strokeText(TT,x+18,y);X.fillStyle=col;X.fillText(TT,x+18,y);X.restore()});
  (p.sites||[]).forEach(([q,lo,la,nm,sub])=>{const a=A(q,.5);if(a<=0)return;const [x,y]=P(lo,la);X.save();X.globalAlpha=a;const s=lerp(.4,1,eback(a));X.translate(x,y);X.scale(s,s);
    X.beginPath();X.moveTo(0,-20);X.lineTo(16,0);X.lineTo(0,20);X.lineTo(-16,0);X.closePath();X.fillStyle='#ffd23a';X.strokeStyle='#2a1206';X.lineWidth=4;X.fill();X.stroke();X.restore();
    labelBoxB(x,y-80,nm,sub||'','',a,'#ffd23a',a,.8)});
  // polity name tags (wide views)
  (p.tags||[]).forEach(e=>{const [key,q,lo,la]=e;const P0=PK[key];const a=q==null?ss(SH.t0+.4,SH.t0+1,T):A(q,.5);if(a<=0)return;const L=lo!=null?[lo,la]:P0.l;const [x,y]=P(...L);
    X.save();X.globalAlpha=a;X.textAlign='center';X.textBaseline='middle';X.font='700 34px Cinzel';X.letterSpacing='5px';X.lineJoin='round';X.lineWidth=8;X.strokeStyle='rgba(30,12,4,.88)';X.strokeText(P0.n,x,y);X.fillStyle='#fff6dc';X.fillText(P0.n,x,y);X.restore()});
  (p.labels||[]).forEach(([q,lo,la,t1,s1,s2,end,col])=>{let a=A(q,.35);if(end!=null)a*=1-A(end,.35);if(a<=0)return;const [x,y]=P(lo,la);labelBoxB(x,y,t1,s1,s2,a,col||'#ffb23a',clamp((T-R(q))/.5))});
  if(p.sea!==false){const sa=clamp(1-(CAM.s-3000)/2500);if(sa>0){X.save();X.globalAlpha=sa*.95;X.textAlign='center';X.font='600 42px Corm';X.letterSpacing='8px';X.fillStyle='#eaf7ff';X.shadowColor='rgba(0,40,90,.8)';X.shadowBlur=10;
    [['KARADENİZ',35.0,43.2],['AKDENİZ',32.0,34.0],['HAZAR DENİZİ',51.0,41.8],['BASRA KÖRFEZİ',51.2,27.6]].forEach(([n,lo,la])=>{const[x,y]=P(lo,la);X.fillText(n,x,y)});X.restore()}}
  (p.badges||[]).forEach(([q,big,small,end,col])=>{let a=A(q,.4);if(end!=null)a*=1-A(end,.4);if(a<=0)return;X.save();X.globalAlpha=a;const k=eback(clamp((T-R(q))/.5));X.translate(W/2,H-250);X.scale(lerp(.6,1,k),lerp(.6,1,k));
    X.font='900 76px CinzelH';const w=Math.max(X.measureText(big).width,560)+120;X.fillStyle=col||'rgba(170,20,24,.93)';X.shadowColor='rgba(0,0,0,.4)';X.shadowBlur=24;X.beginPath();X.roundRect(-w/2,-80,w,160,24);X.fill();X.shadowBlur=0;X.strokeStyle='#ffd27a';X.lineWidth=3;X.stroke();
    X.textAlign='center';X.textBaseline='middle';X.fillStyle=goldGrad(X,-60,10);X.fillText(big,0,-18);X.font='800 32px InterB';X.fillStyle='#fff';X.fillText(small,0,46);X.restore()});
  (p.text||[]).forEach(([q,txt,end,size])=>{let a=A(q,.3);if(end!=null)a*=1-A(end,.3);if(a<=0)return;X.save();X.globalAlpha=a;const k=eout(clamp((T-R(q))/.3));X.translate(W/2,H*.42);const s=lerp(1.5,1,k);X.scale(s,s);goldHeadB(txt,0,0,fitTxt(txt,'900 {s}px CinzelH',1700,size||150));X.restore()});
  yearBadge(p.year,ss(SH.t0,SH.t0+.5,T));
}
function formationF(cx,cy,ang,col,dark,rows,cols,t,seed){const r=rng(seed+1);X.save();X.translate(cx,cy);X.rotate(ang);
  for(let i=0;i<rows;i++)for(let j=0;j<cols;j++){const x=(i-rows/2)*22+Math.sin(t*12+j+i)*1.5,y=(j-cols/2)*20+(r()-.5)*3;
    X.strokeStyle=dark;X.lineWidth=2.5;X.beginPath();X.moveTo(x+5,y-6);X.lineTo(x+28,y-6);X.stroke();X.fillStyle=dark;X.fillRect(x-9,y-9,12,18);X.beginPath();X.arc(x,y,7.5,0,TAU);X.fillStyle=col;X.fill();X.lineWidth=1.5;X.stroke()}
  X.restore()}
