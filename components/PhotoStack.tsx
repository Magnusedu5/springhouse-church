'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Images } from 'lucide-react';
import usePrefersReducedMotion from '@/lib/usePrefersReducedMotion';
import type { ChurchPhoto } from '@/lib/types';

interface PhotoStackProps {
  photos: ChurchPhoto[];
  onOpen: () => void;
}

// Rest-state and hover-state transforms for each layer, front card last (highest z-index).
const LAYERS = [
  { rotate: -10, x: -34, y: 10 },
  { rotate: -5, x: -17, y: 4 },
  { rotate: 6, x: 20, y: 6 },
  { rotate: 11, x: 38, y: 12 },
  { rotate: 0, x: 0, y: 0 },
];

export default function PhotoStack({ photos, onOpen }: PhotoStackProps) {
  const reduced = usePrefersReducedMotion();
  const layers = LAYERS.slice(-Math.min(photos.length, LAYERS.length));
  const shown = layers.map((layer, i) => ({
    layer,
    photo: photos[layers.length - 1 - i],
  }));

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Open community photo gallery — ${photos.length} photo${photos.length === 1 ? '' : 's'}`}
      className="group relative w-full flex flex-col items-center focus:outline-none"
    >
      <div className="relative h-64 sm:h-80 lg:h-96 w-full max-w-md flex items-center justify-center">
        {shown.map(({ layer, photo }, i) => {
          const isFront = i === shown.length - 1;
          return (
            <motion.div
              key={photo.id}
              initial={false}
              animate={reduced ? undefined : { rotate: layer.rotate, x: layer.x, y: layer.y }}
              whileHover={
                reduced || !isFront
                  ? undefined
                  : { scale: 1.02 }
              }
              whileFocus={reduced || !isFront ? undefined : { scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 260, damping: 22 }}
              className="absolute w-56 h-56 sm:w-64 sm:h-64 lg:w-72 lg:h-72 rounded-2xl overflow-hidden shadow-lg ring-2 ring-white"
              style={{
                rotate: layer.rotate,
                x: layer.x,
                y: layer.y,
                zIndex: i,
              }}
            >
              <Image
                src={photo.image}
                alt={photo.title || 'Community photo'}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 224px, (max-width: 1024px) 256px, 288px"
              />
              {isFront && (
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2 text-white text-sm font-semibold bg-brand-blue/80 px-4 py-2 rounded-full">
                    <Images className="w-4 h-4" />
                    View Gallery
                  </span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="mt-6 flex items-center gap-2 text-brand-gold">
        <Images className="w-4 h-4" aria-hidden="true" />
        <span className="text-sm font-semibold uppercase tracking-widest">
          {photos.length} Photo{photos.length === 1 ? '' : 's'} — Tap to View
        </span>
      </div>
    </button>
  );
}
