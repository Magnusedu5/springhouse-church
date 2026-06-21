'use client';
import Image from 'next/image';
import { useMemo } from 'react';
import useGalleryPhotos from '@/lib/useGalleryPhotos';

interface EventThumbnailProps {
  image: string;
  alt: string;
  eventId: number;
}

/** Shows the event's own image, or — if none was uploaded — a random photo from this event's linked gallery. */
export default function EventThumbnail({ image, alt, eventId }: EventThumbnailProps) {
  const { photos } = useGalleryPhotos('event', { eventId });

  const src = useMemo(() => {
    if (image) return image;
    if (photos.length === 0) return null;
    return photos[Math.floor(Math.random() * photos.length)].image;
  }, [image, photos]);

  if (!src) return null;

  return (
    <div className="relative h-40 w-full overflow-hidden">
      <Image src={src} alt={alt} fill className="object-cover" sizes="(max-width: 640px) 100vw, 50vw" />
    </div>
  );
}
