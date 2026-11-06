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

("06_lehceler", f"""Kürtçe, Kürtlerin yaşadığı coğrafyanın dört parçasında konuşulur: kuzeyde Bakur, güneyde Başûr, batıda Rojava ve doğuda Rojhilat. {B}
Kürtçenin başlıca lehçeleri şunlardır: {B}
Kurmancî, yani Kuzey Kürtçesi. En çok konuşulan lehçedir. Bakur ve Rojava'da, Başûr'un kuzeyinde, Rojhilat'ın bir kısmında ve Kafkasya'da konuşulur. {B}
Soranî, yani Orta Kürtçe. Başûr ve Rojhilat'ta yaygındır. {B}
Güney Kürtçesi. Kelhurî, Feylî ve Lekî bu grupta yer alır. {B}
Zazakî, ya da Kirmanckî ve Dimilî. Başta Dersim, Bingöl, Elazığ, Diyarbakır ve Siverek olmak üzere geniş bir bölgede konuşulur. {B}
Ve Goranî, ya da Hewramî. Klasik Kürt edebiyatının en eski yazı dillerinden biridir. Erdelan ve Baban saraylarında edebiyat dili olarak kullanılmıştır. {B}
Bu lehçe çeşitliliği, Kürtçeye büyük bir kelime zenginliği kazandırmıştır. Aynı kavram için farklı bölgelerde farklı kelimeler kullanılır. Ön ek ve son eklerle yeni kelimeler türetmek de son derece kolaydır. Doğaya, hayvancılığa, dağa ve tarıma dair kelime hazinesi, binlerce yıllık bir yaşam biçiminin dile yansımasıdır."""),

("07_petersburg", f"""Kürtçe, yaşadığı topraklarda ilerleyen yıllarda yasaklarla, inkârla ve baskıyla karşılaşacaktı. Oysa çok uzaklarda, Rus dilbilimciler daha on dokuzuncu yüzyılda bu dile büyük bir ilgi gösteriyordu. Sankt Peterburg, adeta bir Kürdoloji merkezi hâline gelmişti. {B}
Rus akademisyen Pyotr Lerh, bin sekiz yüz ellili yıllarda Kürtçe üzerine kapsamlı çalışmalar yayımladı. Rusya'nın Erzurum konsolosu Aleksandr Jaba ise, Kürt âlimlerle birlikte çalışarak çok sayıda Kürtçe el yazmasını topladı. Hazırladığı Kürtçe-Fransızca sözlük, bin sekiz yüz yetmiş dokuzda, Petersburg İmparatorluk Bilimler Akademisi tarafından yayımlandı. {B}
Petersburg'daki bu koleksiyonların en değerli eserlerinden biri, büyük Kürt şairi ve düşünürü Ehmedê Xanî'ye aittir. Xanî, bin altı yüz seksen üç yılında, çocukların dil öğrenmesi için manzum bir Kürtçe-Arapça sözlük yazdı: "Nûbihara Biçûkan", yani Çocukların İlkbaharı. Bu eserin el yazmaları bugün Petersburg'daki koleksiyonlarda korunmaktadır. {B}
Sovyet döneminde de bu gelenek sürdü. Margarita Rudenko gibi Kürdologlar, Xanî'nin ölümsüz eseri "Mem û Zîn"i inceleyip Rusçaya çevirdi ve Kürtçe el yazmalarını kataloglayarak gelecek kuşaklara aktardı."""),

("08_medreseler", f"""Yüzyıllar boyunca Kürt coğrafyasındaki medreseler, yalnızca dini eğitim veren kurumlar değildi. Bunlar aynı zamanda dil, edebiyat, mantık ve astronomi okullarıydı. Ders kitaplarının çoğu Arapça olsa da, eğitimin, anlatımın ve şerhin dili Kürtçeydi. {B}
Öğrenciler eğitime, Ehmedê Xanî'nin Nûbihar adlı eseriyle başlar; Melayê Cizîrî'nin Dîwan'ını ve Melayê Bateyî'nin Mewlûd'unu okurdu. Kürtçe, ilmin taşıyıcısı oldu. {B}
Bu medreseler İslam dünyasına büyük âlimler kazandırdı. Melayê Cizîrî, Feqiyê Teyran ve Ehmedê Xanî gibi şair ve düşünürler bu geleneğin içinden çıktı. Fatih Sultan Mehmed'in hocası Molla Gürani ve yakın dönemde, Mela Xelîl-ê Sêrtî gibi isimler de bu kökten beslendi. Kürtçe medreseler, dilin yazılı geleneğini yaşatan en önemli kalelerden biri oldu."""),

("09_bediuzzaman", f"""Bu medrese geleneğinin yetiştirdiği en tanınmış isimlerden biri de Bediüzzaman Said Nursi'dir. Bitlis'in Nurs köyünde doğan Said Nursi, eğitimini Kürtçe eğitim veren medreselerde aldı. {B}
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
