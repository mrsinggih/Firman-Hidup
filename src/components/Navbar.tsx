/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { BookOpen, Flame, Heart, ShoppingBag, Info, Settings, LogOut, Lock } from "lucide-react";
import { User } from "../types";

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  currentUser: User | null;
  onLogout: () => void;
  onOpenLoginModal: () => void;
}

export default function Navbar({
  currentTab,
  setCurrentTab,
  currentUser,
  onLogout,
  onOpenLoginModal
}: NavbarProps) {
  const menuItems = [
    { id: "beranda", label: "Beranda", icon: Flame },
    { id: "renungan", label: "Renungan", icon: Heart },
    { id: "alkitab", label: "Baca Alkitab", icon: BookOpen },
    { id: "donasi", label: "Donasi Alkitab", icon: Heart },
    { id: "merchandise", label: "Merchandise", icon: ShoppingBag },
    { id: "tentang", label: "Tentang Kami", icon: Info }
  ];

  return (
    <nav className="bg-white border-b border-slate-150 sticky top-0 z-50 shadow-xs" id="main-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => setCurrentTab("beranda")}>
            <div className="bg-blue-600 text-white p-2 rounded-xl mr-3 flex items-center justify-center shadow-md shadow-blue-100">
              <Flame className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xl font-bold text-slate-800 tracking-tight font-display">Firman Hidup</span>
              <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">Pelayanan Digital</p>
            </div>
          </div>

          {/* Nav Items - Desktop */}
          <div className="hidden md:flex space-x-1 items-center">
            {menuItems.map(item => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  id={`nav-tab-${item.id}`}
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon className={`h-4 w-4 mr-2 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* User Section / Admin Toggle */}
          <div className="flex items-center space-x-2">
            {currentUser ? (
              <div className="flex items-center space-x-2">
                {currentUser.role === "admin" && (
                  <button
                    id="nav-admin-btn"
                    onClick={() => setCurrentTab("admin")}
                    className={`flex items-center px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-200 ${
                      currentTab === "admin"
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Admin Panel
                  </button>
                )}
                <div className="hidden lg:block text-right">
                  <p className="text-xs font-semibold text-slate-700">{currentUser.email}</p>
                  <p className="text-[10px] text-slate-400 capitalize">{currentUser.role}</p>
                </div>
                <button
                  id="nav-logout-btn"
                  onClick={onLogout}
                  title="Keluar"
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                id="nav-login-btn"
                onClick={onOpenLoginModal}
                className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md shadow-blue-100 hover:shadow-lg transition-all duration-200"
              >
                <Lock className="h-4 w-4 mr-2" />
                Masuk
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Nav Items - Mobile scrollbar */}
      <div className="md:hidden flex overflow-x-auto px-4 py-2 space-x-2 border-t border-slate-100 bg-slate-50/50">
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              id={`nav-tab-mobile-${item.id}`}
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                isActive ? "bg-blue-600 text-white" : "bg-white text-slate-600 border border-slate-200"
              }`}
            >
              <Icon className="h-3 w-3 mr-1.5" />
              {item.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
