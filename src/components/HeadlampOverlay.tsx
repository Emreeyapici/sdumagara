'use client';

import React, { useEffect, useState } from 'react';
import { useApp } from '@/context/AppContext';

export default function HeadlampOverlay() {
  const { headlampMode } = useApp();
  const [pos, setPos] = useState({ x: -1000, y: -1000 });

  useEffect(() => {
    if (!headlampMode) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [headlampMode]);

  if (!headlampMode) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-50 transition-opacity duration-300"
      style={{
        background: `radial-gradient(circle 260px at ${pos.x}px ${pos.y}px, rgba(250, 245, 235, 0.12) 0%, rgba(200, 125, 74, 0.04) 40%, rgba(10, 12, 16, 0.95) 100%)`,
      }}
    >
      <div
        className="absolute w-8 h-8 rounded-full bg-[#dfb28e]/20 blur-md pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
        style={{ left: `${pos.x}px`, top: `${pos.y}px` }}
      />
    </div>
  );
}
