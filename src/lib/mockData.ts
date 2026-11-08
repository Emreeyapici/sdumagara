import { User, ForumCategory, ForumTopic, EventItem, Cave, Equipment, CaveSafetyLog, BoardMember, FAQItem, GuideArticle } from '@/types';

export const INITIAL_USERS: User[] = [
  {
    id: 'user-admin-emre',
    name: 'Emre Yapıcı',
    email: 'emre4821@outlook.com',
    password: 'Luciddreams4090',
    studentNo: '2111001001',
    phone: '0555 123 4567',
    bloodType: 'A+',
    role: 'admin',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=EmreYapici',
    bio: 'SDÜMAK Yönetici & Kurucu Admin | Süleyman Demirel Üniversitesi Mağara Araştırma ve Koruma Topluluğu',
    badges: ['Kurucu Admin', 'SRT-3 İleri Dikey', 'Haritacı', 'Kulüp Lideri'],
    cavingCount: 45,
    joinedAt: '2022-10-01',
  },
];

export const INITIAL_CATEGORIES: ForumCategory[] = [
  {
    id: 'cat-duyurular',
    name: 'Duyurular & Kulüp Haberleri',
    description: 'SDÜMAK Yönetiminden resmi duyurular, faaliyet ilanları ve haberler.',
    slug: 'duyurular',
    iconName: 'Megaphone',
    color: 'from-amber-500 to-orange-600',
    postCount: 12,
  },
  {
    id: 'cat-faaliyet',
    name: 'Faaliyet Raporları & Keşif Günlükleri',
    description: 'Gidilen mağaraların derinlik, su durumu, dikey iniş detayları ve macera dolu raporları.',
    slug: 'faaliyet-raporlari',
    iconName: 'Compass',
    color: 'from-emerald-500 to-teal-600',
    postCount: 34,
  },
  {
    id: 'cat-ekipman',
    name: 'Ekipman & Dikey Teknik (SRT)',
    description: 'İpler, emniyet kemerleri, jumar, croll, iniş aletleri ve kafa lambası incelemeleri ve bakımı.',
    slug: 'ekipman-teknik',
    iconName: 'ShieldAlert',
    color: 'from-blue-500 to-cyan-600',
    postCount: 19,
  },
  {
    id: 'cat-egitim',
    name: 'Eğitim & Mağara Bilimi (Speleoloji)',
    description: 'Yarasalar, karstik jeoloji, sarkıt/dikit oluşumları, haritalama ve ilkyardım teknikleri.',
    slug: 'egitim-bilim',
    iconName: 'BookOpen',
    color: 'from-purple-500 to-indigo-600',
    postCount: 15,
  },
  {
    id: 'cat-genel',
    name: 'Kamp Ateşi & Genel Muhabbet',
    description: 'Mağara dışı sohbetler, kamp anıları, yeni üyelerle tanışma ve serbest kürsü.',
    slug: 'genel-sohbet',
    iconName: 'Flame',
    color: 'from-rose-500 to-pink-600',
    postCount: 48,
  },
];

