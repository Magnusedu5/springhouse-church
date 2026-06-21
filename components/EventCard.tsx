import type { ChurchEvent } from '@/lib/types';
import Link from 'next/link';
import EventThumbnail from './EventThumbnail';

interface Props {
  event: ChurchEvent;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return {
    day: d.getDate(),
    month: d.toLocaleString('en-US', { month: 'short' }).toUpperCase(),
  };
}

export default function EventCard({ event }: Props) {
  const { day, month } = formatDate(event.date);

  return (
    <article className="group bg-brand-warm rounded-2xl shadow-sm shadow-amber-900/5 border border-amber-100 overflow-hidden flex flex-col hover:shadow-lg hover:shadow-amber-900/10 transition-all duration-300 h-full">
      <EventThumbnail image={event.image} alt={event.title} eventId={event.id} />
      <div className="p-6 flex-1">
        {/* Red date badge */}
        <div
          className="inline-flex flex-col items-center bg-brand-red text-white rounded-lg px-3 py-2 mb-4 min-w-[52px] text-center transition-transform duration-300 ease-out group-hover:scale-110 group-hover:-rotate-3"
          aria-label={`${day} ${month}`}
        >
          <span className="text-2xl font-bold leading-none">{day}</span>
          <span className="text-xs font-semibold tracking-wider">{month}</span>
        </div>

        <h3 className="font-display text-xl font-semibold text-brand-blue mb-2 leading-snug">
          {event.title}
        </h3>
        <p className="text-gray-500 text-sm line-clamp-2 mb-4">
          {event.description}
        </p>

        {/* Location / virtual tag */}
        <div className="flex flex-wrap items-center gap-2">
          {event.is_virtual ? (
            <span className="animate-pulse-live inline-flex items-center gap-1.5 text-xs font-medium bg-brand-gold/10 text-brand-gold border border-brand-gold/30 rounded-full px-3 py-1">
              🌍 Join Online
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-brand-gold/10 text-brand-gold rounded-full px-3 py-1">
              📍 {event.location}
            </span>
          )}
          {event.time && (
            <span className="text-xs text-gray-400">{event.time}</span>
          )}
        </div>
      </div>

      <div className="px-6 pb-5">
        <Link
          href={`/events/${event.slug}`}
          className="text-sm font-medium text-brand-red hover:text-brand-blue transition-colors focus:outline-none focus:underline"
        >
          Learn More →
        </Link>
      </div>
    </article>
  );
}
