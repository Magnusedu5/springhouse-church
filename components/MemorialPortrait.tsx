'use client';
import Image from 'next/image';
import useGalleryPhotos from '@/lib/useGalleryPhotos';

const FALLBACK_SRC = '/memorial/pastor-eve-portrait.png';

/** Her portrait — an admin-uploaded `memorial_portrait` photo takes precedence over the built-in one. */
export default function MemorialPortrait() {
  const { primary } = useGalleryPhotos('memorial_portrait');
  const src = primary?.image ?? FALLBACK_SRC;

  return (
    <div className="relative mx-auto w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden ring-4 ring-brand-gold/60 shadow-2xl bg-brand-blue/40">
      <Image
        src={src}
        alt="Associate Professor Ofonime Eve Mboso"
        fill
        priority
        className="object-cover object-center"
        sizes="(max-width: 640px) 192px, 224px"
      />
    </div>
  );
}
