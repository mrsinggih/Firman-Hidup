/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();


const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini API client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "dummy-key",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

const DB_FILE = path.join(process.cwd(), "db.json");

// Define seed data structure
const initialThemes = [
  { id: "1", nama: "Persahabatan", icon: "Users" },
  { id: "2", nama: "Sekolah", icon: "GraduationCap" },
  { id: "3", nama: "Kuliah", icon: "BookOpen" },
  { id: "4", nama: "Keluarga", icon: "Home" },
  { id: "5", nama: "Bullying", icon: "ShieldAlert" },
  { id: "6", nama: "Percintaan", icon: "Heart" },
  { id: "7", nama: "Kesepian", icon: "Smile" },
  { id: "8", nama: "Media Sosial", icon: "Share2" },
  { id: "9", nama: "AI & Teknologi", icon: "Cpu" },
  { id: "10", nama: "Iman", icon: "Flame" },
  { id: "11", nama: "Pengampunan", icon: "Sparkles" },
  { id: "12", nama: "Masa Depan", icon: "Compass" },
  { id: "13", nama: "Karakter", icon: "CheckCircle" },
  { id: "14", nama: "Pelayanan", icon: "HandHelping" },
  { id: "15", nama: "Kecemasan", icon: "HelpCircle" },
  { id: "16", nama: "Depresi", icon: "CloudRain" },
  { id: "17", nama: "Mengampuni", icon: "HeartHandshake" },
  { id: "18", nama: "Menghadapi Kegagalan", icon: "TrendingUp" }
];

const initialVerses = [
  {
    id: "1",
    book: "Mazmur",
    chapter: 119,
    verse: 105,
    text: "Firman-Mu itu pelita bagi kakiku dan terang bagi jalanku.",
    translation: "TB",
    theme: "Masa Depan"
  },
  {
    id: "2",
    book: "Yohanes",
    chapter: 3,
    verse: 16,
    text: "Karena begitu besar kasih Allah akan dunia ini, sehingga Ia telah mengaruniakan Anak-Nya yang tunggal, supaya setiap orang yang percaya kepada-Nya tidak binasa, melainkan beroleh hidup yang kekal.",
    translation: "TB",
    theme: "Iman"
  },
  {
    id: "3",
    book: "Amsal",
    chapter: 3,
    verse: 5,
    text: "Percayalah kepada TUHAN dengan segenap hatimu, dan janganlah bersandar kepada pengertianmu sendiri.",
    translation: "TB",
    theme: "Iman"
  },
  {
    id: "4",
    book: "Yesaya",
    chapter: 41,
    verse: 10,
    text: "Janganlah takut, sebab Aku menyertai engkau, janganlah bimbang, sebab Aku ini Allahmu; Aku akan meneguhkan, bahkan akan menolong engkau; Aku akan memegang engkau dengan tangan kanan-Ku yang membawa kemenangan.",
    translation: "TB",
    theme: "Kecemasan"
  },
  {
    id: "5",
    book: "Yohanes",
    chapter: 15,
    verse: 13,
    text: "Tidak ada kasih yang lebih besar dari pada kasih seorang yang memberikan nyawanya untuk sahabat-sahabatnya.",
    translation: "TB",
    theme: "Persahabatan"
  },
  {
    id: "6",
    book: "Roma",
    chapter: 8,
    verse: 28,
    text: "Kita tahu sekarang, bahwa Allah turut bekerja dalam segala sesuatu untuk mendatangkan kebaikan bagi mereka yang mengasihi Dia, yaitu bagi mereka yang terpanggil sesuai dengan rencana Allah.",
    translation: "TB",
    theme: "Menghadapi Kegagalan"
  },
  {
    id: "7",
    book: "Filipi",
    chapter: 4,
    verse: 6,
    text: "Janganlah hendaknya kamu kuatir tentang apa pun juga, tetapi nyatakanlah dalam segala hal keinginanmu kepada Allah dalam doa dan permohonan dengan ucapan syukur.",
    translation: "TB",
    theme: "Kecemasan"
  },
  {
    id: "8",
    book: "Amsal",
    chapter: 17,
    verse: 17,
    text: "Seorang sahabat menaruh kasih setiap waktu, dan menjadi seorang saudara dalam kesukaran.",
    translation: "TB",
    theme: "Persahabatan"
  }
];

