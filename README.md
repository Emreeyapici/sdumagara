# SDÜMAK - Süleyman Demirel Üniversitesi Mağara Araştırma ve Koruma Topluluğu Web Platformu 🦇

Süleyman Demirel Üniversitesi (SDÜ) bünyesinde faaliyet gösteren 500'ü aşkın üyeye sahip **SDÜMAK** (Mağara Araştırma ve Koruma Topluluğu) için özel olarak tasarlanmış ve geliştirilmiş modern topluluk web sitesi.

Platform; forum, kulüp haberleri, etkinlik ve kamp başvuruları, Isparta çevresi mağara atlası, can güvenliği için ekipman zimmet takibi ve canlı mağara giriş-çıkış güvenlik protokolünü bir arada sunar.

---

## 🛠️ Kullanılan Teknolojiler (Tech Stack)

500 üye ölçeğindeki bir üniversite topluluğunun sıfır sunucu maliyetiyle ömür boyu kesintisiz çalışabilmesi hedeflenerek seçilmiştir:

* **Framework:** [Next.js](https://nextjs.org/) (App Router mimarisi, React 19)
* **Dil:** [TypeScript](https://www.typescriptlang.org/) (Tip güvenliği ve tam veri modellemesi)
* **Stil & Tasarım:** [Tailwind CSS v4](https://tailwindcss.com/) (Doğal taş ve mağara tonları: Derin arduvaz/grafit `#0c0e12`, mat taş paneller `#13161c`, zarif kehribar fener vurgusu `#f59e0b`. Göz yormayan, sade ve premium outdoor estetiği)
* **Korumalı Alanlar (Auth Gate):** Giriş yapmamış misafir kullanıcılar için forumda konu açma, yorum yazma, kampa başvurma ve zimmet alma alanlarında üyelik zorunluluğu
## 👑 Yönetici (Admin) ve Kimlik Doğrulama Sistemi

* **Kurucu Yönetici Hesabı:**
  * **Ad Soyad:** Emre Yapıcı
  * **E-Posta:** `emre4821@outlook.com`
  * **Şifre:** `Luciddreams4090`
  * **Yetki:** `admin` (Sistemdeki tek en yetkili kişi)
* **Yetki Kuralları & Yönetici (Admin) Güçleri:**
  * **Konu & Haber Yönetimi (`/forum`):** Yalnızca `admin` yeni konu ve resmi duyuru açabilir, silebilir ve **dilediği zaman başlık, kategori, etiket veya içeriğini düzenleyebilir**.
  * **Kamplar & Faaliyet Takvimi (`/etkinlikler`):** Yalnızca `admin` yeni kamp ekleyebilir, silebilir veya **tarih, kontenjan, mağara ve gereksinimlerini düzenleyebilir**.
  * **Isparta Mağara Atlası (`/magara-atlasi`):** Yalnızca `admin`, `yonetim` ve `egitmen` görebilir. **`admin` atlastan mağara silebilir, düzenleyebilir ve atlasa yepyeni mağaralar (derinlik, uzunluk, dikey bacalar, GPS, kroki harita) ekleyebilir**.
  * **Üye, Yetki & Rozet Yönetimi (`/uye-yonetimi`):** Yalnızca `admin` erişebilir. Tüm üyelerin yetkilerini (`yonetim`, `egitmen`, `uye`, `caylak`) değiştirebilir, üye silebilir, üye bilgilerini düzenleyebilir, **üyelere hazır eğitim rozetleri (`SRT-1`, `SRT-2`, `Haritacı` vb.) veya kişiye özel rozetler ("2026 İncesu Lideri", "Yılın Mağaracısı" vb.) tanımlayabilir ya da çıkarabilir**.
  * **Ekipman & Malzeme Yönetimi (`/ekipman`):** Yalnızca yetkililer görebilir. `admin` malzeme ekleyebilir, silebilir ve malzeme detaylarını güncelleyebilir.
  * **Yeni Kayıtlar:** Yeni üye olan kişiler şifreleriyle kayıt olurlar ve varsayılan olarak `caylak` statüsünde başlarlar; yetkileri yalnızca Admin verir.
* **İkon Kütüphanesi:** [Lucide React](https://lucide.dev/)
* **Veritabanı & State Mimarisi:**
  * İstemci tarafında anlık test edilebilir reaktif Context + LocalStorage kalıcılığı
  * Üretime geçişte [Supabase](https://supabase.com/) (PostgreSQL + GoTrue Auth + Storage) ile doğrudan uyumlu veri tipleri ve şema yapısı
* **Derleme Motoru:** Webpack (Windows ve çapraz platform uyumlu)

---

## 🚀 Geliştirilen Modüller ve Özellikler

### 1. 🛡️ Kimlik Doğrulama & Rol Sistemi (Auth & Role Management)
* **Roller:** `Admin` (Yönetici), `Yönetim Kurulu`, `Eğitmen` (SRT Sorumlusu), `Aktif Üye`, `Çaylak 2026`.
* **Hızlı Demo Geçişi:** Arayüzdeki profil menüsünden tek tıkla farklı roller arasında geçiş yapılarak tüm yetkiler (konu sabitleme, etkinlik açma, ekipman zimmetleme, güvenlik takibi) anında test edilebilir.
* **Üye Kaydı & Profil:** Öğrenci numarası, e-posta, faaliyetlerde hayati önem taşıyan **Kan Grubu** ve kazanılan eğitim rozetleri (`SRT-1`, `SRT-2`, `Haritacı`, `Yarasa Dostu` vb.).

### 2. 💬 Topluluk Forumu & Haber/Duyuru Masası
* **Kategoriler:**
  * *Duyurular & Kulüp Haberleri*
  * *Faaliyet Raporları & Keşif Günlükleri*
  * *Ekipman & Dikey Teknik (SRT)*
  * *Eğitim & Mağara Bilimi (Speleoloji)*
  * *Kamp Ateşi & Genel Muhabbet*
* **Özellikler:**
  * Konu arama, kategori ve etiket (`#SRT`, `#İncesu`, `#Ekipman`) filtreleme.
  * Yeni konu açma modalı ve Markdown destekli içerik yazımı.
  * Yöneticiler için resmi duyuru ve konu sabitleme (`Pin`).
  * Konu ve yorumları gerçek zamanlı beğenme / tepki verme.
  * Zenginleştirilmiş yazar bilgi kartı (katıldığı faaliyet sayısı, rütbe, rozetler).

### 3. 📅 Faaliyet Takvimi & Kamplar (Etkinlik Yönetimi)
* **Kamplar ve Eğitimler:**
  * Güz dönemi çaylak eğitimi, dikey ip (SRT) kampları, haritalama faaliyetleri.
* **Katılım & Kontenjan:**
  * Kontenjan doluluk çubuğu (örn: *18/35 Üye*).
  * Tek tıkla *"Faaliyete Başvur / Katıl"* ve *"Başvuruyu İptal Et"*.
  * Gereksinim ve ekipman listesi (tulum, kafa lambası, SRT sertifikası kontrolü).
  * Yönetici ve eğitmenler için *"Yeni Faaliyet Ekle"* modalı.

### 4. 🧭 Isparta & Akdeniz Mağara Atlası
* Isparta ve çevre bölgelerin (İncesu Mağarası, Zindan Mağarası, Pınargözü Mağarası, Kuz Mağarası vb.) teknik speleolojik veritabanı:
  * **Derinlik & Uzunluk:** (Örn: *-720m*, *16.000m hat*).
  * **Hidroloji:** Aktif yeraltı nehri, mevsimsel sulu veya kuru mağara tespiti.
  * **Dikey İniş Hatları:** İp gereksinimleri (`P15`, `P22`, `P45` bacaları).
  * **Kroki & Harita (Survey):** Kulüp harita ekibinin çizdiği harita görselleri.
  * **GPS Koordinatları:** Enlem ve boylam konumları.

### 5. 🎒 Kulüp Ekipman & Malzeme Zimmet Takibi
* Mağaracılıkta can güvenliği için kritik olan kulüp envanteri takip paneli:
  * Statik ipler, iniş aletleri (*Petzl Stop*, *Petzl Simple*), göğüs ve el cumarları (*Petzl Croll*), kasklar ve dikey emniyet kemerleri.
  * Malzeme durumu: `Kulüp Deposunda`, `Zimmette`, `Bakımda / Testte`.
  * Malzemenin şu an hangi üyede olduğu ve son muayene tarihi.
  * *"Faaliyet İçin Zimmet Al"* ve *"Depoya İade Et"* etkileşimleri.

### 6. 🚨 Canlı Mağara Güvenlik & Yüzey Takip Masası (Caving Safety Watch)
* Mağaralarda telefon şebekesi çekmediği için speleoloji güvenlik protokolü:
  * İçerideki ekip lideri ve mağaradaki mağaracı sayısı.
  * Dışarıda bekleyen **Yüzey Sorumlusu** ve acil durum irtibat numarası.
  * Mağaraya giriş saati ve tahmini çıkış saati.
  * Durum takibi: `Mağarada (Faaliyette)`, `Güvenle Çıktı`, `Gecikme Alarmı`.
  * Ekip mağaradayken tüm sitede kırmızı canlı faaliyet uyarı bandı görünür.

### 7. 🔦 Kafa Feneri Modu (Cave Headlamp Mode)
* Navigasyon barındaki fener butonuna basıldığında açılan özel mağaracı teması.
* Fare imlecini takip eden ambient kafa lambası ışık hüzmesi efekti ile mağara atmosferi hissettirilir.

---

## 💻 Kurulum ve Yerel Olarak Çalıştırma

Projeyi kendi bilgisayarınızda çalıştırmak için:

### 1. Gereksinimler
* [Node.js](https://nodejs.org/) (v18 veya üzeri, v20/v24 tavsiye edilir)
* `npm` veya `pnpm`

### 2. Projeyi Çalıştırma
Proje ana dizininde bir terminal açın ve şu komutları çalıştırın:

```bash
# Bağımlılıkları yükleyin (ilk kurulumda yapıldıysa atlayabilirsiniz)
npm install

# Geliştirme sunucusunu başlatın
npm run dev
```

Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresine giderek siteyi anında kullanmaya başlayabilirsiniz!

### 3. Üretim Derlemesi (Production Build)
```bash
npm run build
npm run start
```

---

## ⚡ Supabase Kurulumu & Canlı Veritabanı Geçişi (3 Adımda Canlıya Alma)

Bu proje artık tamamen **Supabase (PostgreSQL + Realtime Canlı Senkronizasyon)** mimarisine hazırdır. Herkes için kalıcı ve anlık ortak veri sağlamak için şu 3 adımı uygulayabilirsiniz:

### 1. Adım: Ücretsiz Supabase Projesi Oluşturun
1. [supabase.com](https://supabase.com) adresine gidip ücretsiz üye olun ve **"New Project"** butonuna basarak bir proje açın (Örn: `sdumak-db`).
2. Bir veritabanı şifresi belirleyin ve bölge olarak **Frankfurt (eu-central-1)** seçin.

### 2. Adım: Veritabanı Tablolarını Tek Tıkla Yükleyin
1. Supabase Dashboard menüsünden **"SQL Editor"** sekmesine tıklayın.
2. Projedeki [`supabase/schema.sql`](supabase/schema.sql) dosyasının tüm içeriğini kopyalayıp SQL Editor'e yapıştırın.
3. Sağ alttaki yeşil **"Run" (Çalıştır)** butonuna basın.
   * *Tüm tablolar (`users`, `topics`, `events`, `caves`, `equipment`, `safety_logs`, `board_members`, `faqs`, `guides`), güvenlik izinleri (RLS), canlı yayın (Realtime) ve Kurucu Admin **Emre Yapıcı** hesabı otomatik olarak kurulacaktır.*

### 3. Adım: Bağlantı Bilgilerini Ekleyin
1. Supabase sol menüsündeki **Project Settings > API** sekmesine gidin.
2. Aşağıdaki iki değeri kopyalayın:
   * **Project URL:** `https://xxxx.supabase.co`
   * **Project API keys (anon / public):** `eyJhbGci...`
3. Bilgisayarınızdaki `.env.local` dosyasını açıp değerleri yapıştırın:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://sizin-proje-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sizin-anon-anahtariniz
   ```
4. **Vercel'e Yüklerken:** Vercel Dashboard > Projeniz > **Settings > Environment Variables** bölümüne bu iki değişkeni aynı isimlerle ekleyin.

Artık sitenizde Emre Yapıcı veya herhangi bir üye bir duyuru yayınladığında, etkinliğe başvurduğunda ya da canlı mağara takibi başlattığında; **tüm dünyadaki ziyaretçilerin ve üyelerin ekranları sayfayı yenilemeye dahi gerek kalmadan (Realtime WebSocket ile) anında güncellenir!**

---

## 📄 Lisans & Katkı
Bu proje Süleyman Demirel Üniversitesi Mağara Araştırma ve Koruma Topluluğu (**SDÜMAK**) için sevgiyle ve açık kaynak felsefesiyle geliştirilmiştir. 🦇
