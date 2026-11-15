// ================= DÎROK FILM ENGINE — core (1920x1080, bright style) =================
const RIMG=new Image();RIMG.src=window.RELIEF_SRC||'relief_bright.jpg';
// ---------- palettes for colored warriors
const PAL={
 guti:{skin:'#c98d5f',tunic:'#d2322a',kilt:'#8e1f1a',helmet:'#b8803c',plume:'#ffcf3a',shield:'#e2a83f',rim:'#7a4a12',cloak:'#f0682a',metal:'#e8e2d4',beard:'#3a2414',boot:'#4a2a16'},
 akad:{skin:'#c08458',tunic:'#efe2bd',kilt:'#d2b066',helmet:'#d8b04c',plume:'#ffffff',shield:'#3d6fb5',rim:'#1d3d6e',cloak:'#2f5aa0',metal:'#e8e2d4',beard:'#2a1a10',boot:'#5a3a1e'},
 sumer:{skin:'#c58a5c',tunic:'#f4ecd6',kilt:'#5f9fd0',helmet:'#c9a24a',plume:'#5f9fd0',shield:'#2d8a6a',rim:'#11503a',cloak:'#2d8a6a',metal:'#e8e2d4',beard:'#2a1a10',boot:'#5a3a1e'},
 lullu:{skin:'#c98d5f',tunic:'#ef8a1f',kilt:'#9a4d10',helmet:'#a8763a',plume:'#ffe08a',shield:'#c6542a',rim:'#5a2108',cloak:'#ffb33a',metal:'#e8e2d4',beard:'#3a2414',boot:'#4a2a16'},
 hurri:{skin:'#c98d5f',tunic:'#2f7fd6',kilt:'#1d4f8f',helmet:'#c9a24a',plume:'#ffffff',shield:'#e8c547',rim:'#7a5a12',cloak:'#5fb0ff',metal:'#e8e2d4',beard:'#2a1a10',boot:'#3a2414'},
 med:{skin:'#c98d5f',tunic:'#1f9a72',kilt:'#0f5a42',helmet:'#e8d6a0',plume:'#ffd23a',shield:'#c8b06a',rim:'#5a4a1a',cloak:'#7a3fb0',metal:'#e8e2d4',beard:'#2a1a10',boot:'#3a2414'},
 lidya:{skin:'#c58a5c',tunic:'#7b3fa0',kilt:'#4a2266',helmet:'#d8b04c',plume:'#e8c547',shield:'#e8c547',rim:'#6a4a10',cloak:'#b36ad8',metal:'#e8e2d4',beard:'#2a1a10',boot:'#3a2414'},
 asur:{skin:'#c08458',tunic:'#2a4f9f',kilt:'#16306a',helmet:'#c0c6ce',plume:'#c62f28',shield:'#b8803c',rim:'#4a2a10',cloak:'#c62f28',metal:'#e8e2d4',beard:'#1a1008',boot:'#3a2414'},
 kassit:{skin:'#c98d5f',tunic:'#e0b13a',kilt:'#8a6410',helmet:'#a8763a',plume:'#d2322a',shield:'#2f9f8f',rim:'#0f4f45',cloak:'#d2322a',metal:'#e8e2d4',beard:'#2a1a10',boot:'#3a2414'}
};
function limbC(o,ang,L,f){return[o[0]+Math.sin(ang)*L*f,o[1]+Math.cos(ang)*L]}
function polyC(ctx,pts,lw,col){ctx.strokeStyle=col;ctx.lineWidth=lw;ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.stroke()}
// colored warrior (same rig as warrior/solve)
function warriorC(ctx,p,pal,opt={}){
  const {f,h}=p;const S=solve(p);const {hip,sh,nk,hd,be,bh,fe,fh,bk,bf,fk,ff}=S;const wv=opt.wind||0;const OL='rgba(40,20,10,.85)';
  ctx.lineCap='round';ctx.lineJoin='round';
  const limbO=(pts,w,c)=>{polyC(ctx,pts,w+.012*h,OL);polyC(ctx,pts,w,c)};
  if(opt.cloak){ctx.fillStyle=pal.cloak;ctx.strokeStyle=OL;ctx.lineWidth=.006*h;ctx.beginPath();ctx.moveTo(sh[0]+f*.03*h,sh[1]-.01*h);
    const tx=hip[0]-f*(.30+.05*Math.sin(wv*2.6))*h,ty=hip[1]+(.14+.03*Math.sin(wv*3.1))*h;
    ctx.bezierCurveTo(sh[0]-f*.16*h,sh[1]+.05*h,tx+f*.05*h,ty-.22*h,tx,ty);for(let k=1;k<=4;k++){ctx.lineTo(tx+f*k*.05*h,ty-(k%2)*.035*h+k*.004*h)}
    ctx.quadraticCurveTo(hip[0]-f*.05*h,hip[1]+.05*h,hip[0],hip[1]-.05*h);ctx.closePath();ctx.fill();ctx.stroke()}
  limbO([hip,bk,bf],.075*h,pal.skin);ctx.fillStyle=pal.boot;ctx.beginPath();ctx.ellipse(bf[0]+f*.035*h,bf[1]+.004*h,.055*h,.022*h,0,0,TAU);ctx.fill();
  limbO([sh,be,bh],.055*h,pal.skin);
  if(opt.spearBack!=null)spearC(ctx,bh,opt.spearBack,f,h,pal);
  // torso
  const tdx=Math.cos(p.torso)*f,tdy=Math.sin(p.torso);const cw=.095*h,ww=.064*h;
  const s1=[sh[0]-tdx*cw,sh[1]-tdy*cw*f],s2=[sh[0]+tdx*cw,sh[1]+tdy*cw*f],w1=[hip[0]-tdx*ww,hip[1]-tdy*ww*f],w2=[hip[0]+tdx*ww,hip[1]+tdy*ww*f];
  ctx.beginPath();ctx.moveTo(s1[0],s1[1]);ctx.quadraticCurveTo(sh[0],sh[1]-.03*h,s2[0],s2[1]);ctx.quadraticCurveTo(lerp(s2[0],w2[0],.5)+tdx*.03*h,lerp(s2[1],w2[1],.5),w2[0],w2[1]);ctx.lineTo(w1[0],w1[1]);
  ctx.quadraticCurveTo(lerp(s1[0],w1[0],.5)-tdx*.01*h,lerp(s1[1],w1[1],.5),s1[0],s1[1]);ctx.fillStyle=pal.tunic;ctx.fill();ctx.strokeStyle=OL;ctx.lineWidth=.008*h;ctx.stroke();
  // belt
  ctx.strokeStyle=pal.helmet;ctx.lineWidth=.02*h;ctx.beginPath();ctx.moveTo(w1[0],w1[1]-.01*h);ctx.lineTo(w2[0],w2[1]-.01*h);ctx.stroke();
  // kilt
  ctx.beginPath();ctx.moveTo(hip[0]-.07*h,hip[1]-.02*h);ctx.lineTo(hip[0]+.07*h,hip[1]-.02*h);const kb=hip[1]+.15*h,kx=hip[0]+f*.02*h,sway=Math.sin(wv*5)*.01*h;
  ctx.lineTo(kx+.10*h+sway,kb);for(let k=0;k<=8;k++){ctx.lineTo(kx+.10*h-k*.025*h+sway,kb+(k%2?.025*h:0))}ctx.closePath();ctx.fillStyle=pal.kilt;ctx.fill();ctx.strokeStyle=OL;ctx.lineWidth=.007*h;ctx.stroke();
  // head
  limbO([sh,nk],.045*h,pal.skin);const r=.058*h;ctx.beginPath();ctx.arc(hd[0],hd[1],r,0,TAU);ctx.fillStyle=pal.skin;ctx.fill();ctx.strokeStyle=OL;ctx.lineWidth=.007*h;ctx.stroke();
  // beard
  ctx.fillStyle=pal.beard;ctx.beginPath();ctx.moveTo(hd[0]+f*r*.95,hd[1]+r*.1);ctx.quadraticCurveTo(hd[0]+f*r*1.2,hd[1]+r*1.3,hd[0]+f*r*.4,hd[1]+r*1.7);ctx.lineTo(hd[0]-f*r*.3,hd[1]+r*.6);ctx.fill();
  // eye
  ctx.fillStyle='#1a0e06';ctx.beginPath();ctx.arc(hd[0]+f*r*.55,hd[1]-r*.15,r*.11,0,TAU);ctx.fill();
  if(opt.helmet==='cone'){ctx.beginPath();ctx.moveTo(hd[0]-r*1.12,hd[1]-r*.15);ctx.quadraticCurveTo(hd[0]-r*.7,hd[1]-r*1.6,hd[0]+f*r*.35,hd[1]-r*2.5);ctx.quadraticCurveTo(hd[0]+r*.8,hd[1]-r*1.5,hd[0]+r*1.12,hd[1]-r*.15);ctx.closePath();
    ctx.fillStyle=pal.helmet;ctx.fill();ctx.strokeStyle=OL;ctx.stroke();
    ctx.fillStyle=pal.plume;ctx.beginPath();ctx.moveTo(hd[0]+f*r*.35,hd[1]-r*2.45);ctx.bezierCurveTo(hd[0]-f*r*1.5,hd[1]-r*(3+.3*Math.sin(wv*4)),hd[0]-f*r*3,hd[1]-r*(2+.5*Math.sin(wv*3.3)),hd[0]-f*r*(4.2+.4*Math.sin(wv*2.7)),hd[1]-r*(.6+.6*Math.sin(wv*3)));
    ctx.bezierCurveTo(hd[0]-f*r*2.6,hd[1]-r*1.2,hd[0]-f*r*1.2,hd[1]-r*1.6,hd[0]+f*r*.1,hd[1]-r*1.9);ctx.fill()}
  if(opt.helmet==='dome'){ctx.beginPath();ctx.ellipse(hd[0],hd[1]-r*.25,r*1.18,r*1.1,0,Math.PI,TAU);ctx.closePath();ctx.fillStyle=pal.helmet;ctx.fill();ctx.strokeStyle=OL;ctx.stroke();
    ctx.beginPath();ctx.moveTo(hd[0]-f*r*1.15,hd[1]-r*.3);ctx.lineTo(hd[0]-f*r*1.35,hd[1]+r*.9);ctx.lineTo(hd[0]-f*r*.3,hd[1]+r*.6);ctx.fill();ctx.fillStyle=pal.plume;ctx.beginPath();ctx.ellipse(hd[0],hd[1]-r*1.35,r*.2,r*.32,0,0,TAU);ctx.fill()}
  if(opt.helmet==='cap'){ctx.fillStyle=pal.helmet;ctx.beginPath();ctx.moveTo(hd[0]-r*1.1,hd[1]-r*.1);ctx.quadraticCurveTo(hd[0]-r*.3,hd[1]-r*2.2,hd[0]+f*r*.9,hd[1]-r*1.6);ctx.quadraticCurveTo(hd[0]+r*.9,hd[1]-r*.8,hd[0]+r*1.1,hd[1]-r*.1);ctx.closePath();ctx.fill();ctx.strokeStyle=OL;ctx.stroke();
    ctx.beginPath();ctx.moveTo(hd[0]-f*r*.9,hd[1]);ctx.lineTo(hd[0]-f*r*1.2,hd[1]+r*1.2);ctx.lineTo(hd[0]-f*r*.2,hd[1]+r*1.0);ctx.fill()}
  limbO([hip,fk,ff],.08*h,pal.skin);ctx.fillStyle=pal.boot;ctx.beginPath();ctx.ellipse(ff[0]+f*.035*h,ff[1]+.004*h,.055*h,.022*h,0,0,TAU);ctx.fill();
  if(opt.shield==='round'){const c=[bh[0]+f*.03*h,bh[1]-.01*h];ctx.beginPath();ctx.ellipse(c[0],c[1],.085*h,.135*h,f*.15,0,TAU);ctx.fillStyle=pal.shield;ctx.fill();ctx.strokeStyle=pal.rim;ctx.lineWidth=.014*h;ctx.stroke();
    ctx.beginPath();ctx.arc(c[0],c[1],.022*h,0,TAU);ctx.fillStyle=pal.rim;ctx.fill();ctx.strokeStyle='rgba(255,255,255,.55)';ctx.lineWidth=.006*h;ctx.beginPath();ctx.ellipse(c[0],c[1],.06*h,.105*h,f*.15,-2.3,-1.2);ctx.stroke()}
  if(opt.shield==='rect'){ctx.save();ctx.translate(bh[0]+f*.035*h,bh[1]);ctx.rotate(f*.08);ctx.beginPath();ctx.roundRect(-.065*h,-.2*h,.13*h,.36*h,.02*h);ctx.fillStyle=pal.shield;ctx.fill();ctx.strokeStyle=pal.rim;ctx.lineWidth=.012*h;ctx.stroke();
    ctx.strokeStyle='rgba(255,255,255,.4)';ctx.lineWidth=.006*h;ctx.beginPath();ctx.moveTo(0,-.17*h);ctx.lineTo(0,.13*h);ctx.stroke();ctx.restore()}
  limbO([sh,fe,fh],.058*h,pal.skin);
  const fa=p.ua[0]+p.ua[1]+(opt.grip||0);
  if(opt.sword){const Lb=(opt.blen||.44)*h;const dx=Math.sin(fa)*f,dy=Math.cos(fa),nx=-dy*f,ny=dx*f;const b0=[fh[0]+dx*.03*h,fh[1]+dy*.03*h],tip=[fh[0]+dx*Lb,fh[1]+dy*Lb];const cv=opt.sword==='sickle'?.075*h:.012*h;
    const mid=[(b0[0]+tip[0])/2+nx*cv,(b0[1]+tip[1])/2+ny*cv];ctx.save();ctx.lineWidth=.02*h;ctx.strokeStyle='#4a2a14';ctx.beginPath();ctx.moveTo(fh[0]-dx*.05*h,fh[1]-dy*.05*h);ctx.lineTo(b0[0],b0[1]);ctx.stroke();
    ctx.strokeStyle=pal.helmet;ctx.lineWidth=.016*h;ctx.beginPath();ctx.moveTo(b0[0]+nx*.035*h,b0[1]+ny*.035*h);ctx.lineTo(b0[0]-nx*.035*h,b0[1]-ny*.035*h);ctx.stroke();
    ctx.beginPath();ctx.moveTo(b0[0]+nx*.016*h,b0[1]+ny*.016*h);ctx.quadraticCurveTo(mid[0]+nx*.018*h,mid[1]+ny*.018*h,tip[0],tip[1]);ctx.quadraticCurveTo(mid[0]-nx*.018*h,mid[1]-ny*.018*h,b0[0]-nx*.016*h,b0[1]-ny*.016*h);ctx.closePath();
    const g=ctx.createLinearGradient(b0[0],b0[1],tip[0],tip[1]);g.addColorStop(0,'#b9a27a');g.addColorStop(.5,'#fff8e8');g.addColorStop(1,'#c9b48c');ctx.fillStyle=g;ctx.fill();ctx.strokeStyle=OL;ctx.lineWidth=.005*h;ctx.stroke();ctx.restore();
    p._b0=b0;p._tip=tip;p._mid=[lerp(b0[0],tip[0],.62)+nx*cv*.7,lerp(b0[1],tip[1],.62)+ny*cv*.7]}
  if(opt.spear!=null)spearC(ctx,fh,opt.spear,f,h,pal);
  if(opt.bow){ctx.save();ctx.strokeStyle='#6a3a14';ctx.lineWidth=.016*h;ctx.beginPath();ctx.arc(fh[0]-f*.05*h,fh[1],.2*h,f>0?-1.1:Math.PI-1.1+2.2-2.2,f>0?1.1:Math.PI+1.1);ctx.stroke();ctx.restore()}
}
function spearC(ctx,hand,a,f,h,pal){const ux=Math.cos(a)*f,uy=-Math.sin(a);ctx.save();ctx.lineCap='round';ctx.strokeStyle='#6a3a14';ctx.lineWidth=.014*h;ctx.beginPath();ctx.moveTo(hand[0]-ux*.45*h,hand[1]-uy*.45*h);
  const tx=hand[0]+ux*.75*h,ty=hand[1]+uy*.75*h;ctx.lineTo(tx,ty);ctx.stroke();ctx.beginPath();ctx.moveTo(tx+ux*.12*h,ty+uy*.12*h);ctx.lineTo(tx-uy*.028*h,ty+ux*.028*h);ctx.lineTo(tx+uy*.028*h,ty-ux*.028*h);ctx.closePath();ctx.fillStyle=pal.metal;ctx.fill();ctx.strokeStyle='rgba(40,20,10,.8)';ctx.lineWidth=.004*h;ctx.stroke();ctx.restore()}
