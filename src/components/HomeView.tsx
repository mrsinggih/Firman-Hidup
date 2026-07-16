/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { BookOpen, Flame, Heart, ShoppingBag, ArrowRight, BookOpenCheck, Users, Sparkles, Send, Check } from "lucide-react";
import { Devotion, Verse, MerchandiseItem } from "../types";

interface HomeViewProps {
  featuredDevotion: Devotion | null;
  verseOfDay: Verse | null;
  recentDevotions: Devotion[];
  popularDevotions: Devotion[];
  donationStats: { target: number; collected: number; needed: number };
  onNavigateTab: (tab: string) => void;
  onSelectDevotion: (devotion: Devotion) => void;
  merchandises: MerchandiseItem[];
  onSelectMerchandise: (item: MerchandiseItem) => void;
}

export default function HomeView({
  featuredDevotion,
  verseOfDay,
  recentDevotions,
  popularDevotions,
  donationStats,
  onNavigateTab,
  onSelectDevotion,
  merchandises,
  onSelectMerchandise
}: HomeViewProps) {
  // Prayer request form state
  const [prayerName, setPrayerName] = useState("");
  const [prayerRequest, setPrayerRequest] = useState("");
  const [prayerSubmitted, setPrayerSubmitted] = useState(false);

  const handlePrayerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prayerRequest.trim()) return;
    setPrayerSubmitted(true);
    setTimeout(() => {
      setPrayerName("");
      setPrayerRequest("");
      setPrayerSubmitted(false);
    }, 4000);
  };

  const percentage = Math.round((donationStats.collected / donationStats.target) * 100);

  return (
    <div className="space-y-12 pb-16" id="home-view">
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white py-20 px-4 sm:px-6 lg:px-8 rounded-3xl shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent"></div>
        <div className="relative max-w-4xl mx-auto text-center space-y-6">
          <span className="inline-flex items-center bg-blue-500/20 text-blue-300 text-xs font-semibold px-3 py-1 rounded-full border border-blue-500/30 uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
            Renungan Kristen Harian Multi-Generasi
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight font-display bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-blue-200">
            Membangun Iman Melalui Firman
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto font-light">
            Satu ayat Alkitab, tiga pembahasan mendalam yang disesuaikan khusus untuk Anak-anak, Remaja, dan Pemuda. Sambutlah kebenaran Tuhan setiap hari.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <button
              id="hero-read-alkitab-btn"
              onClick={() => onNavigateTab("alkitab")}
              className="flex items-center justify-center bg-white text-indigo-900 hover:bg-slate-100 px-8 py-3 rounded-2xl font-bold transition-all duration-200 shadow-lg shadow-white/5 cursor-pointer"
            >
              <BookOpenCheck className="h-5 w-5 mr-2 text-indigo-600" />
              Mulai Baca Alkitab
            </button>
            <button
              id="hero-read-renungan-btn"
              onClick={() => onNavigateTab("renungan")}
              className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl font-bold transition-all duration-200 shadow-lg shadow-blue-500/20 cursor-pointer"
            >
              Jelajahi Renungan
              <ArrowRight className="h-5 w-5 ml-2" />
            </button>
          </div>
        </div>
      </section>

      {/* Featured Devotion & Verse of the Day Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Featured Devotion */}
        <div className="lg:col-span-7 space-y-4">
          <h2 className="text-2xl font-bold text-slate-800 font-display flex items-center">
            <Flame className="h-6 w-6 text-orange-500 mr-2" />
            Renungan Hari Ini
          </h2>
          {featuredDevotion ? (
            <div
              id={`featured-devotion-card`}
              onClick={() => onSelectDevotion(featuredDevotion)}
              className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-lg shadow-slate-100 hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col h-full"
            >
              <div className="relative h-64 sm:h-80 overflow-hidden">
                <img
                  src={featuredDevotion.image}
                  alt={featuredDevotion.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full capitalize">
                    {featuredDevotion.audience === "children" ? "Anak-anak" : featuredDevotion.audience === "teen" ? "Remaja" : "Pemuda"}
                  </span>
                  <span className="bg-slate-900/80 text-slate-200 text-xs font-semibold px-3 py-1 rounded-full">
                    {featuredDevotion.theme}
                  </span>
                </div>
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <p className="text-xs font-semibold tracking-wider text-blue-300 uppercase mb-1">
                    {featuredDevotion.verse ? `${featuredDevotion.verse.book} ${featuredDevotion.verse.chapter}:${featuredDevotion.verse.verse}` : ""}
                  </p>
                  <h3 className="text-2xl font-bold leading-tight font-display group-hover:text-blue-200 transition-colors">
                    {featuredDevotion.title}
                  </h3>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  {featuredDevotion.summary}
                </p>
                <div className="flex items-center justify-between border-t border-slate-50 pt-4">
                  <span className="text-xs text-slate-400 font-medium">
                    Diterbitkan: {featuredDevotion.publish_date}
                  </span>
                  <span className="text-sm font-bold text-blue-600 flex items-center">
                    Baca Lengkap
                    <ArrowRight className="h-4 w-4 ml-1.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-100 rounded-3xl p-8 text-center text-slate-400">
              Belum ada renungan terpilih hari ini.
            </div>
          )}
        </div>

        {/* Right: Verse of the Day & Quick Bible CTA */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-800 font-display flex items-center">
              <Sparkles className="h-6 w-6 text-yellow-500 mr-2" />
              Ayat Hari Ini
            </h2>
            {verseOfDay ? (
              <div id="verse-of-day-card" className="bg-gradient-to-br from-amber-50 to-orange-50 border border-orange-100 rounded-3xl p-8 shadow-xs flex flex-col justify-between relative overflow-hidden min-h-[250px]">
                <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-8 text-orange-200/20 pointer-events-none">
                  <BookOpen className="h-40 w-40" />
                </div>
                <div className="space-y-4 relative z-10">
                  <span className="inline-flex bg-orange-100 text-orange-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {verseOfDay.theme}
                  </span>
                  <p className="text-slate-800 font-serif text-lg leading-relaxed italic">
                    "{verseOfDay.text}"
                  </p>
                </div>
                <div className="pt-6 border-t border-orange-200/50 mt-4 flex items-center justify-between relative z-10">
                  <p className="font-bold text-orange-950 font-display">
                    {verseOfDay.book} {verseOfDay.chapter}:{verseOfDay.verse}
                  </p>
                  <span className="text-xs text-orange-600 font-semibold bg-orange-200/30 px-2 py-0.5 rounded-md">
                    {verseOfDay.translation}
                  </span>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-slate-100 rounded-3xl p-8 text-center text-slate-400">
                Memuat ayat hari ini...
              </div>
            )}
          </div>

          {/* Banner Donasi 1000 Alkitab (Interactive Preview) */}
          <div
            id="home-donation-banner"
            onClick={() => onNavigateTab("donasi")}
            className="bg-blue-600 text-white rounded-3xl p-8 shadow-lg shadow-blue-100 hover:shadow-xl transition-all duration-300 cursor-pointer relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 transform translate-x-12 -translate-y-12 text-blue-500/30 pointer-events-none group-hover:scale-110 transition-transform duration-300">
              <Heart className="h-48 w-48" />
            </div>
            <div className="relative z-10 space-y-4">
              <span className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Gerakan Berbagi
              </span>
              <h3 className="text-2xl font-bold font-display">Donasi 1.000 Alkitab</h3>
              <p className="text-blue-100 text-sm leading-relaxed">
                Salurkan Alkitab untuk saudara-saudari kita di pelosok Nusantara yang sangat merindukan firman Tuhan.
              </p>
              
              {/* Progress Bar */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-xs font-bold text-blue-100">
                  <span>Progres: {donationStats.collected} Alkitab</span>
                  <span>{percentage}%</span>
                </div>
                <div className="w-full bg-blue-800 rounded-full h-3">
                  <div className="bg-amber-400 h-3 rounded-full transition-all duration-500" style={{ width: `${percentage}%` }}></div>
                </div>
                <div className="flex justify-between text-xs text-blue-200 pt-1">
                  <span>Target: {donationStats.target}</span>
                  <span>Butuh: {donationStats.needed}</span>
                </div>
              </div>

              <div className="pt-2 flex items-center text-sm font-bold text-amber-300">
                Donasi Sekarang
                <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Recent & Popular Devotions */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Recent Devotions */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-800 font-display">Renungan Terbaru</h2>
            <button
              onClick={() => onNavigateTab("renungan")}
              className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center"
            >
              Lihat Semua <ChevronIcon />
            </button>
          </div>
          <div className="space-y-4">
            {recentDevotions.slice(0, 3).map(dev => (
              <div
                id={`recent-dev-item-${dev.id}`}
                key={dev.id}
                onClick={() => onSelectDevotion(dev)}
                className="flex gap-4 p-4 bg-white border border-slate-100 rounded-2xl hover:border-blue-100 hover:shadow-md transition-all duration-200 cursor-pointer group"
              >
                <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0">
                  <img src={dev.image} alt={dev.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="flex flex-col justify-between flex-1 min-w-0">
                  <div>
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">{dev.theme}</span>
                    <h3 className="text-slate-800 font-bold text-base truncate font-display group-hover:text-blue-600 transition-colors">
                      {dev.title}
                    </h3>
                    <p className="text-slate-500 text-xs truncate mt-0.5">{dev.summary}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">{dev.audience === "children" ? "Anak" : dev.audience === "teen" ? "Remaja" : "Pemuda"} • {dev.publish_date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Devotions */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-800 font-display">Renungan Populer</h2>
            <button
              onClick={() => onNavigateTab("renungan")}
              className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center"
            >
              Lihat Semua <ChevronIcon />
            </button>
          </div>
          <div className="space-y-4">
            {popularDevotions.slice(0, 3).map((dev, idx) => (
              <div
                id={`popular-dev-item-${dev.id}`}
                key={dev.id}
                onClick={() => onSelectDevotion(dev)}
                className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl hover:border-blue-100 hover:shadow-md transition-all duration-200 cursor-pointer group"
              >
                <div className="text-3xl font-extrabold text-blue-100 w-10 text-center shrink-0">
                  {String(idx + 1).padStart(2, '0')}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{dev.theme}</span>
                  <h3 className="text-slate-800 font-bold text-base truncate font-display group-hover:text-blue-600 transition-colors">
                    {dev.title}
                  </h3>
                  <p className="text-slate-400 text-xs">{dev.publish_date} • {dev.audience === "children" ? "Anak-anak" : dev.audience === "teen" ? "Remaja" : "Pemuda"}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Merchandise Christianity Highlights */}
      <section className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 font-display">Merchandise Pilihan</h2>
            <p className="text-xs text-slate-500 mt-1">Keuntungan penjualan digunakan 100% untuk mendanai operasional pelayanan digital</p>
          </div>
          <button
            onClick={() => onNavigateTab("merchandise")}
            className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center"
          >
            Lihat Toko <ChevronIcon />
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {merchandises.slice(0, 4).map(item => (
            <div
              id={`home-merch-item-${item.id}`}
              key={item.id}
              onClick={() => onSelectMerchandise(item)}
              className="bg-white border border-slate-100 rounded-2xl p-4 hover:shadow-lg transition-all duration-300 cursor-pointer group flex flex-col"
            >
              <div className="aspect-square rounded-xl overflow-hidden mb-4 bg-slate-50">
                <img src={item.gambar} alt={item.nama} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" referrerPolicy="no-referrer" />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 line-clamp-1 group-hover:text-blue-600 transition-colors font-display">{item.nama}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">{item.deskripsi}</p>
                </div>
                <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-50">
                  <span className="text-sm font-extrabold text-blue-600">Rp {item.harga.toLocaleString("id-ID")}</span>
                  <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">Stok: {item.stok}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tim Pendoa (Prayer Request Submission) */}
      <section className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden">
        <div className="absolute bottom-0 right-0 transform translate-x-12 translate-y-12 text-slate-800 pointer-events-none opacity-20">
          <Users className="h-64 w-64" />
        </div>
        <div className="max-w-3xl relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-6 space-y-4">
            <span className="inline-flex items-center bg-blue-500/20 text-blue-300 text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
              Dukungan Doa
            </span>
            <h2 className="text-3xl font-extrabold font-display leading-tight">Apakah Anda Sedang Mengalami Pergumulan?</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Tim pendoa Firman Hidup siap mendukung dan mendoakan pergumulan Anda secara pribadi. Semua permohonan doa dijaga kerahasiaannya.
            </p>
            <div className="flex items-center space-x-3 text-sm text-slate-300 bg-slate-800/50 p-4 rounded-xl border border-slate-800">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span><strong>8 Relawan Pendoa</strong> sedang aktif melayani hari ini.</span>
            </div>
          </div>

          <div className="md:col-span-6 bg-slate-800/80 border border-slate-700/50 p-6 sm:p-8 rounded-2xl shadow-xl">
            {prayerSubmitted ? (
              <div id="prayer-submitted-success" className="text-center py-8 space-y-4">
                <div className="mx-auto w-12 h-12 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center">
                  <Check className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-lg">Permohonan Doa Diterima</h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Terima kasih sudah berbagi beban. Tim kami akan mendoakan permohonan doa Anda secara khusus dalam doa fajar kami. Tuhan Yesus memberkati.
                </p>
              </div>
            ) : (
              <form onSubmit={handlePrayerSubmit} className="space-y-4" id="prayer-form">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-1">Nama / Inisial</label>
                  <input
                    id="prayer-input-name"
                    type="text"
                    placeholder="Contoh: Sarah / Hamba Allah"
                    value={prayerName}
                    onChange={e => setPrayerName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500 text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-1">Permohonan Doa Anda</label>
                  <textarea
                    id="prayer-input-request"
                    rows={3}
                    required
                    placeholder="Tuliskan pergumulan, kecemasan, kesehatan, studi, atau masa depan Anda..."
                    value={prayerRequest}
                    onChange={e => setPrayerRequest(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500 text-slate-200 resize-none"
                  ></textarea>
                </div>
                <button
                  id="prayer-submit-btn"
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-sm flex items-center justify-center transition-all cursor-pointer shadow-md shadow-blue-500/10"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Kirim ke Tim Pendoa
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function ChevronIcon() {
  return (
    <svg className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
    </svg>
  );
}
