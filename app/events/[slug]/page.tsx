import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { ChurchEvent } from '@/lib/types';
import ShareButtons from '@/components/ShareButtons';
import AddToCalendarButton from '@/components/AddToCalendarButton';
import FadeIn from '@/components/FadeIn';
import RecordPhotoGallery from '@/components/RecordPhotoGallery';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://springhousechurch.org';

// ── Inline HTML sanitiser (strips <script> and on* handlers) ─────────────────
// Server-only; keeps safe markup like <p>, <strong>, <a>, <ul>, <li>
function sanitiseHtml(raw: string): string {
  return raw
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/\s+on\w+="[^"]*"/gi, '')
    .replace(/\s+on\w+='[^']*'/gi, '')
    .replace(/href="javascript:[^"]*"/gi, 'href="#"')
    .trim();
}

// ── Data fetching ─────────────────────────────────────────────────────────────

async function getEvent(slug: string): Promise<ChurchEvent | null> {
  try {
    const res = await fetch(`${BASE}/events/${slug}/`, { next: { revalidate: 3600 } });
    if (res.ok) return res.json();
  } catch { /* fall through */ }
  return null;
}

// ── Static generation ─────────────────────────────────────────────────────────

export async function generateStaticParams() {
  try {
    const res = await fetch(`${BASE}/events/?upcoming=true`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const data = await res.json();
      const events: ChurchEvent[] = Array.isArray(data) ? data : (data.results ?? []);
      if (events.length > 0) return events.map((ev) => ({ slug: ev.slug }));
    }
  } catch { /* fall through */ }
  return [];
}

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) return { title: 'Event Not Found' };

  const d = new Date(event.date);
  const dateStr = d.toLocaleDateString('en-NG', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return {
    title: `${event.title} — The SpringHouse Church`,
    description: `${dateStr}${event.time ? ' at ' + event.time : ''}. ${event.description?.substring(0, 120) ?? ''}`,
    openGraph: {
      title: event.title,
      description: event.description?.substring(0, 200),
      images: event.image ? [{ url: event.image }] : [],
      url: `${SITE_URL}/events/${event.slug}`,
    },
  };
}

// ── Category label helper ─────────────────────────────────────────────────────

