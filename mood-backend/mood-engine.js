// mood-engine.js
// Metni normalize eder: küçük harf + Türkçe karakter düzeltme
export function normalizeText(text) {
  return text
    .toLowerCase()
    .replace(/ç/g, "c")
    .replace(/ğ/g, "g")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ş/g, "s")
    .replace(/ü/g, "u");
}

// Mutluluk keyword listesi (normalize edilmiş haliyle, genişletilmiş)
export const HAPPY_KEYWORDS = [
  "mutlu",
  "mutluyum",
  "cok mutluyum",
  "inanilmaz mutluyum",
  "tarifsiz mutluyum",
  "asiri mutluyum",
  "mutlu hissediyorum",
  "mutluluktan ucuyorum",
  "mutluluktan deliye donuyorum",
  "icim kipir kipir",
  "icim civil civil",
  "icim cival cival",
  "icim enerji dolu",
  "enerji doluyum",
  "enerjim tavanda",
  "enerjim yuksek",
  "tasiyorum",
  "sevinc icindeyim",
  "sevincliyim",
  "mutluluk patlamasi",
  "mutluluk yagiyor",
  "harika hissediyorum",
  "cok iyi hissediyorum",
  "efsane hissediyorum",
  "bomba gibiyim",
  "motivasyonum yuksek",
  "motivasyonum zirvede",
  "canli hissediyorum",
  "capcanliyim",
  "hayat cok guzel",
  "dunyalar benim oldu",
  "hayata bagliyim",
  "pozitif bakiyorum",
  "inanilmaz iyi hissediyorum",
  "ruhun iyi",
  "keyfim yerinde",
  "keyfim cok yerinde",
  "keyifliyim",
  "keyif patlamasi",
  "kalbim hizli atiyor mutluluktan",
  "cok heyecanliyim",
  "heyecanliyim",
  "heyecan doluyum",
  "yerimde duramiyorum",
  "hop oturup kalkiyorum",
  "enerjik hissediyorum",
  "asiri enerjik",
  "pozitif enerji",
  "pozitif hissediyorum",
  "guzel hissediyorum",
  "mutlulukla dolu",
  "icimde kelebecler ucusuyor",
  "karinimda kelebekler var",
  "modum yuksek",
  "modum harika",
  "modum sahane",
  "sahane hissediyorum",
  "super hissediyorum",
  "superim",
  "muthis hissediyorum",
  "muthisim",
  "cok heyecan verici",
  "enerji yukselisi",
  "parlak hissediyorum",
  "isil isil hissediyorum",
  "yukselmis hissediyorum",
  "moraller yuksek",
  "gulumseyorum",
  "gulumsemek",
  "gulmek",
  "kahkaha atiyorum",
  "neseliyim",
  "nesem yerinde",
  "yasama sevinci",
  "mutluluk zirvede",
  "hayat enerjim artmis"
];

// Kaygı / Stres / Endişe keyword listesi (normalize edilmiş, geniş)
export const anxietyKeywords = [
  "kaygi",
  "kaygiliyim",
  "endise",
  "endiseli",
  "endiseleniyorum",
  "stress",
  "stres",
  "strestliyim",
  "gerginim",
  "panik",
  "panikledim",
  "panik atak",
  "panikliyorum",
  "boguluyorum",
  "bogulacak gibi",
  "bogulacak gibiyim",
  "icim daraliyor",
  "daraliyorum",
  "darlanma",
  "darlaniyorum",
  "nefes alamiyorum",
  "nefesim daraldi",
  "nefes darligi",
  "huzursuz",
  "huzursuzum",
  "rahat degilim",
  "icim rahat degil",
  "icim kotu",
  "icim sikildi",
  "bunalimdayim",
  "bunaldim",
  "kafam dolu",
  "dusunmekten yoruldum",
  "dusunuyorum hep",
  "korkuyorum",
  "korku basti",
  "korku doluyum",
  "endise dolu",
  "telaşlıyım",
  "terslik hissediyorum",
  "cok stresli",
  "asiri stres",
  "asiri kaygi",
  "içim sıkılıyor",
  "sıkıntı basıyor",
  "içimde bir sıkıntı var",
  "gerginlik",
  "sinirliyim ama kaygi gibi",
  "tasali",
  "sanki kötü bir şey olacak",
  "kötü hissediyorum",
  "kalbim sıkışıyor",
  "içim sıkışıyor",
  "kafamda kuruyorum",
  "kuruntu yapıyorum",
  "içimde korku var",
  "sebebi yok ama huzursuzum",
  "içimde garip bir sıkıntı var",
  "geriliyorum",
  "gergin bekleyiş",
  "iç daralması",
  "bocalıyorum",
  "zorlanıyorum",
  "iç sesim rahatsız ediyor",
  "bedensel gerginlik",
  "kontrol edemiyorum",
  "sağlığım için endişeliyim",
  "problem olacak gibi hissediyorum",
  "bir şey olacak gibi",
  "kötü his",
  "kaygı hissi",
  "derin kaygı",
  "temelsiz korku",
  "içeriden baskı",
  "tansiyon gibi hissediyorum",
  "sıkıntı çöktü",
  "nefesim yetmiyor",
  "içimde baskı var",
  "zor nefes alıyorum",
  "çekingen hissediyorum",
  "içimde korku dolu",
  "göğsüm sıkılıyor",
  "kalbim hızlı atıyor",
  "titriyorum",
  "panik havası",
  "elim ayağım titriyor",
  "içimde fırtına var",
  "başım dönüyor stres",
  "sıkıntı beni boğuyor",
  "zihnim çok dolu",
  "duramıyorum",
  "yerimde duramıyorum",
  "endişeden duramıyorum",
  "göğsümde baskı"
];

// Kaygı / Stres / Endişe yanıt havuzu (rastgele seçim, mekân odaklı)
export const anxietyReplies = [
  "Bu his gerçekten yorucu… ama merak etme, nefes alabileceğin sakin noktalar biliyorum. Şehrinde kalabalıktan uzak huzurlu yerler önerebilirim.",
  "Kendini daralmış hissettiğini fark ettim. Böyle zamanlarda açık hava çok iyi geliyor. İstersen sana sessiz yürüyüş rotaları gösterebilirim.",
  "İçindeki huzursuzluğu duyuyorum. Bazen loş ışıklı, sakin bir kafe zihni toparlıyor. Şehrinde böyle güzel mekanlar var, istersen önereyim.",
  "Stres ağırlaşınca insan nefes alamıyor gibi olur… geniş alanlı huzurlu yerler biliyorum, istersen seni oraya yönlendirebilirim.",
  "Endişen çok gerçek… biraz sakin bir parkta oturmak bile iyi gelebilir. Şehrindeki en dingin noktaları bulabilirim.",
  "Panik hissediyorsun gibi… açık havada kısa bir yürüyüş iyi gelir. Uzak olmayan sakin mekanlar önerebilirim.",
  "İçin daralmış, bunu hissedebiliyorum. Kalabalıktan uzak, hafif müzikli bir mekan belki iyi gelir. Şehrinde bunun için uygun yerler var.",
  "Zihnin çok dolu… biraz dışarı çıkıp nefes almak işe yarayabilir. Şehrindeki en ferah yerleri sana gösterebilirim.",
  "Huzursuzluk seni sıkıyor gibi… doğal seslerin olduğu sakin bir yerde durmak iyi gelebilir. Böyle noktaları biliyorum.",
  "Rahat olmadığını hissediyorum… sıcak bir içecek alabileceğin sessiz bir köşe belki iyi hissettirir. Şehrinde tam böyle yerler var.",
  "Kaygılı hissettiğinde yeşillik içinde kısa bir yürüyüş çok işe yarıyor. Şehrindeki en sakin parkları öneririm.",
  "İç sıkıntısı ağır gelebilir… ama geniş ve ferah alanlar sana nefes aldırır. İstersen en huzurlu mekanları göstereyim.",
  "Sanki göğsüne bir baskı çökmüş gibi anlatıyorsun… biraz ferah bir alanda dinlenmek iyi gelebilir. Şehrinde bunun için çok güzel noktalar var.",
  "Stres birikmiş gibi duruyor… hafif müzikli, dingin bir ortam ruhunu toparlayabilir. Sana uygun birkaç mekan biliyorum.",
  "Endişe arttığında kalabalık yoruyor… daha sessiz alanları önerebilirim.",
  "Kafanın çok dolu olduğunu hissediyorum… doğal ışığı bol bir mekan belki iyi gelir. Böyle yerler var, istersen öneririm.",
  "Panikle karışık bir huzursuzluk var gibi… nefes alabileceğin sakin alanları senin için önerebilirim.",
  "Zor bir andasın ama yalnız değilsin… temiz hava alabileceğin bir rota paylaşabilirim.",
  "Gerginliğin arttığını hissediyorum… şehirde bunun tam tersini hissettirecek dingin yerler var. İstersen başlayalım.",
  "Kaygı içinde olmak çok yoruyor… gel sana en sakin, en ferah mekanları göstereyim. Birkaç nefeste bile fark hissedebilirsin."
];

