'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, X, Image as ImageIcon } from 'lucide-react';

interface ImageCarouselProps {
  images?: string[];
  alt?: string;
  className?: string;
  aspectRatio?: string;
}

export default function ImageCarousel({
  images,
  alt = 'Görsel',
  className = '',
  aspectRatio = 'aspect-video',
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);

  if (!images || images.length === 0) return null;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      <div className={`relative overflow-hidden rounded-2xl bg-[#0c0e14] border border-[#202534] group select-none ${className}`}>
        {/* Main Image Container */}
        <div className={`relative w-full ${aspectRatio} overflow-hidden flex items-center justify-center bg-black/40`}>
          <img
            src={images[currentIndex]}
            alt={`${alt} - ${currentIndex + 1}`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />

          {/* Fullscreen view trigger */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setFullscreenOpen(true);
            }}
            title="Tam Ekran Görüntüle"
            className="absolute top-3 right-3 p-2 rounded-xl bg-black/60 hover:bg-black/80 text-white/90 hover:text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          {/* Slide Indicator Badge */}
          {images.length > 1 && (
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/65 text-white/90 text-[10px] font-mono backdrop-blur-md border border-white/10 flex items-center gap-1">
              <ImageIcon className="w-3 h-3 text-[#dba076]" />
              <span>{currentIndex + 1} / {images.length}</span>
            </div>
          )}
        </div>

        {/* Carousel Arrow Controls (Only if > 1 image) */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              title="Önceki Fotoğraf"
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/10 opacity-80 hover:opacity-100 transition backdrop-blur-md"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              title="Sonraki Fotoğraf"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/10 opacity-80 hover:opacity-100 transition backdrop-blur-md"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Bottom Dots Indicator */}
            <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 p-1 rounded-full bg-black/50 backdrop-blur-sm">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setCurrentIndex(idx);
                  }}
                  className={`transition-all rounded-full ${
                    currentIndex === idx
                      ? 'w-5 h-1.5 bg-[#dba076]'
                      : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Fullscreen Modal View */}
      {fullscreenOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md"
          onClick={() => setFullscreenOpen(false)}
        >
          <button
            type="button"
            onClick={() => setFullscreenOpen(false)}
            className="absolute top-5 right-5 p-2 rounded-full bg-stone-900 text-stone-200 hover:text-white border border-stone-800"
          >
            <X className="w-6 h-6" />
          </button>

          <div
            className="relative max-w-5xl max-h-[85vh] w-full flex items-center justify-center select-none"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[currentIndex]}
              alt={`${alt} - Tam Ekran`}
              className="max-h-[80vh] max-w-full object-contain rounded-xl shadow-2xl"
            />

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute left-2 p-3 rounded-full bg-black/70 hover:bg-black text-white border border-white/20 transition"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-2 p-3 rounded-full bg-black/70 hover:bg-black text-white border border-white/20 transition"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/70 text-white text-xs font-mono border border-white/10">
                  {currentIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
