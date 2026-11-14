// ================= PEOPLE SCENES — stylised stick figures (meetings, governors) =================
// stick(ctx,x,y,s,o): x,y = feet position, s = standing height in px
function stick(ctx,x,y,s,o={}){
  const f=o.f||1,t=o.t||0,pose=o.pose||'stand',L='#2b1a10',lw=Math.max(2,s*.055);
  const sit=pose==='sit'||pose==='write'||pose==='sitraise'||pose==='sitspeak',kneel=pose==='kneel'||pose==='bow';
  const bob=Math.sin(t*2+(o.ph||0))*s*.006;
  const hipY=y-(sit?s*.16:kneel?s*.28:s*.44)+bob,shY=hipY-s*.30,neckY=shY-s*.035;
  let headX=x,headY=neckY-s*.11;if(pose==='bow'){headX+=f*s*.12;headY+=s*.08}
  const shX=x+(pose==='bow'?f*s*.08:0);
  ctx.save();ctx.lineCap='round';ctx.lineJoin='round';
  if(o.glow){ctx.save();ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(x,hipY-s*.1,0,x,hipY-s*.1,s*.75);g.addColorStop(0,`rgba(255,220,120,${.55*o.glow})`);g.addColorStop(1,'rgba(255,200,80,0)');ctx.fillStyle=g;ctx.fillRect(x-s,hipY-s,s*2,s*1.6);ctx.restore()}
  // legs
  ctx.strokeStyle=L;ctx.lineWidth=lw;ctx.beginPath();
  if(sit){ctx.moveTo(x-s*.03,hipY);ctx.lineTo(x-s*.2,hipY+s*.06);ctx.lineTo(x+s*.05,hipY+s*.13);ctx.moveTo(x+s*.03,hipY);ctx.lineTo(x+s*.2,hipY+s*.06);ctx.lineTo(x-s*.05,hipY+s*.13)}
  else if(kneel){ctx.moveTo(x,hipY);ctx.lineTo(x+f*s*.12,hipY+s*.14);ctx.lineTo(x+f*s*.12,y);ctx.moveTo(x,hipY);ctx.lineTo(x-f*s*.08,hipY+s*.2);ctx.lineTo(x-f*s*.26,y)}
  else{const st=o.walk?Math.sin(t*6)*.25:0;ctx.moveTo(x,hipY);ctx.lineTo(x-s*.1-st*s*.2,y);ctx.moveTo(x,hipY);ctx.lineTo(x+s*.1+st*s*.2,y)}
  ctx.stroke();
  // robe (simple trapezoid) for identity
  const rb=sit?hipY+s*.05:kneel?hipY+s*.08:hipY+s*.28;ctx.fillStyle=o.col||'#c62f28';ctx.beginPath();ctx.moveTo(shX-s*.075,shY);ctx.lineTo(shX+s*.075,shY);ctx.lineTo(x+s*(sit?.17:.14),rb);ctx.lineTo(x-s*(sit?.17:.14),rb);ctx.closePath();ctx.fill();
  ctx.strokeStyle=L;ctx.lineWidth=lw*.6;ctx.stroke();if(o.sash){ctx.strokeStyle=o.sash;ctx.lineWidth=lw*.9;ctx.beginPath();ctx.moveTo(shX-s*.07,shY+s*.03);ctx.lineTo(x+s*.09,hipY-s*.02);ctx.stroke()}
  // arms: returns hand points
  const arm=(side,ang1,ang2)=>{ // angles from straight down (rad), positive = toward facing
    const sx=shX+side*s*.06,sy=shY+s*.02;const ex=sx+Math.sin(ang1)*s*.16*f,ey=sy+Math.cos(ang1)*s*.16;const hx=ex+Math.sin(ang1+ang2)*s*.15*f,hy=ey+Math.cos(ang1+ang2)*s*.15;
    ctx.strokeStyle=L;ctx.lineWidth=lw;ctx.beginPath();ctx.moveTo(sx,sy);ctx.lineTo(ex,ey);ctx.lineTo(hx,hy);ctx.stroke();return[hx,hy]};
  let fa=[.25,.1],ba=[-.15,-.05];const g=Math.sin(t*3.2+(o.ph||0));
  if(pose==='speak'||pose==='sitspeak')fa=[1.6+.35*g,.6+.25*Math.sin(t*4.1)];
  if(pose==='raise'||pose==='sitraise'){const k=o.k==null?1:o.k;fa=[lerp(.25,3.05,k),lerp(.1,0,k)]}
  if(pose==='write')fa=[1.05,.55+.12*Math.sin(t*9)];
  if(pose==='present'){fa=[1.45,.15];ba=[1.35,.2]}
  if(pose==='bow'){fa=[.7,.2];ba=[.6,.2]}
  if(pose==='hold'){fa=[.9,-.9]}
  const bh=arm(-f,ba[0],ba[1]),fh=arm(f,fa[0],fa[1]);
  // items
  if(o.item==='tablet'){const h=pose==='present'?fh:pose==='write'?[x+f*s*.2,hipY+s*.02]:fh;ctx.save();ctx.translate(h[0]+f*s*.03,h[1]-s*.02);ctx.rotate(pose==='write'?-.15*f:0);ctx.fillStyle='#d9a96a';ctx.strokeStyle='#7a4a22';ctx.lineWidth=lw*.5;ctx.beginPath();ctx.roundRect(-s*.07,-s*.09,s*.14,s*.18,s*.02);ctx.fill();ctx.stroke();
    ctx.strokeStyle='rgba(90,50,20,.7)';ctx.lineWidth=lw*.25;for(let i=0;i<4;i++){ctx.beginPath();ctx.moveTo(-s*.05,-s*.06+i*s*.035);ctx.lineTo(s*.05,-s*.06+i*s*.035);ctx.stroke()}ctx.restore()}
  if(o.item==='spear'){ctx.strokeStyle='#6a3a14';ctx.lineWidth=lw*.7;ctx.beginPath();ctx.moveTo(fh[0],fh[1]+s*.3);ctx.lineTo(fh[0],fh[1]-s*.55);ctx.stroke();ctx.fillStyle='#d8d2c4';ctx.beginPath();ctx.moveTo(fh[0],fh[1]-s*.66);ctx.lineTo(fh[0]-s*.03,fh[1]-s*.54);ctx.lineTo(fh[0]+s*.03,fh[1]-s*.54);ctx.fill()}
  if(o.item==='staff'){ctx.strokeStyle='#7a4a22';ctx.lineWidth=lw*.8;ctx.beginPath();ctx.moveTo(fh[0],fh[1]+s*.32);ctx.lineTo(fh[0],fh[1]-s*.32);ctx.stroke();ctx.fillStyle='#e8b84a';ctx.beginPath();ctx.arc(fh[0],fh[1]-s*.34,s*.035,0,TAU);ctx.fill()}
  if(o.item==='stylus'){ctx.strokeStyle='#5a3214';ctx.lineWidth=lw*.4;ctx.beginPath();ctx.moveTo(fh[0],fh[1]);ctx.lineTo(fh[0]+f*s*.05,fh[1]+s*.06);ctx.stroke()}
  // neck + head
  ctx.strokeStyle=L;ctx.lineWidth=lw;ctx.beginPath();ctx.moveTo(shX,shY);ctx.lineTo(headX,neckY);ctx.stroke();
  const r=s*.1;ctx.fillStyle=o.skin||'#d9a274';ctx.beginPath();ctx.arc(headX,headY,r,0,TAU);ctx.fill();ctx.strokeStyle=L;ctx.lineWidth=lw*.7;ctx.stroke();
  // beard
  if(o.beard!==false){ctx.fillStyle=o.beardCol||'#3a2414';ctx.beginPath();ctx.moveTo(headX-r*.75,headY+r*.25);ctx.quadraticCurveTo(headX,headY+r*1.9,headX+r*.75,headY+r*.25);ctx.quadraticCurveTo(headX,headY+r*.9,headX-r*.75,headY+r*.25);ctx.fill()}
  // eyes (look direction)
  const lk=(o.look||0)*r*.25+f*r*.15;ctx.fillStyle='#1a0e06';[-.32,.32].forEach(dx=>{ctx.beginPath();ctx.arc(headX+dx*r+lk,headY-r*.12,r*.11,0,TAU);ctx.fill()});
  // hats
  ctx.lineWidth=lw*.6;ctx.strokeStyle=L;
  if(o.hat==='cone'){ctx.fillStyle=o.hatCol||'#b8803c';ctx.beginPath();ctx.moveTo(headX-r*1.05,headY-r*.35);ctx.lineTo(headX+f*r*.2,headY-r*2.3);ctx.lineTo(headX+r*1.05,headY-r*.35);ctx.closePath();ctx.fill();ctx.stroke();
    if(o.plume){ctx.fillStyle=o.plume;ctx.beginPath();ctx.moveTo(headX+f*r*.2,headY-r*2.25);ctx.quadraticCurveTo(headX-f*r*1.8,headY-r*(2.6+.2*Math.sin(t*3)),headX-f*r*2.6,headY-r*1.2);ctx.quadraticCurveTo(headX-f*r*1.2,headY-r*1.7,headX+f*r*.1,headY-r*1.85);ctx.fill()}}
  if(o.hat==='cap'){ctx.fillStyle=o.hatCol||'#efe2bd';ctx.beginPath();ctx.ellipse(headX,headY-r*.45,r*1.08,r*.7,0,Math.PI,TAU);ctx.closePath();ctx.fill();ctx.stroke();ctx.fillRect(headX-r*1.15,headY-r*.5,r*2.3,r*.22)}
  if(o.hat==='crown'){ctx.fillStyle='#ffcf3a';ctx.beginPath();ctx.moveTo(headX-r*.95,headY-r*.55);for(let i=0;i<=4;i++){ctx.lineTo(headX-r*.95+i*r*.475,headY-r*(i%2?1.05:1.6))}ctx.lineTo(headX+r*.95,headY-r*.55);ctx.closePath();ctx.fill();ctx.stroke()}
  if(o.hat==='band'){ctx.fillStyle=o.hatCol||'#e3322b';ctx.fillRect(headX-r*1.02,headY-r*.62,r*2.04,r*.3)}
  ctx.restore();return{head:[headX,headY],hand:fh}}
