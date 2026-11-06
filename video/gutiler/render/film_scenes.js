// ================= FILM SCENES (bright) =================
const CARD_COLORS=[['#ffd36b','#ff7a59','#8a3fd0'],['#ffe08a','#ff8a3a','#c6304a'],['#a8f0ff','#3fa0ff','#5b3fd0'],['#ffe7a0','#ff9a3a','#d23a3a'],['#c8ffb0','#3fc08a','#2a6fd0'],['#ffd6f0','#ff6aa8','#7a3fd0'],['#fff0a0','#ffb02a','#2f8f6f'],['#b0f0ff','#38b0c8','#3a50d0'],['#ffe2b0','#ff8f4a','#9a2f8f'],['#d0ffd0','#5fd08a','#1f7fa0'],['#ffe6a0','#ff9a6a','#5a3fd0']];
function sChapterCard(T,p){const lt=T-SH.t0;const c=CARD_COLORS[(p.num-1)%CARD_COLORS.length];brightBG(lt,...c);
  // mountain silhouettes (bright)
  X.save();X.globalAlpha=.55;X.drawImage(DAY[0],-200-lt*20,170);X.globalAlpha=.75;X.drawImage(DAY[2],-300-lt*40,250);X.restore();
  sparkles(lt,70);
  X.save();X.globalAlpha=.16*ss(0,.5,lt);X.font='900 520px CinzelH';X.textAlign='center';X.textBaseline='middle';X.fillStyle='#fff';X.fillText(String(p.num),W/2,H*.47);X.restore();
  const k=eback(clamp((lt-.1)/.6));X.save();X.globalAlpha=ss(0,.3,lt)*(1-ss(3.7,4.2,lt));X.textAlign='center';
  X.font='800 40px InterB';X.letterSpacing='14px';X.fillStyle='#fff';X.shadowColor='rgba(0,0,0,.35)';X.shadowBlur=12;X.fillText('BÖLÜM '+p.num,W/2,H*.3);X.shadowBlur=0;
  X.translate(W/2,H*.53);X.scale(lerp(.6,1,k),lerp(.6,1,k));goldHeadB(p.title,0,0,fitTxt(p.title,'900 {s}px CinzelH',1600,150));
  X.font='italic 600 60px Corm';X.letterSpacing='2px';X.fillStyle='#fff';X.shadowColor='rgba(0,0,0,.4)';X.shadowBlur=14;X.fillText(p.sub,0,100);X.restore()}
function sTitle(T,p){const lt=T-SH.t0;landscape(lt,lt*30,.25);sparkles(lt,80);
  X.save();X.globalAlpha=ss(.2,.8,lt);const k=eback(clamp((lt-.2)/.7));X.translate(W/2,H*.42);X.scale(lerp(.5,1,k),lerp(.5,1,k));goldHeadB('GUTİLER',0,0,210);X.restore();
  X.save();X.globalAlpha=ss(.9,1.5,lt);X.textAlign='center';X.font='900 64px CinzelH';X.letterSpacing='6px';X.lineJoin='round';X.lineWidth=10;X.strokeStyle='#2a1206';X.strokeText('VE ZAGROS’UN KADİM HALKLARI',W/2,H*.42+110);X.fillStyle='#fff';X.fillText('VE ZAGROS’UN KADİM HALKLARI',W/2,H*.42+110);
  X.font='italic 600 50px Corm';X.letterSpacing='2px';X.lineWidth=6;X.strokeText('Kürtlerin ataları',W/2,H*.42+185);X.fillStyle='#ffe9a8';X.fillText('Kürtlerin ataları',W/2,H*.42+185);X.restore();
  if(LOGO.complete){X.save();X.globalAlpha=ss(1.2,1.8,lt);X.beginPath();X.arc(W/2,H*.83,85,0,TAU);X.clip();X.drawImage(LOGO,W/2-90,H*.83-90,180,180);X.restore()}}
// ---- battles
function sBattle(T,p){const lt=T-SH.t0;const cam=lt*60;landscape(lt,cam,p.warm||0);dust(lt,700,.25);
  const L=p.left,Rr=p.right;const AXc=AX;AXc.clearRect(0,0,W,H);const prog=lt/(SH.t1-SH.t0+.5);
  for(const s of SOLD){const depth=[.45,.6,.8,1.1][s.row],h=250*depth,gy=[800,850,915,1000][s.row];const base=-180+s.off*760+s.row*25;const x=(s.side>0?base+230*lt:W-base-230*lt)-cam*depth*.4;
    if(lt>3.4){}const ph=lt*10*s.sp+s.ph;const side=s.side>0?L:Rr;const pr=runPose(x,gy,s.side,h,ph,.34);
    if(s.typ>.5&&side.sword!==false){pr.ua=[2.6+.15*Math.sin(ph),.5];warriorC(AXc,pr,side.pal,{helmet:side.helmet,shield:side.shield,sword:'sickle',wind:lt*2})}
    else{pr.ua=[1.3,-.5];warriorC(AXc,pr,side.pal,{helmet:side.helmet,shield:side.shield,spear:.15,wind:lt*2})}}
  for(let i=0;i<4;i++){const sd=i<2?1:-1;const side=sd>0?L:Rr;const x=(sd>0?120+(i%2)*300+220*lt:W-120-(i%2)*300-220*lt)-cam*.6;AXc.fillStyle='#4a2a12';AXc.fillRect(x,500,10,440);
    AXc.beginPath();AXc.moveTo(x+5,505);for(let k=0;k<=10;k++)AXc.lineTo(x+5-sd*k*18,505+Math.sin(lt*7+k*.7)*10*k/10);for(let k=10;k>=0;k--)AXc.lineTo(x+5-sd*k*18,600+Math.sin(lt*7+k*.7+.5)*10*k/10);AXc.fillStyle=side.pal.tunic;AXc.fill();AXc.strokeStyle='#fff';AXc.lineWidth=3;AXc.stroke()}
  X.save();X.shadowColor='rgba(40,20,0,.35)';X.shadowBlur=10;X.shadowOffsetY=6;X.drawImage(ARMY,0,0);X.restore();dust(lt,820,.3);
  const ta=ss(.3,.8,lt);labelBoxB(330,180,L.name,L.sub||'','',ta,'#ff6a4a',clamp((lt-.3)/.5));labelBoxB(W-330,180,Rr.name,Rr.sub||'','',ta,'#ffd36a',clamp((lt-.3)/.5));
  if(p.vs){X.save();X.globalAlpha=ta;X.font='900 90px CinzelH';X.textAlign='center';X.lineWidth=12;X.lineJoin='round';X.strokeStyle='#2a1206';X.strokeText('VS',W/2,210);X.fillStyle=goldGrad(X,150,220);X.fillText('VS',W/2,210);X.restore()}
  if(p.year)yearBadge(p.year,ss(0,.5,lt))}