// horse (side view) — x,y = body center, s = body length, f facing, ph gallop phase
function horse(ctx,x,y,s,f,ph,col='#8a4f2a',mane='#2a1608'){ctx.save();ctx.translate(x,y);ctx.scale(f,1);const OL='rgba(30,15,5,.85)';ctx.lineCap='round';ctx.lineJoin='round';
  const leg=(hx,hy,a1,a2,w)=>{const k=[hx+Math.sin(a1)*s*.26,hy+Math.cos(a1)*s*.26],ft=[k[0]+Math.sin(a1+a2)*s*.26,k[1]+Math.cos(a1+a2)*s*.26];
    ctx.strokeStyle=OL;ctx.lineWidth=w+3;ctx.beginPath();ctx.moveTo(hx,hy);ctx.lineTo(k[0],k[1]);ctx.lineTo(ft[0],ft[1]);ctx.stroke();ctx.strokeStyle=col;ctx.lineWidth=w;ctx.stroke();ctx.fillStyle='#1a0e06';ctx.fillRect(ft[0]-w*.6,ft[1]-2,w*1.2,w*.6)};
  const g=Math.sin(ph),g2=Math.sin(ph+1.2);
  leg(-s*.32,s*.05,.5*g2-.1,.6+.4*g,s*.07);leg(s*.3,s*.05,.6*g+.2,-.2-.6*Math.max(0,g),s*.07);
  // tail
  ctx.strokeStyle=mane;ctx.lineWidth=s*.07;ctx.beginPath();ctx.moveTo(-s*.45,-s*.08);ctx.quadraticCurveTo(-s*.7,-s*.05+Math.sin(ph*2)*s*.05,-s*.72,s*.25);ctx.stroke();
  // body
  ctx.beginPath();ctx.ellipse(0,-s*.02,s*.5,s*.19,0,0,TAU);ctx.fillStyle=col;ctx.fill();ctx.strokeStyle=OL;ctx.lineWidth=3;ctx.stroke();
  // neck/head
  ctx.beginPath();ctx.moveTo(s*.3,-s*.12);ctx.quadraticCurveTo(s*.45,-s*.45,s*.6,-s*.5);ctx.lineTo(s*.8,-s*.32);ctx.quadraticCurveTo(s*.82,-s*.26,s*.74,-s*.25);ctx.lineTo(s*.6,-s*.32);ctx.quadraticCurveTo(s*.52,-s*.1,s*.45,s*.02);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.fillStyle=mane;ctx.beginPath();ctx.moveTo(s*.32,-s*.16);ctx.quadraticCurveTo(s*.44,-s*.5,s*.6,-s*.54);ctx.lineTo(s*.56,-s*.44);ctx.quadraticCurveTo(s*.44,-s*.36,s*.38,-s*.12);ctx.fill();
  ctx.fillStyle='#000';ctx.beginPath();ctx.arc(s*.66,-s*.43,s*.018,0,TAU);ctx.fill();
  leg(-s*.36,s*.05,-.5*g2+.1,.6-.3*g,s*.075);leg(s*.32,s*.05,-.6*g+.3,-.2-.6*Math.max(0,-g),s*.075);
  ctx.restore()}