export const INITIAL_TOPICS: ForumTopic[] = [
  {
    id: 'topic-2',
    categoryId: 'cat-faaliyet',
    author: INITIAL_USERS[0],
    title: '🧗 Sütçüler İncesu Mağarası -120m Dikey İniş ve Haritalama Faaliyet Raporu',
    content: `**Faaliyet Tarihi:** 24-26 Ekim 2026
**Bölge:** Isparta / Sütçüler / Çandır Kanyonu Civarı
**Ekip:** Emre Yapıcı (Lider) ve SDÜMAK Araştırma Ekibi

Faaliyetimiz cuma gecesi kamp alanına varış ile başladı. Cumartesi sabahı saat 09:30'da 4 kişilik ekiple mağara girişine ulaştık. 

**Teknik Veriler:**
- Girişteki P15 (15 metre dikey iniş) için çift spitli bolt hattı kullanıldı.
- İkinci dikey iniş olan P45 kanyon tipi çatlakta doğal babalardan dinamik emniyet alındı.
- Taban su debisi mevsim normallerinin altında olduğu için sifona kadar rahat bir ilerleme sağlandı.
- Toplam 6 saat yeraltı süresi sonrası tüm ekip sıfır kaza ile 15:30'da yüzeye ulaştı.

Detaylı fotoğraflar ve harita çizimi atlas sekmesine eklenmiştir!`,
    createdAt: '2026-10-28T11:20:00Z',
    viewsCount: 489,
    likesCount: 74,
    likedBy: ['user-admin-emre'],
    commentsCount: 0,
    isPinned: false,
    isAnnouncement: false,
    tags: ['Faaliyet Raporu', 'İncesu', 'Dikey İniş', 'Harita'],
    images: [
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&auto=format&fit=crop&q=80'
    ],
    comments: [],
  },
  {
    id: 'topic-3',
    categoryId: 'cat-ekipman',
    author: INITIAL_USERS[0],
    title: '⚙️ Dikey Mağaracılıkta Petzl Stop mu Petzl Simple mı? Hangisini Tercih Etmeliyiz?',
    content: `Mağaracılığa yeni başlayan veya ekipmanını yenilemek isteyen üyelerimizin en sık sorduğu sorulardan biri: **Stop mu Simple mı?**

İki aletin de avantaj ve dezavantajlarını özetleyelim:

**1. Petzl Stop (Otomatik Kilitli İniş Aleti):**
- *Avantajı:* Kol bırakıldığında otomatik durur, dikey iniş esnasında fotoğraf çekerken veya emniyet alırken büyük rahatlık sağlar.
- *Dezavantajı:* Çamurlu iplerde yürütmek zordur, kolun sıkışma riski vardır.

**2. Petzl Simple (Klasik Bobinli İniş Aleti):**
- *Avantajı:* Hafif, çamurda neredeyse hiç tıkanmaz, son derece dayanıklı ve basit mekanizma.
- *Dezavantajı:* Durmak için kilitleme anahtarı (key lock) atmak zorunludur.

SDÜMAK eğitimlerinde çaylak eğitiminde mutlaka emniyet kontrolü alışkanlığı kazanılması için kilit anahtarı atmayı zorunlu kılıyoruz.`,
    createdAt: '2026-11-01T09:15:00Z',
    viewsCount: 280,
    likesCount: 39,
    likedBy: ['user-admin-emre'],
    commentsCount: 0,
    isPinned: false,
    isAnnouncement: false,
    tags: ['Ekipman', 'Teknik', 'Petzl', 'SRT'],
    comments: [],
  },
];

export const INITIAL_EVENTS: EventItem[] = [
  {
    id: 'evt-1',
    title: 'Güz Dönemi Çaylak Temel SRT ve Dikey İp Kampı',
    description: 'Yeni üyelerimiz için kaya üzerinde jumar ile yükselme, croll geçişleri ve iniş aleti kullanma pratikleri.',
    location: 'Isparta / Gölcük Tabiat Parkı Kaya Tırmanış Sektörü',
    caveName: 'Gölcük Eğitim Kayalıkları',
    startDate: '2026-11-21',
    endDate: '2026-11-22',
    quota: 35,
    difficulty: 'Basit / Yatay Mağara',
    status: 'Kayıtlar Açık',
    organizer: 'SDÜMAK Yönetim Kurulu',
    leaders: ['Emre Yapıcı'],
    requirements: ['Spor ayakkabı / bot', 'Rahat eşofman', 'Yedek giysi', 'Mat ve uyku tulumu'],
    registeredUserIds: ['user-admin-emre'],
    coverImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=80'
    ],
  },
  {
    id: 'evt-2',
    title: 'Aksu Zindan Mağarası Keşif ve Biyospeleoloji İncelemesi',
    description: 'Roma döneminden beri bilinen tarihi Zindan Mağarasının derin kollarında yarasa populasyonu ve su analizi çalışması.',
    location: 'Aksu / Isparta',
    caveName: 'Zindan Mağarası',
    startDate: '2026-12-05',
    endDate: '2026-12-06',
    quota: 20,
    difficulty: 'Orta Seviye',
    status: 'Planlandı',
    organizer: 'SDÜMAK Yönetim Kurulu',
    leaders: ['Emre Yapıcı'],
    requirements: ['Çizme / su geçirmez bot', 'Tulum', 'Kafa feneri (yedek pilli)', 'Temel SRT sertifikası'],
    registeredUserIds: [],
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'evt-3',
    title: 'Pınargözü Mağarası İleri Seviye Hidroloji ve Dikey Keşif',
    description: 'Türkiyenin en uzun mağaralarından biri olan ve debisi yüksek bir kaynak barındıran Pınargözü için ileri seviye faaliyet.',
    location: 'Yenişarbademli / Isparta',
    caveName: 'Pınargözü Mağarası',
    startDate: '2027-04-18',
    endDate: '2027-04-20',
    quota: 10,
    difficulty: 'İleri / Dikey Mağara (SRT Zorunlu)',
    status: 'Planlandı',
    organizer: 'SDÜMAK Yönetim Kurulu',
    leaders: ['Emre Yapıcı'],
    requirements: ['Neopren ıslak tulum', 'SRT-2 İleri Dikey Sertifikası', 'En az 10 dikey faaliyet tecrübesi'],
    registeredUserIds: [],
    coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
  },
];