// ---------- scene: Guti tribal assembly
const CHIEFS=[['#d2322a','#b8803c','#ffcf3a'],['#2f7fd6','#c9a24a','#ffffff'],['#1f9a72','#a8763a','#e3322b'],['#ef8a1f','#b8803c','#2f7fd6'],['#7b3fa0','#d8b04c','#ffcf3a'],['#e0b13a','#8a6410','#d2322a'],['#2d8a6a','#b8803c','#ffffff'],['#c94b96','#a8763a','#ffcf3a']];
function sCouncil(T,p){const lt=T-SH.t0;landscape(lt*.3,lt*8,.12);
  // ground clearing
  const gg=X.createRadialGradient(W/2,H*.86,50,W/2,H*.86,W*.6);gg.addColorStop(0,'#d9b878');gg.addColorStop(1,'#a8844a');X.fillStyle=gg;X.beginPath();X.ellipse(W/2,H*.86,W*.62,H*.22,0,0,TAU);X.fill();
  // big tree (left)
  X.fillStyle='#6a4426';X.fillRect(170,430,46,420);X.fillStyle='#4f8f33';[[190,400,170],[120,470,120],[270,460,130],[200,330,120]].forEach(([x,y,r])=>{X.beginPath();X.arc(x,y,r,0,TAU);X.fill()});X.fillStyle='rgba(255,255,255,.12)';X.beginPath();X.arc(160,350,70,0,TAU);X.fill();
  // tents
  [[1580,640,1],[1760,690,.8]].forEach(([x,y,k])=>{X.fillStyle='#c98a4a';X.beginPath();X.moveTo(x-140*k,y+160*k);X.lineTo(x,y);X.lineTo(x+140*k,y+160*k);X.fill();X.fillStyle='#7a4a22';X.beginPath();X.moveTo(x-30*k,y+160*k);X.lineTo(x,y+60*k);X.lineTo(x+30*k,y+160*k);X.fill()});
  // rugs + fire
  const fx=W*.52,fy=H*.8;
  const vote=p.vote!=null?R(p.vote)-SH.t0:1e9,elect=p.elect!=null?R(p.elect)-SH.t0:1e9;
  // seated chiefs in a semicircle (back row first)
  const seats=[];for(let i=0;i<8;i++){const a=Math.PI*(1.12+i*0.11);seats.push([fx+Math.cos(a)*560,fy-40+Math.sin(a)*170,i])}
  seats.sort((a,b)=>a[1]-b[1]);
  for(const [x,y,i] of seats){const c=CHIEFS[i];X.fillStyle=['#b8261e','#2f6fb5','#c98a1a','#1f7a5a'][i%4];X.beginPath();X.ellipse(x,y+6,92,24,0,0,TAU);X.fill();
    const k=clamp((lt-vote-i*.18)/.35);const elected=i===5&&lt>elect;
    const pose=elected?'stand':(lt>vote&&i%3!==1?'sitraise':'sit');
    stick(X,x,y,elected?230:200,{pose,k,f:x<fx?1:-1,t:lt,ph:i,col:c[0],hat:elected?'crown':'cone',hatCol:c[1],plume:c[2],look:x<fx?1:-1,glow:elected?clamp((lt-elect)/.5):0})}
  // fire
  X.save();X.globalCompositeOperation='lighter';for(let i=0;i<14;i++){const h=60+40*Math.sin(lt*7+i*1.7)+hash(i)*50;const xx=fx-60+i*9;const g=X.createLinearGradient(0,fy-h,0,fy+10);g.addColorStop(0,'rgba(255,240,150,0)');g.addColorStop(.4,'rgba(255,170,50,.75)');g.addColorStop(1,'rgba(255,80,20,.9)');
    X.fillStyle=g;X.beginPath();X.moveTo(xx-14,fy+10);X.quadraticCurveTo(xx+Math.sin(lt*8+i)*10,fy-h,xx+14,fy+10);X.fill()}X.restore();
  X.fillStyle='#5a3214';[[-50,14,.3],[0,18,-.2],[45,14,.4]].forEach(([dx,dy,a])=>{X.save();X.translate(fx+dx,fy+dy);X.rotate(a);X.fillRect(-55,-8,110,16);X.restore()});
  // speaking elder (standing, left of fire)
  if(lt<elect)stick(X,fx-330,fy+120,250,{pose:'speak',f:1,t:lt,col:'#8e1f1a',hat:'cone',hatCol:'#d8b04c',plume:'#ffffff',item:'staff',sash:'#ffcf3a'});
  else stick(X,fx-330,fy+120,250,{pose:'raise',k:1,f:1,t:lt,col:'#8e1f1a',hat:'cone',hatCol:'#d8b04c',plume:'#ffffff',sash:'#ffcf3a'});
  labelBoxB(W/2,130,p.title||'AŞİRET MECLİSİ',p.sub||'Gutilerde ortak yönetim',p.sub2||'',ss(.2,.6,lt),'#ffb23a',clamp((lt-.2)/.5));
  if(lt>elect)labelBoxB(W*.79,H*.4,'SEÇİLEN LİDER','Meclisin kararı','',ss(elect,elect+.5,lt),'#ffd23a',clamp((lt-elect)/.5),.9)}