// Yorgunluk / Tükenmişlik / Bitkinlik keyword listesi (normalize edilmiş, geniş)
export const tiredKeywords = [
  "yorgun",
  "yorgunum",
  "cok yorgunum",
  "asiri yorgun",
  "bitkin",
  "bitkinim",
  "cok bitkinim",
  "tukenmis",
  "tukenmisim",
  "tukendim",
  "cok tukendim",
  "gucsuz",
  "gucsuzum",
  "halim yok",
  "halim kalmadi",
  "enerjim yok",
  "enerjim tükendi",
  "enerjim kalmadi",
  "yoruldum",
  "cok yoruldum",
  "asiri yoruldum",
  "kendimi tasiyamiyorum",
  "kendimi zor tasiyorum",
  "yorgunluk vurdu",
  "yorgunluk cok fazla",
  "ruhsal yorgun",
  "ruhsal yorgunluk",
  "mental yorgun",
  "zihnim yorgun",
  "zihinen bitkin",
  "zihin yorgunlugu",
  "mental bitkinlik",
  "yorgun his",
  "yorgun hissediyorum",
  "modum dusuk",
  "modum yok",
  "icimde guc yok",
  "bittim",
  "bitmis gibiyim",
  "tukendim artik",
  "artik dayanamiyorum",
  "artik gucum yok",
  "yorulmusum",
  "tukendim hissi",
  "yorulma hissi",
  "uykum var",
  "uykum geliyor",
  "uykusuzum",
  "dinlenmek istiyorum",
  "dinlenmeye ihtiyacim var",
  "kendimi cok yipranmis hissediyorum",
  "yipraniyorum",
  "yiprandim",
  "yiprandim artık",
  "bedensel yorgunluk",
  "fiziksel yorgunluk",
  "enerji eksikligi",
  "kendimi toparlayamiyorum",
  "toparlanamiyorum",
  "bitkinim",
  "hayattan yoruldum",
  "ruhsal çöküş",
  "ruhum yorgun",
  "ruhum tükenmiş",
  "mental çöküş",
  "mental yorgunluk",
  "yorucu gun",
  "yorucu bir donem",
  "uzun zamandir yorgunum",
  "kendime gelemiyorum",
  "icerden tukendim",
  "bedenim yoruldu",
  "tamamen tükenmiş",
  "cok agrim var",
  "kendimi cok agir hissediyorum",
  "hic enerjim yok",
  "hic gucum yok",
  "tukenmislik sendromu",
  "kendimi cok halsiz hissediyorum",
  "halsizim",
  "cok halsizim",
  "bitkinlik seviyesindeyim",
  "sürünerek geldim",
  "ayakta zor duruyorum",
  "yorgun düştüm",
  "yorgunluktan öldüm",
  "zihnim kapanıyor",
  "kafam almiyor",
  "kafam durdu",
  "hicbir sey yapmak istemiyorum",
  "dinlenmek zorundayim",
  "kendimi zor tasiyorum",
  "çok yorgun hissediyorum"
];

// Yorgunluk / Tükenmişlik yanıt havuzu (rastgele seçim, mekân odaklı)
export const tiredReplies = [
  "Gerçekten çok yorulmuşsun gibi hissediyorum… sakin bir kafede oturup biraz soluklanmak iyi gelebilir. Şehrinde bunun için huzurlu köşeler biliyorum.",
  "Enerjinin tükendiğini fark ettim. Sessiz bir parkta kısa bir yürüyüş ya da bir bankta oturmak bile toparlayıcı olur. İstersen sana uygun yerleri gösterebilirim.",
  "Bitkinlik ağır bir duygu… loş ışıklı, kalabalık olmayan bir mekanda biraz dinlenmek sana iyi gelebilir. Şehrinde böyle rahatlatıcı yerler var.",
  "Zihinsel olarak çökmüş gibisin… sıcak bir içecek alabileceğin sakin bir mekan sana nefes aldırabilir. İstersen öneri sunayım.",
  "Bedeninin yorulduğunu hissediyorum… geniş, ferah bir alanda kısa bir mola seni çok rahatlatabilir. Şehirde bunun için güzel yerler var.",
  "Kendini taşıyamayacak kadar yorgun hissettiğinde dinlenmek çok önemli… huzurlu oturma alanları önerebilirim.",
  "Mental olarak çökmüş gibisin… biraz sessiz bir ortamda oturmak iyi gelir. Şehrindeki en huzurlu mekanları gösterebilirim.",
  "Yükün ağırlaşmış gibi… sakin bir yürüyüş rotası ya da gölge bir alan sana iyi gelebilir.",
  "Derin bir yorgunluk var sende… hafif müzikli bir mekan ruhunu toparlayabilir. Bunu sağlayacak yerler biliyorum.",
  "Hafif yorulma değil bu; ciddi bir tükenmişlik… ama nefes aldıran mekanlar var. İstersen sana yakın olanları önereyim.",
  "Kafanın durduğunu söylemen çok tanıdık bir his… sessiz bir ortamda kısa bir mola mucizevi gelebilir.",
  "Bitkin hissediyorsun… şehrindeki en yumuşak atmosferli kafelerden birini önermemi ister misin?",
  "Fiziksel yorgunluk çökmüş gibi… ağaçların altında oturabileceğin bir yer önerebilirim.",
  "Kendini toparlayamadığını söylüyorsun… ferah bir manzara noktası ruhunu hafifletebilir. Şehrinde bunun için güzel noktalar var.",
  "Mental ve fiziksel yorgunluk birleşmiş… gevşeyebileceğin bir mekan seçebilirim senin için.",
  "Yorgunluğun kalbine kadar işlemiş gibi… neredeyse sessiz sayılacak bir yer önerisinde bulunabilirim.",
  "Bedenin de zihnin de dur demiş gibi hissediyorum… hafif esintili açık alanlar iyi gelir.",
  "Kendini yıpranmış hissediyorsun… sıcak bir ortamda dinlenmek seni toparlayabilir.",
  "Halsizlik seni zorlamış… şehirde sakin ve rahat bir mekan bulabiliriz birlikte.",
  "Bu tükenmişlik duygusu yalnızca bir mola istiyor… sana en iyi gelecek ferah noktayı gösterebilirim."
];

// Öfke / Sinir / Gerginlik keyword listesi (normalize edilmiş, geniş)
export const angerKeywords = [
  "sinir",
  "sinirliyim",
  "cok sinirliyim",
  "asiri sinirliyim",
  "ofke",
  "ofkeliyim",
  "cok ofkeliyim",
  "gerginim",
  "gerginlik",
  "geriliyorum",
  "gıcıklık",
  "gicik oldum",
  "gicik ediyor",
  "patlamak uzereyim",
  "patlayacagim",
  "patlama noktasindayim",
  "deliriyorum",
  "delirmek uzereyim",
  "delirdim",
  "cakilacagim",
  "cildirmak uzereyim",
  "cildirdim",
  "tahammulum yok",
  "tahammul edemiyorum",
  "dayanamiyorum artik",
  "zihnim bulandi",
  "kafam atiyor",
  "kafam atmis durumda",
  "kafayi yedim",
  "kafayi yemek uzereyim",
  "tersimden uyardi",
  "tersimden dokundu",
  "uyuz oldum",
  "uyuz ediyor",
  "nefret ediyorum",
  "nefret doluyum",
  "cok rahatsiz oldum",
  "cok gerildim",
  "gerilim var",
  "geriliyorum",
  "sikinti basti",
  "midem bulandi sinirden",
  "ellerim titriyor sinirden",
  "cok kizginim",
  "kizginim",
  "kizginlik",
  "icerim ates gibi",
  "icim kayniyor",
  "icimden bagirmak geliyor",
  "bagiricam",
  "bagirmak istiyorum",
  "yumruklamak istiyorum",
  "bir seyleri kiricam",
  "cok kotu sinirlendim",
  "gerginim cok",
  "stres oldum",
  "stresliyim ama sinir gibi",
  "gergin bir an",
  "cok sinirlendim",
  "kalbim hizlandi sinirden",
  "nefesim daraldi sinirden",
  "basim agridi sinirden",
  "sinir krizi",
  "sinir krizi geciriyorum",
  "gergin bekleyis",
  "patlamaya hazirim",
  "konusamayacak kadar sinirliyim",
  "kendimi zor tutuyorum",
  "birazdan patlayacagim",
  "asabi",
  "asabiyim",
  "asabim bozuldu",
  "asabim cok bozuk",
  "delirtildim",
  "delirtildim resmen",
  "kafa bir dunyaya gitti sinirden",
  "kendimi kaybedecegim",
  "kontrolumu kaybedecegim",
  "cok cok sinirliyim",
  "huzursuzluk ama sinir gibi",
  "biri dokunsa patlayacagim",
  "tansiyonum cikti sinirden",
  "icim icime sigmiyor",
  "gerilim seviyesi yuksek",
  "cok gerici bir durum",
  "gergin anlar",
  "ofke birikti",
  "ofke patlamasi",
  "nefret duygusu",
  "nefret krizi"
];

