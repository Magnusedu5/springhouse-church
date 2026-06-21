'use client';
import Image from 'next/image';
import useGalleryPhotos from '@/lib/useGalleryPhotos';

export default function PastorPhoto() {
  const { primary } = useGalleryPhotos('pastor_photo');

  if (primary?.image) {
    return (
      <Image
        src={primary.image}
        alt="Dr Austin Mboso, Senior Pastor"
        fill
        className="object-cover"
      />
    );
  }

  return (
    <span className="font-display text-4xl font-semibold text-brand-gold select-none">PJL</span>
  );
}