function sDuel(T,p){const lt=T-SH.t0;const CL=p.clash!=null?R(p.clash)-SH.t0:1.2;const tt=lt<CL?lt:CL+(lt-CL)*.25;landscape(tt*.5,tt*20,p.warm||.15);
  const zoom=1+.05*ss(0,CL,lt)+.08*(lt>CL?eout((lt-CL)/.25):0);const shake=lt>CL?Math.exp(-(lt-CL)*6)*24:0;
  X.save();X.translate(W/2+Math.sin(lt*90)*shake,H/2+Math.cos(lt*77)*shake);X.scale(zoom,zoom);X.translate(-W/2,-H/2);const h=640,GY=990;
  const A0={x:610,y:0,f:1,h,torso:-.12,head:0,ua:[3.45,.95],ba:[.9,1.0],fl:[.6,-.3],bl:[-.55,-.05]},A1={x:700,y:0,f:1,h,torso:.3,head:-.1,ua:[1.88,.05],ba:[.6,.9],fl:[.85,-.6],bl:[-.7,-.05]};
  const B0={x:1330,y:0,f:-1,h,torso:-.02,head:0,ua:[1.2,1.0],ba:[.8,1.0],fl:[.5,-.3],bl:[-.5,-.05]},B1={x:1280,y:0,f:-1,h,torso:-.14,head:.1,ua:[2.0,.45],ba:[.7,1.1],fl:[.62,-.45],bl:[-.68,-.05]};
  const s0=CL-1.0;const kA=lt<s0+.55?ss(s0,s0+.55,lt)*.12:(lt<CL?.12+.88*Math.pow(clamp((lt-s0-.55)/.45),2.2):1);const kB=ss(s0+.2,CL,lt);
  const pa=ground(lerpPose(A0,A1,kA),GY),pb=ground(lerpPose(B0,B1,kB),GY);if(lt>CL){const push=Math.sin((lt-CL)*3)*6;pa.x+=push;pb.x+=push}
  DX.clearRect(0,0,W,H);warriorC(DX,pb,PAL[p.b||'akad'],{helmet:'dome',shield:'rect',sword:'straight',grip:.2,blen:.46,cloak:true,wind:tt});warriorC(DX,pa,PAL[p.a||'guti'],{helmet:'cone',shield:'round',sword:'sickle',grip:.35,cloak:true,wind:tt});
  X.save();X.shadowColor='rgba(40,20,0,.4)';X.shadowBlur=16;X.shadowOffsetY=10;X.drawImage(DUO,0,0);X.restore();
  let cp=pa._mid||[960,420];if(pa._b0&&pb._b0){const [p1,p2,p3,p4]=[pa._b0,pa._tip,pb._b0,pb._tip];const d=(p1[0]-p2[0])*(p3[1]-p4[1])-(p1[1]-p2[1])*(p3[0]-p4[0]);if(Math.abs(d)>1e-3){const u=((p1[0]-p3[0])*(p3[1]-p4[1])-(p1[1]-p3[1])*(p3[0]-p4[0]))/d;const ix=[p1[0]+u*(p2[0]-p1[0]),p1[1]+u*(p2[1]-p1[1])];if(ix[0]>600&&ix[0]<1400&&ix[1]>150&&ix[1]<800)cp=ix}}
  if(lt>CL){const st=lt-CL;X.save();X.globalCompositeOperation='lighter';for(let i=0;i<200;i++){const a=hash(i)*TAU,v=(300+hash(i+1)*1500),life=.35+hash(i+2)*1.2;const age=st*(1+hash(i+4)*.3)*(st>.25?.6:1);if(age>life)continue;const k=1-age/life;
      const x=cp[0]+Math.cos(a)*v*age*.35,y=cp[1]+Math.sin(a)*v*age*.35+900*age*age*.35;X.strokeStyle=`rgba(255,${200+hash(i+5)*55|0},${120+hash(i+6)*100|0},${k})`;X.lineWidth=1.5+hash(i+7)*3*k;X.beginPath();X.moveTo(x,y);X.lineTo(x-Math.cos(a)*v*.012,y-(Math.sin(a)*v+900*age)*.012);X.stroke()}
    const fl=Math.exp(-st*5);const fg=X.createRadialGradient(cp[0],cp[1],0,cp[0],cp[1],500*fl+60);fg.addColorStop(0,`rgba(255,255,240,${fl})`);fg.addColorStop(.2,`rgba(255,220,140,${.7*fl})`);fg.addColorStop(1,'rgba(255,160,60,0)');X.fillStyle=fg;X.fillRect(0,0,W,H);X.restore()}
  X.restore();if(lt>CL&&lt<CL+.07){X.fillStyle='rgba(255,250,235,.9)';X.fillRect(0,0,W,H)}
  if(p.quote){const q=ss(CL+.05,CL+.5,lt);if(q>0){X.save();X.globalAlpha=q;const s=1+.06*(1-eout((lt-CL)/.8));X.translate(W/2,190);X.scale(s,s);goldHeadB(p.quote[0],0,0,fitTxt(p.quote[0],'900 {s}px CinzelH',1700,100));
    X.font='italic 600 40px Corm';X.textAlign='center';X.lineJoin='round';X.lineWidth=6;X.strokeStyle='rgba(40,20,5,.8)';X.strokeText(p.quote[1],0,70);X.fillStyle='#fff';X.fillText(p.quote[1],0,70);X.restore()}}}
// ---- museum backdrop
function museum(lt,c1='#fff4e0',c2='#e8c89a'){const g=X.createRadialGradient(W/2,H*.4,100,W/2,H/2,W*.75);g.addColorStop(0,c1);g.addColorStop(1,c2);X.fillStyle=g;X.fillRect(0,0,W,H);
  X.save();X.globalAlpha=.08;X.drawImage(CUNEI,-lt*6,0);X.restore();const fl=X.createLinearGradient(0,H*.78,0,H);fl.addColorStop(0,'rgba(120,80,40,.0)');fl.addColorStop(1,'rgba(120,80,40,.25)');X.fillStyle=fl;X.fillRect(0,H*.7,W,H*.3)}
function carved(ctx,drawFn,base,dark,light){ctx.save();ctx.translate(3,3);drawFn(dark);ctx.restore();ctx.save();ctx.translate(-2,-2);drawFn(light);ctx.restore();drawFn(base)}
function sStele(T,p){const lt=T-SH.t0;museum(lt);const z=1+.03*lt;X.save();X.translate(W*.36,H*.52);X.scale(z,z);
  const sw=420,sh=840;X.beginPath();X.moveTo(-sw/2,sh/2);X.lineTo(-sw/2+20,-sh/2+160);X.quadraticCurveTo(-60,-sh/2-10,40,-sh/2);X.quadraticCurveTo(sw/2-10,-sh/2+120,sw/2,sh/2);X.closePath();
  X.save();X.shadowColor='rgba(80,40,10,.4)';X.shadowBlur=40;X.shadowOffsetX=20;const g=X.createLinearGradient(-sw/2,0,sw/2,0);g.addColorStop(0,'#c99b80');g.addColorStop(.5,'#e8c7ad');g.addColorStop(1,'#b88a6e');X.fillStyle=g;X.fill();X.restore();
  X.save();X.clip();X.globalAlpha=.25;X.globalCompositeOperation='multiply';X.drawImage(SMOKE,-sw,-sh/2,sw*2,sh);X.restore();
  const base='#d6ae93',dark='#8f6650',light='#f6dcc8';
  carved(X,c=>{X.fillStyle=c;X.beginPath();X.moveTo(40,-200);X.lineTo(170,300);X.lineTo(-60,300);X.closePath();X.fill()},base,dark,light);
  carved(X,c=>{X.fillStyle=c;[[-30,-330],[30,-350]].forEach(([x,y])=>{X.beginPath();X.arc(x,y,22,0,TAU);X.fill();for(let i=0;i<8;i++){X.save();X.translate(x,y);X.rotate(i*TAU/8);X.fillRect(-3,-40,6,16);X.restore()}})},base,dark,light);
  const fig=(x,y,hh,f,pose,cone)=>c=>{const pp={x,y,f,h:hh,torso:pose[0],head:0,ua:pose[1],ba:pose[2],fl:pose[3],bl:pose[4]};warrior(X,pp,c,{helmet:cone?'cone':'dome',spear:cone?null:.6})};
  carved(X,fig(-30,-120,250,1,[.2,[2.3,.4],[1.0,.5],[.7,-.9],[-.3,-.1]],true),base,dark,light);
  [[-150,120,170],[-110,250,160],[-160,330,150]].forEach(([x,y,hh])=>carved(X,fig(x,y,hh,1,[.35,[1.5,-.2],[.8,.4],[.6,-.7],[-.4,-.1]],false),base,dark,light));
  carved(X,c=>{X.save();X.translate(110,40);X.rotate(1.3);const pp={x:0,y:0,f:-1,h:150,torso:.2,head:0,ua:[2.5,.3],ba:[1.2,.4],fl:[.3,-.2],bl:[-.2,-.1]};warrior(X,pp,c,{});X.restore()},base,dark,light);
  X.restore();
  labelBoxB(W*.73,H*.33,'NARAM-SİN STELİ','MÖ ~2250 · Lullubilere karşı zafer','LOUVRE MÜZESİ',ss(.4,.8,lt),'#ffb23a',clamp((lt-.4)/.5));
  if(p.notes)p.notes.forEach(([q,t1,s1],i)=>{const a=A(q,.4);labelBoxB(W*.73,H*.58+i*150,t1,s1,'',a,'#ff7a4a',clamp((T-R(q))/.5),.85)})}
