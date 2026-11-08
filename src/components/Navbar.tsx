'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  Flashlight,
  User as UserIcon,
  LogIn,
  Menu,
  X,
  ShieldCheck,
  Lock,
} from 'lucide-react';
import AuthModal from './AuthModal';

interface NavLinkItem {
  href: string;
  label: string;
  isAlert?: boolean;
}

export default function Navbar() {
  const pathname = usePathname();
  const { currentUser, isAdmin, canViewPrivateSections, headlampMode, toggleHeadlampMode } = useApp();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Base links visible to all
  const publicLinks: NavLinkItem[] = [
    { href: '/', label: 'Ana Sayfa' },
    { href: '/onemli-bilgiler', label: 'Rehber' },
    { href: '/forum', label: 'Forum & Duyurular' },
    { href: '/etkinlikler', label: 'Faaliyetler' },
    { href: '/hakkimizda', label: 'Kulüp Hakkında' },
  ];

  // Private links visible ONLY to admin, yonetim, and egitmen
  const privateLinks: NavLinkItem[] = [
    { href: '/magara-atlasi', label: 'Mağara Atlası' },
    { href: '/ekipman', label: 'Ekipman' },
    { href: '/guvenlik-takip', label: 'Canlı Takip', isAlert: true },
  ];

  const visibleLinks = [
    ...publicLinks,
    ...(canViewPrivateSections ? privateLinks : []),
  ];

  // Clean, official role badge with organic mineral styling
  const getRoleBadge = (role?: string) => {
    switch (role) {
      case 'admin':
        return { label: 'Kurucu Admin', color: 'bg-[#2b1717] text-[#e8a2a2] border-[#4a2626]' };
      case 'yonetim':
        return { label: 'Yönetim Kurulu', color: 'bg-[#291e14] text-[#dfb28e] border-[#4a3424]' };
      case 'egitmen':
        return { label: 'Eğitmen / SRT', color: 'bg-[#18261d] text-[#9fc4aa] border-[#294232]' };
      case 'uye':
        return { label: 'Aktif Üye', color: 'bg-[#18202d] text-[#a5bed9] border-[#29374d]' };
      default:
        return { label: 'Çaylak', color: 'bg-[#171920] text-[#a1a5b0] border-[#262833]' };
    }
  };

  const roleBadge = currentUser ? getRoleBadge(currentUser.role) : null;

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-[#1d222e] bg-[#0d0f14]/95 backdrop-blur-md shadow-md shadow-black/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 sm:h-18">
            {/* Top Left: SDÜMAK Logo + SDU Logo Side by Side */}
            <Link href="/" className="flex items-center space-x-3 group py-1">
              <div className="flex items-center space-x-2 shrink-0">
                {/* 1. SDÜMAK Club Logo */}
                <div className="relative w-10 h-10 rounded-full p-0.5 bg-[#171a22] ring-1 ring-stone-700/80 group-hover:ring-[#c87d4a]/80 transition-all">
                  <div className="w-full h-full rounded-full bg-[#0d0f14] overflow-hidden flex items-center justify-center">
                    <img
                      src="/images/sdumak-logo.png"
                      alt="SDÜMAK Topluluk Logosu"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* 2. SDU University Logo */}
                <div className="relative w-10 h-10 rounded-full p-0.5 bg-[#171a22] ring-1 ring-stone-700/80 group-hover:ring-[#c87d4a]/80 transition-all">
                  <div className="w-full h-full rounded-full bg-white overflow-hidden flex items-center justify-center p-0.5">
                    <img
                      src="/images/sdu-logo.png"
                      alt="Süleyman Demirel Üniversitesi Logosu"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              </div>

              {/* Title & Slogan */}
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-bold tracking-tight text-[#f4f1ea] group-hover:text-[#dba076] transition font-heading">
                    SDÜMAK
                  </span>
                  <span className="text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded bg-[#1c2230] text-[#cfcac0] border border-[#2b3347] uppercase tracking-wider hidden sm:inline-block">
                    SDÜ
                  </span>
                </div>
                <span className="text-[11px] text-[#8e94a3] font-medium truncate max-w-[140px] sm:max-w-none">
                  Süleyman Demirel Üniversitesi
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {visibleLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition tracking-wide ${
                      isActive
                        ? 'text-[#f4f1ea] bg-[#1a1f2b] border border-[#2e374d] shadow-sm font-semibold'
                        : link.isAlert
                        ? 'text-[#e09d9d] hover:bg-[#281616] hover:text-white'
                        : 'text-[#9fa5b5] hover:text-[#f4f1ea] hover:bg-[#141720]'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}

              {/* Admin Panel Link (Strictly Admin Only) */}
              {isAdmin && (
                <Link
                  href="/uye-yonetimi"
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                    pathname === '/uye-yonetimi'
                      ? 'bg-[#c87d4a] text-white font-bold shadow-sm'
                      : 'text-[#dba076] hover:bg-[#291e14] border border-[#4a3424]'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Üye & Yetkiler</span>
                </Link>
              )}
            </nav>

            {/* Right side items: Headlamp + User */}
            <div className="flex items-center space-x-2.5">
              {/* Headlamp Toggle (Kafa Feneri) */}
              <button
                onClick={toggleHeadlampMode}
                title={headlampMode ? 'Kafa Fenerini Söndür' : 'Kafa Fenerini Yak'}
                className={`p-2 rounded-xl text-xs transition border flex items-center gap-1.5 ${
                  headlampMode
                    ? 'bg-[#c87d4a] text-white border-[#df9b6d] font-semibold'
                    : 'border-[#222735] bg-[#12151e] text-[#9fa5b5] hover:text-[#f4f1ea] hover:border-[#2e3547]'
                }`}
              >
                <Flashlight className="w-4 h-4" />
                <span className="text-[11px] hidden sm:inline-block font-medium">
                  {headlampMode ? 'Fener Açık' : 'Fener'}
                </span>
              </button>

              {/* User profile / Login */}
              {currentUser ? (
                <Link
                  href="/profil"
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-[#222735] bg-[#12151e] hover:border-[#3b4357] hover:bg-[#161a25] transition group shadow-sm"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-stone-700 group-hover:ring-[#c87d4a] bg-stone-900 shrink-0"
                  />
                  <div className="flex flex-col text-left hidden sm:flex min-w-0">
                    <span className="text-xs font-semibold text-[#f4f1ea] group-hover:text-[#dba076] transition leading-snug truncate max-w-[130px]">
                      {currentUser.name}
                    </span>
                    {roleBadge && (
                      <span className={`text-[9px] leading-none px-1.5 py-0.5 rounded border font-medium w-fit mt-0.5 ${roleBadge.color}`}>
                        {roleBadge.label}
                      </span>
                    )}
                  </div>
                </Link>
              ) : (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setAuthModalOpen(true)}
                    className="px-3 py-1.5 text-xs font-medium text-[#9fa5b5] hover:text-white transition rounded-xl hover:bg-[#141720]"
                  >
                    Giriş
                  </button>
                  <Link
                    href="/profil"
                    className="px-3.5 py-1.5 rounded-xl bg-[#c87d4a] hover:bg-[#b86d3b] text-white text-xs font-semibold transition shadow-sm"
                  >
                    Kayıt Ol
                  </Link>
                </div>
              )}

              {/* Mobile trigger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-1.5 text-stone-400 hover:text-white"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#1c2436] bg-[#0c1017] px-4 py-3 space-y-1">
            {visibleLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-xl text-xs font-bold ${
                    isActive ? 'bg-[#151d2d] text-amber-400 border border-amber-500/20' : 'text-stone-300'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            {isAdmin && (
              <Link
                href="/uye-yonetimi"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20"
              >
                🛡️ Üye & Yetki Yönetimi
              </Link>
            )}
            {currentUser && (
              <Link
                href="/profil"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-xs font-bold text-amber-400"
              >
                Profilim ({currentUser.name})
              </Link>
            )}
          </div>
        )}
      </header>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
}
