'use client';
import useGalleryPhotos from '@/lib/useGalleryPhotos';

interface SiteLogoProps {
  variant?: 'navbar' | 'footer';
  isDark?: boolean;
}

export default function SiteLogo({ variant = 'navbar', isDark = false }: SiteLogoProps) {
  const { primary } = useGalleryPhotos('logo');

  if (variant === 'footer') {
    return (
      <p className="font-display text-3xl font-semibold text-white mb-2 leading-snug">
        The SpringHouse Church
      </p>
    );
  }

  if (primary?.image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={primary.image}
        alt="The SpringHouse Church"
        className="h-full w-auto max-w-[280px] object-contain"
        // multiply removes white bg on cream; on dark sections skip it so the logo stays visible
        style={isDark ? undefined : { mixBlendMode: 'multiply' }}
      />
    );
  }

  return (
    <span className="font-display text-xl font-semibold text-brand-blue leading-tight">
      The SpringHouse Church
    </span>
  );
}
