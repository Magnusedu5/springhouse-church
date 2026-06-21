'use client';
import Image from 'next/image';
import useGalleryPhotos from '@/lib/useGalleryPhotos';

const FALLBACK = 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80';

export default function WhoWeAreImage() {
  const { primary } = useGalleryPhotos('who_we_are_image');
  const src = primary?.image ?? FALLBACK;

  return (
    <Image
      src={src}
      alt="The SpringHouse Church congregation in worship"
      fill
      className="object-cover"
      sizes="(max-width: 1024px) 100vw, 50vw"
    />
  );
}
