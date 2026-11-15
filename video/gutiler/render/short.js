// ================= DÎROK SHORT: GUTİLER (1080x1920) =================
const OFF=1.2; // narration offset
const RELIEF_IMG=new Image();RELIEF_IMG.src='relief.jpg';
const ALIGN=window.ALIGN; // {characters, character_start_times_seconds, character_end_times_seconds}
// ---- words + caption chunks
const WORDS=(()=>{const a=ALIGN,out=[];let w='',s=0,e=0;for(let i=0;i<a.characters.length;i++){const c=a.characters[i];
  if(c.trim()===''){if(w){out.push({w,s:s+OFF,e:e+OFF});w=''}continue}if(!w)s=a.character_start_times_seconds[i];w+=c;e=a.character_end_times_seconds[i]}
  if(w)out.push({w,s:s+OFF,e:e+OFF});return out})();
const CHUNKS=(()=>{const out=[];let cur=[];WORDS.forEach((wd,i)=>{cur.push(wd);const end=/[.,:!?…"]$/.test(wd.w)||cur.length>=4;if(end||i===WORDS.length-1){out.push(cur);cur=[]}});
  return out.map((c,i,arr)=>({words:c,s:c[0].s,e:(i<arr.length-1?Math.min(arr[i+1][0].s,c[c.length-1].e+.6):c[c.length-1].e+.8)}))})();
function captions(T){const ch=CHUNKS.find(c=>T>=c.s-.05&&T<c.e);if(!ch)return;
  const size=64;X.save();X.font=`900 ${size}px CinzelH`;X.letterSpacing='1px';X.textAlign='left';X.textBaseline='middle';
  const parts=ch.words.map(w=>w.w.replace(/"/g,'').toLocaleUpperCase('tr'));const sp=X.measureText(' ').width;const wid=p=>X.measureText(p).width;
  const lw=arr=>arr.reduce((a,i)=>a+wid(parts[i]),0)+sp*(arr.length-1);const all=parts.map((_,i)=>i);let lines=[all];
  if(lw(all)>960&&parts.length>1){let best=null;for(let k=1;k<parts.length;k++){const A=all.slice(0,k),B=all.slice(k);const m=Math.max(lw(A),lw(B));if(!best||m<best[0])best=[m,A,B]}lines=[best[1],best[2]]}
  const maxw=Math.max(...lines.map(lw));const sc=Math.min(1,980/maxw);const pop=1+.08*(1-eout((T-ch.s)/.18));
  X.translate(W/2,1390-(lines.length-1)*size*.55);X.scale(sc*pop,sc*pop);
  lines.forEach((ln,li)=>{let x=-lw(ln)/2;const y=li*size*1.15;ln.forEach(i=>{const p=parts[i],wd=ch.words[i],on=T>=wd.s-.03;
    X.lineJoin='round';X.lineWidth=12;X.strokeStyle='rgba(20,8,2,.95)';X.strokeText(p,x,y);X.fillStyle=on?goldGrad(X,y-size*.6,y+size*.4):'rgba(255,248,230,.95)';
    if(on&&T<wd.e+.05){X.shadowColor='rgba(255,170,40,.9)';X.shadowBlur=20}X.fillText(p,x,y);X.shadowBlur=0;x+=wid(p)+sp})});
  X.restore()}
// ---- relief map
function camShort(t){const K=[[0,41.2,37.0,18.5],[6.8,42.6,36.6,16.5],[10.4,46.0,35.0,9.2],[11.6,45.9,34.9,9.0],[13.0,45.0,33.0,10.2],[15.6,46.6,32.4,11.5],[17.0,45.4,33.9,10.5],[20.3,45.3,33.4,10.2],[23.1,45.3,33.4,10.6],
  [33.4,44.0,36.3,17.5],[36.2,44.5,36.0,15.5]];
  let i=0;while(i<K.length-2&&t>K[i+1][0])i++;const a=K[i],b=K[i+1],f=eio(clamp((t-a[0])/(b[0]-a[0])));
  const w=Math.exp(lerp(Math.log(a[3]),Math.log(b[3]),f));CAM={lon:lerp(a[1],b[1],f),lat:lerp(a[2],b[2],f),s:W/(w*RAD),rot:0}}
function dashedPoly(ring,col,fillA,lw=4){pathRing(ring);X.globalAlpha=fillA;X.fillStyle=col;X.fill();X.globalAlpha=1;X.setLineDash([16,10]);X.lineWidth=lw;X.strokeStyle=col;X.stroke();X.setLineDash([])}
function labelBox(x,y,title,sub,sub2,a,col='#e9a21e',k=1){if(a<=0)return;X.save();X.globalAlpha=a;X.translate(x,y);const s=lerp(.7,1,eback(k));X.scale(s,s);
  X.font='700 54px Cinzel';X.letterSpacing='3px';const tw=X.measureText(title).width;X.font='800 34px InterB';X.letterSpacing='0px';const sw=sub?X.measureText(sub).width:0;
  X.font='600 28px Inter';X.letterSpacing='3px';const s2w=sub2?X.measureText(sub2).width:0;
  const w=Math.max(tw,sw,s2w)+80,h=74+(sub?46:0)+(sub2?40:0);
  X.shadowColor='rgba(0,0,0,.6)';X.shadowBlur=24;X.fillStyle='rgba(38,18,10,.88)';X.beginPath();X.roundRect(-w/2,-h/2,w,h,14);X.fill();X.shadowBlur=0;
  X.strokeStyle=goldGrad(X,-h/2,h/2);X.lineWidth=3;X.stroke();
  X.textAlign='center';X.textBaseline='middle';let yy=-h/2+44;
  X.font='700 54px Cinzel';X.letterSpacing='3px';const g=X.createLinearGradient(0,yy-26,0,yy+22);g.addColorStop(0,'#ffe9a8');g.addColorStop(.5,col);g.addColorStop(1,'#a8560c');X.fillStyle=g;X.fillText(title,0,yy);
  if(sub){yy+=50;X.font='800 34px InterB';X.letterSpacing='0px';X.fillStyle='#fff';X.fillText(sub,0,yy)}
  if(sub2){yy+=40;X.font='600 28px Inter';X.letterSpacing='3px';X.fillStyle='#f1e6d0';X.fillText(sub2,0,yy)}
  X.restore()}
function formation(cx,cy,ang,col,dark,rows,cols,t,seed){const r=rng(seed);X.save();X.translate(cx,cy);X.rotate(ang);
  for(let i=0;i<rows;i++)for(let j=0;j<cols;j++){const x=(i-rows/2)*24+Math.sin(t*12+j+i)*1.5,y=(j-cols/2)*22+(r()-.5)*3;
    X.strokeStyle=dark;X.lineWidth=2.5;X.beginPath();X.moveTo(x+5,y-6);X.lineTo(x+30,y-6);X.stroke();
    X.fillStyle=dark;X.fillRect(x-9,y-9,12,18);X.beginPath();X.arc(x,y,8,0,TAU);X.fillStyle=col;X.fill();X.lineWidth=1.5;X.stroke()}
  // banner
  X.fillStyle=dark;X.fillRect(rows*7.5+6,-2,4,4);X.restore()}
function marchPath(a,b,f){return[lerp(a[0],b[0],f),lerp(a[1],b[1],f)]}
function drawReliefMap(t){
  camShort(t);
  X.fillStyle='#123f7c';X.fillRect(0,0,W,H);
  const R=window.RELIEF;const [x0,y0]=P(R.lon0,R.lat0),[x1,y1]=P(R.lon1,R.lat1);X.imageSmoothingQuality='high';X.drawImage(RELIEF_IMG,x0,y0,x1-x0,y1-y0);
  // ancient gulf
  pathRing(OLDGULF);X.fillStyle='#4f9fd4';X.globalAlpha=.9;X.fill();X.globalAlpha=1;
  // rivers
  for(const k of ['dicle','firat','zap','kzap','diyala','karun','kerhe','kizil','nil','nil2']){pathRing(RIVERS[k],false);X.lineCap='round';X.lineJoin='round';
    X.strokeStyle='rgba(20,60,110,.6)';X.lineWidth=k==='dicle'||k==='firat'?6:3.5;X.stroke();X.strokeStyle='#5fc6ff';X.lineWidth=k==='dicle'||k==='firat'?3:1.8;X.stroke()}
  // polities
  const pa=ss(.2,1.2,t);
  const P2={akad:['#f0a41c',.32],gut:['#e3322b',.42],lul:['#ff7f2a',.32],hur:['#3f84e5',.28],elam:['#14a896',.32],hat:['#c94b96',.28],mar:['#8e5bd8',.28]};
  for(const p of POLITIES){const c=P2[p.k];if(!c)continue;let a=pa;if(p.k==='gut')a*=lerp(.6,1.25,ss(10.2,10.8,t));X.save();X.globalAlpha=1;dashedPoly(p.r,c[0],c[1]*a,p.k==='gut'?5:3.5);X.restore()}
  // gutium glow
  const gu=ss(10.2,10.9,t);if(gu>0){const pulse=.5+.5*Math.sin(t*5);pathRing(GUTIUM);X.save();X.shadowColor='#ff3a1a';X.shadowBlur=40;X.strokeStyle=`rgba(255,${120+80*pulse},80,${gu})`;X.lineWidth=6;X.setLineDash([16,10]);X.stroke();X.restore()}
  // gutian rule spread
  const gr=ss(20.3,21.6,t);
  if(gr>0){X.save();pathRing(GUTI_RULE);X.clip();const [cx,cy]=P(46,34.9);const RR=gr*CAM.s*.09;const rr=X.createRadialGradient(cx,cy,RR*.6,cx,cy,RR);
    rr.addColorStop(0,'rgba(220,40,30,.45)');rr.addColorStop(.95,'rgba(255,70,40,.5)');rr.addColorStop(1,'rgba(255,70,40,0)');X.fillStyle=rr;X.fillRect(0,0,W,H);X.restore();
    pathRing(GUTI_RULE);X.setLineDash([16,10]);X.strokeStyle=`rgba(230,40,30,${gr})`;X.lineWidth=4;X.stroke();X.setLineDash([])}
  // cities
  const cityA=ss(11.8,12.6,t);
  for(const [nm,lo,la,lvl] of CITIES){if(!['Akad','Kiş','Nippur','Uruk','Ur','Lagaş','Susa','Aşur','Ninova','Mari'].includes(nm))continue;const[x,y]=P(lo,la);
    let col='#fff',a=nm==='Akad'?ss(11.3,11.9,t):cityA;if(a<=0)continue;let r=nm==='Akad'?11:7;
    const br=nm==='Akad'?ss(19.3,19.6,t):0;if(br>0)col='#ff4a2a';
    X.save();X.globalAlpha=a;X.beginPath();X.arc(x,y,r+3,0,TAU);X.fillStyle='#1a0c06';X.fill();X.beginPath();X.arc(x,y,r,0,TAU);X.fillStyle=col;X.fill();
    X.font=`700 ${nm==='Akad'?34:26}px Cinzel`;X.letterSpacing='3px';X.textAlign='left';X.textBaseline='middle';X.lineJoin='round';X.lineWidth=6;X.strokeStyle='rgba(20,10,4,.9)';const TT=nm.toLocaleUpperCase('tr');X.strokeText(TT,x+16,y);X.fillStyle=col;X.fillText(TT,x+16,y);X.restore();
    if(nm==='Akad'&&t>19.3&&t<20.6){const k=(t-19.3)/1.3;X.save();X.globalCompositeOperation='lighter';X.strokeStyle=`rgba(255,200,120,${1-k})`;X.lineWidth=6;X.beginPath();X.arc(x,y,20+k*260,0,TAU);X.stroke();
      const fg=X.createRadialGradient(x,y,0,x,y,200);fg.addColorStop(0,`rgba(255,240,200,${1-k})`);fg.addColorStop(1,'rgba(255,120,40,0)');X.fillStyle=fg;X.fillRect(x-200,y-200,400,400);X.restore()}}
  // armies: Gutian blocks march from Zagros to Akkad (16.6 -> 19.3)
  const mk2=clamp((t-16.4)/2.9);
  if(t>16.2&&t<23.2){const A=0;const fa=ss(16.2,16.6,t)*(1-ss(22.6,23.1,t));X.save();X.globalAlpha=fa;
    const targets=[[44.1,33.1],[44.6,32.6],[45.2,32.2]];const starts=[[46.0,35.2],[46.6,34.6],[47.1,34.0]];
    targets.forEach((tg,i)=>{const a=P(...starts[i]),b=P(...tg);const f=eio(clamp(mk2*1.1-i*.06));const p=marchPath(a,b,f);const ang=Math.atan2(b[1]-a[1],b[0]-a[0]);
      // trail arrow
      X.save();X.strokeStyle='rgba(200,30,20,.55)';X.lineWidth=10;X.setLineDash([18,12]);X.lineDashOffset=-t*60;X.beginPath();X.moveTo(a[0],a[1]);X.lineTo(p[0],p[1]);X.stroke();X.restore();
      formation(p[0],p[1],ang,'#e5332a','#3a0805',5,7,t,i+3)});
    // Akkad defenders (gold) break
    const d=P(43.8,33.25),dk=ss(18.9,19.5,t);X.globalAlpha=fa*(1-dk);formation(d[0]-dk*60,d[1]+dk*30,0,'#f2b134','#4a2c05',4,6,t,9);X.restore()}
  // labels
  const lt=(a,b)=>ss(a,a+.35,t)*(1-ss(b,b+.35,t));
  {const[x,y]=P(47.6,33.7);labelBox(x,y,'GUTİLER','Kürtlerin ataları','ZAGROS DAĞLARI',lt(10.4,16.0)+lt(33.6,36.0),'#ff5a3a',clamp((t-10.4)/.5)*(t<33?1:clamp((t-33.6)/.5)))}
  {const[x,y]=P(43.0,34.4);labelBox(x,y,'AKAD','İmparatorluk','BAŞKENT: AKAD',lt(11.6,16.3),'#f2b134',clamp((t-11.6)/.5))}
  {const[x,y]=P(45.6,30.6);labelBox(x,y+20,'SÜMER','Şehir devletleri','UR · URUK · LAGAŞ',lt(13.3,16.3),'#ffd36a',clamp((t-13.3)/.5))}
  {const[x,y]=P(49.4,31.2);labelBox(x,y,'ELAM','Susa','',lt(14.9,16.3),'#2fd0b8',clamp((t-14.9)/.5))}
  // sea / region tags in wide view
  const wa=(1-ss(6.8,8.5,t))+ss(33.4,34.4,t);
  if(wa>0){X.save();X.globalAlpha=clamp(wa)*.95;X.textAlign='center';X.font='600 44px Corm';X.letterSpacing='8px';X.fillStyle='#e8f6ff';X.shadowColor='rgba(0,0,0,.6)';X.shadowBlur=10;
    [['KARADENİZ',34.8,43.1],['AKDENİZ',31.6,34.0],['HAZAR',51.0,42.0]].forEach(([n,lo,la])=>{const[x,y]=P(lo,la);X.fillText(n,x,y)});X.restore();
    [['AKAD',42.0,34.3,'#ffd77a'],['GUTİUM',46.7,34.6,'#ffb3a0'],['ELAM',50.4,31.0,'#a8fff0'],['HURRİLER',41.2,37.6,'#bcd6ff'],['HATTİLER',34.4,39.9,'#ffc4e6']].forEach(([n,lo,la,c])=>{const[x,y]=P(lo,la);
      X.save();X.globalAlpha=clamp(wa)*ss(.6,1.4,t+ (t>30?5:0));X.textAlign='center';X.textBaseline='middle';X.font='700 34px Cinzel';X.letterSpacing='5px';X.lineJoin='round';X.lineWidth=7;X.strokeStyle='rgba(25,10,4,.85)';X.strokeText(n,x,y);X.fillStyle=c;X.fillText(n,x,y);X.restore()})}
  // 100 years badge
  const by=lt(20.5,22.8);if(by>0){X.save();X.globalAlpha=by;const k=eback(clamp((t-20.5)/.5));X.translate(W/2,1080);X.scale(lerp(.6,1,k),lerp(.6,1,k));
    X.fillStyle='rgba(150,14,18,.92)';X.shadowColor='rgba(255,40,40,.7)';X.shadowBlur=30;X.beginPath();X.roundRect(-400,-90,800,180,24);X.fill();X.shadowBlur=0;X.strokeStyle='#ffd27a';X.lineWidth=3;X.stroke();
    X.textAlign='center';X.textBaseline='middle';X.font='900 84px CinzelH';X.fillStyle=goldGrad(X,-70,10);X.fillText('100 YIL',0,-22);X.font='800 36px InterB';X.fillStyle='#fff';X.fillText('GUTİ HÂKİMİYETİ',0,46);X.restore()}
  // AKAD YIKILDI punch
  const ap=lt(19.35,20.4);if(ap>0){X.save();X.globalAlpha=ap;const k=eout(clamp((t-19.35)/.25));const s=lerp(1.6,1,k);X.translate(W/2,860);X.scale(s,s);goldHead('AKAD',0,0,190);goldHead('YIKILDI!',0,170,160);X.restore()}
}
function topTitle(t,a){if(a<=0)return;X.save();X.globalAlpha=a;
  const bg=X.createLinearGradient(0,0,0,560);bg.addColorStop(0,'rgba(10,6,2,.75)');bg.addColorStop(1,'rgba(10,6,2,0)');X.fillStyle=bg;X.fillRect(0,0,W,560);
  X.textAlign='center';X.font='700 46px Cinzel';X.letterSpacing='12px';X.fillStyle=goldGrad(X,190,240);X.lineWidth=6;X.lineJoin='round';X.strokeStyle='rgba(20,8,2,.8)';X.strokeText('MÖ 2150',W/2,232);X.fillText('MÖ 2150',W/2,232);
  const k=eback(clamp(t/.6));X.translate(W/2,0);X.scale(lerp(1.5,1,k),lerp(1.5,1,k));goldHead('GUTİLER',0,385,fitSize('GUTİLER','900 {s}px CinzelH',940,170));
  X.font='900 54px CinzelH';X.letterSpacing='4px';X.textAlign='center';X.lineWidth=9;X.strokeStyle='#170804';X.strokeText('AKAD’I YIKAN DAĞLILAR',0,470);X.fillStyle=goldGrad(X,430,480);X.fillText('AKAD’I YIKAN DAĞLILAR',0,470);X.restore()}

// ---- clash scene
function drawClash(t){ // local 0..3.3, clash at 1.5
  camShort(23);drawReliefMap(23.0);X.fillStyle='rgba(8,4,2,.72)';X.fillRect(0,0,W,H);
  const cx=W/2,cy=820,CL=1.5;const k=clamp(t/CL);
  const shake=t>CL?Math.exp(-(t-CL)*6)*24:0;X.save();X.translate(Math.sin(t*90)*shake,Math.cos(t*80)*shake);
  // burst
  const bk=t>CL?1:ss(.2,CL,t)*.35;X.save();X.globalCompositeOperation='lighter';const gl=X.createRadialGradient(cx,cy-60,30,cx,cy-60,700);gl.addColorStop(0,`rgba(255,245,215,${.9*bk})`);gl.addColorStop(.2,`rgba(255,190,90,${.6*bk})`);gl.addColorStop(1,'rgba(255,90,20,0)');X.fillStyle=gl;X.fillRect(0,0,W,H);
  if(t>CL){const rr=rng(9);for(let i=0;i<90;i++){const a=rr()*TAU,L=180+rr()*700*eout((t-CL)/.4),w=1+rr()*4;X.strokeStyle=`rgba(255,${230+rr()*25|0},${180+rr()*60|0},${.3+rr()*.6})`;X.lineWidth=w;X.beginPath();X.moveTo(cx+Math.cos(a)*120,cy-60+Math.sin(a)*120);X.lineTo(cx+Math.cos(a)*L,cy-60+Math.sin(a)*L);X.stroke()}}
  X.restore();
  const e=Math.pow(k,2.4);sword(cx-230,cy+330,lerp(-1.4,.6,e),620,40);sword(cx+230,cy+330,lerp(1.4,-.6,e),620,-40);
  if(t>CL){const st=t-CL,sx=cx,sy=cy-6;X.save();X.globalCompositeOperation='lighter';
    for(let i=0;i<160;i++){const a=hash(i)*TAU,v=300+hash(i+1)*1300,life=.3+hash(i+2)*1.1;const age=st;if(age>life)continue;const kk=1-age/life;const x=sx+Math.cos(a)*v*age*.4,y=sy+Math.sin(a)*v*age*.4+700*age*age*.4;
      X.strokeStyle=`rgba(255,${200+hash(i+5)*55|0},120,${kk})`;X.lineWidth=1.5+hash(i+7)*3*kk;X.beginPath();X.moveTo(x,y);X.lineTo(x-Math.cos(a)*v*.014,y-Math.sin(a)*v*.014);X.stroke()}
    const fl=Math.exp(-st*5);const fg=X.createRadialGradient(sx,sy,0,sx,sy,420*fl+40);fg.addColorStop(0,`rgba(255,255,240,${fl})`);fg.addColorStop(1,'rgba(255,140,40,0)');X.fillStyle=fg;X.fillRect(0,0,W,H);
    X.fillStyle=`rgba(255,230,190,${.8*fl})`;X.fillRect(0,sy-3,W,6);X.restore()}
  X.restore();
  if(t>CL&&t<CL+.07){X.fillStyle='rgba(255,245,225,.9)';X.fillRect(0,0,W,H)}
  const q=ss(CL+.05,CL+.4,t);if(q>0){X.save();X.globalAlpha=q;const s=1+.1*(1-eout((t-CL)/.5));X.translate(W/2,320);X.scale(s,s);
    goldHead('DAĞLARIN',0,0,fitSize('DAĞLARIN','900 {s}px CinzelH',900,150));goldHead('EJDERHASI',0,150,fitSize('EJDERHASI','900 {s}px CinzelH',940,140));X.restore();
    X.save();X.globalAlpha=q;X.textAlign='center';X.font='600 40px Corm';X.fillStyle='#f6e9cc';X.shadowColor='#000';X.shadowBlur=10;X.fillText('— Uruk Kralı Utu-hengal’in yazıtı, MÖ ~2050',W/2,1220);X.restore()}
}
// ---- sources (vertical)
function drawSourcesV(t){ // local 0..7.1
  const bg=X.createRadialGradient(W/2,H/2,100,W/2,H/2,H*.7);bg.addColorStop(0,'#24162a');bg.addColorStop(1,'#060308');X.fillStyle=bg;X.fillRect(0,0,W,H);
  X.save();X.globalAlpha=.08;X.drawImage(CUNEI,-t*10,0,W*2,H);X.drawImage(CUNEI,-t*10,H*.5,W*2,H);X.restore();embers(t+40,60,.6);
  const out=ss(5.1,5.6,t);
  glowText('TARİHÇİLER NE DİYOR?',W/2,330,'700 52px Cinzel','#f2d283',ss(0,.5,t)*(1-out),'rgba(255,170,60,.5)',20,8);
  const C=[CARDS[0],CARDS[1]];[0,2.2].forEach((st,i)=>{if(t<st)return;const e=eback(clamp((t-st)/.6));const x=i===0?W*.265:W*.735;const y=760-out*80;
    card(C[i],x+(1-e)*(i?400:-400),y,.9*lerp(.8,1,e)*(1-out*.3),clamp((t-st)/.3)*(1-out),clamp((t-st-.3)/.9))});
  const L=ss(5.2,5.7,t);if(L>0){glowText('GUTİLER',W/2,560,'900 120px CinzelD','#ffb27a',L,'#ff4a1a',30,6);
    const ah=eout(clamp((t-5.4)/.7));X.save();X.globalAlpha=L;const g=X.createLinearGradient(0,640,0,900);g.addColorStop(0,'#ff6a2a');g.addColorStop(1,'#ffe39a');X.fillStyle=g;X.shadowColor='#ffb347';X.shadowBlur=25;
    X.fillRect(W/2-4,640,8,260*ah);if(ah>.95){X.beginPath();X.moveTo(W/2-30,890);X.lineTo(W/2+30,890);X.lineTo(W/2,940);X.fill()}X.restore();
    glowText('KÜRTLER',W/2,1030,'900 120px CinzelD','#ffe7a8',ss(5.9,6.3,t),'#ffb347',30,6);
    glowText('en eski atalar',W/2,1140,'600 60px Corm','#f6ecd4',ss(6.0,6.5,t),'rgba(255,170,60,.5)',18,1)}
}
// ---- logo vertical
function drawLogoV(t){X.fillStyle='#0d0819';X.fillRect(0,0,W,H);const cx=W/2,cy=820,S=700,R=S*.478;
  const bg=X.createRadialGradient(cx,cy,0,cx,cy,900);bg.addColorStop(0,`rgba(255,170,80,${.35*ss(.2,1.2,t)})`);bg.addColorStop(1,'rgba(0,0,0,0)');X.fillStyle=bg;X.fillRect(0,0,W,H);
  const rk=eback(clamp((t-.3)/1.0));X.save();X.translate(cx,cy);X.rotate(t*.06);
  for(let i=0;i<21;i++){const L=R+(110+30*Math.sin(t*2.2+i*.9))*rk;const g=X.createLinearGradient(0,-R,0,-L);g.addColorStop(0,'rgba(255,214,90,.95)');g.addColorStop(1,'rgba(255,170,40,.15)');
    X.fillStyle=g;X.beginPath();X.moveTo(-32,-R+10);X.lineTo(0,-L);X.lineTo(32,-R+10);X.closePath();X.shadowColor='rgba(255,180,60,.8)';X.shadowBlur=20;X.globalAlpha=ss(.3,.7,t);X.fill();X.rotate(TAU/21)}X.restore();
  const k=eback(clamp(t/.8)),sc=lerp(.82,1,k);X.save();X.translate(cx,cy);X.scale(sc,sc);X.globalAlpha=ss(0,.3,t);X.beginPath();X.arc(0,0,R*clamp(t/.5+.2,0,1),0,TAU);X.clip();X.drawImage(LOGO,-S/2,-S/2,S,S);
  const sw=(t-.9)/1.0;if(sw>0&&sw<1){X.globalCompositeOperation='lighter';X.rotate(.35);const sx=lerp(-S,S,sw);const g=X.createLinearGradient(sx-110,0,sx+110,0);g.addColorStop(0,'rgba(255,240,200,0)');g.addColorStop(.5,'rgba(255,240,200,.45)');g.addColorStop(1,'rgba(255,240,200,0)');X.fillStyle=g;X.fillRect(-S,-S,S*2,S*2)}X.restore();
  X.save();X.strokeStyle=goldGrad(X,cy-R,cy+R);X.lineWidth=5;X.shadowColor='rgba(255,190,80,.9)';X.shadowBlur=28;X.beginPath();X.arc(cx,cy,R*sc+6,-Math.PI/2,-Math.PI/2+TAU*eout((t-.1)/1.0));X.stroke();X.restore();
  const sb=ss(1.2,1.6,t);if(sb>0){X.save();X.globalAlpha=sb;const bs=lerp(.8,1,eback(clamp((t-1.2)/.4)));X.translate(cx,1330);X.scale(bs,bs);X.fillStyle='#c4161c';X.shadowColor='rgba(255,40,40,.7)';X.shadowBlur=30;X.beginPath();X.roundRect(-230,-55,460,110,55);X.fill();X.shadowBlur=0;
    X.font='800 48px InterB';X.textAlign='center';X.textBaseline='middle';X.fillStyle='#fff';X.fillText('TAKİP ET',0,3);X.restore()}
  embers(t+90,60,.5)}
// ---- master
const SCN=[{a:0,b:23.25,f:t=>drawReliefMap(t)},{a:23.1,b:26.6,f:t=>drawClash(t-23.1)},{a:26.45,b:33.6,f:t=>drawSourcesV(t-26.45)},{a:33.4,b:36.15,f:t=>drawReliefMap(t)},{a:36.0,b:40.1,f:t=>drawLogoV(t-36.0)}];
const BUF2=mk(W,H),B2=BUF2.getContext('2d');
function renderFrame(T){X.setTransform(1,0,0,1,0,0);X.globalAlpha=1;X.globalCompositeOperation='source-over';X.fillStyle='#000';X.fillRect(0,0,W,H);
  const act=SCN.filter(s=>T>=s.a&&T<s.b);
  act.forEach((s,i)=>{if(i===0){X.save();s.f(T);X.restore()}else{const prev=act[i-1];const k=clamp((T-s.a)/(prev.b-s.a));const main=X;B2.setTransform(1,0,0,1,0,0);B2.clearRect(0,0,W,H);
    try{X=B2;X.save();s.f(T);X.restore()}finally{X=main}X.save();X.globalAlpha=eio(k);const z=lerp(1.08,1,eio(k));X.translate(W/2,H/2);X.scale(z,z);X.translate(-W/2,-H/2);X.drawImage(BUF2,0,0);X.restore();
    X.fillStyle=`rgba(255,220,180,${.35*Math.sin(Math.PI*k)})`;X.fillRect(0,0,W,H)}});
  X.setTransform(1,0,0,1,0,0);X.globalAlpha=1;
  const ta=(T<23.2?1:0)*(1-ss(19.2,19.4,T)+ss(20.4,20.8,T))*(T<23.2?1:0)+ (T>33.5&&T<36.1?ss(33.5,34,T):0);
  topTitle(T,clamp(ta));
  const vg=X.createRadialGradient(W/2,H/2,H*.35,W/2,H/2,H*.8);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.55)');X.fillStyle=vg;X.fillRect(0,0,W,H);
  if(T<36.0)captions(T);
  X.save();X.globalAlpha=.035;X.globalCompositeOperation='overlay';X.drawImage(GRAIN[Math.floor(T*24)%4],0,0,W,H);X.restore();
  if(T<.15){X.fillStyle=`rgba(255,240,210,${1-T/.15})`;X.fillRect(0,0,W,H)}
  if(T>39.5){X.fillStyle=`rgba(0,0,0,${clamp((T-39.5)/.5)})`;X.fillRect(0,0,W,H)}}
window.renderFrame=renderFrame;
