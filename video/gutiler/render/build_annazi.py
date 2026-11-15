k=open('kassit_nocap.html').read().split('\n')
head='\n'.join(k[:481]).replace('../../kassitler/timeline.js','../../annaziler/timeline.js')
parts=['film_core.js', 'film_map.js', 'film_scenes.js', 'film_people.js', 'film_langmenu.js', 'film_kassit.js', 'film_3d.js', 'portraits.js', 'film_annazi.js', 'film_shots_ann.js', 'film.js']
body='\n'.join(open(p).read() for p in parts)
post='\nObject.assign(SCENE,{court:sCourt,cavalry:sCavalry,clash:sClash,siege:sSiege,caravan:sCaravan,castle:sCastle,portrait:sPortrait,feud:sFeud,org:sOrg,houses:sHouses});\n'
open('annazi.html','w').write(head+'\n'+body+post+'</script></body></html>\n')
