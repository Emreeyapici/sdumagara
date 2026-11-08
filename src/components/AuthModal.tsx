'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { X, LogIn, UserPlus, Droplet, Lock, Mail, Shield } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'register';
}

export default function AuthModal({ isOpen, onClose, defaultTab = 'login' }: AuthModalProps) {
  const { login, register } = useApp();
  const [tab, setTab] = useState<'login' | 'register'>(defaultTab);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [studentNo, setStudentNo] = useState('');
  const [phone, setPhone] = useState('');
  const [bloodType, setBloodType] = useState<any>('A+');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Lütfen e-posta ve şifrenizi girin.');
      return;
    }
    const res = login(email, password);
    if (res.success) {
      setErrorMsg('');
      onClose();
    } else {
      setErrorMsg(res.message || 'Giriş yapılamadı.');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !studentNo) {
      setErrorMsg('Lütfen tüm zorunlu alanları doldurun.');
      return;
    }
    const res = register({
      name,
      email,
      password,
      studentNo,
      bloodType,
      phone,
      bio: 'SDÜMAK Topluluğu Yeni Üyesi',
    });
    if (res.success) {
      setErrorMsg('');
      onClose();
    } else {
      setErrorMsg(res.message || 'Kayıt başarısız.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
      <div className="bg-[#12151c] border border-stone-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden text-xs">
        {/* Header */}
        <div className="p-5 border-b border-stone-800/80 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <span className="text-2xl">🦇</span>
            <div>
              <h2 className="text-sm font-bold text-white">SDÜMAK Portal Girişi</h2>
              <p className="text-[11px] text-stone-500">Süleyman Demirel Üniversitesi Mağara Araştırma ve Koruma Topluluğu</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white p-1 rounded-lg transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-stone-800/80 bg-[#0d0f13]">
          <button
            onClick={() => { setTab('login'); setErrorMsg(''); }}
            className={`flex-1 py-3 text-xs font-semibold transition border-b-2 flex items-center justify-center gap-1.5 ${
              tab === 'login'
                ? 'border-amber-500 text-amber-400 bg-[#12151c]'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" /> Üye Girişi
          </button>
          <button
            onClick={() => { setTab('register'); setErrorMsg(''); }}
            className={`flex-1 py-3 text-xs font-semibold transition border-b-2 flex items-center justify-center gap-1.5 ${
              tab === 'register'
                ? 'border-amber-500 text-amber-400 bg-[#12151c]'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" /> Yeni Üye Kaydı
          </button>
        </div>

        {/* Body */}
        <div className="p-5 max-h-[75vh] overflow-y-auto space-y-4">
          {errorMsg && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs rounded-xl">
              {errorMsg}
            </div>
          )}

          {tab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-3.5">
              <div>
                <label className="block text-stone-300 mb-1 font-medium">E-Posta Adresi</label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ornek@ogr.sdu.edu.tr"
                    className="w-full pl-9 pr-3 py-2 bg-[#0d0f12] border border-stone-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-300 mb-1 font-medium">Şifre</label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 bg-[#0d0f12] border border-stone-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-xl text-xs transition shadow-md shadow-amber-500/20"
              >
                Giriş Yap
              </button>
            </form>
          ) : (
            /* Registration Form with Password */
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="block text-stone-300 mb-1 font-medium">Ad Soyad *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ahmet Yılmaz"
                  className="w-full px-3 py-2 bg-[#0d0f12] border border-stone-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-stone-300 mb-1 font-medium">Öğrenci No *</label>
                  <input
                    type="text"
                    required
                    value={studentNo}
                    onChange={(e) => setStudentNo(e.target.value)}
                    placeholder="231103..."
                    className="w-full px-3 py-2 bg-[#0d0f12] border border-stone-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 mb-1 font-medium flex items-center gap-1 text-rose-400">
                    <Droplet className="w-3 h-3" /> Kan Grubu *
                  </label>
                  <select
                    value={bloodType}
                    onChange={(e) => setBloodType(e.target.value as any)}
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
              </div>

              <div>
                <label className="block text-stone-300 mb-1 font-medium">E-Posta Adresi *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ogrenci@ogr.sdu.edu.tr"
                  className="w-full px-3 py-2 bg-[#0d0f12] border border-stone-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-stone-300 mb-1 font-medium">Hesap Şifresi (En az 6 karakter) *</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 bg-[#0d0f12] border border-stone-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-stone-300 mb-1 font-medium">Telefon Numarası</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="05xx xxx xx xx"
                  className="w-full px-3 py-2 bg-[#0d0f12] border border-stone-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="p-2.5 rounded-lg bg-stone-900 border border-stone-800 text-[11px] text-stone-400">
                ℹ️ Yeni kayıt olan tüm üyeler başlangıçta <strong>Çaylak</strong> statüsünde başlar. Yetkilendirmeler kulüp yöneticisi tarafından onaylanır.
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-xl text-xs transition shadow-md shadow-amber-500/20"
              >
                Hesap Oluştur ve Katıl
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