function sAnubanini(T,p){const lt=T-SH.t0;const g=X.createLinearGradient(0,0,0,H);g.addColorStop(0,'#7cc4f2');g.addColorStop(1,'#d9efff');X.fillStyle=g;X.fillRect(0,0,W,H);
  const z=1+.025*lt;X.save();X.translate(W/2,H/2);X.scale(z,z);X.translate(-W/2,-H/2);
  const rg=X.createLinearGradient(0,0,0,H);rg.addColorStop(0,'#c98a4a');rg.addColorStop(1,'#9a6232');X.fillStyle=rg;X.beginPath();X.moveTo(0,120);for(let x=0;x<=W;x+=60)X.lineTo(x,100+Math.sin(x*.01)*40+hash(x)*40);X.lineTo(W,H);X.lineTo(0,H);X.fill();
  X.save();X.globalAlpha=.35;X.globalCompositeOperation='multiply';X.drawImage(SMOKE,0,100,W,H);X.restore();
  const px=W*.18,py=250,pw=900,ph=560;X.fillStyle='#d6a26a';X.fillRect(px,py,pw,ph);X.strokeStyle='#7a4a22';X.lineWidth=6;X.strokeRect(px,py,pw,ph);
  const base='#cf9a62',dark='#7a4a22',light='#f2c894';
  carved(X,c=>{const pp={x:px+300,y:py+300,f:1,h:330,torso:.05,head:0,ua:[1.7,-.1],ba:[.4,.3],fl:[.05,-.05],bl:[-.15,-.02]};warrior(X,pp,c,{helmet:'cone',bow:true})},base,dark,light);
  carved(X,c=>{X.save();X.translate(px+330,py+505);X.rotate(1.5);const pp={x:0,y:0,f:1,h:180,torso:.1,head:0,ua:[2.6,.2],ba:[2.0,.3],fl:[.2,-.2],bl:[-.2,-.1]};warrior(X,pp,c,{});X.restore()},base,dark,light);
  carved(X,c=>{X.fillStyle=c;X.beginPath();X.moveTo(px+560,py+520);X.lineTo(px+680,py+520);X.lineTo(px+650,py+250);X.lineTo(px+590,py+250);X.closePath();X.fill();X.beginPath();X.arc(px+620,py+215,38,0,TAU);X.fill();
    for(let i=0;i<4;i++){X.beginPath();X.ellipse(px+620,py+175-i*12,46-i*6,8,0,0,TAU);X.fill()}X.lineWidth=14;X.strokeStyle=c;X.beginPath();X.moveTo(px+590,py+300);X.lineTo(px+500,py+330);X.stroke();X.beginPath();X.arc(px+488,py+330,16,0,TAU);X.lineWidth=6;X.stroke()},base,dark,light);
  X.fillStyle='rgba(122,74,34,.8)';const r=rng(3);for(let row=0;row<9;row++){let x=px+720;const y=py+70+row*48;while(x<px+pw-30){X.save();X.translate(x,y);X.rotate(r()<.6?0:Math.PI/2);X.beginPath();X.moveTo(-7,-6);X.lineTo(7,-6);X.lineTo(0,10);X.fill();X.restore();x+=14+r()*10}}
  X.restore();labelBoxB(W*.8,H*.3,'ANUBANİNİ','Lullubi kralı','SARPOL-E ZAHAB KABARTMASI',ss(.4,.8,lt),'#ffb23a',clamp((lt-.4)/.5));
  if(p.quote){const a=A(p.quote[0],.5);if(a>0){X.save();X.globalAlpha=a;parchment(W*.6,H*.52,700,220,a);X.textAlign='center';X.font='italic 600 48px Corm';X.fillStyle='#4a2a10';X.fillText(p.quote[1],W*.6+350,H*.52+105);X.font='600 26px Inter';X.fillStyle='#8a5a20';X.fillText(p.quote[2],W*.6+350,H*.52+160);X.restore()}}}
function tabletShape(x,y,w,h,rot,lt,seed=5,hl){X.save();X.translate(x,y);X.rotate(rot);X.shadowColor='rgba(60,30,10,.45)';X.shadowBlur=40;X.shadowOffsetY=20;const g=X.createLinearGradient(-w/2,-h/2,w/2,h/2);g.addColorStop(0,'#e0b57e');g.addColorStop(.5,'#cf9a5e');g.addColorStop(1,'#a8723c');
  X.fillStyle=g;X.beginPath();X.roundRect(-w/2,-h/2,w,h,40);X.fill();X.shadowBlur=0;X.shadowOffsetY=0;X.save();X.clip();X.globalAlpha=.3;X.globalCompositeOperation='multiply';X.drawImage(SMOKE,-w/2,-h/2,w,h);X.restore();
  X.fillStyle='rgba(90,50,20,.75)';const r=rng(seed);const rows=Math.floor((h-80)/36);for(let row=0;row<rows;row++){let xx=-w/2+40;const yy=-h/2+50+row*36;X.fillRect(-w/2+30,yy+16,w-60,1.5);while(xx<w/2-40){X.save();X.translate(xx,yy);X.rotate(r()<.6?0:(r()<.5?Math.PI/2:Math.PI/4));X.beginPath();X.moveTo(-6,-5);X.lineTo(6,-5);X.lineTo(0,9);X.fill();X.restore();xx+=12+r()*12;if(r()<.06)xx+=26}}
  if(hl){const k=hl;X.globalCompositeOperation='lighter';X.fillStyle=`rgba(255,220,120,${.35*k})`;X.fillRect(-w/2+30,-h/2+50+3*36-14,w-60,40)}X.restore()}
