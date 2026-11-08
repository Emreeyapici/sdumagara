'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  ArrowLeft,
  Heart,
  MessageSquare,
  Share2,
  Send,
  Pin,
  Megaphone,
  Trash2,
  Edit3,
} from 'lucide-react';
import AuthModal from '@/components/AuthModal';
import NewTopicModal from '@/components/NewTopicModal';
import ImageCarousel from '@/components/ImageCarousel';

export default function TopicDetailPage() {
  const params = useParams();
  const router = useRouter();
  const topicId = params?.id as string;
  const { currentUser, isAdmin, topics, likeTopic, deleteTopic, addComment, deleteComment, likeComment } = useApp();

  const [commentContent, setCommentContent] = useState('');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const topic = topics.find((t) => t.id === topicId);

  if (!topic) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Konu bulunamadı veya silinmiş.</h2>
        <Link
          href="/forum"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs"
        >
          <ArrowLeft className="w-4 h-4" /> Foruma Dön
        </Link>
      </div>
    );
  }

  const hasLikedTopic = currentUser && topic.likedBy.includes(currentUser.id);
  const canDeleteTopic = isAdmin;

  const handleDeleteTopic = () => {
    if (!canDeleteTopic) return;
    if (confirm(`"${topic.title}" konusunu tamamen kaldırmak istediğinize emin misiniz?`)) {
      deleteTopic(topic.id);
      router.push('/forum');
    }
  };

  const handleDeleteComment = (commentId: string) => {
    if (confirm('Bu yorumu silmek istediğinize emin misiniz?')) {
      deleteComment(topic.id, commentId);
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }
    if (!commentContent.trim()) return;

    addComment(topic.id, commentContent.trim());
    setCommentContent('');
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 w-full space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/forum"
          className="inline-flex items-center gap-1.5 text-xs text-stone-400 hover:text-white transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Foruma Dön
        </Link>

        {isAdmin && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setEditModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium border border-stone-700 transition flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5 text-amber-400" /> Konuyu Düzenle
            </button>
            <button
              onClick={handleDeleteTopic}
              className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-medium border border-rose-500/20 transition flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" /> Konuyu Sil
            </button>
          </div>
        )}
      </div>

      {/* Main Post */}
      <div className="rounded-2xl bg-[#13161c] border border-stone-800/80 p-6 sm:p-8 space-y-6">
        <div className="space-y-3 border-b border-stone-800/80 pb-5">
          <div className="flex flex-wrap items-center gap-2">
            {topic.isPinned && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 flex items-center gap-1">
                <Pin className="w-3 h-3" /> Sabitli
              </span>
            )}
            {topic.isAnnouncement && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 flex items-center gap-1">
                <Megaphone className="w-3 h-3" /> Duyuru
              </span>
            )}
            <span className="text-xs text-stone-500">
              {new Date(topic.createdAt).toLocaleString('tr-TR')}
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-white leading-snug">
            {topic.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="flex items-center space-x-3">
              <img
                src={topic.author.avatar}
                alt={topic.author.name}
                className="w-10 h-10 rounded-lg object-cover bg-stone-800"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">{topic.author.name}</span>
                  <span className="text-[10px] text-stone-400 uppercase font-mono">
                    {topic.author.role}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-stone-500">
                  <span>{topic.author.cavingCount} Faaliyet</span>
                  <span>•</span>
                  <span className="text-rose-400 font-medium">{topic.author.bloodType}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleShare}
                className="px-3 py-1.5 rounded-lg bg-[#181c24] hover:bg-[#1e232e] text-stone-300 text-xs transition flex items-center gap-1"
              >
                <Share2 className="w-3 h-3" /> {copied ? 'Kopyalandı' : 'Paylaş'}
              </button>

              <button
                onClick={() => {
                  if (!currentUser) setAuthModalOpen(true);
                  else likeTopic(topic.id);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                  hasLikedTopic
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : 'bg-[#181c24] text-stone-300 hover:text-white'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${hasLikedTopic ? 'fill-current' : ''}`} />
                <span>{topic.likesCount}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Photos Carousel if present */}
        {topic.images && topic.images.length > 0 && (
          <div className="pt-2">
            <ImageCarousel images={topic.images} alt={topic.title} />
          </div>
        )}

        {/* Content */}
        <div className="text-sm text-stone-300 leading-relaxed space-y-4 whitespace-pre-line font-normal">
          {topic.content}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 pt-4 border-t border-stone-800/80">
          {topic.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-2 py-0.5 rounded bg-[#181c24] text-stone-400"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* COMMENTS */}
      <div className="space-y-4 pt-2">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-amber-400" />
          Yanıtlar ({topic.comments?.length || 0})
        </h2>

        {/* New Comment */}
        <form onSubmit={handleCommentSubmit} className="p-4 rounded-xl bg-[#13161c] border border-stone-800/80 space-y-3">
          <textarea
            rows={3}
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            placeholder={
              currentUser
                ? `${currentUser.name} olarak yanıt yazın...`
                : 'Yorum yapabilmek için lütfen giriş yapın veya profilinizi oluşturun.'
            }
            className="w-full px-3 py-2 bg-[#0d0f12] border border-stone-800 rounded-lg text-xs sm:text-sm text-white placeholder-stone-500 focus:outline-none focus:border-amber-500"
          />

          <div className="flex justify-between items-center">
            {!currentUser && (
              <span className="text-[11px] text-stone-500">
                Giriş yapmadan yorum gönderemezsiniz.
              </span>
            )}
            <div className="ml-auto">
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs transition flex items-center gap-1.5"
              >
                <Send className="w-3 h-3" /> Yanıtla
              </button>
            </div>
          </div>
        </form>

        {/* Comments list */}
        <div className="space-y-2.5">
          {topic.comments && topic.comments.map((comment) => {
            const hasLiked = currentUser && comment.likedBy?.includes(currentUser.id);
            const canDeleteComment = isAdmin || (currentUser && currentUser.id === comment.author.id);

            return (
              <div
                key={comment.id}
                className="p-4 rounded-xl bg-[#13161c] border border-stone-800/80 space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <img
                      src={comment.author.avatar}
                      alt={comment.author.name}
                      className="w-6 h-6 rounded-md object-cover bg-stone-800"
                    />
                    <span className="text-xs font-semibold text-white">{comment.author.name}</span>
                    <span className="text-[10px] text-stone-500">
                      • {new Date(comment.createdAt).toLocaleDateString('tr-TR')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        if (!currentUser) setAuthModalOpen(true);
                        else likeComment(topic.id, comment.id);
                      }}
                      className={`flex items-center gap-1 text-xs ${
                        hasLiked ? 'text-rose-400 font-bold' : 'text-stone-500 hover:text-stone-300'
                      }`}
                    >
                      <Heart className={`w-3 h-3 ${hasLiked ? 'fill-current' : ''}`} />
                      <span>{comment.likes}</span>
                    </button>

                    {canDeleteComment && (
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        title="Yorumu Sil"
                        className="p-1 text-stone-600 hover:text-rose-400 rounded transition"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed pl-8">
                  {comment.content}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <NewTopicModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        topicToEdit={topic}
      />
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>
  );
}
