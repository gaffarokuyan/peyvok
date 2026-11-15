import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)('playwright'); import path from 'path'; import fs from 'fs';
const views=JSON.parse(fs.readFileSync('../maps4k/views.json'));fs.mkdirSync('../maps4k/out',{recursive:true});
const b=await chromium.launch({args:['--allow-file-access-from-files']});const p=await b.newPage({viewport:{width:1280,height:720}});p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('file://'+path.resolve('maps4k.html'));await p.evaluate(v=>{window.VIEWS=v},views);
const names=process.argv.slice(2);const list=names.length?names:['genis_fiziki','genis_etiketli','genis_MO2200','mezopotamya_fiziki','mezopotamya_etiketli','dikey_etiketli'];
let i=1;for(const n of list){const d=await p.evaluate(n=>window.render(n,1),n);const f=`../maps4k/out/${String(i).padStart(2,'0')}_${n}.png`;fs.writeFileSync(f,Buffer.from(d.split(',')[1],'base64'));console.log(f);i++}
await b.close();