const initialDevotions = [
  {
    id: "dev-1",
    title: "Pelita di Tengah Kegelapan Digital",
    slug: "pelita-di-tengah-kegelapan-digital",
    verse_id: "1",
    audience: "youth" as const,
    theme: "AI & Teknologi",
    content: "Di era media sosial dan AI, kita sering kebingungan menentukan arah hidup. Algoritma terus menyuapi kita dengan opini dunia. Namun, Mazmur 119:105 mengingatkan kita bahwa satu-satunya petunjuk sejati adalah Firman Allah. Firman itu seperti pelita yang menerangi langkah demi langkah kaki kita, bukan lampu sorot yang langsung memperlihatkan ujung jalan. Ketika kita membaca Alkitab, kita diberi kejelasan rohani untuk memilah mana yang baik dan buruk dalam lautan informasi digital.",
    prayer: "Bapa di Surga, terima kasih atas Firman-Mu yang menjadi kompas hidupku. Tuntun hatiku agar selalu rindu membaca sabda-Mu dibanding menelusuri linimasa media sosial. Amin.",
    reflection: "Apakah kamu lebih sering berkonsultasi pada algoritma internet atau Firman Tuhan saat menghadapi keputusan penting?",
    challenge: "Kurangi waktu screen time media sosialmu selama 30 menit hari ini, dan gunakan waktu itu untuk membaca serta merenungkan satu pasal Alkitab.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
    status: "published" as const,
    publish_date: "2026-07-16",
    created_by: "admin",
    created_at: new Date().toISOString(),
    seo_title: "Pelita di Tengah Kegelapan Digital - Renungan Pemuda",
    meta_description: "Renungan harian pemuda tentang bagaimana menyikapi era teknologi digital berdasarkan Mazmur 119:105.",
    tags: ["Teknologi", "Masa Depan", "Pemuda"]
  },
  {
    id: "dev-2",
    title: "Sahabat Sejati yang Menolong",
    slug: "sahabat-sejati-yang-menolong",
    verse_id: "5",
    audience: "children" as const,
    theme: "Persahabatan",
    content: "Halo adik-adik! Siapa di sini yang punya sahabat karib di sekolah? Punya sahabat itu sangat menyenangkan ya! Tuhan Yesus mengajarkan bahwa sahabat yang baik adalah sahabat yang mau menolong dan menyayangi temannya dengan tulus. Bahkan Yesus sendiri adalah sahabat terbaik kita yang memberikan hidup-Nya agar kita diselamatkan. Yuk, kita belajar menjadi sahabat yang baik dengan suka menolong teman, tidak membeda-bedakan, dan rajin mendoakan mereka.",
    prayer: "Tuhan Yesus, jadikan aku anak yang baik dan sahabat yang setia bagi teman-temanku. Terima kasih karena Engkau telah menjadi Sahabat Terbaikku. Amin.",
    reflection: "Siapa nama sahabatmu? Apa hal baik yang sudah kamu lakukan untuknya minggu ini?",
    challenge: "Bagikan bekal atau mainanmu kepada seorang teman hari ini dengan senyuman hangat!",
    image: "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=800&q=80",
    status: "published" as const,
    publish_date: "2026-07-16",
    created_by: "admin",
    created_at: new Date().toISOString(),
    seo_title: "Sahabat Sejati yang Menolong - Renungan Anak",
    meta_description: "Renungan harian anak tentang persahabatan yang tulus dan bagaimana meneladani kasih Yesus Kristus.",
    tags: ["Persahabatan", "Anak", "Kasih"]
  },
  {
    id: "dev-3",
    title: "Mengatasi Rasa Kuatir Sekolah Baru",
    slug: "mengatasi-rasa-kuatir-sekolah-baru",
    verse_id: "4",
    audience: "teen" as const,
    theme: "Kecemasan",
    content: "Memasuki lingkungan sekolah yang baru sering membuat kita bimbang dan cemas. 'Apakah aku akan dapat teman?', 'Bagaimana kalau pelajarannya terlalu sulit?', 'Apakah aku akan dibully?'. Remaja masa kini menghadapi tekanan sosial yang sangat besar. Namun Tuhan berkata hari ini: 'Jangan takut, Aku menyertai engkau!'. Tuhan berjanji memegang tangan kananmu dan memberikan kekuatan. Saat rasa cemas melanda, berdoalah dan serahkan semua rasa kuatirmu kepada-Nya.",
    prayer: "Tuhan, Engkau tahu rasa takut dan kuatirku menghadapi sekolah baru ini. Tolong tenangkan hatiku dan kuatkan aku karena aku tahu Engkau selalu bersamaku. Amin.",
    reflection: "Apa ketakutan terbesar yang kamu hadapi di sekolah saat ini? Sudahkah kamu membawanya dalam doa?",
    challenge: "Tuliskan ayat Yesaya 41:10 di selembar kertas kecil dan tempel di meja belajar atau simpan di dompetmu sebagai pengingat harian.",
    image: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=800&q=80",
    status: "published" as const,
    publish_date: "2026-07-15",
    created_by: "admin",
    created_at: new Date().toISOString(),
    seo_title: "Mengatasi Rasa Kuatir Sekolah Baru - Renungan Remaja",
    meta_description: "Renungan remaja Kristen tentang cara mengatasi kecemasan dan rasa takut di lingkungan sekolah baru.",
    tags: ["Kecemasan", "Sekolah", "Remaja"]
  }
];