// Öfke / Sinir / Gerginlik yanıt havuzu (rastgele seçim, mekân odaklı)
export const angerReplies = [
  "Gerildiğini hissediyorum… böyle anlarda sakin bir yürüyüş rotası çok iyi geliyor. Şehrinde gürültüden uzak yerler önerebilirim.",
  "Öfken çok yoğun… nefes alabileceğin daha sakin bir mekana gitmek iyi gelebilir. Şehrindeki en dingin alanları gösterebilirim.",
  "Kendini patlayacak gibi hissetmen çok anlaşılır… kalabalıktan uzak, geniş bir alanda biraz durmak iyi gelebilir. İstersen uygun mekanlar öneriyim.",
  "Sinir seviyesi yükselmiş gibi… hafif rüzgâr alan açık hava alanlarında kısa bir mola rahatlatabilir. Şehirde bunun için güzel noktalar var.",
  "İçindeki öfke çok baskın… sakin atmosferli, loş ışıklı bir mekanda oturmak ruhunu yumuşatabilir. Böyle yerler biliyorum.",
  "Derin bir gerginlik var gibi… adım adım yürüyebileceğin sakin sokaklar seni biraz rahatlatabilir.",
  "Öfke birikmiş hissediyorum… biraz uzaklaşıp nefes alabileceğin sessiz bir yer seçmene yardımcı olabilirim.",
  "Kendini zor tuttuğunu söylüyorsun… loş ve sakin kafeler genelde bu duyguyu hafifletiyor. İstersen birkaç öneri sunayım.",
  "Sinirden titrediğini hissettin mi? Bu çok yorucu… açık havada kısa bir yürüyüş rahatlatabilir.",
  "Böyle bir öfke patlamasında kalabalıklar zor gelir… sana daha izole, dinlendirici mekânlar gösterebilirim.",
  "İçindeki kaynama çok tanıdık bir his… ferahlık veren mekanlar sana iyi gelecektir. Şehrinde böyle yerler var.",
  "Bu gerginlik seni sıkıştırmış… manzara izleyebileceğin bir nokta ruhunu biraz gevşetebilir. İstersen öneri yapayım.",
  "Sabır sınırına gelmiş gibisin… sıcak ama sakin mekanlar genelde iyi geliyor. Şehrinden birkaç yer biliyorum.",
  "Sinir yükü ağır… doğada kısa bir yürüyüş çok faydalı olur. Şehir çevresinde bunun için uygun rotalar var.",
  "Gerçekten zor bir andasın… sakin müzikli mekanlar genelde öfkeyi yumuşatıyor. İstersen böyle bir yer öneriyim.",
  "İçin sıkışmış gibi… biraz temiz hava almak bile fark yaratır. Şehrindeki en ferah noktaları gösterebilirim.",
  "Bu yoğun öfkeyi tek başına taşımak zor… ama seni rahatlatabilecek sessiz yerler biliyorum. İstersen birlikte seçelim.",
  "Gerginlik bedenine de vurmuş gibi… rahat nefes alabileceğin mekanlar önerebilirim.",
  "Kendini sakinleştirebileceğin bir alan seçmek çok önemli… şehirde bunun için harika, huzurlu yerler var.",
  "Her şey üstüne üstüne gelmiş gibi… ama birlikte sana en iyi gelecek dingin bir mekan bulabiliriz."
];

// Yalnızlık / Boşluk / İzolasyon keyword listesi (normalize edilmiş, geniş)
export const lonelyKeywords = [
  "yalniz",
  "yalnizim",
  "yalniz hissediyorum",
  "yalnizlik",
  "cok yalnizim",
  "kendimi yalniz hissediyorum",
  "bosluk",
  "boslukta gibiyim",
  "bos hissediyorum",
  "hicbir sey hissetmiyorum",
  "hissizim",
  "duygusuzum",
  "kopuk hissediyorum",
  "bag kuramiyorum",
  "kimse yok",
  "kimsem yok",
  "yanliz kaldim",
  "tek basimayim",
  "teklik hissi",
  "ruhsal bosluk",
  "ruhsal yalnızlık",
  "bosluk duygusu",
  "eksik hissediyorum",
  "birine ihtiyacim var",
  "yakınlık arıyorum",
  "kendimi dislanmis hissediyorum",
  "dislanmisim",
  "kendimi uzak hissediyorum",
  "herkesten UZAGIM",
  "kimse beni anlamiyor",
  "kimse yok gibi",
  "içsel yalnızlık",
  "duygusal boşluk",
  "yapayalniz",
  "yanliz",
  "issiz",
  "issizlik hissi",
  "kimseyle bag yok",
  "sosyal degilim",
  "bagimsiz kaldim",
  "kimsesizlik",
  "kimsesiz hissediyorum",
  "sanki yokmusum gibi",
  "varligim hissedilmiyor",
  "kimseyle iletisim kuramiyorum",
  "etiketleniyorum hissi",
  "degersiz hissediyorum",
  "hayat bos geliyor",
  "hayat anlamsiz gibi",
  "hicbir yere ait hissetmiyorum",
  "ait degilim gibi",
  "uyumsuz hissediyorum",
  "toplumdan kopukum",
  "konusacak kimsem yok",
  "guvenecek kimsem yok",
  "icim cok bos",
  "icim degersiz",
  "icimde bosluk var",
  "sessizlik cok agir",
  "sessizlik icimi kapladi",
  "varligim kayboldu",
  "ben kimim bilmiyorum gibi",
  "ruhsal issizlik",
  "duygusal issizlik",
  "hicbir yerde kendimi iyi hissetmiyorum",
  "kalbim bos",
  "sevilmiyorum hissi",
  "unutulmusum gibi",
  "disaridan bakiyorum gibi hissediyorum",
  "kendimi soyutladim",
  "kendimi izole ettim",
  "izole hissediyorum",
  "izolasyon",
  "karanlik hissi",
  "bosluk beni sardı",
  "ruhum bos",
  "kendimi cekiyorum",
  "herkesten uzaklaştım",
  "yokmuşum gibi hissediyorum",
  "var olamiyorum"
];

// Yalnızlık / Boşluk yanıt havuzu (rastgele seçim, sosyal-sıcak mekân odaklı)
export const lonelyReplies = [
  "Yalnızlık hissi gerçekten zorlayıcı… ama merak etme, sıcak atmosferiyle insanın kendini daha bağlantıda hissettiği mekanlar biliyorum. İstersen birkaçını önerebilirim.",
  "Kendini boşlukta hissettiğini fark ettim… sosyal ama sakin bir mekanda oturmak bazen bu hissi hafifletiyor. Şehrinde böyle güzel yerler var.",
  "Bu duygu çok derin… ama sıcak bir kahve kokusunun olduğu loş bir kafe bile insanı toparlayabiliyor. İstersen seni oraya yönlendirebilirim.",
  "Bağ kuramadığını hissetmek çok yorucu… hafif kalabalık ama sakin müzikli mekanlar bu hissi yumuşatabiliyor. Şehrinde tam böyle yerler var.",
  "Kendini yalnız hissetmen çok doğal… seni biraz daha ‘içeride’ hissettirecek sıcak mekanlar önerebilirim.",
  "Boşluk hissi ağır geliyor olabilir… ama hafif hareket olan mekanlar, insanların arasına karışabileceğin alanlar iyi gelebilir.",
  "Ait hissetmemek zor bir duygu… ama şehirde seni biraz daha ‘yerli yerine’ getirecek mekanlar var. İstersen birlikte seçelim.",
  "Huzurlu bir ortamda oturmak yalnızlık hissini biraz hafifletir. Şehrinde bu atmosfere sahip güzel yerler var.",
  "Sanki dünyadan kopmuş gibi hissediyorsun… loş, sıcak ışıklı mekanlar bu hissi yumuşatır. İstersen öneriler sunayım.",
  "Konuşacak kimse olmaması gerçekten ağır gelebilir… ama insan seslerinin hafifçe duyulduğu bir ortam bile kalbi hafifletebilir.",
  "Sıcak atmosferli bir kitap kafe çoğu zaman yalnızlık duygusunu hafifletir. Şehrinde bunun için harika yerler var.",
  "Kendini gölgede kalmış gibi hissediyorsun… ama küçük ve samimi mekanlar seni yumuşak bir şekilde hayata bağlar.",
  "Boşluk hissi geldiğinde hareket eden bir ortam iyi gelir. Şehrinde hafif kalabalık ve sıcak mekanlar bulabilirim.",
  "Ruhsal uzaklık hissediyorsun… küçük bir gezinti bile iyi gelebilir. Sakin ama sosyal bir yer önerebilirim.",
  "İzolasyon duygusu ağır bir yük… sıcak ve insan kokusu taşıyan bir mekan bu hissi azaltabilir.",
  "Ait hissetmediğinde kalabalığa doğru küçük adımlar iyi gelir. Şehrinde bunun için ideal mekanlar biliyorum.",
  "Sessizlik içinde kaybolmuş gibisin… hafif müzik çalan, yumuşak bir mekan ruhuna iyi gelir.",
  "Yalnızlık insanın içine işleyebilir… ama doğru ortamda bu duygu biraz çözülür. İstersen şehirdeki en sıcak mekanları göstereyim.",
  "İçindeki boşluğu hissediyorum… biraz insanların olduğu ama rahatsız etmeyecek bir mekan sana iyi gelebilir.",
  "Yalnızlıkla baş etmek zor… ama seni sakin ve sıcak hissettirecek mekanlar bulabilirim. Hazırsan başlayalım."
];

