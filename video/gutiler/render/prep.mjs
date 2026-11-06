import fs from 'fs';
import { feature } from 'topojson-client';
const topo = JSON.parse(fs.readFileSync('node_modules/world-atlas/countries-50m.json'));
const fc = feature(topo, topo.objects.countries);
const out = [];
const r = v => Math.round(v*100)/100;
for (const f of fc.features) {
  const g = f.geometry; if (!g) continue;
  const polys = g.type === 'Polygon' ? [g.coordinates] : g.coordinates;
  const keep = [];
  for (const p of polys) {
    const ring = p[0];
    let minx=1e9,maxx=-1e9,miny=1e9,maxy=-1e9;
    for (const [x,y] of ring){minx=Math.min(minx,x);maxx=Math.max(maxx,x);miny=Math.min(miny,y);maxy=Math.max(maxy,y);}
    if (maxx<-15||minx>100||maxy<0||miny>65) continue;
    keep.push(ring.map(([x,y])=>[r(x),r(y)]));
  }
  if (keep.length) out.push({id:f.id, name:f.properties.name, rings:keep});
}
fs.writeFileSync('geo.js', 'window.GEO='+JSON.stringify(out)+';');
console.log(out.length, fs.statSync('geo.js').size);
