import { Suspense } from 'react';
import SermonsContent from '@/components/SermonsContent';
import HeroBackground from '@/components/HeroBackground';

function HeroSkeleton() {
  return <div className="animate-pulse bg-brand-cream h-[320px]" />;
}

export default function SermonsPage() {
  return (
    <main>
      {/* ── Page Hero ── */}
      <section
        className="relative flex flex-col items-center justify-center text-center px-4 py-24 bg-brand-blue overflow-hidden"
        style={{ minHeight: '40vh' }}
        aria-label="Sermons page hero"
      >
        <HeroBackground destination="hero_sermons" fallbackSrc="https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=1920&q=80" />
        <div className="absolute inset-0 bg-brand-blue/80" aria-hidden="true" />
        <div className="relative z-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-gold mb-4">
            The Word
          </p>
          <h1 className="font-display text-5xl sm:text-6xl font-semibold text-white mb-4 leading-tight">
            Messages
          </h1>
          <p className="text-white/70 text-lg sm:text-xl max-w-md">
            Nourishing your faith, wherever you are.
          </p>
        </div>
      </section>

      {/* ── Content: featured + filter bar + grid + pagination ── */}
      {/*
        SermonsContent uses useSearchParams which requires Suspense in Next.js 14 App Router.
        HeroSkeleton is shown only while the JS bundle loads on first paint.
      */}
      <Suspense fallback={<HeroSkeleton />}>
        <SermonsContent />
      </Suspense>
    </main>
  );
}