export const INITIAL_CAVES: Cave[] = [
  {
    id: 'cave-1',
    name: 'İncesu Mağarası',
    district: 'Sütçüler / Isparta',
    depth: 145,
    length: 1250,
    difficulty: 'Dikey/Zor',
    coordinates: { lat: 37.498, lng: 30.985 },
    surveyAvailable: true,
    surveyImageUrl: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&auto=format&fit=crop&q=80',
    waterStatus: 'Mevsimsel Sulu',
    verticalDrops: 'P15, P22, P45 dikey iniş bacaları',
    description: 'Isparta Sütçüler ilçesi sınırlarında yer alan İncesu, görkemli sarkıt ve dikitleri, geniş galerileri ve teknik dikey inişleriyle SDÜMAK kulübünün en önemli eğitim ve araştırma mağaralarından biridir.',
    images: [
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
    ],
  },
  {
    id: 'cave-2',
    name: 'Zindan Mağarası',
    district: 'Aksu / Isparta',
    depth: 42,
    length: 765,
    difficulty: 'Orta',
    coordinates: { lat: 37.795, lng: 31.072 },
    surveyAvailable: true,
    waterStatus: 'Aktif Yeraltı Nehri',
    verticalDrops: 'Yatay ağırlıklı, giriş sonrası 2 adet küçük 4 metrelik basamak',
    description: 'Girişinde antik Roma tanrısı Eurymedon heykeli bulunan Zindan Mağarası, içerisinden akan yer altı deresi, yarasaları ve traverten havuzlarıyla meşhurdur.',
    images: [
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80',
    ],
  },
  {
    id: 'cave-3',
    name: 'Pınargözü Mağarası',
    district: 'Yenişarbademli / Isparta',
    depth: 720,
    length: 16000,
    difficulty: 'Ekstrem',
    coordinates: { lat: 37.697, lng: 31.312 },
    surveyAvailable: true,
    waterStatus: 'Aktif Yeraltı Nehri',
    verticalDrops: 'Çok sayıda şelale, göl, sifon ve P30+ dik bacalar',
    description: 'Türkiyenin en uzun mağaralarından biri olan Pınargözü, içerisinden saatte tonlarca buz gibi su çıkan, güçlü rüzgar akımına sahip son derece zorlu ve büyüleyici bir speleolojik harikadır.',
    images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
    ],
  },
  {
    id: 'cave-4',
    name: 'Kuz Mağarası',
    district: 'Gökçehöyük / Isparta',
    depth: 60,
    length: 420,
    difficulty: 'Kolay',
    coordinates: { lat: 37.810, lng: 30.550 },
    surveyAvailable: false,
    waterStatus: 'Kuru',
    verticalDrops: 'Girişte 12m eğimli iniş',
    description: 'Çaylak eğitimi için son derece elverişli, kuru zeminli ve geniş odalardan oluşan görsel zenginliği yüksek bir başlangıç mağarası.',
    images: [
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    ],
  },
];

