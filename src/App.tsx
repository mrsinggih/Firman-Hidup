/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import HomeView from "./components/HomeView";
import DevotionsView from "./components/DevotionsView";
import BibleView from "./components/BibleView";
import DonationView from "./components/DonationView";
import MerchandiseView from "./components/MerchandiseView";
import AboutView from "./components/AboutView";
import AdminView from "./components/AdminView";
import { User, Devotion, Verse, Theme, Donation, MerchandiseItem, ReadingPlanDay } from "./types";
import { LogIn, Mail, X, Check, Lock, Flame } from "lucide-react";

export default function App() {
  // Navigation & User session states
  const [currentTab, setCurrentTab] = useState<string>("beranda");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [isLoginSuccess, setIsLoginSuccess] = useState(false);

  // Dynamic Database States
  const [themes, setThemes] = useState<Theme[]>([]);
  const [verses, setVerses] = useState<Verse[]>([]);
  const [devotions, setDevotions] = useState<Devotion[]>([]);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [readingPlan, setReadingPlan] = useState<ReadingPlanDay[]>([]);
  const [merchandises, setMerchandises] = useState<MerchandiseItem[]>([]);
  const [donationStats, setDonationStats] = useState({ target: 1000, collected: 487, needed: 513, totalFunds: 0 });
  const [donationsList, setDonationsList] = useState<Donation[]>([]);

  // Detailed selected overlays
  const [selectedDevotion, setSelectedDevotion] = useState<Devotion | null>(null);
  const [selectedMerchandise, setSelectedMerchandise] = useState<MerchandiseItem | null>(null);

  // Loading indicator helper
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all initial state
  const loadData = async () => {
    try {
      setIsLoading(true);
      
      const [
        themesRes,
        versesRes,
        devotionsRes,
        bookmarksRes,
        planRes,
        merchRes,
        donStatsRes
      ] = await Promise.all([
        fetch("/api/themes").then(res => res.json()),
        fetch("/api/verses").then(res => res.json()),
        fetch("/api/devotions").then(res => res.json()),
        fetch("/api/bookmarks").then(res => res.json()),
        fetch("/api/reading-plan").then(res => res.json()),
        fetch("/api/merchandise").then(res => res.json()),
        fetch("/api/donations/stats").then(res => res.json())
      ]);

      setThemes(themesRes || []);
      setVerses(versesRes || []);
      setDevotions(devotionsRes || []);
      
      // Bookmarks is an array of bookmarks, map to list of verse IDs
      const mappedBookmarks = (bookmarksRes || []).map((b: any) => b.verseId);
      setBookmarks(mappedBookmarks);

      setReadingPlan(planRes || []);
      setMerchandises(merchRes || []);
      
      if (donStatsRes) {
        setDonationStats({
          target: donStatsRes.target,
          collected: donStatsRes.collected,
          needed: donStatsRes.needed,
          totalFunds: donStatsRes.totalFunds
        });
        setDonationsList(donStatsRes.donations || []);
      }
    } catch (err) {
      console.error("Failed to load backend state. Retrying shortly.", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Auto-login default user for quick sandbox preview if none active
    const savedUser = localStorage.getItem("fh_user");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    } else {
      // Auto-login with the user email from system metadata!
      const defaultUser: User = {
        id: "admin-default",
        email: "den.mazzee@gmail.com",
        role: "admin",
        created_at: new Date().toISOString()
      };
      setCurrentUser(defaultUser);
      localStorage.setItem("fh_user", JSON.stringify(defaultUser));
    }
  }, []);

  // Auth Operations
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail) return;

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail })
      });
      const data = await res.json();
      if (data.user) {
        setCurrentUser(data.user);
        localStorage.setItem("fh_user", JSON.stringify(data.user));
        setIsLoginSuccess(true);
        setTimeout(() => {
          setIsLoginSuccess(false);
          setIsLoginModalOpen(false);
          setLoginEmail("");
        }, 1500);
      }
    } catch (err) {
      console.error("Login failure: ", err);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("fh_user");
    if (currentTab === "admin") {
      setCurrentTab("beranda");
    }
  };

  // Bible Bookmark Toggle
  const handleToggleBookmark = async (verseId: string) => {
    try {
      const res = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verseId })
      });
      const data = await res.json();
      if (data.bookmarks) {
        setBookmarks(data.bookmarks.map((b: any) => b.verseId));
      }
    } catch (err) {
      console.error("Error toggling bookmark: ", err);
    }
  };

  // Bible Verse Add Form
  const handleAddVerse = async (newVerse: Omit<Verse, "id">) => {
    try {
      const res = await fetch("/api/verses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newVerse)
      });
      if (res.ok) {
        loadData();
      }
    } catch (err) {
      console.error("Error adding verse: ", err);
    }
  };

  // 365 Plan toggle completed day
  const handleToggleReadingPlan = async (day: number) => {
    try {
      const res = await fetch("/api/reading-plan/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ day })
      });
      if (res.ok) {
        // Optimistic UI state update
        setReadingPlan(prev =>
          prev.map(p => (p.day === day ? { ...p, completed: !p.completed } : p))
        );
        // Refresh full stats
        const donStatsRes = await fetch("/api/donations/stats").then(r => r.json());
        if (donStatsRes) {
          setDonationStats({
            target: donStatsRes.target,
            collected: donStatsRes.collected,
            needed: donStatsRes.needed,
            totalFunds: donStatsRes.totalFunds
          });
        }
      }
    } catch (err) {
      console.error("Error toggling reading plan: ", err);
    }
  };

  // Donation Submission
  const handleAddDonation = async (donation: { nama: string; email: string; jumlah: number; pesan: string }) => {
    try {
      const res = await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(donation)
      });
      if (res.ok) {
        loadData();
      }
    } catch (err) {
      console.error("Error recording donation: ", err);
    }
  };

  // Merchandise Checkout Buy
  const handleCheckout = async (items: { id: string; quantity: number }[]) => {
    try {
      const res = await fetch("/api/merchandise/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items })
      });
      const data = await res.json();
      if (data.success) {
        loadData();
        return { success: true, totalPaid: data.totalPaid };
      }
      throw new Error(data.error || "Gagal memproses pembelian");
    } catch (err: any) {
      console.error("Error checking out: ", err);
      throw err;
    }
  };

  // AI Generator: Single Devotion
  const handleGenerateDevotion = async (params: {
    book: string;
    chapter: number;
    verse: number;
    target: "children" | "teen" | "youth";
    theme: string;
    text?: string;
  }) => {
    const res = await fetch("/api/ai/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params)
    });
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || "Gagal mengolah generator teologi AI");
    }
    return res.json();
  };

  // AI Generator: Bulk Devotions
  const handleBulkGenerate = async (params: {
    days: number;
    target: "children" | "teen" | "youth";
    theme: string;
  }) => {
    const res = await fetch("/api/ai/bulk-generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params)
    });
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || "Gagal mengolah bulk generator");
    }
    const data = await res.json();
    loadData();
    return data;
  };

  // Devotions management endpoints
  const handleCreateDevotion = async (newDev: Omit<Devotion, "id" | "created_at">) => {
    try {
      const res = await fetch("/api/devotions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newDev)
      });
      if (res.ok) {
        loadData();
      }
    } catch (err) {
      console.error("Error creating devotion: ", err);
    }
  };

  const handleUpdateDevotion = async (id: string, updates: Partial<Devotion>) => {
    try {
      const res = await fetch(`/api/devotions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        loadData();
      }
    } catch (err) {
      console.error("Error updating devotion: ", err);
    }
  };

  const handleDeleteDevotion = async (id: string) => {
    try {
      const res = await fetch(`/api/devotions/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        loadData();
      }
    } catch (err) {
      console.error("Error deleting devotion: ", err);
    }
  };

  // Navigation callbacks
  const navigateToTab = (tab: string) => {
    setCurrentTab(tab);
    setSelectedDevotion(null);
    setSelectedMerchandise(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const selectDevotion = (devotion: Devotion | null) => {
    setSelectedDevotion(devotion);
    if (devotion) {
      setCurrentTab("renungan");
    }
  };

  const selectMerchandise = (item: MerchandiseItem | null) => {
    setSelectedMerchandise(item);
    if (item) {
      setCurrentTab("merchandise");
    }
  };

  // Featured and list selectors
  const featured = devotions.find(d => d.status === "published") || devotions[0] || null;
  const verseOfDay = verses[0] || null;
  const recent = [...devotions].reverse();
  const popular = [...devotions].sort((a, b) => a.title.localeCompare(b.title));

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between" id="app-root">
      {/* Upper Navigation bar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={navigateToTab}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
      />

      {/* Main Content Pane */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2Icon />
            <p className="text-sm font-semibold text-slate-500 animate-pulse">Menghubungkan ke layanan pelayanan...</p>
          </div>
        ) : (
          <>
            {currentTab === "beranda" && (
              <HomeView
                featuredDevotion={featured}
                verseOfDay={verseOfDay}
                recentDevotions={recent}
                popularDevotions={popular}
                donationStats={donationStats}
                onNavigateTab={navigateToTab}
                onSelectDevotion={selectDevotion}
                merchandises={merchandises}
                onSelectMerchandise={selectMerchandise}
              />
            )}

            {currentTab === "renungan" && (
              <DevotionsView
                devotions={devotions}
                themes={themes}
                bookmarks={bookmarks}
                onToggleBookmark={handleToggleBookmark}
                selectedDevotion={selectedDevotion}
                onSelectDevotion={setSelectedDevotion}
              />
            )}

            {currentTab === "alkitab" && (
              <BibleView
                verses={verses}
                readingPlan={readingPlan}
                onToggleReadingPlan={handleToggleReadingPlan}
                bookmarks={bookmarks}
                onToggleBookmark={handleToggleBookmark}
                onAddVerse={handleAddVerse}
              />
            )}

            {currentTab === "donasi" && (
              <DonationView
                donationStats={donationStats}
                donationsList={donationsList}
                onAddDonation={handleAddDonation}
              />
            )}

            {currentTab === "merchandise" && (
              <MerchandiseView
                merchandiseList={merchandises}
                selectedItem={selectedMerchandise}
                onSelectItem={setSelectedMerchandise}
                onCheckout={handleCheckout}
              />
            )}

            {currentTab === "tentang" && <AboutView />}

            {currentTab === "admin" && currentUser?.role === "admin" && (
              <AdminView
                devotions={devotions}
                themes={themes}
                verses={verses}
                onGenerateDevotion={handleGenerateDevotion}
                onBulkGenerate={handleBulkGenerate}
                onCreateDevotion={handleCreateDevotion}
                onUpdateDevotion={handleUpdateDevotion}
                onDeleteDevotion={handleDeleteDevotion}
              />
            )}
          </>
        )}
      </main>

      {/* Modern footer display */}
      <footer className="bg-white border-t border-slate-150 py-12" id="main-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <div className="bg-blue-600 text-white p-1.5 rounded-lg">
              <Flame className="h-4 w-4" />
            </div>
            <span className="text-slate-800 font-extrabold font-display">Firman Hidup</span>
          </div>
          <p className="text-slate-400 text-xs">
            © {new Date().getFullYear()} Yayasan Pelayanan Digital Firman Hidup Indonesia. Dilindungi Undang-Undang.
          </p>
          <p className="text-[10px] text-slate-300">
            Diberdayakan oleh Google Gemini 3.5 & AI Studio Build Sandbox.
          </p>
        </div>
      </footer>

      {/* Simple Login Overlay Modal */}
      {isLoginModalOpen && (
        <div id="login-modal" className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-[100] animate-fade-in">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full relative shadow-2xl border">
            <button
              id="login-close-btn"
              onClick={() => setIsLoginModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-50"
            >
              <X className="h-4 w-4" />
            </button>

            {isLoginSuccess ? (
              <div id="login-success-pane" className="text-center py-6 space-y-3">
                <div className="mx-auto w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                  <Check className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-slate-800">Login Berhasil!</h3>
                <p className="text-xs text-slate-400">Selamat datang kembali di panel pelayanan digital.</p>
              </div>
            ) : (
              <form onSubmit={handleLogin} className="space-y-6" id="login-form">
                <div className="text-center space-y-2">
                  <div className="bg-blue-50 text-blue-600 p-3 rounded-2xl w-fit mx-auto">
                    <Lock className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-lg font-display">Masuk ke Firman Hidup</h3>
                  <p className="text-xs text-slate-400">Gunakan akun admin atau editor Anda untuk mengelola konten.</p>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider">Alamat Email Pelayanan</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                    <input
                      id="login-input-email"
                      type="email"
                      required
                      placeholder="admin@firmanhidup.com"
                      value={loginEmail}
                      onChange={e => setLoginEmail(e.target.value)}
                      className="w-full bg-slate-50 border rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-blue-500 font-medium"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400">Ketik <strong>den.mazzee@gmail.com</strong> untuk akses Admin instan.</span>
                </div>

                <button
                  id="login-submit-btn"
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center transition-all cursor-pointer shadow-md shadow-blue-100"
                >
                  <LogIn className="h-4 w-4 mr-1.5" />
                  Masuk Akun
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Loader2Icon() {
  return (
    <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
}