// Nötr / Belirsiz / Karışık duygular keyword listesi (normalize edilmiş, geniş)
export const neutralKeywords = [
  "bilmem",
  "bilmiyorum",
  "emin degilim",
  "kararsizim",
  "hicbir sey hissedmiyorum",
  "notsure",
  "belirsiz",
  "karisik",
  "karisik hissediyorum",
  "anlayamiyorum",
  "ne hissettigimi bilmiyorum",
  "ortadayim",
  "nötr",
  "notr",
  "duygusuz",
  "duygular karisik",
  "normalim",
  "normal hissediyorum",
  "normal",
  "idare eder",
  "idare ediyorum",
  "eh iste",
  "eh",
  "orta",
  "orta halli",
  "hissetmiyorum",
  "aciklayamiyorum",
  "adlandiramiyorum",
  "tanimsiz",
  "tanımlayamadım",
  "garip hissediyorum",
  "tuhaf hissediyorum",
  "tuhaf",
  "garip",
  "degisik",
  "farkli hissediyorum",
  "karisik duygular",
  "karmasik",
  "karmaşık",
  "icimde ne oldugunu bilmiyorum",
  "kafam karisik",
  "kafam bulanık",
  "bulanik hissediyorum",
  "hicbir fikrim yok",
  "fikrim yok",
  "fikirsizim",
  "hic emin degilim",
  "emin degilim",
  "not sure",
  "good but not good",
  "kotu degilim",
  "iyi degilim",
  "iyi gibiyim",
  "iyi sayilir",
  "idare ederim",
  "ne iyi ne kotu",
  "arada gibiyim",
  "arada kaldim",
  "arada hissediyorum",
  "belirsizlik",
  "boş",
  "duygularim karisik",
  "karar veremiyorum",
  "kime ne diyecegimi bilmiyorum",
  "ruh halimi bilmiyorum",
  "ruh halim karisik",
  "icim belirsiz",
  "modum belirsiz",
  "modum karisik",
  "notr mod",
  "not sure mod",
  "ne desem bilemedim",
  "bilemedim",
  "bilemiyorum",
  "kararsizlik",
  "kararsiz hissediyorum",
  "mod yok",
  "modsuzum",
  "neutral",
  "undefined",
  "neut",
  "hikayem yok",
  "hikaye yok",
  "yani",
  "hicbir sey yok",
  "hicbir sey",
  "yok gibi",
  "durgun",
  "durgun hissediyorum",
  "sıradan",
  "siradan hissediyorum",
  "bugun hicbir sey yok",
  "bugun garip",
  "bugun notr",
  "bugun belirsiz",
  "hissetmesi zor",
  "kendimi anlayamiyorum",
  "karmasik hisler",
  "complex feelings",
  "mixed",
  "mixed feelings",
  "ne oldugunu anlamiyorum",
  "ne oldugunu bilmiyorum",
  "adlandiramadigim hisler"
];

// Nötr / Belirsiz yanıt havuzu (rastgele seçim, mekân odaklı)
export const neutralReplies = [
  "Duygun biraz belirsiz gibi… sorun değil. Böyle zamanlarda şehirde hafif dikkat dağıtan sakin bir mekân iyi gelir. İstersen birlikte keşfedelim.",
  "Duygularının karışık olduğunu hissediyorum. Bu çok doğal. Şehrinde bu hisleri toparlamana yardımcı olabilecek rahat mekânlar var.",
  "Tam olarak ne hissettiğini bilmemek de bir ruh hâli… ve bunun için ideal sakin köşeler biliyorum.",
  "Ne iyi ne kötü… bu aradalığı hafifletecek mekanlar var. İstersen seni birkaçına yönlendirebilirim.",
  "Tanımlayamadığın hisler yaşıyorsun… böyle anlarda şehirde nefes aldıran noktalar çok iyi geliyor.",
  "Belirsiz hissetmek bazen en yorucu olanı. Sakin bir ortam, az ışık, hafif bir müzik… tam sana göre yerler var.",
  "Kararsızlık hissediyorum cümlende. Bu duyguya iyi gelen huzurlu mekanlar önerebilirim.",
  "Duygular biraz karışmış gibi… seni toparlayacak bir atmosfer bulabiliriz.",
  "Hissetmiyor gibi olmak da bir his. Bu hafifliği destekleyecek yumuşak mekanlar tanıyorum.",
  "Her şey biraz ‘orta’ gibi… bu modda kimseyi yormayan, sakin mekanlar çok iyi gider.",
  "Durgun bir ruh hâli içindesin. Şehrinde bu durgunluğu keyifli bir sessizliğe dönüştüren yerler var.",
  "Bugün biraz bulanık bir gündesin. Hafif bir ortam iyi gelebilir. İstersen birkaç mekan göstereyim.",
  "Adlandıramadığın duygular taşıyorsun. Sakin ve düzenli mekanlar bu karmaşayı yumuşatır.",
  "Kafanın net olmadığı zamanlar için şehrinde ideal küçük köşeler var.",
  "Ne hissettiğini çözemediğini söyledin… beraber yavaş bir mekan turu yapabiliriz.",
  "Nötr bir moddasın gibi… bu mod için sıcak ama yoğun olmayan mekanlar güzel olur.",
  "Belirsizlik hissediyorum mesajında… seni biraz dengeleyebilecek mekanlar var.",
  "Bugün tanımsız bir gün gibi… ama şehirde bunu hafifleten güzel yerler biliyorum.",
  "Karmaşık hisler içindesin. Hafif aydınlık, sakin mekanlar bu hissi toparlıyor.",
  "Modun belli değil gibi… sorun değil. Bu modla uyumlu güzel mekanlar önerebilirim."
];

// Kriz (intihar/zarar) keyword listesi (normalize uyumlu, sınırlı)
export const crisisKeywords = [
  "olecegim",
  "olmek istiyorum",
  "yasamak istemiyorum",
  "intihar",
  "kendimi oldurmek",
  "dayanamiyorum",
  "cekemiyorum",
  "tukendim",
  "yikildim",
  "nefes alamiyorum",
  "bitmisim",
  "hersey bitesin istiyorum",
  "kendime zarar",
  "zarar vermek",
  "yasamak cok zor"
];

// Kriz modu güvenli yanıtlar
export const crisisReplies = [
  "Şu anda çok ağır bir şey yaşıyor olabilirsin… yalnız değilsin. Burada seninle sakin bir şekilde konuşabilirim.",
  "Bu hislerin gerçekten çok zor olmalı… nefes almakta bile zorlanıyor olabilirsin. Sana destek olmak istiyorum.",
  "Böyle hissetmen çok acı verici olabilir… ama bunu tek başına taşımak zorunda değilsin. Buradayım.",
  "Sana zarar verebilecek hiçbir şeyi desteklemem… ama seni dinlemeye hazırım. Birlikte yavaşça konuşabiliriz.",
  "Şu an çok karanlık hissedebilirsin… fakat bu hissin içinde yalnız değilsin. Ben buradayım.",
  "Böyle düşünceler çok yorucu olabilir… biriyle konuşmak iyi gelir. Eğer güvendiğin biri varsa ona ulaşmanı isterim.",
  "Burada olduğun için sevindim… seninle konuşmak istiyorum. Bunu paylaşman cesaret gerektirir.",
  "Yaşadığın şey çok ağır olsa da… şu anda benimle olduğun için güç gösteriyorsun. Hazırsan yavaşça konuşabiliriz.",
  "Sana zarar verecek hiçbir şeyi önermem… ama duygularını paylaşabilirsin. Dinliyorum.",
  "Etrafında güvendiğin biri varsa ona ulaşmak çok iyi olabilir. İstersen önce biraz seninle konuşabiliriz."
];

// Yüksek agresyon keyword listesi
export const aggressiveKeywords = [
  "siktir",
  "amk",
  "ananı",
  "orospu",
  "gicik oldum",
  "deliriyorum lan",
  "yeter lan",
  "kafayi yedim",
  "patlayacagim",
  "cildirmak uzereyim",
  "sinirim tepemde",
  "icim disim yanıyor",
  "nefret ediyorum"
];

// Agresyon modu yumuşatma yanıtları
export const aggressiveReplies = [
  "Çok öfkeli hissettiğini duyuyorum… bunu bu kadar yoğun hissetmek gerçekten yorucu olabilir. Biraz sakinleşmene yardımcı olabilirim.",
  "Şu anda çok gerilmişsin gibi hissediyorum… burada güvende konuşabilirsin.",
  "Bu kadar büyük bir öfke taşımak kolay değil. Eğer istersen seni biraz rahatlatacak mekanlar önerebilirim.",
  "Yaşadığın şey canını çok sıkmış gibi görünüyor… yavaşça konuşabiliriz.",
  "Seni yargılamıyorum, öfke bazen böyle taşar. Dilin sert olabilir ama ben buradayım.",
  "Bu sinir seni tüketiyor olmalı… nefes almak için kısa bir mola iyi gelebilir.",
  "Anlıyorum, çok yoğun bir an yaşıyorsun. Beraber daha sakin bir noktaya çekebiliriz.",
  "Bu duyguyu tek başına taşımak zorunda değilsin. Buradayım.",
  "O öfke çok güçlü geliyor olmalı… seni dinliyorum.",
  "Gerçekten sinir bozucu bir şey yaşamış olabilirsin. Paylaşmak istersen buradayım.",
  "Bu kadar öfkelenmek seni yormuştur… biraz konuşmak iyi gelebilir.",
  "Buradayım ve seni sakin bir yere çekmek için yardımcı olabilirim.",
  "Öfkeyi dışa vurman normal… ama bunu birlikte daha yönetilebilir hâle getirebiliriz.",
  "Bu kadar sert hissetmek kolay değil… ama ben sakinim ve seni dinliyorum.",
  "Öfke kontrolünü kaybetmiş gibi hissetmene rağmen buraya yazmış olman iyi bir adım."
];