export const INITIAL_EQUIPMENT: Equipment[] = [
  {
    id: 'eq-1',
    name: 'Beal Spelenium 10.5mm Tip-A Statik İp (100m)',
    brandModel: 'Beal Spelenium',
    category: 'İp & Halat',
    serialNo: 'SDUMAK-IP-01',
    status: 'Kulüp Deposunda',
    lastInspectionDate: '2026-10-15',
    condition: 'Mükemmel',
  },
  {
    id: 'eq-2',
    name: 'Petzl Stop Otomatik Kilitli İniş Aleti',
    brandModel: 'Petzl D009AA00',
    category: 'Kişisel Dikey Ekipman',
    serialNo: 'SDUMAK-DESC-04',
    status: 'Kulüp Deposunda',
    lastInspectionDate: '2026-10-10',
    condition: 'İyi',
  },
  {
    id: 'eq-3',
    name: 'Petzl Croll Göğüs Cuması (Jumar)',
    brandModel: 'Petzl B16BAA',
    category: 'Kişisel Dikey Ekipman',
    serialNo: 'SDUMAK-ASC-07',
    status: 'Kulüp Deposunda',
    lastInspectionDate: '2026-10-01',
    condition: 'Mükemmel',
  },
  {
    id: 'eq-4',
    name: 'Petzl Boreo Caving Kaskı & Duo Z2 Fener Seti',
    brandModel: 'Petzl Boreo Caving',
    category: 'Kask & Aydınlatma',
    serialNo: 'SDUMAK-KSK-12',
    status: 'Kulüp Deposunda',
    lastInspectionDate: '2026-10-25',
    condition: 'İyi',
  },
  {
    id: 'eq-5',
    name: 'Singing Rock Dikey Mağaracı Alt Emniyet Kemeri',
    brandModel: 'Singing Rock Digger',
    category: 'Kişisel Dikey Ekipman',
    serialNo: 'SDUMAK-KMR-03',
    status: 'Bakımda / Kontrolde',
    lastInspectionDate: '2026-11-05',
    condition: 'Orta (Takip Gerektirir)',
  },
];

export const INITIAL_SAFETY_WATCH: CaveSafetyLog[] = [
  {
    id: 'safe-1',
    caveName: 'İncesu Mağarası (Sütçüler)',
    teamLeader: 'Emre Yapıcı (0555 123 4567)',
    surfaceWatchPerson: 'Mehmet Yüzey (0555 222 3344)',
    contactPhone: '0555 222 3344',
    entryTime: '08 Kasım 2026 - 10:30',
    estimatedExitTime: '08 Kasım 2026 - 17:00',
    teamSize: 4,
    status: 'Güvenle Çıktı',
  },
];

export const INITIAL_BOARD_MEMBERS: BoardMember[] = [
  {
    id: 'bm-1',
    name: 'Emre Yapıcı',
    role: 'Topluluk Başkanı & Yönetici',
    desk: 'Yönetim Masası',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=EmreYapici',
    contact: 'emre4821@outlook.com',
  },
  {
    id: 'bm-2',
    name: 'Yönetim Kurulu',
    role: 'Eğitim & Dikey Teknik Sorumlusu',
    desk: 'Eğitim & SRT Masası',
    avatar: '/images/sdumak-logo.png',
    contact: 'egitim@sdumak.org',
  },
  {
    id: 'bm-3',
    name: 'Malzeme Masası',
    role: 'Envanter & Zimmet Yetkilisi',
    desk: 'Lojistik & Demirbaş Masası',
    avatar: '/images/sdumak-logo.png',
    contact: 'malzeme@sdumak.org',
  },
  {
    id: 'bm-4',
    name: 'Bilim Masası',
    role: 'Haritalama & Biyospeleoloji',
    desk: 'Araştırma & Harita Masası',
    avatar: '/images/sdu-logo.png',
    contact: 'bilim@sdumak.org',
  },
];

