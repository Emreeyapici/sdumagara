'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Mail, Shield, Radio, Compass } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-[#1b1f29] bg-[#090b0f] text-[#828896] text-xs mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-[#1b1f29]">
          {/* Brand & Logos */}
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              {/* SDÜMAK Logo */}
              <div className="w-8 h-8 rounded-full p-0.5 bg-[#141720] ring-1 ring-stone-700/80">
                <img
                  src="/images/sdumak-logo.png"
                  alt="SDÜMAK Logosu"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              {/* SDU Logo */}
              <div className="w-8 h-8 rounded-full p-0.5 bg-white ring-1 ring-stone-700/80">
                <img
                  src="/images/sdu-logo.png"
                  alt="Süleyman Demirel Üniversitesi Logosu"
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-[#f4f1ea] font-heading font-bold text-sm tracking-wide flex items-center gap-1.5">
                  SDÜMAK <span className="text-[#dba076] text-[10px] font-mono">[Kuruluş: 2025]</span>
                </span>
                <span className="text-[10px] text-[#8e94a3]">
                  Süleyman Demirel Üniversitesi Mağara Araştırma ve Koruma Topluluğu
                </span>
              </div>
            </div>
            <p className="text-[11px] text-[#828896] max-w-md leading-relaxed pt-1">
              Toroslar ve Isparta karstik mağara ekosistemlerini koruyan, bilimsel haritalama ve dikey tek ip teknikleriyle (SRT) araştıran üniversite topluluğu.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
            <Link href="/" className="hover:text-[#dba076] transition">
              Ana Sayfa
            </Link>
            <Link href="/onemli-bilgiler" className="hover:text-[#dba076] transition">
              Rehber
            </Link>
            <Link href="/forum" className="hover:text-[#dba076] transition">
              Forum
            </Link>
            <Link href="/etkinlikler" className="hover:text-[#dba076] transition">
              Faaliyetler
            </Link>
            <Link href="/magara-atlasi" className="hover:text-[#dba076] transition">
              Mağara Atlası
            </Link>
            <Link href="/ekipman" className="hover:text-[#dba076] transition">
              Ekipman
            </Link>
            <Link href="/guvenlik-takip" className="text-[#e09d9d] hover:text-[#f4f1ea] transition flex items-center gap-1">
              <Radio className="w-3 h-3" /> Canlı Takip
            </Link>
          </div>
        </div>

        {/* Bottom Credits & Emergency protocols */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#828896] font-mono">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} SDÜMAK. Isparta / Türkiye.</span>
            <span>•</span>
            <span className="text-[#a8adb8]">Tüm Hakları Saklıdır.</span>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-0.5 rounded bg-[#141720] border border-[#222838] text-[#a8adb8]">
              🚨 ACİL DURUM: AFAD (112) / TÜMAF
            </span>
            <span className="text-[#9fc4aa] flex items-center gap-1.5 font-sans">
              <span className="w-2 h-2 rounded-full bg-[#5c7c66]" />
              SİSTEM AKTİF
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
