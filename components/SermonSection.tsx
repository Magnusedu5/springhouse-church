'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Sermon } from '@/lib/types';

function Skeleton() {
  return (
    <div className="animate-pulse rounded-2xl overflow-hidden bg-brand-warm shadow-sm border border-amber-100">
      <div className="bg-amber-100 h-72 sm:h-96 w-full" />
      <div className="p-6 sm:p-8 space-y-3">
        <div className="h-4 bg-amber-100 rounded w-1/4" />
        <div className="h-8 bg-amber-100 rounded w-3/4" />
        <div className="h-4 bg-amber-100 rounded w-1/2" />
        <div className="h-4 bg-amber-100 rounded w-1/3" />
      </div>
    </div>
  );
}

export default function SermonSection() {
  const [sermon, setSermon] = useState<Sermon | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api';
    fetch(`${base}/sermons/?latest=true`)
      .then((r) => r.json())
      .then((data) => {
        const s = Array.isArray(data) ? data[0] : data;
        setSermon(s ?? null);
      })
      .catch(() => setSermon(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="bg-brand-cream py-20 px-4 sm:px-6 lg:px-8" aria-label="Latest sermon">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="h-px w-8 bg-brand-gold" />
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-gold">Fresh Word</p>
            <div className="h-px w-8 bg-brand-gold" />
          </div>
          <h2 className="font-display text-4xl font-bold text-brand-blue">
            Latest Message
          </h2>
        </div>

        {loading ? (
          <Skeleton />
        ) : sermon ? (
          <article className="group rounded-2xl overflow-hidden bg-brand-warm shadow-sm shadow-amber-900/5 border border-amber-100 hover:shadow-lg hover:shadow-amber-900/10 transition-shadow">
            {/* Thumbnail */}
            <div className="relative h-72 sm:h-96 w-full bg-amber-50 overflow-hidden">
              {sermon.thumbnail ? (
                <Image
                  src={sermon.thumbnail}
                  alt={sermon.title}
                  fill
                  className="object-cover transition-[transform,filter] duration-[400ms] ease-out group-hover:scale-[1.04] group-hover:brightness-110"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center">
                  <svg className="w-20 h-20 text-brand-blue/20" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              )}
              {/* Pulsing play button overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-16 h-16 rounded-full bg-brand-gold/90 flex items-center justify-center animate-breath-fast">
                  <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
              {sermon.series && (
                <span className="absolute top-4 left-4 bg-brand-gold text-white text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full">
                  {sermon.series}
                </span>
              )}
            </div>

            {/* Details */}
            <div className="p-6 sm:p-8">
              <h3 className="font-display text-2xl sm:text-3xl font-semibold text-brand-blue mb-2 leading-snug">
                {sermon.title}
              </h3>
              {sermon.scripture_ref && (
                <p className="font-display italic text-brand-gold mb-3">
                  {sermon.scripture_ref}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500">
                <span>{sermon.speaker}</span>
                <span aria-hidden="true">·</span>
                <span>
                  {new Date(sermon.date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
                {sermon.duration && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>{sermon.duration}</span>
                  </>
                )}
              </div>
            </div>
          </article>
        ) : (
          <div className="text-center py-16 text-gray-400">
            <p className="font-display text-xl italic">Messages coming soon.</p>
          </div>
        )}

        <div className="text-center mt-8">
          <Link
            href="/sermons"
            className="text-brand-red font-medium hover:text-brand-blue transition-colors focus:outline-none focus:underline"
          >
            View All Sermons →
          </Link>
        </div>
      </div>
    </section>
  );
}