function sTablet(T,p){const lt=T-SH.t0;museum(lt,'#fff6e6','#f0cf9c');const z=1+.02*lt;tabletShape(W*.3,H*.5,520*z,700*z,-.06,lt,p.seed||5,p.hl?A(p.hl,.6):0);
  labelBoxB(W*.68,H*.2,p.title,p.sub||'',p.sub2||'',ss(.3,.7,lt),'#ffb23a',clamp((lt-.3)/.5));
  (p.quotes||[]).forEach(([q,txt,end],i)=>{let a=A(q,.5);if(end!=null)a*=1-A(end,.4);if(a<=0)return;X.save();parchment(W*.47,H*.38+i*230,880,190,a);X.globalAlpha=a;X.textAlign='center';X.textBaseline='middle';
    const s=fitTxt('“'+txt+'”','italic 600 {s}px Corm',800,54);X.font=`italic 600 ${s}px Corm`;X.fillStyle='#4a2a10';X.fillText('“'+txt+'”',W*.47+440,H*.38+i*230+95);X.restore()});
  (p.names||[]).forEach(([q,nm],i)=>{const a=A(q,.35);if(a<=0)return;const col=i%2,row=Math.floor(i/2);const x=W*.52+col*420,y=H*.36+row*110;X.save();X.globalAlpha=a;const k=eback(clamp((T-R(q))/.4));X.translate(x+190,y);X.scale(lerp(.6,1,k),lerp(.6,1,k));
    X.fillStyle='rgba(42,20,10,.9)';X.beginPath();X.roundRect(-190,-40,380,80,12);X.fill();X.strokeStyle=goldGrad(X,-40,40);X.lineWidth=3;X.stroke();X.textAlign='center';X.textBaseline='middle';X.font='700 38px Cinzel';X.letterSpacing='3px';X.fillStyle=goldGrad(X,-20,20);X.fillText(nm,0,2);X.restore()});
  (p.badges||[]).forEach(([q,big,small])=>{const a=A(q,.4);if(a<=0)return;X.save();X.globalAlpha=a;X.translate(W*.71,H*.85);X.fillStyle='rgba(170,20,24,.93)';X.beginPath();X.roundRect(-360,-70,720,140,20);X.fill();X.strokeStyle='#ffd27a';X.lineWidth=3;X.stroke();
    X.textAlign='center';X.textBaseline='middle';X.font='900 64px CinzelH';X.fillStyle=goldGrad(X,-50,10);X.fillText(big,0,-14);X.font='800 28px InterB';X.fillStyle='#fff';X.fillText(small,0,40);X.restore()})}
function sCylinder(T,p){const lt=T-SH.t0;museum(lt,'#fff6e6','#f0cf9c');const z=1+.02*lt;X.save();X.translate(W*.36,H*.5);X.scale(z,z);const w=760,h=320;
  X.shadowColor='rgba(60,30,10,.45)';X.shadowBlur=40;X.shadowOffsetY=20;const g=X.createLinearGradient(0,-h/2,0,h/2);g.addColorStop(0,'#c99a62');g.addColorStop(.3,'#ecc690');g.addColorStop(.7,'#c9945a');g.addColorStop(1,'#8a5a2a');X.fillStyle=g;X.beginPath();X.ellipse(0,0,w/2,h/2,0,0,TAU);X.fill();X.shadowBlur=0;X.shadowOffsetY=0;
  X.save();X.beginPath();X.ellipse(0,0,w/2,h/2,0,0,TAU);X.clip();X.fillStyle='rgba(90,50,20,.7)';const r=rng(8);for(let row=0;row<8;row++){let x=-w/2+30;const y=-h/2+30+row*36;while(x<w/2-30){const sc=Math.sqrt(Math.max(0,1-(x/(w/2))**2));X.save();X.translate(x,y);X.scale(sc,1);X.beginPath();X.moveTo(-6,-5);X.lineTo(6,-5);X.lineTo(0,9);X.fill();X.restore();x+=12+r()*12}}
  const hk=A(p.hl,.6);if(hk>0){X.globalCompositeOperation='lighter';X.fillStyle=`rgba(255,220,110,${.45*hk})`;X.fillRect(-120,-h/2+30+3*36-16,260,42)}X.restore();X.restore();
  labelBoxB(W*.73,H*.22,'KİROS SİLİNDİRİ','MÖ 539 · Babil','BRITISH MUSEUM',ss(.3,.7,lt),'#ffb23a',clamp((lt-.3)/.5));
  (p.quotes||[]).forEach(([q,txt],i)=>{const a=A(q,.5);if(a<=0)return;parchment(W*.53,H*.42+i*210,820,170,a);X.save();X.globalAlpha=a;X.textAlign='center';X.textBaseline='middle';const s=fitTxt(txt,'italic 600 {s}px Corm',740,50);X.font=`italic 600 ${s}px Corm`;X.fillStyle='#4a2a10';X.fillText(txt,W*.53+410,H*.42+i*210+85);X.restore()})}
function sLion(T,p){const lt=T-SH.t0;museum(lt,'#f6fbff','#bfd8ee');const z=1+.02*lt;X.save();X.translate(W*.32,H*.5);X.scale(z,z);
  const bz=(r)=>{const g=X.createRadialGradient(-r*.3,-r*.4,r*.1,0,0,r*1.1);g.addColorStop(0,'#ffd890');g.addColorStop(.5,'#c8843a');g.addColorStop(1,'#6a3a14');return g};
  // tablet
  X.fillStyle='#bdb6aa';X.beginPath();X.roundRect(-260,120,520,250,16);X.fill();X.strokeStyle='#8a8276';X.lineWidth=4;X.stroke();X.fillStyle='rgba(80,70,60,.65)';const r=rng(4);
  for(let row=0;row<5;row++){let x=-230;while(x<230){X.save();X.translate(x,160+row*42);X.rotate(r()<.6?0:Math.PI/2);X.beginPath();X.moveTo(-7,-6);X.lineTo(7,-6);X.lineTo(0,10);X.fill();X.restore();x+=15+r()*10}}
  // paws
  [-90,90].forEach(px=>{X.fillStyle=bz(80);X.beginPath();X.roundRect(px-42,0,84,150,30);X.fill();X.strokeStyle='#5a2e10';X.lineWidth=4;X.stroke();for(let k=-1;k<=1;k++){X.beginPath();X.moveTo(px+k*20,130);X.lineTo(px+k*20,152);X.stroke()}});
  // mane
  X.fillStyle=bz(190);X.beginPath();for(let i=0;i<=40;i++){const a=i/40*TAU,rr=i%2?150:195;X.lineTo(Math.cos(a)*rr,-80+Math.sin(a)*rr*.95)}X.closePath();X.fill();X.strokeStyle='#5a2e10';X.lineWidth=5;X.stroke();
  // ears
  [-1,1].forEach(s=>{X.fillStyle='#b8742e';X.beginPath();X.arc(s*75,-160,30,0,TAU);X.fill();X.stroke()});
  // face
  X.fillStyle=bz(110);X.beginPath();X.ellipse(0,-70,100,110,0,0,TAU);X.fill();X.stroke();
  X.fillStyle='#e8b070';X.beginPath();X.ellipse(0,-20,58,48,0,0,TAU);X.fill();
  X.fillStyle='#2a1206';[-1,1].forEach(s=>{X.beginPath();X.ellipse(s*40,-95,16,10,s*.2,0,TAU);X.fill();X.fillStyle='#fff6c0';X.beginPath();X.arc(s*40+4,-97,4,0,TAU);X.fill();X.fillStyle='#2a1206'});
  X.beginPath();X.moveTo(-20,-48);X.lineTo(20,-48);X.lineTo(0,-28);X.closePath();X.fill();X.lineWidth=5;X.strokeStyle='#2a1206';X.beginPath();X.moveTo(0,-28);X.lineTo(0,-10);X.moveTo(-28,0);X.quadraticCurveTo(0,-8,28,0);X.stroke();
  X.strokeStyle='rgba(255,240,200,.55)';X.lineWidth=6;X.beginPath();X.arc(0,-80,175,-2.6,-1.6);X.stroke();X.restore();
  labelBoxB(W*.72,H*.24,'TİŞ-ATAL ASLANI','Urkeş · MÖ ~2100','EN ESKİ HURRİCE METİN',ss(.3,.7,lt),'#5fb0ff',clamp((lt-.3)/.5));
  (p.notes||[]).forEach(([q,t1,s1],i)=>{const a=A(q,.4);labelBoxB(W*.72,H*.5+i*150,t1,s1,'',a,'#ffb23a',clamp((T-R(q))/.5),.85)})}
