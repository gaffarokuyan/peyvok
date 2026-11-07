# Seslendirme metni (bolum bolum).
# Kurtce kelimeler Kurtce yazimiyla verilir; ElevenLabs bunlari yaklasik okur,
# dogru telaffuz splice_kurdish.py ile Mazdek kaydindan yerlestirilir.
# Sayilar ve bazi isimler TTS icin okunusa gore yazildi; altyazida render.py
# icindeki DISPLAY tablosu bunlari dogru yazima cevirir.
B = '<break time="0.8s" />'
BL = '<break time="1.5s" />'

SECTIONS = [
("01_giris", f"""Bir dil düşünün... {B}
Son yüz yıl boyunca yasaklandı. Okullarda konuşulması engellendi, kitapları toplatıldı, adı bile anılmak istenmedi. {B}
Ama o dil susmadı. {B}
Annelerin ninnilerinde, dengbêjlerin klamlarında, medreselerin loş odalarında yaşamaya devam etti. {B}
Baskıya, yasağa ve asimilasyona rağmen yok olmadı. {BL}
Bu dil, şüphesiz, Mezopotamya'nın kadim dili Kürtçedir. {B}
Bugün kırk milyonu aşkın insanın konuştuğu bu dilin kökenine, akrabalarına, kendine has gramerine ve onu yüzyıllardır yaşatan âlimlere birlikte bakalım."""),

("02_dil_ailesi", f"""Kürtçe, dünyanın en büyük dil ailesi olan Hint-Avrupa ailesinin bir üyesidir. Bu ailenin Hint-İran kolunun, İrani diller grubunda yer alır. Daha ayrıntılı bakıldığında, Kuzeybatı İrani diller dalına girer. {B}
En yakın akrabaları Beluççe ve Taliş dilidir. Farsça aynı aileden olsa da ayrı bir daldadır: Güneybatı İrani grubuna girer. Yani Kürtçe ile Farsça kardeş değil, kuzen sayılır. Peştuca ve Osetçe de bu geniş ailenin daha uzak üyeleridir. {B}
Bu ailenin tarihteki en ünlü kollarından biri de İskitlerdir. Türkiye'de bazı tarihçiler, zorlama bir iddiayla İskitleri Türk olarak gösterse de, bu görüş dilbilimsel kanıtlarla desteklenmez. İskitlerden kalan kişi adları, yer adları ve kelimeler, dillerinin Doğu İrani diller grubuna ait olduğunu gösterir. Bugün konuşulan Osetçe, İskit dilinin yaşayan torunu sayılır. {B}
Bu aile bağının izleri Avrupa dillerinde bile görülür. Kürtçe "stêr", yani yıldız kelimesi; İngilizce "star", Latince "stella" ile akrabadır. Kürtçe "nû", yani yeni kelimesi İngilizce "nyu" ile; "nav", yani isim kelimesi ise "neym" ile aynı kökten gelir."""),

("03_arkaik", f"""Kürtçe, kadim İrani dillerin pek çok eski özelliğini bugüne taşımıştır. {B}
Bazı dilbilimciler, Kürtçenin arkaik kelime dağarcığı bakımından, Farsçadan daha eski olabileceğini ileri sürer."""),

("04_eril_disil", f"""Kürtçenin en dikkat çekici özelliklerinden biri, dilbilgisel cinsiyettir. Özellikle Kurmancîde isimler, eril ya da dişil olarak ayrılır ve bu ayrım kelimelerin aldığı eklere yansır. {B}
"Kurê min": oğlum. Eril. {B}
"Keça min": kızım. Dişil. {B}
"Ez mêrî dibînim": adamı görüyorum. {B}
"Ez jinê dibînim": kadını görüyorum. {B}
Peki bu özellik diğer İrani dillerde var mı? Farsça, cinsiyet ayrımını yüzyıllar önce kaybetmiştir. Oysa Eski Farsça ve Avestçede bu ayrım vardı. {B}
Bugün cinsiyet ayrımını koruyan diller arasında Kürtçenin Kurmancî, Zazakî ve Goranî lehçeleri; ayrıca Peştuca ve bazı Orta İran lehçeleri bulunur. Kürtçe, Farsçanın kaybettiği bu eski mirası bugün de yaşatıyor. {B}
Kürtçe gramerinin bir başka ilginç yönü, ergatif yapıdır. Geçmiş zamanda geçişli fiillerde cümlenin kurgusu tamamen değişir. Bu, dünyada oldukça az dilde görülen bir özelliktir."""),

("05_seslenme", f"""Kürtçede birine seslenirken, ismin sonuna bir ek gelir. {B}
"Kuro, were!": Oğlan, gel! {B}
"Bavo!": Baba! {B}
"Keçê!": Kız! {B}
"Hevalno!": Arkadaşlar! {B}
Dilbilimde buna vokatif, yani seslenme hâli denir. Erkeklere "o", kadınlara "ê", çoğula ise "no" eki gelir. {B}
Bu küçük ek, aslında büyük bir şeyi gösterir. Seslenme hâli, Hint-Avrupa ana dilinden gelen çok eski bir dilbilgisi özelliğidir. Farsça gibi pek çok dil bu ekleri kaybetmiş, yerine "ey" gibi ayrı bir kelime koymuştur. Kürtçe ise bu eki binlerce yıl korumuştur. Bu, Kürtçenin arkaik karakterinin en canlı kanıtlarından biridir."""),

("06_lehceler", f"""Kürtler, kuzeyde Bakur, güneyde Başûr, batıda Rojava ve doğuda Rojhelat'ta yaşar. {B}
Kürt nüfusu için resmî bir sayım bulunmuyor. Tahminlere göre Bakur'da yirmi üç ila yirmi beş milyon, Rojhelat'ta sekiz ila on milyon, Başûr'da altı ila sekiz milyon, Rojava'da ise iki ila üç milyon Kürt yaşıyor. Kafkasya, Orta Asya ve diasporayla birlikte, toplam nüfusun kırk ila elli milyon arasında olduğu tahmin ediliyor. {B}
Kürtçenin başlıca lehçeleri şunlardır: {B}
Kurmancî, yani Kuzey Kürtçesi. En çok konuşulan lehçedir. Bakur ve Rojava'da, Başûr'un kuzeyinde, Rojhelat'ın bir kısmında ve Kafkasya'da konuşulur. {B}
Soranî, yani Orta Kürtçe. Başûr ve Rojhelat'ta yaygındır. {B}
Güney Kürtçesi. Kelhurî, Feylî ve Lekî bu grupta yer alır. {B}
Zazakî, ya da Kirmanckî ve Dimilî. Başta Dersim, Çewlîg, Xarpêt, Amed ve Sêwreg olmak üzere geniş bir bölgede konuşulur. {B}
Ve Goranî, ya da Hewramî. Klasik Kürt edebiyatının en eski yazı dillerinden biridir. Erdelan ve Baban saraylarında edebiyat dili olarak kullanılmıştır. {B}
Bu lehçe çeşitliliği, Kürtçeye büyük bir kelime zenginliği kazandırmıştır. Aynı kavram için farklı bölgelerde farklı kelimeler kullanılır. Ön ek ve son eklerle yeni kelimeler türetmek de son derece kolaydır. Doğaya, hayvancılığa, dağa ve tarıma dair kelime hazinesi, binlerce yıllık bir yaşam biçiminin dile yansımasıdır."""),

("07_petersburg", f"""Kürtçe, yaşadığı topraklarda ilerleyen yıllarda yasaklarla, inkârla ve baskıyla karşılaşacaktı. Oysa çok uzaklarda, Rus dilbilimciler daha on dokuzuncu yüzyılda bu dile büyük bir ilgi gösteriyordu. Sankt Peterburg, adeta bir Kürdoloji merkezi hâline gelmişti. {B}
Rus akademisyen Pyotr Lerh, Kırım Savaşı sırasında esir düşen Kürtlerle görüşerek Kürtçenin gramerini ve folklorunu derledi. Bin sekiz yüz elli yedide yayımladığı çalışmalarla Kürt dilini ve şairlerini Avrupa'ya tanıttı. {B}
Rusya'nın Erzurum konsolosu Aleksandr Jaba ise, Kürt âlim Mela Mehmûdê Bazîdî ile birlikte çalışarak çok sayıda Kürtçe el yazmasını topladı. Mela Mehmûdê Bazîdî, Jaba'nın teşvikiyle Kürt şairlerinin hayatlarını anlatan ilk çalışmalardan birini yazdı. Ayrıca Kürtlerin örf ve âdetlerini anlatan, Kürtçe nesrin ilk örneklerinden sayılan bir eser kaleme aldı. Jaba'nın Kürtçe-Fransızca sözlüğü ise bin sekiz yüz yetmiş dokuzda, Petersburg İmparatorluk Bilimler Akademisi tarafından yayımlandı. {B}
Bu koleksiyonlar sayesinde klasik Kürt edebiyatının en değerli eserleri bugüne ulaştı. Ehmedê Xanî'nin "Mem û Zîn"i, bin altı yüz seksen üçte çocuklar için yazdığı "Nûbihara Biçûkan" ve inanç risalesi "Eqîdeya Îmanê"nin el yazmaları bugün Sankt Peterburg'da korunuyor. Feqiyê Teyran'a atfedilen "Qewlê Hespê Reş"in el yazmaları da bu koleksiyonlarda yer alıyor. {B}
Yirminci yüzyılda bu ilgi kurumsallaştı. İosif Orbeli, bin dokuz yüz on altıda Petersburg Üniversitesi'nde Kürtçe derslerini başlatarak Kürdolojiyi akademik bir disiplin hâline getirdi. Rus kökenli tarihçi Vladimir Minorski ise İslam Ansiklopedisi'nin "Kürtler" maddesini yazdı ve Kürt tarihi üzerine dünya çapında bir otorite kabul edildi. {B}
Sovyet döneminde de bu gelenek sürdü. Kürtçe için Latin harfli bir alfabe hazırlandı ve "Riya Teze" gazetesi yayımlanmaya başladı. Erebê Şemo'nun bin dokuz yüz otuz beşte Erivan'da yayımlanan "Şivanê Kurmanca"sı, ilk Kürtçe romanlardan biri sayılır. Leningrad'da Kürt dilbilimci Qanatê Kurdo, Kürtçe gramer ve sözlük çalışmalarıyla bu okulun öncülerinden oldu. Margarita Rudenko, bin dokuz yüz altmış birde Kürtçe el yazmalarının kataloğunu hazırladı; "Mem û Zîn"i ve Feqiyê Teyran'ın eserlerini Rusçaya çevirdi, Kürt halk masallarını da derleyip yayımladı. Bugün Rusya Bilimler Akademisi Doğu Yazmaları Enstitüsü, bu mirası korumaya devam ediyor. {B}
Kürt edebiyatına sahip çıkan yalnızca Rusya değildi. İtalyan misyoner Maurizio Garzoni, bin yedi yüz seksen yedide Roma'da ilk Kürtçe gramer ve sözlüğü yayımladı. Alman dilbilimciler Albert Sotsin ve Eugen Prym, Kürt halk anlatılarını derledi. Ferdinand Yusti Kürtçe bir gramer yazdı ve Jaba'nın sözlüğünü yayına hazırladı. {B}
Fransız şarkiyatçı Rojer Lesko, Celadet Bedirxan ile birlikte Kürtçe grameri hazırladı ve "Mem û Zîn"i yayımladı. Paris'teki Doğu Dilleri Okulu'nda Kamuran Bedirxan yıllarca Kürtçe dersleri verdi; bin dokuz yüz seksen üçte de Paris Kürt Enstitüsü kuruldu. {B}
İngiliz dilbilimci David Makenzi'nin Kürt lehçeleri üzerine çalışmaları bugün hâlâ temel kaynaktır. İsveç ise Kürtçe yayıncılığın en büyük destekçilerinden biri oldu: bin dokuz yüz yetmişlerden sonra İsveç'te yüzlerce Kürtçe kitap basıldı. {BL}
Güçlü bir bilim merkezi olmak işte böyle olur: Kendi dilin olmasa bile, bir halkın hafızasını kayıt altına alıp gelecek kuşaklara aktarabilmek. {B}
O dili yasaklamak, baskı altına almak değil."""),

("08_medreseler", f"""Yüzyıllar boyunca Kürt coğrafyasındaki medreseler, yalnızca dini eğitim veren kurumlar değildi. Bunlar aynı zamanda dil, edebiyat, mantık ve astronomi okullarıydı. Ders kitaplarının çoğu Arapça olsa da, eğitimin, anlatımın ve şerhin dili Kürtçeydi. {B}
Öğrenciler eğitime, Ehmedê Xanî'nin Nûbihar adlı eseriyle başlar; Melayê Cizîrî'nin Dîwan'ını ve Melayê Bateyî'nin Mewlûd'unu okurdu. Kürtçe, ilmin taşıyıcısı oldu. {B}
Bu medreseler İslam dünyasına büyük âlimler kazandırdı. Melayê Cizîrî, Feqiyê Teyran ve Ehmedê Xanî gibi şair ve düşünürler bu geleneğin içinden çıktı. Fatih Sultan Mehmed'in hocası Molla Gürani ve yakın dönemde, Mela Xelîl-ê Sêrtî gibi isimler de bu kökten beslendi. Kürtçe medreseler, dilin yazılı geleneğini yaşatan en önemli kalelerden biri oldu."""),

("09_bediuzzaman", f"""Bu medrese geleneğinin yetiştirdiği en tanınmış isimlerden biri de Bediüzzaman Said Nursi'dir. Bedlîs'in Nurs köyünde doğan Said Nursi, eğitimini Kürtçe eğitim veren medreselerde aldı. {B}
Doğu'da kurmayı hayal ettiği üniversite, Medresetüz Zehra için, dil formülünü şöyle koymuştu: {B}
"Arabi vacib, Kürdi caiz, Türki lazım." {B}
Yani: Arapça zorunlu, Kürtçe serbest, Türkçe gerekli. {B}
Said Nursi'nin Kürtçe yazıları da vardır. Bin dokuz yüz sekizde İstanbul'da yayımlanan Kürd Teavün ve Terakki Gazetesi'nde, Kürtçe bir makalesi çıkmıştır. {B}
Kürtçenin onun ilim hayatındaki yeri, en çarpıcı biçimde İşaratül İcaz tefsirinde görülür. Bu eser, Birinci Dünya Savaşı sırasında cephede yazıldı. Talebelerinin aktardığına göre Üstad, ayetleri önce yanındakilere Kürtçe olarak açıklıyor; talebesi Molla Habib de bu açıklamaları hızla Arapça olarak kâğıda geçiriyordu. {B}
Rivayet edilir ki Arapçanın tercih edilmesinin sebebi, o dönemde Allah'ın varlığını inkâr eden felsefi akımların hız kazanmasıydı. Üstad, tercümeye gerek kalmadan, İslam dünyasında çok daha fazla insana hızla ulaşmak istemişti. {B}
Sonraki yıllarda Said Nursi, eserlerinin çoğunu daha geniş bir kitleye ulaşmak için Osmanlı Türkçesiyle kaleme aldı. {B}
Ancak külliyatındaki derinlik, fikir dünyasının derinliğinden geliyordu. O fikir dünyasını besleyen kaynak ise, yıllarca içinde okuduğu, düşündüğü ve öğrettiği eğitim dili: Kürtçeydi."""),

("10_kapanis", f"""Antik çağlardan kalan kelimeleri, eril ve dişil ayrımı, seslenme ekleri, zengin lehçeleri ve köklü yazılı geleneğiyle Kürtçe, yalnızca bir iletişim aracı değildir. O, binlerce yıllık bir hafızadır. {B}
Ve bu hafıza, onu konuşan her ağızda yaşamaya devam ediyor. {BL}
"Ziman jiyan e." {B}
Dil, hayattır."""),
]