function chariot(ctx,x,y,s,f,ph,pal){horse(ctx,x+f*s*.75,y,s*.95,f,ph,'#9a5a2a');horse(ctx,x+f*s*.9,y+s*.06,s*.95,f,ph+.8,'#6a3a1a');
  ctx.save();ctx.strokeStyle='#5a3214';ctx.lineWidth=s*.04;ctx.beginPath();ctx.moveTo(x,y-s*.05);ctx.lineTo(x+f*s*.5,y-s*.12);ctx.stroke();
  const wx=x-f*s*.05,wy=y+s*.18,wr=s*.27;ctx.beginPath();ctx.arc(wx,wy,wr,0,TAU);ctx.strokeStyle='#3a1e0a';ctx.lineWidth=s*.05;ctx.stroke();
  for(let i=0;i<6;i++){const a=i/6*TAU+ph*f*.8;ctx.lineWidth=s*.02;ctx.beginPath();ctx.moveTo(wx,wy);ctx.lineTo(wx+Math.cos(a)*wr,wy+Math.sin(a)*wr);ctx.stroke()}
  ctx.fillStyle=pal.shield;ctx.strokeStyle='rgba(40,20,10,.85)';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x-f*s*.25,y-s*.3);ctx.lineTo(x+f*s*.2,y-s*.3);ctx.lineTo(x+f*s*.25,y+s*.05);ctx.lineTo(x-f*s*.3,y+s*.05);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();
  const p={x:x-f*s*.02,y:0,f,h:s*1.0,torso:.05,head:0,ua:[1.6,.2],ba:[1.2,.6],fl:[.15,-.1],bl:[-.1,-.05]};p.y=y-s*.62;warriorC(ctx,p,pal,{helmet:'cap',bow:true})}

