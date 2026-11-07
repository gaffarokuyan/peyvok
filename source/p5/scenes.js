// ===== 20 painted scenes, 4 regions =====
const REG=[
  {tile:"#6a34b0",hi:"#9a6ae0",deep:"#46207a",sky:["#7d72d8","#e29bd2","#ffd2ae"],sun:"#fff3dc",far:"#c7a7df",mid:"#9c80cc",near:"#6f55a8",ground:"#4c3a80",mus:0},
  {tile:"#c4601f",hi:"#f09a48",deep:"#7c3510",sky:["#4f9de0","#a8d6f0","#ffe4ae"],sun:"#fff6dc",far:"#dcb894",mid:"#bf8f62",near:"#8c603c",ground:"#5e3f26",mus:1},
  {tile:"#1c8a66",hi:"#4cc49a",deep:"#0e5a42",sky:["#5aaed0","#b6e2da","#fbf6dc"],sun:"#fffcea",far:"#a9d2bd",mid:"#74ab8f",near:"#457e62",ground:"#2c5a45",mus:2},
  {tile:"#a3334a",hi:"#e0687a",deep:"#661a2b",sky:["#6a58b0","#f08c7c","#ffd27e"],sun:"#fff0c2",far:"#d7988a",mid:"#ad6a62",near:"#784048",ground:"#4c2630",mus:3}
];
function srand(a){return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const SC=(function(){
  let c,w,h,R;
  const poly=(pts,col)=>{c.fillStyle=col;c.beginPath();c.moveTo(pts[0][0],pts[0][1]);for(const p of pts.slice(1))c.lineTo(p[0],p[1]);c.closePath();c.fill()};
  const ridge=(base,amp,seed,step,col,smooth=.72)=>{const r=srand(seed),pts=[];let y=base;for(let x=-20;x<=w+20;x+=step){y+=(r()-.5)*amp;y=base+(y-base)*smooth;pts.push([x,y])}c.fillStyle=col;c.beginPath();c.moveTo(-20,h);pts.forEach(p=>c.lineTo(p[0],p[1]));c.lineTo(w+20,h);c.closePath();c.fill();return pts};
  const haze=(y,col,a="77")=>{const g=c.createLinearGradient(0,y-h*.08,0,y+h*.05);g.addColorStop(0,col+"00");g.addColorStop(1,col+a);c.fillStyle=g;c.fillRect(0,y-h*.08,w,h*.13)};
  const lg=(y0,y1,stops)=>{const g=c.createLinearGradient(0,y0,0,y1);stops.forEach((s,i)=>g.addColorStop(i/(stops.length-1),s));return g};
  const circ=(x,y,r,col)=>{c.fillStyle=col;c.beginPath();c.arc(x,y,r,0,7);c.fill()};
  const ell=(x,y,rx,ry,col)=>{c.fillStyle=col;c.beginPath();c.ellipse(x,y,rx,ry,0,0,7);c.fill()};
  const rect=(x,y,ww,hh,col)=>{c.fillStyle=col;c.fillRect(x,y,ww,hh)};
  const pine=(x,y,s,col)=>poly([[x,y-s*2.4],[x-s*.75,y],[x+s*.75,y]],col);
  const poplar=(x,y,s,col)=>{ell(x,y-s*1.6,s*.35,s*1.6,col)};
  const tree=(x,y,s,col)=>{rect(x-s*.08,y-s*.6,s*.16,s*.6,col);circ(x,y-s*.9,s*.5,col);circ(x-s*.35,y-s*.7,s*.35,col);circ(x+s*.35,y-s*.7,s*.35,col)};
  const water=(y0,top,bot)=>{c.fillStyle=lg(y0,h,[top,bot]);c.fillRect(0,y0,w,h-y0);const r=srand(7);c.strokeStyle="rgba(255,255,255,.35)";c.lineWidth=1.5;for(let i=0;i<30;i++){const y=y0+r()*(h-y0)*.9,x=r()*w,l=8+r()*36;c.globalAlpha=.15+r()*.4;c.beginPath();c.moveTo(x,y);c.lineTo(x+l,y);c.stroke()}c.globalAlpha=1};
  const dome=(x,y,r,col)=>{c.fillStyle=col;c.beginPath();c.arc(x,y,r,Math.PI,0);c.fill()};
  const minaret=(x,y,ww,hh,col)=>{rect(x-ww/2,y-hh,ww,hh,col);rect(x-ww*.8,y-hh*.72,ww*1.6,hh*.05,col);poly([[x-ww/2,y-hh],[x,y-hh-ww*2],[x+ww/2,y-hh]],col)};
  const archWin=(x,y,ww,hh,col)=>{c.fillStyle=col;c.beginPath();c.moveTo(x,y+hh);c.lineTo(x,y+ww/2);c.arc(x+ww/2,y+ww/2,ww/2,Math.PI,0);c.lineTo(x+ww,y+hh);c.closePath();c.fill()};
  const pointArch=(x,y,ww,hh,col)=>{c.fillStyle=col;c.beginPath();c.moveTo(x,y+hh);c.lineTo(x,y+hh*.35);c.quadraticCurveTo(x,y,x+ww/2,y);c.quadraticCurveTo(x+ww,y,x+ww,y+hh*.35);c.lineTo(x+ww,y+hh);c.closePath();c.fill()};
  let grain=null;
  const finish=(sx,sy)=>{
    c.save();
    // golden-hour light: warm wash from the sun, deep bloom, soft vignette, film grain
    c.globalCompositeOperation="soft-light";c.fillStyle=lg(0,h,[R.sun+"99",R.sky[2]+"44","#00000000"]);c.fillRect(0,0,w,h);
    c.globalCompositeOperation="screen";let g=c.createRadialGradient(sx,sy,0,sx,sy,Math.max(w,h)*.75);g.addColorStop(0,R.sun+"80");g.addColorStop(.22,R.sun+"2a");g.addColorStop(1,R.sun+"00");c.fillStyle=g;c.fillRect(0,0,w,h);
    c.globalCompositeOperation="source-over";g=c.createRadialGradient(w/2,h*.42,Math.min(w,h)*.35,w/2,h*.5,Math.max(w,h)*.85);g.addColorStop(0,"rgba(20,8,30,0)");g.addColorStop(1,"rgba(20,8,30,.32)");c.fillStyle=g;c.fillRect(0,0,w,h);
    const v=c.createLinearGradient(0,h*.62,0,h);v.addColorStop(0,"rgba(10,4,20,0)");v.addColorStop(1,"rgba(10,4,20,.3)");c.fillStyle=v;c.fillRect(0,0,w,h);
    if(!grain){grain=document.createElement("canvas");grain.width=grain.height=128;const gx=grain.getContext("2d"),id=gx.createImageData(128,128);for(let k=0;k<id.data.length;k+=4){const n=Math.random()*255;id.data[k]=id.data[k+1]=id.data[k+2]=n;id.data[k+3]=255}gx.putImageData(id,0,0)}
    c.globalCompositeOperation="overlay";c.globalAlpha=.06;c.fillStyle=c.createPattern(grain,"repeat");c.fillRect(0,0,w,h);
    c.restore();
  };
  const D=[
    // ---- Bakur
    ()=>{ridge(h*.6,30,7,30,R.far);haze(h*.62,R.sky[2]);
      const mt=(px,py,bw)=>{c.fillStyle=R.mid;c.beginPath();c.moveTo(px-bw,h*.7);c.quadraticCurveTo(px-bw*.35,py+bw*.2,px,py);c.quadraticCurveTo(px+bw*.4,py+bw*.25,px+bw*1.1,h*.7);c.closePath();c.fill();
        c.fillStyle="#f8f3ff";c.beginPath();c.moveTo(px-bw*.3,py+bw*.22);c.quadraticCurveTo(px-bw*.12,py+bw*.05,px,py);c.quadraticCurveTo(px+bw*.15,py+bw*.06,px+bw*.36,py+bw*.25);for(let k=0;k<7;k++)c.lineTo(px+bw*.36-(k+1)*bw*.095,py+bw*(.25+(k%2?.07:0)));c.closePath();c.fill()};
      mt(w*.27,h*.43,w*.27);mt(w*.63,h*.24,w*.52);haze(h*.7,R.sky[2],"66");
      const nr=ridge(h*.73,30,11,22,R.near);const r=srand(5);nr.forEach(p=>{if(r()<.35)poplar(p[0],p[1]+4,10+r()*8,R.ground)});
      ridge(h*.85,20,19,16,R.ground);
      for(let i=0;i<3;i++){const x=w*(.2+i*.09),y=h*.775;ell(x,y,7,3.5,"#2a1f40");rect(x+5,y-6,2.5,6,"#2a1f40");rect(x-5,y,1.5,5,"#2a1f40");rect(x+4,y,1.5,5,"#2a1f40")}},
    ()=>{ridge(h*.48,34,5,26,R.far);haze(h*.5,R.sky[2]);ridge(h*.55,22,9,20,R.mid);
      water(h*.58,"#5fb3c9","#1d4f6a");
      ell(w*.62,h*.6,w*.16,h*.03,R.near);ridge(h*.6,0,1,999,"#00000000");
      c.fillStyle="#c9a57e";rect(w*.6,h*.53,w*.05,h*.06,"#c9a57e");rect(w*.585,h*.555,w*.08,h*.035,"#b8916a");poly([[w*.6,h*.53],[w*.625,h*.495],[w*.65,h*.53]],"#a07a58");
      const r=srand(3);for(let i=0;i<6;i++){const x=w*(.05+i*.18),y=h*(.9+r()*.04);rect(x-2,y-28,4,28,"#4a3048");for(let k=0;k<28;k++)circ(x+(r()-.5)*44,y-34+(r()-.5)*26,3+r()*4,r()<.5?"#ffd1e3":"#fff0f5")}},
    ()=>{c.fillStyle=lg(h*.5,h*.75,["#ffffffcc","#e9d6ef"]);for(let i=0;i<9;i++)ell(w*(i/8),h*(.62+(i%2)*.02),w*.2,h*.05,"#f3e6f3");
      poly([[-10,h*.62],[w*.25,h*.55],[w*.4,h*.5],[w*.62,h*.5],[w*.8,h*.56],[w+10,h*.64],[w+10,h],[-10,h]],R.mid);
      poly([[w*.36,h*.51],[w*.5,h*.37],[w*.64,h*.51]],"#7c6699");
      for(let i=0;i<5;i++){const x=w*(.2+i*.045),y=h*.555;rect(x,y-h*.032,w*.026,h*.032,R.near);circ(x+w*.013,y-h*.04,w*.016,R.near)}
      ridge(h*.82,22,23,20,R.near);ridge(h*.9,14,29,16,R.ground)},
    ()=>{ridge(h*.5,30,13,26,R.far);haze(h*.52,R.sky[2]);
      poly([[-10,h*.3],[w*.32,h*.33],[w*.36,h*.62],[-10,h*.64]],"#c9a37f");poly([[-10,h*.42],[w*.34,h*.45],[w*.36,h*.62],[-10,h*.64]],"#b48d69");
      const r=srand(9);for(let i=0;i<22;i++)ell(w*.02+r()*w*.3,h*(.34+r()*.26),5+r()*6,4+r()*5,"#5a3b2e");
      water(h*.62,"#7aa9b8","#2c4a5c");
      [.48,.62,.76].forEach(x=>{rect(w*x,h*.5,w*.035,h*.14,"#a8835f");rect(w*x-3,h*.5,w*.035+6,h*.012,"#977353")});
      minaret(w*.9,h*.62,w*.035,h*.2,"#b48d69");ridge(h*.9,10,4,20,R.ground)},
    ()=>{c.fillStyle=lg(h*.55,h*.75,[R.far,"#c8a6c4"]);c.fillRect(0,h*.6,w,h*.4);haze(h*.62,R.sky[2],"aa");
      poly([[-10,h*.66],[w*.15,h*.4],[w*.55,h*.28],[w*.9,h*.36],[w+10,h*.5],[w+10,h*.72],[-10,h*.74]],R.mid);
      const r=srand(21);for(let row=0;row<7;row++){for(let i=0;i<9;i++){const x=w*(.02+i*.11+(row%2)*.05),y=h*(.36+row*.05)+Math.abs(x-w*.55)*.08;if(y>h*.7)continue;const ww=w*.09,hh=h*.04;rect(x,y,ww,hh,row%2?"#e6c08e":"#d9b07c");archWin(x+ww*.2,y+hh*.35,ww*.18,hh*.5,"#7a5640");archWin(x+ww*.58,y+hh*.35,ww*.18,hh*.5,"#7a5640")}}
      minaret(w*.55,h*.33,w*.03,h*.13,"#d9b07c");dome(w*.66,h*.33,w*.06,"#d9b07c");ridge(h*.86,14,8,18,R.ground)},
    // ---- Başûr
    ()=>{ridge(h*.55,22,31,26,R.far);haze(h*.58,R.sky[2]);
      c.fillStyle="#c79a62";c.beginPath();c.ellipse(w*.5,h*.6,w*.52,h*.11,0,Math.PI,0);c.fill();
      rect(-10,h*.47,w+20,h*.04,"#b98a54");for(let i=0;i<12;i++){rect(w*(i/11)-6,h*.44,w*.07,h*.035,i%2?"#d8b07a":"#caa06a")}
      pointArch(w*.44,h*.43,w*.12,h*.08,"#9b7044");pointArch(w*.465,h*.455,w*.07,h*.055,"#4e331c");
      const r=srand(2);for(let i=0;i<7;i++){const x=w*(.05+i*.15),y=h*.74;rect(x-2,y-40,4,40,"#5a3e28");c.strokeStyle="#3f5e30";c.lineWidth=3.5;c.lineCap="round";for(let k=0;k<7;k++){const a=Math.PI*(1.1+k*.13),ex=x+Math.cos(a)*22,ey=y-40+Math.sin(a)*14;c.beginPath();c.moveTo(x,y-40);c.quadraticCurveTo((x+ex)/2,y-52,ex,ey+8);c.stroke()}}
      ridge(h*.78,12,5,18,R.near);ridge(h*.88,8,6,16,R.ground)},
    ()=>{ridge(h*.42,40,17,24,R.far);haze(h*.45,R.sky[2]);
      poly([[-10,h*.25],[w*.3,h*.3],[w*.38,h*.75],[-10,h*.8]],R.mid);poly([[w+10,h*.22],[w*.66,h*.3],[w*.58,h*.75],[w+10,h*.8]],R.near);
      poly([[w*.3,h*.3],[w*.38,h*.75],[w*.34,h*.75]],"#a77f58");
      c.strokeStyle="#e9d2a8";c.lineWidth=3;c.beginPath();c.moveTo(w*.66,h*.36);c.lineTo(w*.62,h*.55);c.lineTo(w*.6,h*.72);c.stroke();
      water(h*.72,"#6aa9a7","#20484a");const r=srand(4);for(let i=0;i<10;i++)tree(r()<.5?r()*w*.3:w*.7+r()*w*.3,h*(.75+r()*.15),14+r()*10,"#3e5a2a")},
    ()=>{ridge(h*.6,40,12,22,R.far);haze(h*.62,R.sky[2]);
      poly([[w*.12,h*.68],[w*.18,h*.42],[w*.82,h*.42],[w*.9,h*.68]],"#a8865f");rect(w*.18,h*.41,w*.64,h*.015,"#c9a576");
      const r=srand(6);for(let i=0;i<14;i++){const x=w*(.2+i*.043),hh=h*(.03+r()*.03);rect(x,h*.41-hh,w*.04,hh,i%2?"#e9cf9f":"#dcbc88")}
      minaret(w*.5,h*.4,w*.025,h*.12,"#e9cf9f");ridge(h*.78,26,9,20,R.mid);ridge(h*.88,16,10,16,R.near)},
    ()=>{ridge(h*.5,30,14,24,R.far);haze(h*.52,R.sky[2]);ridge(h*.6,22,15,22,"#a7b07a");
      rect(w*.15,h*.58,w*.7,h*.08,"#efe6d6");rect(w*.15,h*.575,w*.7,h*.01,"#d8cbb4");
      [[.3,.13],[.5,.17],[.68,.12]].forEach(([x,s])=>{const bx=w*x,by=h*.58,hh=h*s,ww=w*.09;c.fillStyle="#f7f1e6";c.beginPath();c.moveTo(bx-ww/2,by);c.lineTo(bx,by-hh);c.lineTo(bx+ww/2,by);c.fill();c.strokeStyle="#d6c8b0";c.lineWidth=1.4;for(let k=1;k<6;k++){c.beginPath();c.moveTo(bx-ww/2+ww*k/6,by);c.lineTo(bx,by-hh);c.stroke()}});
      const r=srand(8);for(let i=0;i<9;i++)tree(w*(r()),h*(.7+r()*.15),16+r()*10,"#55693a");ridge(h*.88,10,3,16,R.near)},
    ()=>{ridge(h*.38,30,22,24,R.far);
      poly([[w*.2,h*.25],[w*.8,h*.25],[w*.84,h*.7],[w*.16,h*.7]],"#8e6e52");
      c.fillStyle=lg(h*.26,h*.66,["#ffffff","#d8f0f4"]);c.fillRect(w*.42,h*.26,w*.16,h*.4);
      ell(w*.5,h*.69,w*.32,h*.04,"#bfe6ea");water(h*.7,"#5bb0b0","#1d4b47");
      c.globalAlpha=.35;["#ff6b6b","#ffd36b","#7ee08f","#6bb8ff"].forEach((col,i)=>{c.strokeStyle=col;c.lineWidth=4;c.beginPath();c.arc(w*.5,h*.72,w*(.24-i*.025),Math.PI*1.1,Math.PI*1.9);c.stroke()});c.globalAlpha=1;
      const r=srand(11);for(let i=0;i<12;i++)tree(r()<.5?r()*w*.25:w*.75+r()*w*.25,h*(.4+r()*.32),16+r()*10,"#3f6a2c")},
    // ---- Rojhilat
    ()=>{ridge(h*.36,40,24,24,R.far);haze(h*.4,R.sky[2],"aa");
      poly([[-10,h*.78],[w*.95,h*.28],[w+10,h*.3],[w+10,h],[-10,h]],R.mid);
      for(let row=0;row<10;row++){const y=h*(.34+row*.045),x0=w*(.85-row*.09);for(let i=0;i<3;i++){const x=x0+i*w*.09-w*.04;if(x>w)continue;rect(x,y,w*.085,h*.035,row%2?"#d9c9a6":"#cbb894");rect(x,y,w*.085,h*.006,"#b0a07f");rect(x+w*.03,y+h*.012,w*.018,h*.016,"#5a4a3a")}}
      haze(h*.55,"#ffffff","44");const r=srand(12);for(let i=0;i<8;i++)tree(r()*w*.5,h*(.72+r()*.2),16+r()*10,"#2f5a3e")},
    ()=>{ridge(h*.42,36,25,24,R.far);haze(h*.46,R.sky[2],"aa");const fr=ridge(h*.54,24,26,18,R.mid);fr.forEach((p,i)=>{if(i%1==0)pine(p[0],p[1]+6,9,R.near)});
      water(h*.58,"#8fc5bb","#2b5e57");
      c.strokeStyle="#4e6b3a";c.lineWidth=2;const r=srand(13);for(let i=0;i<60;i++){const x=r()*w,y=h*(.86+r()*.12);c.beginPath();c.moveTo(x,y);c.lineTo(x+(r()-.5)*8,y-20-r()*24);c.stroke()}
      poly([[w*.55,h*.68],[w*.7,h*.68],[w*.67,h*.695],[w*.58,h*.695]],"#5a3e28");haze(h*.6,"#ffffff","55")},
    ()=>{ridge(h*.4,26,27,24,R.far);
      poly([[w*.05,h*.22],[w*.95,h*.22],[w*.95,h*.58],[w*.05,h*.58]],"#b6ab95");rect(w*.05,h*.22,w*.9,h*.02,"#a39782");
      pointArch(w*.18,h*.32,w*.3,h*.26,"#6f6553");pointArch(w*.56,h*.36,w*.2,h*.22,"#6f6553");
      rect(w*.24,h*.42,w*.18,h*.12,"#8a7f6a");water(h*.6,"#a9cfc6","#4a7a70");
      c.globalAlpha=.35;pointArch(w*.18,h*.6,w*.3,h*.12,"#6f6553");c.globalAlpha=1;
      const r=srand(14);for(let i=0;i<6;i++)poplar(w*(i<3?.02+i*.03:.86+(i-3)*.04),h*.6,18+r()*8,"#2f5a48")},
    ()=>{poly([[-10,h*.68],[w*.15,h*.3],[w*.35,h*.18],[w*.55,h*.24],[w*.75,h*.2],[w+10,h*.4],[w+10,h*.7]],"#8f9a8c");
      poly([[w*.35,h*.18],[w*.45,h*.4],[w*.3,h*.66],[w*.15,h*.3]],"#7a8676");
      rect(w*.42,h*.42,w*.16,h*.07,"#aab3a4");rect(w*.43,h*.43,w*.14,h*.05,"#97a091");
      haze(h*.62,"#ffffff","88");ridge(h*.7,16,28,22,R.mid);
      const r=srand(15);for(let i=0;i<5;i++){const x=w*(.6+i*.08),y=h*.78;rect(x-2,y-30,4,30,"#3e4a36");for(let k=0;k<10;k++){c.strokeStyle="#6f9a6a";c.lineWidth=2;c.beginPath();c.moveTo(x,y-30);c.quadraticCurveTo(x+(k-5)*5,y-36,x+(k-5)*6,y-8);c.stroke()}}
      ridge(h*.86,10,29,18,R.near)},
    ()=>{c.fillStyle=lg(0,h,["#6b4a34","#3a281c"]);c.fillRect(0,0,w,h);
      const vx=w*.5,vy=h*.48;for(let i=6;i>=0;i--){const s=.18+i*.14,ww=w*s,hh=h*s*.9,x=vx-ww/2,y=vy-hh*.6;c.fillStyle=i%2?"#8a6446":"#9c7350";c.beginPath();c.moveTo(x,y+hh);c.lineTo(x,y+hh*.35);c.quadraticCurveTo(x+ww/2,y-hh*.1,x+ww,y+hh*.35);c.lineTo(x+ww,y+hh);c.lineTo(x+ww*.92,y+hh);c.lineTo(x+ww*.92,y+hh*.38);c.quadraticCurveTo(x+ww/2,y+hh*.02,x+ww*.08,y+hh*.38);c.lineTo(x+ww*.08,y+hh);c.closePath();c.fill();
        c.fillStyle="rgba(255,240,200,.22)";poly([[vx-ww*.05,y],[vx+ww*.05,y],[vx+ww*.2,y+hh],[vx-ww*.2,y+hh]],"rgba(255,240,200,.08)")}
      rect(0,h*.78,w,h*.22,"#4a3324");const kc=["#b23a3a","#2f4f8a","#d4a23a","#7a2f5a","#2f7a5a"],r=srand(16);
      for(let i=0;i<5;i++){const x=i<3?w*(.02+i*.08):w*(.78+(i-3)*.1),y=h*(.5+r()*.1);rect(x,y,w*.07,h*.18,kc[i]);for(let k=0;k<4;k++)poly([[x+w*.035,y+h*(.03+k*.04)],[x+w*.06,y+h*(.05+k*.04)],[x+w*.035,y+h*(.07+k*.04)],[x+w*.01,y+h*(.05+k*.04)]],"#f3e2c0")}
      for(let i=0;i<4;i++)circ(w*(.3+i*.13),h*.8,w*.035,"#c98a4a")},
    // ---- Rojava
    ()=>{ridge(h*.45,30,32,26,R.far);haze(h*.48,R.sky[2]);ridge(h*.55,18,33,22,R.mid);
      water(h*.62,"#d98a6a","#3a2a3a");
      c.fillStyle="#4a3a3a";c.beginPath();c.moveTo(w*.18,h*.66);c.lineTo(w*.18,h*.5);c.quadraticCurveTo(w*.18,h*.32,w*.45,h*.3);c.quadraticCurveTo(w*.72,h*.32,w*.72,h*.5);c.lineTo(w*.72,h*.66);c.lineTo(w*.64,h*.66);c.lineTo(w*.64,h*.5);c.quadraticCurveTo(w*.64,h*.38,w*.45,h*.37);c.quadraticCurveTo(w*.26,h*.38,w*.26,h*.5);c.lineTo(w*.26,h*.66);c.closePath();c.fill();
      rect(w*.1,h*.62,w*.12,h*.05,"#3a2c2c");rect(w*.68,h*.62,w*.14,h*.05,"#3a2c2c");ridge(h*.88,10,34,16,R.ground)},
    ()=>{c.fillStyle=lg(h*.55,h,["#e9b862","#b07a32"]);c.fillRect(0,h*.58,w,h*.42);
      c.strokeStyle="rgba(120,70,20,.35)";c.lineWidth=1;const r=srand(17);for(let i=0;i<120;i++){const x=r()*w,y=h*(.6+r()*.4);c.beginPath();c.moveTo(x,y);c.lineTo(x+1,y-6-r()*8);c.stroke()}
      c.fillStyle="#a8744a";c.beginPath();c.ellipse(w*.45,h*.6,w*.38,h*.12,0,Math.PI,0);c.fill();
      for(let i=0;i<6;i++)rect(w*(.38+i*.012),h*(.5+i*.017),w*.12-i*w*.024,h*.012,"#c9925e");rect(w*.2,h*.53,w*.12,h*.05,"#8e5e3a");
      tree(w*.86,h*.6,26,"#4a3a2a")},
    ()=>{ridge(h*.48,20,35,26,R.far);haze(h*.5,R.sky[2]);
      c.fillStyle="#9a6a55";c.beginPath();c.ellipse(w*.55,h*.56,w*.5,h*.08,0,Math.PI,0);c.fill();
      rect(w*.18,h*.4,w*.64,h*.2,"#8a6a58");rect(w*.4,h*.45,w*.2,h*.15,"#3a2a2a");
      [.22,.3,.62,.7].forEach((x,i)=>{rect(w*x,h*.5,w*.07,h*.1,"#1e1a1e");ell(w*x+w*.035,h*.49,w*.03,h*.022,"#1e1a1e");rect(w*x+w*.005,h*.53,w*.06,h*.004,"#3a3438")});
      water(h*.66,"#c98a7a","#3a2632");const r=srand(18);c.strokeStyle="#4a5a32";c.lineWidth=2;for(let i=0;i<40;i++){const x=r()*w,y=h*(.66+r()*.02);c.beginPath();c.moveTo(x,y);c.lineTo(x,y-14-r()*14);c.stroke()}
      poplar(w*.9,h*.66,22,"#3a3a2a");poplar(w*.06,h*.66,20,"#3a3a2a")},
    ()=>{ridge(h*.5,24,36,26,R.far);haze(h*.52,R.sky[2]);
      const h1=ridge(h*.58,30,37,24,"#a0583e"),h2=ridge(h*.72,26,38,22,"#8a4a34");
      const r=srand(19);[h1,h2].forEach((pts,k)=>pts.forEach((p,i)=>{if(i%1==0)for(let j=0;j<2;j++){const y=p[1]+10+j*h*.05;circ(p[0]+(j%2)*10,y,10+k*4,k?"#4a5a2e":"#5e6c38");rect(p[0]+(j%2)*10-1.5,y,3,8+k*3,"#3a2a1a")}}));
      rect(w*.75,h*.55,w*.1,h*.04,"#d9c4a0");poly([[w*.74,h*.55],[w*.8,h*.52],[w*.86,h*.55]],"#a0583e");ridge(h*.9,10,39,16,R.ground)},
    ()=>{ridge(h*.48,26,40,26,R.far);haze(h*.5,R.sky[2]);
      poly([[-10,h*.66],[w*.2,h*.4],[w*.8,h*.4],[w+10,h*.66]],R.mid);
      for(let i=0;i<8;i++){c.strokeStyle=i%2?"#c49a7a":"#b0866a";c.lineWidth=h*.012;c.beginPath();c.ellipse(w*.5,h*.62,w*(.38-i*.035),h*(.2-i*.018),0,Math.PI,0);c.stroke()}
      rect(w*.32,h*.6,w*.36,h*.03,"#9a7058");
      water(h*.74,"#d98a6a","#3a2232");c.fillStyle="#8a6a58";c.fillRect(w*.05,h*.7,w*.9,h*.025);
      for(let i=0;i<4;i++){c.fillStyle="#3a2232";c.beginPath();c.arc(w*(.16+i*.22),h*.76,w*.08,Math.PI,0);c.fill()}
      const r=srand(20);for(let i=0;i<40;i++)circ(r()*w,h*(.88+r()*.1),2+r()*2,["#ffd36b","#ff8fa3","#ffffff"][i%3])}
  ];
  return{
    draw(ctx,W,H,i){c=ctx;w=W;h=H;const S=SCENES[i];R=REG[S.r];
      c.fillStyle=lg(0,h*.75,R.sky);c.fillRect(0,0,w,h);
      
      const [sx,sy]=S.sun,sr=Math.min(w,h)*.08,g=c.createRadialGradient(sx*w,sy*h,0,sx*w,sy*h,sr*6);g.addColorStop(0,R.sun+"bb");g.addColorStop(.3,R.sun+"44");g.addColorStop(1,R.sun+"00");c.fillStyle=g;c.fillRect(0,0,w,h);circ(sx*w,sy*h,sr,R.sun);
      D[i]();
      finish(sx*w,sy*h);
    }
  };
})();
const SCENES=[
  {n:"Çiyayê Agirî",r:0,sun:[.76,.3],pt:"snow",f:["Dünyanın sayılı yüksek dağlarından biri, 5.137 metre. Adı Kurmancîde 'ateşli dağ' anlamına gelir.","One of the world's great high mountains at 5,137 m. Its Kurmanji name means 'fiery mountain'.","Yek ji çiyayên bilind ên navdar ên cîhanê ye, 5.137 metre. Navê wî ji peyva 'agir' tê."]},
  {n:"Girava Axtamarê",r:0,sun:[.28,.3],pt:"petal",f:["Van Gölü'ndeki adada 10. yüzyıldan kalma Kutsal Haç Kilisesi bulunur.","The island in Lake Van holds the 10th-century Church of the Holy Cross.","Li girava Gola Wanê Dêra Xaça Pîroz heye, ku ji sedsala 10an maye."]},
  {n:"Çiyayê Nemrûdê",r:0,sun:[.82,.42],pt:"spark",f:["Kommagene Kralı I. Antiokhos'un MÖ 1. yüzyılda yaptırdığı tümülüs ve dev heykeller. UNESCO Dünya Mirası.","Tomb mound and giant statues built for King Antiochus I of Commagene in the 1st century BC. A UNESCO World Heritage Site.","Gora mezin û peykerên dêw ên Qralê Komagenê Antiyokhosê I, ji sedsala 1ê berî zayînê. Mîrateya Cîhanê ya UNESCOyê ye."]},
  {n:"Hesenkêf",r:0,sun:[.7,.28],pt:"bird",f:["Dicle kıyısında binlerce yıllık yerleşim. Tarihî kentin büyük kısmı 2020'de baraj suları altında kaldı.","A settlement on the Tigris for thousands of years. Most of the old town went under dam waters in 2020.","Bi hezaran sal e ku li ber çemê Dîcleyê jiyan heye. Piraniya bajarê kevn di 2020an de di bin ava bendavê de ma."]},
  {n:"Mêrdîn",r:0,sun:[.18,.24],pt:"spark",f:["Taş evleriyle Mezopotamya ovasına bakan şehir. Kürt, Süryani ve Arap kültürleri burada buluşur.","A city of carved stone houses overlooking the Mesopotamian plain, where Kurdish, Syriac and Arab cultures meet.","Bajarekî bi xaniyên kevirî ye ku li deşta Mezopotamyayê dinêre. Çandên kurdî, suryanî û erebî li vir digihêjin hev."]},
  {n:"Kela Hewlêrê",r:1,sun:[.8,.28],pt:"dust",f:["Erbil Kalesi, dünyada kesintisiz yerleşilen en eski yerlerden biri sayılır. 2014'ten beri UNESCO Dünya Mirası.","Erbil Citadel is counted among the oldest continuously inhabited places on Earth. A UNESCO site since 2014.","Kela Hewlêrê yek ji wan cihên herî kevn e ku mirov bê navber lê jiyane. Ji 2014an ve Mîrateya Cîhanê ya UNESCOyê ye."]},
  {n:"Geliyê Rewandizê",r:1,sun:[.5,.16],pt:"bird",f:["Derin kanyondan geçen yol, 1930'larda açılan tarihî Hamilton Yolu'nun parçasıdır.","The road through the gorge is part of the historic Hamilton Road, built in the 1930s.","Rêya ku di vî geliyê kûr re derbas dibe, beşek ji Rêya Hamiltonê ye ku di salên 1930an de hat vekirin."]},
  {n:"Amêdî",r:1,sun:[.8,.22],pt:"dust",f:["Dört yanı uçurum olan düz bir kaya platosunun üstüne kurulmuş tarihî kasaba.","A historic town built on a flat rock plateau with cliffs on every side.","Bajarokekî dîrokî ye ku li ser zinarekî pan hatiye avakirin; li her çar aliyên wî kendal hene."]},
  {n:"Laliş",r:1,sun:[.2,.26],pt:"dust",f:["Ezidilerin en kutsal tapınağı. Ziyaretçiler avluya yalınayak girer.","The holiest Yazidi sanctuary. Visitors enter its courtyards barefoot.","Perestgeha herî pîroz a êzidiyan e. Mêvan bi pêxwasî dikevin hewşa wê."]},
  {n:"Geliyê Elî Beg",r:1,sun:[.82,.16],pt:"mist",f:["Bölgenin en ünlü şelalelerinden biri, Rewandiz yakınında.","One of the region's best-known waterfalls, near Rawanduz.","Yek ji sûlavên herî navdar ên herêmê ye, li nêzî Rewandizê."]},
  {n:"Hewraman",r:2,sun:[.25,.2],pt:"mist",f:["Evlerin damı üstteki evin avlusudur. Hewraman 2021'de UNESCO Dünya Mirası oldu.","Each roof is the yard of the house above. Hawraman became a UNESCO World Heritage Site in 2021.","Banê her xaniyî hewşa xaniyê jor e. Hewraman di 2021an de ket lîsteya Mîrateya Cîhanê ya UNESCOyê."]},
  {n:"Gola Zrêbarê",r:2,sun:[.7,.3],pt:"mist",f:["Merîwan yakınında, meşe ormanlarıyla çevrili tatlı su gölü.","A freshwater lake near Marivan, surrounded by oak forests.","Golek ava şirîn e li nêzî Merîwanê; dora wê daristanên berûyan in."]},
  {n:"Taqwesan",r:2,sun:[.85,.14],pt:"leaf",f:["Kirmaşan'da kayaya oyulmuş Sasani dönemi kemerleri ve kabartmaları.","Sasanian-era arches and reliefs carved into the rock at Kermanshah.","Li Kirmaşanê kevan û nexşên dema Sasaniyan ku di nav zinar de hatine kolan."]},
  {n:"Bîsitûn",r:2,sun:[.85,.2],pt:"mist",f:["Pers Kralı I. Darius'un yazıtı burada. Çivi yazısının çözülmesinde önemli rol oynadı. UNESCO Dünya Mirası.","Home of King Darius I's inscription, key to deciphering cuneiform. A UNESCO World Heritage Site.","Nivîsara Qralê Farisan Dariyosê I li vir e; di xwendina nivîsa bizmarî de roleke mezin lîst. Mîrateya Cîhanê ya UNESCOyê ye."]},
  {n:"Sine",r:2,sun:[.5,.05],pt:"dust",f:["Senendec'in tarihî çarşısı el dokuması kilimleri ve müzik aletleriyle bilinir.","Sanandaj's old bazaar is known for hand-woven kilims and musical instruments.","Bazara kevn a Sineyê bi kilîm û xalîçeyên destçêkirî û amûrên muzîkê navdar e."]},
  {n:"Pira Eyndiwerê",r:3,sun:[.82,.38],pt:"ember",f:["Dicle üzerindeki Orta Çağ köprüsünden geriye kalan büyük kemer.","The great surviving arch of a medieval bridge over the Tigris.","Kevana mezin a ku ji pireke Serdema Navîn a li ser Dîcleyê maye."]},
  {n:"Girê Mozan",r:3,sun:[.25,.4],pt:"ember",f:["Antik Hurri kenti Urkêş'in kalıntıları. Tarihi MÖ 3. binyıla uzanır.","Ruins of the ancient Hurrian city of Urkesh, dating back to the 3rd millennium BC.","Bermahiyên bajarê kevnar ê Hûriyan, Urkêş. Dîroka wê digihêje hezarsala 3an a berî zayînê."]},
  {n:"Girê Helef",r:3,sun:[.8,.34],pt:"ember",f:["Halaf kültürüne adını veren höyük. Ünlü boyalı çanak çömlekleri MÖ 6. binyıldan.","The mound that named the Halaf culture, famous for painted pottery from the 6th millennium BC.","Ev gir navê xwe da çanda Helefê; firaxên wê yên boyaxkirî ji hezarsala 6an a berî zayînê ne."]},
  {n:"Efrîn",r:3,sun:[.2,.36],pt:"petal",f:["Bölgenin zeytini, zeytinyağı ve sabunu yüzyıllardır ünlüdür.","The region's olives, olive oil and soap have been famous for centuries.","Zeytûn, rûnê zeytûnê û sabûna vê herêmê bi sedsalan e navdar in."]},
  {n:"Nebî Horî",r:3,sun:[.5,.34],pt:"ember",f:["Antik Kyrrhos kenti. Roma tiyatrosu ve hâlâ ayakta duran Roma köprüleriyle bilinir.","The ancient city of Cyrrhus, known for its Roman theatre and Roman bridges still standing.","Bajarê kevnar Kûrûs; bi şanoya Romayê û pirên Romayê yên ku hîn li ser piyan in navdar e."]}
];
