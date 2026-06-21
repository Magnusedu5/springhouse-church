'use client';
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import SermonCard from './SermonCard';
import { CascadeGroup, CascadeItem } from '@/components/motion';
import type { Sermon } from '@/lib/types';

const PAGE_SIZE = 9;

interface PaginatedSermons {
  count: number;
  results: Sermon[];
}

function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="animate-pulse rounded-2xl overflow-hidden bg-white border border-gray-100">
          <div className="bg-gray-200 h-48 w-full" />
          <div className="p-5 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-1/3" />
            <div className="h-6 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function SermonsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const search = searchParams.get('search') ?? '';
  const series = searchParams.get('series') ?? '';
  const speaker = searchParams.get('speaker') ?? '';
  const page = Math.max(1, Number(searchParams.get('page') ?? '1'));

  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [allSeries, setAllSeries] = useState<string[]>([]);
  const [allSpeakers, setAllSpeakers] = useState<string[]>([]);

  // Fetch filter options once on mount
  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api';
    fetch(`${base}/sermons/?page_size=200`)
      .then((r) => r.json())
      .then((data) => {
        const list: Sermon[] = Array.isArray(data) ? data : (data.results ?? []);
        setAllSeries([...new Set(list.map((s) => s.series).filter(Boolean))]);
        setAllSpeakers([...new Set(list.map((s) => s.speaker).filter(Boolean))]);
      })
      .catch(() => {});
  }, []);

  // Fetch paginated results when filters/page change
  useEffect(() => {
    setLoading(true);
    const base = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api';
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (series) params.set('series', series);
    if (speaker) params.set('speaker', speaker);
    params.set('page', String(page));

    fetch(`${base}/sermons/?${params.toString()}`)
      .then((r) => r.json())
      .then((data): PaginatedSermons => {
        if (Array.isArray(data)) return { count: data.length, results: data };
        return { count: data.count ?? 0, results: data.results ?? [] };
      })
      .then(({ count, results }) => {
        setSermons(results);
        setTotalCount(count);
      })
      .catch(() => { setSermons([]); setTotalCount(0); })
      .finally(() => setLoading(false));
  }, [search, series, speaker, page]);

  const setParam = useCallback(
    (key: string, value: string) => {
      const p = new URLSearchParams(searchParams.toString());
      if (value) p.set(key, value); else p.delete(key);
      p.delete('page');
      router.push(`/sermons?${p.toString()}`);
    },
    [searchParams, router],
  );

  const setPage = useCallback(
    (n: number) => {
      const p = new URLSearchParams(searchParams.toString());
      p.set('page', String(n));
      router.push(`/sermons?${p.toString()}`);
    },
    [searchParams, router],
  );

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  const hasFilters = !!(search || series || speaker);
  const featuredSermon = !hasFilters && page === 1 ? sermons[0] : null;
  const gridSermons = featuredSermon ? sermons.slice(1) : sermons;

  return (
    <>
      {/* ── Featured Sermon (first result, no filters, page 1) ── */}
      {featuredSermon && (
        <section className="bg-brand-cream py-12 px-4 sm:px-6 lg:px-8" aria-label="Featured sermon">
          <div className="max-w-7xl mx-auto">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-gold mb-6">Featured Message</p>
            <article className="relative rounded-2xl overflow-hidden min-h-[320px] flex flex-col justify-end shadow-lg">
              {/* Background thumbnail */}
              <div className="absolute inset-0 bg-brand-blue">
                {featuredSermon.thumbnail && (
                  <Image
                    src={featuredSermon.thumbnail}
                    alt=""
                    fill
                    className="object-cover opacity-40"
                    priority
                    sizes="100vw"
                  />
                )}
              </div>
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-blue via-brand-blue/60 to-transparent" aria-hidden="true" />

              {/* Content */}
              <div className="relative z-10 p-6 sm:p-10">
                {featuredSermon.series && (
                  <span className="inline-block mb-3 text-xs font-semibold uppercase tracking-wider bg-brand-gold text-white px-3 py-1 rounded-full">
                    {featuredSermon.series}
                  </span>
                )}
                <h2 className="font-display text-3xl sm:text-5xl font-semibold text-white mb-2 leading-snug max-w-3xl">
                  {featuredSermon.title}
                </h2>
                {featuredSermon.scripture_ref && (
                  <p className="font-display italic text-brand-gold mb-3">{featuredSermon.scripture_ref}</p>
                )}
                <div className="flex flex-wrap items-center gap-3 text-white/60 text-sm mb-6">
                  <span>{featuredSermon.speaker}</span>
                  <span aria-hidden="true">·</span>
                  <span>{new Date(featuredSermon.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  {featuredSermon.duration && <><span aria-hidden="true">·</span><span>{featuredSermon.duration}</span></>}
                </div>
                <div className="flex flex-wrap gap-3">
                  {featuredSermon.video_url && (
                    <Link
                      href={`/sermons/${featuredSermon.slug}`}
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-red text-white font-medium rounded-full hover:bg-[#a82126] transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>
                      Watch Now
                    </Link>
                  )}
                  {featuredSermon.audio_url && (
                    <Link
                      href={`/sermons/${featuredSermon.slug}#audio`}
                      className="inline-flex items-center gap-2 px-6 py-2.5 border-2 border-white text-white font-medium rounded-full hover:bg-white hover:text-brand-blue transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 18v-6a9 9 0 0118 0v6M3 18a3 3 0 003 3h1a3 3 0 003-3v-1a3 3 0 00-3-3H3zM21 18a3 3 0 01-3 3h-1a3 3 0 01-3-3v-1a3 3 0 013-3h4z"/>
                      </svg>
                      Listen
                    </Link>
                  )}
                </div>
              </div>
            </article>
          </div>
        </section>
      )}

      {/* ── Filter Bar ── */}
      <div className="sticky top-16 z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-0">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
              fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="search"
              value={search}
              onChange={(e) => setParam('search', e.target.value)}
              placeholder="Search messages…"
              aria-label="Search sermons"
              className="w-full pl-9 pr-4 py-2 text-sm rounded-full border border-gray-200 bg-gray-50 text-brand-blue placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-blue"
            />
          </div>

          {/* Series dropdown */}
          <select
            value={series}
            onChange={(e) => setParam('series', e.target.value)}
            aria-label="Filter by series"
            className="text-sm rounded-full border border-gray-200 bg-gray-50 text-brand-blue px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-blue min-w-[140px]"
          >
            <option value="">All Series</option>
            {allSeries.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>

          {/* Speaker dropdown */}
          <select
            value={speaker}
            onChange={(e) => setParam('speaker', e.target.value)}
            aria-label="Filter by speaker"
            className="text-sm rounded-full border border-gray-200 bg-gray-50 text-brand-blue px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-blue min-w-[140px]"
          >
            <option value="">All Speakers</option>
            {allSpeakers.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* ── Sermon Grid ── */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 bg-white min-h-[400px]" aria-label="Sermon archive">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <GridSkeleton />
          ) : gridSermons.length > 0 ? (
            <CascadeGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {gridSermons.map((sermon) => (
                <CascadeItem key={sermon.id}>
                  <SermonCard sermon={sermon} />
                </CascadeItem>
              ))}
            </CascadeGroup>
          ) : (
            <div className="text-center py-20 text-gray-400">
              <p className="font-display text-2xl italic mb-2">No messages found.</p>
              <p className="text-sm">Try adjusting your filters.</p>
            </div>
          )}

          {/* ── Pagination ── */}
          {totalPages > 1 && (
            <nav className="flex items-center justify-center gap-2 mt-12" aria-label="Sermon pagination">
              <button
                type="button"
                onClick={() => setPage(page - 1)}
                disabled={page <= 1}
                aria-label="Previous page"
                className="px-4 py-2 text-sm rounded-full border border-gray-200 text-brand-blue hover:bg-brand-cream disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue"
              >
                ← Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((n) => n === 1 || n === totalPages || Math.abs(n - page) <= 1)
                .reduce<(number | 'ellipsis')[]>((acc, n, idx, arr) => {
                  if (idx > 0 && n - (arr[idx - 1] as number) > 1) acc.push('ellipsis');
                  acc.push(n);
                  return acc;
                }, [])
                .map((item, idx) =>
                  item === 'ellipsis' ? (
                    <span key={`ellipsis-${idx}`} className="px-2 text-gray-400" aria-hidden="true">…</span>
                  ) : (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setPage(item)}
                      aria-label={`Page ${item}`}
                      aria-current={item === page ? 'page' : undefined}
                      className={`w-9 h-9 text-sm rounded-full border transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue ${
                        item === page
                          ? 'bg-brand-blue text-white border-brand-blue'
                          : 'border-gray-200 text-brand-blue hover:bg-brand-cream'
                      }`}
                    >
                      {item}
                    </button>
                  )
                )}

              <button
                type="button"
                onClick={() => setPage(page + 1)}
                disabled={page >= totalPages}
                aria-label="Next page"
                className="px-4 py-2 text-sm rounded-full border border-gray-200 text-brand-blue hover:bg-brand-cream disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue"
              >
                Next →
              </button>
            </nav>
          )}
        </div>
      </section>
    </>
  );
}
