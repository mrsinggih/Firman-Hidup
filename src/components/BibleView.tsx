/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Search, Bookmark, CheckCircle2, ChevronRight, BookOpen, Sparkles, Filter, Check, ListChecks } from "lucide-react";
import { Verse, ReadingPlanDay } from "../types";

interface BibleViewProps {
  verses: Verse[];
  readingPlan: ReadingPlanDay[];
  onToggleReadingPlan: (day: number) => void;
  bookmarks: string[]; // List of bookmarked verse IDs
  onToggleBookmark: (verseId: string) => void;
  onAddVerse: (verse: Omit<Verse, "id">) => void;
}

export default function BibleView({
  verses,
  readingPlan,
  onToggleReadingPlan,
  bookmarks,
  onToggleBookmark,
  onAddVerse
}: BibleViewProps) {
  // Navigation inside Bible Reader
  const [activeSubTab, setActiveSubTab] = useState<'baca' | 'cari' | 'bookmark' | 'plan'>('baca');

  // Book reader selection state
  const [selectedBook, setSelectedBook] = useState<string>("Mazmur");
  const [selectedChapter, setSelectedChapter] = useState<number>(119);

  // Search state
  const [bibleSearchQuery, setBibleSearchQuery] = useState("");

  // Add Custom Verse form state (to let users enrich the scripture)
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBook, setNewBook] = useState("");
  const [newChapter, setNewChapter] = useState(1);
  const [newVerse, setNewVerse] = useState(1);
  const [newText, setNewText] = useState("");
  const [newTheme, setNewTheme] = useState("Iman");

  // Perjanjian Lama vs Perjanjian Baru definition
  const oldTestament = ["Kejadian", "Keluaran", "Imamat", "Bilangan", "Ulangan", "Yosua", "Hakim-hakim", "Rut", "Samuel", "Raja-raja", "Tawarikh", "Ezra", "Nehemia", "Ester", "Ayub", "Mazmur", "Amsal", "Pengkhotbah", "Kidung Agung", "Yesaya", "Yeremia", "Ratapan", "Yehezkiel", "Daniel", "Hosea", "Yoel", "Amos", "Obaja", "Yunus", "Mikha", "Nahum", "Habakuk", "Zefanya", "Hagai", "Zakharia", "Maleakhi"];
  const newTestament = ["Matius", "Markus", "Lukas", "Yohanes", "Kisah Para Rasul", "Roma", "Korintus", "Galatia", "Efesus", "Filipi", "Kolose", "Tesalonika", "Timotius", "Titus", "Filemon", "Ibrani", "Yakobus", "Petrus", "Yohanes_Surat", "Yudas", "Wahyu"];

  // Filter verses in active reading pane
  const currentChapterVerses = verses.filter(
    v => v.book.toLowerCase() === selectedBook.toLowerCase() && v.chapter === selectedChapter
  );

  // Filter verses by general query
  const searchResults = bibleSearchQuery
    ? verses.filter(
        v =>
          v.book.toLowerCase().includes(bibleSearchQuery.toLowerCase()) ||
          v.text.toLowerCase().includes(bibleSearchQuery.toLowerCase()) ||
          v.theme.toLowerCase().includes(bibleSearchQuery.toLowerCase())
      )
    : [];

  const handleAddVerseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBook || !newText) return;
    onAddVerse({
      book: newBook,
      chapter: Number(newChapter),
      verse: Number(newVerse),
      text: newText,
      translation: "TB",
      theme: newTheme
    });
    // Reset
    setNewBook("");
    setNewChapter(1);
    setNewVerse(1);
    setNewText("");
    setShowAddForm(false);
  };

  // Stats for 365 plan
  const completedDaysCount = readingPlan.filter(d => d.completed).length;
  const planProgressPercentage = Math.round((completedDaysCount / readingPlan.length) * 100);

  return (
    <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm flex flex-col min-h-[600px]" id="bible-view">
      {/* Bible Tab Header Controls */}
      <div className="border-b border-slate-100 bg-slate-50 p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex bg-slate-200/60 p-1 rounded-2xl w-full sm:w-auto">
          {[
            { id: "baca", label: "Baca Alkitab", icon: BookOpen },
            { id: "cari", label: "Cari Ayat", icon: Search },
            { id: "bookmark", label: "Bookmark Saya", icon: Bookmark },
            { id: "plan", label: "Reading Plan 365", icon: ListChecks }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                id={`bible-sub-tab-${tab.id}`}
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex items-center justify-center flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeSubTab === tab.id
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Icon className="h-4 w-4 mr-1.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Action Button: Custom Bible Add Form Trigger */}
        {activeSubTab === "baca" && (
          <button
            id="bible-add-verse-btn"
            onClick={() => setShowAddForm(!showAddForm)}
            className="text-xs bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl transition-all shadow-xs cursor-pointer"
          >
            {showAddForm ? "Tutup Form" : "+ Tambah Ayat Baru"}
          </button>
        )}
      </div>

      {/* Main Container Content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12">
        
        {/* SUBTAB 1: Baca Alkitab */}
        {activeSubTab === "baca" && (
          <>
            {/* Sidebar selector for Testament, Books and chapters */}
            <aside className="lg:col-span-4 border-r border-slate-100 p-6 space-y-6 max-h-[600px] overflow-y-auto">
              {showAddForm ? (
                /* Add Custom Verse Panel */
                <form onSubmit={handleAddVerseSubmit} className="space-y-4" id="add-verse-form">
                  <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Tambah Ayat Baru</h3>
                  <div>
                    <label className="block text-xs text-slate-400 font-semibold mb-1">Kitab</label>
                    <input
                      id="new-verse-book"
                      type="text"
                      required
                      placeholder="Contoh: Yohanes"
                      value={newBook}
                      onChange={e => setNewBook(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-slate-400 font-semibold mb-1">Pasal</label>
                      <input
                        id="new-verse-chapter"
                        type="number"
                        required
                        min={1}
                        value={newChapter}
                        onChange={e => setNewChapter(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 font-semibold mb-1">Ayat</label>
                      <input
                        id="new-verse-number"
                        type="number"
                        required
                        min={1}
                        value={newVerse}
                        onChange={e => setNewVerse(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 font-semibold mb-1">Kategori Tema</label>
                    <select
                      id="new-verse-theme"
                      value={newTheme}
                      onChange={e => setNewTheme(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none text-slate-700"
                    >
                      <option value="Iman">Iman</option>
                      <option value="Persahabatan">Persahabatan</option>
                      <option value="Kecemasan">Kecemasan</option>
                      <option value="Sekolah">Sekolah</option>
                      <option value="Masa Depan">Masa Depan</option>
                      <option value="Menghadapi Kegagalan">Menghadapi Kegagalan</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 font-semibold mb-1">Bunyi Ayat</label>
                    <textarea
                      id="new-verse-text"
                      required
                      rows={3}
                      placeholder="Tuliskan bunyi ayat alkitab secara lengkap..."
                      value={newText}
                      onChange={e => setNewText(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs focus:outline-none resize-none"
                    ></textarea>
                  </div>
                  <button
                    id="new-verse-submit-btn"
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg text-xs"
                  >
                    Simpan Ayat
                  </button>
                </form>
              ) : (
                <>
                  {/* Perjanjian Lama Selector */}
                  <div className="space-y-3">
                    <span className="block text-xs font-bold uppercase text-slate-400 tracking-wider">Perjanjian Lama</span>
                    <div className="flex flex-wrap gap-1.5">
                      {oldTestament.map(book => {
                        const isSelected = selectedBook.toLowerCase() === book.toLowerCase();
                        // check if we have any seeded verse for this book
                        const hasVerse = verses.some(v => v.book.toLowerCase() === book.toLowerCase());
                        return (
                          <button
                            id={`book-old-${book.toLowerCase()}`}
                            key={book}
                            onClick={() => {
                              setSelectedBook(book);
                              setSelectedChapter(book === "Mazmur" ? 119 : 1);
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                              isSelected
                                ? "bg-blue-600 text-white border-blue-600"
                                : hasVerse
                                ? "bg-blue-50 text-blue-800 border-blue-100 hover:bg-blue-100"
                                : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                            }`}
                          >
                            {book}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Perjanjian Baru Selector */}
                  <div className="space-y-3 pt-4 border-t border-slate-100">
                    <span className="block text-xs font-bold uppercase text-slate-400 tracking-wider">Perjanjian Baru</span>
                    <div className="flex flex-wrap gap-1.5">
                      {newTestament.map(book => {
                        const isSelected = selectedBook.toLowerCase() === book.toLowerCase();
                        const hasVerse = verses.some(v => v.book.toLowerCase() === book.toLowerCase());
                        return (
                          <button
                            id={`book-new-${book.toLowerCase()}`}
                            key={book}
                            onClick={() => {
                              setSelectedBook(book);
                              setSelectedChapter(book === "Yohanes" ? 3 : 1);
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                              isSelected
                                ? "bg-blue-600 text-white border-blue-600"
                                : hasVerse
                                ? "bg-blue-50 text-blue-800 border-blue-100 hover:bg-blue-100"
                                : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                            }`}
                          >
                            {book}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </aside>

            {/* Reading View Screen */}
            <main className="lg:col-span-8 p-8 space-y-6 max-h-[600px] overflow-y-auto">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-3xl font-extrabold text-slate-800 font-display">
                    {selectedBook} {selectedChapter}
                  </h2>
                  <p className="text-xs text-slate-400 font-semibold mt-1">Terjemahan Baru (TB)</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-slate-400 font-bold">Pasal:</span>
                  <div className="flex space-x-1">
                    {[1, 3, 15, 119].map(chap => {
                      // restrict options based on selected book logic
                      if (selectedBook === "Mazmur" && chap !== 119 && chap !== 1) return null;
                      if (selectedBook === "Yohanes" && chap !== 3 && chap !== 15 && chap !== 1) return null;
                      if (selectedBook !== "Mazmur" && selectedBook !== "Yohanes" && chap !== 1) return null;
                      return (
                        <button
                          key={chap}
                          onClick={() => setSelectedChapter(chap)}
                          className={`w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center transition-all ${
                            selectedChapter === chap ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                          }`}
                        >
                          {chap}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Verses Output */}
              <div className="space-y-6">
                {currentChapterVerses.length > 0 ? (
                  currentChapterVerses.map(v => (
                    <div
                      id={`verse-read-item-${v.id}`}
                      key={v.id}
                      className="group flex gap-4 items-start p-4 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100"
                    >
                      <span className="text-blue-600 font-extrabold text-sm w-6 pt-0.5 text-right">{v.verse}</span>
                      <div className="flex-1 space-y-2">
                        <p className="text-slate-800 font-serif leading-relaxed text-base sm:text-lg">
                          {v.text}
                        </p>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all pt-1">
                          <button
                            id={`verse-bookmark-btn-${v.id}`}
                            onClick={() => onToggleBookmark(v.id)}
                            className="flex items-center text-[10px] font-bold text-slate-500 hover:text-amber-600 bg-slate-100 hover:bg-amber-50 px-2 py-1 rounded-md transition-all"
                          >
                            <Bookmark className={`h-3 w-3 mr-1 ${bookmarks.includes(v.id) ? 'fill-current text-amber-500' : ''}`} />
                            {bookmarks.includes(v.id) ? "Tersimpan" : "Simpan Bookmark"}
                          </button>
                          <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-md capitalize">
                            Tema: {v.theme}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-slate-400 bg-slate-50/50 rounded-2xl border border-dashed space-y-2">
                    <p className="font-semibold text-sm">Belum ada data ayat terunggah untuk pasal ini.</p>
                    <p className="text-xs">Gunakan tombol "+ Tambah Ayat Baru" di kanan atas untuk menyumbangkan ayat Alkitab!</p>
                  </div>
                )}
              </div>
            </main>
          </>
        )}

        {/* SUBTAB 2: Cari Ayat */}
        {activeSubTab === "cari" && (
          <main className="lg:col-span-12 p-8 space-y-6">
            <div className="max-w-2xl mx-auto space-y-4 text-center">
              <h2 className="text-2xl font-bold font-display">Cari Ayat Alkitab</h2>
              <p className="text-xs text-slate-500">Temukan ayat-ayat Alkitab berdasarkan kata kunci, nama kitab, atau tema kehidupan.</p>
              
              <div className="relative">
                <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                <input
                  id="bible-search-input-tab"
                  type="text"
                  placeholder="Ketik kitab, tema, atau bunyi ayat (misal: Mazmur, pelita, cemas...)"
                  value={bibleSearchQuery}
                  onChange={e => setBibleSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-blue-500 text-slate-800 font-medium shadow-xs"
                />
              </div>
            </div>

            {/* Results Grid */}
            <div className="max-w-3xl mx-auto space-y-4">
              {bibleSearchQuery ? (
                searchResults.length > 0 ? (
                  searchResults.map(v => (
                    <div
                      id={`bible-search-result-${v.id}`}
                      key={v.id}
                      className="bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-md transition-all space-y-3"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-extrabold text-blue-600 font-display text-sm">
                          {v.book} {v.chapter}:{v.verse}
                        </span>
                        <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2.5 py-0.5 rounded-full capitalize">
                          {v.theme}
                        </span>
                      </div>
                      <p className="text-slate-700 font-serif leading-relaxed italic text-base">
                        "{v.text}"
                      </p>
                      <div className="flex justify-end pt-2 border-t border-slate-50">
                        <button
                          id={`bible-search-bm-btn-${v.id}`}
                          onClick={() => onToggleBookmark(v.id)}
                          className="flex items-center text-[10px] font-bold text-slate-500 hover:text-amber-600 bg-slate-50 px-2.5 py-1 rounded-md transition-all"
                        >
                          <Bookmark className={`h-3 w-3 mr-1.5 ${bookmarks.includes(v.id) ? 'fill-current text-amber-500' : ''}`} />
                          {bookmarks.includes(v.id) ? "Simpanan" : "Simpan"}
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-slate-400">
                    Tidak ada ayat yang cocok dengan kata kunci "{bibleSearchQuery}"
                  </div>
                )
              ) : (
                <div className="text-center py-12 text-slate-400 space-y-2">
                  <p className="font-semibold text-sm">Mulai mengetik untuk mencari ayat...</p>
                  <p className="text-xs">Sistem akan menyaring kumpulan data Alkitab Terjemahan Baru secara instan.</p>
                </div>
              )}
            </div>
          </main>
        )}

        {/* SUBTAB 3: Bookmark Saya */}
        {activeSubTab === "bookmark" && (
          <main className="lg:col-span-12 p-8 space-y-6">
            <div>
              <h2 className="text-2xl font-bold font-display text-slate-800">Bookmark Saya</h2>
              <p className="text-xs text-slate-500 mt-1">Daftar ayat-ayat Alkitab favorit Anda yang Anda simpan untuk dibaca kembali.</p>
            </div>

            <div className="max-w-3xl mx-auto space-y-4">
              {bookmarks.length > 0 ? (
                verses
                  .filter(v => bookmarks.includes(v.id))
                  .map(v => (
                    <div
                      id={`bible-bookmark-item-${v.id}`}
                      key={v.id}
                      className="bg-white border border-slate-100 rounded-2xl p-6 relative overflow-hidden space-y-3"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-extrabold text-blue-600 font-display text-sm">
                          {v.book} {v.chapter}:{v.verse}
                        </span>
                        <button
                          id={`bible-unbookmark-btn-${v.id}`}
                          onClick={() => onToggleBookmark(v.id)}
                          className="text-slate-400 hover:text-red-500 p-1 rounded-lg transition-all"
                          title="Hapus Bookmark"
                        >
                          <Bookmark className="h-4 w-4 fill-current text-amber-500" />
                        </button>
                      </div>
                      <p className="text-slate-700 font-serif leading-relaxed italic text-base">
                        "{v.text}"
                      </p>
                      <span className="inline-block bg-slate-100 text-slate-600 text-[10px] font-semibold px-2 py-0.5 rounded-md">
                        Kategori: {v.theme}
                      </span>
                    </div>
                  ))
              ) : (
                <div className="text-center py-12 text-slate-400 space-y-2">
                  <p className="font-semibold text-sm">Belum ada ayat yang dibookmark.</p>
                  <p className="text-xs">Klik tombol ikon bookmark di samping ayat saat membaca Alkitab.</p>
                </div>
              )}
            </div>
          </main>
        )}

        {/* SUBTAB 4: Reading Plan 365 Hari */}
        {activeSubTab === "plan" && (
          <main className="lg:col-span-12 p-8 space-y-6 max-h-[600px] overflow-y-auto">
            <div className="bg-slate-900 text-white p-8 rounded-3xl relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="space-y-3 max-w-lg">
                <span className="inline-flex bg-amber-400 text-amber-950 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Misi 365 Hari
                </span>
                <h3 className="text-2xl font-bold font-display">Rencana Pembacaan Alkitab 365 Hari</h3>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Tantang diri Anda untuk membaca seluruh Alkitab secara terstruktur dalam 1 tahun. Klik kotak centang pada setiap hari membaca yang telah Anda selesaikan.
                </p>
              </div>

              {/* Progress Circle or Bar */}
              <div className="text-center bg-slate-800 p-6 rounded-2xl border border-slate-700 w-full md:w-56 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pencapaian Anda</span>
                <span className="text-4xl font-extrabold text-amber-400 font-display block">
                  {planProgressPercentage}%
                </span>
                <span className="text-xs text-slate-300 block">
                  {completedDaysCount} / {readingPlan.length} Hari Selesai
                </span>
                <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
                  <div className="bg-amber-400 h-2 rounded-full" style={{ width: `${planProgressPercentage}%` }}></div>
                </div>
              </div>
            </div>

            {/* Plan Grid */}
            <div className="space-y-4">
              <h3 className="font-bold text-slate-800 text-lg font-display">Kalender Progress 365 Hari</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                {readingPlan.map(day => (
                  <div
                    id={`reading-plan-day-${day.day}`}
                    key={day.day}
                    onClick={() => onToggleReadingPlan(day.day)}
                    className={`border p-3.5 rounded-2xl cursor-pointer transition-all flex flex-col justify-between h-24 ${
                      day.completed
                        ? "bg-green-50 border-green-200 text-green-950"
                        : "bg-white border-slate-100 hover:border-slate-300 hover:shadow-xs"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Hari {day.day}
                      </span>
                      {day.completed && <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />}
                    </div>
                    <div className="mt-1">
                      <p className={`text-xs font-bold font-display truncate ${day.completed ? "text-green-900" : "text-slate-800"}`}>
                        {day.passage}
                      </p>
                      <span className="text-[10px] text-slate-400 block truncate mt-0.5">365-Plan</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        )}

      </div>
    </div>
  );
}
