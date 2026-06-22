import Image from 'next/image';

interface SiteLogoProps {
  variant?: 'navbar' | 'footer';
  isDark?: boolean;
}

export default function SiteLogo({ variant = 'navbar', isDark = false }: SiteLogoProps) {
  if (variant === 'footer') {
    return (
      <p className="font-display text-3xl font-semibold text-white mb-2 leading-snug">
        The SpringHouse Church
      </p>
    );
  }

  return (
    <Image
      src="/logo.png"
      alt="The SpringHouse Church"
      width={280}
      height={80}
      priority
      className="h-full w-auto max-w-[280px] object-contain"
      style={isDark ? undefined : { mixBlendMode: 'multiply' }}
    />
  );
}
