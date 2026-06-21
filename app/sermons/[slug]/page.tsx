import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Sermon } from '@/lib/types';
import AudioPlayer from '@/components/AudioPlayer';
import SermonCard from '@/components/SermonCard';
import ShareButtons from '@/components/ShareButtons';
import RecordPhotoGallery from '@/components/RecordPhotoGallery';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://springhousechurch.org';

async function getSermon(slug: string): Promise<Sermon | null> {
  try {
    const res = await fetch(`${BASE}/sermons/${slug}/`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

async function getSeriesSiblings(series: string, currentSlug: string): Promise<Sermon[]> {
  try {
    const res = await fetch(`${BASE}/sermons/?series=${encodeURIComponent(series)}&page_size=5`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    const list: Sermon[] = Array.isArray(data) ? data : (data.results ?? []);
    return list.filter((s) => s.slug !== currentSlug).slice(0, 4);
  } catch {
    return [];
  }
}

// ── Static generation ────────────────────────────────────────────────────────

export async function generateStaticParams() {
  try {
    const res = await fetch(`${BASE}/sermons/?page_size=100`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();
    const sermons: Sermon[] = Array.isArray(data) ? data : (data.results ?? []);
    return sermons.map((s) => ({ slug: s.slug }));
  } catch {
    return [];
  }
}

// ── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const sermon = await getSermon(slug);
  if (!sermon) return { title: 'Sermon Not Found' };
  return {
    title: `${sermon.title} — The SpringHouse Church`,
    description: sermon.description || `${sermon.title} by ${sermon.speaker}`,
    openGraph: {
      title: sermon.title,
      description: sermon.description,
      images: sermon.thumbnail ? [{ url: sermon.thumbnail }] : [],
    },
  };
}

// ── YouTube URL helper ────────────────────────────────────────────────────────

function getYouTubeEmbedUrl(url: string): string | null {
  const patterns = [
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtu\.be\/([^?]+)/,
    /youtube\.com\/embed\/([^?]+)/,
  ];
  for (const pat of patterns) {
    const m = url.match(pat);
    if (m) return `https://www.youtube.com/embed/${m[1]}?rel=0`;
  }
  return null;
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function SermonDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const sermon = await getSermon(slug);
  if (!sermon) notFound();

  const siblings = sermon.series ? await getSeriesSiblings(sermon.series, sermon.slug) : [];
  const embedUrl = sermon.video_url ? getYouTubeEmbedUrl(sermon.video_url) : null;
  const pageUrl = `${SITE_URL}/sermons/${sermon.slug}`;

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': sermon.video_url ? 'VideoObject' : 'AudioObject',
    name: sermon.title,
    description: sermon.description,
    ...(sermon.thumbnail && { thumbnailUrl: sermon.thumbnail }),
    uploadDate: sermon.date,
    ...(sermon.video_url && { contentUrl: sermon.video_url }),
    ...(sermon.audio_url && { contentUrl: sermon.audio_url }),
    author: { '@type': 'Person', name: sermon.speaker },
    publisher: {
      '@type': 'Organization',
      name: 'The SpringHouse Church',
      url: SITE_URL,
    },
  };

  return (
    <main>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Breadcrumb ── */}
      <div className="bg-brand-cream border-b border-gray-100 px-4 sm:px-6 lg:px-8 py-3">
        <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-brand-blue transition-colors focus:outline-none focus:underline">Home</Link>
          <span aria-hidden="true">/</span>
          <Link href="/sermons" className="hover:text-brand-blue transition-colors focus:outline-none focus:underline">Sermons</Link>
          {sermon.series && (
            <>
              <span aria-hidden="true">/</span>
              <span className="text-brand-blue truncate max-w-[200px]">{sermon.series}</span>
            </>
          )}
        </nav>
      </div>

      {/* ── Two-column layout ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* ── Left column (70%) ── */}
          <div className="flex-1 min-w-0">
            {/* Video player */}
            {sermon.video_url && (
              <div className="mb-8">
                {embedUrl ? (
                  <div className="relative w-full rounded-2xl overflow-hidden bg-black" style={{ paddingBottom: '56.25%' }}>
                    <iframe
                      src={embedUrl}
                      title={sermon.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full"
                    />
                  </div>
                ) : (
                  <video
                    src={sermon.video_url}
                    controls
                    className="w-full rounded-2xl bg-black"
                    aria-label={`Video: ${sermon.title}`}
                  >
                    Your browser does not support video playback.
                  </video>
                )}
              </div>
            )}

            {/* Audio player */}
            {sermon.audio_url && (
              <div className="mb-8">
                <AudioPlayer audioUrl={sermon.audio_url} title={sermon.title} />
              </div>
            )}

            {/* Sermon meta */}
            <div className="mb-8">
              {sermon.series && (
                <span className="inline-block mb-3 text-xs font-semibold uppercase tracking-wider bg-brand-gold/10 text-brand-gold border border-brand-gold/30 rounded-full px-3 py-1">
                  {sermon.series}
                </span>
              )}
              <h1 className="font-display text-3xl sm:text-4xl font-semibold text-brand-blue mb-3 leading-snug">
                {sermon.title}
              </h1>
              {sermon.scripture_ref && (
                <p className="font-display italic text-brand-gold text-lg mb-3">
                  {sermon.scripture_ref}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-3 text-gray-500 text-sm mb-6">
                <span className="font-medium text-brand-blue">{sermon.speaker}</span>
                <span aria-hidden="true">·</span>
                <time dateTime={sermon.date}>
                  {new Date(sermon.date).toLocaleDateString('en-US', {
                    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
                  })}
                </time>
                {sermon.duration && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>{sermon.duration}</span>
                  </>
                )}
              </div>

              {/* Thumbnail (if no video) */}
              {!sermon.video_url && sermon.thumbnail && (
                <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden mb-6">
                  <Image src={sermon.thumbnail} alt={sermon.title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 70vw" />
                </div>
              )}

              {/* Description */}
              {sermon.description && (
                <div className="prose prose-blue max-w-none text-gray-600 leading-relaxed">
                  <p>{sermon.description}</p>
                </div>
              )}

              <RecordPhotoGallery destination="sermon" sermonId={sermon.id} heading="Sermon Photos" />
            </div>
          </div>

          {/* ── Right column (30%) ── */}
          <aside className="lg:w-80 xl:w-96 flex-shrink-0 space-y-8" aria-label="Sermon sidebar">

            {/* More in this series */}
            {siblings.length > 0 && (
              <div>
                <h2 className="font-display text-lg font-semibold text-brand-blue mb-4">
                  More in &ldquo;{sermon.series}&rdquo;
                </h2>
                <div className="space-y-4">
                  {siblings.map((s) => (
                    <SermonCard key={s.id} sermon={s} />
                  ))}
                </div>
              </div>
            )}

            {/* Share */}
            <ShareButtons url={pageUrl} title={sermon.title} />
          </aside>

        </div>
      </div>

      {/* ── Prayer CTA ── */}
      <section className="bg-brand-cream border-t border-gray-100 py-14 px-4 sm:px-6 lg:px-8" aria-label="Prayer invitation">
        <div className="max-w-2xl mx-auto text-center">
          <p className="font-display italic text-brand-gold text-xl mb-3">
            &ldquo;Did this message speak to you?&rdquo;
          </p>
          <h2 className="font-display text-3xl font-semibold text-brand-blue mb-4">
            We&apos;d Love to Pray With You
          </h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Our prayer team is ready to stand with you. Whatever you&apos;re facing, you don&apos;t have to face it alone.
          </p>
          <Link
            href="/contact#prayer"
            className="inline-flex items-center px-8 py-3.5 bg-brand-red text-white font-medium rounded-full hover:bg-[#a82126] transition-colors focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-offset-2"
          >
            Send a Prayer Request →
          </Link>
        </div>
      </section>
    </main>
  );
}