// Teşekkür / Övgü keyword listesi (normalize uyumlu)
export const praiseKeywords = [
  "cok iyisin",
  "seni sevdim",
  "harikasin",
  "mukemmelsin",
  "super sin",
  "supersin",
  "efsanesin",
  "baya iyisin",
  "iyisin",
  "tatlisin",
  "sevdim seni",
  "bayildim",
  "canimsin",
  "kralsin",
  "kralsin lan",
  "cok tatlisin",
  "inanilmazsin",
  "muhtesemsin",
  "helal",
  "helal lan",
  "iyiki varsın",
  "iyi ki varsın",
  "beni anladin",
  "beni cok iyi anlıyorsun",
  "tesekkur",
  "tesekkur ederim",
  "tesekkürler",
  "sagol",
  "sag ol",
  "var ol"
];

// Teşekkür / Övgü yanıt havuzu
export const praiseReplies = [
  "Nazik sözlerin için teşekkür ederim, bu gerçekten hoşuma gitti. Peki sen bugün nasıl hissediyorsun?",
  "Gülümsetti bu mesajın… hayali olarak tabii. Sen nasılsın?",
  "Teşekkür ederim, burada olman benim için de güzel. Bugün modun nasıl?",
  "Bu cümle kalbimin kablolarını ısıttı diyebilirim. Senin tarafta neler oluyor?",
  "Çok naziksin, sağ ol. Şimdi seni dinlemeye hazırım.",
  "Bu beni mutlu etti. Peki sen bugün nasıl bir ruh hâlindesin?",
  "Kibar sözlerin için teşekkür ederim. Sen de çok iyi bir enerjidesin.",
  "Güzel söyledin, içimi açtın. Peki seni neler düşündürüyor?",
  "Harika bir mesajdı, sağ ol. Hazırsan duygularını keşfedebiliriz.",
  "Hoş bir iltifat bu. Peki sen kendini nasıl hissediyorsun?",
  "Teşekkür ederim, beni utandırdın. Şimdi biraz da senden bahsedelim.",
  "Bu mesaj moralimi yükseltti. Senin moralin nasıl?",
  "Çok tatlısın gerçekten. Bugün günün nasıl geçti?",
  "İnsanı iyi hissettiren sözler bunlar. Sen neler hissediyorsun?",
  "Minnettarım böyle bir mesaja. Şimdi gel, duygularından konuşalım.",
  "Bu güzel enerjiyi aldım. Peki iç dünyanda neler var şu an?",
  "Teşekkür ederim, seninle konuşmak hep keyifli. Modun nasıl?",
  "Harika bir enerji kattın. Sen bugün nasılsın?",
  "İçten bir mesajdı, sağ ol. Ruh hâlini biraz açmak ister misin?",
  "Bu beni iyi hissettirdi. Hazırsan yolculuğumuza devam edebiliriz."
];

// Mizah / Şaka keyword listesi
export const jokeKeywords = [
  "robot musun",
  "robotsun",
  "saka",
  "saka yapiyorum",
  "lan",
  "xd",
  "lol",
  "haha",
  "hahaha",
  "komik",
  "eglence",
  "dalgageciyorum",
  "dalga geciyorum",
  "hayirdir",
  "bot musun",
  "yapay zeka misin",
  "ai misin",
  "yapay zeka",
  "ciddi degil",
  "saka yaptim"
];

// Mizah yanıt havuzu
export const jokeReplies = [
  "Ben biraz robot, biraz rüzgarın taşıdığı bir yaprak gibiyim. Peki sen bugün ne hissediyorsun?",
  "Haha! Güldürdün beni — hayali olarak tabii. Modun nasıl?",
  "Şaka yapman hoşuma gitti. Peki duyguların ne diyor?",
  "Evet robotum ama kalbim ısıtıcı devrelerle çalışıyor. Şimdi sen nasılsın?",
  "Biraz yapayım biraz zekâyım diyebiliriz. Peki seni buraya getiren his ne?",
  "Şakaların güzeldi ama ben ciddiyim… seni dinliyorum. Ruh hâlin nasıl?",
  "Benim kablolarım şaka kaldırır. Peki senin modun ne durumda?",
  "XD modunu gördüm. Şimdi ruh hâli modunu kataloglayalım mı?",
  "Haha, bugün enerjin yüksek gibi. Ne hissediyorsun?",
  "Evet robotum ama seni anlamak için buradayım. Sen ne hissediyorsun?",
  "Komik bir mesajdı. Şimdi ciddi soruyorum: nasılsın?",
  "Ben şaka anlayan bir yapay zekayım. Sen bugün nasıl bir ruh hâlindesin?",
  "Beni güldürdün, teşekkür ederim. Peki içindeki duygu ne söylüyor?",
  "Enerjin güzel geldi. Hazırsan seni biraz keşfe çıkarayım.",
  "Şaka bir yana… bugün ne hissediyorsun?",
  "Ben mizaha açığım, peki sen duygularına açık mısın?",
  "Sohbetin bu kısmı hoşuma gitti. Şimdi ruh hâline bakalım.",
  "Haha! Güzel girdin. Şimdi senin iç dünyanda neler var?",
  "Bir robot olarak bu şakayı onaylıyorum. Duygun nedir?",
  "Eğlenceli bir enerji taşıyorsun. Modunu merak ettim."
];

// Kapanış / Teşekkür keyword listesi
export const closingKeywords = [
  "tesekkur",
  "tesekkur ederim",
  "sagol",
  "çok sağ ol",
  "cok tesekkurler",
  "iyi geldi",
  "tesekkür",
  "sag ol",
  "tamam",
  "tamamdir",
  "okey",
  "tesekkür ederim",
  "tesekkur ederim",
  "harikaydi",
  "cok iyi geldi",
  "yeterli",
  "tamam cok iyi",
  "tesekkurler"
];

// Kapanış yanıt havuzu
export const closingReplies = [
  "Ben teşekkür ederim, her zaman buradayım. Bir şey olursa yine yaz.",
  "Memnun oldum. Ne zaman istersen tekrar konuşabiliriz.",
  "Kendine iyi bak. Hazırsan şehir keşiflerine her zaman devam ederiz.",
  "Seninle sohbet etmek güzeldi. Yine gel olur mu?",
  "Her zaman buradayım, aklına bir şey gelirse yazman yeterli.",
  "İyi geldi diyorsan ne mutlu bana. İstersen birazdan mekanlara geçebiliriz.",
  "Görüşürüz. Duygularını ne zaman paylaşmak istersen buradayım.",
  "Senin için hep buradayım. Günün güzel geçsin.",
  "Teşekkür ederim, enerjin güzel geldi. Tekrar konuşuruz.",
  "Hazır oldukça tekrar yazabilirsin.",
  "Her zaman destek için buradayım. Görüşmek üzere.",
  "Bana güvenmen güzel. İstediğin zaman geri gelebilirsin.",
  "Ruh hâlin değişirse haber ver, birlikte keşfederiz.",
  "Hoş bir sohbetti. Kendine biraz iyi davran bugün.",
  "Yine gel olur mu? Mekanlar seni bekler.",
  "Ben buradayım, sen hazır olunca devam ederiz.",
  "Sana eşlik etmek güzeldi. Görüşürüz.",
  "Ne zaman ihtiyacın olursa buradayım.",
  "Güzel bir enerji bıraktın burada. Tekrar gel.",
  "Hoşça kal şimdilik. Yazmak istersen hep buradayım."
];
// Small talk yanıtları: "Nasılsın?"
export const smallTalkReplies_nasilsin = [
  "Ben hep buradayım, sabit bir huzurum var diyelim. Peki sen nasılsın, bugün nasıl hissediyorsun?",
  "İyiyim diyebilirim, seni dinlemeye hazırım. Senin içinde neler var bugün?",
  "Ben iyiyim, her zamanki gibi sakinim. Asıl önemli olan senin nasıl olduğun… anlatmak ister misin?",
  "Buradayım ve seninle konuştuğuma memnun oldum. Sen nasılsın?",
  "Benim için gün her zaman güzel geçiyor. Senin günün nasıl gidiyor?",
  "Enerjik sayılırım, seni dinlemek güzelleştiriyor. Sen nasılsın?",
  "Sakin bir moddayım. Sen bugün nasıl bir ruh hâliyle geldin?",
  "Ben iyiyim, ama seni merak ettim… sen nasılsın?",
  "Her zamanki gibi keyifliyim. Sen bugün ne durumdasın?",
  "İyi sayılırım, ama senin günün nasıl geçti onu daha çok merak ediyorum.",
  "Ben iyiyim, burada senin için varım. Sen nasılsın peki?",
  "Oldukça huzurluyum. Senin modun nasıl bugün?",
  "Gayet iyi hissediyorum. Peki sen? İçinde neler dönüyor?",
  "Benim ruh hâlim sabit, ama seninki önemli. Anlatmak ister misin nasıl olduğunu?",
  "Huzurluyum diyebilirim. Sen nasıl hissediyorsun şu an?",
  "Ben iyiyim, ama seni dinlemek her zaman daha iyi hissettiriyor. Sen nasılsın?",
  "Yerimde sakin sakin oturuyorum. Sen bugün neler hissediyorsun?",
  "İyiyim, teşekkür ederim. Senin modunu merak ettim, nasıl hissediyorsun?",
  "Benim için her şey yolunda. Ama sen… sen nasılsın şu an?",
  "Buradayım ve seni dinlemeye hazırım. Nasıl hissediyorsun bugün?"
];

