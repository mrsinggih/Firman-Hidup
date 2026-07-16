/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { DollarSign, Heart, Sparkles, Check, Send, Users, ShieldCheck, Gift, ArrowRight } from "lucide-react";
import { Donation } from "../types";

interface DonationViewProps {
  donationStats: { target: number; collected: number; needed: number; totalFunds: number };
  donationsList: Donation[];
  onAddDonation: (donation: { nama: string; email: string; jumlah: number; pesan: string }) => void;
}

export default function DonationView({
  donationStats,
  donationsList,
  onAddDonation
}: DonationViewProps) {
  // Donation form state
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [donorAmount, setDonorAmount] = useState<number>(100000); // 100k = 1 Bible
  const [donorMessage, setDonorMessage] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  const predefinedAmounts = [50000, 100000, 250000, 500000, 1000000];

  const handleSubmitDonation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorEmail || donorAmount <= 0) return;

    setIsSubmitting(true);
    // Mimic database transaction
    setTimeout(() => {
      onAddDonation({
        nama: donorName || "Donatur Anonim",
        email: donorEmail,
        jumlah: donorAmount,
        pesan: donorMessage
      });
      setIsSubmitting(false);
      setShowThankYou(true);
      
      // Reset form
      setDonorName("");
      setDonorEmail("");
      setDonorAmount(100000);
      setDonorMessage("");

      setTimeout(() => setShowThankYou(false), 8000);
    }, 1500);
  };

  const percent = Math.round((donationStats.collected / donationStats.target) * 100);

  // Distribution report mock
  const reports = [
    {
      date: "Mei 2026",
      location: "Siberut, Kepulauan Mentawai",
      quantity: 150,
      description: "Penyaluran Alkitab untuk anak-anak sekolah minggu dan pemuda gereja di pedalaman pulau Siberut."
    },
    {
      date: "Maret 2026",
      location: "Lanny Jaya, Papua Pegunungan",
      quantity: 200,
      description: "Pemberian Alkitab versi dwi-bahasa untuk jemaat gereja lokal di lereng pegunungan Lanny Jaya."
    },
    {
      date: "Januari 2026",
      location: "Sumba Timur, NTT",
      quantity: 137,
      description: "Pembagian Alkitab untuk keluarga di wilayah terpencil Sumba Timur yang belum memiliki Alkitab pribadi."
    }
  ];

  // Gallery photos mock
  const gallery = [
    "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1543269664-56d443d5fd33?auto=format&fit=crop&w=600&q=80"
  ];

  return (
    <div className="space-y-12 pb-16" id="donation-view">
      {/* Visual Header Banner */}
      <section className="bg-gradient-to-br from-indigo-950 via-blue-950 to-slate-950 text-white rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 transform translate-x-12 -translate-y-12 text-blue-500/20 pointer-events-none">
          <Heart className="h-96 w-96" />
        </div>
        <div className="max-w-2xl relative z-10 space-y-6">
          <span className="inline-flex items-center bg-amber-400/20 text-amber-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
            Visi Pelayanan Alkitab Nusantara
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-display leading-tight">
            Menghadirkan Terang Firman di Pelosok Negeri
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Masih banyak saudara-saudara seiman kita di wilayah pedalaman, pegunungan, dan pulau terpencil yang belum memiliki Alkitab pribadi. Gerakan Donasi 1.000 Alkitab berkomitmen untuk membagikan Firman Allah secara gratis kepada mereka yang membutuhkan. Setiap donasi Anda menyalakan lentera pengharapan kekal.
          </p>
        </div>
      </section>

      {/* Main Grid: Progress Bar and Simulated Donation Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left pane: Live Progress and Recent Supporters */}
        <div className="lg:col-span-6 space-y-8">
          <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-xs space-y-6">
            <h2 className="text-2xl font-bold text-slate-800 font-display">Target Penyaluran</h2>
            
            {/* Core Stats */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Target Donasi</span>
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-800 font-display mt-1 block">
                  {donationStats.target}
                </span>
                <span className="text-[10px] text-slate-500">Alkitab</span>
              </div>
              <div className="bg-green-50 p-4 rounded-2xl border border-green-100">
                <span className="text-[10px] font-bold text-green-600 uppercase tracking-wider block">Terkumpul</span>
                <span className="text-2xl sm:text-3xl font-extrabold text-green-700 font-display mt-1 block animate-pulse">
                  {donationStats.collected}
                </span>
                <span className="text-[10px] text-green-600">Alkitab</span>
              </div>
              <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">Dibutuhkan</span>
                <span className="text-2xl sm:text-3xl font-extrabold text-blue-700 font-display mt-1 block">
                  {donationStats.needed}
                </span>
                <span className="text-[10px] text-blue-600">Alkitab Lagi</span>
              </div>
            </div>

            {/* Graphic Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-500">
                <span>Progress Penggalangan Alkitab</span>
                <span>{percent}% Tercapai</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden">
                <div className="bg-blue-600 h-4 rounded-full transition-all duration-500" style={{ width: `${percent}%` }}></div>
              </div>
            </div>

            <div className="bg-amber-50 text-amber-800 p-4 rounded-2xl text-xs leading-relaxed flex items-start">
              <span className="font-extrabold mr-2">Info:</span>
              <span>Setiap donasi senilai <strong>Rp 100.000</strong> akan disalurkan dalam bentuk 1 buah Alkitab Terjemahan Baru (TB) lengkap berukuran sedang yang tahan lama ke wilayah sasaran misi.</span>
            </div>
          </div>

          {/* List of Recent Kind Donators */}
          <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-xs space-y-6">
            <h2 className="text-xl font-bold text-slate-800 font-display">Donatur Terbaru</h2>
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
              {donationsList.map(don => (
                <div key={don.id} id={`donation-item-${don.id}`} className="flex justify-between items-start border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-800">{don.nama}</p>
                    <p className="text-xs text-slate-500 leading-relaxed italic">"{don.pesan}"</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full block">
                      Rp {don.jumlah.toLocaleString("id-ID")}
                    </span>
                    <span className="text-[9px] text-slate-400 font-semibold">{new Date(don.created_at).toLocaleDateString("id-ID")}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right pane: Simulated Checkout Payment Form */}
        <div className="lg:col-span-6">
          <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-md relative overflow-hidden">
            {showThankYou ? (
              <div id="donation-thank-you" className="text-center py-12 space-y-6">
                <div className="mx-auto w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center animate-bounce">
                  <Heart className="h-8 w-8 fill-current" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold font-display text-slate-800">Donasi Anda Berhasil!</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                    Puji Tuhan! Terima kasih banyak atas kemurahan hati Anda mendukung perluasan Firman Tuhan. Laporan pertanggungjawaban donasi Anda akan kami perbarui secara transparan.
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl max-w-xs mx-auto border text-xs text-slate-600">
                  Status Pembayaran: <span className="text-green-600 font-bold">SUKSES (SIMULASI)</span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitDonation} className="space-y-6" id="donation-checkout-form">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold text-slate-800 font-display">Salurkan Dukungan</h2>
                  <p className="text-xs text-slate-400">Pilih nominal donasi atau tuliskan secara manual untuk mengirimkan Alkitab.</p>
                </div>

                {/* Amount Selector */}
                <div className="space-y-3">
                  <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider">Pilih Nominal Donasi</label>
                  <div className="grid grid-cols-3 gap-3">
                    {predefinedAmounts.map(amt => (
                      <button
                        id={`donation-preset-${amt}`}
                        key={amt}
                        type="button"
                        onClick={() => setDonorAmount(amt)}
                        className={`py-3.5 rounded-2xl text-xs font-bold border transition-all text-center ${
                          donorAmount === amt
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        Rp {amt.toLocaleString("id-ID")}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Amount input */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Nominal Kustom (Rp)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                    <input
                      id="donation-input-amount"
                      type="number"
                      required
                      min={10000}
                      placeholder="Masukkan jumlah donasi..."
                      value={donorAmount}
                      onChange={e => setDonorAmount(Math.max(0, Number(e.target.value)))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-blue-500 font-bold text-slate-800"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1.5 block">
                    Setara dengan pembagian sekitar <strong className="text-blue-600">{Math.floor(donorAmount / 100000)} Alkitab</strong> gratis.
                  </span>
                </div>

                {/* Donor identity */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-1.5">Nama Donatur</label>
                    <input
                      id="donation-input-name"
                      type="text"
                      placeholder="Nama Lengkap / Anonim"
                      value={donorName}
                      onChange={e => setDonorName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs focus:outline-none text-slate-700"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-1.5">Alamat Email *</label>
                    <input
                      id="donation-input-email"
                      type="email"
                      required
                      placeholder="nama@email.com"
                      value={donorEmail}
                      onChange={e => setDonorEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs focus:outline-none text-slate-700"
                    />
                  </div>
                </div>

                {/* Custom blessing message */}
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-1.5 font-display">Pesan Doa / Berkat</label>
                  <textarea
                    id="donation-input-message"
                    rows={2}
                    placeholder="Tuliskan kata-kata penguatan atau berkat untuk penerima Alkitab..."
                    value={donorMessage}
                    onChange={e => setDonorMessage(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none text-slate-700 resize-none"
                  ></textarea>
                </div>

                {/* Guarantee label */}
                <div className="bg-slate-50 border p-3 rounded-2xl flex items-center space-x-2 text-[10px] text-slate-500">
                  <ShieldCheck className="h-4 w-4 text-green-600 shrink-0" />
                  <span>Sistem pembayaran aman. Data donasi akan diinput ke dalam pelaporan publik secara otomatis.</span>
                </div>

                {/* Submit button */}
                <button
                  id="donation-submit-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3.5 rounded-2xl text-sm flex items-center justify-center transition-all cursor-pointer shadow-md shadow-blue-500/15"
                >
                  {isSubmitting ? (
                    "Memproses Donasi..."
                  ) : (
                    <>
                      <Gift className="h-4 w-4 mr-2" />
                      Kirim Donasi (Simulasi)
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Reports and Distribution Logs Section */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 font-display">Laporan Penyaluran Terbaru</h2>
          <p className="text-xs text-slate-500 mt-1">Laporan pertanggungjawaban penyaluran Alkitab kepada penerima manfaat secara berkala.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reports.map((rep, idx) => (
            <div key={idx} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-blue-600">{rep.date}</span>
                  <span className="bg-green-50 text-green-700 px-2.5 py-0.5 rounded-full">{rep.quantity} Alkitab</span>
                </div>
                <h3 className="font-extrabold text-slate-800 text-base font-display">{rep.location}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{rep.description}</p>
              </div>
              <div className="pt-4 border-t border-slate-50 mt-4 flex items-center justify-between text-[11px] font-bold text-slate-400">
                <span>Pelaksana: Tim Misi FH</span>
                <span className="text-blue-600 flex items-center">Laporan <ArrowRight className="h-3 w-3 ml-1" /></span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-800 font-display">Galeri Pelayanan Lapangan</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {gallery.map((img, idx) => (
            <div key={idx} className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 border border-slate-150">
              <img src={img} alt="Galeri Donasi Alkitab" className="w-full h-full object-cover hover:scale-105 transition-all duration-300" referrerPolicy="no-referrer" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
