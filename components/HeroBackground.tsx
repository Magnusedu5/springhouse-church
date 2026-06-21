'use client';
import Image from 'next/image';
import { useEffect, useMemo, useRef } from 'react';
import useGalleryPhotos from '@/lib/useGalleryPhotos';
import type { GalleryDestination } from '@/lib/types';

interface HeroBackgroundProps {
  destination: GalleryDestination;
  fallbackSrc?: string;
  className?: string;
}

/** Picks a random photo (or the first video) from the given hero destination; falls back to a fixed placeholder. */
export default function HeroBackground({ destination, fallbackSrc, className = 'object-cover' }: HeroBackgroundProps) {
  const { photos } = useGalleryPhotos(destination);

  const selected = useMemo(() => {
    if (photos.length === 0) return null;
    // Prefer a video if one exists — videos are intentional hero choices
    const video = photos.find((p) => p.media_type === 'video');
    if (video) return video;
    return photos[Math.floor(Math.random() * photos.length)];
  }, [photos]);

  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    // React's autoPlay attribute is unreliable for dynamically-mounted video elements.
    // Calling .play() imperatively ensures playback after SPA navigation.
    videoRef.current?.play().catch(() => {});
  }, [selected]);

  if (selected?.media_type === 'video') {
    // Insert Cloudinary transformations for a compressed H.264 MP4 — avoids on-the-fly
    // transcoding of the raw .mov on first request and reduces file size for faster buffering.
    const mp4Src = selected.image
      .replace('/upload/', '/upload/q_auto,vc_h264/')
      .replace(/\.\w+$/, '.mp4');
    return (
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
        aria-hidden="true"
      >
        <source src={mp4Src} type="video/mp4" />
      </video>
    );
  }

  const src = selected?.image ?? fallbackSrc;
  if (!src) return null;
  return <Image src={src} alt="" fill priority className={className} sizes="100vw" />;
}
