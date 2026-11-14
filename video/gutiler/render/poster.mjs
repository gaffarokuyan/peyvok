import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)('playwright');
import path from 'path'; import fs from 'fs';
const b = await chromium.launch({ args:['--allow-file-access-from-files'] }); const p = await b.newPage({viewport:{width:1080,height:1920}});
p.on('pageerror', e=>console.log('ERR', e.message));
await p.goto('file://'+path.resolve('poster.html')); await p.evaluate(()=>window.ready);
const d = await p.evaluate(()=>{drawPoster();return document.getElementById('c').toDataURL('image/png')});
fs.writeFileSync('../out/dirok_gutiler_kapak_9x16.png', Buffer.from(d.split(',')[1],'base64')); await b.close();
