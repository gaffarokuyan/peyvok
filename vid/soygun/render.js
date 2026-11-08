const {chromium}=require('playwright');const fs=require('fs'),path=require('path'),{spawn}=require('child_process');
(async()=>{const TM=JSON.parse(fs.readFileSync('timing.json'));const mode=process.argv[2]||'preview';
 const b=await chromium.launch({args:['--allow-file-access-from-files']});const p=await b.newPage({viewport:{width:1280,height:720}});
 p.on('pageerror',e=>console.log('ERR',e.message));p.on('console',m=>console.log('LOG',m.text()));
 await p.goto('file://'+path.resolve('scene.html'));await p.evaluate(async tm=>{setTM(tm);await document.fonts.load('900 40px N');await document.fonts.load('900 40px C');await document.fonts.ready},TM);
 const grab=async t=>{const d=await p.evaluate(t=>{render(t);return document.getElementById('c').toDataURL('image/jpeg',.93)},t);return Buffer.from(d.split(',')[1],'base64')};
 if(mode==='preview'){const ts=process.argv.slice(3).map(Number);for(const t of ts)fs.writeFileSync(`prev_${t}.jpg`,await grab(t));}
 else{const FPS=30,n=Math.round(TM.end*FPS);const ff=spawn('ffmpeg',['-y','-v','error','-f','image2pipe','-c:v','mjpeg','-r',''+FPS,'-i','-','-c:v','libx264','-preset','medium','-crf','18','-pix_fmt','yuv420p','video_only.mp4'],{stdio:['pipe','inherit','inherit']});
  for(let i=0;i<n;i++){const buf=await grab(i/FPS);if(!ff.stdin.write(buf))await new Promise(r=>ff.stdin.once('drain',r));if(i%150==0)console.log(i,'/',n)}
  ff.stdin.end();await new Promise(r=>ff.on('close',r))}
 await b.close()})();