function emblem(x,y,kind,a){X.save();X.globalAlpha=a;X.translate(x,y);X.fillStyle='#fff6dc';X.beginPath();X.arc(0,0,130,0,TAU);X.fill();X.strokeStyle='#c8962e';X.lineWidth=6;X.stroke();
  if(kind==='mit'){X.fillStyle='#2f7fe0';X.beginPath();X.arc(0,0,34,0,TAU);X.fill();X.fillStyle='#e0a52a';[1,-1].forEach(s=>{X.beginPath();X.moveTo(s*30,-6);X.quadraticCurveTo(s*80,-40,s*110,-10);X.quadraticCurveTo(s*80,0,s*110,14);X.quadraticCurveTo(s*70,20,s*30,8);X.fill()})}
  else{X.strokeStyle='#e0a52a';X.lineWidth=18;X.beginPath();X.ellipse(0,-35,26,34,0,0,TAU);X.stroke();X.beginPath();X.moveTo(0,0);X.lineTo(0,80);X.moveTo(-45,15);X.lineTo(45,15);X.stroke()}X.restore()}
function sAmarna(T,p){const lt=T-SH.t0;brightBG(lt,'#fff3c8','#ffc07a','#5aa0e0');tabletShape(W/2,H*.52,330,440,.04,lt,9);
  emblem(W*.2,H*.45,'mit',ss(.2,.6,lt));emblem(W*.8,H*.45,'egy',ss(.4,.8,lt));
  labelBoxB(W*.2,H*.75,'TUŞRATTA','Mitanni kralı','',ss(.4,.8,lt),'#5fb0ff',clamp((lt-.4)/.5));labelBoxB(W*.8,H*.75,'AMENHOTEP III','Mısır firavunu','',ss(.6,1,lt),'#7ad06a',clamp((lt-.6)/.5));
  labelBoxB(W/2,H*.13,'AMARNA MEKTUPLARI','MÖ 14. yüzyıl','',ss(.2,.6,lt),'#ffb23a',clamp((lt-.2)/.5));
  const f=(lt*.6)%1;X.save();X.globalAlpha=ss(1,1.4,lt);X.strokeStyle='#fff';X.lineWidth=6;X.setLineDash([18,14]);X.lineDashOffset=-lt*60;X.beginPath();X.moveTo(W*.28,H*.45);X.lineTo(W*.38,H*.45);X.moveTo(W*.62,H*.45);X.lineTo(W*.72,H*.45);X.stroke();X.restore()}
function sChariots(T,p){const lt=T-SH.t0;landscape(lt,lt*80,p.warm||0);dust(lt,760,.35);const pal=PAL[p.pal||'hurri'];
  [[-500,880,230],[-120,960,280],[-820,1000,300]].forEach(([ox,y,s],i)=>{const x=(((ox+700+lt*330+i*40)%(W+1000))+W+1000)%(W+1000)-600;chariot(X,x,y,s,1,lt*9+i,pal)});dust(lt,860,.3);
  labelBoxB(W*.7,H*.2,p.title,p.sub||'',p.sub2||'',ss(.4,.8,lt),'#5fb0ff',clamp((lt-.4)/.5))}
function sZiggurat(T,p){const lt=T-SH.t0;skyDay(lt,.1);const gg=X.createLinearGradient(0,700,0,H);gg.addColorStop(0,'#e8c27a');gg.addColorStop(1,'#c9944a');X.fillStyle=gg;X.fillRect(0,720,W,H);
  const z=1+.03*lt;X.save();X.translate(W*.42,760);X.scale(z,z);const tiers=[[760,150],[560,130],[380,110],[220,90]];let y=0;
  tiers.forEach(([w,h],i)=>{const g=X.createLinearGradient(-w/2,0,w/2,0);g.addColorStop(0,'#c98a4a');g.addColorStop(.5,'#e8b06a');g.addColorStop(1,'#a8683a');X.fillStyle=g;X.fillRect(-w/2,y-h,w,h);X.strokeStyle='rgba(90,50,20,.5)';X.lineWidth=2;
    for(let k=1;k<h/16;k++){X.beginPath();X.moveTo(-w/2,y-k*16);X.lineTo(w/2,y-k*16);X.stroke()}y-=h});
  X.fillStyle='#b8783a';X.beginPath();X.moveTo(-40,0);X.lineTo(40,0);X.lineTo(20,-430);X.lineTo(-20,-430);X.fill();X.restore();
  [[150,760],[1500,780],[1700,770]].forEach(([x,y])=>{X.strokeStyle='#7a4a22';X.lineWidth=14;X.beginPath();X.moveTo(x,y);X.quadraticCurveTo(x+20,y-120,x+10,y-230);X.stroke();X.fillStyle='#3f9a3a';for(let i=0;i<7;i++){X.save();X.translate(x+10,y-230);X.rotate(i*.9);X.beginPath();X.ellipse(50,0,60,14,0,0,TAU);X.fill();X.restore()}});
  labelBoxB(W*.78,H*.25,'DUR-KURİGALZU','Kassit başkenti','ZİGGURAT · BAĞDAT YAKINI',ss(.4,.8,lt),'#ffb23a',clamp((lt-.4)/.5))}
function sEkbatana(T,p){const lt=T-SH.t0;skyDay(lt,0);const gg=X.createLinearGradient(0,600,0,H);gg.addColorStop(0,'#8fbf5a');gg.addColorStop(1,'#5f8f3a');X.fillStyle=gg;X.fillRect(0,640,W,H);X.drawImage(DAY[1],-300,40);
  const cols=['#ffffff','#1a1a1a','#8a3fd0','#2f6fe0','#ff8a1a','#d8dde4','#ffcf2a'];const k=eout(clamp(lt/1.5));const z=1+.05*lt;
  X.save();X.translate(W*.44,760);X.scale(z,z);for(let i=0;i<7;i++){const a=A(p.cue?p.cue[i]:0,.4)||ss(.2+i*.25,.6+i*.25,lt);if(a<=0)continue;const rx=620-i*78,ry=rx*.36,hh=40+i*6,yy=-i*44;
    X.save();X.globalAlpha=a;X.fillStyle=cols[i];X.beginPath();X.ellipse(0,yy,rx,ry,0,0,Math.PI);X.lineTo(-rx,yy-hh);X.ellipse(0,yy-hh,rx,ry,0,Math.PI,0,true);X.closePath();X.fill();
    X.fillStyle='rgba(0,0,0,.18)';X.beginPath();X.ellipse(0,yy,rx,ry,0,0,Math.PI);X.lineTo(-rx,yy-hh*.4);X.ellipse(0,yy-hh*.4,rx,ry,0,Math.PI,0,true);X.fill();
    X.fillStyle=cols[i];for(let m=0;m<40;m++){const t=m/40*Math.PI;const x=-Math.cos(t)*rx,y=yy-hh+Math.sin(t)*ry;X.fillRect(x-6,y-14,12,14)}
    X.beginPath();X.ellipse(0,yy-hh,rx,ry,0,0,TAU);X.fillStyle=i<6?'rgba(200,170,110,.9)':'#fff1b0';X.fill();X.strokeStyle='rgba(60,30,10,.4)';X.lineWidth=2;X.stroke();X.restore()}
  const pk=ss(2.2,2.8,lt);if(pk>0){X.save();X.globalAlpha=pk;X.fillStyle='#fff8e0';X.fillRect(-60,-430,120,90);X.fillStyle='#ffcf2a';X.beginPath();X.moveTo(-80,-430);X.lineTo(0,-490);X.lineTo(80,-430);X.fill();X.restore()}X.restore();
  labelBoxB(W*.82,H*.2,'EKBATANA','Med başkenti · Hemedan','HERODOT: YEDİ RENKLİ SUR',ss(.4,.8,lt),'#2fe0a0',clamp((lt-.4)/.5));
  ['BEYAZ','SİYAH','MOR','MAVİ','TURUNCU','GÜMÜŞ','ALTIN'].forEach((n,i)=>{const a=ss(.4+i*.25,.8+i*.25,lt);if(a<=0)return;X.save();X.globalAlpha=a;X.fillStyle=cols[i];X.strokeStyle='#2a1206';X.lineWidth=3;X.beginPath();X.arc(W*.78,H*.42+i*62,20,0,TAU);X.fill();X.stroke();
    X.font='800 32px InterB';X.textBaseline='middle';X.fillStyle='#fff';X.lineWidth=6;X.strokeText(n,W*.78+40,H*.42+i*62);X.fillText(n,W*.78+40,H*.42+i*62);X.restore()})}