const initialMerchandise = [
  {
    id: "1",
    nama: "Mug 'Pelita Firman'",
    harga: 55000,
    stok: 35,
    gambar: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80",
    deskripsi: "Mug keramik premium dengan sablon eksklusif ayat Mazmur 119:105. Cocok untuk menemani saat teduh Anda setiap pagi."
  },
  {
    id: "2",
    nama: "Kaos 'Kasih Terbesar' Cotton Combed 30s",
    harga: 110000,
    stok: 50,
    gambar: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80",
    deskripsi: "Kaos berbahan katun super lembut dengan desain tipografi minimalis Yohanes 15:13. Tersedia ukuran M, L, XL."
  },
  {
    id: "3",
    nama: "Hoodie 'Jangan Kuatir' Navy Blue",
    harga: 195000,
    stok: 20,
    gambar: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=600&q=80",
    deskripsi: "Hoodie hangat dan nyaman dengan bordir kecil di dada bertuliskan Filipi 4:6. Sangat modis untuk pemuda-pemudi gereja."
  },
  {
    id: "4",
    nama: "Tote Bag Kanvas 'Iman & Pengharapan'",
    harga: 45000,
    stok: 100,
    gambar: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80",
    deskripsi: "Tas belanja kanvas tebal dengan ilustrasi estetik. Praktis dan ramah lingkungan untuk kuliah, sekolah, atau ke gereja."
  },
  {
    id: "5",
    nama: "Jurnal Saat Teduh Eksklusif",
    harga: 65000,
    stok: 40,
    gambar: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=600&q=80",
    deskripsi: "Buku catatan bersampul kulit imitasi dengan pembatas buku, berisi panduan saat teduh harian dan halaman refleksi."
  }
];

const initialDonations = [
  {
    id: "don-1",
    nama: "Budi Santoso",
    email: "budi.santoso@gmail.com",
    jumlah: 150000,
    pesan: "Semoga Firman Tuhan semakin tersebar luas ke pelosok negeri.",
    status: "success" as const,
    created_at: new Date().toISOString()
  },
  {
    id: "don-2",
    nama: "Maria Elizabeth",
    email: "maria.e@yahoo.com",
    jumlah: 300000,
    pesan: "Mendukung donasi Alkitab untuk anak-anak sekolah minggu di desa.",
    status: "success" as const,
    created_at: new Date().toISOString()
  }
];

// Helper to generate a dummy 365 day reading plan
function generateReadingPlan() {
  const books = [
    { name: "Kejadian", chapters: 50 },
    { name: "Keluaran", chapters: 40 },
    { name: "Mazmur", chapters: 150 },
    { name: "Matius", chapters: 28 },
    { name: "Yohanes", chapters: 21 },
    { name: "Roma", chapters: 16 }
  ];
  const plan = [];
  let index = 1;
  let bookIdx = 0;
  let currentChap = 1;

  for (let d = 1; d <= 365; d++) {
    const b = books[bookIdx];
    plan.push({
      day: d,
      title: `Hari ${d}`,
      passage: `${b.name} ${currentChap}`,
      completed: d <= 15 // Seed first 15 days as completed
    });
    currentChap++;
    if (currentChap > b.chapters) {
      currentChap = 1;
      bookIdx = (bookIdx + 1) % books.length;
    }
  }
  return plan;
}

const initialDb = {
  users: [
    {
      id: "admin-1",
      email: "den.mazzee@gmail.com", // Seed user email
      role: "admin" as const,
      created_at: new Date().toISOString()
    },
    {
      id: "editor-1",
      email: "editor@firmanhidup.com",
      role: "editor" as const,
      created_at: new Date().toISOString()
    }
  ],
  verses: initialVerses,
  devotions: initialDevotions,
  themes: initialThemes,
  donations: initialDonations,
  merchandise: initialMerchandise,
  readingPlan: generateReadingPlan(),
  bookmarks: [] as any[]
};

// Database state
let db = { ...initialDb };

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://omubicoajncplzzdbjri.supabase.co";
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_7_n8wUOQfpzHAy9cKe5roQ_qfLAlyVn";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Synchronize memory cache from Supabase database
async function syncFromSupabase() {
  try {
    console.log("Synchronizing database cache from Supabase...");
    
    // 1. Themes
    const { data: themes, error: themesErr } = await supabase.from("themes").select("*");
    if (!themesErr && themes && themes.length > 0) {
      db.themes = themes;
    }
    
    // 2. Verses
    const { data: verses, error: versesErr } = await supabase.from("verses").select("*");
    if (!versesErr && verses && verses.length > 0) {
      db.verses = verses;
    }
    
    // 3. Devotions
    const { data: devotions, error: devotionsErr } = await supabase.from("devotions").select("*");
    if (!devotionsErr && devotions && devotions.length > 0) {
      db.devotions = devotions;
    }
    
    // 4. Merchandise
    const { data: merch, error: merchErr } = await supabase.from("merchandise").select("*");
    if (!merchErr && merch && merch.length > 0) {
      db.merchandise = merch;
    }
    
    // 5. Reading Plans
    const { data: plans, error: plansErr } = await supabase.from("reading_plans").select("*");
    if (!plansErr && plans && plans.length > 0) {
      db.readingPlan = plans.sort((a, b) => a.day - b.day);
    }
    
    // 6. Donations
    const { data: donations, error: donErr } = await supabase.from("donations").select("*");
    if (!donErr && donations && donations.length > 0) {
      db.donations = donations;
    }

    // 7. Users
    const { data: users, error: usersErr } = await supabase.from("users").select("*");
    if (!usersErr && users && users.length > 0) {
      db.users = users;
    }

    // 8. Bookmarks
    const { data: bookmarks, error: bmErr } = await supabase.from("bookmarks").select("*");
    if (!bmErr && bookmarks) {
      db.bookmarks = bookmarks.map((b: any) => ({
        id: b.id,
        verseId: b.verse_id,
        bookmarkedAt: b.bookmarked_at,
        verse: db.verses.find(v => v.id === b.verse_id)
      }));
    }

    saveDb();
    console.log("Cache successfully synced with Supabase.");
  } catch (err) {
    console.error("Supabase sync failed (using local db.json cache):", err);
  }
}

