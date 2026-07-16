/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Info, HelpCircle, Mail, Phone, MapPin, Send, Check, Users, Sparkles } from "lucide-react";

export default function AboutView() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Contact form state
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMsg, setContactMsg] = useState("");
  const [isSent, setIsSent] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSent(true);
    setTimeout(() => {
      setContactName("");
      setContactEmail("");
      setContactMsg("");
      setIsSent(false);
    }, 4000);
  };

  const faqs = [
    {
      q: "Mengapa satu ayat memiliki tiga versi pembahasan berbeda?",
      a: "Tiap kelompok usia memiliki pergumulan hidup yang unik. Bahasa dan kedalaman teologis untuk anak usia 9 tahun tentu berbeda dengan mahasiswa usia 21 tahun. Firman Hidup memecahkan ini dengan memformulasikan 3 gaya bahasa dan kedalaman kontekstual (Anak-anak, Remaja, Pemuda) untuk satu nats Alkitab yang sama."
    },
    {
      q: "Bagaimana cara menyalurkan Donasi 1.000 Alkitab?",
      a: "Kami bermitra dengan lembaga Alkitab terpercaya dan jaringan misionaris lokal untuk mendistribusikan Alkitab cetak langsung ke daerah pedalaman terpencil. Setiap Rp 100.000 donasi Anda setara dengan 1 buah Alkitab fisik lengkap baru."
    },
    {
      q: "Apakah seluruh keuntungan merchandise digunakan untuk donasi?",
      a: "Ya, betul sekali. Laba bersih penjualan dari Toko Merchandise 100% dialokasikan untuk mendanai operasional pencetakan, pengiriman, dan pendistribusian Alkitab gratis bagi saudara seiman di pelosok Nusantara."
    },
    {
      q: "Bagaimana jika saya ingin mendaftar menjadi Relawan Pendoa?",
      a: "Kami sangat menyambut keterlibatan Anda! Kirimkan profil singkat Anda dan surat rekomendasi gereja asal Anda ke email kami: pendoa@firmanhidup.com."
    }
  ];

  const team = [
    {
      name: "Ev. Yohanes Susanto",
      role: "Pendiri & Direktur Pelayanan",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80"
    },
    {
      name: "Pdt. Maria Kristanti",
      role: "Koordinator Tim Kurator Renungan",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80"
    },
    {
      name: "Budi Wijaya, M.Th.",
      role: "Penerjemah & Teolog Kontekstual",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80"
    }
  ];

  return (
    <div className="space-y-12 pb-16 animate-fade-in" id="about-view">
      {/* Visi Misi Section */}
      <section className="bg-white border border-slate-100 rounded-3xl p-8 md:p-12 shadow-sm space-y-8">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="inline-flex items-center bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            <Info className="h-3.5 w-3.5 mr-1.5" />
            Mengenal Firman Hidup
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-800">Visi & Misi Pelayanan</h2>
          <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
            Firman Hidup adalah platform pelayanan digital oikumene non-profit yang bertujuan membawa berita sukacita Kristus ke tengah-tengah generasi muda Indonesia melalui media digital modern yang relevan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          <div className="bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-100 space-y-3">
            <span className="text-blue-600 font-extrabold text-xs uppercase tracking-widest font-display block">Visi Kami</span>
            <p className="text-slate-700 text-sm leading-relaxed font-semibold">
              "Menjadi pelita digital yang memulihkan, memperlengkapi, dan mempertemukan generasi muda dengan kebenaran Firman Allah yang sejati dan tidak berubah."
            </p>
          </div>
          <div className="bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-100 space-y-3">
            <span className="text-blue-600 font-extrabold text-xs uppercase tracking-widest font-display block">Misi Kami</span>
            <ul className="text-slate-600 text-xs sm:text-sm space-y-2 list-disc pl-5 leading-relaxed">
              <li>Menyediakan konten renungan harian Kristen yang setia pada doktrin Alkitabiah dan dikontekstualisasikan untuk rentang usia pertumbuhan.</li>
              <li>Mendukung penyebaran Alkitab cetak gratis secara merata ke wilayah pedalaman di seluruh Nusantara.</li>
              <li>Membangun ekosistem rohani yang sehat untuk mendukung doa, persahabatan, dan karakter generasi muda.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Tim Pelayanan Section */}
      <section className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 font-display">Tim Pelayan Firman</h2>
          <p className="text-xs text-slate-500 mt-1">Hamba-hamba Tuhan yang mendedikasikan waktu untuk menulis, mengoreksi, dan mengelola konten.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {team.map((member, idx) => (
            <div key={idx} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs text-center space-y-4">
              <div className="w-24 h-24 rounded-full overflow-hidden mx-auto bg-slate-50 border">
                <img src={member.image} alt={member.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-base font-display">{member.name}</h3>
                <p className="text-xs text-slate-400 mt-1">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Accordion FAQ Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 bg-white border border-slate-100 rounded-3xl p-8 shadow-xs space-y-6">
          <h2 className="text-2xl font-bold text-slate-800 font-display flex items-center">
            <HelpCircle className="h-6 w-6 text-blue-600 mr-2" />
            Pertanyaan Umum (FAQ)
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  id={`faq-item-${idx}`}
                  key={idx}
                  className="border border-slate-100 rounded-2xl overflow-hidden transition-all"
                >
                  <button
                    id={`faq-btn-${idx}`}
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full flex justify-between items-center p-4 text-left font-semibold text-slate-800 text-xs sm:text-sm hover:bg-slate-50 transition-all focus:outline-none"
                  >
                    <span>{faq.q}</span>
                    <span className="text-lg font-bold text-blue-600">{isOpen ? "−" : "+"}</span>
                  </button>
                  {isOpen && (
                    <div id={`faq-answer-${idx}`} className="p-4 bg-slate-50 border-t border-slate-100 text-xs text-slate-600 leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Kontak Form Section */}
        <div className="lg:col-span-5 bg-white border border-slate-100 rounded-3xl p-8 shadow-md">
          {isSent ? (
            <div id="contact-success-view" className="text-center py-12 space-y-4">
              <div className="mx-auto w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center animate-bounce">
                <Check className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">Pesan Terkirim</h3>
                <p className="text-xs text-slate-500 leading-relaxed mt-1">
                  Terima kasih sudah menghubungi kami. Tim administrasi kami akan membalas pesan Anda sesegera mungkin.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-4" id="contact-form">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-slate-800 font-display">Hubungi Kami</h2>
                <p className="text-xs text-slate-400">Punya saran, keluhan, atau rindu bermitra? Kirim pesan Anda.</p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-1">Nama Lengkap</label>
                <input
                  id="contact-input-name"
                  type="text"
                  required
                  placeholder="Nama Lengkap Anda..."
                  value={contactName}
                  onChange={e => setContactName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-blue-500 text-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-1">Alamat Email</label>
                <input
                  id="contact-input-email"
                  type="email"
                  required
                  placeholder="nama@email.com"
                  value={contactEmail}
                  onChange={e => setContactEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-blue-500 text-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-1">Pesan Anda</label>
                <textarea
                  id="contact-input-message"
                  required
                  rows={4}
                  placeholder="Ketik rincian pesan kemitraan atau pertanyaan Anda di sini..."
                  value={contactMsg}
                  onChange={e => setContactMsg(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:border-blue-500 text-slate-700 resize-none"
                ></textarea>
              </div>

              <button
                id="contact-submit-btn"
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center cursor-pointer transition-all shadow-md shadow-blue-500/10"
              >
                <Send className="h-4 w-4 mr-2" />
                Kirim Pesan
              </button>
            </form>
          )}

          {/* Quick Info contacts */}
          <div className="pt-6 border-t border-slate-100 mt-6 space-y-3 text-xs text-slate-500">
            <div className="flex items-center">
              <Mail className="h-4 w-4 text-blue-600 mr-2 shrink-0" />
              <span>info@firmanhidup.com</span>
            </div>
            <div className="flex items-center">
              <Phone className="h-4 w-4 text-blue-600 mr-2 shrink-0" />
              <span>+62 812-3456-7890</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 text-blue-600 mr-2 shrink-0" />
              <span>Yogyakarta, Indonesia</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
