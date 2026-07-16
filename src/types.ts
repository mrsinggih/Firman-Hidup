/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'editor';
  created_at: string;
}

export interface Verse {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  text: string;
  translation: string;
  theme: string;
}

export interface Devotion {
  id: string;
  title: string;
  slug: string;
  verse_id: string;
  verse?: Verse; // Populated from Verse
  audience: 'children' | 'teen' | 'youth'; // Children = Anak-anak, Teen = Remaja, Youth = Pemuda
  theme: string;
  content: string;
  prayer: string;
  reflection: string;
  challenge: string;
  image: string;
  status: 'draft' | 'published';
  publish_date: string; // e.g., "YYYY-MM-DD" or "1 Januari" etc.
  created_by: string;
  created_at: string;
  summary?: string;
  seo_title?: string;
  meta_description?: string;
  tags?: string[];
}

export interface Theme {
  id: string;
  nama: string;
  icon: string;
}

export interface Donation {
  id: string;
  nama: string;
  email: string;
  jumlah: number;
  pesan: string;
  status: 'pending' | 'success';
  created_at: string;
}

export interface MerchandiseItem {
  id: string;
  nama: string;
  harga: number;
  stok: number;
  gambar: string;
  deskripsi: string;
}

export interface ReadingPlanDay {
  day: number;
  title: string;
  passage: string;
  completed: boolean;
}

export interface Bookmark {
  id: string;
  verseId: string;
  verse: Verse;
  bookmarkedAt: string;
}