// Load db from file if exists
function loadDb() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      db = JSON.parse(data);
      console.log("Database loaded successfully from file.");
    } else {
      saveDb();
    }
  } catch (err) {
    console.error("Failed to load database, using memory fallback.", err);
  }
}

function saveDb() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save database to file.", err);
  }
}

// Initial DB load
loadDb();
syncFromSupabase();

// API Endpoints

// 1. Auth Endpoint
app.post("/api/auth/login", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const lowerEmail = email.toLowerCase();
    // Try to find in Supabase first
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", lowerEmail)
      .maybeSingle();

    if (user) {
      // Sync local cache
      const localIdx = db.users.findIndex(u => u.email.toLowerCase() === lowerEmail);
      if (localIdx === -1) {
        db.users.push(user);
        saveDb();
      }
      return res.json({ user });
    }

    // Auto-create user
    const newUser = {
      id: "user-" + Date.now(),
      email: lowerEmail,
      role: lowerEmail.includes("admin") || lowerEmail === "den.mazzee@gmail.com" ? "admin" : "editor",
      created_at: new Date().toISOString()
    };

    const { data: insertedUser, error: insertError } = await supabase
      .from("users")
      .insert(newUser)
      .select()
      .single();

    const userToReturn = insertedUser || newUser;
    db.users.push(userToReturn);
    saveDb();
    return res.json({ user: userToReturn });
  } catch (err) {
    console.error("Auth login Supabase error, falling back to local:", err);
    // Fallback to local
    const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      return res.json({ user });
    }
    const newUser = {
      id: "user-" + Date.now(),
      email: email.toLowerCase(),
      role: email.includes("admin") || email === "den.mazzee@gmail.com" ? ("admin" as const) : ("editor" as const),
      created_at: new Date().toISOString()
    };
    db.users.push(newUser);
    saveDb();
    return res.json({ user: newUser });
  }
});

// 2. Themes
app.get("/api/themes", async (req, res) => {
  try {
    const { data: themes, error } = await supabase.from("themes").select("*");
    if (error) throw error;
    if (themes && themes.length > 0) {
      db.themes = themes;
      saveDb();
      return res.json(themes);
    }
  } catch (err) {
    console.warn("Supabase fetch themes failed, using local cache:", err);
  }
  res.json(db.themes);
});

// 3. Verses
app.get("/api/verses", async (req, res) => {
  const { search } = req.query;
  try {
    let query = supabase.from("verses").select("*");
    if (search) {
      const q = `%${search}%`;
      query = query.or(`book.ilike.${q},text.ilike.${q},theme.ilike.${q}`);
    }
    const { data: verses, error } = await query;
    if (error) throw error;
    if (verses) {
      return res.json(verses);
    }
  } catch (err) {
    console.warn("Supabase fetch verses failed, using local cache:", err);
  }

  if (search) {
    const query = String(search).toLowerCase();
    const filtered = db.verses.filter(
      v =>
        v.book.toLowerCase().includes(query) ||
        v.text.toLowerCase().includes(query) ||
        v.theme.toLowerCase().includes(query)
    );
    return res.json(filtered);
  }
  res.json(db.verses);
});

app.post("/api/verses", async (req, res) => {
  const { book, chapter, verse, text, translation, theme } = req.body;
  const newVerse = {
    id: "verse-" + Date.now(),
    book,
    chapter: Number(chapter),
    verse: Number(verse),
    text,
    translation: translation || "TB",
    theme
  };

  try {
    await supabase.from("verses").insert(newVerse);
  } catch (err) {
    console.error("Supabase insert verse failed:", err);
  }

  db.verses.push(newVerse);
  saveDb();
  res.json(newVerse);
});

// Bookmarks
app.get("/api/bookmarks", async (req, res) => {
  try {
    const { data: bookmarks, error } = await supabase.from("bookmarks").select("*, verse:verses(*)");
    if (error) throw error;
    if (bookmarks) {
      const mapped = bookmarks.map((b: any) => ({
        id: b.id,
        verseId: b.verse_id,
        bookmarkedAt: b.bookmarked_at,
        verse: b.verse
      }));
      db.bookmarks = mapped;
      saveDb();
      return res.json(mapped);
    }
  } catch (err) {
    console.warn("Supabase fetch bookmarks failed, using local cache:", err);
  }
  res.json(db.bookmarks || []);
});

