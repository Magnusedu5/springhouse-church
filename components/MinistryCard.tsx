'use client';
import type { Ministry, GalleryDestination } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import useGalleryPhotos from '@/lib/useGalleryPhotos';

interface Props {
  ministry: Ministry;
  galleryDestination?: GalleryDestination;
}

export default function MinistryCard({ ministry, galleryDestination }: Props) {
  const { primary } = useGalleryPhotos(galleryDestination ?? 'ministry_children');
  const imageSrc = (galleryDestination ? primary?.image : undefined) || ministry.image || undefined;

  return (
    <Link
      href={`/ministries/${ministry.slug}`}
      className="group relative flex h-80 rounded-2xl overflow-hidden focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-brand-blue"
      aria-label={`${ministry.name} — ${ministry.tagline}. Learn more.`}
    >
      {/* Background image */}
      {imageSrc ? (
        <Image
          src={imageSrc}
          alt=""
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      ) : (
        <div className="absolute inset-0 bg-brand-blue/60" />
      )}

      {/* Gradient overlay — darkens on hover */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10 group-hover:from-black/95 group-hover:via-black/55 transition-colors duration-300"
        aria-hidden="true"
      />

      {/* Content pinned to bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <h3 className="font-display text-2xl sm:text-3xl font-semibold text-white mb-1.5 leading-snug">
          {ministry.name}
        </h3>
        <p className="text-white/70 text-sm mb-4 leading-relaxed line-clamp-2">
          {ministry.tagline}
        </p>
        <span className="inline-flex items-center text-sm font-semibold text-white group-hover:text-brand-gold transition-colors">
          Learn More →
        </span>
      </div>
    </Link>
  );
}
