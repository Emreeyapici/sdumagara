-- ==========================================================
-- SDÜMAK (Süleyman Demirel Üniversitesi Mağara Araştırma ve Koruma Topluluğu)
-- Supabase Veritabanı Kurulum Şeması (schema.sql - v2)
-- ==========================================================
-- Bu SQL dosyasını Supabase Dashboard > SQL Editor sekmesine
-- yapıştırıp "Run" (Çalıştır) butonuna basmanız yeterlidir.
-- ==========================================================

-- 1. KULLANICILAR TABLOSU (users)
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  student_no TEXT,
  phone TEXT,
  department TEXT,
  blood_type TEXT DEFAULT '0+',
  emergency_contact TEXT,
  role TEXT DEFAULT 'caylak' CHECK (role IN ('admin', 'yonetim', 'egitmen', 'uye', 'caylak')),
  caving_count INTEGER DEFAULT 0,
  srt_experience BOOLEAN DEFAULT false,
  join_year INTEGER DEFAULT 2025,
  avatar TEXT,
  bio TEXT,
  badges JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  joined_at TEXT
);

-- 2. FORUM KONULARI & HABERLER TABLOSU (topics)
CREATE TABLE IF NOT EXISTS public.topics (
  id TEXT PRIMARY KEY,
  category_id TEXT NOT NULL,
  author JSONB NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  views_count INTEGER DEFAULT 1,
  likes_count INTEGER DEFAULT 0,
  liked_by JSONB DEFAULT '[]'::jsonb,
  comments_count INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT false,
  is_locked BOOLEAN DEFAULT false,
  is_announcement BOOLEAN DEFAULT false,
  tags JSONB DEFAULT '["Genel"]'::jsonb,
  images JSONB DEFAULT '[]'::jsonb,
  comments JSONB DEFAULT '[]'::jsonb
);

-- 3. ETKİNLİKLER & FAALİYET TAKVİMİ (events)
CREATE TABLE IF NOT EXISTS public.events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT NOT NULL,
  cave_name TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  quota INTEGER DEFAULT 25,
  difficulty TEXT DEFAULT 'Basit / Yatay Mağara',
  status TEXT DEFAULT 'Kayıtlar Açık',
  organizer TEXT DEFAULT 'SDÜMAK Yönetim Kurulu',
  leaders JSONB DEFAULT '["Emre Yapıcı"]'::jsonb,
  requirements JSONB DEFAULT '[]'::jsonb,
  registered_user_ids JSONB DEFAULT '[]'::jsonb,
  cover_image TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. MAĞARA ATLASI (caves)
