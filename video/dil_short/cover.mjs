import { createRequire } from 'module'; const { chromium } = createRequire('/home/user/peyvok/video/gutiler/render/x.js')('playwright'); import path from 'path'; import fs from 'fs';
const b = await chromium.launch({ args: ['--allow-file-access-from-files'] }); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } }); p.on('pageerror', e => console.log('ERR', e.message));
await p.goto('file://' + path.resolve('short2.html')); await p.evaluate(() => window.ready);
const d = await p.evaluate(() => { drawCover(); return cv.toDataURL('image/jpeg', .95) }); fs.writeFileSync('out/kurtce_mi_turkce_mi_kapak.jpg', Buffer.from(d.split(',')[1], 'base64')); await b.close();