// ---------- bright landscape layers
function ridgeC(seed,base,amp,rough,c1,c2,w=2800){const c=mk(w,H),g=c.getContext('2d'),n=noise2(seed);g.beginPath();g.moveTo(0,H);
  for(let x=0;x<=w;x+=4){const y=base-amp*(n(x/rough,seed*.37,6)-.3)*1.6;g.lineTo(x,y)}g.lineTo(w,H);g.closePath();const gr=g.createLinearGradient(0,base-amp,0,H);gr.addColorStop(0,c1);gr.addColorStop(1,c2);g.fillStyle=gr;g.fill();
  // snow caps on far ridges
  return c}
const DAY=[ridgeC(11,520,300,520,'#b8cbe6','#9fb4d0'),ridgeC(23,610,260,420,'#8fb07a','#6f9458'),ridgeC(37,700,210,330,'#6f9a4c','#557a38'),ridgeC(51,820,120,260,'#7a8f3a','#5a6a28')];
function skyDay(t,warm=0){const g=X.createLinearGradient(0,0,0,H*.75);g.addColorStop(0,lerpC('#2f86e0','#e86a3a',warm));g.addColorStop(.6,lerpC('#8cc8f5','#ffb36b',warm));g.addColorStop(1,lerpC('#e6f4ff','#ffe0a8',warm));X.fillStyle=g;X.fillRect(0,0,W,H);
  const sx=W*.78,sy=H*.2;const sg=X.createRadialGradient(sx,sy,10,sx,sy,420);sg.addColorStop(0,'rgba(255,255,240,1)');sg.addColorStop(.1,'rgba(255,250,210,.9)');sg.addColorStop(.35,'rgba(255,240,180,.25)');sg.addColorStop(1,'rgba(255,240,180,0)');X.fillStyle=sg;X.fillRect(0,0,W,H);
  X.save();X.globalAlpha=.85;X.globalCompositeOperation='screen';X.drawImage(SMOKE,-300+t*14,20,2800,560);X.globalAlpha=.6;X.drawImage(SMOKE,-900+t*24,-60,3200,520);X.restore()}
