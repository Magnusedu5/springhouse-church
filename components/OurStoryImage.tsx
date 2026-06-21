'use client';
import Image from 'next/image';
import useGalleryPhotos from '@/lib/useGalleryPhotos';

const FALLBACK = 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=800&q=80';

export default function OurStoryImage() {
  const { primary } = useGalleryPhotos('our_story_image');
  const src = primary?.image ?? FALLBACK;

  return (
    <Image
      src={src}
      alt="The SpringHouse Church community gathered together"
      fill
      className="object-cover"
      sizes="(max-width: 1024px) 100vw, 50vw"
    />
  );
}
