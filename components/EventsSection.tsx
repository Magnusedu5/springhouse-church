'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { ChurchEvent } from '@/lib/types';
import EventCard from './EventCard';

function EventCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl bg-amber-50 border border-amber-100 h-60 flex-shrink-0 w-72 sm:w-auto" />
  );
}

export default function EventsSection() {
  const [events, setEvents] = useState<ChurchEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api';
    fetch(`${base}/events/?upcoming=true&limit=3`)
      .then((r) => r.json())
      .then((data) => {
          const list = Array.isArray(data) ? data : (data?.results ?? []);
          setEvents(list.slice(0, 3));
        })
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="bg-brand-warm py-20 px-4 sm:px-6 lg:px-8" aria-label="Upcoming events">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="h-px w-8 bg-brand-gold" />
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-gold">What&apos;s Happening</p>
            <div className="h-px w-8 bg-brand-gold" />
          </div>
          <h2 className="font-display text-4xl font-bold text-brand-blue">
            Upcoming Events
          </h2>
        </div>

        {loading ? (
          <div className="flex gap-6 overflow-x-auto pb-2 lg:grid lg:grid-cols-3 lg:overflow-x-visible">
            {[1, 2, 3].map((i) => <EventCardSkeleton key={i} />)}
          </div>
        ) : events.length > 0 ? (
          /* Horizontal scroll on mobile, 3-col grid on desktop */
          <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0 lg:grid lg:grid-cols-3 lg:overflow-x-visible lg:pb-0">
            {events.map((event) => (
              <div key={event.id} className="snap-start flex-shrink-0 w-72 sm:w-80 lg:w-auto">
                <EventCard event={event} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-400">
            <p className="font-display text-xl italic">No upcoming events. Check back soon.</p>
          </div>
        )}

        <div className="text-center mt-10">
          <Link
            href="/events"
            className="text-brand-red font-medium hover:text-brand-blue transition-colors focus:outline-none focus:underline"
          >
            See Full Calendar →
          </Link>
        </div>
      </div>
    </section>
  );
}