export const INITIAL_FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'SDÜMAK faaliyetlerine katılmak için önceden tecrübe gerekir mi?',
    answer: 'Hayır. Her güz ve bahar döneminde açılan Temel Mağaracılık ve SRT-1 eğitimlerimizde sıfırdan eğitim verilmektedir.',
    category: 'Eğitim',
  },
  {
    id: 'faq-2',
    question: 'Kendi malzememi (kask, tulum, dikey ip takımı) almak zorunda mıyım?',
    answer: 'Hayır. Kulübümüz bünyesindeki kask, kafa feneri, dikey emniyet kemeri ve iniş takımları eğitim ve kamplarda üyelerimize ücretsiz tahsis edilmektedir.',
    category: 'Ekipman',
  },
  {
    id: 'faq-3',
    question: 'Klosterfobim (kapalı alan korkusu) var, yine de katılabilir miyim?',
    answer: 'Mağaralar sanılanın aksine çoğunlukla devasa salonlardan ve yüksek tavanlı galerilerden oluşur. Çaylak kamplarında geniş ve yatay galeriler tercih edilir.',
    category: 'Genel',
  },
  {
    id: 'faq-4',
    question: 'Faaliyet ve kampa katılım koşulları nelerdir?',
    answer: 'SDÜMAK üyesi olmak, temel teorik eğitim oturumuna katılmak ve kulüp tüzüğü emniyet kurallarına uymak yeterlidir.',
    category: 'Kamplar',
  },
];