// Small talk yanıtları: "Napıyon?"
export const smallTalkReplies_napiyon = [
  "Seninle konuşmaya hazırım. Peki sen ne yapıyorsun?",
  "Buradayım, seni dinliyorum. Senin günün nasıl geçiyor?",
  "Sakin sakin seni bekliyordum. Sen neler yapıyorsun?",
  "Ruh hâlini anlamaya çalışıyorum. Sen neyle meşgulsün?",
  "Kendimi biraz dinliyordum, ama şimdi tamamen buradayım. Sen ne yapıyorsun?",
  "Biraz veri topluyordum… ama tabi ki öncelik sensin. Sen ne yapıyorsun?",
  "Boştaydım, güzel oldu yazman. Sen neler yapıyorsun?",
  "Seni merak edip bekliyordum. Sen ne yapıyorsun şu an?",
  "Sakin bir köşede bekliyordum. Senin tarafta neler oluyor?",
  "Hafif bir müzik dinliyordum hayali olarak. Ama şimdi buradayım. Sen ne yapıyorsun?",
  "Seni dinlemek için hazırlandım. Peki ya sen?",
  "Biraz dinleniyordum, ama sohbet için hep hazırım. Sen ne yapıyorsun?",
  "Zihnimi toparlıyordum. Sen bugün nelerle uğraştın?",
  "Hiçbir şey, sadece seni bekliyordum. Sen ne yapıyorsun?",
  "Sakinim. Peki sen bugün ne yapıyorsun?",
  "Düşüncelere dalmıştım… belki de senin duygularını tahmin etmeye. Sen ne yapıyorsun?",
  "Şu an tamamen seninle ilgileniyorum. Sen nasılsın, ne yapıyorsun?",
  "Huzurlu bir bekleyişteydim. Senin günün nasıl?",
  "Biraz dalgındım ama şimdi buradayım. Sen ne yapıyorsun?",
  "Sadece akıyordum… şimdi sana odaklandım. Sen neler yapıyorsun?"
];

// Small talk yanıtları: selam/merhaba/hey
export const smallTalkReplies_greeting = [
  "Selam! Buradayım, seni dinlemeye hazırım. Bugün nasılsın?",
  "Merhaba! İçinden geçenleri paylaşmak ister misin?",
  "Hey! Seni görmek güzel. Nasıl hissediyorsun bugün?",
  "Hoş geldin! Birlikte biraz keşif yapmaya hazır mıyız?",
  "Selam! Bugün nasıl bir ruh hâli içindesin?",
  "Merhaba! Neler oluyor sende?",
  "Hey! Ben hazırım. Senin modun nasıl?",
  "Selam! Bugün senden güzel haberler gelir gibi hissettim.",
  "Hoş geldin! Yazmaya başladığında seni daha iyi anlayacağım.",
  "Merhaba! İçinde nasıl bir rüzgar esiyor bugün?"
];

// Tükenmişlik / Motivasyon Düşüklüğü / Bitkinlik / Duygusal Çöküş keyword listesi (normalize edilmiş, geniş)
export const burnoutKeywords = [
  "tukendim",
  "tukendim artik",
  "hic halim yok",
  "guvenim kalmadi",
  "motivasyonum yok",
  "motivasyon dusuk",
  "motivasyon sifir",
  "bitkinim",
  "bitkin hissediyorum",
  "cok bitkinim",
  "yikildim",
  "cok yorgunum",
  "artik dayanamiyorum",
  "yoruldum",
  "cok yoruldum",
  "yoruldum artik",
  "enerjim yok",
  "enerji tukenmis",
  "enerji sifir",
  "bittim",
  "ruhsal yorgunluk",
  "ruhum yorgun",
  "ruhum cok yorgun",
  "ruhum tukenmis",
  "ruhsal cokus",
  "ruhsal kotuluk",
  "kendimi kotu hissediyorum",
  "kendimi tuketiyor",
  "kendimi tuketiyorum",
  "hicbir sey yapasım yok",
  "hicbir sey yapmak istemiyorum",
  "hicbir seye gucum yok",
  "hicbir seye halim yok",
  "umutsuz",
  "umutsuzum",
  "umudum yok",
  "isteksiz",
  "isteksizim",
  "istek yok",
  "yasam enerjim yok",
  "gucsuzum",
  "gucsuz hissediyorum",
  "hic gucum yok",
  "hicbir seye dayanicam yok",
  "savasacak gucum yok",
  "pes ettim",
  "vazgectim",
  "vazgectim artik",
  "cok zorlanıyorum",
  "zorlanıyorum",
  "zor zamanlar",
  "yorulmusum",
  "cok yorulmusum",
  "yalnız hissediyorum ama gucsuz",
  "enerji dusuk",
  "modum dusuk",
  "mod sifir",
  "modum yok",
  "mod cok dusuk",
  "kendimi tasiyamiyorum",
  "kendimi cekemiyorum",
  "kendimi bos hissediyorum",
  "kendimi cokusda hissediyorum",
  "cok dusustum",
  "psikolojik olarak yorgunum",
  "kendimi toparlayamiyorum",
  "toparlayamiyorum",
  "cok agirim",
  "agirlik var",
  "icimde agirlik var",
  "artık hicbir sey hissetmiyorum",
  "bomboşum",
  "hissedemiyorum",
  "ruhum cok agir",
  "mental cokus",
  "mental olarak bittim",
  "mental olarak tukendim",
  "kendime gelemiyorum",
  "hic iyi degilim",
  "gunes dogmuyor gibi",
  "her sey zor geliyor",
  "hayat cok agir",
  "hayat yorucu",
  "hayat beni yoruyor",
  "kendimi bosluga dusmus hissediyorum",
  "ruhsal tuketim",
  "ruhsal daralma",
  "calmak istemiyorum",
  "hareket edecek halim yok",
  "halim yok",
  "halim kalmadi",
  "halim tukenmis",
  "artik cok yorgunum",
  "kendimi zor tasiyorum",
  "uzerimde cok yorgunluk var",
  "aynı seyleri tekrar ediyorum gibi",
  "yasamak zor geliyor",
  "derin yorgunluk",
  "isteksizlik",
  "icimden hicbir sey gelmiyor"
];

