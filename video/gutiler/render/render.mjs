import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)('playwright');
import { spawn } from 'child_process';
import path from 'path';
const [,, mode='video', a='0', b='30', out='../out/demo_silent.mp4'] = process.argv;
const browser = await chromium.launch({ args:['--allow-file-access-from-files'] });
const page = await browser.newPage({ viewport:{width:1920,height:1080}, deviceScaleFactor:1 });
page.on('console', m=>console.log('PAGE', m.text())); page.on('pageerror', e=>console.log('ERR', e.message));
await page.goto('file://'+path.resolve('index.html')); await page.evaluate(()=>window.ready);
const grab = async T => { const d = await page.evaluate(T=>{renderFrame(T);return document.getElementById('c').toDataURL('image/jpeg',.97)}, T); return Buffer.from(d.split(',')[1],'base64'); };
if (mode==='stills') { const fs=await import('fs'); for (const T of a.split(',').map(Number)) { fs.writeFileSync(`../out/still_${T}.jpg`, await grab(T)); } }
else {
  const FPS=30, N=Math.round((+b - +a)*FPS);
  const ff = spawn('ffmpeg',['-y','-loglevel','error','-f','image2pipe','-framerate',String(FPS),'-c:v','mjpeg','-i','-','-c:v','libx264','-preset','medium','-crf','15','-pix_fmt','yuv420p',out],{stdio:['pipe','inherit','inherit']});
  const t0=Date.now();
  for (let i=0;i<N;i++){ const buf=await grab(+a + i/FPS); if(!ff.stdin.write(buf)) await new Promise(r=>ff.stdin.once('drain',r)); if(i%90==0) console.log('frame',i,'/',N, ((Date.now()-t0)/1000).toFixed(1)+'s'); }
  ff.stdin.end(); await new Promise(r=>ff.on('close',r));
}
await browser.close();
