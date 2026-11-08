'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  Calendar,
  MapPin,
  Clock,
  Plus,
  CheckCircle2,
  X,
  Trash2,
  Edit3,
  ShieldAlert,
  Image as ImageIcon,
  Upload,
} from 'lucide-react';
import AuthModal from '@/components/AuthModal';
import ImageCarousel from '@/components/ImageCarousel';
import { EventDifficulty, EventItem } from '@/types';

export default function EventsPage() {
  const {
    currentUser,
    isAdmin,
    events,
    registerForEvent,
    cancelEventRegistration,
    addEvent,
    updateEvent,
    deleteEvent,
  } = useApp();

  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [caveName, setCaveName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [quota, setQuota] = useState(25);
  const [difficulty, setDifficulty] = useState<EventDifficulty>('Basit / Yatay Mağara');
  const [requirementsInput, setRequirementsInput] = useState('');
  const [leadersInput, setLeadersInput] = useState('Emre Yapıcı');
  const [eventImages, setEventImages] = useState<string[]>([]);
  const [eventImageUrlInput, setEventImageUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredEvents = events.filter((ev) => {
    return filterDifficulty === 'all' || ev.difficulty === filterDifficulty;
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setEventImages((prev) => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });

    if (e.target) e.target.value = '';
  };

  const handleAddImageUrl = () => {
    const trimmed = eventImageUrlInput.trim();
    if (!trimmed) return;
    setEventImages((prev) => [...prev, trimmed]);
    setEventImageUrlInput('');
  };

  const handleRemoveImage = (index: number) => {
    setEventImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRegister = (eventId: string) => {
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }
    registerForEvent(eventId);
  };

  const handleDeleteEvent = (eventId: string, title: string) => {
    if (!isAdmin) return;
    if (confirm(`"${title}" faaliyetini tamamen silmek istediğinize emin misiniz?`)) {
      deleteEvent(eventId);
    }
  };

  const handleOpenAddModal = () => {
    setEditingEventId(null);
    setTitle('');
    setDescription('');
    setLocation('');
    setCaveName('');
    setStartDate('');
    setEndDate('');
    setQuota(25);
    setDifficulty('Basit / Yatay Mağara');
    setRequirementsInput('Kafa lambası (yedek pilli), Çizme/Bot, Tulum');
    setLeadersInput(currentUser ? currentUser.name : 'Emre Yapıcı');
    setEventImages([]);
    setEventImageUrlInput('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (ev: EventItem) => {
    setEditingEventId(ev.id);
    setTitle(ev.title);
    setDescription(ev.description);
    setLocation(ev.location);
    setCaveName(ev.caveName);
    setStartDate(ev.startDate);
    setEndDate(ev.endDate);
    setQuota(ev.quota);
    setDifficulty(ev.difficulty);
    setRequirementsInput(ev.requirements?.join(', ') || '');
    setLeadersInput(ev.leaders?.join(', ') || 'Emre Yapıcı');
    setEventImages(ev.images || (ev.coverImage ? [ev.coverImage] : []));
    setEventImageUrlInput('');
    setIsModalOpen(true);
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !startDate || !caveName) return;

    const eventPayload = {
      title: title.trim(),
      description: description.trim(),
      location: location.trim(),
      caveName: caveName.trim(),
      startDate,
      endDate: endDate || startDate,
      quota,
      difficulty,
      status: 'Kayıtlar Açık' as const,
      organizer: 'SDÜMAK Yönetim Kurulu',
      leaders: leadersInput ? leadersInput.split(',').map((l) => l.trim()) : ['Emre Yapıcı'],
      requirements: requirementsInput ? requirementsInput.split(',').map((r) => r.trim()) : ['Rahat giysi', 'Kafa lambası'],
      coverImage: eventImages[0] || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80',
      images: eventImages,
    };

    if (editingEventId) {
      updateEvent(editingEventId, eventPayload);
    } else {
      addEvent(eventPayload);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800/80 pb-6">
        <div>
          <div className="text-xs font-mono text-[#dba076] uppercase tracking-wider mb-1">
            Faaliyet Takvimi
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight font-serif">Kamplar & Eğitimler</h1>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            Çaylak eğitim kampları, dikey ip (SRT) antrenmanları ve keşif seferleri.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2.5 rounded-xl bg-[#c87d4a] hover:bg-[#b06a38] text-stone-950 font-bold text-xs transition flex items-center justify-center gap-1.5 shrink-0 shadow-lg shadow-[#c87d4a]/20"
          >
            <Plus className="w-4 h-4" /> Yeni Faaliyet Ekle
          </button>
        )}
      </div>

      {/* Filter */}
      <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1 scrollbar-none">
        <span className="text-stone-500 font-medium mr-1">Zorluk Seviyesi:</span>
        {['all', 'Basit / Yatay Mağara', 'Orta Seviye', 'İleri / Dikey Mağara (SRT Zorunlu)'].map((diff) => (
          <button
            key={diff}
            onClick={() => setFilterDifficulty(diff)}
            className={`px-3 py-1.5 rounded-lg font-medium transition shrink-0 ${
              filterDifficulty === diff
                ? 'bg-[#c87d4a] text-stone-950 font-bold'
                : 'cave-panel text-stone-400 hover:text-white'
            }`}
          >
            {diff === 'all' ? 'Tüm Faaliyetler' : diff}
          </button>
        ))}
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredEvents.map((ev) => {
          const isRegistered = currentUser && ev.registeredUserIds.includes(currentUser.id);
          const isFull = ev.registeredUserIds.length >= ev.quota;

          return (
            <div
              key={ev.id}
              className="p-5 sm:p-6 rounded-2xl cave-panel hover:border-[#c87d4a]/40 transition flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-stone-400">
                  <span className="flex items-center gap-1 font-mono text-[#dba076]">
                    <Calendar className="w-3.5 h-3.5" />
                    {ev.startDate} — {ev.endDate}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#1a1f29] text-stone-300 font-medium">
                      {ev.difficulty}
                    </span>

                    {/* Admin Actions: Edit & Delete */}
                    {isAdmin && (
                      <div className="flex items-center gap-1 pl-1 border-l border-stone-800">
                        <button
                          onClick={() => handleOpenEditModal(ev)}
                          title="Faaliyeti Düzenle"
                          className="p-1 text-stone-400 hover:text-amber-400 hover:bg-stone-800 rounded transition"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(ev.id, ev.title)}
                          title="Faaliyeti Kaldır"
                          className="p-1 text-stone-500 hover:text-rose-400 hover:bg-rose-500/10 rounded transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <h3 className="text-base font-bold text-white leading-snug">
                  {ev.title}
                </h3>

                <div className="flex items-center gap-1.5 text-xs text-stone-400">
                  <MapPin className="w-3.5 h-3.5 text-[#dba076] shrink-0" />
                  <span>{ev.location} • <strong className="text-stone-300">{ev.caveName}</strong></span>
                </div>

                {/* Sliding Photo Gallery for Event */}
                {ev.images && ev.images.length > 0 && (
                  <div className="pt-1">
                    <ImageCarousel images={ev.images} alt={ev.title} aspectRatio="aspect-video" />
                  </div>
                )}

                <p className="text-xs text-stone-400 leading-relaxed pt-1">
                  {ev.description}
                </p>

                {/* Requirements */}
                <div className="flex flex-wrap gap-1 pt-2">
                  {ev.requirements.map((req, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2 py-0.5 rounded bg-[#181c24] text-stone-400"
                    >
                      ✓ {req}
                    </span>
                  ))}
                </div>
              </div>

              {/* Quota & Action */}
              <div className="pt-3 border-t border-stone-800/80 flex items-center justify-between gap-3 text-xs">
                <div className="text-stone-400">
                  Kontenjan:{' '}
                  <strong className="text-stone-200">
                    {ev.registeredUserIds.length} / {ev.quota}
                  </strong>
                </div>

                {isRegistered ? (
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Kayıtlısınız
                    </span>
                    <button
                      onClick={() => cancelEventRegistration(ev.id)}
                      className="text-stone-500 hover:text-rose-400 text-[11px]"
                    >
                      İptal
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleRegister(ev.id)}
                    disabled={isFull}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                      isFull
                        ? 'bg-stone-800 text-stone-500 cursor-not-allowed'
                        : 'bg-amber-500 hover:bg-amber-600 text-stone-950'
                    }`}
                  >
                    {isFull ? 'Dolu' : 'Katıl'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Event Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-[#12151c] border border-stone-800 rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800/80 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-400" />
                {editingEventId ? 'Faaliyet Bilgilerini Düzenle' : 'Yeni Faaliyet / Kamp Ekle'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-300 mb-1 font-medium">Faaliyet Başlığı *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Örn: Sütçüler İncesu Mağarası İleri SRT Kampı"
                  className="w-full px-3 py-2 bg-[#0d0f12] border border-stone-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-stone-300 mb-1 font-medium">Mağara Adı *</label>
                  <input
                    type="text"
                    required
                    value={caveName}
                    onChange={(e) => setCaveName(e.target.value)}
                    placeholder="İncesu Mağarası"
                    className="w-full px-3 py-2 bg-[#0d0f12] border border-stone-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 mb-1 font-medium">Bölge</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Sütçüler / Isparta"
                    className="w-full px-3 py-2 bg-[#0d0f12] border border-stone-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-stone-300 mb-1 font-medium">Başlangıç Tarihi</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-2 py-2 bg-[#0d0f12] border border-stone-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 mb-1 font-medium">Kontenjan</label>
                  <input
                    type="number"
                    value={quota}
                    onChange={(e) => setQuota(Number(e.target.value))}
                    className="w-full px-2 py-2 bg-[#0d0f12] border border-stone-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 mb-1 font-medium">Zorluk</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as any)}
                    className="w-full px-2 py-2 bg-[#0d0f12] border border-stone-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Basit / Yatay Mağara">Basit / Yatay</option>
                    <option value="Orta Seviye">Orta Seviye</option>
                    <option value="İleri / Dikey Mağara (SRT Zorunlu)">İleri Dikey (SRT)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-stone-300 mb-1 font-medium">Liderler (Virgülle ayrılmış)</label>
                <input
                  type="text"
                  value={leadersInput}
                  onChange={(e) => setLeadersInput(e.target.value)}
                  placeholder="Emre Yapıcı, Alperen Demir"
                  className="w-full px-3 py-2 bg-[#0d0f12] border border-stone-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-stone-300 mb-1 font-medium">Gereksinimler (Virgülle ayrılmış)</label>
                <input
                  type="text"
                  value={requirementsInput}
                  onChange={(e) => setRequirementsInput(e.target.value)}
                  placeholder="Çizme, Tulum, SRT-1 Sertifikası"
                  className="w-full px-3 py-2 bg-[#0d0f12] border border-stone-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-stone-300 mb-1 font-medium">Faaliyet Açıklaması</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Faaliyet programı, hareket saati ve detaylar..."
                  className="w-full px-3 py-2 bg-[#0d0f12] border border-stone-800 rounded-xl text-white focus:outline-none focus:border-[#dba076]"
                />
              </div>

              {/* Photo Upload & Gallery */}
              <div className="p-3 bg-[#131720] border border-stone-800 rounded-xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-stone-300 font-medium flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-[#dba076]" />
                    <span>Faaliyet Fotoğrafları & Kaymalı Galeri ({eventImages.length})</span>
                  </label>
                  <span className="text-[10px] text-stone-400">Çoklu fotoğraf eklenebilir</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 bg-[#1b212d] hover:bg-[#252c3c] border border-stone-700 rounded-lg text-stone-200 text-xs transition"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#dba076]" />
                    <span>Fotoğraf Yükle</span>
                  </button>

                  <div className="flex-1 flex gap-1.5">
                    <input
                      type="url"
                      placeholder="veya Görsel URL'si..."
                      value={eventImageUrlInput}
                      onChange={(e) => setEventImageUrlInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddImageUrl();
                        }
                      }}
                      className="flex-1 px-2.5 py-1.5 bg-[#0d0f12] border border-stone-800 rounded-lg text-stone-200 text-xs focus:outline-none focus:border-[#dba076]"
                    />
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      className="px-2.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs rounded-lg transition"
                    >
                      Ekle
                    </button>
                  </div>
                </div>

                {eventImages.length > 0 && (
                  <div className="flex items-center gap-2 overflow-x-auto py-1">
                    {eventImages.map((img, idx) => (
                      <div key={idx} className="relative group shrink-0 w-16 h-16 rounded-lg overflow-hidden border border-stone-700 bg-stone-900">
                        <img src={img} alt={`Önizleme ${idx + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          title="Fotoğrafı Kaldır"
                          className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-rose-400 hover:text-rose-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <span className="absolute bottom-0.5 right-0.5 px-1 bg-black/80 text-[9px] rounded text-stone-300 font-mono">
                          #{idx + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 text-stone-400 hover:text-white text-xs"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#c87d4a] hover:bg-[#b06a38] text-stone-950 font-bold rounded-xl transition shadow-md shadow-[#c87d4a]/20 text-xs"
                >
                  {editingEventId ? 'Değişiklikleri Kaydet' : 'Faaliyeti Yayınla'}
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