function lerpC(a,b,k){const p=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));const x=p(a),y=p(b);return `rgb(${x.map((v,i)=>Math.round(lerp(v,y[i],k))).join(',')})`}
function landscape(t,cam=0,warm=0){skyDay(t,warm);DAY.forEach((r,i)=>{const par=[.08,.2,.4,.75][i];X.drawImage(r,-200-cam*par-t*[3,6,10,16][i],0)});
  const gg=X.createLinearGradient(0,820,0,H);gg.addColorStop(0,'#c9a76a');gg.addColorStop(1,'#a8844a');X.fillStyle=gg;X.fillRect(0,880,W,H-880)}
function dust(t,y=780,a=.35){X.save();X.globalAlpha=a;X.globalCompositeOperation='screen';X.drawImage(SMOKE,-500+t*80,y,3200,500);X.restore()}
function sparkles(t,n=60,col='255,240,190'){X.save();X.globalCompositeOperation='lighter';for(let i=0;i<n;i++){const life=(t*.15*(.5+hash(i))+hash(i+7))%1;const x=hash(i+11)*W,y=H-life*H*1.1;X.fillStyle=`rgba(${col},${Math.sin(life*Math.PI)*.8})`;X.beginPath();X.arc(x,y,1+hash(i+3)*2.5,0,TAU);X.fill()}X.restore()}

