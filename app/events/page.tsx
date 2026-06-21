import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import EventsPageContent from '@/components/EventsPageContent';
import HeroBackground from '@/components/HeroBackground';

export const metadata: Metadata = {
  title: 'Events & Gatherings — The SpringHouse Church',
  description:
    'Upcoming services, conferences, outreach events and gatherings at The SpringHouse Church, Calabar — and online for our global family.',
  openGraph: {
    title: 'Events & Gatherings — The SpringHouse Church',
    description:
      'Upcoming services, conferences, outreach events and gatherings at The SpringHouse Church, Calabar — and online for our global family.',
  },
};

export default function EventsPage() {
  return (
    <main>
      {/* ── Hero ── */}
      <section
        className="relative flex flex-col items-center justify-center text-center px-4 bg-brand-blue overflow-hidden"
        style={{ minHeight: '40vh' }}
        aria-label="Events page hero"
      >
        <HeroBackground destination="hero_events" fallbackSrc="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1920&q=80" />
        <div className="absolute inset-0 bg-brand-blue/80" aria-hidden="true" />
        {/* Cross pattern watermark */}
        <div className="absolute inset-0 bg-cross-pattern opacity-10" aria-hidden="true" />
        <div className="relative z-10 max-w-2xl mx-auto py-20">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-gold mb-4">
            Come as you are
          </p>
          <h1 className="font-display text-5xl sm:text-6xl font-semibold text-white mb-4 leading-tight">
            Events &amp; Gatherings
          </h1>
          <p className="text-white/70 text-lg sm:text-xl max-w-md mx-auto">
            In person in Calabar. Online across Nigeria and the world.
          </p>
        </div>
      </section>

      {/* ── Events listing (client component with list/calendar toggle) ── */}
      <Suspense
        fallback={
          <div className="py-16 px-4 max-w-7xl mx-auto">
            <div className="space-y-4 animate-pulse">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-40 bg-gray-100 rounded-2xl" />
              ))}
            </div>
          </div>
        }
      >
        <EventsPageContent />
      </Suspense>

      {/* ── New member invitation strip ── */}
      <section className="bg-brand-warm border-t border-brand-gold/20 py-14 px-4 sm:px-6 lg:px-8" aria-label="New member invitation">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-8">
          <div className="text-center sm:text-left">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-gold mb-2">
              Attending for the first time?
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-brand-blue mb-2">
              We&apos;d love to have you join the family.
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed max-w-md">
              Ask our welcome team for a pack on your way out — or register right now
              and let us know you were here.
            </p>
          </div>
          <Link
            href="/new-member"
            className="flex-shrink-0 inline-flex items-center gap-2 px-7 py-3.5 bg-brand-blue text-white font-semibold rounded-full hover:bg-brand-blue/80 transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2"
          >
            Register as New Member
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </section>
    </main>
  );
}
