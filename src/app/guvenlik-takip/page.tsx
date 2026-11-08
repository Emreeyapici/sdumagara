'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { CaveSafetyLog } from '@/types';
import {
  Radio,
  Clock,
  Phone,
  Plus,
  X,
  Lock,
  ArrowLeft,
  Shield,
  Edit3,
  Trash2,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import AuthModal from '@/components/AuthModal';

export default function SafetyWatchPage() {
  const {
    currentUser,
    canViewPrivateSections,
    isAdmin,
    safetyLogs,
    addSafetyLog,
    updateSafetyStatus,
    updateSafetyLog,
    deleteSafetyLog,
  } = useApp();

  const [modalOpen, setModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // New log form state
  const [caveName, setCaveName] = useState('');
  const [teamLeader, setTeamLeader] = useState('');
  const [surfaceWatchPerson, setSurfaceWatchPerson] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [entryTime, setEntryTime] = useState('');
  const [estimatedExitTime, setEstimatedExitTime] = useState('');
  const [teamSize, setTeamSize] = useState(4);

  // Edit log form state (Admin only)
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingLog, setEditingLog] = useState<CaveSafetyLog | null>(null);
  const [editCaveName, setEditCaveName] = useState('');
  const [editTeamLeader, setEditTeamLeader] = useState('');
  const [editSurfaceWatchPerson, setEditSurfaceWatchPerson] = useState('');
  const [editContactPhone, setEditContactPhone] = useState('');
  const [editEntryTime, setEditEntryTime] = useState('');
  const [editEstimatedExitTime, setEditEstimatedExitTime] = useState('');
  const [editTeamSize, setEditTeamSize] = useState(4);
  const [editStatus, setEditStatus] = useState<CaveSafetyLog['status']>('Mağarada (Faaliyette)');

  // Permission check: Only Admin, Yönetim, or Eğitmen can view Safety Watch
  if (!canViewPrivateSections) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
          <Lock className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold text-white">Özel Alan (Canlı Emniyet Protokolü)</h1>
        <p className="text-xs text-stone-400 max-w-md mx-auto leading-relaxed">
          Mağara giriş-çıkış takip masası ve acil durum yüzey koordinatları 
          yalnızca <strong>SDÜMAK Yönetim Kurulu, Eğitmenleri ve Yöneticilerine</strong> açıktır.
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

  const handleOpenModal = () => {
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }
    setTeamLeader(currentUser.name);
    setEntryTime(new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }));
    setModalOpen(true);
  };

  const handleCreateLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caveName || !surfaceWatchPerson || !contactPhone) return;

    addSafetyLog({
      caveName,
      teamLeader,
      surfaceWatchPerson,
      contactPhone,
      entryTime: `${new Date().toLocaleDateString('tr-TR')} - ${entryTime}`,
      estimatedExitTime,
      teamSize,
      status: 'Mağarada (Faaliyette)',
    });

    setModalOpen(false);
    setCaveName('');
    setSurfaceWatchPerson('');
    setContactPhone('');
  };

  const handleOpenEdit = (log: CaveSafetyLog) => {
    setEditingLog(log);
    setEditCaveName(log.caveName);
    setEditTeamLeader(log.teamLeader);
    setEditSurfaceWatchPerson(log.surfaceWatchPerson);
    setEditContactPhone(log.contactPhone);
    setEditEntryTime(log.entryTime);
    setEditEstimatedExitTime(log.estimatedExitTime);
    setEditTeamSize(log.teamSize);
    setEditStatus(log.status);
    setEditModalOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLog) return;

    updateSafetyLog(editingLog.id, {
      caveName: editCaveName.trim(),
      teamLeader: editTeamLeader.trim(),
      surfaceWatchPerson: editSurfaceWatchPerson.trim(),
      contactPhone: editContactPhone.trim(),
      entryTime: editEntryTime.trim(),
      estimatedExitTime: editEstimatedExitTime.trim(),
      teamSize: editTeamSize,
      status: editStatus,
    });

    setEditModalOpen(false);
    setEditingLog(null);
  };

  const handleDelete = (logId: string, caveTitle: string) => {
    if (window.confirm(`"${caveTitle}" emniyet takip kaydını silmek istediğinize emin misiniz?`)) {
      deleteSafetyLog(logId);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1d222e] pb-6">
        <div>
          <div className="text-xs font-mono text-[#dba076] uppercase tracking-wider mb-1 flex items-center gap-1.5 font-bold">
            <Radio className="w-3 h-3" /> Emniyet Protokolü • Canlı Takip Masası
          </div>
          <h1 className="text-2xl font-bold text-[#f4f1ea] tracking-tight font-heading">
            Canlı Güvenlik & Yüzey Takip Masası
          </h1>
          <p className="text-xs sm:text-sm text-[#8e94a3] mt-1">
            Mağaralarda telefon sinyali yoktur. Giriş ve tahmini çıkış saatleri yüzey sorumlusu tarafından anlık izlenir.
          </p>
        </div>

        <button
          onClick={handleOpenModal}
          className="px-4 py-2.5 rounded-xl bg-[#c87d4a] hover:bg-[#b86d3b] text-white font-semibold text-xs transition flex items-center justify-center gap-1.5 shrink-0 shadow-sm"
        >
          <Plus className="w-4 h-4" /> Yeni Takip Kaydı Başlat
        </button>
      </div>

      {/* Logs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {safetyLogs.length === 0 ? (
          <div className="col-span-full p-12 text-center rounded-2xl bg-[#12151e] border border-[#202534] text-stone-400 text-xs">
            Şu an aktif bir mağara operasyonu bulunmamaktadır.
          </div>
        ) : (
          safetyLogs.map((log) => {
            const isInside = log.status === 'Mağarada (Faaliyette)';

            return (
              <div
                key={log.id}
                className="p-5 rounded-2xl bg-[#12151e] border border-[#202534] hover:border-[#2e374d] transition space-y-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-stone-400 uppercase font-mono tracking-wider">Hedef Mağara</span>
                    <h3 className="text-base font-bold text-[#f4f1ea] font-heading">{log.caveName}</h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${
                        isInside
                          ? 'bg-[#291e14] text-[#dfb28e] border-[#4a3424]'
                          : log.status === 'Gecikme Alarmı'
                          ? 'bg-[#2b1717] text-[#e8a2a2] border-[#4a2626]'
                          : 'bg-[#18231c] text-[#9fc4aa] border-[#263a2c]'
                      }`}
                    >
                      {log.status}
                    </span>

                    {/* Admin Edit & Delete buttons */}
                    {isAdmin && (
                      <div className="flex items-center gap-1 pl-1 border-l border-[#242b3a]">
                        <button
                          onClick={() => handleOpenEdit(log)}
                          title="Kaydı Düzenle (Admin)"
                          className="p-1.5 rounded-lg bg-[#181c26] hover:bg-[#202533] text-stone-300 hover:text-[#dba076] transition"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(log.id, log.caveName)}
                          title="Kaydı Sil (Admin)"
                          className="p-1.5 rounded-lg bg-[#281616] hover:bg-[#3d1e1e] text-[#e09d9d] transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-stone-300 pt-2 border-t border-[#1f2434]">
                  <div>
                    <span className="text-[10px] text-stone-400 block font-mono">Ekip Lideri</span>
                    <span className="font-semibold text-white">{log.teamLeader} ({log.teamSize} Kişi)</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 block font-mono">Giriş / Tahmini Çıkış</span>
                    <span className="text-[#e09d9d] font-bold">{log.estimatedExitTime}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-[#0c0e14] text-xs flex justify-between items-center text-stone-400 border border-[#1f2434]">
                  <span>Yüzey Sorumlusu: <strong className="text-stone-200">{log.surfaceWatchPerson}</strong></span>
                  <span className="text-[#dfb28e] font-mono flex items-center gap-1">
                    <Phone className="w-3 h-3 text-stone-500" /> {log.contactPhone}
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#1f2434] text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="text-stone-400 font-mono text-[10px]">DURUM GÜNCELLE:</span>
                    <button
                      onClick={() => updateSafetyStatus(log.id, 'Güvenle Çıktı')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition border ${
                        log.status === 'Güvenle Çıktı'
                          ? 'bg-[#18231c] text-[#9fc4aa] border-[#37523f] font-bold'
                          : 'bg-[#18231c]/40 hover:bg-[#18231c] text-[#9fc4aa] border-[#263a2c]'
                      }`}
                    >
                      ✓ Çıktı
                    </button>
                    <button
                      onClick={() => updateSafetyStatus(log.id, 'Gecikme Alarmı')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition border ${
                        log.status === 'Gecikme Alarmı'
                          ? 'bg-[#2b1717] text-[#e8a2a2] border-[#5e2b2b] font-bold'
                          : 'bg-[#2b1717]/40 hover:bg-[#2b1717] text-[#e8a2a2] border-[#4a2626]'
                      }`}
                    >
                      🚨 Alarm
                    </button>
                    <button
                      onClick={() => updateSafetyStatus(log.id, 'Mağarada (Faaliyette)')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition border ${
                        log.status === 'Mağarada (Faaliyette)'
                          ? 'bg-[#291e14] text-[#dfb28e] border-[#593d28] font-bold'
                          : 'bg-[#291e14]/40 hover:bg-[#291e14] text-[#dfb28e] border-[#4a3424]'
                      }`}
                    >
                      Mağarada
                    </button>
                  </div>
                  <span className="text-[10px] text-stone-500 font-mono">{log.entryTime}</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* New Log Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#121622] border border-stone-800 rounded-2xl w-full max-w-md shadow-2xl p-5 space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-stone-800/80 pb-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5 font-heading">
                <Radio className="w-4 h-4 text-rose-400" /> Yeni Canlı Takip Kaydı
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-stone-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateLog} className="space-y-3">
              <div>
                <label className="block text-stone-300 mb-1">Mağara Adı *</label>
                <input
                  type="text"
                  required
                  value={caveName}
                  onChange={(e) => setCaveName(e.target.value)}
                  placeholder="Örn: Zindan Mağarası, Aksu"
                  className="w-full px-3 py-2 bg-[#090d14] border border-stone-800 rounded-xl text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-stone-300 mb-1">Ekip Lideri *</label>
                  <input
                    type="text"
                    required
                    value={teamLeader}
                    onChange={(e) => setTeamLeader(e.target.value)}
                    className="w-full px-3 py-2 bg-[#090d14] border border-stone-800 rounded-xl text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 mb-1">Ekip Kişi Sayısı</label>
                  <input
                    type="number"
                    min={1}
                    value={teamSize}
                    onChange={(e) => setTeamSize(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#090d14] border border-stone-800 rounded-xl text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-stone-300 mb-1">Yüzey Sorumlusu *</label>
                  <input
                    type="text"
                    required
                    value={surfaceWatchPerson}
                    onChange={(e) => setSurfaceWatchPerson(e.target.value)}
                    placeholder="Ad Soyad"
                    className="w-full px-3 py-2 bg-[#090d14] border border-stone-800 rounded-xl text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 mb-1">Yüzey Telefonu *</label>
                  <input
                    type="tel"
                    required
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="05xx xxx xx xx"
                    className="w-full px-3 py-2 bg-[#090d14] border border-stone-800 rounded-xl text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-stone-300 mb-1">Giriş Saati</label>
                  <input
                    type="text"
                    value={entryTime}
                    onChange={(e) => setEntryTime(e.target.value)}
                    className="w-full px-3 py-2 bg-[#090d14] border border-stone-800 rounded-xl text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 mb-1">Tahmini Çıkış Saati *</label>
                  <input
                    type="text"
                    required
                    value={estimatedExitTime}
                    onChange={(e) => setEstimatedExitTime(e.target.value)}
                    placeholder="18:30"
                    className="w-full px-3 py-2 bg-[#090d14] border border-stone-800 rounded-xl text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3 py-1.5 text-stone-400 hover:text-white"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl shadow-md shadow-rose-500/20"
                >
                  Takibi Başlat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Edit Modal */}
      {editModalOpen && editingLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#121622] border border-amber-500/30 rounded-2xl w-full max-w-md shadow-2xl p-5 space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-stone-800/80 pb-2">
              <h3 className="text-sm font-bold text-amber-400 flex items-center gap-1.5 font-heading">
                <Edit3 className="w-4 h-4" /> Takip Kaydını Düzenle (Admin)
              </h3>
              <button onClick={() => setEditModalOpen(false)} className="text-stone-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3">
              <div>
                <label className="block text-stone-300 mb-1 font-medium">Mağara Adı *</label>
                <input
                  type="text"
                  required
                  value={editCaveName}
                  onChange={(e) => setEditCaveName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#090d14] border border-stone-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-stone-300 mb-1 font-medium">Ekip Lideri</label>
                  <input
                    type="text"
                    required
                    value={editTeamLeader}
                    onChange={(e) => setEditTeamLeader(e.target.value)}
                    className="w-full px-3 py-2 bg-[#090d14] border border-stone-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 mb-1 font-medium">Kişi Sayısı</label>
                  <input
                    type="number"
                    min={1}
                    value={editTeamSize}
                    onChange={(e) => setEditTeamSize(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#090d14] border border-stone-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-stone-300 mb-1 font-medium">Yüzey Sorumlusu</label>
                  <input
                    type="text"
                    required
                    value={editSurfaceWatchPerson}
                    onChange={(e) => setEditSurfaceWatchPerson(e.target.value)}
                    className="w-full px-3 py-2 bg-[#090d14] border border-stone-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 mb-1 font-medium">Yüzey Telefonu</label>
                  <input
                    type="tel"
                    required
                    value={editContactPhone}
                    onChange={(e) => setEditContactPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-[#090d14] border border-stone-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-stone-300 mb-1 font-medium">Giriş Saati / Bilgisi</label>
                  <input
                    type="text"
                    value={editEntryTime}
                    onChange={(e) => setEditEntryTime(e.target.value)}
                    className="w-full px-3 py-2 bg-[#090d14] border border-stone-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 mb-1 font-medium">Tahmini Çıkış Saati</label>
                  <input
                    type="text"
                    required
                    value={editEstimatedExitTime}
                    onChange={(e) => setEditEstimatedExitTime(e.target.value)}
                    className="w-full px-3 py-2 bg-[#090d14] border border-stone-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-300 mb-1 font-medium">Operasyon Durumu</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as any)}
                  className="w-full px-3 py-2 bg-[#090d14] border border-stone-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Mağarada (Faaliyette)">Mağarada (Faaliyette)</option>
                  <option value="Güvenle Çıktı">Güvenle Çıktı</option>
                  <option value="Gecikme Alarmı">Gecikme Alarmı</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-3 py-1.5 text-stone-400 hover:text-white"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-xl shadow-md shadow-amber-500/20"
                >
                  Değişiklikleri Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>
  );
}