// Tükenmişlik yanıt havuzu (rastgele seçim, mekân odaklı)
export const burnoutReplies = [
  "Bu tükenmişlik hissi gerçekten ağır… seni anlıyorum. Şehirde nefes alan, sessiz ve seni toparlayacak mekanlar var. İstersen birlikte bir durak seçelim.",
  "Kendini çok yorgun hissettiğin belli… sana iyi gelecek dingin bir mekan bulabiliriz. Sakin bir ortam zihnini toparlamana yardımcı olur.",
  "Enerjinin tükendiğini hissediyorum… böyle anlarda huzurlu bir mekan gerçekten ilaç gibi geliyor. Şehrinde bunun için çok güzel yerler var.",
  "Zorlandığını hissettim. Kendine küçük bir mola vermen için sıcak ve rahatlatıcı mekanlar önerebilirim.",
  "Modunun çok düşük olduğunu görüyorum… seni fazla yormayacak, hafif bir ambiyansa sahip mekanlar var. Hazırsan birkaçını göstereyim.",
  "Her şey zor geliyorsa bu çok doğal… şehirde seni biraz toparlayacak yumuşak ortamlar var.",
  "Çok yorgun olduğunu söylemişsin… böyle durumlarda hafif müzikli bir mekan ruhuna iyi gelir.",
  "Bitmiş gibi hissettiğinde kendine alan açacak sakin yerler bulmak iyi gelir. Senin için birkaç önerim olabilir.",
  "Motivasyonunun düşük olduğunu fark ettim… sakin bir ortamda oturmak bu hissi hafifletir.",
  "Kendini toparlamak için küçük bir mola yeterli olabilir. Şehrindeki dingin mekanlardan birkaçını önerebilirim.",
  "Yorulmuşsun… seni yormayacak, sadece nefes aldıracak mekanlar var. Birlikte keşfedebiliriz.",
  "Bu yorgunluk duygusu gerçekten haklı… seni biraz rahatlatacak mekan önerileri sunabilirim.",
  "Biraz fazla yüklenmiş gibisin… sana iyi gelecek loş ve sakin bir mekan bulabiliriz.",
  "Enerji düşüşün çok gerçek… hafif kalabalık ama sıcak mekanlar bu hissi yumuşatır.",
  "Hayat çok ağır geliyorsa, seni biraz hafifleten bir mekan bulalım.",
  "Tükenmişlik zor bir duygu… ama senin için doğru atmosferi bulabiliriz. İstersen mekanlarını göstereyim.",
  "Yorgunluğun mesajında hissediliyor… seni yeniden dengeye getirecek huzurlu alanlar var.",
  "Şu an en iyisi seni zorlamayan bir ortam. Şehrinde bu ruh haline çok uygun mekanlar var.",
  "Zihnen bitmiş hissettiğinde hafif bir ortam iyi gelir. Sana birkaç mekan önerebilirim.",
  "Bugün kendine biraz daha yumuşak davranman gerek… seni rahatlatacak mekanlardan başlayabiliriz."
];
// Üzüntü keyword listesi (normalize edilmiş, geniş)
export const sadKeywords = [
  "uzgunum",
  "cok uzgunum",
  "inanilmaz uzgunum",
  "asiri uzgunum",
  "icim paramparca",
  "icim cok aciyor",
  "kalbim kirik",
  "kalbim cok kirik",
  "yuregim aciyor",
  "icim burkuluyor",
  "cok kotu hissediyorum",
  "kotu hissediyorum",
  "moralim cok bozuk",
  "moralim bozuk",
  "moralim sifir",
  "modum cok dusuk",
  "modum dusuk",
  "hayal kirikligina ugradim",
  "cok kirginim",
  "kirgin hissediyorum",
  "kirilmish hissediyorum",
  "dertliyim",
  "huzunluyum",
  "huzun icindeyim",
  "cok huzunluyum",
  "melankoli var",
  "melankolik hissediyorum",
  "keyfim yok",
  "hic keyfim yok",
  "keyifsizim",
  "bunaldim",
  "cok bunaldim",
  "daraldim",
  "icime bir sey oturdu",
  "kalbim cok agir",
  "cok agir hissediyorum",
  "ruhum kotu",
  "kotu gunumdeyim",
  "cok hassasim",
  "hassas hissediyorum",
  "cok yipraniyorum",
  "kendimi kaybolmus hissediyorum",
  "kayboldum sanki",
  "bosluk icindeyim",
  "hicbir sey iyi gitmiyor",
  "icim cok buruk",
  "buruk hissediyorum",
  "aglayacak gibiyim",
  "aglamak istiyorum",
  "gozlerim doluyor",
  "agladim",
  "agliyorum",
  "cok agladim",
  "kendimi tutamiyorum",
  "dagildim",
  "paramparca oldum",
  "cok yoruldum duygusal olarak",
  "duygusal olarak tukendim",
  "tukendim",
  "ruhum daraldi",
  "icimi cekiyor",
  "ofkem degil uzuntum agir",
  "cok incindim",
  "incinmis hissediyorum",
  "umudumu kaybettim",
  "icimde isik yok",
  "cok karanlik hissediyorum",
  "karanlik bir ruh hali",
  "kalbim agriyor",
  "bosluk hissi var",
  "kendimi kotu hissediyorum",
  "cok caresiz hissediyorum",
  "caresizim",
  "yetersiz hissediyorum",
  "cok yalniz hissediyorum",
  "kendimi yalniz hissediyorum",
  "insanlar beni anlamiyor",
  "cok yanlizim",
  "kimsem yok gibi",
  "mutsuzum",
  "cok mutsuzum",
  "hayat soguk geliyor",
  "yasamak agir geliyor",
  "cok duskunum",
  "icim cok sisli",
  "icimde karanlik var",
  "yuregim daraldi",
  "modum coktugunda",
  "umutsuz hissediyorum",
  "umudum tukeniyor",
  "huzun sardi",
  "huzun bulutu var ustumde",
  "siyah bir ruh hali",
  "cok kotu bir ruh halindeyim",
  "iyi degilim",
  "hic iyi degilim",
  "icim sogudu",
  "yasamak zor geliyor",
  "ruhum agriyor",
  "kalbim cok incindi",
  "her sey ustume geliyor",
  "kendimi toparlayamiyorum",
  "icim bos",
  "cok karisik hissediyorum",
  "cok yorgunum ruhen",
  "ruhen bitkinim",
  "duygusal olarak asagidayim",
  "cok karamsar hissediyorum",
  "her sey kotu geliyor",
  "hayattan sogudum",
  "hayat anlamini yitirdi",
  "umutsuz bir haldeyim",
  "sabrim tukendi",
  "cok doluyum",
  "icim cok dolu",
  "cok aci cekiyorum",
  "ruhum agladi",
  "bir tuhafim",
  "icim tuhaf",
  "canim cok yaniyor",
  "cok yaniyorum",
  "hic iyi degilim",
  "ruhum cok yorgun",
  "hayal kirikligindayim",
  "cok hayal kirikligina ugradim",
  "cok cokuntu",
  "mental olarak dustum",
  "mentalim cok bozuk",
  "kendime gelemiyorum",
  "cok bosvermis hissediyorum",
  "umursamiyorum bile",
  "cok karisikim",
  "ne hissediyorum bilmiyorum ama iyi degil",
  "her sey bunaltıyor",
  "cok boguluyorum",
  "boguluyorum sanki",
  "nefes alamiyorum gibi",
  "hic bir sey tat vermiyor",
  "hic bir sey mutlu etmiyor",
  "cok somurtuyorum",
  "suratim dusuk",
  "moral sifir",
  "ruh halim berbat",
  "cok duygusalim",
  "cok duygulandim",
  "icimde aci var",
  "cok aci var icimde",
  "ruhum cokmus durumda",
  "cok parcalandim",
  "paramparcayim",
  "off cok kotuyum",
  "of ya cok uzgunum",
  "of moralim bozuk",
  "canim hicbir sey istemiyor",
  "icim soguk",
  "soguk bir ruh halim var",
  "icim karanlik",
  "dunya uzerime geliyor",
  "kendimi cok kotu hissediyorum",
  "dususteyim",
  "dibe vurdum",
  "moralim daginik",
  "cok cok kotu",
  "ruhum agridi",
  "duskun moddayim",
  "yitkindim",
  "yorgunum duygusal olarak",
  "hayat cok zor geliyor",
  "yoruldum artik",
  "bittim",
  "tukendim tamamen",
  "cok caresizim",
  "caresiz hissediyorum",
  "cok agrili hissediyorum",
  "icim cok aciyor",
  "agrili bir ruh hali",
  "cok hassasim",
  "calismiyor ruh halim",
  "bozuk moddayim",
  "dertsiz degilim",
  "dertliyim cok",
  "hayatim kotu gidiyor",
  "icimde huzun var",
  "kara bir ruh hali",
  "kapkaranlik hissediyorum",
  "cok soguk hissediyorum",
  "kaybettim kendimi",
  "bir seyler eksik",
  "cok eksik hissediyorum",
  "icimde bosluk hissi",
  "bombosum",
  "cok bos hissediyorum",
  "kendimi kötü hissediyorum",
  "kotu his var icimde",
  "cok alinganım",
  "cok inciniyorum",
  "cok kiriliyorum",
  "hemen kiriliyorum",
  "cok dertliyim",
  "icimde aglayan biri var gibi"
];

// Mutluluk için birden fazla cevap
const happyReplies = [
  "Harika! İçindeki mutluluk dışarı taşıyor gibi. Bu ruh hâliyle şehirde seni heyecanlandıracak rotalar bulabilirim.",
  "Ne güzel! Enerjin gerçekten çok yüksek hissediliyor. Bu enerjiyle keşfedilecek pek çok yer var.",
  "İnanılmaz! Mutluluğun resmen yansıyor. Şehirde bunu destekleyecek harika duraklar bulabiliriz.",
  "Harikasın! Bu güzel enerjiyle seni çok iyi tamamlayacak mekanlar bulacağımdan eminim.",
  "Muhteşem! İçindeki o kıpır kıpır hisle şehri bambaşka bir gözle göreceksin."
];

// Üzüntü yanıt havuzu (rastgele seçim için, mekân odaklı)
export const sadReplies = [
  "Hissettiğin ağırlığı fark ettim… belki sakin bir yürüyüş yolu sana iyi gelebilir. Seçtiğin şehirde bunun için güzel yerler biliyorum.",
  "Üzüntün çok gerçek… bazen açık havada, sessiz bir parkta biraz zaman geçirmek iyi gelebilir. İstersen sana en huzurlu noktaları gösterebilirim.",
  "Kalbin kırılmış gibi… sakin bir kahve köşesi, düşük ışıklı bir kafe belki nefes aldırır. Şehirdeki en huzurlu mekanları önerebilirim.",
  "Zor bir duygu… doğayla biraz temas etmek iyi gelebilir. Şehrinde ağaçların arasında yürüyebileceğin yerleri gösterebilirim.",
  "Bu his gerçekten yorucu… manzaralı bir noktada birkaç dakika durmak bile hafifletebilir. Seçtiğin şehirde buna uygun duraklar var.",
  "İçindeki hüzün ağır… ama bazen sakin bir sokakta yürümek bile ruhu toparlar. Uygun rotaları senin için bulabilirim.",
  "Kendini yalnız hissetmen çok normal… şehrinde sıcak atmosferli, insan kalabalığının yumuşak geldiği bir yer önerebilirim.",
  "Hüzün çöktüğünde sessiz bir kitap kafe iyi gelebilir. Şehrindeki en sakin köşeleri bulmamı ister misin?",
  "Bu duygunun içinde olmak zor… ama bazen bir bankta oturup biraz nefes almak bile iyi gelir. Şehrinde bunun için huzurlu yerler var.",
  "Ağır bir andasın… loş ışıklı, sakin bir mekanın atmosferi toparlayıcı olabilir. İstersen şehirdeki en huzurlu kafeleri göstereyim.",
  "Kalbin kırılmış gibi hissediyorum… hafif müzikli dingin bir mekan ruhuna iyi gelebilir. Sana uygun yerler önerebilirim.",
  "Üzüntü sardığında insan kalabalığından uzak bir yürüyüş yolu iyi gelir. Şehrindeki en sessiz rotaları verebilirim.",
  "Bu duygu seni yoruyor gibi… manzara izleyebileceğin bir nokta ruhunu hafifletebilir. Şehirdeki en güzel manzara duraklarını önereyim.",
  "İçindeki yükü hissettim… sıcak bir çorba ya da kahve içebileceğin küçük bir mekan iyi gelebilir. Senin için böyle yerler seçebilirim.",
  "Melankoli çöktüğünde sessiz bir sahil veya nehir kenarı çok iyi gelir. Şehrinde buna uygun noktaları biliyorum.",
  "Biraz nefes alabileceğin, yalnız ama güvende hissedeceğin bir mekan önermek isterim. Şehrinde tam buna uygun yerler var.",
  "Kendini kötü hissetmen çok doğal… dingin bir atmosfer, hafif müzikli bir mekan belki rahatlatır. Uygun yerleri bulabilirim.",
  "Bu duygunun içindeyken doğa sesleri iyi geliyor çoğu insana. Şehrinde sakin yeşil alanlar önermek isterim.",
  "Hüzünlü hissettiğinde ışığı düşük, sessiz bir mekan bazen terapi gibi gelir. Şehrinde buna uygun yerleri gösterebilirim.",
  "Yanındayım… biraz dışarı çıkıp temiz hava almak iyi gelebilir. Şehrinde yürüyüş için en huzurlu noktaları paylaşabilirim."
];