app.post("/api/bookmarks", async (req, res) => {
  const { verseId } = req.body;
  const verse = db.verses.find(v => v.id === verseId);
  if (!verse) {
    return res.status(404).json({ error: "Verse not found" });
  }

  try {
    const { data: existing } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("verse_id", verseId);

    if (existing && existing.length > 0) {
      await supabase.from("bookmarks").delete().eq("verse_id", verseId);
      
      db.bookmarks = db.bookmarks.filter(b => b.verseId !== verseId);
      saveDb();
      return res.json({ bookmarked: false, bookmarks: db.bookmarks });
    } else {
      const newBookmark = {
        id: "bm-" + Date.now(),
        verse_id: verseId,
        bookmarked_at: new Date().toISOString()
      };
      await supabase.from("bookmarks").insert(newBookmark);

      const localBookmark = {
        id: newBookmark.id,
        verseId,
        verse,
        bookmarkedAt: newBookmark.bookmarked_at
      };
      db.bookmarks.push(localBookmark);
      saveDb();
      return res.json({ bookmarked: true, bookmarks: db.bookmarks });
    }
  } catch (err) {
    console.error("Supabase toggle bookmark failed, using local:", err);
    // Local fallback
    const existingIndex = db.bookmarks.findIndex(b => b.verseId === verseId);
    if (existingIndex > -1) {
      db.bookmarks.splice(existingIndex, 1);
      saveDb();
      return res.json({ bookmarked: false, bookmarks: db.bookmarks });
    }
    const newBookmark = {
      id: "bm-" + Date.now(),
      verseId,
      verse,
      bookmarkedAt: new Date().toISOString()
    };
    db.bookmarks.push(newBookmark);
    saveDb();
    res.json({ bookmarked: true, bookmarks: db.bookmarks });
  }
});

// 4. Devotions
app.get("/api/devotions", async (req, res) => {
  const { audience, theme, status } = req.query;
  try {
    let query = supabase.from("devotions").select("*, verse:verses(*)");
    if (audience) query = query.eq("audience", audience);
    if (theme) query = query.eq("theme", theme);
    if (status) query = query.eq("status", status);

    const { data: devotions, error } = await query;
    if (error) throw error;
    if (devotions) {
      return res.json(devotions);
    }
  } catch (err) {
    console.warn("Supabase fetch devotions failed, using local cache:", err);
  }

  // Fallback
  let devotionsList = db.devotions.map(d => ({
    ...d,
    verse: db.verses.find(v => v.id === d.verse_id)
  }));
  if (audience) {
    devotionsList = devotionsList.filter(d => d.audience === audience);
  }
  if (theme) {
    devotionsList = devotionsList.filter(d => d.theme === theme);
  }
  if (status) {
    devotionsList = devotionsList.filter(d => d.status === status);
  }
  res.json(devotionsList);
});

app.get("/api/devotions/:idOrSlug", async (req, res) => {
  const param = req.params.idOrSlug;
  try {
    const { data: dev, error } = await supabase
      .from("devotions")
      .select("*, verse:verses(*)")
      .or(`id.eq.${param},slug.eq.${param}`)
      .maybeSingle();

    if (dev) {
      return res.json(dev);
    }
  } catch (err) {
    console.warn("Supabase devotion lookup failed, using local cache:", err);
  }

  const dev = db.devotions.find(d => d.id === param || d.slug === param);
  if (!dev) {
    return res.status(404).json({ error: "Renungan tidak ditemukan" });
  }
  res.json({
    ...dev,
    verse: db.verses.find(v => v.id === dev.verse_id)
  });
});

app.post("/api/devotions", async (req, res) => {
  const {
    title,
    verse_id,
    audience,
    theme,
    content,
    prayer,
    reflection,
    challenge,
    image,
    status,
    publish_date,
    created_by,
    seo_title,
    meta_description,
    tags
  } = req.body;

  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  const newDevotion = {
    id: "dev-" + Date.now(),
    title,
    slug,
    verse_id,
    audience,
    theme,
    content,
    prayer,
    reflection,
    challenge,
    image: image || "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=800&q=80",
    status: status || "draft",
    publish_date: publish_date || new Date().toISOString().split("T")[0],
    created_by: created_by || "admin",
    created_at: new Date().toISOString(),
    seo_title: seo_title || title,
    meta_description: meta_description || content.slice(0, 150),
    tags: tags || [theme]
  };

  try {
    await supabase.from("devotions").insert(newDevotion);
  } catch (err) {
    console.error("Supabase insert devotion failed:", err);
  }

  db.devotions.push(newDevotion as any);
  saveDb();
  res.json({
    ...newDevotion,
    verse: db.verses.find(v => v.id === newDevotion.verse_id)
  });
});