function sEclipse(T,p){const lt=T-SH.t0;const ek=ss(R(p.dark)-SH.t0-.5,R(p.dark)-SH.t0+1.5,lt);landscape(lt,lt*30,0);
  X.fillStyle=`rgba(10,10,40,${.7*ek})`;X.fillRect(0,0,W,H);const sx=W*.5,sy=H*.26;
  X.save();X.globalCompositeOperation='lighter';const cg=X.createRadialGradient(sx,sy,80,sx,sy,300+200*ek);cg.addColorStop(0,`rgba(255,250,220,${.6+.4*ek})`);cg.addColorStop(1,'rgba(255,220,150,0)');X.fillStyle=cg;X.fillRect(0,0,W,H);
  if(ek>.3){const rr=rng(9);for(let i=0;i<70;i++){const a=rr()*TAU,L=110+rr()*300*ek;X.strokeStyle=`rgba(255,250,230,${.3+rr()*.5})`;X.lineWidth=1+rr()*3;X.beginPath();X.moveTo(sx+Math.cos(a)*100,sy+Math.sin(a)*100);X.lineTo(sx+Math.cos(a)*L,sy+Math.sin(a)*L);X.stroke()}}X.restore();
  X.fillStyle='#fffbe0';X.beginPath();X.arc(sx,sy,100,0,TAU);X.fill();X.fillStyle='#0a0a14';X.beginPath();X.arc(sx+lerp(220,0,ek),sy+lerp(-40,0,ek),102,0,TAU);X.fill();
  AX.clearRect(0,0,W,H);for(const s of SOLD){if(s.row<2)continue;const h=[0,0,200,260][s.row],gy=[0,0,930,1010][s.row];const base=-120+s.off*620;const x=s.side>0?base+80*lt*(1-ek):W-base-80*lt*(1-ek);const pr=runPose(x,gy,s.side,h,lt*10*(1-ek)+s.ph,.3*(1-ek));
    pr.ua=[1.3,-.5];warriorC(AX,pr,s.side>0?PAL.med:PAL.lidya,{helmet:s.side>0?'cap':'dome',shield:s.side>0?'round':'rect',spear:.15})}
  X.save();X.filter=`brightness(${1-.55*ek})`;X.drawImage(ARMY,0,0);X.restore();
  labelBoxB(330,H*.5,'MEDLER','Kral Kyaksares','',ss(.3,.7,lt),'#2fe0a0',clamp((lt-.3)/.5));labelBoxB(W-330,H*.5,'LİDYA','Kral Alyattes','',ss(.3,.7,lt),'#c98aff',clamp((lt-.3)/.5));
  const tk=A(p.dark,.6);if(tk>0){X.save();X.globalAlpha=tk;X.translate(W/2,H*.62);goldHeadB('GÜNEŞ KARARDI!',0,0,120);X.font='700 44px Cinzel';X.letterSpacing='8px';X.textAlign='center';X.fillStyle='#fff';X.fillText('MÖ 585 · KIZILIRMAK',0,70);X.restore()}}
function sNineveh(T,p){const lt=T-SH.t0;landscape(lt,0,.55);const fire=ss(.5,2,lt);
  const wy=700;X.fillStyle='#c9a06a';X.fillRect(0,wy,W,170);for(let x=0;x<W;x+=220){X.fillStyle='#b8905a';X.fillRect(x,wy-90,110,260);for(let m=0;m<4;m++)X.fillRect(x+m*30,wy-110,18,22)}for(let x=0;x<W;x+=40)X.fillRect(x,wy-18,22,20);
  X.save();X.globalCompositeOperation='lighter';for(let i=0;i<30;i++){const x=hash(i)*W,h=120+hash(i+3)*260*fire;const fl=X.createLinearGradient(0,wy-h,0,wy+40);fl.addColorStop(0,'rgba(255,240,120,0)');fl.addColorStop(.5,`rgba(255,140,40,${.6*fire})`);fl.addColorStop(1,`rgba(255,60,20,${.8*fire})`);
    X.fillStyle=fl;X.beginPath();X.moveTo(x-40,wy+40);X.quadraticCurveTo(x+Math.sin(lt*6+i)*30,wy-h,x+40,wy+40);X.fill()}X.restore();
  X.save();X.globalAlpha=.6*fire;X.globalCompositeOperation='multiply';X.drawImage(SMOKE,-200+lt*40,0,2600,800);X.restore();
  AX.clearRect(0,0,W,H);for(const s of SOLD){if(s.row<2||s.side<0)continue;const h=[0,0,220,280][s.row],gy=[0,0,960,1040][s.row];const x=-200+s.off*1400+lt*120;const pr=runPose(x,gy,1,h,lt*9+s.ph,.3);pr.ua=[2.6,.5];warriorC(AX,pr,PAL.med,{helmet:'cap',shield:'round',sword:'sickle'})}
  X.drawImage(ARMY,0,0);const ta=ss(.8,1.3,lt);if(ta>0){X.save();X.globalAlpha=ta;X.translate(W/2,H*.2);goldHeadB('NİNOVA DÜŞTÜ',0,0,120);X.font='700 44px Cinzel';X.letterSpacing='8px';X.textAlign='center';X.fillStyle='#fff';X.lineWidth=6;X.strokeStyle='#2a1206';X.strokeText('MÖ 612 · MEDLER VE BABİL',0,70);X.fillText('MÖ 612 · MEDLER VE BABİL',0,70);X.restore()}}
function sVan(T,p){const lt=T-SH.t0;skyDay(lt,0);const z=1+.03*lt;X.save();X.translate(W/2,H/2);X.scale(z,z);X.translate(-W/2,-H/2);X.drawImage(DAY[0],-200,60);
  const lg=X.createLinearGradient(0,620,0,H);lg.addColorStop(0,'#3fa8e0');lg.addColorStop(1,'#1f6fb0');X.fillStyle=lg;X.fillRect(0,640,W,H);X.save();X.globalAlpha=.25;X.globalCompositeOperation='screen';X.drawImage(SMOKE,-lt*30,700,2600,300);X.restore();
  X.fillStyle='#b8905a';X.beginPath();X.moveTo(300,700);X.quadraticCurveTo(500,520,800,510);X.lineTo(1300,500);X.quadraticCurveTo(1500,530,1650,700);X.closePath();X.fill();X.fillStyle='#9a7040';X.fillRect(300,690,1350,30);
  X.fillStyle='#d8b07a';for(let x=560;x<1420;x+=90){X.fillRect(x,440,60,80);for(let m=0;m<3;m++)X.fillRect(x+m*22,424,14,18)}X.fillRect(560,480,860,40);X.restore();
  labelBoxB(W*.5,H*.16,'TUŞPA','Urartu başkenti','BUGÜN VAN KALESİ',ss(.4,.8,lt),'#2fd0d0',clamp((lt-.4)/.5))}
