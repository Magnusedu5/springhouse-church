'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import useGalleryPhotos from '@/lib/useGalleryPhotos';

interface RecordPhotoGalleryProps {
  destination: 'event' | 'sermon';
  eventId?: number;
  sermonId?: number;
  heading?: string;
}

/** Photo gallery linked to a specific event or sermon record — renders nothing if no photos exist. */
export default function RecordPhotoGallery({ destination, eventId, sermonId, heading = 'Photos' }: RecordPhotoGalleryProps) {
  const { photos } = useGalleryPhotos(destination, { eventId, sermonId });
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
    <div className="mt-10 pt-8 border-t border-gray-100">
      <h3 className="font-display text-xl font-semibold text-brand-blue mb-5">{heading}</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {photos.map((photo, i) => (
          <button
            key={photo.id}
            type="button"
            onClick={() => setActiveIndex(i)}
            aria-label={`View photo: ${photo.title || heading}`}
            className="group relative h-32 sm:h-36 rounded-xl overflow-hidden focus:outline-none focus:ring-2 focus:ring-brand-blue"
          >
            <Image
              src={photo.image}
              alt={photo.title || heading}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-[1.05]"
              sizes="(max-width: 640px) 50vw, 33vw"
            />
          </button>
        ))}
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
              alt={photos[activeIndex].title || heading}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
        </div>
      )}
    </div>
  );
}