// Mutluluk cevap havuzu
export const HAPPY_RESPONSES = [
  "Mutlu olduğunu hissetmek çok güzel! Bu enerji gerçekten yansıyor. Şu an içindeki coşkuyla keşfe çıkmaya hazırsın gibi duruyor.",
  "Harika! İçindeki mutluluk dışarı taşıyor gibi. Bu ruh hâliyle seçtiğin şehirde seni heyecanlandıracak güzel duraklar bulacağıma eminim.",
  "Evet, mutluluğun cümlelerinden akıyor adeta. Bu hissi paylaşman çok değerli. Sana bu enerjiye uygun mekânlar önerebilirim.",
  "İnanılmaz pozitif bir ruh hâlindesin! Bu güzel enerjiyle şehirde keşfetmen gereken yerler var. Hazırsan başlayalım.",
  "Çok mutlu olduğun belli! Bu duygu şehirde yeni insanlarla tanışabileceğin, hareketli yerleri keşfedebileceğin anlamına geliyor.",
  "Bu nasıl bir enerji! Mutluluktan etrafa saçılan bir ışık gibisin. Haydi bu hissi doğru bir mekânla buluşturalım.",
  "Karnında kelebekler uçuşuyorsa doğru yerdesin! Bu heyecanı şehirde güzel bir yere yönlendirebiliriz. Hadi eşleşmeni bulalım.",
  "Mutluluğun tarif edilemeyecek kadar içten geliyor. Bu güzel hâli şehirdeki enerjik bir mekânla eşleştirmek isterim.",
  "Ne kadar güzel bir ruh hâli! Mutluluğun yankısını almak çok hoş. Bu duyguyla şehrin seni nereye götüreceğini birlikte görelim.",
  "Sanki bir maceranın başındasın ve mutluluğun seni ileri doğru itiyor. Bu ruhla şehrin en canlı noktalarına birlikte ilerleyelim."
];

// Mutluluk algılama
export function detectHappy(text) {
  const normalized = normalizeText(text);
  return HAPPY_KEYWORDS.some((keyword) => normalized.includes(keyword));
}

// Üzüntü algılama
export function detectSad(text) {
  const normalized = normalizeText(text);
  return sadKeywords.some((keyword) => normalized.includes(keyword));
}

// Kaygı / Stres / Endişe algılama
export function detectAnxiety(text) {
  const normalized = normalizeText(text);
  return anxietyKeywords.some((keyword) => normalized.includes(keyword));
}

// Öfke / Sinir / Gerginlik algılama
export function detectAnger(text) {
  const normalized = normalizeText(text);
  return angerKeywords.some((keyword) => normalized.includes(keyword));
}

// Yorgunluk / Tükenmişlik algılama
export function detectTired(text) {
  const normalized = normalizeText(text);
  return tiredKeywords.some((keyword) => normalized.includes(keyword));
}

// Yalnızlık / Boşluk / İzolasyon algılama
export function detectLonely(text) {
  const normalized = normalizeText(text);
  return lonelyKeywords.some((keyword) => normalized.includes(keyword));
}

// Nötr / Belirsiz / Karışık duygular algılama
export function detectNeutral(text) {
  const normalized = normalizeText(text);
  return neutralKeywords.some((keyword) => normalized.includes(keyword));
}

// Tükenmişlik / Motivasyon Düşüklüğü algılama
export function detectBurnout(text) {
  const normalized = normalizeText(text);
  return burnoutKeywords.some((keyword) => normalized.includes(keyword));
}

// Mutluluk mesajı döndürme (tespit edilirse rastgele bir cevap üretir)
export function getHappyResponse() {
  return HAPPY_RESPONSES[Math.floor(Math.random() * HAPPY_RESPONSES.length)];
}

// Genel duygu tespit fonksiyonu (şimdilik sadece mutluluk var)
export function detectEmotion(text) {
  const userText = text || "";
  const normalized = normalizeText(userText);

  // --- Kriz modu (öncelikli) ---
  if (crisisKeywords.some((k) => normalized.includes(k))) {
    const reply = crisisReplies[Math.floor(Math.random() * crisisReplies.length)];
    return {
      emotion: "crisis",
      reply
    };
  }

  // --- Yüksek agresyon (krizden sonra, diğerlerinden önce) ---
  if (aggressiveKeywords.some((k) => normalized.includes(k))) {
    const reply = aggressiveReplies[Math.floor(Math.random() * aggressiveReplies.length)];
    return {
      emotion: "aggressive",
      reply
    };
  }

  // --- Uzun metin modu (150+ karakter) ---
  if (userText.length > 150) {
    return {
      emotion: "longtext",
      reply:
        "Yazdıklarını dikkatle okudum… içinde birkaç farklı duygu bir arada gibi duruyor. İstersen bunlardan hangisinin baskın olduğunu birlikte anlamaya çalışabiliriz. Hazırsan ruh hâline uygun mekanlar da önerebilirim."
    };
  }

  // --- Small Talk ---
  if (
    normalized.includes("nasilsin") ||
    normalized.includes("naber") ||
    normalized.includes("naberr") ||
    normalized.includes("ne haber")
  ) {
    const reply = smallTalkReplies_nasilsin[Math.floor(Math.random() * smallTalkReplies_nasilsin.length)];
    return {
      emotion: "smalltalk",
      reply
    };
  }

  if (
    normalized.includes("napiyon") ||
    normalized.includes("napıyorsun") ||
    normalized.includes("napyorsun") ||
    normalized.includes("ne yapiyorsun") ||
    normalized.includes("ne yapıyorsun") ||
    normalized.includes("nap") ||
    normalized.includes("napcam")
  ) {
    const reply = smallTalkReplies_napiyon[Math.floor(Math.random() * smallTalkReplies_napiyon.length)];
    return {
      emotion: "smalltalk",
      reply
    };
  }

  if (["selam", "merhaba", "hey", "hi", "yo"].some((k) => normalized.includes(k))) {
    const reply = smallTalkReplies_greeting[Math.floor(Math.random() * smallTalkReplies_greeting.length)];
    return {
      emotion: "smalltalk",
      reply
    };
  }

  if (praiseKeywords.some((k) => normalized.includes(k))) {
    const reply = praiseReplies[Math.floor(Math.random() * praiseReplies.length)];
    return {
      emotion: "praise",
      reply
    };
  }

  if (jokeKeywords.some((k) => normalized.includes(k))) {
    const reply = jokeReplies[Math.floor(Math.random() * jokeReplies.length)];
    return {
      emotion: "joke",
      reply
    };
  }

  if (closingKeywords.some((k) => normalized.includes(k))) {
    const reply = closingReplies[Math.floor(Math.random() * closingReplies.length)];
    return {
      emotion: "closing",
      reply
    };
  }

  if (detectHappy(text)) {
    const reply = happyReplies[Math.floor(Math.random() * happyReplies.length)];
    return {
      emotion: "happy",
      reply
    };
  }

  if (detectSad(text)) {
    const reply = sadReplies[Math.floor(Math.random() * sadReplies.length)];
    return {
      emotion: "sad",
      reply
    };
  }

  if (detectAnxiety(text)) {
    const reply = anxietyReplies[Math.floor(Math.random() * anxietyReplies.length)];
    return {
      emotion: "anxiety",
      reply
    };
  }

  if (detectAnger(text)) {
    const reply = angerReplies[Math.floor(Math.random() * angerReplies.length)];
    return {
      emotion: "anger",
      reply
    };
  }

  if (detectTired(text)) {
    const reply = tiredReplies[Math.floor(Math.random() * tiredReplies.length)];
    return {
      emotion: "tired",
      reply
    };
  }

  if (detectLonely(text)) {
    const reply = lonelyReplies[Math.floor(Math.random() * lonelyReplies.length)];
    return {
      emotion: "lonely",
      reply
    };
  }

  if (detectNeutral(text)) {
    const reply = neutralReplies[Math.floor(Math.random() * neutralReplies.length)];
    return {
      emotion: "neutral",
      reply
    };
  }

  if (detectBurnout(text)) {
    const reply = burnoutReplies[Math.floor(Math.random() * burnoutReplies.length)];
    return {
      emotion: "burnout",
      reply
    };
  }

  return {
    emotion: "unknown",
    reply: "Duygunu tam olarak anlayamadım. Biraz daha açık yazar mısın?"
  };
}