CREATE TABLE IF NOT EXISTS public.caves (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  district TEXT NOT NULL,
  depth INTEGER DEFAULT 0,
  length INTEGER DEFAULT 0,
  difficulty TEXT DEFAULT 'Orta',
  coordinates JSONB DEFAULT '{"lat": 37.8, "lng": 30.8}'::jsonb,
  survey_available BOOLEAN DEFAULT false,
  survey_image_url TEXT,
  water_status TEXT DEFAULT 'Kuru',
  vertical_drops TEXT,
  description TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. EKİPMAN & ZİMMET ENVANTERİ (equipment)
CREATE TABLE IF NOT EXISTS public.equipment (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  brand_model TEXT,
  category TEXT NOT NULL,
  serial_no TEXT UNIQUE,
  status TEXT DEFAULT 'Kulüp Deposunda',
  assigned_to TEXT,
  assigned_date TEXT,
  last_inspection_date TEXT,
  condition TEXT DEFAULT 'Mükemmel',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. CANLI YÜZEY TAKİBİ & GÜVENLİK PROTOKOLÜ (safety_logs)
CREATE TABLE IF NOT EXISTS public.safety_logs (
  id TEXT PRIMARY KEY,
  cave_name TEXT NOT NULL,
  team_leader TEXT NOT NULL,
  surface_watch_person TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  entry_time TEXT NOT NULL,
  estimated_exit_time TEXT NOT NULL,
  team_size INTEGER DEFAULT 1,
  status TEXT DEFAULT 'Mağarada (Faaliyette)',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. KULÜP YÖNETİMİ & MASALAR (board_members)
CREATE TABLE IF NOT EXISTS public.board_members (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  desk TEXT NOT NULL,
  avatar TEXT,
  contact TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. SIKÇA SORULAN SORULAR (faqs)
CREATE TABLE IF NOT EXISTS public.faqs (
  id TEXT PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT DEFAULT 'Genel',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. ÜYE REHBERİ & BİLGİ BANKASI (guides)
CREATE TABLE IF NOT EXISTS public.guides (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  summary TEXT,
  content TEXT NOT NULL,
  icon TEXT DEFAULT 'AlertTriangle',
  is_important BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================================
-- ROW LEVEL SECURITY (RLS) POLİTİKALARI
-- (SELECT için USING(true), INSERT/UPDATE/DELETE için WITH CHECK(true))
-- ==========================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.caves ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.safety_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.board_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guides ENABLE ROW LEVEL SECURITY;

-- Eski politikaları temizle (varsa)
DROP POLICY IF EXISTS "Public Read Users" ON public.users;
DROP POLICY IF EXISTS "Public Manage Users" ON public.users;
DROP POLICY IF EXISTS "Public Read Topics" ON public.topics;
DROP POLICY IF EXISTS "Public Manage Topics" ON public.topics;
DROP POLICY IF EXISTS "Public Read Events" ON public.events;
DROP POLICY IF EXISTS "Public Manage Events" ON public.events;
DROP POLICY IF EXISTS "Public Read Caves" ON public.caves;
DROP POLICY IF EXISTS "Public Manage Caves" ON public.caves;
DROP POLICY IF EXISTS "Public Read Equipment" ON public.equipment;
DROP POLICY IF EXISTS "Public Manage Equipment" ON public.equipment;
DROP POLICY IF EXISTS "Public Read Safety" ON public.safety_logs;
DROP POLICY IF EXISTS "Public Manage Safety" ON public.safety_logs;
DROP POLICY IF EXISTS "Public Read Board" ON public.board_members;
DROP POLICY IF EXISTS "Public Manage Board" ON public.board_members;
DROP POLICY IF EXISTS "Public Read FAQs" ON public.faqs;
DROP POLICY IF EXISTS "Public Manage FAQs" ON public.faqs;
DROP POLICY IF EXISTS "Public Read Guides" ON public.guides;
DROP POLICY IF EXISTS "Public Manage Guides" ON public.guides;

-- Tam yetkili anon politikaları (Web API anahtarıyla okuma, ekleme, güncelleme ve silme)
CREATE POLICY "Public Read Users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Public Manage Users" ON public.users FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public Read Topics" ON public.topics FOR SELECT USING (true);
CREATE POLICY "Public Manage Topics" ON public.topics FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public Read Events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Public Manage Events" ON public.events FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public Read Caves" ON public.caves FOR SELECT USING (true);
CREATE POLICY "Public Manage Caves" ON public.caves FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public Read Equipment" ON public.equipment FOR SELECT USING (true);
CREATE POLICY "Public Manage Equipment" ON public.equipment FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public Read Safety" ON public.safety_logs FOR SELECT USING (true);
CREATE POLICY "Public Manage Safety" ON public.safety_logs FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public Read Board" ON public.board_members FOR SELECT USING (true);
CREATE POLICY "Public Manage Board" ON public.board_members FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public Read FAQs" ON public.faqs FOR SELECT USING (true);
CREATE POLICY "Public Manage FAQs" ON public.faqs FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public Read Guides" ON public.guides FOR SELECT USING (true);
CREATE POLICY "Public Manage Guides" ON public.guides FOR ALL USING (true) WITH CHECK (true);

-- ==========================================================
-- REALTIME YAYININI AKTİFLEŞTİR (Canlı Senkronizasyon)
-- ==========================================================

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.topics;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.events;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.safety_logs;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.board_members;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.guides;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.equipment;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.caves;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- ==========================================================
-- KURUCU ADMİN (Emre Yapıcı)
-- ==========================================================
INSERT INTO public.users (
  id, name, email, password, student_no, phone, blood_type, role, caving_count, avatar, bio, badges, joined_at
) VALUES (
  'user-admin-emre',
  'Emre Yapıcı',
  'emre4821@outlook.com',
  'Luciddreams4090',
  '2211019045',
  '05550000000',
  'A+',
  'admin',
  24,
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  'SDÜMAK Kurucu Başkanı & Mağara Araştırmacısı',
  '["Kurucu Admin", "SRT-3 İleri Dikey İp", "Haritacı & Ölçümcü"]'::jsonb,
  '2025-01-01'
) ON CONFLICT (id) DO UPDATE SET
  role = 'admin',
  password = 'Luciddreams4090',
  name = 'Emre Yapıcı',
  blood_type = 'A+';
