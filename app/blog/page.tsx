import { Suspense } from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import type { BlogPost } from '@/lib/types';
import FadeIn from '@/components/FadeIn';
import BlogContent from '@/components/BlogContent';
import { KenBurnsIn, WordStagger } from '@/components/motion';
import HeroBackground from '@/components/HeroBackground';

export const metadata: Metadata = {
  title: 'Words of Life — The SpringHouse Church',
  description:
    'Devotionals, teachings, and reflections from The SpringHouse Church, Calabar, Nigeria.',
  openGraph: {
    title: 'Words of Life — The SpringHouse Church',
    description:
      'Devotionals, teachings, and reflections from The SpringHouse Church, Calabar.',
  },
};

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api';

async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const res = await fetch(`${BASE}/blog/?page=1`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : (data.results ?? []);
  } catch {
    return [];
  }
}

const CATEGORY_COLORS: Record<string, string> = {
  devotional: 'bg-brand-gold',
  teaching: 'bg-brand-blue',
  testimony: 'bg-brand-red',
  missions: 'bg-emerald-600',
  general: 'bg-gray-500',
};

const CATEGORY_LABELS: Record<string, string> = {
  devotional: 'Devotional',
  teaching: 'Teaching',
  testimony: 'Testimony',
  missions: 'Missions',
  general: 'General',
};

export default async function BlogPage() {
  const posts = await getBlogPosts();
  const [featured, ...rest] = posts;

  return (
    <main>
      {/* ── Hero ── */}
      <section
        className="relative flex flex-col items-center justify-center text-center px-4 bg-brand-blue overflow-hidden"
        style={{ minHeight: '40vh' }}
        aria-label="Blog page hero"
      >
        <HeroBackground destination="hero_blog" />
        <div className="absolute inset-0 bg-brand-blue/80" aria-hidden="true" />
        <div className="absolute inset-0 bg-cross-pattern opacity-10" aria-hidden="true" />
        <div className="relative z-10 max-w-2xl mx-auto py-20">
          <FadeIn>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-gold mb-4">
              The Written Word
            </p>
            <h1 className="font-display text-5xl sm:text-6xl font-semibold text-white mb-4 leading-tight">
              Words of Life
            </h1>
            <p className="text-white/70 text-lg sm:text-xl">
              Devotionals, teachings, and reflections from The SpringHouse Church.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── Featured Post ── */}
      {featured && (
        <section className="bg-brand-cream py-12 px-4 sm:px-6 lg:px-8" aria-label="Featured post">
          <div className="max-w-7xl mx-auto">
            <FadeIn>
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-gold mb-5">Featured</p>
              <Link
                href={`/blog/${featured.slug}`}
                className="group grid grid-cols-1 lg:grid-cols-5 rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-brand-blue"
                aria-label={`Read featured post: ${featured.title}`}
              >
                {/* Image — spans 3 of 5 columns (≈60%) */}
                <div className="lg:col-span-3 relative h-64 lg:h-80 xl:h-96 overflow-hidden bg-brand-blue">
                  {featured.featured_image ? (
                    <KenBurnsIn className="absolute inset-0">
                      <Image
                        src={featured.featured_image}
                        alt={featured.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 1024px) 100vw, 60vw"
                        priority
                      />
                    </KenBurnsIn>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-cross-pattern">
                      <span className="font-display text-8xl text-white/10 select-none">&ldquo;</span>
                    </div>
                  )}
                  <span className={`absolute top-4 left-4 ${CATEGORY_COLORS[featured.category] ?? 'bg-brand-gold'} text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full`}>
                    {CATEGORY_LABELS[featured.category] ?? featured.category}
                  </span>
                </div>

                {/* Text — spans 2 of 5 columns (≈40%) */}
                <div className="lg:col-span-2 bg-white flex flex-col justify-center p-7 xl:p-10">
                  <WordStagger
                    as="h2"
                    text={featured.title}
                    staggerDelay={0.04}
                    className="font-display text-3xl xl:text-4xl font-semibold text-brand-blue leading-snug mb-4 group-hover:text-brand-red transition-colors"
                  />
                  {featured.excerpt && (
                    <p className="text-gray-500 leading-relaxed mb-6 line-clamp-3">
                      {featured.excerpt}
                    </p>
                  )}
                  {/* Author row */}
                  <div className="flex items-center gap-3 mt-auto">
                    <div className="flex-shrink-0 w-9 h-9 rounded-full bg-brand-blue/10 overflow-hidden">
                      {featured.author_image ? (
                        <Image
                          src={featured.author_image}
                          alt={featured.author}
                          width={36}
                          height={36}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-brand-blue text-sm font-bold">
                          {featured.author.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-brand-blue">{featured.author}</p>
                      <p className="text-xs text-gray-400">
                        {featured.published_date &&
                          new Date(featured.published_date).toLocaleDateString('en-NG', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        {featured.read_time ? ` · ${featured.read_time}` : ''}
                      </p>
                    </div>
                  </div>
                  <p className="mt-5 text-sm font-semibold text-brand-red group-hover:text-brand-blue transition-colors">
                    Read article →
                  </p>
                </div>
              </Link>
            </FadeIn>
          </div>
        </section>
      )}

      {/* ── Blog grid with category filter + load more ── */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white" aria-label="All blog posts">
        <div className="max-w-7xl mx-auto">
          <Suspense
            fallback={
              <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 animate-pulse">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="break-inside-avoid mb-5 h-64 bg-gray-100 rounded-2xl" />
                ))}
              </div>
            }
          >
            <BlogContent initialPosts={rest} />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
