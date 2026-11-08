'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { X, Send, Megaphone, Folder, Pin, Sparkles, Image as ImageIcon, Upload, Trash2, Plus } from 'lucide-react';
import { INITIAL_CATEGORIES } from '@/lib/mockData';
import { ForumTopic } from '@/types';

interface NewTopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCategoryId?: string;
  topicToEdit?: ForumTopic | null;
}

export default function NewTopicModal({
  isOpen,
  onClose,
  defaultCategoryId,
  topicToEdit,
}: NewTopicModalProps) {
  const { currentUser, isAdmin, addTopic, updateTopic } = useApp();
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState(defaultCategoryId || INITIAL_CATEGORIES[0].id);
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [isAnnouncement, setIsAnnouncement] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (topicToEdit) {
      setTitle(topicToEdit.title);
      setCategoryId(topicToEdit.categoryId);
      setContent(topicToEdit.content);
      setTagsInput(topicToEdit.tags?.join(', ') || '');
      setIsAnnouncement(!!topicToEdit.isAnnouncement);
      setIsPinned(!!topicToEdit.isPinned);
      setImages(topicToEdit.images || []);
    } else {
      setTitle('');
      setCategoryId(defaultCategoryId || INITIAL_CATEGORIES[0].id);
      setContent('');
      setTagsInput('');
      setIsAnnouncement(false);
      setIsPinned(false);
      setImages([]);
    }
    setImageUrlInput('');
    setErrorMsg('');
  }, [topicToEdit, isOpen, defaultCategoryId]);

  if (!isOpen) return null;

  const canAnnounce = isAdmin;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImages((prev) => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });

    if (e.target) e.target.value = '';
  };

  const handleAddImageUrl = () => {
    const trimmed = imageUrlInput.trim();
    if (!trimmed) return;
    setImages((prev) => [...prev, trimmed]);
    setImageUrlInput('');
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setErrorMsg('Lütfen başlık ve içerik alanlarını doldurun.');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    if (topicToEdit) {
      updateTopic(topicToEdit.id, {
        categoryId,
        title: title.trim(),
        content: content.trim(),
        tags: tags.length > 0 ? tags : ['Genel'],
        isAnnouncement: canAnnounce ? isAnnouncement : false,
        isPinned: canAnnounce ? isPinned : false,
        images,
      });
    } else {
      addTopic({
        categoryId,
        title: title.trim(),
        content: content.trim(),
        tags: tags.length > 0 ? tags : ['Genel'],
        isAnnouncement: canAnnounce ? isAnnouncement : false,
        images,
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
      <div className="bg-[#12151c] border border-stone-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden text-xs">
        {/* Header */}
        <div className="p-5 border-b border-stone-800/80 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              {topicToEdit ? 'Konuyu / Haberi Düzenle' : 'Yeni Forum Konusu / Bülten Aç'}
            </h2>
            <p className="text-[11px] text-stone-500">
              {topicToEdit
                ? 'Yönetici yetkiniz ile konunun içeriğini güncelleyin.'
                : 'SDÜMAK topluluğu için yeni bir duyuru veya tartışma başlatın.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white p-1 rounded-lg transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 max-h-[75vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-lg">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-stone-300 mb-1 font-medium">Kategori</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3 py-2 bg-[#0d0f12] border border-stone-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
            >
              {INITIAL_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-stone-300 mb-1 font-medium">Konu Başlığı *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Örn: Sütçüler İncesu Mağarası İp Sürtünmesi ve Emniyet"
              className="w-full px-3 py-2 bg-[#0d0f12] border border-stone-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-stone-300 mb-1 font-medium">Etiketler (Virgülle)</label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="SRT, Ekipman, Faaliyet"
              className="w-full px-3 py-2 bg-[#0d0f12] border border-stone-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          {canAnnounce && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-2.5 bg-[#171b24] border border-stone-800 rounded-xl">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAnnouncement}
                  onChange={(e) => setIsAnnouncement(e.target.checked)}
                  className="w-3.5 h-3.5 rounded text-amber-500 focus:ring-amber-500 border-stone-700 bg-stone-900"
                />
                <span className="text-stone-300 flex items-center gap-1">
                  <Megaphone className="w-3 h-3 text-orange-400" /> Kulüp Duyurusu Yap
                </span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="w-3.5 h-3.5 rounded text-amber-500 focus:ring-amber-500 border-stone-700 bg-stone-900"
                />
                <span className="text-stone-300 flex items-center gap-1">
                  <Pin className="w-3 h-3 text-amber-400" /> Başa Sabitle (Pin)
                </span>
              </label>
            </div>
          )}

          <div>
            <label className="block text-stone-300 mb-1 font-medium">İçerik *</label>
            <textarea
              required
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Düşüncelerinizi, faaliyet raporunuzu veya resmi duyuruyu yazın..."
              className="w-full px-3 py-2 bg-[#0d0f12] border border-stone-800 rounded-xl text-white focus:outline-none focus:border-amber-500 leading-relaxed font-sans"
            />
          </div>

          {/* Photos / Sliding Gallery Upload */}
          <div className="p-3 bg-[#131720] border border-stone-800 rounded-xl space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-stone-300 font-medium flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-amber-400" />
                <span>Fotoğraflar & Kaymalı Galeri ({images.length})</span>
              </label>
              <span className="text-[10px] text-stone-400">Birden çok fotoğraf ekleyebilirsiniz</span>
            </div>

            {/* Upload & URL Buttons */}
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
                className="flex items-center justify-center gap-1.5 px-3 py-2 bg-[#1b212d] hover:bg-[#252c3c] border border-stone-700 rounded-lg text-stone-200 transition"
              >
                <Upload className="w-3.5 h-3.5 text-amber-400" />
                <span>Cihazdan Fotoğraf Yükle</span>
              </button>

              <div className="flex-1 flex gap-1.5">
                <input
                  type="url"
                  placeholder="veya Görsel Bağlantısı (URL)..."
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddImageUrl();
                    }
                  }}
                  className="flex-1 px-2.5 py-1.5 bg-[#0d0f12] border border-stone-800 rounded-lg text-stone-200 text-xs focus:outline-none focus:border-amber-500"
                />
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="px-2.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg transition flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Ekle
                </button>
              </div>
            </div>

            {/* Thumbnail previews */}
            {images.length > 0 && (
              <div className="flex items-center gap-2 overflow-x-auto py-1">
                {images.map((img, idx) => (
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

          <div className="flex items-center justify-end space-x-2 pt-2 border-t border-stone-800/80">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-stone-400 hover:text-white"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-xl transition flex items-center gap-1.5 shadow-md shadow-amber-500/20"
            >
              <Send className="w-3.5 h-3.5" />
              {topicToEdit ? 'Değişiklikleri Kaydet' : 'Konuyu Yayınla'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
