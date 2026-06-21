'use client';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import useGalleryPhotos from '@/lib/useGalleryPhotos';
import type { GalleryDestination } from '@/lib/types';

interface FadedBackgroundPhotoProps {
  destination: GalleryDestination;
  opacity?: number;
}

/** A faint, randomly-picked gallery photo behind section content — fades in slowly, never intercepts clicks. */
export default function FadedBackgroundPhoto({ destination, opacity = 0.08 }: FadedBackgroundPhotoProps) {
  const { photos } = useGalleryPhotos(destination);
  const [visible, setVisible] = useState(false);

  const src = useMemo(() => {
    if (photos.length === 0) return null;
    return photos[Math.floor(Math.random() * photos.length)].image;
  }, [photos]);

  useEffect(() => {
    if (!src) return;
    const timer = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timer);
  }, [src]);

  if (!src) return null;

  return (
    <Image
      src={src}
      alt=""
      fill
      aria-hidden="true"
      style={{ opacity: visible ? opacity : 0 }}
      className="absolute inset-0 z-0 object-cover pointer-events-none transition-opacity duration-[1500ms] ease-out"
    />
  );
}
