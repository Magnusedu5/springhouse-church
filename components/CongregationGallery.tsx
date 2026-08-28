'use client';
import { useState } from 'react';
import Image from 'next/image';
import { AnimatePresence } from 'framer-motion';
import { LayoutGrid, Layers } from 'lucide-react';
import useGalleryPhotos from '@/lib/useGalleryPhotos';
import FadeIn from './FadeIn';
import { CascadeGroup, CascadeItem } from '@/components/motion';
import PhotoStack from './PhotoStack';
import PhotoLightbox from './PhotoLightbox';

type View = 'stack' | 'grid';

export default function CongregationGallery() {
  const { photos } = useGalleryPhotos('congregation');
  const [view, setView] = useState<View>('stack');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (photos.length === 0) return null;

  return (
    <section className="bg-white py-20 px-4 sm:px-6 lg:px-8" aria-label="Our community">
      <div className="max-w-7xl mx-auto">
        <FadeIn>
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-gold mb-3">
              Together in Faith
            </p>
            <h2 className="font-display text-4xl sm:text-5xl font-semibold text-brand-blue">
              Our Community
            </h2>
          </div>
        </FadeIn>

        {view === 'stack' ? (
          <FadeIn>
            <div className="flex flex-col items-center">
              <PhotoStack photos={photos} onOpen={() => setActiveIndex(0)} />
              {photos.length > 1 && (
                <button
                  type="button"
                  onClick={() => setView('grid')}
                  className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-brand-blue border border-brand-blue/30 rounded-full px-5 py-2.5 hover:bg-brand-blue/5 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue"
                >
                  <LayoutGrid className="w-4 h-4" aria-hidden="true" />
                  See All Photos in a Grid
                </button>
              )}
            </div>
          </FadeIn>
        ) : (
          <>
            <div className="flex justify-center mb-8">
              <button
                type="button"
                onClick={() => setView('stack')}
                className="inline-flex items-center gap-2 text-sm font-medium text-brand-blue border border-brand-blue/30 rounded-full px-5 py-2.5 hover:bg-brand-blue/5 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue"
              >
                <Layers className="w-4 h-4" aria-hidden="true" />
                Back to Stack View
              </button>
            </div>
            <CascadeGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {photos.map((photo, i) => (
                <CascadeItem key={photo.id}>
                  <button
                    type="button"
                    onClick={() => setActiveIndex(i)}
                    aria-label={`View photo: ${photo.title || 'Community photo'}`}
                    className="group relative h-64 w-full rounded-2xl overflow-hidden shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  >
                    <Image
                      src={photo.image}
                      alt={photo.title || 'Community photo'}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </button>
                </CascadeItem>
              ))}
            </CascadeGroup>
          </>
        )}
      </div>

      <AnimatePresence>
        {activeIndex !== null && (
          <PhotoLightbox
            photos={photos}
            index={activeIndex}
            onClose={() => setActiveIndex(null)}
            onNavigate={setActiveIndex}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
