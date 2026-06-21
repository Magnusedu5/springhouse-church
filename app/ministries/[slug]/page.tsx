import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { GalleryDestination, Ministry, Sermon } from '@/lib/types';
import FadeIn from '@/components/FadeIn';
import SermonCard from '@/components/SermonCard';
import MinistryInterestForm from '@/components/MinistryInterestForm';
import HeroBackground from '@/components/HeroBackground';
import MinistryGallery from '@/components/MinistryGallery';
import { DEFAULT_MINISTRIES } from '../page';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api';

// Maps real ministry slugs to their gallery destination key
const MINISTRY_DESTINATIONS: Record<string, GalleryDestination> = {
  'childrens-ministry': 'ministry_children',
  'youth-ministry': 'ministry_youth',
  'mens-fellowship': 'ministry_men',
  'womens-fellowship': 'ministry_women',
  'missions-outreach': 'ministry_missions',
  'worship-team': 'ministry_worship',
};

async function getMinistry(slug: string): Promise<Ministry | null> {
  try {
    const res = await fetch(`${BASE}/ministries/${slug}/`, { next: { revalidate: 3600 } });
    if (res.ok) return res.json();
  } catch { /* fall through to defaults */ }
  // Fallback to static defaults when API is unavailable
  return DEFAULT_MINISTRIES.find((m) => m.slug === slug) ?? null;
}

async function getRelatedSermons(slug: string): Promise<Sermon[]> {
  try {
    const res = await fetch(`${BASE}/sermons/?ministry=${slug}&page_size=3`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data.slice(0, 3) : (data.results ?? []).slice(0, 3);
  } catch {
    return [];
  }
}

// ── Static generation ─────────────────────────────────────────────────────────

export async function generateStaticParams() {
  try {
    const res = await fetch(`${BASE}/ministries/`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const data = await res.json();
      const list: Ministry[] = Array.isArray(data) ? data : (data.results ?? []);
      if (list.length > 0) return list.map((m) => ({ slug: m.slug }));
    }
  } catch { /* fall through */ }
  // Always pre-generate default ministry slugs
  return DEFAULT_MINISTRIES.map((m) => ({ slug: m.slug }));
}

// ── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const ministry = await getMinistry(slug);
  if (!ministry) return { title: 'Ministry Not Found' };
  return {
    title: `${ministry.name} — The SpringHouse Church`,
    description: ministry.tagline,
    openGraph: {
      title: ministry.name,
      description: ministry.tagline,
      images: ministry.image ? [{ url: ministry.image }] : [],
    },
  };
}

// ── What We Do placeholder cards ─────────────────────────────────────────────