app.put("/api/devotions/:id", async (req, res) => {
  const { id } = req.params;
  const idx = db.devotions.findIndex(d => d.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: "Renungan tidak ditemukan" });
  }

  const updatedDevotion = {
    ...db.devotions[idx],
    ...req.body,
    slug: req.body.title
      ? req.body.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "")
      : db.devotions[idx].slug
  };

  try {
    const { error } = await supabase
      .from("devotions")
      .update({
        title: updatedDevotion.title,
        slug: updatedDevotion.slug,
        verse_id: updatedDevotion.verse_id,
        audience: updatedDevotion.audience,
        theme: updatedDevotion.theme,
        content: updatedDevotion.content,
        prayer: updatedDevotion.prayer,
        reflection: updatedDevotion.reflection,
        challenge: updatedDevotion.challenge,
        image: updatedDevotion.image,
        status: updatedDevotion.status,
        publish_date: updatedDevotion.publish_date,
        seo_title: updatedDevotion.seo_title,
        meta_description: updatedDevotion.meta_description,
        tags: updatedDevotion.tags
      })
      .eq("id", id);
    if (error) throw error;
  } catch (err) {
    console.error("Supabase update devotion failed:", err);
  }

  db.devotions[idx] = updatedDevotion;
  saveDb();
  res.json(updatedDevotion);
});

app.delete("/api/devotions/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await supabase.from("devotions").delete().eq("id", id);
  } catch (err) {
    console.error("Supabase delete devotion failed:", err);
  }

  const idx = db.devotions.findIndex(d => d.id === id);
  if (idx > -1) {
    db.devotions.splice(idx, 1);
    saveDb();
  }
  res.json({ success: true });
});

// 5. Donations progress & record
app.get("/api/donations/stats", async (req, res) => {
  try {
    const { data: donations, error } = await supabase.from("donations").select("*");
    if (error) throw error;
    if (donations) {
      db.donations = donations;
      saveDb();
    }
  } catch (err) {
    console.warn("Supabase fetch donations failed, using local cache:", err);
  }

  const successDonations = db.donations.filter(d => d.status === "success");
  const totalAmount = successDonations.reduce((sum, d) => sum + Number(d.jumlah), 0);
  
  // Progress values
  const targetCount = 1000;
  // Let's say every 100k IDR equals 1 Bible
  const biblesCount = 487 + Math.floor(totalAmount / 100000);
  const remaining = Math.max(0, targetCount - biblesCount);

  res.json({
    target: targetCount,
    collected: biblesCount,
    needed: remaining,
    totalFunds: totalAmount,
    donations: db.donations
  });
});

app.post("/api/donations", async (req, res) => {
  const { nama, email, jumlah, pesan } = req.body;
  const newDonation = {
    id: "don-" + Date.now(),
    nama: nama || "Donatur Anonim",
    email: email || "anon@firmanhidup.com",
    jumlah: Number(jumlah),
    pesan: pesan || "Tuhan Yesus Memberkati.",
    status: "success" as const, // In dev mode, let's mark it as success instantly!
    created_at: new Date().toISOString()
  };

  try {
    await supabase.from("donations").insert(newDonation);
  } catch (err) {
    console.error("Supabase insert donation failed:", err);
  }

  db.donations.push(newDonation);
  saveDb();
  res.json(newDonation);
});

// 6. Merchandise Catalog & checkout
app.get("/api/merchandise", async (req, res) => {
  try {
    const { data: merch, error } = await supabase.from("merchandise").select("*");
    if (error) throw error;
    if (merch) {
      db.merchandise = merch;
      saveDb();
      return res.json(merch);
    }
  } catch (err) {
    console.warn("Supabase fetch merchandise failed, using local cache:", err);
  }
  res.json(db.merchandise);
});

app.post("/api/merchandise/checkout", async (req, res) => {
  const { items } = req.body; // array of { id, quantity }
  if (!items || !Array.isArray(items)) {
    return res.status(400).json({ error: "Items array is required" });
  }

  let totalCost = 0;
  const receiptItems: any[] = [];

  for (const checkoutItem of items) {
    const storeItem = db.merchandise.find(m => m.id === checkoutItem.id);
    if (!storeItem) {
      return res.status(404).json({ error: `Produk ID ${checkoutItem.id} tidak ditemukan` });
    }
    if (storeItem.stok < checkoutItem.quantity) {
      return res.status(400).json({ error: `Stok produk ${storeItem.nama} tidak mencukupi (Tersisa: ${storeItem.stok})` });
    }
    storeItem.stok -= checkoutItem.quantity;
    totalCost += storeItem.harga * checkoutItem.quantity;
    receiptItems.push({
      nama: storeItem.nama,
      harga: storeItem.harga,
      quantity: checkoutItem.quantity
    });

    try {
      await supabase
        .from("merchandise")
        .update({ stok: storeItem.stok })
        .eq("id", storeItem.id);
    } catch (err) {
      console.error(`Supabase update merchandise stock failed for ${storeItem.id}:`, err);
    }
  }

  saveDb();
  res.json({
    success: true,
    message: "Pembelian merchandise berhasil!",
    totalPaid: totalCost,
    items: receiptItems
  });
});