function sGudea(T,p){const lt=T-SH.t0;museum(lt,'#f4fbff','#c8dcea');const z=1+.02*lt;X.save();X.translate(W*.36,H*.56);X.scale(z,z);const g=X.createLinearGradient(-150,0,150,0);g.addColorStop(0,'#1d2a28');g.addColorStop(.45,'#3e5450');g.addColorStop(1,'#141c1a');X.fillStyle=g;
  X.beginPath();X.roundRect(-160,40,320,300,20);X.fill();X.beginPath();X.moveTo(-130,60);X.quadraticCurveTo(-150,-160,0,-170);X.quadraticCurveTo(150,-160,130,60);X.fill();X.beginPath();X.arc(0,-230,80,0,TAU);X.fill();
  X.beginPath();X.ellipse(0,-280,95,40,0,Math.PI,0);X.fill();X.fillStyle='#4e6a64';X.beginPath();X.ellipse(0,-60,70,40,0,0,TAU);X.fill();X.strokeStyle='rgba(255,255,255,.35)';X.lineWidth=6;X.beginPath();X.arc(0,-230,70,-2.4,-1.4);X.stroke();X.restore();
  labelBoxB(W*.72,H*.3,'GUDEA','Lagaş prensi · Guti dönemi','LOUVRE MÜZESİ',ss(.4,.8,lt),'#5fd0b0',clamp((lt-.4)/.5))}
function sQuote(T,p){const lt=T-SH.t0;brightBG(lt,...(p.colors||['#fff3d0','#ffb46a','#e05a6a']));sparkles(lt,40);parchment(W*.12,H*.24,W*.76,H*.5,ss(0,.4,lt));
  X.save();X.globalAlpha=ss(.2,.6,lt);X.textAlign='center';X.textBaseline='middle';const lines=p.text.split('\n');const s=Math.min(...lines.map(l=>fitTxt(l,'italic 600 {s}px Corm',W*.66,p.size||76)));X.font=`italic 600 ${s}px Corm`;X.fillStyle='#4a2a10';
  lines.forEach((l,i)=>X.fillText(l,W/2,H*.47+(i-(lines.length-1)/2)*s*1.15));X.font='700 30px Cinzel';X.letterSpacing='5px';X.fillStyle='#a0681a';X.fillText(p.src||'',W/2,H*.68);X.restore();
  if(p.title)labelBoxB(W/2,H*.16,p.title,'','',ss(.1,.5,lt),'#ffb23a',clamp(lt/.5))}
function sCompare(T,p){const lt=T-SH.t0;brightBG(lt,'#e8f8ff','#7ac8ff','#3f6fe0');[[W*.27,p.left,0],[W*.73,p.right,1]].forEach(([x,col,i])=>{parchment(x-380,H*.2,760,H*.66,ss(i*.3,i*.3+.4,lt));
  X.save();X.globalAlpha=ss(i*.3,i*.3+.4,lt);X.textAlign='center';X.font='900 56px CinzelH';X.fillStyle=i?'#1f7a5a':'#b8261e';X.fillText(col[0],x,H*.3);
  col.slice(1).forEach((it,k)=>{const a=p.cues?A(p.cues[k],.4):ss(.6+k*.4,1+k*.4,lt);X.globalAlpha=a;X.font='800 40px InterB';X.fillStyle='#3a2410';X.fillText('• '+it,x,H*.42+k*90)});X.restore()});
  const a=A(p.link||0,.5);if(a>0){X.save();X.globalAlpha=a;X.strokeStyle='#ffd23a';X.lineWidth=12;X.beginPath();X.moveTo(W*.47,H*.55);X.lineTo(W*.53,H*.55);X.stroke();X.fillStyle='#ffd23a';X.beginPath();X.arc(W/2,H*.55,30,0,TAU);X.fill();X.restore()}}
function pcard(x,y,w,h,au,a,k){if(a<=0)return;X.save();X.translate(x,y);const s=lerp(.7,1,eback(clamp(k)));X.scale(s,s);parchment(-w/2,-h/2,w,h,a);X.globalAlpha=a;X.textAlign='center';X.textBaseline='middle';
  X.fillStyle='#c8962e';X.beginPath();X.arc(0,-h/2+90,48,0,TAU);X.fill();X.fillStyle='#fff6dc';X.font='900 46px CinzelH';X.fillText(au[0].replace(/^[A-Z]\. ?/,'')[0],0,-h/2+92);
  let fs=fitTxt(au[0],'900 {s}px CinzelH',w-80,46);X.font=`900 ${fs}px CinzelH`;X.fillStyle='#7a2a10';X.fillText(au[0],0,-h/2+180);
  fs=fitTxt(au[1],'italic 600 {s}px Corm',w-80,42);X.font=`italic 600 ${fs}px Corm`;X.fillStyle='#3a2410';X.fillText(au[1],0,-h/2+250);
  X.font='700 26px Inter';X.letterSpacing='3px';X.fillStyle='#a0681a';X.fillText(au[2],0,-h/2+305);X.letterSpacing='0px';
  if(au[3]){const lines=au[3].split('\n');X.font='600 32px Inter';X.fillStyle='#3a2410';lines.forEach((l,i)=>X.fillText(l,0,-h/2+370+i*42))}X.restore()}
function sAuthors(T,p){const lt=T-SH.t0;brightBG(lt,...(p.colors||['#fff6d8','#ffcf7a','#ff8a5a']));sparkles(lt,40);const n=p.list.length;
  p.list.forEach((au,i)=>{const q=au[4]!=null?au[4]:null;const t0=q==null?SH.t0+i*.4:R(q);const a=ss(t0,t0+.4,T);const w=n===1?820:(n===2?720:560),h=520;const x=n===1?W/2:W/2+(i-(n-1)/2)*(w+50);pcard(x,H*.52,w,h,au,a,(T-t0)/.5)});
  if(p.title)labelBoxB(W/2,H*.12,p.title,'','',ss(.1,.5,lt),'#ffb23a',clamp(lt/.5))}
function sEtym(T,p){const lt=T-SH.t0;brightBG(lt,'#fff6d0','#ffb35a','#c84a8a');sparkles(lt,50);const n=p.chain.length;const gap=W/(n+.3);
  p.chain.forEach(([word,src,q],i)=>{const t0=q==null?SH.t0+i*.6:R(q);const a=ss(t0,t0+.4,T);if(a<=0)return;const x=gap*(i+.65),y=H*.45+(i%2?60:-60);X.save();X.globalAlpha=a;const k=eback(clamp((T-t0)/.5));X.translate(x,y);X.scale(lerp(.5,1,k),lerp(.5,1,k));
    X.fillStyle='rgba(42,20,10,.92)';X.beginPath();X.roundRect(-150,-70,300,140,16);X.fill();X.strokeStyle=goldGrad(X,-70,70);X.lineWidth=4;X.stroke();X.textAlign='center';X.textBaseline='middle';
    const fs=fitTxt(word,'900 {s}px CinzelH',260,52);X.font=`900 ${fs}px CinzelH`;X.fillStyle=i===n-1?'#ffd23a':goldGrad(X,-30,20);X.fillText(word,0,-12);X.font='600 24px Inter';X.fillStyle='#f6e6c6';X.fillText(src,0,40);X.restore();
    if(i>0){const px=gap*(i-.35),py=H*.45+((i-1)%2?60:-60);X.save();X.globalAlpha=a;X.strokeStyle='#fff';X.lineWidth=8;X.setLineDash([14,10]);X.beginPath();X.moveTo(px+20,py);X.lineTo(x-170,y);X.stroke();X.restore()}});
  labelBoxB(W/2,H*.12,'İSİM ZİNCİRİ','Guti\'den Kürt\'e','',ss(.1,.5,lt),'#ffb23a',clamp(lt/.5))}
