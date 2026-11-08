'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  MessageSquare,
  Calendar,
  Compass,
  ArrowRight,
  Shield,
  Radio,
  UserPlus,
  LogIn,
  Heart,
  Clock,
  Sparkles,
  Lock,
  Package,
  BookOpen,
  Pin,
  Megaphone,
  MapPin,
  Image as ImageIcon,
} from 'lucide-react';
import AuthModal from '@/components/AuthModal';
import ImageCarousel from '@/components/ImageCarousel';

export default function HomePage() {
  const { currentUser, isAdmin, canViewPrivateSections, topics, events, safetyLogs, isInitialized } = useApp();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');

  // Featured topic: prefer one with images or first announcement
  const featuredTopic = topics.find((t) => t.images && t.images.length > 0) || topics[0];
  const otherTopics = topics.filter((t) => t.id !== featuredTopic?.id).slice(0, 4);
  const latestEvent = events[0];
  const upcomingEvents = events.slice(0, 3);
  const activeSafety = safetyLogs.filter((s) => s.status === 'Mağarada (Faaliyette)');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 w-full space-y-8">
      {/* Active Live Expedition Alert Banner if team is inside cave */}
      {canViewPrivateSections && activeSafety.length > 0 && (
        <div className="p-4 rounded-2xl bg-[#241717] border border-[#4d2828] flex items-center justify-between text-xs backdrop-blur-md shadow-sm">
          <div className="flex items-center space-x-3 text-[#e6a5a5]">
            <span className="w-2 h-2 rounded-full bg-[#c85555] shrink-0" />
            <span className="font-bold text-[#e6a5a5] bg-[#381a1a] px-2 py-0.5 rounded border border-[#592b2b]">
              CANLI FAALİYET:
            </span>
            <span className="text-[#d8d3cb]">
              <strong>{activeSafety[0].caveName}</strong> mağarasında {activeSafety[0].teamSize} kişilik ekip faaliyette.
            </span>
          </div>
          <Link
            href="/guvenlik-takip"
            className="text-[#dba076] hover:text-[#f2efe9] font-semibold underline shrink-0 text-xs"
          >
            Yüzey Masası →
          </Link>
        </div>
      )}

      {/* TOP BRAND BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#202533] pb-4">
        <div className="flex items-center space-x-3">
          {/* SDÜMAK Club Logo */}
          <div className="w-10 h-10 rounded-full p-0.5 bg-[#171a24] ring-1 ring-stone-700/80 shrink-0">
            <img
              src="/images/sdumak-logo.png"
              alt="SDÜMAK"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          {/* SDU University Logo */}
          <div className="w-10 h-10 rounded-full p-0.5 bg-white ring-1 ring-stone-700/80 shrink-0">
            <img
              src="/images/sdu-logo.png"
              alt="SDÜ"
              className="w-full h-full object-contain rounded-full"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-bold text-[#f4f1ea] font-heading">
                SDÜMAK
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#202534] text-[#dba076]">
                Kuruluş: 2025
              </span>
            </div>
            <p className="text-xs text-[#8e94a3]">
              Süleyman Demirel Üniversitesi Mağara Araştırma ve Koruma Topluluğu
            </p>
          </div>
        </div>

        {/* Quick Action Navigation */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <Link
            href="/onemli-bilgiler"
            className="px-3 py-1.5 rounded-xl bg-[#151923] hover:bg-[#1e2332] border border-[#2b3347] text-[#cfcac0] flex items-center gap-1.5 transition font-medium"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#dba076]" />
            <span>Rehber</span>
          </Link>
          <Link
            href="/forum"
            className="px-3 py-1.5 rounded-xl bg-[#241a14] hover:bg-[#332319] border border-[#4f3524] text-[#dba076] flex items-center gap-1.5 transition font-medium"
          >
            <Megaphone className="w-3.5 h-3.5" />
            <span>Haberler & Forum</span>
          </Link>
          <Link
            href="/etkinlikler"
            className="px-3.5 py-1.5 rounded-xl bg-[#c87d4a] hover:bg-[#b86d3b] text-white font-semibold flex items-center gap-1.5 transition shadow-sm"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Faaliyet Takvimi</span>
          </Link>
        </div>
      </div>

      {/* HERO SPOTLIGHT: SON HABERLER, DUYURULAR VE FAALİYETLER VİTRİNİ */}
      {!isInitialized ? (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 animate-pulse">
          <div className="lg:col-span-7 rounded-3xl cave-panel p-6 h-80 bg-[#12151e] border border-[#202534]" />
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="rounded-3xl cave-panel p-6 h-44 bg-[#12151e] border border-[#202534]" />
            <div className="rounded-3xl cave-panel p-6 h-32 bg-[#12151e] border border-[#202534]" />
          </div>
        </section>
      ) : (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column (7 cols): Latest Featured News / Bulletin with Photo Carousel */}
          {featuredTopic ? (
            <div className="lg:col-span-7 rounded-3xl cave-panel p-5 sm:p-6 border border-[#262c3e] flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#36251b] text-[#dba076] border border-[#523727] flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Son Duyuru / Haber
                    </span>
                    {featuredTopic.isPinned && (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-[#1f2535] text-stone-300 flex items-center gap-1">
                        <Pin className="w-3 h-3 text-[#dba076]" /> Sabitli
                      </span>
                    )}
                    {featuredTopic.tags?.[0] && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#161a25] text-stone-400">
                        #{featuredTopic.tags[0]}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-[#7e8494] font-mono">
                    {new Date(featuredTopic.createdAt).toLocaleDateString('tr-TR')}
                  </span>
                </div>

                {/* Title */}
                <Link
                  href={`/forum/${featuredTopic.id}`}
                  className="text-lg sm:text-xl font-bold text-white hover:text-[#dba076] transition block leading-snug font-heading"
                >
                  {featuredTopic.title}
                </Link>

                {/* Sliding Photo Gallery if has images */}
                {featuredTopic.images && featuredTopic.images.length > 0 && (
                  <div className="pt-1">
                    <ImageCarousel images={featuredTopic.images} alt={featuredTopic.title} aspectRatio="aspect-video" />
                  </div>
                )}

                {/* Content snippet */}
                <p className="text-xs sm:text-sm text-[#a8adb8] line-clamp-3 leading-relaxed">
                  {featuredTopic.content}
                </p>
              </div>

              {/* Bottom info & read more */}
              <div className="pt-3 border-t border-[#1d222e] flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <img
                    src={featuredTopic.author.avatar}
                    alt={featuredTopic.author.name}
                    className="w-7 h-7 rounded-lg object-cover bg-stone-800"
                  />
                  <span className="text-xs text-[#cfcac0] font-medium">
                    {featuredTopic.author.name}
                  </span>
                </div>

                <div className="flex items-center space-x-3 text-xs text-[#7e8494]">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-[#a64d4d]" /> {featuredTopic.likesCount}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5 text-[#dba076]" /> {featuredTopic.commentsCount}
                  </span>
                  <Link
                    href={`/forum/${featuredTopic.id}`}
                    className="text-[#dba076] hover:text-white font-semibold flex items-center gap-1 pl-2"
                  >
                    Haberi Oku <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="lg:col-span-7 rounded-3xl cave-panel p-6 border border-[#262c3e] flex flex-col items-center justify-center text-center space-y-3 min-h-[280px]">
              <Megaphone className="w-8 h-8 text-[#dba076]" />
              <h3 className="text-base font-bold text-white font-heading">Henüz Yayınlanmış Haber Yok</h3>
              <p className="text-xs text-[#8e94a3] max-w-md">
                Topluluğa ait ilk haberi veya duyuruyu yayınlamak için Forum bölümünden yeni konu açabilirsiniz.
              </p>
              {isAdmin && (
                <Link
                  href="/forum"
                  className="px-4 py-2 bg-[#c87d4a] text-white rounded-xl text-xs font-semibold hover:bg-[#b86d3b] transition"
                >
                  Yeni Haber / Duyuru Yayınla
                </Link>
              )}
            </div>
          )}

        {/* Right Column (5 cols): Latest Activity & Recent Feed */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Latest Activity Card */}
          {latestEvent && (
            <div className="p-5 rounded-3xl cave-panel border border-[#262c3e] space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#1b2b21] text-[#9fc4aa] border border-[#2d4837] flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Son / Yaklaşan Faaliyet
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#17221b] text-[#9fc4aa] font-medium border border-[#2a3d31]">
                    {latestEvent.status}
                  </span>
                </div>

                <Link
                  href="/etkinlikler"
                  className="text-base font-bold text-white hover:text-[#9fc4aa] transition block leading-snug font-heading"
                >
                  {latestEvent.title}
                </Link>

                {/* Event Photo preview or carousel */}
                {latestEvent.images && latestEvent.images.length > 0 ? (
                  <div className="pt-0.5">
                    <ImageCarousel images={latestEvent.images} alt={latestEvent.title} aspectRatio="aspect-[21/9]" />
                  </div>
                ) : latestEvent.coverImage ? (
                  <div className="h-28 w-full rounded-xl overflow-hidden border border-[#252c3e]">
                    <img src={latestEvent.coverImage} alt={latestEvent.title} className="w-full h-full object-cover" />
                  </div>
                ) : null}

                <div className="flex items-center gap-2 text-xs text-[#8e94a3]">
                  <Clock className="w-3.5 h-3.5 text-[#dba076]" />
                  <span>{latestEvent.startDate} — {latestEvent.endDate}</span>
                  <span>•</span>
                  <span className="text-[#cfcac0]">{latestEvent.caveName}</span>
                </div>

                <p className="text-xs text-[#8e94a3] line-clamp-2">
                  {latestEvent.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[#1d222e] flex items-center justify-between text-xs">
                <span className="text-[#8e94a3]">
                  Kontenjan: <strong className="text-white">{latestEvent.registeredUserIds.length}/{latestEvent.quota}</strong>
                </span>
                <Link
                  href="/etkinlikler"
                  className="text-xs font-semibold text-[#9fc4aa] hover:text-white flex items-center gap-1"
                >
                  Faaliyete Başvur <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          )}

          {/* Other Recent Bulletins / Topics Quick List */}
          <div className="p-4 rounded-3xl cave-panel border border-[#262c3e] space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-[#1d222e]">
              <span className="text-xs font-bold text-[#f4f1ea] uppercase tracking-wider flex items-center gap-1.5 font-heading">
                <Megaphone className="w-3.5 h-3.5 text-[#dba076]" /> Diğer Son Haberler
              </span>
              <Link href="/forum" className="text-[11px] text-[#dba076] hover:underline">
                Tümü →
              </Link>
            </div>

            <div className="space-y-2">
              {otherTopics.map((topic) => (
                <Link
                  key={topic.id}
                  href={`/forum/${topic.id}`}
                  className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-[#181d29] transition group"
                >
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-semibold text-[#e8e4dc] group-hover:text-[#dba076] transition truncate">
                      {topic.title}
                    </h4>
                    <span className="text-[10px] text-[#7e8494] font-mono">
                      {new Date(topic.createdAt).toLocaleDateString('tr-TR')}
                    </span>
                  </div>
                  {topic.images && topic.images.length > 0 && (
                    <span className="shrink-0 text-[10px] text-[#dba076] flex items-center gap-0.5">
                      <ImageIcon className="w-3 h-3" /> {topic.images.length}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
      )}

      {/* CORE NAVIGATION TILES */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Forum Tile */}
        <Link
          href="/forum"
          className="p-5 rounded-2xl cave-panel hover:border-[#38435c] transition space-y-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#241a14] border border-[#483324] flex items-center justify-center text-[#dba076]">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#f4f1ea] group-hover:text-[#dba076] transition font-heading">
              Topluluk Forumu & Bülten
            </h3>
            <p className="text-xs text-[#8e94a3] mt-1 leading-relaxed">
              Resmi kulüp duyuruları, mağara faaliyet raporları ve SRT dikey ekipman incelemeleri.
            </p>
          </div>
          <span className="text-[11px] font-semibold text-[#8e94a3] group-hover:text-[#dba076] flex items-center gap-1">
            Konuları incele <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </span>
        </Link>

        {/* Events Tile */}
        <Link
          href="/etkinlikler"
          className="p-5 rounded-2xl cave-panel hover:border-[#38435c] transition space-y-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#17221b] border border-[#2a3d31] flex items-center justify-center text-[#9fc4aa]">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#f4f1ea] group-hover:text-[#9fc4aa] transition font-heading">
              Faaliyet & Eğitim Takvimi
            </h3>
            <p className="text-xs text-[#8e94a3] mt-1 leading-relaxed">
              Güz dönemi çaylak eğitimi, dikey ip antrenmanları ve haritalama keşif seferleri.
            </p>
          </div>
          <span className="text-[11px] font-semibold text-[#8e94a3] group-hover:text-[#9fc4aa] flex items-center gap-1">
            Kamplara başvur <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </span>
        </Link>

        {/* Cave Atlas / Restricted Tile */}
        {canViewPrivateSections ? (
          <Link
            href="/magara-atlasi"
            className="p-5 rounded-2xl cave-panel hover:border-[#38435c] transition space-y-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#151f2b] border border-[#27384e] flex items-center justify-center text-[#a5bed9]">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#f4f1ea] group-hover:text-[#a5bed9] transition font-heading">
                Isparta Mağara Atlası
              </h3>
              <p className="text-xs text-[#8e94a3] mt-1 leading-relaxed">
                İncesu, Zindan ve Pınargözü mağaralarının harita krokileri, derinlik ve GPS veritabanı.
              </p>
            </div>
            <span className="text-[11px] font-semibold text-[#8e94a3] group-hover:text-[#a5bed9] flex items-center gap-1">
              Atlası aç <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        ) : (
          <div className="p-5 rounded-2xl cave-panel space-y-3 opacity-80">
            <div className="w-10 h-10 rounded-xl bg-[#141720] border border-[#242b3a] flex items-center justify-center text-[#7e8494]">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#cfcac0] font-heading">
                Özel Alanlar (Atlas & Envanter)
              </h3>
              <p className="text-xs text-[#7e8494] mt-1 leading-relaxed">
                Mağara atlası, ekipman zimmet takibi ve canlı yüzey masası can güvenliği protokolü gereği yetkililere açıktır.
              </p>
            </div>
            <span className="text-[10px] text-[#7e8494] block">
              Yetkiler Yönetici (Admin) tarafından onaylanır.
            </span>
          </div>
        )}
      </section>

      {/* ALL ANNOUNCEMENTS & NEWS SECTION */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#1d222e] pb-3">
          <h2 className="text-xs font-bold text-[#f4f1ea] uppercase tracking-wider flex items-center gap-2 font-heading">
            <span className="w-2 h-2 rounded-full bg-[#c87d4a]" />
            Resmi Kulüp Duyuruları & Bülten
          </h2>
          <Link href="/forum" className="text-xs font-semibold text-[#dba076] hover:text-[#f4f1ea] transition">
            Tüm Konuları İncele →
          </Link>
        </div>

        <div className="space-y-2.5">
          {topics.slice(0, 3).map((t) => (
            <Link
              key={t.id}
              href={`/forum/${t.id}`}
              className="p-4 rounded-2xl cave-panel hover:border-[#38435c] transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-[#1c2230] text-[#cfcac0] border border-[#2b3347] font-mono">
                    {t.tags[0] || 'Duyuru'}
                  </span>
                  <span className="text-xs text-[#7e8494]">
                    {new Date(t.createdAt).toLocaleDateString('tr-TR')}
                  </span>
                  {t.images && t.images.length > 0 && (
                    <span className="text-[10px] text-[#dba076] font-mono flex items-center gap-0.5">
                      <ImageIcon className="w-3 h-3" /> {t.images.length} Fotoğraflı
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-semibold text-[#e8e4dc] group-hover:text-[#dba076] transition truncate font-sans">
                  {t.title}
                </h3>
              </div>

              <div className="flex items-center gap-3 text-xs text-[#7e8494] shrink-0">
                <span className="flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 text-[#a64d4d]" /> {t.likesCount}
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5 text-[#dba076]" /> {t.commentsCount}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* UPCOMING CAMPS & EVENTS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#1d222e] pb-3">
          <h2 className="text-xs font-bold text-[#f4f1ea] uppercase tracking-wider flex items-center gap-2 font-heading">
            <span className="w-2 h-2 rounded-full bg-[#5c7c66]" />
            Yaklaşan Faaliyetler & Kamplar
          </h2>
          <Link href="/etkinlikler" className="text-xs font-semibold text-[#9fc4aa] hover:text-[#f4f1ea] transition">
            Takvimi Aç →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {upcomingEvents.map((ev) => (
            <Link
              key={ev.id}
              href="/etkinlikler"
              className="p-5 rounded-2xl cave-panel hover:border-[#38435c] transition space-y-3 flex flex-col justify-between group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-[#8e94a3]">
                  <span className="flex items-center gap-1 text-[#9fc4aa] font-medium">
                    <Clock className="w-3.5 h-3.5" /> {ev.startDate}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#17221b] text-[#9fc4aa] border border-[#2a3d31] font-semibold">
                    {ev.status}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-[#f4f1ea] group-hover:text-[#dba076] transition line-clamp-2 font-heading">
                  {ev.title}
                </h3>
                <p className="text-xs text-[#8e94a3] line-clamp-2 leading-relaxed font-sans">
                  {ev.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[#1d222e] flex justify-between items-center text-xs text-[#8e94a3]">
                <span className="text-[#cfcac0]">{ev.caveName}</span>
                <span className="font-semibold text-[#9fc4aa] bg-[#17221b] px-2 py-0.5 rounded border border-[#2a3d31]">
                  {ev.registeredUserIds.length}/{ev.quota} Üye
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} defaultTab={authModalTab} />
    </div>
  );
}
