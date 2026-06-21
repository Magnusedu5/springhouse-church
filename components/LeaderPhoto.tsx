'use client';
import Image from 'next/image';
import useGalleryPhotos from '@/lib/useGalleryPhotos';
import type { GalleryDestination } from '@/lib/types';

interface LeaderPhotoProps {
  destination: GalleryDestination;
  name: string;
  initials: string;
  bg: string;
}

export default function LeaderPhoto({ destination, name, initials, bg }: LeaderPhotoProps) {
  const { primary } = useGalleryPhotos(destination);

  if (primary?.image) {
    return (
      <div className={`mx-auto mb-4 w-32 h-32 rounded-full overflow-hidden ring-2 ring-brand-gold/30 relative`}>
        <Image
          src={primary.image}
          alt={name}
          fill
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div className={`mx-auto mb-4 w-32 h-32 rounded-full ${bg} flex items-center justify-center ring-2 ring-brand-gold/30`}>
      <span className="font-display text-2xl font-semibold text-brand-blue/40 select-none">
        {initials}
      </span>
    </div>
  );
}