const LIN=[['sub','SUBARLAR','#3fa7e0'],['lul','LULLUBİLER','#ff8a2a'],['gut','GUTİLER','#e3322b'],['hur','HURRİLER','#2f7fe0'],['mit','MİTANNİ','#4f6fe8'],['kas','KASSİTLER','#e0b13a'],['med','MEDLER','#1fa37a']];
function sLineage(T,p){const lt=T-SH.t0;brightBG(lt,'#e8fbff','#8fd6ff','#ffd27a');sparkles(lt,60);const n=LIN.length;const cx=W/2,cy=H*.8;
  LIN.forEach(([k,name,col],i)=>{const q=p.cues&&p.cues[k]!=null?p.cues[k]:null;const t0=q==null?SH.t0+.3+i*.25:R(q);const a=ss(t0,t0+.4,T);if(a<=0)return;const x=W*(.1+i*.8/(n-1)),y=H*.24+(i%2?70:0);const hl=p.hl&&p.hl.includes(k);
    const lk=ss(t0+.3,t0+1.1,T);X.save();X.globalAlpha=a*(p.hl&&!hl?.45:1);X.strokeStyle=col;X.lineWidth=hl?12:7;X.lineCap='round';X.beginPath();X.moveTo(x,y+50);const ex=lerp(x,cx,lk),ey=lerp(y+50,cy-70,lk);X.quadraticCurveTo(x,(y+cy)/2,ex,ey);X.stroke();X.restore();
    X.save();X.globalAlpha=a*(p.hl&&!hl?.55:1);const s=hl?1.15:1;X.translate(x,y);X.scale(s,s);X.fillStyle=col;X.shadowColor='rgba(0,0,0,.3)';X.shadowBlur=14;X.beginPath();X.roundRect(-115,-40,230,80,40);X.fill();X.shadowBlur=0;X.strokeStyle='#fff';X.lineWidth=4;X.stroke();
    X.textAlign='center';X.textBaseline='middle';const fs=fitTxt(name,'900 {s}px CinzelH',200,34);X.font=`900 ${fs}px CinzelH`;X.fillStyle='#fff';X.fillText(name,0,2);X.restore()});
  const kq=p.cues&&p.cues.kurd!=null?R(p.cues.kurd):SH.t0+2.2;const ka=ss(kq,kq+.5,T);if(ka>0){X.save();X.globalAlpha=ka;X.translate(cx,cy);const k=eback(clamp((T-kq)/.6));X.scale(lerp(.5,1,k),lerp(.5,1,k));
    X.fillStyle='rgba(42,20,10,.92)';X.beginPath();X.roundRect(-330,-80,660,160,24);X.fill();X.strokeStyle=goldGrad(X,-80,80);X.lineWidth=5;X.stroke();goldHeadB('KÜRTLER',0,34,104);X.restore()}}
function sTimeline(T,p){const lt=T-SH.t0;brightBG(lt,'#f0fbff','#a8e0ff','#ffe2a0');const y0=H*.24,x0=180,x1=W-120,yr0=-2500,yr1=-500;const xp=y=>lerp(x0,x1,(y-yr0)/(yr1-yr0));
  X.save();X.globalAlpha=ss(0,.4,lt);X.strokeStyle='#2a1206';X.lineWidth=4;X.beginPath();X.moveTo(x0,H*.86);X.lineTo(x1,H*.86);X.stroke();X.font='700 26px Cinzel';X.textAlign='center';X.fillStyle='#2a1206';
  for(let y=-2500;y<=-500;y+=250){X.beginPath();X.moveTo(xp(y),H*.86);X.lineTo(xp(y),H*.86+14);X.stroke();X.fillText('MÖ '+(-y),xp(y),H*.86+48)}X.restore();
  p.bars.forEach(([name,a0,a1,col,q],i)=>{const t0=q!=null?R(q):SH.t0+.4+i*.35;const k=eout(clamp((T-t0)/.8));if(k<=0)return;const y=y0+i*76;X.save();X.globalAlpha=ss(t0,t0+.3,T);X.fillStyle=col;X.shadowColor='rgba(0,0,0,.25)';X.shadowBlur=10;
    X.beginPath();X.roundRect(xp(a0),y,(xp(a1)-xp(a0))*k,56,28);X.fill();X.shadowBlur=0;X.font='900 30px CinzelH';X.textBaseline='middle';X.fillStyle='#fff';X.lineWidth=5;X.strokeStyle='rgba(40,20,5,.6)';X.textAlign='left';X.strokeText(name,xp(a0)+20,y+30);X.fillText(name,xp(a0)+20,y+30);X.restore()});
  if(p.title)labelBoxB(W/2,H*.1,p.title,'','',ss(.1,.5,lt),'#ffb23a',clamp(lt/.5))}
function sScenicText(T,p){const lt=T-SH.t0;landscape(lt,lt*25,p.warm||0);sparkles(lt,40);
  (p.lines||[]).forEach(([q,txt,size,y,font],i)=>{const t0=q==null?SH.t0+.3+i*.5:R(q);const a=ss(t0,t0+.5,T);if(a<=0)return;X.save();X.globalAlpha=a;X.translate(W/2,(y||.4)*H);const k=eout(clamp((T-t0)/.6));X.scale(lerp(1.15,1,k),lerp(1.15,1,k));
    if(font==='corm'){X.font=`italic 600 ${size||64}px Corm`;X.textAlign='center';X.lineJoin='round';X.lineWidth=8;X.strokeStyle='rgba(40,20,5,.7)';X.strokeText(txt,0,0);X.fillStyle='#fff';X.fillText(txt,0,0)}else goldHeadB(txt,0,0,fitTxt(txt,'900 {s}px CinzelH',1700,size||110));X.restore()})}
function sCredits(T,p){const lt=T-SH.t0;brightBG(lt,'#fff4dc','#ffd08a','#ff9a6a');const lines=window.CREDITS;const sp=lt*62;X.save();X.beginPath();X.rect(0,0,W,H);X.clip();
  parchment(W*.14,-40,W*.72,H+80,1);let y=H-sp+40;X.textAlign='center';lines.forEach(l=>{if(l.startsWith('#')){y+=30;if(y>-60&&y<H+60){X.font='900 54px CinzelH';X.fillStyle='#7a2a10';X.fillText(l.slice(1).trim(),W/2,y)}y+=80}
    else if(l.startsWith('##')){}else{if(y>-60&&y<H+60){const s=fitTxt(l,'600 {s}px Inter',W*.62,30);X.font=`600 ${s}px Inter`;X.fillStyle='#3a2410';X.fillText(l,W/2,y)}y+=50}});X.restore();
  labelBoxB(W/2,100,'KAYNAKLAR','','',ss(0,.5,lt)*(1-ss(4,5,lt)),'#ffb23a',clamp(lt/.5))}
