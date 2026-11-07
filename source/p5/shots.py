import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={"width":1400,"height":1000})
        errs=[];pg.on("pageerror",lambda e:errs.append(str(e)))
        js=open('scenes.js').read()
        html="<body style='margin:0;background:#000'><div id=g style='display:grid;grid-template-columns:repeat(10,135px);gap:4px'></div><script>"+js+"""
for(let i=0;i<20;i++){const c=document.createElement('canvas');c.width=135;c.height=292;document.getElementById('g').appendChild(c);SC.draw(c.getContext('2d'),135,292,i)}
</script></body>"""
        await pg.set_content(html);await pg.wait_for_timeout(500)
        await pg.screenshot(path='scenes.png',clip={"x":0,"y":0,"width":1390,"height":592});print(errs);await b.close()
asyncio.run(main())