// ---------- text helpers (bright style)
function goldHeadB(txt,x,y,size,font='CinzelH'){X.save();X.font=`900 ${size}px ${font}`;X.textAlign='center';X.textBaseline='alphabetic';X.letterSpacing='2px';X.lineJoin='round';
  X.shadowColor='rgba(0,0,0,.45)';X.shadowBlur=24;X.shadowOffsetY=8;X.lineWidth=size*.12;X.strokeStyle='#2a1206';X.strokeText(txt,x,y);X.shadowBlur=0;X.shadowOffsetY=0;
  const g=X.createLinearGradient(0,y-size*.8,0,y+size*.05);g.addColorStop(0,'#fff8cf');g.addColorStop(.35,'#ffd65a');g.addColorStop(.7,'#f29a1c');g.addColorStop(1,'#c4620a');X.fillStyle=g;X.fillText(txt,x,y);X.restore()}
function fitTxt(txt,font,maxW,start){let s=start;X.font=font.replace('{s}',s);while(X.measureText(txt).width>maxW&&s>14){s-=2;X.font=font.replace('{s}',s)}return s}
function labelBoxB(x,y,title,sub,sub2,a,col='#e9a21e',k=1,scale=1){if(a<=0)return;X.save();X.globalAlpha=a;X.translate(x,y);const s=lerp(.7,1,eback(clamp(k)))*scale;X.scale(s,s);
  X.font='700 46px Cinzel';X.letterSpacing='3px';const tw=X.measureText(title).width;X.font='800 30px InterB';X.letterSpacing='0px';const sw=sub?X.measureText(sub).width:0;
  X.font='600 24px Inter';X.letterSpacing='3px';const s2w=sub2?X.measureText(sub2).width:0;const w=Math.max(tw,sw,s2w)+70,h=64+(sub?40:0)+(sub2?34:0);
  X.shadowColor='rgba(0,0,0,.45)';X.shadowBlur=20;X.shadowOffsetY=6;X.fillStyle='rgba(42,20,10,.9)';X.beginPath();X.roundRect(-w/2,-h/2,w,h,12);X.fill();X.shadowBlur=0;X.shadowOffsetY=0;
  X.strokeStyle=goldGrad(X,-h/2,h/2);X.lineWidth=3;X.stroke();X.textAlign='center';X.textBaseline='middle';let yy=-h/2+38;
  X.font='700 46px Cinzel';X.letterSpacing='3px';const g=X.createLinearGradient(0,yy-22,0,yy+20);g.addColorStop(0,'#fff0b8');g.addColorStop(.5,col);g.addColorStop(1,'#b8600e');X.fillStyle=g;X.fillText(title,0,yy);
  if(sub){yy+=42;X.font='800 30px InterB';X.letterSpacing='0px';X.fillStyle='#fff';X.fillText(sub,0,yy)}if(sub2){yy+=34;X.font='600 24px Inter';X.letterSpacing='3px';X.fillStyle='#f1e6d0';X.fillText(sub2,0,yy)}X.restore()}
