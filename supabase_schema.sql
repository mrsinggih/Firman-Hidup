-- =====================================================================
-- FIRMAN HIDUP - DATABASE SETUP & SEED SCRIPT FOR SUPABASE
-- Location: /supabase_schema.sql
-- =====================================================================
-- This SQL script creates the tables, indexes, Row Level Security (RLS)
-- policies, and inserts all original seed data for the "Firman Hidup" platform.
-- Copy and paste this script directly into the Supabase SQL Editor.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. CLEANUP (Optional - Uncomment if rebuilding from scratch)
-- ---------------------------------------------------------------------
-- DROP TABLE IF EXISTS bookmarks;
-- DROP TABLE IF EXISTS reading_plans;
-- DROP TABLE IF EXISTS merchandise;
-- DROP TABLE IF EXISTS donations;
-- DROP TABLE IF EXISTS devotions;
-- DROP TABLE IF EXISTS verses;
-- DROP TABLE IF EXISTS themes;
-- DROP TABLE IF EXISTS users;


-- ---------------------------------------------------------------------
-- 2. CREATE TABLES
-- ---------------------------------------------------------------------

-- Table: users (App Admins/Editors)
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY, -- text ID to match local auth flow, or auth.users UUID string
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL CHECK (role IN ('admin', 'editor')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Table: themes (Devotional / Verse Themes)
CREATE TABLE IF NOT EXISTS themes (
    id TEXT PRIMARY KEY,
    nama TEXT NOT NULL UNIQUE,
    icon TEXT NOT NULL
);

-- Table: verses (Bible Verses)
CREATE TABLE IF NOT EXISTS verses (
    id TEXT PRIMARY KEY,
    book TEXT NOT NULL,
    chapter INTEGER NOT NULL,
    verse INTEGER NOT NULL,
    text TEXT NOT NULL,
    translation TEXT NOT NULL DEFAULT 'TB',
    theme TEXT NOT NULL,
    CONSTRAINT unique_passage UNIQUE (book, chapter, verse)
);

-- Table: devotions (Daily Devotionals)
CREATE TABLE IF NOT EXISTS devotions (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    verse_id TEXT NOT NULL REFERENCES verses(id) ON DELETE RESTRICT,
    audience TEXT NOT NULL CHECK (audience IN ('children', 'teen', 'youth')),
    theme TEXT NOT NULL,
    content TEXT NOT NULL,
    prayer TEXT NOT NULL,
    reflection TEXT NOT NULL,
    challenge TEXT NOT NULL,
    image TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    publish_date DATE NOT NULL,
    created_by TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    summary TEXT,
    seo_title TEXT,
    meta_description TEXT,
    tags TEXT[] DEFAULT '{}'::TEXT[]
);

-- Table: donations (Financial Support Tracker)
CREATE TABLE IF NOT EXISTS donations (
    id TEXT PRIMARY KEY,
    nama TEXT NOT NULL,
    email TEXT NOT NULL,
    jumlah BIGINT NOT NULL CHECK (jumlah > 0),
    pesan TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'success')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Table: merchandise (Toko Rohani Items)
CREATE TABLE IF NOT EXISTS merchandise (
    id TEXT PRIMARY KEY,
    nama TEXT NOT NULL,
    harga BIGINT NOT NULL CHECK (harga >= 0),
    stok INTEGER NOT NULL CHECK (stok >= 0),
    gambar TEXT NOT NULL,
    deskripsi TEXT NOT NULL
);

-- Table: reading_plans (Bible Reading Plan)
CREATE TABLE IF NOT EXISTS reading_plans (
    day INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    passage TEXT NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT FALSE
);

-- Table: bookmarks (User Saved Verses)
CREATE TABLE IF NOT EXISTS bookmarks (
    id TEXT PRIMARY KEY,
    verse_id TEXT NOT NULL REFERENCES verses(id) ON DELETE CASCADE,
    user_id TEXT, -- Optional links to authenticated user
    bookmarked_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);


-- ---------------------------------------------------------------------
-- 3. CREATE PERFORMANCE & SEARCH INDEXES
-- ---------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_devotions_slug ON devotions(slug);
CREATE INDEX IF NOT EXISTS idx_devotions_publish_date ON devotions(publish_date);
CREATE INDEX IF NOT EXISTS idx_devotions_status_audience ON devotions(status, audience);
CREATE INDEX IF NOT EXISTS idx_verses_passage ON verses(book, chapter, verse);
CREATE INDEX IF NOT EXISTS idx_bookmarks_verse_id ON bookmarks(verse_id);


-- ---------------------------------------------------------------------
-- 4. ENABLE ROW LEVEL SECURITY (RLS) & 5. RLS POLICIES (Access Controls)
-- ---------------------------------------------------------------------
-- We enable RLS but grant full access to the 'public' (anon) role
-- because our application layer (Express backend) handles authentication
-- and role authorization. This ensures no queries fail due to RLS blocks.

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users public all" ON users FOR ALL TO public USING (true);

ALTER TABLE themes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Themes public all" ON themes FOR ALL TO public USING (true);

ALTER TABLE verses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Verses public all" ON verses FOR ALL TO public USING (true);

ALTER TABLE devotions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Devotions public all" ON devotions FOR ALL TO public USING (true);

ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Donations public all" ON donations FOR ALL TO public USING (true);

ALTER TABLE merchandise ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Merchandise public all" ON merchandise FOR ALL TO public USING (true);

ALTER TABLE reading_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reading Plans public all" ON reading_plans FOR ALL TO public USING (true);

ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Bookmarks public all" ON bookmarks FOR ALL TO public USING (true);


-- ---------------------------------------------------------------------
-- 6. SEED INITIAL DATA
-- ---------------------------------------------------------------------

-- Seed: users
INSERT INTO users (id, email, role, created_at) VALUES
('admin-1', 'den.mazzee@gmail.com', 'admin', '2026-07-16 05:28:17.888+00'),
('editor-1', 'editor@firmanhidup.com', 'editor', '2026-07-16 05:28:17.888+00')
ON CONFLICT (id) DO NOTHING;

-- Seed: themes
INSERT INTO themes (id, nama, icon) VALUES
('1', 'Persahabatan', 'Users'),
('2', 'Sekolah', 'GraduationCap'),
('3', 'Kuliah', 'BookOpen'),
('4', 'Keluarga', 'Home'),
('5', 'Bullying', 'ShieldAlert'),
('6', 'Percintaan', 'Heart'),
('7', 'Kesepian', 'Smile'),
('8', 'Media Sosial', 'Share2'),
('9', 'AI & Teknologi', 'Cpu'),
('10', 'Iman', 'Flame'),
('11', 'Pengampunan', 'Sparkles'),
('12', 'Masa Depan', 'Compass'),
('13', 'Karakter', 'CheckCircle'),
('14', 'Pelayanan', 'HandHelping'),
('15', 'Kecemasan', 'HelpCircle'),
('16', 'Depresi', 'CloudRain'),
('17', 'Mengampuni', 'HeartHandshake'),
('18', 'Menghadapi Kegagalan', 'TrendingUp')
ON CONFLICT (id) DO NOTHING;

-- Seed: verses
INSERT INTO verses (id, book, chapter, verse, text, translation, theme) VALUES
('1', 'Mazmur', 119, 105, 'Firman-Mu itu pelita bagi kakiku dan terang bagi jalanku.', 'TB', 'Masa Depan'),
('2', 'Yohanes', 3, 16, 'Karena begitu besar kasih Allah akan dunia ini, sehingga Ia telah mengaruniakan Anak-Nya yang tunggal, supaya setiap orang yang percaya kepada-Nya tidak binasa, melainkan beroleh hidup yang kekal.', 'TB', 'Iman'),
('3', 'Amsal', 3, 5, 'Percayalah kepada TUHAN dengan segenap hatimu, dan janganlah bersandar kepada pengertianmu sendiri.', 'TB', 'Iman'),
('4', 'Yesaya', 41, 10, 'Janganlah takut, sebab Aku menyertai engkau, janganlah bimbang, sebab Aku ini Allahmu; Aku akan meneguhkan, bahkan akan menolong engkau; Aku akan memegang engkau dengan tangan kanan-Ku yang membawa kemenangan.', 'TB', 'Kecemasan'),
('5', 'Yohanes', 15, 13, 'Tidak ada kasih yang lebih besar dari pada kasih seorang yang memberikan nyawanya untuk sahabat-sahabatnya.', 'TB', 'Persahabatan'),
('6', 'Roma', 8, 28, 'Kita tahu sekarang, bahwa Allah turut bekerja dalam segala sesuatu untuk mendatangkan kebaikan bagi mereka yang mengasihi Dia, yaitu bagi mereka yang terpanggil sesuai dengan rencana Allah.', 'TB', 'Menghadapi Kegagalan'),
('7', 'Filipi', 4, 6, 'Janganlah hendaknya kamu kuatir tentang apa pun juga, tetapi nyatakanlah dalam segala hal keinginanmu kepada Allah dalam doa dan permohonan dengan ucapan syukur.', 'TB', 'Kecemasan'),
('8', 'Amsal', 17, 17, 'Seorang sahabat menaruh kasih setiap waktu, dan menjadi seorang saudara dalam kesukaran.', 'TB', 'Persahabatan')
ON CONFLICT (id) DO NOTHING;

-- Seed: devotions
INSERT INTO devotions (id, title, slug, verse_id, audience, theme, content, prayer, reflection, challenge, image, status, publish_date, created_by, created_at, seo_title, meta_description, tags) VALUES
(
  'dev-1', 
  'Pelita di Tengah Kegelapan Digital', 
  'pelita-di-tengah-kegelapan-digital', 
  '1', 
  'youth', 
  'AI & Teknologi', 
  'Di era media sosial dan AI, kita sering kebingungan menentukan arah hidup. Algoritma terus menyuapi kita dengan opini dunia. Namun, Mazmur 119:105 mengingatkan kita bahwa satu-satunya petunjuk sejati adalah Firman Allah. Firman itu seperti pelita yang menerangi langkah demi langkah kaki kita, bukan lampu sorot yang langsung memperlihatkan ujung jalan. Ketika kita membaca Alkitab, kita diberi kejelasan rohani untuk memilah mana yang baik dan buruk dalam lautan informasi digital.', 
  'Bapa di Surga, terima kasih atas Firman-Mu yang menjadi kompas hidupku. Tuntun hatiku agar selalu rindu membaca sabda-Mu dibanding menelusuri linimasa media sosial. Amin.', 
  'Apakah kamu lebih sering berkonsultasi pada algoritma internet atau Firman Tuhan saat menghadapi keputusan penting?', 
  'Kurangi waktu screen time media sosialmu selama 30 menit hari ini, dan gunakan waktu itu untuk membaca serta merenungkan satu pasal Alkitab.', 
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80', 
  'published', 
  '2026-07-16', 
  'admin', 
  '2026-07-16 05:28:17.887+00', 
  'Pelita di Tengah Kegelapan Digital - Renungan Pemuda', 
  'Renungan harian pemuda tentang bagaimana menyikapi era teknologi digital berdasarkan Mazmur 119:105.', 
  ARRAY['Teknologi', 'Masa Depan', 'Pemuda']
),
(
  'dev-2', 
  'Sahabat Sejati yang Menolong', 
  'sahabat-sejati-yang-menolong', 
  '5', 
  'children', 
  'Persahabatan', 
  'Halo adik-adik! Siapa di sini yang punya sahabat karib di sekolah? Punya sahabat itu sangat menyenangkan ya! Tuhan Yesus mengajarkan bahwa sahabat yang baik adalah sahabat yang mau menolong dan menyayangi temannya dengan tulus. Bahkan Yesus sendiri adalah sahabat terbaik kita yang memberikan hidup-Nya agar kita diselamatkan. Yuk, kita belajar menjadi sahabat yang baik dengan suka menolong teman, tidak membeda-bedakan, dan rajin mendoakan mereka.', 
  'Tuhan Yesus, jadikan aku anak yang baik dan sahabat yang setia bagi teman-temanku. Terima kasih karena Engkau telah menjadi Sahabat Terbaikku. Amin.', 
  'Siapa nama sahabatmu? Apa hal baik yang sudah kamu lakukan untuknya minggu ini?', 
  'Bagikan bekal atau mainanmu kepada seorang teman hari ini dengan senyuman hangat!', 
  'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=800&q=80', 
  'published', 
  '2026-07-16', 
  'admin', 
  '2026-07-16 05:28:17.888+00', 
  'Sahabat Sejati yang Menolong - Renungan Anak', 
  'Renungan harian anak tentang persahabatan yang tulus dan bagaimana meneladani kasih Yesus Kristus.', 
  ARRAY['Persahabatan', 'Anak', 'Kasih']
),
(
  'dev-3', 
  'Mengatasi Rasa Kuatir Sekolah Baru', 
  'mengatasi-rasa-kuatir-sekolah-baru', 
  '4', 
  'teen', 
  'Kecemasan', 
  'Memasuki lingkungan sekolah yang baru sering membuat kita bimbang dan cemas. ''Apakah aku akan dapat teman?'', ''Bagaimana kalau pelajarannya terlalu sulit?'', ''Apakah aku akan dibully?''. Remaja masa kini menghadapi tekanan sosial yang sangat besar. Namun Tuhan berkata hari ini: ''Jangan takut, Aku menyertai engkau!''. Tuhan berjanji memegang tangan kananmu dan memberikan kekuatan. Saat rasa cemas melanda, berdoalah dan serahkan semua rasa kuatirmu kepada-Nya.', 
  'Tuhan, Engkau tahu rasa takut dan kuatirku menghadapi sekolah baru ini. Tolong tenangkan hatiku dan kuatkan aku karena aku tahu Engkau selalu bersamaku. Amin.', 
  'Apa ketakutan terbesar yang kamu hadapi di sekolah saat ini? Sudahkah kamu membawanya dalam doa?', 
  'Tuliskan ayat Yesaya 41:10 di selembar kertas kecil dan tempel di meja belajar atau simpan di dompetmu sebagai pengingat harian.', 
  'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=800&q=80', 
  'published', 
  '2026-07-15', 
  'admin', 
  '2026-07-16 05:28:17.888+00', 
  'Mengatasi Rasa Kuatir Sekolah Baru - Renungan Remaja', 
  'Renungan remaja Kristen tentang cara mengatasi kecemasan dan rasa takut di lingkungan sekolah baru.', 
  ARRAY['Kecemasan', 'Sekolah', 'Remaja']
)
ON CONFLICT (id) DO NOTHING;

-- Seed: donations
INSERT INTO donations (id, nama, email, jumlah, pesan, status, created_at) VALUES
('don-1', 'Budi Santoso', 'budi.santoso@gmail.com', 150000, 'Semoga Firman Tuhan semakin tersebar luas ke pelosok negeri.', 'success', '2026-07-16 05:28:17.888+00'),
('don-2', 'Maria Elizabeth', 'maria.e@yahoo.com', 300000, 'Mendukung donasi Alkitab untuk anak-anak sekolah minggu di desa.', 'success', '2026-07-16 05:28:17.888+00')
ON CONFLICT (id) DO NOTHING;

-- Seed: merchandise
INSERT INTO merchandise (id, nama, harga, stok, gambar, deskripsi) VALUES
('1', 'Mug ''Pelita Firman''', 55000, 35, 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80', 'Mug keramik premium dengan sablon eksklusif ayat Mazmur 119:105. Cocok untuk menemani saat teduh Anda setiap pagi.'),
('2', 'Kaos ''Kasih Terbesar'' Cotton Combed 30s', 110000, 50, 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80', 'Kaos berbahan katun super lembut dengan desain tipografi minimalis Yohanes 15:13. Tersedia ukuran M, L, XL.'),
('3', 'Hoodie ''Jangan Kuatir'' Navy Blue', 195000, 20, 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=600&q=80', 'Hoodie hangat dan nyaman dengan bordir kecil di dada bertuliskan Filipi 4:6. Sangat modis untuk pemuda-pemudi gereja.'),
('4', 'Tote Bag Kanvas ''Iman & Pengharapan''', 45000, 100, 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80', 'Tas belanja kanvas tebal dengan ilustrasi estetik. Praktis dan ramah lingkungan untuk kuliah, sekolah, atau ke gereja.'),
('5', 'Jurnal Saat Teduh Eksklusif', 65000, 40, 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=600&q=80', 'Buku catatan bersampul kulit imitasi dengan pembatas buku, berisi panduan saat teduh harian dan halaman refleksi.')
ON CONFLICT (id) DO NOTHING;

-- Seed: reading_plans
INSERT INTO reading_plans (day, title, passage, completed) VALUES
(1, 'Hari 1', 'Kejadian 1', TRUE),
(2, 'Hari 2', 'Kejadian 2', TRUE),
(3, 'Hari 3', 'Kejadian 3', TRUE),
(4, 'Hari 4', 'Kejadian 4', TRUE),
(5, 'Hari 5', 'Kejadian 5', TRUE),
(6, 'Hari 6', 'Kejadian 6', TRUE),
(7, 'Hari 7', 'Kejadian 7', TRUE),
(8, 'Hari 8', 'Kejadian 8', TRUE),
(9, 'Hari 9', 'Kejadian 9', TRUE),
(10, 'Hari 10', 'Kejadian 10', TRUE),
(11, 'Hari 11', 'Kejadian 11', TRUE),
(12, 'Hari 12', 'Kejadian 12', TRUE),
(13, 'Hari 13', 'Kejadian 13', TRUE),
(14, 'Hari 14', 'Kejadian 14', TRUE),
(15, 'Hari 15', 'Kejadian 15', TRUE),
(16, 'Hari 16', 'Kejadian 16', FALSE),
(17, 'Hari 17', 'Kejadian 17', FALSE),
(18, 'Hari 18', 'Kejadian 18', FALSE),
(19, 'Hari 19', 'Kejadian 19', FALSE),
(20, 'Hari 20', 'Kejadian 20', FALSE)
ON CONFLICT (day) DO NOTHING;