// 7. Reading Plan Completion Toggle
app.get("/api/reading-plan", async (req, res) => {
  try {
    const { data: plans, error } = await supabase.from("reading_plans").select("*");
    if (error) throw error;
    if (plans) {
      db.readingPlan = plans.sort((a, b) => a.day - b.day);
      saveDb();
      return res.json(db.readingPlan);
    }
  } catch (err) {
    console.warn("Supabase fetch reading plan failed, using local cache:", err);
  }
  res.json(db.readingPlan);
});

app.post("/api/reading-plan/toggle", async (req, res) => {
  const { day } = req.body;
  const planDay = db.readingPlan.find(p => p.day === Number(day));
  if (!planDay) {
    return res.status(404).json({ error: "Hari membaca tidak ditemukan" });
  }
  planDay.completed = !planDay.completed;

  try {
    await supabase
      .from("reading_plans")
      .update({ completed: planDay.completed })
      .eq("day", Number(day));
  } catch (err) {
    console.error("Supabase update reading plan failed:", err);
  }

  saveDb();
  res.json(planDay);
});

// 8. Gemini AI Generator Endpoint (Single)
app.post("/api/ai/generate", async (req, res) => {
  const { book, chapter, verse, target, theme, text } = req.body;

  if (!book || !chapter || !verse || !target || !theme) {
    return res.status(400).json({ error: "Missing required parameters (book, chapter, verse, target, theme)" });
  }

  const promptText = `
Anda adalah penulis renungan Kristen yang setia pada Alkitab. Tulis renungan berdasarkan ayat yang diberikan. 

INFO AYAT:
Kitab: ${book}
Pasal: ${chapter}
Ayat: ${verse}
Bunyi Ayat: "${text || 'Ambil teks ayat dari Alkitab versi Terjemahan Baru (TB)'}"

TARGET USIA: ${target === 'children' ? 'Anak-anak (7-12 tahun)' : target === 'teen' ? 'Remaja (13-17 tahun)' : 'Pemuda (18-30 tahun)'}
TEMA KEHIDUPAN: ${theme}

ATURAN PENULISAN:
- Jelaskan konteks teologis/sejarah ayat terlebih dahulu secara sederhana namun akurat.
- Hubungkan pesan rohaninya secara relevan dengan perjuangan kehidupan sehari-hari sesuai target usia tersebut.
- Gunakan gaya bahasa yang hangat, memotivasi, penuh kasih, mudah dipahami, serta tidak mengubah makna sejati Alkitab.
- Sediakan judul renungan yang menarik dan tidak kaku.
- Sediakan ringkasan singkat renungan (1-2 kalimat).
- Sediakan sebuah doa singkat yang tulus.
- Sediakan pertanyaan refleksi (1-2 pertanyaan mendalam).
- Sediakan tantangan praktis hari ini (aktivitas nyata).
- Sediakan judul optimasi SEO, deskripsi meta, slug (menggunakan tanda hubung), dan tag relevan (dalam bentuk array).

Hasilkan output hanya dalam format JSON yang valid dengan skema berikut:
{
  "title": "Judul Renungan yang Menarik",
  "summary": "Ringkasan renungan singkat",
  "content": "Isi lengkap renungan yang kaya makna, hangat, dan mendalam (minimal 3 paragraf)",
  "prayer": "Doa singkat yang hangat",
  "reflection": "Pertanyaan refleksi untuk direnungkan",
  "challenge": "Tantangan praktis tindakan nyata hari ini",
  "seoTitle": "Judul SEO untuk optimasi pencarian",
  "metaDescription": "Deskripsi singkat halaman untuk hasil pencarian Google",
  "slug": "slug-judul-renungan",
  "tags": ["tag1", "tag2", "tag3"]
}
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptText,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            summary: { type: Type.STRING },
            content: { type: Type.STRING },
            prayer: { type: Type.STRING },
            reflection: { type: Type.STRING },
            challenge: { type: Type.STRING },
            seoTitle: { type: Type.STRING },
            metaDescription: { type: Type.STRING },
            slug: { type: Type.STRING },
            tags: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["title", "summary", "content", "prayer", "reflection", "challenge", "seoTitle", "metaDescription", "slug", "tags"]
        }
      }
    });

    const resultText = response.text || "{}";
    const generatedData = JSON.parse(resultText);

    // Create a new verse in our DB if it doesn't exist yet
    let existingVerse = db.verses.find(
      v => v.book.toLowerCase() === book.toLowerCase() && v.chapter === Number(chapter) && v.verse === Number(verse)
    );

    if (!existingVerse) {
      existingVerse = {
        id: "verse-" + Date.now(),
        book,
        chapter: Number(chapter),
        verse: Number(verse),
        text: text || `Teks Ayat untuk ${book} ${chapter}:${verse}`,
        translation: "TB",
        theme
      };
      
      try {
        await supabase.from("verses").insert(existingVerse);
      } catch (err) {
        console.error("Supabase insert verse failed in AI generate:", err);
      }

      db.verses.push(existingVerse);
      saveDb();
    }

    res.json({
      ...generatedData,
      verse_id: existingVerse.id,
      verse: existingVerse
    });
  } catch (error: any) {
    console.error("AI Generation error:", error);
    res.status(500).json({ error: "Gagal memproses AI generator: " + error.message });
  }
});

// 9. AI Bulk Generator Endpoint
app.post("/api/ai/bulk-generate", async (req, res) => {
  const { days, target, theme } = req.body;
  const numDays = Math.min(30, Number(days) || 3); // cap at 30 to avoid timeout/heavy bills

  if (!target || !theme) {
    return res.status(400).json({ error: "Missing target or theme" });
  }

  // Generate a plan list of readings first or let Gemini decide
  const bulkPrompt = `
Hasilkan daftar ${numDays} draf renungan harian Kristen berturut-turut untuk target audiens: ${target} dengan tema umum: ${theme}.
Setiap hari harus memiliki ayat referensi Alkitab yang berbeda (ambil ayat populer, menginspirasi, dan mendalam).

Format output harus berupa JSON Array dengan objek-objek renungan harian dengan struktur berikut:
[
  {
    "title": "Judul Renungan",
    "book": "Nama Kitab Alkitab",
    "chapter": 1,
    "verse": 1,
    "verseText": "Bunyi ayat Alkitab",
    "summary": "Ringkasan renungan",
    "content": "Isi artikel renungan lengkap (minimal 2 paragraf)",
    "prayer": "Doa harian singkat",
    "reflection": "Pertanyaan refleksi diri",
    "challenge": "Tantangan praktis harian",
    "seoTitle": "Judul SEO",
    "metaDescription": "Meta Description",
    "slug": "slug-unik",
    "tags": ["tag1", "tag2"]
  }
]
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: bulkPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              book: { type: Type.STRING },
              chapter: { type: Type.INTEGER },
              verse: { type: Type.INTEGER },
              verseText: { type: Type.STRING },
              summary: { type: Type.STRING },
              content: { type: Type.STRING },
              prayer: { type: Type.STRING },
              reflection: { type: Type.STRING },
              challenge: { type: Type.STRING },
              seoTitle: { type: Type.STRING },
              metaDescription: { type: Type.STRING },
              slug: { type: Type.STRING },
              tags: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["title", "book", "chapter", "verse", "verseText", "summary", "content", "prayer", "reflection", "challenge", "seoTitle", "metaDescription", "slug", "tags"]
          }
        }
      }
    });

    const parsedArray = JSON.parse(response.text || "[]");
    const createdDevotions: any[] = [];

    for (const item of parsedArray) {
      // Create verse
      let existingVerse = db.verses.find(
        v => v.book.toLowerCase() === item.book.toLowerCase() && v.chapter === Number(item.chapter) && v.verse === Number(item.verse)
      );

      if (!existingVerse) {
        existingVerse = {
          id: "verse-" + Date.now() + Math.random().toString(36).substr(2, 4),
          book: item.book,
          chapter: Number(item.chapter),
          verse: Number(item.verse),
          text: item.verseText,
          translation: "TB",
          theme
        };
        
        try {
          await supabase.from("verses").insert(existingVerse);
        } catch (err) {
          console.error("Supabase insert verse failed in AI bulk-generate:", err);
        }

        db.verses.push(existingVerse);
      }

      const randomPublishDate = new Date();
      // stagger dates into future
      randomPublishDate.setDate(randomPublishDate.getDate() + createdDevotions.length + 1);

      const newDev = {
        id: "dev-bulk-" + Date.now() + Math.random().toString(36).substr(2, 4),
        title: item.title,
        slug: item.slug,
        verse_id: existingVerse.id,
        audience: target as any,
        theme,
        content: item.content,
        prayer: item.prayer,
        reflection: item.reflection,
        challenge: item.challenge,
        image: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=800&q=80",
        status: "draft" as const, // initially draft as requested
        publish_date: randomPublishDate.toISOString().split("T")[0],
        created_by: "admin-ai",
        created_at: new Date().toISOString(),
        seo_title: item.seoTitle,
        meta_description: item.metaDescription,
        tags: item.tags
      };

      try {
        await supabase.from("devotions").insert(newDev);
      } catch (err) {
        console.error("Supabase insert devotion failed in AI bulk-generate:", err);
      }

      db.devotions.push(newDev as any);
      createdDevotions.push({
        ...newDev,
        verse: existingVerse
      });
    }

    saveDb();
    res.json(createdDevotions);
  } catch (error: any) {
    console.error("AI Bulk Generation error:", error);
    res.status(500).json({ error: "Gagal memproses AI Bulk generator: " + error.message });
  }
});

// Import Vite dynamically as a dev middleware if in dev environment, or serve statics if production

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode with Vite Middleware.");
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode.");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Firman Hidup] Server is running on http://0.0.0.0:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;
