'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  Package,
  Search,
  RotateCcw,
  UserCheck,
  X,
  Plus,
  Trash2,
  Shield,
  Lock,
  ArrowLeft,
  FileCheck,
  Edit3,
} from 'lucide-react';
import AuthModal from '@/components/AuthModal';
import { Equipment } from '@/types';

export default function EquipmentPage() {
  const {
    currentUser,
    isAdmin,
    canViewPrivateSections,
    users,
    equipment,
    addEquipment,
    updateEquipment,
    deleteEquipment,
    assignEquipment,
    returnEquipment,
  } = useApp();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Assign Modal State
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedEqId, setSelectedEqId] = useState<string | null>(null);
  const [selectedUserName, setSelectedUserName] = useState('');

  // New Equipment Modal State
  const [newEqModalOpen, setNewEqModalOpen] = useState(false);
  const [eqName, setEqName] = useState('');
  const [eqBrandModel, setEqBrandModel] = useState('');
  const [eqCategory, setEqCategory] = useState<Equipment['category']>('İp & Halat');
  const [eqSerialNo, setEqSerialNo] = useState('');

  // Edit Equipment Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingEq, setEditingEq] = useState<Equipment | null>(null);
  const [editEqName, setEditEqName] = useState('');
  const [editEqBrandModel, setEditEqBrandModel] = useState('');
  const [editEqCategory, setEditEqCategory] = useState<Equipment['category']>('İp & Halat');
  const [editEqSerialNo, setEditEqSerialNo] = useState('');
  const [editEqStatus, setEditEqStatus] = useState<Equipment['status']>('Kulüp Deposunda');

  // Permission check: Only Admin, Yönetim, or Eğitmen can view Equipment
  if (!canViewPrivateSections) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
          <Lock className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold text-white">Özel Alan (Kulüp Demirbaş & Envanteri)</h1>
        <p className="text-xs text-stone-400 max-w-md mx-auto leading-relaxed">
          Kulüp ekipman, ip ve dikey teknik malzeme envanter listesi ile zimmetleme işlemleri 
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

  const filteredEq = equipment.filter((eq) => {
    const matchSearch =
      eq.name.toLowerCase().includes(search.toLowerCase()) ||
      eq.serialNo.toLowerCase().includes(search.toLowerCase()) ||
      (eq.assignedTo && eq.assignedTo.toLowerCase().includes(search.toLowerCase()));
    const matchStat = filterStatus === 'all' || eq.status === filterStatus;
    return matchSearch && matchStat;
  });

  const handleOpenAssignModal = (eqId: string) => {
    setSelectedEqId(eqId);
    setSelectedUserName(users[0]?.name || '');
    setAssignModalOpen(true);
  };

  const handleConfirmAssign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEqId || !selectedUserName) return;
    assignEquipment(selectedEqId, selectedUserName);
    setAssignModalOpen(false);
    setSelectedEqId(null);
  };

  const handleDeleteEquipment = (eqId: string, name: string) => {
    if (!isAdmin) return;
    if (confirm(`"${name}" ekipmanını envanterden kaldırmak istediğinize emin misiniz?`)) {
      deleteEquipment(eqId);
    }
  };

  const handleCreateEquipment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eqName || !eqSerialNo) return;

    addEquipment({
      name: eqName,
      brandModel: eqBrandModel || 'SDÜMAK Demirbaş',
      category: eqCategory,
      serialNo: eqSerialNo,
      status: 'Kulüp Deposunda',
      lastInspectionDate: new Date().toISOString().split('T')[0],
      condition: 'Mükemmel',
    });

    setNewEqModalOpen(false);
    setEqName('');
    setEqBrandModel('');
    setEqSerialNo('');
  };

  const handleStartEdit = (item: Equipment) => {
    setEditingEq(item);
    setEditEqName(item.name);
    setEditEqBrandModel(item.brandModel);
    setEditEqCategory(item.category);
    setEditEqSerialNo(item.serialNo);
    setEditEqStatus(item.status);
    setEditModalOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEq) return;
    updateEquipment(editingEq.id, {
      name: editEqName.trim(),
      brandModel: editEqBrandModel.trim(),
      category: editEqCategory,
      serialNo: editEqSerialNo.trim(),
      status: editEqStatus,
    });
    setEditModalOpen(false);
    setEditingEq(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800/80 pb-6">
        <div>
          <div className="text-xs font-mono text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" /> Envanter & Zimmet Masası • Yetkili Paneli
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Kulüp Ekipman Yönetimi</h1>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            İpler, iniş aletleri, kasklar ve emniyet kemerlerinin üyelere zimmetlenmesi ve takibi.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setNewEqModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs transition flex items-center justify-center gap-1.5 shrink-0 shadow-sm"
          >
            <Plus className="w-4 h-4" /> Yeni Ekipman Ekle
          </button>
        )}
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Ekipman, seri no veya üye ara..."
            className="w-full pl-10 pr-4 py-2 bg-[#13161c] border border-stone-800 rounded-xl text-xs sm:text-sm text-white placeholder-stone-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          {['all', 'Kulüp Deposunda', 'Zimmette', 'Bakımda / Kontrolde'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                filterStatus === st
                  ? 'bg-amber-500 text-stone-950 font-bold'
                  : 'bg-[#13161c] border border-stone-800 text-stone-400 hover:text-white'
              }`}
            >
              {st === 'all' ? 'Tümü' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Equipment Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredEq.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-[#13161c] border border-stone-800/80 hover:border-stone-700 transition flex flex-col justify-between space-y-3"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px]">
                <span className="font-mono text-stone-400 bg-stone-800 px-1.5 py-0.5 rounded">
                  {item.serialNo}
                </span>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`px-2 py-0.5 rounded font-semibold ${
                      item.status === 'Kulüp Deposunda'
                        ? 'text-emerald-400 bg-emerald-500/10'
                        : item.status === 'Zimmette'
                        ? 'text-amber-400 bg-amber-500/10'
                        : 'text-rose-400 bg-rose-500/10'
                    }`}
                  >
                    {item.status}
                  </span>
                  {isAdmin && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleStartEdit(item)}
                        title="Ekipman Bilgilerini Düzenle"
                        className="p-1 text-stone-500 hover:text-amber-400 rounded transition"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteEquipment(item.id, item.name)}
                        title="Ekipmanı Sil"
                        className="p-1 text-stone-600 hover:text-rose-400 rounded transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <h3 className="text-sm font-bold text-white leading-snug">{item.name}</h3>
              <p className="text-xs text-stone-500">{item.brandModel}</p>

              {item.assignedTo ? (
                <div className="text-xs text-amber-300 pt-1.5 flex items-center justify-between">
                  <span>Zimmetli: <strong>{item.assignedTo}</strong></span>
                  <span className="text-[10px] text-stone-500 font-mono">{item.assignedDate}</span>
                </div>
              ) : (
                <div className="text-[11px] text-stone-500 pt-1.5">
                  Depoda teslim bekliyor
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="pt-2 border-t border-stone-800/80">
              {item.status === 'Kulüp Deposunda' ? (
                <button
                  onClick={() => handleOpenAssignModal(item.id)}
                  className="w-full py-1.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs rounded-lg transition flex items-center justify-center gap-1.5"
                >
                  <UserCheck className="w-3.5 h-3.5" /> Üyeye Zimmetle
                </button>
              ) : item.status === 'Zimmette' ? (
                <button
                  onClick={() => returnEquipment(item.id)}
                  className="w-full py-1.5 bg-[#181c24] hover:bg-stone-700 text-stone-300 text-xs rounded-lg transition flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-400" /> Depoya İade Al
                </button>
              ) : (
                <span className="text-[11px] text-stone-500 block text-center py-1">
                  Bakım ve Test Aşamasında
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Assign Equipment to Member Modal */}
      {assignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#12151c] border border-stone-800 rounded-2xl w-full max-w-sm shadow-2xl p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-stone-800/80 pb-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-amber-400" /> Ekipman Zimmet Formu
              </h3>
              <button onClick={() => setAssignModalOpen(false)} className="text-stone-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmAssign} className="space-y-3">
              <div>
                <label className="block text-stone-300 mb-1 font-medium">Zimmetlenecek Üyeyi Seçin *</label>
                <select
                  required
                  value={selectedUserName}
                  onChange={(e) => setSelectedUserName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0d0f12] border border-stone-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                >
                  {users.map((u) => (
                    <option key={u.id} value={u.name}>
                      {u.name} ({u.role} - {u.bloodType})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAssignModalOpen(false)}
                  className="px-3 py-1.5 text-stone-400 hover:text-white"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-500 text-stone-950 font-bold rounded-xl"
                >
                  Zimmeti Ata
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Equipment Modal (Admin Only) */}
      {newEqModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#12151c] border border-stone-800 rounded-2xl w-full max-w-sm shadow-2xl p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-stone-800/80 pb-2">
              <h3 className="text-sm font-bold text-white">Yeni Ekipman / Demirbaş Ekle</h3>
              <button onClick={() => setNewEqModalOpen(false)} className="text-stone-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateEquipment} className="space-y-3">
              <div>
                <label className="block text-stone-300 mb-1">Ekipman Adı *</label>
                <input
                  type="text"
                  required
                  value={eqName}
                  onChange={(e) => setEqName(e.target.value)}
                  placeholder="Örn: Petzl Simple İniş Aleti"
                  className="w-full px-3 py-2 bg-[#0d0f12] border border-stone-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-stone-300 mb-1">Marka & Model</label>
                <input
                  type="text"
                  value={eqBrandModel}
                  onChange={(e) => setEqBrandModel(e.target.value)}
                  placeholder="Petzl D004AA00"
                  className="w-full px-3 py-2 bg-[#0d0f12] border border-stone-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-stone-300 mb-1">Seri / Kod No *</label>
                  <input
                    type="text"
                    required
                    value={eqSerialNo}
                    onChange={(e) => setEqSerialNo(e.target.value)}
                    placeholder="SDUMAK-DESC-05"
                    className="w-full px-3 py-2 bg-[#0d0f12] border border-stone-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 mb-1">Kategori</label>
                  <select
                    value={eqCategory}
                    onChange={(e) => setEqCategory(e.target.value as any)}
                    className="w-full px-2 py-2 bg-[#0d0f12] border border-stone-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="İp & Halat">İp & Halat</option>
                    <option value="Kişisel Dikey Ekipman">Dikey Ekipman</option>
                    <option value="Kask & Aydınlatma">Kask & Aydınlatma</option>
                    <option value="Emniyet & Ankraj">Emniyet & Ankraj</option>
                    <option value="Ortak Kamp Malzemesi">Kamp Malzemesi</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setNewEqModalOpen(false)}
                  className="px-3 py-1.5 text-stone-400 hover:text-white"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-500 text-stone-950 font-bold rounded-xl"
                >
                  Envantere Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Equipment Modal */}
      {editModalOpen && editingEq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-[#12151c] border border-stone-800 rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-stone-800/80 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-amber-400" /> Ekipman Bilgilerini Düzenle
              </h3>
              <button
                onClick={() => {
                  setEditModalOpen(false);
                  setEditingEq(null);
                }}
                className="text-stone-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3">
              <div>
                <label className="block text-stone-300 mb-1 font-medium">Malzeme Adı *</label>
                <input
                  type="text"
                  required
                  value={editEqName}
                  onChange={(e) => setEditEqName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0d0f12] border border-stone-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-stone-300 mb-1 font-medium">Marka / Model</label>
                <input
                  type="text"
                  value={editEqBrandModel}
                  onChange={(e) => setEditEqBrandModel(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0d0f12] border border-stone-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-stone-300 mb-1 font-medium">Seri No / Kod *</label>
                  <input
                    type="text"
                    required
                    value={editEqSerialNo}
                    onChange={(e) => setEditEqSerialNo(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0d0f12] border border-stone-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 mb-1 font-medium">Kategori</label>
                  <select
                    value={editEqCategory}
                    onChange={(e) => setEditEqCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[#0d0f12] border border-stone-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="İp & Halat">İp & Halat</option>
                    <option value="Kişisel Dikey Ekipman">Dikey Ekipman</option>
                    <option value="Kask & Aydınlatma">Kask & Aydınlatma</option>
                    <option value="Emniyet & Ankraj">Emniyet & Ankraj</option>
                    <option value="Ortak Kamp Malzemesi">Kamp Malzemesi</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-stone-300 mb-1 font-medium">Durum</label>
                <select
                  value={editEqStatus}
                  onChange={(e) => setEditEqStatus(e.target.value as any)}
                  className="w-full px-3 py-2 bg-[#0d0f12] border border-stone-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Kulüp Deposunda">Kulüp Deposunda</option>
                  <option value="Zimmette">Zimmette</option>
                  <option value="Bakımda / Testte">Bakımda / Testte</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => {
                    setEditModalOpen(false);
                    setEditingEq(null);
                  }}
                  className="px-3 py-1.5 text-stone-400 hover:text-white"
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

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>
  );
}
