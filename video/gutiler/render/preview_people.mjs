import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)('playwright'); import path from 'path'; import fs from 'fs';
const b=await chromium.launch({args:['--allow-file-access-from-files']});const p=await b.newPage({viewport:{width:1920,height:1080}});p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('file://'+path.resolve('film3.html'));await p.evaluate(()=>window.ready);
const out='/home/user/peyvok/video/gutiler/maps4k/out/';
const shots=[['council',{vote:1.5,elect:4},2.5,'onizleme_meclis_1'],['council',{vote:1.5,elect:4},5.5,'onizleme_meclis_2'],['governor',{step:.3,bow:2.4},2.0,'onizleme_vali_1'],['governor',{step:.3,bow:2.4,quote:[0,'“Gutium kralı Si’um zamanında”']},3.5,'onizleme_vali_2'],['map',{cam:[[0,44.5,34.5,14]],show:['akad','gut','lul','hur','elam'],cities:[['Akad',44.1,33.1,null,true],['Nippur',45.23,32.13],['Uruk',45.64,31.32]],year:'MÖ 2200'},2,'onizleme_harita_video']];
for(const [t,pp,lt,n] of shots){const d=await p.evaluate(([t,pp,lt])=>{window.previewScene(t,pp,lt);return document.getElementById('c').toDataURL('image/jpeg',.92)},[t,pp,lt]);fs.writeFileSync(out+n+'.jpg',Buffer.from(d.split(',')[1],'base64'));console.log(n)}
await b.close();
