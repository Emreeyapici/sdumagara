'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { GuideArticle } from '@/types';
import {
  AlertTriangle,
  ShieldCheck,
  Package,
  HeartPulse,
  Compass,
  Flame,
  Radio,
  Droplets,
  Plus,
  Edit3,
  Trash2,
  X,
  Search,
  CheckCircle,
  BookOpen,
  Info,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
  AlertTriangle,
  ShieldCheck,
  Package,
  HeartPulse,
  Compass,
  Flame,
  Radio,
  Droplets,
};

export default function ImportantInfoPage() {
  const { isAdmin, guides, addGuide, updateGuide, deleteGuide } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const [expandedGuideIds, setExpandedGuideIds] = useState<Record<string, boolean>>({});

  // Modal State for Admin CRUD
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGuide, setEditingGuide] = useState<GuideArticle | null>(null);
  const [guideTitle, setGuideTitle] = useState('');
  const [guideCategory, setGuideCategory] = useState('Etkinlik Kuralları');
  const [guideSummary, setGuideSummary] = useState('');
  const [guideContent, setGuideContent] = useState('');
  const [guideIcon, setGuideIcon] = useState('AlertTriangle');
  const [guideIsImportant, setGuideIsImportant] = useState(false);

  // Categories
  const categories = ['Tümü', ...Array.from(new Set(guides.map((g) => g.category)))];

  // Filter guides
  const filteredGuides = guides.filter((g) => {
    const matchesCat = selectedCategory === 'Tümü' || g.category === selectedCategory;
    const matchesSearch =
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const toggleExpand = (id: string) => {
    setExpandedGuideIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleOpenAdd = () => {
    setEditingGuide(null);
    setGuideTitle('');
    setGuideCategory('Etkinlik Kuralları');
    setGuideSummary('');
    setGuideContent('');
    setGuideIcon('AlertTriangle');
    setGuideIsImportant(false);
    setModalOpen(true);
  };

  const handleOpenEdit = (guide: GuideArticle) => {
    setEditingGuide(guide);
    setGuideTitle(guide.title);
    setGuideCategory(guide.category);
    setGuideSummary(guide.summary);
    setGuideContent(guide.content);
    setGuideIcon(guide.icon || 'AlertTriangle');
    setGuideIsImportant(guide.isImportant || false);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guideTitle.trim() || !guideContent.trim()) return;

    if (editingGuide) {
      updateGuide(editingGuide.id, {
        title: guideTitle.trim(),
        category: guideCategory.trim(),
        summary: guideSummary.trim(),
        content: guideContent.trim(),
        icon: guideIcon,
        isImportant: guideIsImportant,
      });
    } else {
      addGuide({
        title: guideTitle.trim(),
        category: guideCategory.trim(),
        summary: guideSummary.trim(),
        content: guideContent.trim(),
        icon: guideIcon,
        isImportant: guideIsImportant,
      });
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`"${title}" başlıklı rehber konusunu silmek istediğinizden emin misiniz?`)) {
      deleteGuide(id);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 w-full space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1c2436] pb-6">
        <div>
          <div className="text-xs font-mono text-amber-400 uppercase tracking-widest font-bold flex items-center gap-2 mb-1">
            <BookOpen className="w-3.5 h-3.5" /> [ SDÜMAK REHBERİ & BİLGİ BANKASI ]
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-heading">
            Rehber & Temel Bilgiler
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 mt-1 max-w-2xl leading-relaxed">
            Faaliyetlerde can güvenliği, kişisel mağara çantası hazırlığı, kamp disiplini ve dikey ip tekniklerine dair temel esaslar.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-xl bg-[#c87d4a] hover:bg-[#b86d3b] text-white font-semibold text-xs transition flex items-center gap-1.5 shrink-0 shadow-sm"
          >
            <Plus className="w-4 h-4" /> Yeni Bilgi / Rehber Konusu Ekle
          </button>
        )}
      </div>

      {/* Search & Category Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Categories */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-medium">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl transition ${
                selectedCategory === cat
                  ? 'bg-[#c87d4a] text-white font-semibold shadow-sm'
                  : 'bg-[#12151e] border border-[#202534] text-[#a0a5b4] hover:text-white hover:border-[#2e374d]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Bilgi veya kural ara..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#12151e] border border-[#202534] rounded-xl text-stone-200 placeholder:text-stone-500 text-xs focus:outline-none focus:border-[#c87d4a]"
          />
        </div>
      </div>

      {/* Guides List */}
      <div className="space-y-4">
        {filteredGuides.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#12151e] border border-[#202534] text-stone-400 text-xs">
            Aradığınız kriterlere uygun bir rehber konusu bulunamadı.
          </div>
        ) : (
          filteredGuides.map((guide) => {
            const IconComponent = ICON_MAP[guide.icon || 'AlertTriangle'] || AlertTriangle;
            const isExpanded = expandedGuideIds[guide.id] ?? false;

            return (
              <div
                key={guide.id}
                className={`p-5 rounded-2xl transition border ${
                  guide.isImportant
                    ? 'bg-[#151822] border-[#4d3324] shadow-sm'
                    : 'bg-[#12151e] border-[#202534] hover:border-[#2e374d]'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start space-x-3.5">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                        guide.isImportant
                          ? 'bg-[#291e14] border-[#4a3424] text-[#dba076]'
                          : 'bg-[#181c26] border-[#252c3c] text-[#a0a5b4]'
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] px-2 py-0.5 rounded font-mono font-medium bg-[#191d28] text-[#cfcac0] border border-[#262c3d]">
                          {guide.category}
                        </span>
                        {guide.isImportant && (
                          <span className="text-[10px] px-2 py-0.5 rounded font-medium bg-[#281616] text-[#e09d9d] border border-[#4d2828] flex items-center gap-1">
                            🚨 Hayati Öncelik
                          </span>
                        )}
                        <span className="text-[10px] text-stone-500 font-mono">
                          Güncelleme: {guide.updatedAt}
                        </span>
                      </div>

                      <h2 className="text-base sm:text-lg font-bold text-[#f4f1ea] font-heading">
                        {guide.title}
                      </h2>

                      {guide.summary && (
                        <p className="text-xs text-stone-300 leading-relaxed pt-0.5">
                          {guide.summary}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-start shrink-0">
                    {/* Admin Actions */}
                    {isAdmin && (
                      <div className="flex items-center gap-1 mr-1">
                        <button
                          onClick={() => handleOpenEdit(guide)}
                          title="Konuyu Düzenle (Admin)"
                          className="p-1.5 rounded-lg bg-[#181c26] hover:bg-[#202533] text-stone-300 hover:text-[#dba076] transition"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(guide.id, guide.title)}
                          title="Konuyu Sil (Admin)"
                          className="p-1.5 rounded-lg bg-[#281616] hover:bg-[#3d1e1e] text-[#e09d9d] transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    <button
                      onClick={() => toggleExpand(guide.id)}
                      className="px-3 py-1.5 rounded-xl bg-[#161a25] hover:bg-[#1f2433] text-stone-200 text-xs font-medium flex items-center gap-1.5 transition border border-[#242b3a]"
                    >
                      {isExpanded ? (
                        <>
                          <span>Gizle</span>
                          <ChevronUp className="w-3.5 h-3.5 text-stone-400" />
                        </>
                      ) : (
                        <>
                          <span>Detayları Gör</span>
                          <ChevronDown className="w-3.5 h-3.5 text-[#dba076]" />
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Collapsible Content */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-[#1f2434] space-y-3">
                    <div className="text-xs text-[#dcd8d0] leading-relaxed font-sans whitespace-pre-line bg-[#0c0e14] p-4 rounded-xl border border-[#1f2434] space-y-2">
                      {guide.content}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Admin Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#12151e] border border-[#38435c] rounded-2xl w-full max-w-xl shadow-2xl p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-[#202534] pb-2">
              <h3 className="text-sm font-bold text-[#f4f1ea] flex items-center gap-1.5 font-heading">
                <BookOpen className="w-4 h-4 text-[#dba076]" />
                {editingGuide ? 'Rehber / Bilgi Konusunu Düzenle' : 'Yeni Bilgi / Rehber Konusu Ekle'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-stone-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 mb-1 font-medium">Başlık *</label>
                  <input
                    type="text"
                    required
                    value={guideTitle}
                    onChange={(e) => setGuideTitle(e.target.value)}
                    placeholder="Örn: Kampta İlk Gece ve Çadır Kuralları"
                    className="w-full px-3 py-2 bg-[#0c0e14] border border-[#202534] rounded-xl text-white focus:outline-none focus:border-[#c87d4a]"
                  />
                </div>

                <div>
                  <label className="block text-stone-300 mb-1 font-medium">Kategori *</label>
                  <input
                    type="text"
                    required
                    value={guideCategory}
                    onChange={(e) => setGuideCategory(e.target.value)}
                    placeholder="Etkinlik Kuralları, Güvenlik, Ekipman..."
                    className="w-full px-3 py-2 bg-[#0c0e14] border border-[#202534] rounded-xl text-white focus:outline-none focus:border-[#c87d4a]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-300 mb-1 font-medium">Kısa Özet / Giriş Notu</label>
                <input
                  type="text"
                  value={guideSummary}
                  onChange={(e) => setGuideSummary(e.target.value)}
                  placeholder="Konunun 1-2 cümlelik kısa özeti..."
                  className="w-full px-3 py-2 bg-[#0c0e14] border border-[#202534] rounded-xl text-white focus:outline-none focus:border-[#c87d4a]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 mb-1 font-medium">İkon Türü</label>
                  <select
                    value={guideIcon}
                    onChange={(e) => setGuideIcon(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0c0e14] border border-[#202534] rounded-xl text-white focus:outline-none focus:border-[#c87d4a]"
                  >
                    <option value="AlertTriangle">Uyarı & Tehlike (AlertTriangle)</option>
                    <option value="ShieldCheck">Güvenlik & Emniyet (ShieldCheck)</option>
                    <option value="Package">Ekipman & Çanta (Package)</option>
                    <option value="HeartPulse">İlk Yardım & Sağlık (HeartPulse)</option>
                    <option value="Compass">Yön & Keşif (Compass)</option>
                    <option value="Flame">Ateş & Isı (Flame)</option>
                    <option value="Radio">Telsiz & İletişim (Radio)</option>
                    <option value="Droplets">Su & Hidroloji (Droplets)</option>
                  </select>
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center space-x-2 cursor-pointer text-stone-300">
                    <input
                      type="checkbox"
                      checked={guideIsImportant}
                      onChange={(e) => setGuideIsImportant(e.target.checked)}
                      className="rounded border-[#38435c] text-[#c87d4a] focus:ring-[#c87d4a] w-4 h-4 bg-[#0c0e14]"
                    />
                    <span className="font-medium text-[#e09d9d]">Hayati / Öncelikli Bilgi Olarak Vurgula</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-stone-300 mb-1 font-medium">
                  Detaylı İçerik & Maddeler (Serbestçe açıklayabilir ve maddeleyebilirsiniz) *
                </label>
                <textarea
                  required
                  rows={8}
                  value={guideContent}
                  onChange={(e) => setGuideContent(e.target.value)}
                  placeholder={`1. Kural başlığı...\n2. İkinci madde açıklaması...\n• Zorunlu dikkat edilecekler...`}
                  className="w-full px-3 py-2 bg-[#0c0e14] border border-[#202534] rounded-xl text-white focus:outline-none focus:border-[#c87d4a] font-mono text-xs leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#202534]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3 py-1.5 text-stone-400 hover:text-white"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#c87d4a] hover:bg-[#b86d3b] text-white font-semibold rounded-xl shadow-sm"
                >
                  Bilgiyi Kaydet & Yayınla
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