function yearBadge(txt,a){if(a<=0||!txt)return;X.save();X.globalAlpha=a;X.font='700 40px Cinzel';X.letterSpacing='6px';const w=X.measureText(txt).width+60;X.fillStyle='rgba(42,20,10,.88)';X.beginPath();X.roundRect(60,70,w,74,14);X.fill();
  X.strokeStyle=goldGrad(X,70,144);X.lineWidth=3;X.stroke();X.textBaseline='middle';X.textAlign='left';X.fillStyle=goldGrad(X,85,130);X.fillText(txt,90,109);X.restore()}
function parchment(x,y,w,h,a=1){X.save();X.globalAlpha=a;X.shadowColor='rgba(60,30,10,.35)';X.shadowBlur=40;X.shadowOffsetY=14;const g=X.createLinearGradient(x,y,x,y+h);g.addColorStop(0,'#fbf1da');g.addColorStop(1,'#efdcb2');X.fillStyle=g;X.beginPath();X.roundRect(x,y,w,h,18);X.fill();
  X.shadowBlur=0;X.shadowOffsetY=0;X.globalAlpha=a*.12;X.globalCompositeOperation='multiply';X.drawImage(SMOKE,x,y,w,h);X.globalCompositeOperation='source-over';X.globalAlpha=a;X.strokeStyle='#c8962e';X.lineWidth=3;X.strokeRect(x+14,y+14,w-28,h-28);X.lineWidth=1.2;X.strokeRect(x+22,y+22,w-44,h-44);X.restore()}
function brightBG(t,c1='#ffe3a3',c2='#ff9a62',c3='#7a4fd0'){const g=X.createLinearGradient(0,0,W,H);g.addColorStop(0,c1);g.addColorStop(.55,c2);g.addColorStop(1,c3);X.fillStyle=g;X.fillRect(0,0,W,H);
  X.save();X.globalCompositeOperation='screen';X.translate(W*.5,H*.42);for(let i=0;i<24;i++){X.rotate(TAU/24);X.fillStyle=`rgba(255,250,220,${.07+.04*Math.sin(t+i)})`;X.beginPath();X.moveTo(0,0);X.lineTo(1500,-90);X.lineTo(1500,90);X.fill()}X.restore();
  X.save();X.globalAlpha=.25;X.globalCompositeOperation='soft-light';X.drawImage(SMOKE,-200+t*10,0,2400,H);X.restore()}
