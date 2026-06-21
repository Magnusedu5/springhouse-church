import type { Sermon } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';

interface Props {
  sermon: Sermon;
}

function PlayIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function HeadphonesIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 18v-6a9 9 0 0118 0v6M3 18a3 3 0 003 3h1a3 3 0 003-3v-1a3 3 0 00-3-3H3zM21 18a3 3 0 01-3 3h-1a3 3 0 01-3-3v-1a3 3 0 013-3h4z" />
    </svg>
  );
}

export default function SermonCard({ sermon }: Props) {
  const formattedDate = new Date(sermon.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <article className="group bg-brand-warm rounded-2xl shadow-sm shadow-amber-900/5 border border-amber-100 overflow-hidden hover:shadow-lg hover:shadow-amber-900/10 hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full">
      {/* Thumbnail */}
      <Link
        href={`/sermons/${sermon.slug}`}
        className="relative block h-48 overflow-hidden bg-amber-50 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-inset"
        tabIndex={-1}
        aria-hidden="true"
      >
        {sermon.thumbnail ? (
          <Image
            src={sermon.thumbnail}
            alt=""
            fill
            className="object-cover group-hover:scale-105 group-hover:brightness-110 transition-[transform,filter] duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="h-full flex items-center justify-center">
            <svg className="w-14 h-14 text-brand-blue/15" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        )}
        {sermon.series && (
          <span className="bg-shimmer-gold-hover absolute top-3 left-3 text-white text-xs font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full">
            {sermon.series}
          </span>
        )}
      </Link>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <Link href={`/sermons/${sermon.slug}`} className="focus:outline-none focus:underline">
          <h3 className="font-display text-xl font-semibold text-brand-blue mb-1.5 leading-snug group-hover:text-brand-red transition-colors line-clamp-2">
            {sermon.title}
          </h3>
        </Link>

        <p className="text-sm text-gray-500 mb-1">{sermon.speaker}</p>

        <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
          <time dateTime={sermon.date}>{formattedDate}</time>
          {sermon.duration && (
            <>
              <span aria-hidden="true">·</span>
              <span className="bg-amber-50 text-amber-800 rounded-full px-2 py-0.5 group-hover:animate-pulse">{sermon.duration}</span>
            </>
          )}
        </div>

        {/* Action buttons pushed to bottom */}
        <div className="flex flex-wrap gap-2 mt-auto">
          {sermon.video_url && (
            <Link
              href={`/sermons/${sermon.slug}`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-brand-blue rounded-full px-3 py-1.5 hover:bg-brand-red transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue"
              aria-label={`Watch: ${sermon.title}`}
            >
              <PlayIcon />
              Watch
            </Link>
          )}
          {sermon.audio_url && (
            <Link
              href={`/sermons/${sermon.slug}#audio`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-gold border border-brand-gold/40 rounded-full px-3 py-1.5 hover:bg-brand-gold/10 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-gold"
              aria-label={`Listen: ${sermon.title}`}
            >
              <HeadphonesIcon />
              Listen
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
