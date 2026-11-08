'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  MapPin,
  Compass,
  FileText,
  Search,
  ChevronDown,
  ChevronUp,
  Lock,
  ArrowLeft,
  Shield,
  Plus,
  Edit3,
  Trash2,
  X,
  Image as ImageIcon,
  CheckCircle2,
} from 'lucide-react';
import { Cave } from '@/types';

export default function CaveAtlasPage() {
  const { caves, isAdmin, canViewPrivateSections, addCave, updateCave, deleteCave } = useApp();
  const [search, setSearch] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [expandedCaveId, setExpandedCaveId] = useState<string | null>('cave-1');

  // Modal State for Add & Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCaveId, setEditingCaveId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [district, setDistrict] = useState('');
  const [depth, setDepth] = useState<number>(0);
  const [length, setLength] = useState<number>(0);
  const [difficulty, setDifficulty] = useState<Cave['difficulty']>('Orta');
  const [waterStatus, setWaterStatus] = useState<Cave['waterStatus']>('Kuru');
  const [verticalDrops, setVerticalDrops] = useState('');
  const [lat, setLat] = useState<number>(37.7);
  const [lng, setLng] = useState<number>(30.5);
  const [description, setDescription] = useState('');
  const [surveyImageUrl, setSurveyImageUrl] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  // Permission check: Only Admin, Yönetim, or Eğitmen can view Cave Atlas
  if (!canViewPrivateSections) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
          <Lock className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold text-white">Özel Alan (Gizli Veritabanı)</h1>
        <p className="text-xs text-stone-400 max-w-md mx-auto leading-relaxed">
          Isparta ve Akdeniz Mağara Atlası (GPS koordinatları, harita krokileri ve teknik derinlik hatları) 
          can güvenliği ve koruma protokolü gereği yalnızca <strong>SDÜMAK Yönetim Kurulu, Eğitmenleri ve Yöneticilerine</strong> açıktır.
        </p>
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-800 text-stone-200 text-xs font-semibold hover:bg-stone-700 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    );
  }

  const filteredCaves = caves.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.district.toLowerCase().includes(search.toLowerCase());
    const matchDiff = selectedDifficulty === 'all' || c.difficulty === selectedDifficulty;
    return matchSearch && matchDiff;
  });

  const handleOpenAddModal = () => {
    setEditingCaveId(null);
    setName('');
    setDistrict('');
    setDepth(0);
    setLength(0);
    setDifficulty('Orta');
    setWaterStatus('Kuru');
    setVerticalDrops('');
    setLat(37.76);
    setLng(30.55);
    setDescription('');
    setSurveyImageUrl('');
    setCoverImageUrl('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cave: Cave) => {
    setEditingCaveId(cave.id);
    setName(cave.name);
    setDistrict(cave.district);
    setDepth(cave.depth);
    setLength(cave.length);
    setDifficulty(cave.difficulty);
    setWaterStatus(cave.waterStatus);
    setVerticalDrops(cave.verticalDrops || '');
    setLat(cave.coordinates.lat || 37.76);
    setLng(cave.coordinates.lng || 30.55);
    setDescription(cave.description);
    setSurveyImageUrl(cave.surveyImageUrl || '');
    setCoverImageUrl(cave.images?.[0] || '');
    setIsModalOpen(true);
  };

  const handleDeleteCave = (cave: Cave) => {
    if (!isAdmin) return;
    if (confirm(`"${cave.name}" mağarasını atlastan tamamen silmek istediğinize emin misiniz?`)) {
      deleteCave(cave.id);
      setActionSuccess(`"${cave.name}" atlastan silindi.`);
      setTimeout(() => setActionSuccess(''), 3000);
    }
  };

  const handleSaveCave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !district.trim()) return;

    const caveData = {
      name: name.trim(),
      district: district.trim(),
      depth: Number(depth),
      length: Number(length),
      difficulty,
      waterStatus,
      verticalDrops: verticalDrops.trim() || 'Dikey iniş bilgisi girilmedi',
      coordinates: {
        lat: Number(lat),
        lng: Number(lng),
      },
      surveyAvailable: !!surveyImageUrl.trim(),
      surveyImageUrl: surveyImageUrl.trim() || undefined,
      description: description.trim(),
      images: coverImageUrl.trim() ? [coverImageUrl.trim()] : [
        'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80'
      ],
    };

    if (editingCaveId) {
      updateCave(editingCaveId, caveData);
      setActionSuccess(`"${caveData.name}" bilgileri başarıyla güncellendi.`);
    } else {
      addCave(caveData);
      setActionSuccess(`"${caveData.name}" mağara atlasına başarıyla eklendi.`);
    }

    setIsModalOpen(false);
    setTimeout(() => setActionSuccess(''), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800/80 pb-6">
        <div>
          <div className="text-xs font-mono text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" /> Speleoloji Arşivi • Yetkili Erişimi
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Isparta Mağara Atlası</h1>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            Isparta ve Toroslar&apos;daki mağaraların derinlik, uzunluk, hidroloji ve dikey iniş krokileri.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-md shadow-amber-500/20 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" /> Yeni Mağara Ekle
          </button>
        )}
      </div>

      {actionSuccess && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          {actionSuccess}
        </div>
      )}

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Mağara adı veya bölge ara..."
            className="w-full pl-10 pr-4 py-2 bg-[#13161c] border border-stone-800 rounded-xl text-xs sm:text-sm text-white placeholder-stone-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto text-xs w-full sm:w-auto pb-1 scrollbar-none">
          <span className="text-stone-500 font-medium mr-1">Zorluk:</span>
          {['all', 'Kolay', 'Orta', 'Dikey/Zor', 'Ekstrem'].map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDifficulty(d)}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                selectedDifficulty === d
                  ? 'bg-amber-500 text-stone-950 font-bold'
                  : 'bg-[#13161c] border border-stone-800 text-stone-400 hover:text-white'
              }`}
            >
              {d === 'all' ? 'Tümü' : d}
            </button>
          ))}
        </div>
      </div>

      {/* Cave List */}
      <div className="space-y-3">
        {filteredCaves.map((cave) => {
          const isExpanded = expandedCaveId === cave.id;

          return (
            <div
              key={cave.id}
              className="rounded-2xl bg-[#13161c] border border-stone-800/80 overflow-hidden transition"
            >
              <div
                onClick={() => setExpandedCaveId(isExpanded ? null : cave.id)}
                className="p-5 cursor-pointer hover:bg-[#181c24] transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center space-x-3.5">
                  <span className="text-2xl">🏔️</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white">{cave.name}</h3>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-stone-800 text-amber-300 font-mono">
                        {cave.difficulty}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-stone-400 mt-0.5">
                      <MapPin className="w-3 h-3 text-stone-500" />
                      <span>{cave.district}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4 sm:space-x-6 text-xs text-stone-400">
                  <div>
                    <span className="text-[10px] text-stone-500 block uppercase">Derinlik</span>
                    <strong className="text-amber-400">-{cave.depth}m</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 block uppercase">Uzunluk</span>
                    <strong className="text-emerald-400">{cave.length}m</strong>
                  </div>

                  {/* Admin Edit & Delete buttons */}
                  {isAdmin && (
                    <div
                      className="flex items-center gap-1.5 pl-2 border-l border-stone-800"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => handleOpenEditModal(cave)}
                        title="Mağara Bilgilerini Düzenle"
                        className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteCave(cave)}
                        title="Mağarayı Sil"
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <div className="p-1 text-stone-500">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="p-5 border-t border-stone-800/80 bg-[#0f1116] space-y-4 text-xs">
                  <p className="text-stone-300 leading-relaxed sm:text-sm">
                    {cave.description}
                  </p>

                  <div className="p-3.5 rounded-xl bg-[#14171e] border border-stone-800/80 text-stone-300">
                    <span className="font-semibold text-rose-400 block mb-1">Dikey İniş Hatları:</span>
                    <span>{cave.verticalDrops}</span>
                  </div>

                  {cave.surveyImageUrl && (
                    <div className="p-3.5 rounded-xl bg-[#14171e] border border-stone-800/80 space-y-2">
                      <span className="font-semibold text-amber-400 block">Mağara Krokisi / Haritası:</span>
                      <img
                        src={cave.surveyImageUrl}
                        alt={`${cave.name} Krokisi`}
                        className="rounded-lg max-h-60 w-auto object-cover border border-stone-800"
                      />
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-2 text-stone-400 pt-2 border-t border-stone-800/80">
                    <span>Su Durumu: <strong className="text-stone-200">{cave.waterStatus}</strong></span>
                    <span>GPS Koordinatı: <strong className="text-stone-200 font-mono">{cave.coordinates.lat}° K, {cave.coordinates.lng}° D</strong></span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ADD / EDIT CAVE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-[#12151c] border border-stone-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden text-xs max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-stone-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-xl">🏔️</span>
                <h3 className="text-sm font-bold text-white">
                  {editingCaveId ? 'Mağara Bilgilerini Düzenle' : 'Atlasa Yeni Mağara Ekle'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCave} className="p-5 overflow-y-auto space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 mb-1 font-medium">Mağara Adı *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Örn: Kuz Mağarası"
                    className="w-full px-3 py-2 bg-[#0d0f12] border border-stone-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 mb-1 font-medium">İlçe / Bölge *</label>
                  <input
                    type="text"
                    required
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="Örn: Sütçüler / Isparta"
                    className="w-full px-3 py-2 bg-[#0d0f12] border border-stone-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-stone-300 mb-1 font-medium">Derinlik (-m)</label>
                  <input
                    type="number"
                    value={depth}
                    onChange={(e) => setDepth(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#0d0f12] border border-stone-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 mb-1 font-medium">Uzunluk (m)</label>
                  <input
                    type="number"
                    value={length}
                    onChange={(e) => setLength(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#0d0f12] border border-stone-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 mb-1 font-medium">Zorluk</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[#0d0f12] border border-stone-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Kolay">Kolay</option>
                    <option value="Orta">Orta</option>
                    <option value="Dikey/Zor">Dikey/Zor</option>
                    <option value="Ekstrem">Ekstrem</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-300 mb-1 font-medium">Su Durumu</label>
                  <select
                    value={waterStatus}
                    onChange={(e) => setWaterStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[#0d0f12] border border-stone-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Kuru">Kuru</option>
                    <option value="Mevsimsel Sulu">Mevsimsel Sulu</option>
                    <option value="Aktif Yeraltı Nehri">Aktif Yeraltı Nehri</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-stone-300 mb-1 font-medium">Dikey İniş Hatları / Bacalar</label>
                <input
                  type="text"
                  value={verticalDrops}
                  onChange={(e) => setVerticalDrops(e.target.value)}
                  placeholder="Örn: P15, P22 dikey iniş bacaları"
                  className="w-full px-3 py-2 bg-[#0d0f12] border border-stone-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 mb-1 font-medium">Enlem (Latitude)</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={lat}
                    onChange={(e) => setLat(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#0d0f12] border border-stone-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 mb-1 font-medium">Boylam (Longitude)</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={lng}
                    onChange={(e) => setLng(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#0d0f12] border border-stone-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-300 mb-1 font-medium">Açıklama & Jeolojik Yapı</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Mağaranın özellikleri, travertenleri, yarasa kolonileri..."
                  className="w-full px-3 py-2 bg-[#0d0f12] border border-stone-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 mb-1 font-medium">Harita / Kroki Görsel Linki (Opsiyonel)</label>
                  <input
                    type="url"
                    value={surveyImageUrl}
                    onChange={(e) => setSurveyImageUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 bg-[#0d0f12] border border-stone-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 mb-1 font-medium">Fotoğraf Görsel Linki (Opsiyonel)</label>
                  <input
                    type="url"
                    value={coverImageUrl}
                    onChange={(e) => setCoverImageUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 bg-[#0d0f12] border border-stone-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-stone-400 hover:text-white"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-xl transition shadow-md shadow-amber-500/20"
                >
                  {editingCaveId ? 'Değişiklikleri Kaydet' : 'Mağarayı Ekle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
