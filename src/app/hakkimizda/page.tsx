'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { BoardMember, FAQItem } from '@/types';
import {
  Shield,
  Award,
  Users,
  Compass,
  MapPin,
  Mail,
  Phone,
  Heart,
  Plus,
  Edit3,
  Trash2,
  X,
  HelpCircle,
  Briefcase,
  CheckCircle2,
  Upload,
  Camera,
  ExternalLink,
} from 'lucide-react';

function InstagramIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export default function AboutPage() {
  const {
    isAdmin,
    boardMembers,
    addBoardMember,
    updateBoardMember,
    deleteBoardMember,
    faqs,
    addFAQ,
    updateFAQ,
    deleteFAQ,
  } = useApp();

  // Board Member Modal State
  const [boardModalOpen, setBoardModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<BoardMember | null>(null);
  const [memberName, setMemberName] = useState('');
  const [memberRole, setMemberRole] = useState('');
  const [memberDesk, setMemberDesk] = useState('Yönetim Masası');
  const [memberAvatar, setMemberAvatar] = useState('/images/sdumak-logo.png');
  const [memberContact, setMemberContact] = useState('');
  const [boardError, setBoardError] = useState('');
  const boardFileRef = useRef<HTMLInputElement>(null);

  // FAQ Modal State
  const [faqModalOpen, setFaqModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQItem | null>(null);
  const [faqQuestion, setFaqQuestion] = useState('');
  const [faqAnswer, setFaqAnswer] = useState('');
  const [faqCategory, setFaqCategory] = useState('Genel');

  const principles = [
    {
      title: 'Mağara Koruma İlkesi',
      desc: 'Mağaralar binlerce yılda oluşan hassas ekosistemlerdir. Topluluğumuz "Fotoğraftan başka bir şey alma, ayak izinden başka bir şey bırakma, zamandan başka bir şey öldürme" kuralını harfiyen uygular.',
    },
    {
      title: 'SRT ve Can Güvenliği',
      desc: 'Dikey mağaracılıkta şansa yer yoktur. Tüm dikey faaliyetlerde çift emniyet, CE/UIAA onaylı malzeme ve düzenli ip muayenesi zorunludur.',
    },
    {
      title: 'Bilimsel Speleoloji',
      desc: 'Amacımız yalnızca sportif inişler yapmak değil; Isparta ve Akdeniz bölgesindeki hidrolojik hatları, yarasa türlerini ve karstik yapıları haritalandırıp bilime kazandırmaktır.',
    },
  ];

  // Board Member Form Handlers
  const handleOpenAddMember = () => {
    if (boardMembers.length >= 20) {
      alert('Yönetim ve masalar listesine en fazla 20 kişi eklenebilir.');
      return;
    }
    setEditingMember(null);
    setMemberName('');
    setMemberRole('');
    setMemberDesk('Yönetim Masası');
    setMemberAvatar('/images/sdumak-logo.png');
    setMemberContact('');
    setBoardError('');
    setBoardModalOpen(true);
  };

  const handleOpenEditMember = (m: BoardMember) => {
    setEditingMember(m);
    setMemberName(m.name);
    setMemberRole(m.role);
    setMemberDesk(m.desk);
    setMemberAvatar(m.avatar || '/images/sdumak-logo.png');
    setMemberContact(m.contact || '');
    setBoardError('');
    setBoardModalOpen(true);
  };

  const handleSaveMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberName.trim() || !memberRole.trim() || !memberDesk.trim()) {
      setBoardError('Lütfen ad, görev ve masa adını doldurun.');
      return;
    }

    if (editingMember) {
      updateBoardMember(editingMember.id, {
        name: memberName.trim(),
        role: memberRole.trim(),
        desk: memberDesk.trim(),
        avatar: memberAvatar,
        contact: memberContact.trim(),
      });
      setBoardModalOpen(false);
    } else {
      const res = addBoardMember({
        name: memberName.trim(),
        role: memberRole.trim(),
        desk: memberDesk.trim(),
        avatar: memberAvatar,
        contact: memberContact.trim(),
      });
      if (!res.success) {
        setBoardError(res.message || 'Masa üyesi eklenemedi.');
      } else {
        setBoardModalOpen(false);
      }
    }
  };

  const handleDeleteMember = (id: string, name: string) => {
    if (window.confirm(`"${name}" adlı yetkiliyi masadan kaldırmak istediğinizden emin misiniz?`)) {
      deleteBoardMember(id);
    }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setBoardError('Fotoğraf boyutu 2 MB üzerinde olamaz.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setMemberAvatar(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // FAQ Handlers
  const handleOpenAddFaq = () => {
    setEditingFaq(null);
    setFaqQuestion('');
    setFaqAnswer('');
    setFaqCategory('Genel');
    setFaqModalOpen(true);
  };

  const handleOpenEditFaq = (f: FAQItem) => {
    setEditingFaq(f);
    setFaqQuestion(f.question);
    setFaqAnswer(f.answer);
    setFaqCategory(f.category || 'Genel');
    setFaqModalOpen(true);
  };

  const handleSaveFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!faqQuestion.trim() || !faqAnswer.trim()) return;

    if (editingFaq) {
      updateFAQ(editingFaq.id, {
        question: faqQuestion.trim(),
        answer: faqAnswer.trim(),
        category: faqCategory.trim(),
      });
    } else {
      addFAQ({
        question: faqQuestion.trim(),
        answer: faqAnswer.trim(),
        category: faqCategory.trim(),
      });
    }
    setFaqModalOpen(false);
  };

  const handleDeleteFaq = (id: string, q: string) => {
    if (window.confirm(`"${q}" sorusunu silmek istediğinizden emin misiniz?`)) {
      deleteFAQ(id);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 w-full space-y-12">
      {/* Title with Official Logos */}
      <div className="border-b border-[#1e2533] pb-6 space-y-4">
        <div className="flex items-center space-x-3">
          {/* SDÜMAK Logo */}
          <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-br from-amber-400 to-amber-700 ring-2 ring-amber-500/50 shadow-lg shadow-amber-500/30 shrink-0">
            <img
              src="/images/sdumak-logo.png"
              alt="SDÜMAK Logosu"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          {/* SDU Logo */}
          <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-br from-rose-500 to-red-700 ring-2 ring-rose-500/50 shadow-lg shadow-rose-500/30 bg-white shrink-0">
            <img
              src="/images/sdu-logo.png"
              alt="Süleyman Demirel Üniversitesi Logosu"
              className="w-full h-full object-contain rounded-full"
            />
          </div>
          <div className="space-y-0.5">
            <div className="text-xs font-mono text-amber-400 uppercase tracking-widest font-bold">
              [ KURUMSAL KÜNYE & TÜZÜK • KURULUŞ: 2025 ]
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight font-heading">
              Süleyman Demirel Üniversitesi Mağara Araştırma ve Koruma Topluluğu
            </h1>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-3xl font-normal">
          SDÜMAK, Süleyman Demirel Üniversitesi Sağlık Kültür ve Spor Daire Başkanlığı bünyesinde 
          faaliyet gösteren, Türkiye Mağaracılık Federasyonu (TÜMAF) ilkelerine bağlı resmi üniversite topluluğudur.
        </p>
      </div>

      {/* Principles */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold text-[#f4f1ea] uppercase tracking-wider flex items-center gap-2 font-heading">
          <span className="w-2 h-2 rounded-full bg-[#c87d4a]" />
          Temel İlkelerimiz & Tüzük Esasları
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {principles.map((p, idx) => (
            <div key={idx} className="p-5 rounded-2xl cave-panel space-y-2">
              <h3 className="text-sm font-bold text-[#dba076] font-heading">{p.title}</h3>
              <p className="text-xs text-[#8e94a3] leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Board Members & Desks (Kulüp Yönetimi & Masalar) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <h2 className="text-xs font-bold text-[#f4f1ea] uppercase tracking-wider flex items-center gap-2 font-heading">
              <span className="w-2 h-2 rounded-full bg-[#5c7c66]" />
              Kulüp Yönetimi & Masalar
            </h2>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#18231c] text-[#9fc4aa] border border-[#263a2c] font-mono">
              {boardMembers.length} / 20 Kişi
            </span>
          </div>

          {isAdmin && (
            <button
              onClick={handleOpenAddMember}
              disabled={boardMembers.length >= 20}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 shadow-sm ${
                boardMembers.length >= 20
                  ? 'bg-stone-800 text-stone-500 cursor-not-allowed'
                  : 'bg-[#c87d4a] hover:bg-[#b86d3b] text-white shadow-sm'
              }`}
            >
              <Plus className="w-3.5 h-3.5" /> Masa / Yönetici Ekle
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {boardMembers.map((m) => (
            <div
              key={m.id}
              className="p-4 rounded-xl cave-panel text-center space-y-2 relative group flex flex-col justify-between"
            >
              {/* Admin Actions */}
              {isAdmin && (
                <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 p-1 rounded-lg">
                  <button
                    onClick={() => handleOpenEditMember(m)}
                    title="Düzenle"
                    className="p-1 text-stone-300 hover:text-[#dba076]"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleDeleteMember(m.id, m.name)}
                    title="Sil"
                    className="p-1 text-stone-300 hover:text-[#e09d9d]"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              )}

              <div className="space-y-2">
                <div className="w-12 h-12 mx-auto rounded-full ring-1 ring-stone-700/80 overflow-hidden bg-stone-900 flex items-center justify-center">
                  <img
                    src={m.avatar || '/images/sdumak-logo.png'}
                    alt={m.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#f4f1ea] font-heading">{m.name}</h4>
                  <div className="text-[11px] text-[#dba076] font-medium leading-tight mt-0.5">{m.role}</div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#1d222e] space-y-1">
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#161a24] text-[#cfcac0] border border-[#252b3a] block truncate font-mono">
                  {m.desk}
                </span>
                {m.contact && (
                  <span className="text-[9px] text-[#7e8494] block truncate">{m.contact}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQs (Sıkça Sorulan Sorular) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-[#f4f1ea] uppercase tracking-wider flex items-center gap-2 font-heading">
            <span className="w-2 h-2 rounded-full bg-[#4a6382]" />
            Sıkça Sorulan Sorular (SSS)
          </h2>

          {isAdmin && (
            <button
              onClick={handleOpenAddFaq}
              className="px-3 py-1.5 rounded-xl bg-[#192230] hover:bg-[#233045] border border-[#2e3e59] text-[#cfcac0] font-medium text-xs transition flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5 text-[#dba076]" /> Soru Ekle
            </button>
          )}
        </div>

        <div className="space-y-3">
          {faqs.map((f) => (
            <div key={f.id} className="p-4 rounded-xl cave-panel space-y-1.5 relative group">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2">
                  {f.category && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#192230] text-[#a4bed9] border border-[#29374d] font-mono">
                      {f.category}
                    </span>
                  )}
                  <h4 className="text-xs font-bold text-[#f4f1ea] font-heading">{f.question}</h4>
                </div>

                {isAdmin && (
                  <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleOpenEditFaq(f)}
                      title="Soruyu Düzenle"
                      className="p-1 rounded bg-[#181c26] hover:bg-[#222736] text-stone-300 hover:text-[#dba076] transition"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleDeleteFaq(f.id, f.question)}
                      title="Soruyu Sil"
                      className="p-1 rounded bg-[#281616] hover:bg-[#3d1e1e] text-[#e09d9d] transition"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
              <p className="text-xs text-[#8e94a3] leading-relaxed pt-1 font-sans">{f.answer}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Community Room & Instagram Contact Card */}
      <div className="p-6 rounded-2xl cave-panel grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
        {/* Room & Location */}
        <div className="flex items-start space-x-3.5">
          <a
            href="https://maps.google.com/?q=SD%C3%9C+Spor+Bilimleri+Fak%C3%BCltesi+ve+Kapal%C3%BD+Spor+Salonu+Isparta"
            target="_blank"
            rel="noopener noreferrer"
            title="Haritada Konumu Göster"
            className="w-11 h-11 rounded-xl bg-[#241a14] border border-[#483324] flex items-center justify-center text-[#dba076] hover:bg-[#342419] hover:border-[#6b472e] transition shrink-0 group/pin"
          >
            <MapPin className="w-5 h-5 group-hover/pin:scale-110 transition-transform" />
          </a>
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#a8adb8] block">
              Topluluk Odası
            </span>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-[#f4f1ea] font-heading">
                SDÜ Spor Bilimleri Fakültesi ve Kapalı Spor Salonu Üst Katı
              </h3>
              <a
                href="https://maps.google.com/?q=SD%C3%9C+Spor+Bilimleri+Fak%C3%BCltesi+ve+Kapal%C3%BD+Spor+Salonu+Isparta"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-[#dba076] hover:underline flex items-center gap-0.5 font-sans"
              >
                <span>Konum</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-xs text-[#8e94a3]">
              Süleyman Demirel Üniversitesi Doğu Yerleşkesi, Çünür / Isparta
            </p>
          </div>
        </div>

        {/* Instagram & Social Communication */}
        <div className="flex items-center space-x-3.5 md:border-l md:border-[#222838] md:pl-6">
          <a
            href="https://instagram.com/sdumagara"
            target="_blank"
            rel="noopener noreferrer"
            title="Instagram'da Takip Edin"
            className="w-11 h-11 rounded-xl bg-[#1d1624] border border-[#442c54] flex items-center justify-center text-[#d2a8e8] hover:bg-[#2b1f36] hover:border-[#694285] transition shrink-0 group/ig"
          >
            <InstagramIcon className="w-5 h-5 group-hover/ig:scale-110 transition-transform" />
          </a>
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#a8adb8] block">
              İletişim & Sosyal Medya
            </span>
            <a
              href="https://instagram.com/sdumagara"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-bold text-[#f4f1ea] hover:text-[#dba076] transition flex items-center gap-1.5 font-heading"
            >
              <span>Instagram:</span>
              <span className="text-[#dba076] font-mono font-bold">@sdumagara</span>
              <ExternalLink className="w-3 h-3 text-stone-500" />
            </a>
            <span className="text-xs text-[#8e94a3] block">
              Faaliyet duyuruları ve doğrudan mesaj için takip edebilirsiniz.
            </span>
          </div>
        </div>
      </div>

      {/* Board Member Add/Edit Modal */}
      {boardModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#121622] border border-amber-500/30 rounded-2xl w-full max-w-md shadow-2xl p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-stone-800 pb-2">
              <h3 className="text-sm font-bold text-amber-400 flex items-center gap-1.5 font-heading">
                <Briefcase className="w-4 h-4" />
                {editingMember ? 'Yönetici / Masa Üyesini Düzenle' : 'Yeni Masa / Yönetici Ekle'}
              </h3>
              <button onClick={() => setBoardModalOpen(false)} className="text-stone-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {boardError && (
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[11px]">
                {boardError}
              </div>
            )}

            <form onSubmit={handleSaveMember} className="space-y-3">
              {/* Avatar section */}
              <div>
                <label className="block text-stone-300 mb-1 font-medium">Fotoğraf / Avatar</label>
                <div className="flex items-center gap-3">
                  <img
                    src={memberAvatar}
                    alt="Önizleme"
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-amber-500/30 bg-stone-900 shrink-0"
                  />
                  <div className="space-y-1 flex-1">
                    <input
                      type="file"
                      ref={boardFileRef}
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => boardFileRef.current?.click()}
                      className="px-3 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg text-[11px] font-medium flex items-center gap-1.5"
                    >
                      <Upload className="w-3 h-3 text-amber-400" /> Cihazdan Fotoğraf Seç
                    </button>
                    <input
                      type="text"
                      value={memberAvatar}
                      onChange={(e) => setMemberAvatar(e.target.value)}
                      placeholder="Veya görsel linki..."
                      className="w-full px-2.5 py-1 bg-[#090d14] border border-stone-800 rounded-lg text-stone-300 text-[10px]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-stone-300 mb-1 font-medium">Ad Soyad *</label>
                <input
                  type="text"
                  required
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  placeholder="Örn: Ayşe Yılmaz"
                  className="w-full px-3 py-2 bg-[#090d14] border border-stone-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-stone-300 mb-1 font-medium">Görev / Rol *</label>
                <input
                  type="text"
                  required
                  value={memberRole}
                  onChange={(e) => setMemberRole(e.target.value)}
                  placeholder="Örn: Eğitim Masası Sorumlusu / Eğitmen"
                  className="w-full px-3 py-2 bg-[#090d14] border border-stone-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-stone-300 mb-1 font-medium">Ne Masası? (Masa Adı / Birim) *</label>
                <input
                  type="text"
                  required
                  value={memberDesk}
                  onChange={(e) => setMemberDesk(e.target.value)}
                  placeholder="Örn: Eğitim & SRT Masası, Malzeme Masası, Bilim Masası, Basın Masası..."
                  className="w-full px-3 py-2 bg-[#090d14] border border-stone-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-stone-300 mb-1 font-medium">İletişim / Not (İsteğe Bağlı)</label>
                <input
                  type="text"
                  value={memberContact}
                  onChange={(e) => setMemberContact(e.target.value)}
                  placeholder="Örn: iletisim@sdumak.org veya dahili tel"
                  className="w-full px-3 py-2 bg-[#090d14] border border-stone-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setBoardModalOpen(false)}
                  className="px-3 py-1.5 text-stone-400 hover:text-white"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-xl shadow-md shadow-amber-500/20"
                >
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FAQ Add/Edit Modal */}
      {faqModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#121622] border border-blue-500/30 rounded-2xl w-full max-w-md shadow-2xl p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-stone-800 pb-2">
              <h3 className="text-sm font-bold text-blue-400 flex items-center gap-1.5 font-heading">
                <HelpCircle className="w-4 h-4" />
                {editingFaq ? 'Soruyu Düzenle' : 'Yeni Soru & Cevap Ekle'}
              </h3>
              <button onClick={() => setFaqModalOpen(false)} className="text-stone-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveFaq} className="space-y-3">
              <div>
                <label className="block text-stone-300 mb-1 font-medium">Kategori</label>
                <input
                  type="text"
                  value={faqCategory}
                  onChange={(e) => setFaqCategory(e.target.value)}
                  placeholder="Eğitim, Ekipman, Kamplar, Genel..."
                  className="w-full px-3 py-2 bg-[#090d14] border border-stone-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-stone-300 mb-1 font-medium">Soru *</label>
                <input
                  type="text"
                  required
                  value={faqQuestion}
                  onChange={(e) => setFaqQuestion(e.target.value)}
                  placeholder="Soru başlığı..."
                  className="w-full px-3 py-2 bg-[#090d14] border border-stone-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-stone-300 mb-1 font-medium">Cevap *</label>
                <textarea
                  required
                  rows={4}
                  value={faqAnswer}
                  onChange={(e) => setFaqAnswer(e.target.value)}
                  placeholder="Detaylı yanıt..."
                  className="w-full px-3 py-2 bg-[#090d14] border border-stone-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setFaqModalOpen(false)}
                  className="px-3 py-1.5 text-stone-400 hover:text-white"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl shadow-md shadow-blue-500/20"
                >
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}