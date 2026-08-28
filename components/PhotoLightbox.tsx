'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, type PanInfo } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import usePrefersReducedMotion from '@/lib/usePrefersReducedMotion';
import type { ChurchPhoto } from '@/lib/types';

interface PhotoLightboxProps {
  photos: ChurchPhoto[];
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

const SWIPE_THRESHOLD = 80;

export default function PhotoLightbox({ photos, index, onClose, onNavigate }: PhotoLightboxProps) {
  const reduced = usePrefersReducedMotion();
  const [direction, setDirection] = useState(0);
  const photo = photos[index];

  function goTo(newIndex: number, dir: number) {
    setDirection(dir);
    onNavigate((newIndex + photos.length) % photos.length);
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') goTo(index - 1, -1);
      if (e.key === 'ArrowRight') goTo(index + 1, 1);
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, photos.length]);

  function handleDragEnd(_e: unknown, info: PanInfo) {
    if (info.offset.x < -SWIPE_THRESHOLD) goTo(index + 1, 1);
    else if (info.offset.x > SWIPE_THRESHOLD) goTo(index - 1, -1);
  }

  if (!photo) return null;

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={photo.title || 'Photo viewer'}
      initial={reduced ? undefined : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={reduced ? undefined : { opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute top-5 right-5 z-10 text-white/70 hover:text-white p-2"
      >
        <X className="w-7 h-7" />
      </button>

      {photos.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); goTo(index - 1, -1); }}
            aria-label="Previous photo"
            className="absolute left-2 sm:left-5 z-10 text-white/70 hover:text-brand-gold p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <ChevronLeft className="w-8 h-8 sm:w-9 sm:h-9" />
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); goTo(index + 1, 1); }}
            aria-label="Next photo"
            className="absolute right-2 sm:right-5 z-10 text-white/70 hover:text-brand-gold p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <ChevronRight className="w-8 h-8 sm:w-9 sm:h-9" />
          </button>
        </>
      )}

      <div
        className="relative w-full max-w-4xl h-[70vh] sm:h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={photo.id}
            custom={direction}
            initial={reduced ? undefined : { opacity: 0, x: direction * 60, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={reduced ? undefined : { opacity: 0, x: direction * -60, scale: 0.97 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            drag={photos.length > 1 ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.6}
            onDragEnd={handleDragEnd}
            className="absolute inset-0"
          >
            <Image
              src={photo.image}
              alt={photo.title || 'Community photo'}
              fill
              className="object-contain pointer-events-none"
              sizes="100vw"
              priority
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {(photo.title || photos.length > 1) && (
        <div
          className="absolute bottom-5 left-0 right-0 flex flex-col items-center gap-1 pointer-events-none"
          onClick={(e) => e.stopPropagation()}
        >
          {photo.title && (
            <p className="text-white/90 font-display text-sm sm:text-base italic px-4 text-center">{photo.title}</p>
          )}
          {photos.length > 1 && (
            <p className="text-brand-gold text-xs font-semibold tracking-widest">
              {index + 1} / {photos.length}
            </p>
          )}
        </div>
      )}
    </motion.div>
  );
}
