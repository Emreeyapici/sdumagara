'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  MessageSquare,
  Search,
  Plus,
  Pin,
  Megaphone,
  Heart,
  Eye,
  Shield,
  Trash2,
  Lock,
  Edit3,
  Image as ImageIcon,
} from 'lucide-react';
import { INITIAL_CATEGORIES } from '@/lib/mockData';
import { ForumTopic } from '@/types';
import NewTopicModal from '@/components/NewTopicModal';
import AuthModal from '@/components/AuthModal';

export default function ForumPage() {
  const { currentUser, isAdmin, topics, likeTopic, deleteTopic } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [newTopicModalOpen, setNewTopicModalOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<ForumTopic | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const filteredTopics = topics.filter((t) => {
    const matchesCat = selectedCategory === 'all' || t.categoryId === selectedCategory;
    const matchesQuery =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesQuery;
  });

  const handleDeleteTopic = (e: React.MouseEvent, topicId: string, title: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAdmin) return;
    if (confirm(`"${title}" konusunu tamamen silmek istediğinize emin misiniz?`)) {
      deleteTopic(topicId);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1e2533] pb-6">
        <div>
          <div className="text-xs font-mono text-amber-400 uppercase tracking-wider mb-1">
            Topluluk Masası
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Forum & Kulüp Bülteni</h1>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            Dikey mağara teknikleri, faaliyet günlükleri ve kulüp duyuruları.
          </p>
        </div>

        {/* Only Admin can add new topics / announcements */}
        {isAdmin ? (
          <button
            onClick={() => setNewTopicModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs transition flex items-center justify-center gap-1.5 shrink-0 shadow-md shadow-amber-500/20"
          >
            <Plus className="w-4 h-4" /> Yeni Konu / Duyuru Aç
          </button>
        ) : (
          <div className="text-[11px] text-stone-500 flex items-center gap-1.5 bg-[#12151c] px-3 py-1.5 rounded-xl border border-stone-800">
            <Lock className="w-3.5 h-3.5 text-amber-500" />
            <span>Konu açma yetkisi yalnızca Yöneticiye (Admin) aittir.</span>
          </div>
        )}
      </div>

      {/* Guest Notice */}
      {!currentUser && (
        <div className="p-3.5 rounded-2xl cave-panel flex items-center justify-between text-xs">
          <span className="text-stone-300">
            Yorum yazabilmek ve tartışmalara katılabilmek için üye hesabınıza giriş yapın.
          </span>
          <Link
            href="/profil"
            className="text-amber-400 hover:underline font-semibold shrink-0 ml-3"
          >
            Üye Girişi / Kayıt →
          </Link>
        </div>
      )}

      {/* Search and Category Filter */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Konu başlığı, etiket veya içerik ara..."
            className="w-full pl-10 pr-4 py-2 bg-[#10131b] border border-stone-800 rounded-xl text-xs sm:text-sm text-white placeholder-stone-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl font-medium transition shrink-0 ${
              selectedCategory === 'all'
                ? 'bg-amber-500 text-stone-950 font-bold'
                : 'cave-panel text-stone-400 hover:text-white'
            }`}
          >
            Tümü ({topics.length})
          </button>
          {INITIAL_CATEGORIES.map((cat) => {
            const count = topics.filter((t) => t.categoryId === cat.id).length;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl font-medium transition shrink-0 flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-amber-500 text-stone-950 font-bold'
                    : 'cave-panel text-stone-400 hover:text-white'
                }`}
              >
                <span>{cat.name}</span>
                <span className="text-[10px] opacity-70 font-mono">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Topics List */}
      <div className="space-y-2.5">
        {filteredTopics.map((topic) => {
          const hasLiked = currentUser && topic.likedBy.includes(currentUser.id);

          return (
            <div
              key={topic.id}
              className="p-4 sm:p-5 rounded-2xl cave-panel hover:border-amber-500/30 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
            >
              <div className="flex items-start space-x-3.5 flex-1 min-w-0">
                <img
                  src={topic.author.avatar}
                  alt={topic.author.name}
                  className="w-9 h-9 rounded-xl object-cover bg-stone-800 shrink-0 mt-0.5"
                />

                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {topic.isPinned && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded cave-badge flex items-center gap-1">
                        <Pin className="w-3 h-3" /> Sabitli
                      </span>
                    )}
                    {topic.isAnnouncement && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20 flex items-center gap-1">
                        <Megaphone className="w-3 h-3" /> Kulüp Duyurusu
                      </span>
                    )}
                    {topic.images && topic.images.length > 0 && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#251e18] text-[#dba076] border border-[#dba076]/30 flex items-center gap-1">
                        <ImageIcon className="w-3 h-3" /> {topic.images.length} Fotoğraflı
                      </span>
                    )}
                    <span className="text-xs font-bold text-stone-200">
                      {topic.author.name}
                    </span>
                    <span className="text-[10px] text-stone-500">
                      • {new Date(topic.createdAt).toLocaleDateString('tr-TR')}
                    </span>
                  </div>

                  <Link
                    href={`/forum/${topic.id}`}
                    className="text-sm font-bold text-white group-hover:text-amber-400 transition block truncate"
                  >
                    {topic.title}
                  </Link>

                  <p className="text-xs text-stone-400 line-clamp-1">
                    {topic.content}
                  </p>
                </div>

                {topic.images && topic.images.length > 0 && (
                  <Link
                    href={`/forum/${topic.id}`}
                    className="hidden sm:block shrink-0 w-16 h-16 rounded-xl overflow-hidden border border-[#262b3a] group-hover:border-[#dba076]/40 transition relative"
                  >
                    <img
                      src={topic.images[0]}
                      alt={topic.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                    {topic.images.length > 1 && (
                      <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-[9px] font-mono text-white/90">
                        +{topic.images.length - 1}
                      </span>
                    )}
                  </Link>
                )}
              </div>

              {/* Stats & Actions */}
              <div className="flex items-center space-x-3 text-xs text-stone-500 shrink-0 self-end sm:self-center">
                <button
                  onClick={() => {
                    if (!currentUser) setAuthModalOpen(true);
                    else likeTopic(topic.id);
                  }}
                  className={`flex items-center gap-1 px-2 py-1 rounded-md transition ${
                    hasLiked
                      ? 'text-rose-400 font-bold bg-rose-500/10'
                      : 'hover:text-stone-300'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-current' : ''}`} />
                  <span>{topic.likesCount}</span>
                </button>

                <Link
                  href={`/forum/${topic.id}`}
                  className="flex items-center gap-1 px-2 py-1 rounded-md hover:text-stone-300 transition"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-stone-400" />
                  <span>{topic.commentsCount}</span>
                </Link>

                {/* Admin Actions: Edit & Delete */}
                {isAdmin && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setEditingTopic(topic);
                        setNewTopicModalOpen(true);
                      }}
                      title="Konuyu Düzenle (Yönetici)"
                      className="p-1 text-stone-400 hover:text-amber-400 hover:bg-stone-800 rounded transition"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => handleDeleteTopic(e, topic.id, topic.title)}
                      title="Konuyu Sil (Yönetici)"
                      className="p-1 text-stone-600 hover:text-rose-400 hover:bg-rose-500/10 rounded transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <NewTopicModal
        isOpen={newTopicModalOpen}
        onClose={() => {
          setNewTopicModalOpen(false);
          setEditingTopic(null);
        }}
        defaultCategoryId={selectedCategory !== 'all' ? selectedCategory : undefined}
        topicToEdit={editingTopic}
      />
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>
  );
}
