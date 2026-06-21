'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import useGalleryPhotos from '@/lib/useGalleryPhotos';
import type { GalleryDestination } from '@/lib/types';
import FadeIn from './FadeIn';

interface MinistryGalleryProps {
  destination: GalleryDestination;
  ministryName: string;
}

export default function MinistryGallery({ destination, ministryName }: MinistryGalleryProps) {
  const { photos } = useGalleryPhotos(destination);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    if (activeIndex === null) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setActiveIndex(null);
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeIndex]);

  if (photos.length === 0) return null;

  return (
    <section className="bg-brand-cream py-20 px-4 sm:px-6 lg:px-8" aria-label={`${ministryName} photo gallery`}>
      <div className="max-w-7xl mx-auto">
        <FadeIn>
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-gold mb-3">Gallery</p>
            <h2 className="font-display text-4xl font-semibold text-brand-blue">{ministryName} in Action</h2>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((photo, i) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => setActiveIndex(i)}
              aria-label={`View photo: ${photo.title || ministryName}`}
              className="group relative h-64 rounded-2xl overflow-hidden shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
            >
              <Image
                src={photo.image}
                alt={photo.title || ministryName}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </button>
          ))}
        </div>
      </div>

      {activeIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={photos[activeIndex].title || 'Photo viewer'}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setActiveIndex(null)}
        >
          <button
            type="button"
            onClick={() => setActiveIndex(null)}
            aria-label="Close"
            className="absolute top-5 right-5 text-white/70 hover:text-white p-2"
          >
            <X className="w-7 h-7" />
          </button>
          <div className="relative w-full max-w-4xl h-[80vh]" onClick={(e) => e.stopPropagation()}>
            <Image
              src={photos[activeIndex].image}
              alt={photos[activeIndex].title || ministryName}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
        </div>
      )}
    </section>
  );
}