// ---------- scene: Sumerian governor under Gutian rule
function sGovernor(T,p){const lt=T-SH.t0;skyDay(lt,.15);const gg=X.createLinearGradient(0,700,0,H);gg.addColorStop(0,'#e3c486');gg.addColorStop(1,'#c9a060');X.fillStyle=gg;X.fillRect(0,680,W,H);
  // ziggurat background
  X.save();X.translate(W*.72,690);X.scale(.75,.75);let y=0;[[560,110],[410,95],[280,80],[160,65]].forEach(([w,h])=>{const g=X.createLinearGradient(-w/2,0,w/2,0);g.addColorStop(0,'#c98a4a');g.addColorStop(.5,'#ecb874');g.addColorStop(1,'#a8683a');X.fillStyle=g;X.fillRect(-w/2,y-h,w,h);y-=h});X.fillStyle='#3f6fe0';X.fillRect(-50,y-50,100,50);X.restore();
  // palace platform + canopy
  X.fillStyle='#b8905a';X.fillRect(160,820,980,70);X.fillStyle='#9a7040';X.fillRect(160,880,980,18);
  X.fillStyle='#7a4a22';X.fillRect(250,420,18,400);X.fillRect(720,420,18,400);
  for(let i=0;i<8;i++){X.fillStyle=i%2?'#f3e6c8':'#b8261e';X.beginPath();X.moveTo(240+i*62,420);X.lineTo(302+i*62,420);X.lineTo(302+i*62,470+(i%2?0:10));X.lineTo(240+i*62,470+(i%2?10:0));X.fill()}
  // throne
  X.fillStyle='#5a3214';X.fillRect(410,640,170,180);X.fillStyle='#ffcf3a';X.fillRect(400,630,190,22);
  const step=p.step!=null?R(p.step)-SH.t0:.6,bow=p.bow!=null?R(p.bow)-SH.t0:2.4;
  // governor (seated), scribe, guard, envoy
  stick(X,495,800,260,{pose:lt>bow+.6?'sitspeak':'sit',f:1,t:lt,col:'#f3e6c8',hat:'cap',hatCol:'#3f6fe0',sash:'#ffcf3a',skin:'#d39a6a'});
  stick(X,700,840,200,{pose:'write',f:-1,t:lt,col:'#e8d8b0',hat:'band',hatCol:'#2d8a6a',item:'tablet',beard:false});
  stick(X,300,820,250,{pose:'hold',f:1,t:lt,col:'#2a4f9f',hat:'cap',hatCol:'#c0c6ce',item:'spear'});
  const ex=lerp(1500,980,eout(clamp((lt-step)/1.6)));
  stick(X,ex,840,250,{pose:lt>bow?'bow':(lt>step+1.6?'present':'stand'),walk:lt>step&&lt<step+1.6,f:-1,t:lt,col:'#d2322a',hat:'cone',hatCol:'#b8803c',plume:'#ffcf3a',item:'tablet',sash:'#ffcf3a'});
  labelBoxB(495,300,p.title||'UMMA VALİSİ',p.sub||'Lugal-annatum','',ss(.2,.6,lt),'#5fb0ff',clamp((lt-.2)/.5),.9);
  labelBoxB(1260,580,p.title2||'GUTİ ELÇİSİ',p.sub2||'Kral Si’um adına','',ss(step+1.2,step+1.6,lt),'#ff6a4a',clamp((lt-step-1.2)/.5),.85);
  if(p.quote){const a=A(p.quote[0],.5);if(a>0){parchment(W*.5-560,110,1120,110,a);X.save();X.globalAlpha=a;X.textAlign='center';X.textBaseline='middle';X.font='italic 600 46px Corm';X.fillStyle='#4a2a10';X.fillText(p.quote[1],W/2,166);X.restore()}}}
