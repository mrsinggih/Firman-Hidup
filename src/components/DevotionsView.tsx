/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Search, Filter, BookOpen, Volume2, Share2, ArrowLeft, Bookmark, Sparkles, Check, HelpCircle, Flame } from "lucide-react";
import { Devotion, Theme } from "../types";

interface DevotionsViewProps {
  devotions: Devotion[];
  themes: Theme[];
  bookmarks: string[]; // List of bookmarked verse IDs
  onToggleBookmark: (verseId: string) => void;
  selectedDevotion: Devotion | null;
  onSelectDevotion: (devotion: Devotion | null) => void;
}

export default function DevotionsView({
  devotions,
  themes,
  bookmarks,
  onToggleBookmark,
  selectedDevotion,
  onSelectDevotion
}: DevotionsViewProps) {
  // Filters state
  const [selectedAudience, setSelectedAudience] = useState<string>("all");
  const [selectedTheme, setSelectedTheme] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Sound play simulation
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Text size state for comfortable reading
  const [textSize, setTextSize] = useState<'normal' | 'large' | 'xlarge'>('normal');

  // Filter logic
  const filteredDevotions = devotions.filter(dev => {
    const matchAudience = selectedAudience === "all" || dev.audience === selectedAudience;
    const matchTheme = selectedTheme === "all" || dev.theme === selectedTheme;
    const matchSearch =
      searchQuery === "" ||
      dev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dev.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (dev.verse && dev.verse.book.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (dev.tags && dev.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchAudience && matchTheme && matchSearch;
  });

  const handleCopyLink = () => {
    setIsCopied(true);
    navigator.clipboard.writeText(window.location.href);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const simulateSpeech = () => {
    if (isPlayingAudio) {
      setIsPlayingAudio(false);
      return;
    }
    setIsPlayingAudio(true);
    // Simulating reading completion
    setTimeout(() => setIsPlayingAudio(false), 15000);
  };

  return (
    <div className="space-y-6 pb-16" id="devotions-view">
      {selectedDevotion ? (
        /* Detailed Article View */
        <article className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-xl" id="devotion-detail">
          {/* Header Image Cover */}
          <div className="relative h-72 sm:h-96 w-full">
            <img
              src={selectedDevotion.image}
              alt={selectedDevotion.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent"></div>
            
            {/* Back Button */}
            <button
              id="devotion-detail-back-btn"
              onClick={() => onSelectDevotion(null)}
              className="absolute top-6 left-6 flex items-center bg-white/90 backdrop-blur-xs text-slate-800 px-4 py-2 rounded-xl text-xs font-bold shadow-md hover:bg-white transition-all"
            >
              <ArrowLeft className="h-4 w-4 mr-1.5" />
              Kembali
            </button>

            {/* Top Right Actions */}
            <div className="absolute top-6 right-6 flex space-x-2">
              {selectedDevotion.verse && (
                <button
                  id={`devotion-bookmark-btn-${selectedDevotion.id}`}
                  onClick={() => onToggleBookmark(selectedDevotion.verse_id)}
                  className={`p-2 rounded-xl backdrop-blur-xs shadow-md transition-all ${
                    bookmarks.includes(selectedDevotion.verse_id)
                      ? "bg-amber-500 text-white hover:bg-amber-600"
                      : "bg-white/90 text-slate-700 hover:bg-white"
                  }`}
                  title="Simpan Bookmark Ayat"
                >
                  <Bookmark className="h-4 w-4 fill-current" />
                </button>
              )}
              <button
                id="devotion-share-btn"
                onClick={handleCopyLink}
                className="p-2 rounded-xl bg-white/90 text-slate-700 hover:bg-white shadow-md transition-all"
                title="Salin Tautan"
              >
                {isCopied ? <Check className="h-4 w-4 text-green-600" /> : <Share2 className="h-4 w-4" />}
              </button>
            </div>

            {/* Title / Meta on Image */}
            <div className="absolute bottom-8 left-8 right-8 text-white space-y-3">
              <div className="flex flex-wrap gap-2">
                <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                  {selectedDevotion.audience === "children" ? "Anak-Anak" : selectedDevotion.audience === "teen" ? "Remaja" : "Pemuda"}
                </span>
                <span className="bg-slate-800/80 text-slate-100 text-xs font-semibold px-3 py-1 rounded-full">
                  {selectedDevotion.theme}
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold font-display leading-tight">
                {selectedDevotion.title}
              </h1>
              {selectedDevotion.verse && (
                <p className="text-blue-300 text-sm sm:text-base font-semibold">
                  Nats: {selectedDevotion.verse.book} {selectedDevotion.verse.chapter}:{selectedDevotion.verse.verse} ({selectedDevotion.verse.translation})
                </p>
              )}
            </div>
          </div>

          <div className="p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Article Body */}
            <div className="lg:col-span-8 space-y-8">
              {/* Controls bar: TTS & Font resizing */}
              <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <button
                  id="devotion-tts-btn"
                  onClick={simulateSpeech}
                  className={`flex items-center text-xs font-bold px-4 py-2 rounded-xl transition-all ${
                    isPlayingAudio
                      ? "bg-red-500 text-white animate-pulse"
                      : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                  }`}
                >
                  <Volume2 className="h-4 w-4 mr-2" />
                  {isPlayingAudio ? "Menghentikan Audio..." : "Dengarkan Audio (TTS)"}
                </button>

                <div className="flex items-center space-x-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Ukuran Huruf</span>
                  <div className="flex bg-slate-200 p-1 rounded-lg">
                    <button
                      onClick={() => setTextSize('normal')}
                      className={`text-xs px-2.5 py-1 rounded-md font-semibold ${textSize === 'normal' ? 'bg-white shadow-xs text-slate-800' : 'text-slate-500'}`}
                    >
                      A
                    </button>
                    <button
                      onClick={() => setTextSize('large')}
                      className={`text-sm px-2.5 py-1 rounded-md font-semibold ${textSize === 'large' ? 'bg-white shadow-xs text-slate-800' : 'text-slate-500'}`}
                    >
                      A+
                    </button>
                    <button
                      onClick={() => setTextSize('xlarge')}
                      className={`text-base px-2.5 py-1 rounded-md font-semibold ${textSize === 'xlarge' ? 'bg-white shadow-xs text-slate-800' : 'text-slate-500'}`}
                    >
                      A++
                    </button>
                  </div>
                </div>
              </div>

              {/* Bible Verse Box */}
              {selectedDevotion.verse && (
                <div className="bg-amber-50/50 border-l-4 border-amber-500 p-6 rounded-r-2xl">
                  <p className="text-slate-800 font-serif italic text-base leading-relaxed">
                    "{selectedDevotion.verse.text}"
                  </p>
                  <span className="block mt-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    — {selectedDevotion.verse.book} {selectedDevotion.verse.chapter}:{selectedDevotion.verse.verse} ({selectedDevotion.verse.translation})
                  </span>
                </div>
              )}

              {/* Devotion Content */}
              <div className={`text-slate-700 leading-relaxed space-y-4 whitespace-pre-line ${
                textSize === 'normal' ? 'text-base' : textSize === 'large' ? 'text-lg' : 'text-xl'
              }`}>
                {selectedDevotion.content}
              </div>

              {/* Prayer Box */}
              <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6 space-y-2">
                <h3 className="text-blue-800 font-bold flex items-center font-display">
                  <Flame className="h-4 w-4 mr-2" />
                  Doa Hari Ini
                </h3>
                <p className="text-slate-700 italic">
                  {selectedDevotion.prayer}
                </p>
              </div>
            </div>

            {/* Right Column: Interaction, Reflection, Challenges */}
            <div className="lg:col-span-4 space-y-6">
              {/* Questions of Reflection */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 space-y-4">
                <h3 className="text-slate-800 font-bold flex items-center font-display">
                  <HelpCircle className="h-5 w-5 text-indigo-500 mr-2" />
                  Pertanyaan Refleksi
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {selectedDevotion.reflection}
                </p>
              </div>

              {/* Challenge Box */}
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-yellow-200/50 rounded-2xl p-6 space-y-4">
                <h3 className="text-amber-800 font-bold flex items-center font-display">
                  <Sparkles className="h-5 w-5 text-amber-500 mr-2" />
                  Tantangan Hari Ini
                </h3>
                <p className="text-slate-700 text-sm leading-relaxed font-medium">
                  {selectedDevotion.challenge}
                </p>
              </div>

              {/* Metadata tags */}
              {selectedDevotion.tags && selectedDevotion.tags.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tag Relevan</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedDevotion.tags.map(tag => (
                      <span key={tag} className="bg-slate-100 text-slate-600 text-xs px-2.5 py-1 rounded-md font-medium">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </article>
      ) : (
        /* Grid Articles List with Sidebar Filter */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:col-span-3 space-y-6">
            {/* Search Input */}
            <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs space-y-2">
              <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider">Pencarian</label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  id="devotion-search-input"
                  type="text"
                  placeholder="Cari kata kunci..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500 text-slate-700"
                />
              </div>
            </div>

            {/* Target Audience Filters */}
            <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs space-y-3">
              <span className="block text-xs font-bold uppercase text-slate-400 tracking-wider">Target Pembaca</span>
              <div className="flex flex-col space-y-1">
                {[
                  { id: "all", label: "Semua Kelompok Usia" },
                  { id: "children", label: "Anak-Anak (7-12 th)" },
                  { id: "teen", label: "Remaja (13-17 th)" },
                  { id: "youth", label: "Pemuda (18-30 th)" }
                ].map(aud => (
                  <button
                    id={`filter-audience-${aud.id}`}
                    key={aud.id}
                    onClick={() => setSelectedAudience(aud.id)}
                    className={`text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      selectedAudience === aud.id
                        ? "bg-blue-600 text-white"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {aud.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Category / Theme Filters */}
            <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs space-y-3">
              <span className="block text-xs font-bold uppercase text-slate-400 tracking-wider">Kategori Tema</span>
              <div className="grid grid-cols-1 gap-1 max-h-64 overflow-y-auto pr-1">
                <button
                  id="filter-theme-all"
                  onClick={() => setSelectedTheme("all")}
                  className={`text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedTheme === "all" ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  Semua Tema
                </button>
                {themes.map(th => (
                  <button
                    id={`filter-theme-${th.nama.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                    key={th.id}
                    onClick={() => setSelectedTheme(th.nama)}
                    className={`text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      selectedTheme === th.nama
                        ? "bg-blue-50 text-blue-600"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {th.nama}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Devotions Grid Output */}
          <main className="lg:col-span-9 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 font-display">Galeri Renungan</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Menampilkan {filteredDevotions.length} artikel dari {devotions.length} total renungan
                </p>
              </div>
            </div>

            {filteredDevotions.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDevotions.map(dev => (
                  <div
                    id={`devotion-card-${dev.id}`}
                    key={dev.id}
                    onClick={() => onSelectDevotion(dev)}
                    className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 cursor-pointer group flex flex-col justify-between"
                  >
                    <div className="relative h-44 overflow-hidden bg-slate-100">
                      <img
                        src={dev.image}
                        alt={dev.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-3 left-3 flex gap-1">
                        <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full capitalize">
                          {dev.audience === "children" ? "Anak" : dev.audience === "teen" ? "Remaja" : "Pemuda"}
                        </span>
                        <span className="bg-slate-900/80 text-slate-200 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                          {dev.theme}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        {dev.verse && (
                          <span className="text-[10px] font-bold text-blue-600 tracking-wide uppercase">
                            {dev.verse.book} {dev.verse.chapter}:{dev.verse.verse}
                          </span>
                        )}
                        <h3 className="text-slate-800 font-bold text-base font-display leading-tight group-hover:text-blue-600 transition-colors line-clamp-2 mt-0.5">
                          {dev.title}
                        </h3>
                        <p className="text-slate-500 text-xs line-clamp-2 mt-1.5 leading-relaxed">
                          {dev.summary}
                        </p>
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-50 pt-3">
                        <span className="text-[10px] text-slate-400 font-medium">
                          {dev.publish_date}
                        </span>
                        <span className="text-xs font-bold text-blue-600 flex items-center group-hover:translate-x-1 transition-transform">
                          Baca
                          <ChevronIcon />
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center space-y-2">
                <p className="text-slate-400 font-medium text-lg">Tidak ada renungan ditemukan</p>
                <p className="text-slate-400 text-xs">Coba sesuaikan kata kunci pencarian atau kombinasi filter Anda.</p>
              </div>
            )}
          </main>
        </div>
      )}
    </div>
  );
}

function ChevronIcon() {
  return (
    <svg className="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
    </svg>
  );
}