// TODO: Replace with ministry-specific "What We Do" content from the API or CMS
const WHAT_WE_DO = [
  {
    title: 'Weekly Gatherings',
    points: [
      'Regular fellowship and community',
      'Bible study and discipleship',
      'Prayer and Spirit-led worship',
    ],
  },
  {
    title: 'Community Impact',
    points: [
      'Outreach and service projects',
      'Partnerships with local organisations',
      'Events that serve Calabar and beyond',
    ],
  },
  {
    title: 'Growth & Training',
    points: [
      'Leadership development programmes',
      'Skills and ministry workshops',
      'Mentorship and accountability',
    ],
  },
];

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function MinistryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ministry = await getMinistry(slug);
  if (!ministry) notFound();

  const relatedSermons = await getRelatedSermons(slug);
  const galleryDestination = MINISTRY_DESTINATIONS[slug];

  // Use ministry color_accent for hero background if provided, else brand-blue
  const heroBg = ministry.color_accent && /^#[0-9A-Fa-f]{6}$/.test(ministry.color_accent)
    ? ministry.color_accent
    : '#1A3A6B';

  return (
    <main>
      {/* ── Breadcrumb ── */}
      <div className="bg-brand-cream border-b border-gray-100 px-4 sm:px-6 lg:px-8 py-3">
        <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-brand-blue transition-colors focus:outline-none focus:underline">Home</Link>
          <span aria-hidden="true">/</span>
          <Link href="/ministries" className="hover:text-brand-blue transition-colors focus:outline-none focus:underline">Ministries</Link>
          <span aria-hidden="true">/</span>
          <span className="text-brand-blue truncate max-w-[200px]" aria-current="page">{ministry.name}</span>
        </nav>
      </div>

      {/* ── 1. Ministry Hero ── */}
      <section
        className="relative flex flex-col items-center justify-center text-center px-4 py-24"
        style={{ minHeight: '40vh', backgroundColor: heroBg }}
        aria-label={`${ministry.name} hero`}
      >
        {galleryDestination ? (
          <>
            <HeroBackground
              destination={galleryDestination}
              fallbackSrc={ministry.image}
              className="object-cover opacity-20"
            />
            <div className="absolute inset-0" style={{ background: `${heroBg}cc` }} aria-hidden="true" />
          </>
        ) : ministry.image && (
          <>
            <Image
              src={ministry.image}
              alt=""
              fill
              className="object-cover opacity-20"
              sizes="100vw"
            />
            <div className="absolute inset-0" style={{ background: `${heroBg}cc` }} aria-hidden="true" />
          </>
        )}
        <div className="relative z-10 max-w-2xl mx-auto">
          <FadeIn>
            <h1 className="font-display text-5xl sm:text-6xl font-semibold text-white mb-3 leading-tight">
              {ministry.name}
            </h1>
            <p className="font-display italic text-brand-gold text-xl sm:text-2xl mb-6">
              {ministry.tagline}
            </p>
            {(ministry.leader_name || ministry.meeting_schedule) && (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-white/70">
                {ministry.leader_name && ministry.leader_name !== 'TBC' && (
                  <span>
                    Led by <span className="font-medium text-white">{ministry.leader_name}</span>
                    {ministry.leader_title && `, ${ministry.leader_title}`}
                  </span>
                )}
                {ministry.meeting_schedule && (
                  <span className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-brand-gold flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {ministry.meeting_schedule}
                  </span>
                )}
              </div>
            )}
          </FadeIn>
        </div>
      </section>

      {/* ── 2. About Section ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white" aria-label="About this ministry">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <FadeIn>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-gold mb-3">About</p>
              <h2 className="font-display text-4xl sm:text-5xl font-semibold text-brand-blue mb-6 leading-snug">
                Who We Are
              </h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                {ministry.description}
              </p>
            </div>
          </FadeIn>
          {ministry.image && (
            <FadeIn delay={150}>
              <div className="relative">
                <div className="absolute -top-3 -right-3 w-full h-full border-2 border-brand-gold/40 rounded-2xl" aria-hidden="true" />
                <div className="relative h-80 lg:h-[420px] rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src={ministry.image}
                    alt={`${ministry.name} at The SpringHouse Church`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </div>
            </FadeIn>
          )}
        </div>
      </section>

      {/* ── 3. What We Do ── */}
      <section className="bg-brand-cream py-20 px-4 sm:px-6 lg:px-8" aria-label="What we do">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <div className="text-center mb-12">
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-gold mb-3">Our Focus</p>
              <h2 className="font-display text-4xl font-semibold text-brand-blue">What We Do</h2>
            </div>
          </FadeIn>
          {/* TODO: Replace with ministry-specific content */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {WHAT_WE_DO.map(({ title, points }, i) => (
              <FadeIn key={title} delay={i * 100}>
                <div className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100 h-full">
                  <h3 className="font-display text-xl font-semibold text-brand-blue mb-4">{title}</h3>
                  <ul className="space-y-2.5">
                    {points.map((pt) => (
                      <li key={pt} className="flex items-start gap-2.5 text-sm text-gray-600">
                        <span className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full bg-brand-gold/20 flex items-center justify-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-gold" aria-hidden="true" />
                        </span>
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Get Involved CTA ── */}
      <section className="bg-white py-20 px-4 sm:px-6 lg:px-8" aria-label="Get involved">
        <div className="max-w-xl mx-auto">
          <FadeIn>
            <div className="text-center mb-10">
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-gold mb-3">Join Us</p>
              <h2 className="font-display text-4xl font-semibold text-brand-blue mb-4">
                Get Involved
              </h2>
              <p className="text-gray-500 leading-relaxed">
                Interested in joining the {ministry.name}? Fill in the form below and
                someone from our team will reach out to welcome you.
              </p>
            </div>
            <MinistryInterestForm ministrySlug={slug} ministryName={ministry.name} />
          </FadeIn>
        </div>
      </section>

      {/* ── 5. Related Sermons ── */}
      {relatedSermons.length > 0 && (
        <section className="bg-brand-cream py-20 px-4 sm:px-6 lg:px-8" aria-label="Related sermons">
          <div className="max-w-7xl mx-auto">
            <FadeIn>
              <div className="text-center mb-12">
                <p className="text-xs font-semibold uppercase tracking-widest text-brand-gold mb-3">The Word</p>
                <h2 className="font-display text-4xl font-semibold text-brand-blue">
                  Messages on {ministry.name}
                </h2>
              </div>
            </FadeIn>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedSermons.map((sermon, i) => (
                <FadeIn key={sermon.id} delay={i * 80}>
                  <SermonCard sermon={sermon} />
                </FadeIn>
              ))}
            </div>
            <FadeIn delay={250}>
              <div className="text-center mt-10">
                <Link
                  href="/sermons"
                  className="text-brand-red font-medium hover:text-brand-blue transition-colors focus:outline-none focus:underline"
                >
                  View All Sermons →
                </Link>
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {/* ── 6. Photo Gallery (below the fold) ── */}
      {galleryDestination && (
        <MinistryGallery destination={galleryDestination} ministryName={ministry.name} />
      )}

      {/* ── Back to Ministries ── */}
      <div className="bg-white border-t border-gray-100 py-8 px-4 text-center">
        <Link
          href="/ministries"
          className="text-sm font-medium text-brand-blue hover:text-brand-red transition-colors focus:outline-none focus:underline"
        >
          ← Back to All Ministries
        </Link>
      </div>
    </main>
  );
}

