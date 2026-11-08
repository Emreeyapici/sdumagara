'use client';

import React, { useState, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import {
  User as UserIcon,
  Droplet,
  Award,
  Shield,
  Calendar,
  Package,
  Phone,
  Mail,
  Edit3,
  Compass,
  ArrowRight,
  LogOut,
  Sparkles,
  ShieldCheck,
  Lock,
  Camera,
  Upload,
  Image as ImageIcon,
  Check,
} from 'lucide-react';
import Link from 'next/link';

const AVATAR_PRESETS = [
  { id: 'sdumak', label: 'SDÜMAK Arması', url: '/images/sdumak-logo.png' },
  { id: 'sdu', label: 'SDÜ Gülü', url: '/images/sdu-logo.png' },
  { id: 'cava1', label: 'Speleolog 1', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80' },
  { id: 'cava2', label: 'Speleolog 2', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80' },
  { id: 'cava3', label: 'Kaşif 3', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80' },
  { id: 'cava4', label: 'Kaşif 4', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80' },
];

export default function ProfilePage() {
  const { currentUser, isAdmin, updateProfile, register, logout, equipment, events } = useApp();

  // Registration state for unauthenticated users
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [studentNo, setStudentNo] = useState('');
  const [phone, setPhone] = useState('');
  const [bloodType, setBloodType] = useState<any>('A+');
  const [bio, setBio] = useState('SDÜMAK Topluluğu Üyesi');
  const [regAvatar, setRegAvatar] = useState('/images/sdumak-logo.png');
  const [regError, setRegError] = useState('');

  // Edit profile state
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editStudentNo, setEditStudentNo] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editBloodType, setEditBloodType] = useState<any>('A+');
  const [editAvatar, setEditAvatar] = useState('');
  const [avatarUploadMsg, setAvatarUploadMsg] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const regFileInputRef = useRef<HTMLInputElement>(null);

  const startEdit = () => {
    if (!currentUser) return;
    setEditName(currentUser.name);
    setEditStudentNo(currentUser.studentNo || '');
    setEditBio(currentUser.bio || '');
    setEditPhone(currentUser.phone || '');
    setEditBloodType(currentUser.bloodType || 'A+');
    setEditAvatar(currentUser.avatar || '/images/sdumak-logo.png');
    setIsEditing(true);
    setSaveSuccess(false);
    setAvatarUploadMsg('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isReg: boolean = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      if (isReg) setRegError('Fotoğraf boyutu 3 MB üzerinde olamaz.');
      else setAvatarUploadMsg('Fotoğraf boyutu 3 MB üzerinde olamaz.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      if (isReg) {
        setRegAvatar(result);
      } else {
        setEditAvatar(result);
        setAvatarUploadMsg('Fotoğraf başarıyla yüklendi!');
      }
    };
    reader.readAsDataURL(file);
  };

  const saveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: editName.trim(),
      studentNo: editStudentNo.trim(),
      bio: editBio.trim(),
      phone: editPhone.trim(),
      bloodType: editBloodType,
      avatar: editAvatar || currentUser?.avatar,
    });
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 4000);
  };

  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !studentNo) {
      setRegError('Lütfen tüm zorunlu alanları doldurun.');
      return;
    }
    const res = register({
      name,
      email,
      password,
      studentNo,
      bloodType,
      phone,
      bio,
    });
    if (!res.success) {
      setRegError(res.message || 'Kayıt başarısız.');
    } else {
      if (regAvatar) {
        updateProfile({ avatar: regAvatar });
      }
      setRegError('');
    }
  };

  // If NOT logged in, present the Profile Creation / Registration Screen
  if (!currentUser) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12 w-full space-y-6">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 mx-auto rounded-full p-0.5 bg-gradient-to-br from-amber-400 to-amber-700 ring-2 ring-amber-500/40">
            <img
              src="/images/sdumak-logo.png"
              alt="SDÜMAK"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight font-heading">
            SDÜMAK Üye Profili Oluştur
          </h1>
          <p className="text-xs text-stone-400 max-w-sm mx-auto">
            Süleyman Demirel Üniversitesi Mağara Araştırma ve Koruma Topluluğu resmi üyelik başvuru ve profil masası.
          </p>
        </div>

        <div className="p-6 sm:p-8 rounded-2xl bg-[#121622] border border-stone-800 shadow-xl space-y-5 text-xs">
          {regError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {regError}
            </div>
          )}

          <form onSubmit={handleCreateProfile} className="space-y-4">
            {/* Avatar Selection for Registration */}
            <div>
              <label className="block font-medium text-stone-300 mb-2">Profil Fotoğrafı</label>
              <div className="flex items-center gap-4">
                <img
                  src={regAvatar}
                  alt="Önizleme"
                  className="w-14 h-14 rounded-full object-cover ring-2 ring-amber-500/40 bg-stone-900 shrink-0"
                />
                <div className="space-y-1">
                  <input
                    type="file"
                    ref={regFileInputRef}
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, true)}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => regFileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-white font-medium text-[11px] flex items-center gap-1.5 transition"
                  >
                    <Upload className="w-3.5 h-3.5 text-amber-400" /> Fotoğraf Yükle
                  </button>
                  <span className="text-[10px] text-stone-500 block">PNG, JPG veya WebP (Maks 3MB)</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block font-medium text-stone-300 mb-1">
                Ad Soyad *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Örn: Ayşe Yılmaz"
                className="w-full px-3 py-2 bg-[#090d14] border border-stone-800 rounded-xl text-white focus:outline-none focus:border-amber-500 transition"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-stone-300 mb-1">
                  Öğrenci Numarası *
                </label>
                <input
                  type="text"
                  required
                  value={studentNo}
                  onChange={(e) => setStudentNo(e.target.value)}
                  placeholder="241103..."
                  className="w-full px-3 py-2 bg-[#090d14] border border-stone-800 rounded-xl text-white focus:outline-none focus:border-amber-500 transition"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-300 mb-1 flex items-center gap-1.5 text-rose-400">
                  <Droplet className="w-3.5 h-3.5" /> Kan Grubu (Hayati) *
                </label>
                <select
                  value={bloodType}
                  onChange={(e) => setBloodType(e.target.value)}
                  className="w-full px-3 py-2 bg-[#090d14] border border-stone-800 rounded-xl text-white focus:outline-none focus:border-amber-500 transition"
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
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-stone-300 mb-1">
                  E-Posta Adresi *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ogrenci@ogr.sdu.edu.tr"
                  className="w-full px-3 py-2 bg-[#090d14] border border-stone-800 rounded-xl text-white focus:outline-none focus:border-amber-500 transition"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-300 mb-1">
                  Hesap Şifresi *
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 bg-[#090d14] border border-stone-800 rounded-xl text-white focus:outline-none focus:border-amber-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-stone-300 mb-1">
                Telefon Numarası
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="05xx xxx xx xx"
                className="w-full px-3 py-2 bg-[#090d14] border border-stone-800 rounded-xl text-white focus:outline-none focus:border-amber-500 transition"
              />
            </div>

            <div>
              <label className="block font-medium text-stone-300 mb-1">
                Kısa Biyografi / Kulüp Notu
              </label>
              <input
                type="text"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Örn: Jeoloji Mühendisliği 1. Sınıf"
                className="w-full px-3 py-2 bg-[#090d14] border border-stone-800 rounded-xl text-white focus:outline-none focus:border-amber-500 transition"
              />
            </div>

            <div className="p-3 rounded-xl bg-[#1d1712] border border-[#483324] text-stone-400 text-[11px] space-y-1">
              <span className="font-bold text-[#dba076] flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" /> Üyelik ve Yetki Politikası
              </span>
              <p>
                Hesabınız ilk kayıtta &quot;Çaylak&quot; statüsünde açılır. Mağara atlası ve dikey ekipman yetkileri, kulüp yöneticisi (Admin) tarafından onaylanır.
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#c87d4a] hover:bg-[#b86d3b] text-white font-semibold rounded-xl text-xs transition shadow-sm mt-2 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" /> Üye Profilimi Oluştur
            </button>
          </form>
        </div>
      </div>
    );
  }

  // User is logged in: Display their active profile dashboard
  const myEquipment = equipment.filter((eq) => eq.assignedTo === currentUser.name);
  const myEvents = events.filter((ev) => ev.registeredUserIds.includes(currentUser.id));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 w-full space-y-6">
      {/* Profile Header Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#12151e] border border-[#222838] shadow-sm relative">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-center space-x-4">
            {/* Avatar with quick edit button */}
            <div className="relative group/avatar shrink-0">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-1 ring-stone-700 bg-[#090d14]"
              />
              <button
                onClick={startEdit}
                title="Fotoğrafı Değiştir"
                className="absolute inset-0 bg-black/60 rounded-2xl opacity-0 group-hover/avatar:opacity-100 transition-opacity flex flex-col items-center justify-center text-[#dba076] gap-1 backdrop-blur-[2px]"
              >
                <Camera className="w-5 h-5" />
                <span className="text-[9px] font-bold">Değiştir</span>
              </button>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-[#f4f1ea] tracking-tight font-heading">
                  {currentUser.name}
                </h1>
                <span className="text-[11px] font-medium uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-[#1d1712] text-[#dba076] border border-[#483324]">
                  {currentUser.role === 'admin'
                    ? 'Yönetici'
                    : currentUser.role === 'yonetim'
                    ? 'Yönetim Kurulu'
                    : currentUser.role === 'egitmen'
                    ? 'Eğitmen / SRT'
                    : currentUser.role === 'uye'
                    ? 'Aktif Üye'
                    : 'Çaylak'}
                </span>
                {isAdmin && (
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[#281616] text-[#e09d9d] border border-[#4d2828] flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-[#e09d9d]" /> Kurucu Admin
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-stone-300">
                {currentUser.bio || 'SDÜMAK Kulüp Üyesi'}
              </p>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-stone-400 pt-0.5">
                <span>Öğrenci No: <strong className="text-stone-200">{currentUser.studentNo || '—'}</strong></span>
                <span>•</span>
                <span className="text-[#e09d9d] font-semibold flex items-center gap-1">
                  <Droplet className="w-3 h-3" /> {currentUser.bloodType}
                </span>
                <span>•</span>
                <span className="text-stone-300 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-stone-400" /> {currentUser.phone || 'Telefon eklenmedi'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={startEdit}
              className="px-3.5 py-2 rounded-xl bg-[#181c26] hover:bg-[#222736] text-stone-200 text-xs font-medium transition flex items-center gap-1.5 border border-[#252c3c]"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#dba076]" /> Bilgileri Güncelle
            </button>
            <button
              onClick={logout}
              className="px-3.5 py-2 rounded-xl bg-[#281616] hover:bg-[#3d1e1e] text-[#e09d9d] text-xs font-medium transition flex items-center gap-1.5 border border-[#4d2828]"
            >
              <LogOut className="w-3.5 h-3.5" /> Çıkış
            </button>
          </div>
        </div>

        {saveSuccess && (
          <div className="mt-4 p-3 rounded-xl bg-[#17221b] border border-[#2a3d31] text-[#9fc4aa] text-xs flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#9fc4aa]" />
            Profil bilgileriniz ve fotoğrafınız başarıyla güncellendi.
          </div>
        )}

        {/* Admin Navigation Box if Admin */}
        {isAdmin && (
          <div className="mt-5 pt-4 border-t border-[#202534] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#161310] p-4 rounded-xl border border-[#483324]">
            <div>
              <span className="text-xs font-bold text-[#dba076] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> Admin Yetki Masası
              </span>
              <p className="text-[11px] text-stone-400 mt-0.5">
                Tüm kayıtlı üyeleri görüntüleyebilir, rolleri (Yönetim, Eğitmen, Üye) atayabilir, rozet ekleyip silebilirsiniz.
              </p>
            </div>
            <Link
              href="/uye-yonetimi"
              className="px-4 py-2 rounded-xl bg-[#c87d4a] hover:bg-[#b86d3b] text-white text-xs font-semibold transition shrink-0 flex items-center gap-1.5 shadow-sm"
            >
              Üyeleri & Yetkileri Yönet →
            </Link>
          </div>
        )}

        {/* Edit Profile Form Inline */}
        {isEditing && (
          <form onSubmit={saveEdit} className="mt-6 pt-6 border-t border-[#202534] space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <h3 className="font-bold uppercase tracking-wider text-[#dba076] flex items-center gap-1.5">
                <Edit3 className="w-3.5 h-3.5" /> Profil Bilgilerini & Fotoğrafı Güncelle
              </h3>
              <span className="text-[11px] text-stone-500">Tüm bilgiler dilediğiniz an değiştirilebilir</span>
            </div>

            {/* Photo / Avatar Uploader Section */}
            <div className="p-4 rounded-xl bg-[#090d14] border border-[#202534] space-y-3">
              <label className="block text-stone-300 font-semibold flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-[#dba076]" /> Profil Fotoğrafı
              </label>

              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <img
                  src={editAvatar}
                  alt="Avatar Önizleme"
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-[#c87d4a]/40 bg-stone-900 shrink-0"
                />

                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, false)}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-xl bg-[#c87d4a] hover:bg-[#b86d3b] text-white font-semibold text-xs flex items-center gap-1.5 transition shadow-sm"
                    >
                      <Upload className="w-3.5 h-3.5" /> Bilgisayardan Fotoğraf Yükle
                    </button>
                    {avatarUploadMsg && (
                      <span className="text-[11px] text-[#9fc4aa] font-medium">
                        ✓ {avatarUploadMsg}
                      </span>
                    )}
                  </div>

                  <div>
                    <input
                      type="url"
                      value={editAvatar}
                      onChange={(e) => setEditAvatar(e.target.value)}
                      placeholder="Veya görsel bağlantısı (URL) yapıştırın..."
                      className="w-full px-3 py-1.5 bg-[#12151e] border border-[#202534] rounded-xl text-stone-300 focus:outline-none focus:border-[#c87d4a] text-xs"
                    />
                  </div>

                  {/* Quick Presets */}
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[10px] text-stone-500">Hazır Avatarlar:</span>
                    <div className="flex items-center gap-1.5">
                      {AVATAR_PRESETS.map((preset) => (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => setEditAvatar(preset.url)}
                          title={preset.label}
                          className={`w-7 h-7 rounded-full p-0.5 border transition ${
                            editAvatar === preset.url
                              ? 'border-[#c87d4a] ring-2 ring-[#c87d4a]/30'
                              : 'border-stone-800 hover:border-stone-600 opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img
                            src={preset.url}
                            alt={preset.label}
                            className="w-full h-full object-cover rounded-full"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-stone-400 mb-1 font-medium">Ad Soyad</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#090d14] border border-[#202534] rounded-xl text-white focus:outline-none focus:border-[#c87d4a]"
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1 font-medium">Öğrenci Numarası</label>
                <input
                  type="text"
                  value={editStudentNo}
                  onChange={(e) => setEditStudentNo(e.target.value)}
                  placeholder="Öğrenci no..."
                  className="w-full px-3 py-2 bg-[#090d14] border border-[#202534] rounded-xl text-white focus:outline-none focus:border-[#c87d4a]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-stone-400 mb-1 font-medium flex items-center gap-1 text-[#e09d9d]">
                  <Droplet className="w-3 h-3" /> Kan Grubu
                </label>
                <select
                  value={editBloodType}
                  onChange={(e) => setEditBloodType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-[#090d14] border border-[#202534] rounded-xl text-white focus:outline-none focus:border-[#c87d4a]"
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
                  className="w-full px-3 py-2 bg-[#090d14] border border-[#202534] rounded-xl text-white focus:outline-none focus:border-[#c87d4a]"
                />
              </div>
            </div>

            <div>
              <label className="block text-stone-400 mb-1 font-medium">Biyografi / Kulüp Notu</label>
              <input
                type="text"
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                placeholder="Örn: Jeoloji Mühendisliği 3. Sınıf | Mağara Fotoğrafçılığı"
                className="w-full px-3 py-2 bg-[#090d14] border border-[#202534] rounded-xl text-white focus:outline-none focus:border-[#c87d4a]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-3.5 py-2 text-stone-400 hover:text-white transition rounded-xl"
              >
                İptal
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#c87d4a] hover:bg-[#b86d3b] text-white font-semibold rounded-xl transition shadow-sm"
              >
                Bilgileri Kaydet
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Badges / Rozetler */}
      <div className="p-6 rounded-2xl bg-[#121622] border border-stone-800 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white flex items-center gap-2 font-heading">
            <Award className="w-4 h-4 text-amber-400" />
            Kazanılan Eğitim Rozetleri & Sertifikalar
          </h2>
          <span className="text-xs text-stone-500">{currentUser.badges?.length || 0} Rozet</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {currentUser.badges && currentUser.badges.length > 0 ? (
            currentUser.badges.map((badge, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-xl bg-[#090d14] border border-stone-800 text-xs font-medium text-amber-300 flex items-center gap-1.5"
              >
                <Award className="w-3.5 h-3.5 text-amber-400" /> {badge}
              </span>
            ))
          ) : (
            <span className="text-xs text-stone-500">Henüz bir eğitim rozeti eklenmedi.</span>
          )}
        </div>
      </div>

      {/* Grid: My Events & My Assigned Equipment */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Events registered */}
        <div className="p-5 rounded-2xl bg-[#121622] border border-stone-800 space-y-3">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 font-heading">
            <Calendar className="w-4 h-4 text-emerald-400" />
            Kayıtlı Olduğum Faaliyetler ({myEvents.length})
          </h2>

          {myEvents.length === 0 ? (
            <div className="text-xs text-stone-500 py-3">
              Henüz bir kampa kaydolmadınız.{' '}
              <Link href="/etkinlikler" className="text-amber-400 hover:underline">
                Faaliyet takvimine göz atın.
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {myEvents.map((ev) => (
                <div
                  key={ev.id}
                  className="p-3 rounded-xl bg-[#090d14] border border-stone-800 text-xs flex justify-between items-center"
                >
                  <div>
                    <h4 className="font-bold text-white">{ev.title}</h4>
                    <span className="text-[10px] text-stone-400">{ev.startDate} • {ev.caveName}</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                    Kayıtlı
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Assigned Equipment */}
        <div className="p-5 rounded-2xl bg-[#121622] border border-stone-800 space-y-3">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 font-heading">
            <Package className="w-4 h-4 text-blue-400" />
            Üzerimdeki Kulüp Zimmetleri ({myEquipment.length})
          </h2>

          {myEquipment.length === 0 ? (
            <div className="text-xs text-stone-500 py-3">
              Şu anda üzerinizde zimmetli bir kulüp ekipmanı bulunmuyor.{' '}
              <span className="text-stone-400">
                (Zimmetler yetkili malzeme sorumluları tarafından atanır.)
              </span>
            </div>
          ) : (
            <div className="space-y-2">
              {myEquipment.map((eq) => (
                <div
                  key={eq.id}
                  className="p-3 rounded-xl bg-[#090d14] border border-stone-800 text-xs flex justify-between items-center"
                >
                  <div>
                    <h4 className="font-bold text-white">{eq.name}</h4>
                    <span className="text-[10px] text-stone-400 font-mono">{eq.serialNo}</span>
                  </div>
                  <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                    Zimmetli
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}