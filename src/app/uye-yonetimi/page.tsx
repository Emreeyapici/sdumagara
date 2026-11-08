'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  ShieldCheck,
  Trash2,
  Users,
  Search,
  ArrowLeft,
  Lock,
  Award,
  Plus,
  X,
  Edit3,
  Droplet,
  Phone,
  Sparkles,
} from 'lucide-react';
import { UserRole, User } from '@/types';

const PRESET_BADGES = [
  'SRT-1 Temel Dikey İp',
  'SRT-2 Orta Dikey İp',
  'SRT-3 İleri Dikey İp',
  'Haritacı & Ölçümcü',
  'İlk Yardım & Kurtarma',
  'Yarasa Koruyucusu',
  'Kulüp Lideri',
  'Mağara Fotoğrafçısı',
  'Teknik Malzeme Sorumlusu',
  'Jeoloji Araştırmacısı',
  'Kamp Sorumlusu',
  'Güz Kampı Başarı Ödülü',
];

export default function MemberManagementPage() {
  const {
    currentUser,
    isAdmin,
    users,
    changeUserRole,
    deleteUser,
    addUserBadge,
    removeUserBadge,
    updateUserByAdmin,
    isSupabaseActive,
  } = useApp();

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [successMsg, setSuccessMsg] = useState('');

  // Badge Modal State
  const [selectedUserForBadge, setSelectedUserForBadge] = useState<User | null>(null);
  const [customBadgeName, setCustomBadgeName] = useState('');
  const [presetBadge, setPresetBadge] = useState(PRESET_BADGES[0]);

  // Edit User Modal State
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editName, setEditName] = useState('');
  const [editStudentNo, setEditStudentNo] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editBloodType, setEditBloodType] = useState<any>('A+');
  const [editBio, setEditBio] = useState('');

  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
          <Lock className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold text-white">Erişim Reddedildi</h1>
        <p className="text-xs text-stone-400 max-w-md mx-auto leading-relaxed">
          Bu sayfaya yalnızca SDÜMAK Yönetici (Admin) yetkisine sahip hesaplar erişebilir. 
          Lütfen yönetici hesabınızla giriş yapınız.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-800 text-stone-200 text-xs font-semibold hover:bg-stone-700 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Ana Sayfaya Dön
        </Link>
      </div>
    );
  }

  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.studentNo && u.studentNo.includes(search));
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const handleRoleChange = (userId: string, newRole: UserRole, userName: string) => {
    const ok = changeUserRole(userId, newRole);
    if (ok) {
      setSuccessMsg(`"${userName}" adlı üyenin yetki rolü "${newRole.toUpperCase()}" olarak güncellendi.`);
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  const handleDelete = (userId: string, userName: string) => {
    if (confirm(`"${userName}" adlı üyeyi silmek istediğinize emin misiniz?`)) {
      const ok = deleteUser(userId);
      if (!ok) {
        alert('Ana yönetici hesabı silinemez!');
      } else {
        setSuccessMsg(`"${userName}" başarıyla silindi.`);
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    }
  };

  // Badge Management Handlers
  const handleOpenBadgeModal = (user: User) => {
    setSelectedUserForBadge(user);
    setCustomBadgeName('');
  };

  const handleAddPresetBadge = () => {
    if (!selectedUserForBadge || !presetBadge) return;
    addUserBadge(selectedUserForBadge.id, presetBadge);
    // Refresh modal user
    const updated = users.find((u) => u.id === selectedUserForBadge.id);
    if (updated) setSelectedUserForBadge({ ...updated, badges: [...(updated.badges || []), presetBadge] });
    setSuccessMsg(`Rozet verildi: ${presetBadge}`);
    setTimeout(() => setSuccessMsg(''), 2500);
  };

  const handleAddCustomBadge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserForBadge || !customBadgeName.trim()) return;
    addUserBadge(selectedUserForBadge.id, customBadgeName.trim());
    const updated = users.find((u) => u.id === selectedUserForBadge.id);
    if (updated) setSelectedUserForBadge({ ...updated, badges: [...(updated.badges || []), customBadgeName.trim()] });
    setCustomBadgeName('');
    setSuccessMsg(`Özel rozet oluşturuldu ve verildi!`);
    setTimeout(() => setSuccessMsg(''), 2500);
  };

  const handleRemoveBadge = (badgeName: string) => {
    if (!selectedUserForBadge) return;
    removeUserBadge(selectedUserForBadge.id, badgeName);
    setSelectedUserForBadge((prev) =>
      prev ? { ...prev, badges: (prev.badges || []).filter((b) => b !== badgeName) } : null
    );
  };

  // User Edit Handlers
  const handleStartEdit = (user: User) => {
    setEditingUser(user);
    setEditName(user.name);
    setEditStudentNo(user.studentNo || '');
    setEditPhone(user.phone || '');
    setEditBloodType(user.bloodType || 'A+');
    setEditBio(user.bio || '');
  };

  const handleSaveUserEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    updateUserByAdmin(editingUser.id, {
      name: editName.trim(),
      studentNo: editStudentNo.trim(),
      phone: editPhone.trim(),
      bloodType: editBloodType,
      bio: editBio.trim(),
    });
    setEditingUser(null);
    setSuccessMsg(`Üye bilgileri güncellendi.`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  // Get active badges for current selected user in modal from latest `users`
  const currentModalUserBadges = selectedUserForBadge
    ? users.find((u) => u.id === selectedUserForBadge.id)?.badges || selectedUserForBadge.badges || []
    : [];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 w-full space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1e2533] pb-6">
        <div>
          <div className="text-xs font-mono text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" /> SDÜMAK Yönetim Masası
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Üye & Rozet Yönetimi</h1>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            Kayıt olan üyelerin yetkilerini belirleyin, kişiye özel eğitim rozetleri verin ve bilgileri düzenleyin.
          </p>
        </div>

        <Link
          href="/profil"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#14171d] hover:bg-[#1c212b] border border-stone-800 text-stone-300 text-xs font-medium transition self-start sm:self-auto"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Profile Dön
        </Link>
      </div>

      {successMsg && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          {successMsg}
        </div>
      )}

      {/* Database Connection Status Banner */}
      {isSupabaseActive ? (
        <div className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#142319] border border-[#23422e] text-xs">
          <div className="flex items-center gap-2 text-[#9fc4aa]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#48bb78] animate-pulse shrink-0" />
            <span>
              <strong>Supabase Bulut Veritabanı Aktif:</strong> Tüm veriler (üyeler, haberler, etkinlikler, ekipman) merkezi bulutta saklanır ve herkese gerçek zamanlı senkronize olur.
            </span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-[#1a3323] text-[#b4dfc0] border border-[#2d573b] font-mono shrink-0">
            Canlı & Ortak
          </span>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#241a14] border border-[#483324] text-xs">
          <div className="flex items-center gap-2 text-[#dba076]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#dba076] shrink-0" />
            <span>
              <strong>Supabase Bağlantısı Hazır:</strong> .env.local dosyanıza Supabase URL ve Anon Key bilgilerinizi ekleyerek canlı merkezi veritabanını aktif edebilirsiniz.
            </span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-[#17120e] text-[#a88267] border border-[#3d2719] font-mono shrink-0">
            Yerel Hafıza
          </span>
        </div>
      )}

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-4 rounded-2xl cave-panel">
          <span className="text-stone-500 block text-[10px] uppercase font-bold">Toplam Kayıtlı</span>
          <span className="text-xl font-black text-white">{users.length} Üye</span>
        </div>
        <div className="p-4 rounded-2xl cave-panel">
          <span className="text-stone-500 block text-[10px] uppercase font-bold">Yöneticiler</span>
          <span className="text-xl font-black text-amber-400">
            {users.filter((u) => u.role === 'admin' || u.role === 'yonetim').length}
          </span>
        </div>
        <div className="p-4 rounded-2xl cave-panel">
          <span className="text-stone-500 block text-[10px] uppercase font-bold">Eğitmenler</span>
          <span className="text-xl font-black text-emerald-400">
            {users.filter((u) => u.role === 'egitmen').length}
          </span>
        </div>
        <div className="p-4 rounded-2xl cave-panel">
          <span className="text-stone-500 block text-[10px] uppercase font-bold">Çaylak & Üye</span>
          <span className="text-xl font-black text-blue-400">
            {users.filter((u) => u.role === 'uye' || u.role === 'caylak').length}
          </span>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="İsim, e-posta veya öğrenci no ara..."
            className="w-full pl-10 pr-4 py-2 bg-[#10131b] border border-stone-800 rounded-xl text-xs sm:text-sm text-white placeholder-stone-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto text-xs w-full sm:w-auto pb-1 scrollbar-none">
          <span className="text-stone-500 font-medium mr-1">Filtre:</span>
          {['all', 'admin', 'yonetim', 'egitmen', 'uye', 'caylak'].map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                roleFilter === r
                  ? 'bg-amber-500 text-stone-950 font-bold'
                  : 'cave-panel text-stone-400 hover:text-white'
              }`}
            >
              {r === 'all' ? 'Tümü' : r.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Members List Table / Cards */}
      <div className="space-y-3">
        {filteredUsers.map((user) => {
          const isMainAdmin = user.email.toLowerCase() === 'emre4821@outlook.com';

          return (
            <div
              key={user.id}
              className="p-4 sm:p-5 rounded-2xl cave-panel hover:border-amber-500/30 transition flex flex-col gap-3"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-3.5 min-w-0">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-11 h-11 rounded-xl object-cover bg-stone-800 shrink-0"
                  />
                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white truncate">{user.name}</h3>
                      {isMainAdmin && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                          Kurucu Admin
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-stone-400">
                      <span>{user.email}</span>
                      <span>•</span>
                      <span>Öğr: <strong className="text-stone-300">{user.studentNo || '—'}</strong></span>
                      <span>•</span>
                      <span className="text-rose-400 font-semibold">{user.bloodType}</span>
                      {user.phone && (
                        <>
                          <span>•</span>
                          <span>{user.phone}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions: Edit info, Badges, Role selector & Delete */}
                <div className="flex flex-wrap items-center gap-2 self-end sm:self-center shrink-0">
                  {/* Edit User Info Button */}
                  <button
                    onClick={() => handleStartEdit(user)}
                    title="Üye Bilgilerini Düzenle"
                    className="px-2.5 py-1.5 rounded-xl bg-stone-800/80 hover:bg-stone-700 text-stone-300 text-xs font-medium transition flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-stone-400" />
                    <span>Düzenle</span>
                  </button>

                  {/* Rozet Yönetimi Butonu */}
                  <button
                    onClick={() => handleOpenBadgeModal(user)}
                    title="Eğitim Rozeti Ata / Kaldır"
                    className="px-2.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-medium transition flex items-center gap-1"
                  >
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    <span>Rozetler ({user.badges?.length || 0})</span>
                  </button>

                  {/* Role Selector */}
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[11px] text-stone-500 font-medium">Yetki:</span>
                    <select
                      disabled={isMainAdmin}
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole, user.name)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border focus:outline-none transition ${
                        user.role === 'admin'
                          ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                          : user.role === 'yonetim' || user.role === 'egitmen'
                          ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                          : 'bg-[#0d0f12] border-stone-800 text-stone-300'
                      }`}
                    >
                      <option value="admin">Admin (Yönetici)</option>
                      <option value="yonetim">Yönetim Kurulu</option>
                      <option value="egitmen">Eğitmen / SRT</option>
                      <option value="uye">Aktif Üye</option>
                      <option value="caylak">Çaylak 2026</option>
                    </select>
                  </div>

                  {!isMainAdmin && (
                    <button
                      onClick={() => handleDelete(user.id, user.name)}
                      title="Üyeyi Sil"
                      className="p-2 text-stone-600 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Badges preview row */}
              {user.badges && user.badges.length > 0 && (
                <div className="pt-2 border-t border-stone-800/60 flex flex-wrap gap-1.5 items-center">
                  <span className="text-[10px] text-stone-500 font-medium uppercase tracking-wider flex items-center gap-1">
                    <Award className="w-3 h-3 text-amber-400" /> Rozetler:
                  </span>
                  {user.badges.map((b, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] px-2 py-0.5 rounded-md bg-[#0d0f12] border border-stone-800 text-amber-300 font-medium flex items-center gap-1"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* BADGE MANAGEMENT MODAL */}
      {selectedUserForBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-[#12151c] border border-stone-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden text-xs space-y-4 p-6">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Rozet Yönetimi: {selectedUserForBadge.name}
                  </h3>
                  <p className="text-[11px] text-stone-400">
                    Üyenin hak kazandığı eğitimleri onaylayın veya özel rozet tanımlayın.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedUserForBadge(null)}
                className="text-stone-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Current Badges List */}
            <div className="space-y-2">
              <label className="block text-stone-300 font-semibold">
                Mevcut Rozetler ({currentModalUserBadges.length})
              </label>
              {currentModalUserBadges.length === 0 ? (
                <div className="p-3 bg-[#0d0f12] border border-stone-800 rounded-xl text-stone-500 text-center">
                  Bu üyenin henüz bir rozeti bulunmuyor.
                </div>
              ) : (
                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 bg-[#0d0f12] border border-stone-800 rounded-xl">
                  {currentModalUserBadges.map((badge, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-1.5"
                    >
                      <Award className="w-3 h-3 text-amber-400" />
                      <span>{badge}</span>
                      <button
                        onClick={() => handleRemoveBadge(badge)}
                        title="Rozeti Kaldır"
                        className="text-stone-400 hover:text-rose-400 ml-1 transition"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Add Preset Badge */}
            <div className="p-3.5 rounded-xl bg-[#14171d] border border-stone-800 space-y-2">
              <label className="block text-stone-300 font-semibold">
                1. Hazır Mağaracılık Rozeti Ata
              </label>
              <div className="flex gap-2">
                <select
                  value={presetBadge}
                  onChange={(e) => setPresetBadge(e.target.value)}
                  className="flex-1 px-3 py-2 bg-[#0d0f12] border border-stone-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                >
                  {PRESET_BADGES.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleAddPresetBadge}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-xl transition flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Ata
                </button>
              </div>
            </div>

            {/* Create Custom Badge */}
            <form onSubmit={handleAddCustomBadge} className="p-3.5 rounded-xl bg-[#14171d] border border-stone-800 space-y-2">
              <label className="block text-stone-300 font-semibold">
                2. Kişiye Özel Rozet Oluştur & Ata
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customBadgeName}
                  onChange={(e) => setCustomBadgeName(e.target.value)}
                  placeholder="Örn: 2026 İncesu Keşif Lideri, Yılın Mağaracısı..."
                  className="flex-1 px-3 py-2 bg-[#0d0f12] border border-stone-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  disabled={!customBadgeName.trim()}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-stone-950 font-bold rounded-xl transition flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Rozet Ver
                </button>
              </div>
            </form>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedUserForBadge(null)}
                className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-white rounded-xl font-medium transition"
              >
                Tamamla & Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT USER INFO MODAL */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-[#12151c] border border-stone-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden text-xs p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Üye Bilgilerini Düzenle: {editingUser.name}
                  </h3>
                  <p className="text-[11px] text-stone-400">{editingUser.email}</p>
                </div>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                className="text-stone-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveUserEdit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-400 mb-1 font-medium">Ad Soyad</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0d0f12] border border-stone-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 mb-1 font-medium">Öğrenci Numarası</label>
                  <input
                    type="text"
                    value={editStudentNo}
                    onChange={(e) => setEditStudentNo(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0d0f12] border border-stone-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-400 mb-1 font-medium flex items-center gap-1 text-rose-400">
                    <Droplet className="w-3 h-3" /> Kan Grubu
                  </label>
                  <select
                    value={editBloodType}
                    onChange={(e) => setEditBloodType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[#0d0f12] border border-stone-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="A+">A Rh(+)</option>
                    <option value="A-">A Rh(-)</option>
                    <option value="B+">B Rh(+)</option>
                    <option value="B-">B Rh(-)</option>
                    <option value="AB+">AB Rh(+)</option>
                    <option value="AB-">AB Rh(-)</option>
                    <option value="0+">0 Rh(+)</option>
                    <option value="0-">0 Rh(-)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-400 mb-1 font-medium">Telefon Numarası</label>
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="05xx xxx xx xx"
                    className="w-full px-3 py-2 bg-[#0d0f12] border border-stone-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-400 mb-1 font-medium">Biyografi / Kulüp Notu</label>
                <input
                  type="text"
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0d0f12] border border-stone-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-3.5 py-2 text-stone-400 hover:text-white transition"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-xl transition shadow-md shadow-amber-500/20"
                >
                  Değişiklikleri Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