const CATEGORY_LABELS: Record<ChurchEvent['category'], string> = {
  service: 'Sunday Service',
  prayer: 'Prayer',
  outreach: 'Outreach',
  conference: 'Conference',
  youth: 'Youth',
  special: 'Special Event',
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) notFound();

  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('en-NG', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const safeDescription = event.description ? sanitiseHtml(event.description) : '';
  const isHtml = /<[a-z][\s\S]*>/i.test(safeDescription);

  // Google Maps embed for the church address
  const mapsQuery = encodeURIComponent(
    '137 Ndidem Usang Iso Parliamentary Extension Calabar Nigeria'
  );
  const mapsEmbedUrl = `https://www.google.com/maps/embed/v1/place?q=${mapsQuery}&key=AIzaSyD-placeholder`;

  return (
    <main>
      {/* ── Breadcrumb ── */}
      <div className="bg-brand-cream border-b border-gray-100 px-4 sm:px-6 lg:px-8 py-3">
        <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-brand-blue transition-colors focus:outline-none focus:underline">Home</Link>
          <span aria-hidden="true">/</span>
          <Link href="/events" className="hover:text-brand-blue transition-colors focus:outline-none focus:underline">Events</Link>
          <span aria-hidden="true">/</span>
          <span className="text-brand-blue truncate max-w-[200px]" aria-current="page">{event.title}</span>
        </nav>
      </div>

      {/* ── Hero ── */}
      <section
        className="relative flex flex-col items-end justify-end text-left px-4 sm:px-6 lg:px-8 bg-brand-blue overflow-hidden"
        style={{ minHeight: '50vh' }}
        aria-label="Event hero"
      >
        {event.image && (
          <>
            <Image
              src={event.image}
              alt=""
              fill
              className="object-cover object-center"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-blue via-brand-blue/60 to-brand-blue/10" aria-hidden="true" />
          </>
        )}
        {!event.image && (
          <div className="absolute inset-0 bg-cross-pattern opacity-10" aria-hidden="true" />
        )}

        <div className="relative z-10 max-w-7xl mx-auto w-full pb-10 pt-24">
          <FadeIn>
            {/* Category badge */}
            <span className="inline-block mb-4 px-3 py-1 bg-brand-gold text-white text-xs font-bold uppercase tracking-widest rounded-full">
              {CATEGORY_LABELS[event.category] ?? event.category}
            </span>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-white mb-4 leading-tight max-w-3xl">
              {event.title}
            </h1>

            {/* Quick date/time line */}
            <p className="text-white/70 text-base sm:text-lg">
              {formattedDate}{event.time ? ` · ${event.time}` : ''}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── Virtual join banner (prominently shown for online/hybrid events) ── */}
      {event.is_virtual && event.virtual_link && (
        <div className="bg-brand-gold" role="banner" aria-label="Join online">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-white flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
              </svg>
              <span className="text-white font-semibold">
                This event is available online — join from anywhere in Nigeria or abroad.
              </span>
            </div>
            <a
              href={event.virtual_link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-2.5 bg-white text-brand-blue font-bold text-sm rounded-full hover:bg-brand-cream transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-brand-gold"
            >
              Join via Zoom / YouTube
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      )}

      {/* ── Main content ── */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* ── Left: Description ── */}
          <div className="lg:col-span-2">
            <FadeIn>
              <h2 className="font-display text-3xl font-semibold text-brand-blue mb-6">About This Event</h2>
              {isHtml ? (
                <div
                  className="prose prose-slate max-w-none prose-headings:font-display prose-headings:text-brand-blue prose-a:text-brand-red prose-strong:text-brand-blue"
                  dangerouslySetInnerHTML={{ __html: safeDescription }}
                />
              ) : (
                <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-wrap">
                  {safeDescription || 'More details coming soon.'}
                </p>
              )}
            </FadeIn>

            {/* Share + Add to Calendar */}
            <FadeIn delay={100}>
              <div className="mt-10 pt-8 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center gap-4">
                <AddToCalendarButton event={event} />
                <ShareButtons
                  url={`${SITE_URL}/events/${event.slug}`}
                  title={event.title}
                />
              </div>
            </FadeIn>

            <RecordPhotoGallery destination="event" eventId={event.id} heading="Event Photos" />
          </div>

          {/* ── Right: Details card ── */}
          <aside aria-label="Event details" className="lg:col-span-1">
            <FadeIn delay={80}>
              <div className="bg-brand-cream rounded-2xl p-7 shadow-sm border border-gray-100 space-y-6 sticky top-24">

                {/* Date */}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-brand-red flex items-center justify-center" aria-hidden="true">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-brand-gold mb-0.5">Date</p>
                    <p className="text-brand-blue font-medium text-sm">{formattedDate}</p>
                    {event.end_date && event.end_date !== event.date && (
                      <p className="text-gray-400 text-xs mt-0.5">
                        Until {new Date(event.end_date).toLocaleDateString('en-NG', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </p>
                    )}
                  </div>
                </div>

                {/* Time */}
                {event.time && (
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-brand-blue flex items-center justify-center" aria-hidden="true">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-brand-gold mb-0.5">Time</p>
                      <p className="text-brand-blue font-medium text-sm">{event.time}</p>
                    </div>
                  </div>
                )}

                {/* Location or Online link */}
                {event.is_virtual ? (
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-brand-gold flex items-center justify-center" aria-hidden="true">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-widest text-brand-gold mb-0.5">Location</p>
                      <p className="text-brand-blue font-medium text-sm mb-2">Online — Join from anywhere</p>
                      {event.virtual_link && (
                        <a
                          href={event.virtual_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-gold text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-yellow-600 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2"
                        >
                          Join Online
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-brand-blue flex items-center justify-center" aria-hidden="true">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-brand-gold mb-0.5">Location</p>
                      <p className="text-brand-blue font-medium text-sm">
                        {event.location || '137 Ndidem Usang Iso (Parliamentary Extension), Calabar, Nigeria'}
                      </p>
                    </div>
                  </div>
                )}

                {/* Add to Calendar button in sidebar too */}
                <div className="pt-2 border-t border-gray-200">
                  <AddToCalendarButton event={event} />
                </div>
              </div>
            </FadeIn>

            {/* Google Maps embed (in-person events only) */}
            {!event.is_virtual && (
              <FadeIn delay={150}>
                <div className="mt-6 rounded-2xl overflow-hidden shadow-sm border border-gray-100" aria-label="Map of event location">
                  {/*
                    Google Maps Embed API requires a real API key for production.
                    Replace 'AIzaSyD-placeholder' with NEXT_PUBLIC_MAPS_API_KEY.
                    For development, this shows a static map fallback.
                  */}
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-brand-cream h-48 flex items-center justify-center hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    aria-label="Open location in Google Maps (opens new tab)"
                  >
                    <div className="text-center text-gray-500">
                      <svg className="w-10 h-10 mx-auto mb-2 text-brand-red" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <p className="text-sm font-medium text-brand-blue">View on Google Maps</p>
                      <p className="text-xs text-gray-400 mt-0.5 max-w-[180px] mx-auto">137 Ndidem Usang Iso, Calabar</p>
                    </div>
                  </a>
                </div>
              </FadeIn>
            )}
          </aside>
        </div>
      </div>

      {/* ── Back navigation ── */}
      <div className="bg-white border-t border-gray-100 py-8 px-4 text-center">
        <Link
          href="/events"
          className="text-sm font-medium text-brand-blue hover:text-brand-red transition-colors focus:outline-none focus:underline"
        >
          ← Back to All Events
        </Link>
      </div>
    </main>
  );
}
