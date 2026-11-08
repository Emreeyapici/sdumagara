-- SDÜMAK (Süleyman Demirel Üniversitesi Mağara Araştırma ve Koruma Topluluğu)
-- Supabase PostgreSQL Veritabanı Şeması & Row Level Security (RLS) Politikaları

-- 1. Kullanıcı Profilleri Tablosu
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  student_no TEXT,
  phone TEXT,
  blood_type TEXT CHECK (blood_type IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', '0+', '0-')),
  role TEXT DEFAULT 'uye' CHECK (role IN ('admin', 'yonetim', 'egitmen', 'uye', 'caylak')),
  avatar_url TEXT,
  bio TEXT,
  badges TEXT[] DEFAULT ARRAY['SDÜMAK 2026', 'Temel Mağaracı']::TEXT[],
  caving_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Forum Kategorileri
CREATE TABLE IF NOT EXISTS public.forum_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon_name TEXT,
  color TEXT
);

-- 3. Forum Konuları & Kulüp Haberleri
CREATE TABLE IF NOT EXISTS public.forum_topics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id TEXT REFERENCES public.forum_categories(id) ON DELETE SET NULL,
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT ARRAY['Genel']::TEXT[],
  is_pinned BOOLEAN DEFAULT FALSE,
  is_announcement BOOLEAN DEFAULT FALSE,
  views_count INT DEFAULT 0,
  likes_count INT DEFAULT 0,
  liked_by UUID[] DEFAULT ARRAY[]::UUID[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Yorumlar
CREATE TABLE IF NOT EXISTS public.topic_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  topic_id UUID REFERENCES public.forum_topics(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  likes INT DEFAULT 0,
  liked_by UUID[] DEFAULT ARRAY[]::UUID[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Faaliyetler & Kamplar
CREATE TABLE IF NOT EXISTS public.events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT NOT NULL,
  cave_name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  quota INT DEFAULT 25,
  difficulty TEXT CHECK (difficulty IN ('Basit / Yatay Mağara', 'Orta Seviye', 'İleri / Dikey Mağara (SRT Zorunlu)')),
  status TEXT DEFAULT 'Kayıtlar Açık',
  organizer TEXT DEFAULT 'SDÜMAK Yönetim Kurulu',
  leaders TEXT[] DEFAULT ARRAY[]::TEXT[],
  requirements TEXT[] DEFAULT ARRAY[]::TEXT[],
  registered_user_ids UUID[] DEFAULT ARRAY[]::UUID[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Mağara Atlası (Isparta & Bölge)
CREATE TABLE IF NOT EXISTS public.caves (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  district TEXT NOT NULL,
  depth INT NOT NULL,
  length INT NOT NULL,
  difficulty TEXT CHECK (difficulty IN ('Kolay', 'Orta', 'Dikey/Zor', 'Ekstrem')),
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  water_status TEXT,
  vertical_drops TEXT,
  survey_available BOOLEAN DEFAULT FALSE,
  survey_image_url TEXT,
  description TEXT,
  images TEXT[] DEFAULT ARRAY[]::TEXT[]
);

-- 7. Ekipman & Malzeme Zimmet Takibi
CREATE TABLE IF NOT EXISTS public.equipment (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  brand_model TEXT,
  category TEXT CHECK (category IN ('İp & Halat', 'Kişisel Dikey Ekipman', 'Kask & Aydınlatma', 'Emniyet & Ankraj', 'Ortak Kamp Malzemesi')),
  serial_no TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'Kulüp Deposunda' CHECK (status IN ('Kulüp Deposunda', 'Zimmette', 'Bakımda / Kontrolde', 'Hizmet Dışı')),
  assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  assigned_date DATE,
  last_inspection_date DATE,
  condition TEXT DEFAULT 'Mükemmel'
);

-- 8. Canlı Emniyet & Yüzey Takip Masası
CREATE TABLE IF NOT EXISTS public.safety_watch (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cave_name TEXT NOT NULL,
  team_leader TEXT NOT NULL,
  surface_watch_person TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  entry_time TIMESTAMPTZ NOT NULL,
  estimated_exit_time TIMESTAMPTZ NOT NULL,
  team_size INT DEFAULT 4,
  status TEXT DEFAULT 'Mağarada (Faaliyette)' CHECK (status IN ('Mağarada (Faaliyette)', 'Güvenle Çıktı', 'Gecikme Alarmı'))
);

-- Row Level Security (RLS) Etkinleştirme
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topic_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment ENABLE ROW LEVEL SECURITY;

-- Temel Güvenlik Politikaları (Örnek)
-- Herkes okuyabilir (Public Read)
CREATE POLICY "Public read topics" ON public.forum_topics FOR SELECT USING (true);
CREATE POLICY "Public read events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Public read equipment" ON public.equipment FOR SELECT USING (true);
CREATE POLICY "Public read caves" ON public.caves FOR SELECT USING (true);

-- Yazma izinleri (Authenticated Users)
CREATE POLICY "Users can create topics" ON public.forum_topics FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update own topics or admin can update" ON public.forum_topics FOR UPDATE USING (
  auth.uid() = author_id OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'yonetim'))
);
CREATE POLICY "Users can delete own topics or admin can delete" ON public.forum_topics FOR DELETE USING (
  auth.uid() = author_id OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'yonetim'))
);

