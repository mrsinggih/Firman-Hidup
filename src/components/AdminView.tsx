/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Grid, Sparkles, Calendar, BookOpen, Layers, Edit, Eye, Check, Loader2, Sparkle, PlusCircle, Trash2, AlertCircle, Save } from "lucide-react";
import { Devotion, Theme, Verse } from "../types";

interface AdminViewProps {
  devotions: Devotion[];
  themes: Theme[];
  verses: Verse[];
  onGenerateDevotion: (params: {
    book: string;
    chapter: number;
    verse: number;
    target: "children" | "teen" | "youth";
    theme: string;
    text?: string;
  }) => Promise<any>;
  onBulkGenerate: (params: {
    days: number;
    target: "children" | "teen" | "youth";
    theme: string;
  }) => Promise<any[]>;
  onCreateDevotion: (devotion: Omit<Devotion, "id" | "created_at">) => void;
  onUpdateDevotion: (id: string, updates: Partial<Devotion>) => void;
  onDeleteDevotion: (id: string) => void;
}

export default function AdminView({
  devotions,
  themes,
  verses,
  onGenerateDevotion,
  onBulkGenerate,
  onCreateDevotion,
  onUpdateDevotion,
  onDeleteDevotion
}: AdminViewProps) {
  // Navigation inside Admin view
  const [adminTab, setAdminTab] = useState<'dashboard' | 'generator' | 'calendar' | 'bulk'>('dashboard');

  // Single generator form state
  const [book, setBook] = useState("Mazmur");
  const [chapter, setChapter] = useState(119);
  const [verseNum, setVerseNum] = useState(105);
  const [target, setTarget] = useState<"children" | "teen" | "youth">("teen");
  const [theme, setTheme] = useState("Media Sosial");
  const [customVerseText, setCustomVerseText] = useState("");

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationSteps, setGenerationSteps] = useState<string[]>([]);
  const [generatedResult, setGeneratedResult] = useState<any | null>(null);

  // Editable generated fields
  const [editTitle, setEditTitle] = useState("");
  const [editSummary, setEditSummary] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editPrayer, setEditPrayer] = useState("");
  const [editReflection, setEditReflection] = useState("");
  const [editChallenge, setEditChallenge] = useState("");
  const [editSeoTitle, setEditSeoTitle] = useState("");
  const [editMetaDesc, setEditMetaDesc] = useState("");
  const [editTags, setEditTags] = useState("");

  const [isSaved, setIsSaved] = useState(false);

  // Bulk Generator State
  const [bulkDays, setBulkDays] = useState(3);
  const [bulkTarget, setBulkTarget] = useState<"children" | "teen" | "youth">("children");
  const [bulkTheme, setBulkTheme] = useState("Iman");
  const [isBulkGenerating, setIsBulkGenerating] = useState(false);
  const [bulkProgressPercent, setBulkProgressPercent] = useState(0);
  const [bulkResults, setBulkResults] = useState<any[]>([]);

  // Manual Devotions manager State
  const [activeManagerItem, setActiveManagerItem] = useState<Devotion | null>(null);

  // Analytics Stats
  const totalArticles = devotions.length;
  const draftArticles = devotions.filter(d => d.status === "draft").length;
  const publishArticles = devotions.filter(d => d.status === "published").length;
  const totalReaders = 1432; // Static high-fidelity mockup
  const totalDonationFunds = 487 * 100000; // Rp 48.700.000 based on Bibles
  const productCount = 5;

  // Single AI Generation
  const handleSingleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setGeneratedResult(null);
    setGenerationSteps(["Menganalisis kitab dan pasal...", "Menghubungkan referensi ayat Alkitab..."]);

    const timers = [
      setTimeout(() => setGenerationSteps(prev => [...prev, "Menyesuaikan teologi kontekstual untuk kelompok usia..."]), 1500),
      setTimeout(() => setGenerationSteps(prev => [...prev, "Membuat pembahasan moral harian, tantangan praktis, dan doa singkat..."]), 3000),
      setTimeout(() => setGenerationSteps(prev => [...prev, "Mengoptimalkan tag dan meta deskripsi untuk SEO web..."]), 4500)
    ];

    try {
      // Find matching verse text if exists in verses database
      const existing = verses.find(
        v => v.book.toLowerCase() === book.toLowerCase() && v.chapter === Number(chapter) && v.verse === Number(verseNum)
      );
      const queryText = customVerseText || (existing ? existing.text : "");

      const data = await onGenerateDevotion({
        book,
        chapter,
        verse: verseNum,
        target,
        theme,
        text: queryText
      });

      // Clear timers
      timers.forEach(clearTimeout);

      setGeneratedResult(data);
      // Initialize edit fields
      setEditTitle(data.title || "");
      setEditSummary(data.summary || "");
      setEditContent(data.content || "");
      setEditPrayer(data.prayer || "");
      setEditReflection(data.reflection || "");
      setEditChallenge(data.challenge || "");
      setEditSeoTitle(data.seoTitle || "");
      setEditMetaDesc(data.metaDescription || "");
      setEditTags(data.tags ? data.tags.join(", ") : "");
    } catch (error: any) {
      alert("Error generating content: " + error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveGenerated = (publishNow: boolean) => {
    if (!generatedResult) return;
    
    onCreateDevotion({
      title: editTitle,
      slug: editTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      verse_id: generatedResult.verse_id,
      audience: target,
      theme,
      content: editContent,
      prayer: editPrayer,
      reflection: editReflection,
      challenge: editChallenge,
      image: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=800&q=80",
      status: publishNow ? "published" : "draft",
      publish_date: new Date().toISOString().split("T")[0],
      created_by: "AI Generator",
      seo_title: editSeoTitle,
      meta_description: editMetaDesc,
      tags: editTags.split(",").map(t => t.trim()).filter(Boolean)
    });

    setIsSaved(true);
    setGeneratedResult(null);
    setTimeout(() => setIsSaved(false), 3000);
  };

  // Bulk AI Generation
  const handleBulkGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsBulkGenerating(true);
    setBulkResults([]);
    setBulkProgressPercent(10);

    const progressTimer = setInterval(() => {
      setBulkProgressPercent(p => Math.min(95, p + 8));
    }, 1000);

    try {
      const results = await onBulkGenerate({
        days: bulkDays,
        target: bulkTarget,
        theme: bulkTheme
      });
      clearInterval(progressTimer);
      setBulkProgressPercent(100);
      setBulkResults(results);
    } catch (error: any) {
      alert("Error in bulk generation: " + error.message);
    } finally {
      setIsBulkGenerating(false);
    }
  };

  return (
    <div className="space-y-8 pb-16" id="admin-view">
      {/* Top Controls Admin Head */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 text-white p-6 rounded-3xl shadow-lg">
        <div>
          <span className="bg-blue-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
            Otoritas Pelayanan
          </span>
          <h1 className="text-3xl font-extrabold font-display mt-2">Firman Hidup Admin</h1>
          <p className="text-xs text-slate-400 mt-1">Kelola renungan digital harian, kalender publikasi, dan gunakan modul AI asisten teologi.</p>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-slate-800 p-1 rounded-2xl w-full sm:w-auto overflow-x-auto">
          {[
            { id: "dashboard", label: "Dashboard", icon: Grid },
            { id: "generator", label: "AI Generator", icon: Sparkles },
            { id: "calendar", label: "Kalender 365", icon: Calendar },
            { id: "bulk", label: "AI Bulk Generator", icon: Layers }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                id={`admin-sub-tab-${tab.id}`}
                key={tab.id}
                onClick={() => setAdminTab(tab.id as any)}
                className={`flex items-center px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  adminTab === tab.id
                    ? "bg-blue-600 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4 mr-1.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {isSaved && (
        <div id="save-success-banner" className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-2xl text-xs font-bold flex items-center shadow-xs">
          <Check className="h-4 w-4 text-green-600 mr-2" />
          Renungan baru berhasil disimpan ke database dan segera diintegrasikan!
        </div>
      )}

      {/* VIEW 1: Dashboard Analytics */}
      {adminTab === "dashboard" && (
        <div className="space-y-8 animate-fade-in" id="admin-dashboard">
          {/* Stats counters */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
            {[
              { id: "total", label: "Total Artikel", val: totalArticles, color: "text-slate-900 bg-slate-100" },
              { id: "drafts", label: "Artikel Draft", val: draftArticles, color: "text-amber-700 bg-amber-50" },
              { id: "published", label: "Artikel Publish", val: publishArticles, color: "text-green-700 bg-green-50" },
              { id: "readers", label: "Jumlah Pembaca", val: totalReaders, color: "text-blue-700 bg-blue-50" },
              { id: "donations", label: "Total Donasi (Rp)", val: `Rp ${totalDonationFunds.toLocaleString("id-ID")}`, color: "text-indigo-700 bg-indigo-50" },
              { id: "products", label: "Produk Katalog", val: productCount, color: "text-orange-700 bg-orange-50" }
            ].map(stat => (
              <div key={stat.id} className="bg-white border border-slate-100 p-4 rounded-2xl shadow-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{stat.label}</span>
                <span className={`text-base sm:text-lg font-extrabold font-display mt-2 block rounded-lg px-2.5 py-1 ${stat.color} w-fit`}>
                  {stat.val}
                </span>
              </div>
            ))}
          </div>

          {/* Devotions management table */}
          <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-xs">
            <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <div>
                <h2 className="font-bold text-slate-800 text-lg font-display">Daftar Konten Renungan</h2>
                <p className="text-xs text-slate-400">Total {devotions.length} artikel yang aktif tersimpan.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-100">
                    <th className="p-4">Judul Renungan</th>
                    <th className="p-4">Target Audiens</th>
                    <th className="p-4">Kategori Tema</th>
                    <th className="p-4">Nats Ayat</th>
                    <th className="p-4">Tanggal Rilis</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-center">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {devotions.map(dev => (
                    <tr key={dev.id} id={`table-row-${dev.id}`} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 font-bold text-slate-800 max-w-xs truncate">{dev.title}</td>
                      <td className="p-4 capitalize text-slate-500">
                        {dev.audience === "children" ? "Anak-Anak" : dev.audience === "teen" ? "Remaja" : "Pemuda"}
                      </td>
                      <td className="p-4">
                        <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md text-[10px] font-bold">
                          {dev.theme}
                        </span>
                      </td>
                      <td className="p-4 text-blue-600 font-bold">
                        {dev.verse ? `${dev.verse.book} ${dev.verse.chapter}:${dev.verse.verse}` : "Seeding"}
                      </td>
                      <td className="p-4 text-slate-500">{dev.publish_date}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                          dev.status === "published"
                            ? "bg-green-100 text-green-800"
                            : "bg-amber-100 text-amber-800"
                        }`}>
                          {dev.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-center space-x-2">
                          <button
                            id={`action-toggle-${dev.id}`}
                            onClick={() => onUpdateDevotion(dev.id, { status: dev.status === "published" ? "draft" : "published" })}
                            className="text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-lg"
                            title="Ubah Status Rilis"
                          >
                            Tukar Status
                          </button>
                          <button
                            id={`action-delete-${dev.id}`}
                            onClick={() => {
                              if (confirm("Hapus renungan ini secara permanen dari database?")) {
                                onDeleteDevotion(dev.id);
                              }
                            }}
                            className="text-slate-400 hover:text-red-500 p-1 rounded-lg"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: AI Single Generator */}
      {adminTab === "generator" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in" id="admin-generator">
          {/* Input Control Form Panel */}
          <form onSubmit={handleSingleGenerate} className="lg:col-span-5 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6" id="ai-generator-form">
            <div className="flex items-center space-x-2 text-blue-600">
              <Sparkles className="h-5 w-5 animate-pulse" />
              <h2 className="font-extrabold text-lg text-slate-800 font-display">AI Teologi Asisten</h2>
            </div>
            
            <p className="text-xs text-slate-500 leading-normal">
              Rancang renungan Kristen harian secara otomatis. Cukup isi Kitab, Pasal, Ayat, Target Audiens, dan Tema Kehidupan. AI Gemini 3.5 akan mensintesis teologi kontekstual yang akurat.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">Kitab</label>
                <input
                  id="generator-input-book"
                  type="text"
                  required
                  value={book}
                  onChange={e => setBook(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-bold focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">Pasal</label>
                <input
                  id="generator-input-chapter"
                  type="number"
                  required
                  min={1}
                  value={chapter}
                  onChange={e => setChapter(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-bold focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">Ayat</label>
                <input
                  id="generator-input-verse"
                  type="number"
                  required
                  min={1}
                  value={verseNum}
                  onChange={e => setVerseNum(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-bold focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1.5">Bunyi Ayat (Opsional)</label>
              <textarea
                id="generator-input-versetext"
                rows={2}
                placeholder="Biarkan kosong agar AI mengambil otomatis dari database teologi, atau ketik manual..."
                value={customVerseText}
                onChange={e => setCustomVerseText(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none text-slate-700 resize-none"
              ></textarea>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1.5">Target Audiens</label>
                <select
                  id="generator-input-target"
                  value={target}
                  onChange={e => setTarget(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-semibold focus:outline-none"
                >
                  <option value="children">Anak-Anak (7-12 th)</option>
                  <option value="teen">Remaja (13-17 th)</option>
                  <option value="youth">Pemuda (18-30 th)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1.5">Tema Kehidupan</label>
                <select
                  id="generator-input-theme"
                  value={theme}
                  onChange={e => setTheme(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-semibold focus:outline-none"
                >
                  {themes.map(th => (
                    <option key={th.id} value={th.nama}>{th.nama}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              id="generator-submit-btn"
              type="submit"
              disabled={isGenerating}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3.5 rounded-2xl text-xs flex items-center justify-center transition-all cursor-pointer shadow-md shadow-blue-100"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Mengolah Teologi Konten...
                </>
              ) : (
                <>
                  <Sparkle className="h-4 w-4 mr-2" />
                  Generate Renungan (AI)
                </>
              )}
            </button>
          </form>

          {/* Result Output Preview Pane */}
          <div className="lg:col-span-7 space-y-6">
            {isGenerating && (
              <div id="generator-loading-box" className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm space-y-6 min-h-[400px] flex flex-col justify-center items-center">
                <div className="relative flex justify-center items-center">
                  <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                  <Sparkles className="absolute h-6 w-6 text-yellow-500 animate-pulse" />
                </div>
                <div className="space-y-2 text-center max-w-sm">
                  <h4 className="font-bold text-slate-800 font-display">Tuntunan Kecerdasan Buatan</h4>
                  <p className="text-xs text-slate-400 leading-normal">
                    AI sedang mensintesis rancangan materi. Proses teologis ini memakan waktu sekitar 5-10 detik...
                  </p>
                </div>
                
                {/* Live Steps log */}
                <div className="w-full max-w-md bg-slate-50 border p-4 rounded-2xl text-[11px] text-slate-500 space-y-1.5 font-mono">
                  {generationSteps.map((step, idx) => (
                    <div key={idx} className="flex items-center">
                      <span className="text-green-500 mr-2">✔</span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!isGenerating && !generatedResult && (
              <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm min-h-[400px] flex flex-col justify-center items-center text-center text-slate-400 space-y-3">
                <Sparkles className="h-12 w-12 text-slate-200" />
                <div className="space-y-1">
                  <p className="font-semibold text-sm">Belum ada draf renungan dihasilkan</p>
                  <p className="text-xs">Isi parameter form di sebelah kiri dan klik "Generate Renungan".</p>
                </div>
              </div>
            )}

            {generatedResult && (
              /* High-fidelity Interactive Editor of generated data */
              <div id="generator-results-pane" className="bg-white border border-slate-100 rounded-3xl p-8 shadow-lg space-y-6 animate-scale-up">
                <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                  <div className="flex items-center space-x-2">
                    <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                      Draft Tersintesis
                    </span>
                    <span className="text-slate-400 text-xs">/ {generatedResult.verse?.book} {generatedResult.verse?.chapter}:{generatedResult.verse?.verse}</span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      id="save-draft-btn"
                      onClick={() => handleSaveGenerated(false)}
                      className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3.5 py-2 rounded-xl transition-all"
                    >
                      Simpan Draft
                    </button>
                    <button
                      id="publish-now-btn"
                      onClick={() => handleSaveGenerated(true)}
                      className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold px-3.5 py-2 rounded-xl transition-all shadow-xs"
                    >
                      Publish Sekarang
                    </button>
                  </div>
                </div>

                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 text-xs">
                  {/* Title */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-600">Judul Artikel</label>
                    <input
                      id="edit-dev-title"
                      type="text"
                      value={editTitle}
                      onChange={e => setEditTitle(e.target.value)}
                      className="w-full bg-slate-50 border p-2.5 rounded-xl font-bold text-slate-800"
                    />
                  </div>

                  {/* Summary */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-600">Ringkasan Singkat</label>
                    <input
                      id="edit-dev-summary"
                      type="text"
                      value={editSummary}
                      onChange={e => setEditSummary(e.target.value)}
                      className="w-full bg-slate-50 border p-2.5 rounded-xl"
                    />
                  </div>

                  {/* Content article */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-600">Artikel Lengkap Renungan</label>
                    <textarea
                      id="edit-dev-content"
                      rows={8}
                      value={editContent}
                      onChange={e => setEditContent(e.target.value)}
                      className="w-full bg-slate-50 border p-3 rounded-xl font-sans text-xs leading-relaxed"
                    ></textarea>
                  </div>

                  {/* Prayer */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-600">Doa Harian</label>
                    <textarea
                      id="edit-dev-prayer"
                      rows={2}
                      value={editPrayer}
                      onChange={e => setEditPrayer(e.target.value)}
                      className="w-full bg-slate-50 border p-2.5 rounded-xl text-xs"
                    ></textarea>
                  </div>

                  {/* Reflection Questions */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-600">Pertanyaan Refleksi</label>
                    <input
                      id="edit-dev-reflection"
                      type="text"
                      value={editReflection}
                      onChange={e => setEditReflection(e.target.value)}
                      className="w-full bg-slate-50 border p-2.5 rounded-xl"
                    />
                  </div>

                  {/* Challenges */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-600">Tantangan Tindakan Nyata</label>
                    <input
                      id="edit-dev-challenge"
                      type="text"
                      value={editChallenge}
                      onChange={e => setEditChallenge(e.target.value)}
                      className="w-full bg-slate-50 border p-2.5 rounded-xl"
                    />
                  </div>

                  {/* SEO Metadata optimizations */}
                  <div className="grid grid-cols-2 gap-4 border-t pt-4">
                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-600">SEO Title Tag</label>
                      <input
                        id="edit-dev-seotitle"
                        type="text"
                        value={editSeoTitle}
                        onChange={e => setEditSeoTitle(e.target.value)}
                        className="w-full bg-slate-50 border p-2 rounded-xl text-[11px]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-600">Meta Description</label>
                      <input
                        id="edit-dev-metadesc"
                        type="text"
                        value={editMetaDesc}
                        onChange={e => setEditMetaDesc(e.target.value)}
                        className="w-full bg-slate-50 border p-2 rounded-xl text-[11px]"
                      />
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-600">Tag Relevan (dipisahkan koma)</label>
                    <input
                      id="edit-dev-tags"
                      type="text"
                      value={editTags}
                      onChange={e => setEditTags(e.target.value)}
                      className="w-full bg-slate-50 border p-2.5 rounded-xl"
                      placeholder="tag1, tag2, tag3"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 3: Kalender Renungan 365 Hari Planner */}
      {adminTab === "calendar" && (
        <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-xs space-y-6 animate-fade-in" id="admin-calendar">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 font-display">Kalender Perencanaan 365 Hari</h2>
            <p className="text-xs text-slate-400 mt-1">Daftar harian penjadwalan nats Alkitab dan status publikasi artikel.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-3">
            {[
              { date: "1 Januari", nats: "Kejadian 1", status: "published", label: "✔" },
              { date: "2 Januari", nats: "Kejadian 2", status: "draft", label: "" },
              { date: "3 Januari", nats: "Mazmur 1", status: "published", label: "✔" },
              { date: "4 Januari", nats: "Mazmur 23", status: "draft", label: "" },
              { date: "5 Januari", nats: "Matius 1", status: "published", label: "✔" },
              { date: "6 Januari", nats: "Yohanes 1", status: "draft", label: "" },
              { date: "7 Januari", nats: "Amsal 1", status: "published", label: "✔" }
            ].map((day, idx) => (
              <div
                id={`calendar-planner-day-${idx}`}
                key={idx}
                className={`border p-4 rounded-2xl flex flex-col justify-between h-28 hover:shadow-xs transition-all ${
                  day.status === "published"
                    ? "bg-green-50 border-green-200 text-green-900"
                    : "bg-amber-50 border-amber-200 text-amber-900"
                }`}
              >
                <div className="flex justify-between items-start text-xs font-bold">
                  <span>{day.date}</span>
                  {day.status === "published" && <Check className="h-4 w-4 text-green-700" />}
                </div>
                <div>
                  <p className="text-xs font-bold font-display">{day.nats}</p>
                  <span className={`inline-block text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-md mt-1 ${
                    day.status === "published" ? "bg-green-200/50" : "bg-amber-200/50"
                  }`}>
                    {day.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 4: AI Bulk Generator */}
      {adminTab === "bulk" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in" id="admin-bulk">
          {/* Input control block */}
          <form onSubmit={handleBulkGenerate} className="lg:col-span-5 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6" id="bulk-generator-form">
            <div className="flex items-center space-x-2 text-indigo-600">
              <Layers className="h-5 w-5" />
              <h2 className="font-extrabold text-lg text-slate-800 font-display">AI Bulk Generator</h2>
            </div>
            
            <p className="text-xs text-slate-500 leading-normal">
              Buat draft renungan secara massal untuk mengisi kalender tahunan secara instan! Masukkan jumlah hari (maksimal 30), pilih target audiens, dan biarkan AI menyusun daftar draf sekaligus.
            </p>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-1.5">Jumlah Hari Rencana</label>
              <select
                id="bulk-input-days"
                value={bulkDays}
                onChange={e => setBulkDays(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-semibold focus:outline-none"
              >
                <option value={3}>3 Hari Renungan</option>
                <option value={5}>5 Hari Renungan</option>
                <option value={7}>7 Hari Renungan</option>
                <option value={10}>10 Hari Renungan</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1.5">Target Pembaca</label>
                <select
                  id="bulk-input-target"
                  value={bulkTarget}
                  onChange={e => setBulkTarget(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-semibold focus:outline-none"
                >
                  <option value="children">Anak-Anak (7-12 th)</option>
                  <option value="teen">Remaja (13-17 th)</option>
                  <option value="youth">Pemuda (18-30 th)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1.5">Tema Umum</label>
                <select
                  id="bulk-input-theme"
                  value={bulkTheme}
                  onChange={e => setBulkTheme(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-semibold focus:outline-none"
                >
                  {themes.map(th => (
                    <option key={th.id} value={th.nama}>{th.nama}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              id="bulk-submit-btn"
              type="submit"
              disabled={isBulkGenerating}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-3.5 rounded-2xl text-xs flex items-center justify-center transition-all cursor-pointer shadow-md shadow-indigo-100"
            >
              {isBulkGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Membuat {bulkDays} Draft Massal...
                </>
              ) : (
                <>
                  <Layers className="h-4 w-4 mr-2" />
                  Mulai Bulk Generate (AI)
                </>
              )}
            </button>
          </form>

          {/* Result list block */}
          <div className="lg:col-span-7 space-y-6">
            {isBulkGenerating && (
              <div id="bulk-loading-pane" className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm min-h-[400px] flex flex-col justify-center items-center space-y-4">
                <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
                <div className="space-y-1 text-center max-w-xs">
                  <p className="font-bold text-slate-800 font-display">Memproses Draf Massal</p>
                  <p className="text-xs text-slate-400">AI sedang menulis beberapa draf renungan lengkap secara berurutan.</p>
                </div>
                <div className="w-full max-w-sm bg-slate-100 rounded-full h-2">
                  <div className="bg-indigo-600 h-2 rounded-full transition-all duration-300" style={{ width: `${bulkProgressPercent}%` }}></div>
                </div>
              </div>
            )}

            {!isBulkGenerating && bulkResults.length === 0 && (
              <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm min-h-[400px] flex flex-col justify-center items-center text-center text-slate-400 space-y-3">
                <Layers className="h-12 w-12 text-slate-200" />
                <div className="space-y-1">
                  <p className="font-semibold text-sm">Belum ada bulk generation dijalankan</p>
                  <p className="text-xs">Klik form di kiri untuk membuat draft massal terjadwal di Alkitab.</p>
                </div>
              </div>
            )}

            {!isBulkGenerating && bulkResults.length > 0 && (
              <div id="bulk-results-list" className="bg-white border border-slate-100 rounded-3xl p-6 shadow-md space-y-6 animate-scale-up">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="font-extrabold text-slate-800 text-base font-display">Berhasil Menghasilkan {bulkResults.length} Draft</h3>
                  <p className="text-[11px] text-slate-500">Seluruh draf di bawah telah berhasil disimpan ke database sebagai draft.</p>
                </div>

                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                  {bulkResults.map((item, idx) => (
                    <div id={`bulk-result-item-${idx}`} key={idx} className="bg-slate-50 border rounded-2xl p-4 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-800">{item.title}</span>
                        <span className="bg-amber-100 text-amber-800 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full">
                          {item.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed font-serif">
                        Nats: <strong>{item.verse?.book} {item.verse?.chapter}:{item.verse?.verse}</strong>
                      </p>
                      <p className="text-[11px] text-slate-400 line-clamp-2 italic">
                        "{item.summary}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