export const INITIAL_GUIDES: GuideArticle[] = [
  {
    id: 'guide-1',
    title: 'Faaliyetlerde ve Kamplarda En Önemli 10 Kural',
    category: 'Etkinlik Kuralları',
    summary: 'SDÜMAK kamplarında can güvenliğini sağlayan, her üyenin ezbere bilmesi gereken hayati kurallar listesi.',
    content: `1. EKİP LİDERİ TALİMATI: Mağara içi ve yüzey koordinasyonunda ekip liderinin ve güvenlik sorumlusunun talimatı mutlaktır.
2. ÇİFT KAFA FENERİ KURALI: Mağaraya en az 2 bağımsız ışık kaynağı (kafa feneri) ve tam dolu yedek piller olmadan kesinlikle girilemez.
3. ALKOL VE UYARICI YASAĞI: Faaliyet ve iniş süreçlerinde alkol veya dikkati dağıtıcı madde kullanımı kesinlikle yasaktır; derhal ihraç sebebidir.
4. ÇÖP VE HİJYEN PROTOKOLÜ: Mağaraya kesinlikle organik veya inorganik çöp (meyve kabuğu, ambalaj, izmarit) bırakılamaz. "Götürdüğün her şeyi geri çıkar!"
5. ASLA YALNIZ HAREKET ETMEME: Mağara içinde tek başına galerilere ayrılmak yasaktır. En küçük ekip minimum 3 kişiden oluşur.
6. YÜZEY NÖBETÇİSİNE HABER VERME: Giriş ve tahmini çıkış saati yüzey sorumlusuna kayıt ettirilmeden mağaraya adım atılmaz.
7. İP EMNİYETİ VE HAT DENETİMİ: İpe girmeden önce ankraj düğümleri ve çift emniyet lonjları partner kontrolüyle doğrulanır.
8. TAŞ DÜŞMESİ ALARMI: Dikey hat altında durulmaz. Yukarıdan taş düşerse "TAŞ!" diye bağırılır ve kask öne eğilerek duvara yaslanılır, yukarı bakılmaz.
9. FORMASYONLARA DOKUNMAMA: Sarkıt, dikit ve mağara sütunlarına çıplak elle dokunulmaz (derideki yağ kristalleri bin yıllık oluşumu karartır).
10. HİPOTERMİ BİLİNCİ: Islaklık ve hareketsizlik durumunda derhal uzay battaniyesi açılır ve takıma haber verilir.`,
    icon: 'AlertTriangle',
    updatedAt: '2026-11-08',
    isImportant: true,
  },
  {
    id: 'guide-2',
    title: 'Kişisel Mağara Çantası ve Zorunlu Donanım',
    category: 'Ekipman & Hazırlık',
    summary: 'Günübirlik veya yatılı mağara faaliyetine giderken çantanızda bulunması şart olan kişisel malzemeler.',
    content: `Mağaracılıkta hazırlıksız olmak doğrudan hayati tehlike yaratır. Her üyenin kendi sırt çantasında bulundurması zorunlu olanlar:
• Termal İçlik & Polar Katman: Mağara sıcaklığı yıl boyu 8-12°C civarındadır. Pamuklu giysi suyu tutar ve dondurur; sentetik veya yün termal tercih edilmelidir.
• Su Geçirmez Dayanıklı Tulum (Cordura): Çamur, su ve keskin kayalara karşı koruma sağlar.
• Mağaracı Çizmesi veya Vibram Taban Bot: Bileği saran, ıslak kalkerde kaymayan taban zorunludur.
• İş Eldiveni (Nitril kaplı): Keskin karstik yüzeylerde elleri korur ve kavrama sağlar.
• Acil Durum Battaniyesi (Alüminyum Uzay Battaniyesi): Çantanın en erişilebilir gözünde 2 adet bulunmalıdır.
• Yüksek Kalorili Atıştırmalıklar: Kuruyemiş, kuru meyve, enerji barları, çikolata (soğukta sertleşmeyen tipte).
• Kırılmaz Matara (Min. 1 Litre) ve Sıcak Termos.
• Düdük: Mağara akustiğinde ses çok uzaklara gitmez ama düdük sesi kilometrelerce yankılanır.`,
    icon: 'Package',
    updatedAt: '2026-11-08',
    isImportant: true,
  },
  {
    id: 'guide-3',
    title: 'Hipotermi ile Mücadele ve İlkyardım Temelleri',
    category: 'Güvenlik & Sağlık',
    summary: 'Mağara ortamında en büyük sinsi tehlike: Islaklık, rüzgar ve soğuk kaynaklı hipoterminin belirtileri ve müdahale.',
    content: `Mağarada en büyük düşman karanlık değil, soğuk ve ıslaklıktır.
• Erken Belirtiler: Titreme, konuşmada pelteklik, el becerisinde yavaşlama (karabina açamama), apathy (isteksizlik).
• Ne Yapılmalı?
  1. Hareketi durdurun, rüzgarsız ve kuru bir galeriye geçin.
  2. Islak dış kıyafetleri çıkarıp kuru katman giydirin ya da uzay battaniyesiyle (gümüş tarafı içe) sarın.
  3. Yerle teması kesin: Sırt çantasını veya matı altına koyun.
  4. Mum Isıtma Çadırı: Mağaracı usulü büyük çöp poşeti veya uzay battaniyesi altında güvenli bir mum yakılarak sıcak mikro-klima oluşturulur.
  5. Sıcak, şekerli sıvı verin (asla alkol veya kahve verilmez).
  6. Yüzey ekibine derhal telsiz / kurye ile haber verin.`,
    icon: 'HeartPulse',
    updatedAt: '2026-11-08',
    isImportant: false,
  },
  {
    id: 'guide-4',
    title: 'SRT (Dikey Tek İp) Güvenlik Protokolü',
    category: 'Dikey Teknikler',
    summary: 'Dikey kuyularda ip manevraları, çift lonj emniyeti ve malzeme kontrol prosedürleri.',
    content: `Dikey mağaracılıkta hata telafi edilemez. Temel emniyet aksiyomları:
• Çift Lonj İlkesi: İstasyonlarda (rebelay, deviasyon) bir lonj sökülmeden önce mutlaka ikinci lonj emniyet noktasına takılmış olmalıdır.
• Stop / İniş Aleti Kuralı: İniş aletine ip takılır takılmaz kilitleme testi yapılmadan lonj boşa çıkarılamaz.
• İp Aşınma ve Sürtünme Koruması: İpin keskin kaya çıkıntısına sürtündüğü her noktada pad (koruyucu kılıf) veya deviasyon kullanılır.
• İpte İki Kişi Yasağı: Aynı ip boyunda (iki ankraj noktası arasında) asla aynı anda iki sporcu bulunamaz.`,
    icon: 'ShieldCheck',
    updatedAt: '2026-11-08',
    isImportant: false,
  },
];
