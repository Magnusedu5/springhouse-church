'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import type { ChurchEvent } from '@/lib/types';
import EventCard from './EventCard';
import { CascadeGroup, CascadeItem } from '@/components/motion';
import usePrefersReducedMotion from '@/lib/usePrefersReducedMotion';

// ── Constants ────────────────────────────────────────────────────────────────

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

type ViewMode = 'list' | 'calendar';

// ── Helpers ──────────────────────────────────────────────────────────────────

function groupByMonth(events: ChurchEvent[]): [string, ChurchEvent[]][] {
  const map = new Map<string, ChurchEvent[]>();
  events.forEach((ev) => {
    const key = ev.date.substring(0, 7); // "YYYY-MM"
    const bucket = map.get(key) ?? [];
    bucket.push(ev);
    map.set(key, bucket);
  });
  return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
}

function formatMonthHeading(key: string): string {
  const [year, month] = key.split('-').map(Number);
  return `${MONTH_NAMES[month - 1]} ${year}`;
}

// ── Upcoming sidebar mini-item ───────────────────────────────────────────────

function MiniEventItem({ event }: { event: ChurchEvent }) {
  const d = new Date(event.date);
  return (
    <Link
      href={`/events/${event.slug}`}
      className="flex gap-3 group rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-1"
    >
      <div className="flex-shrink-0 w-12 text-center">
        <div className="bg-brand-red text-white rounded-xl px-1.5 py-1.5 leading-none">
          <div className="text-lg font-bold leading-none">{d.getDate()}</div>
          <div className="text-[10px] font-semibold tracking-wider mt-0.5">
            {MONTH_NAMES[d.getMonth()].substring(0, 3).toUpperCase()}
          </div>
        </div>
      </div>
      <div className="flex-1 min-w-0 pt-0.5">
        <p className="font-display font-semibold text-sm text-brand-blue group-hover:text-brand-red transition-colors line-clamp-2 leading-snug">
          {event.title}
        </p>
        {event.time && (
          <p className="text-xs text-gray-400 mt-0.5">{event.time}</p>
        )}
        {event.is_virtual && (
          <span className="inline-block mt-1 text-[10px] font-semibold uppercase tracking-wider text-brand-gold">
            Online
          </span>
        )}
      </div>
    </Link>
  );
}

// ── Skeleton loader ──────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading events">
      {[1, 2, 3].map((i) => (
        <div key={i} className="animate-pulse space-y-3">
          <div className="h-5 w-32 bg-gray-200 rounded-full" />
          <div className="h-40 bg-gray-100 rounded-2xl" />
        </div>
      ))}
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

export default function EventsPageContent() {
  const now = new Date();
  const [view, setView] = useState<ViewMode>('list');
  const [events, setEvents] = useState<ChurchEvent[]>([]);
  const [sidebarEvents, setSidebarEvents] = useState<ChurchEvent[]>([]);
  const [loading, setLoading] = useState(true);

  // Calendar navigation state
  const [calYear, setCalYear] = useState(now.getFullYear());
  const [calMonth, setCalMonth] = useState(now.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [direction, setDirection] = useState(0);
  const reduced = usePrefersReducedMotion();

  const base = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api';

  // Sidebar: always the next 3 upcoming events
  useEffect(() => {
    fetch(`${base}/events/?upcoming=true&limit=3`)
      .then((r) => r.json())
      .then((data: unknown) => {
        const arr = Array.isArray(data)
          ? data
          : (data as { results?: ChurchEvent[] }).results ?? [];
        setSidebarEvents(arr.slice(0, 3));
      })
      .catch(() => {});
  }, [base]);

  // Main content: re-fetch when view or calendar month changes
  useEffect(() => {
    setLoading(true);
    let url = `${base}/events/`;
    if (view === 'list') {
      url += '?upcoming=true';
    } else {
      const m = String(calMonth + 1).padStart(2, '0');
      url += `?month=${calYear}-${m}`;
    }
    fetch(url)
      .then((r) => r.json())
      .then((data: unknown) => {
        const arr = Array.isArray(data)
          ? data
          : (data as { results?: ChurchEvent[] }).results ?? [];
        setEvents(arr);
      })
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, [view, calYear, calMonth, base]);

  // ── Calendar helpers ────────────────────────────────────────────────────────

  function navigateMonth(delta: number) {
    setSelectedDay(null);
    setDirection(delta);
    const next = new Date(calYear, calMonth + delta, 1);
    setCalYear(next.getFullYear());
    setCalMonth(next.getMonth());
  }

  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(calYear, calMonth, 1).getDay(); // 0=Sun
  // Build grid: null for empty leading cells, then 1..daysInMonth
  const gridCells: (number | null)[] = [
    ...Array<null>(firstDayOfWeek).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (gridCells.length % 7 !== 0) gridCells.push(null);

  // Map event day → events array for the current calendar month
  const eventsByDay: Record<number, ChurchEvent[]> = {};
  events.forEach((ev) => {
    const d = new Date(ev.date);
    if (d.getFullYear() === calYear && d.getMonth() === calMonth) {
      const day = d.getDate();
      if (!eventsByDay[day]) eventsByDay[day] = [];
      eventsByDay[day].push(ev);
    }
  });

  const selectedDayEvents = selectedDay ? (eventsByDay[selectedDay] ?? []) : [];
  const groupedMonths = groupByMonth(events);

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white min-h-[500px]" aria-label="Events listing">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10">

        {/* ── Main panel ── */}
        <div className="flex-1 min-w-0">

          {/* View toggle */}
          <div className="flex items-center gap-1.5 mb-8 bg-gray-100 rounded-full p-1 w-fit">
            {(['list', 'calendar'] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => { setSelectedDay(null); setView(mode); }}
                aria-pressed={view === mode}
                className={`px-5 py-2 rounded-full text-sm font-medium capitalize transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue ${
                  view === mode
                    ? 'bg-white text-brand-blue shadow-sm'
                    : 'text-gray-500 hover:text-brand-blue'
                }`}
              >
                {mode === 'list' ? 'List View' : 'Calendar View'}
              </button>
            ))}
          </div>

          {loading ? (
            <Skeleton />
          ) : (
            <>
              {/* ══ LIST VIEW ══════════════════════════════════════════════════ */}
              {view === 'list' && (
                <>
                  {groupedMonths.length > 0 ? (
                    groupedMonths.map(([key, monthEvents]) => (
                      <div key={key} className="mb-12">
                        <h2 className="font-display text-2xl font-semibold text-brand-blue mb-5 pb-3 border-b border-brand-gold/30">
                          {formatMonthHeading(key)}
                        </h2>
                        <CascadeGroup className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          {monthEvents.map((ev) => (
                            <CascadeItem key={ev.id}>
                              <EventCard event={ev} />
                            </CascadeItem>
                          ))}
                        </CascadeGroup>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-24">
                      <p className="font-display text-xl italic text-gray-400">
                        No upcoming events. Check back soon.
                      </p>
                    </div>
                  )}
                </>
              )}

              {/* ══ CALENDAR VIEW ══════════════════════════════════════════════ */}
              {view === 'calendar' && (
                <>
                  {/* Month navigation header */}
                  <div className="flex items-center justify-between mb-5">
                    <button
                      type="button"
                      onClick={() => navigateMonth(-1)}
                      aria-label="Previous month"
                      className="p-2 rounded-full text-brand-blue hover:bg-brand-cream transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>

                    <h2 className="font-display text-2xl font-semibold text-brand-blue">
                      {MONTH_NAMES[calMonth]} {calYear}
                    </h2>

                    <button
                      type="button"
                      onClick={() => navigateMonth(1)}
                      aria-label="Next month"
                      className="p-2 rounded-full text-brand-blue hover:bg-brand-cream transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>

                  {/* Calendar grid */}
                  <div
                    role="grid"
                    aria-label={`${MONTH_NAMES[calMonth]} ${calYear} calendar`}
                    className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm"
                  >
                    {/* Day-of-week headers */}
                    <div className="grid grid-cols-7 bg-brand-blue" role="row">
                      {DAY_LABELS.map((label) => (
                        <div
                          key={label}
                          role="columnheader"
                          className="py-2.5 text-center text-xs font-semibold text-white/70 uppercase tracking-wider"
                        >
                          {label}
                        </div>
                      ))}
                    </div>

                    {/* Day cells */}
                    <div className="relative overflow-hidden">
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                          key={`${calYear}-${calMonth}`}
                          className="grid grid-cols-7 bg-white"
                          initial={reduced ? false : { x: direction >= 0 ? 60 : -60, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          exit={reduced ? {} : { x: direction >= 0 ? -60 : 60, opacity: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                        >
                          {gridCells.map((day, idx) => {
                            const hasEvents = day !== null && Boolean(eventsByDay[day]?.length);
                            const isSelected = day === selectedDay;
                            const isToday =
                              day === now.getDate() &&
                              calMonth === now.getMonth() &&
                              calYear === now.getFullYear();

                            return (
                              <div
                                key={idx}
                                role="gridcell"
                                aria-label={
                                  day
                                    ? `${MONTH_NAMES[calMonth]} ${day}${hasEvents ? ', has events' : ''}`
                                    : undefined
                                }
                                className={[
                                  'min-h-[52px] sm:min-h-[64px] p-0.5 sm:p-1 border-r border-b border-gray-100',
                                  !day ? 'bg-gray-50' : '',
                                ].join(' ')}
                              >
                                {day && (
                                  <button
                                    type="button"
                                    onClick={() => setSelectedDay(isSelected ? null : day)}
                                    aria-pressed={isSelected}
                                    className={[
                                      'relative w-full h-full min-h-[44px] sm:min-h-[56px] flex flex-col items-center justify-start gap-1 pt-1.5 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue overflow-hidden',
                                      isSelected
                                        ? 'text-white'
                                        : isToday
                                        ? 'bg-brand-cream text-brand-blue font-bold'
                                        : 'hover:bg-brand-cream/60 text-gray-700',
                                    ].join(' ')}
                                  >
                                    {isSelected && (
                                      <span className="day-select-fill absolute inset-0 bg-brand-blue" aria-hidden="true" />
                                    )}
                                    <span className="relative z-10 text-sm leading-none">{day}</span>
                                    {hasEvents && (
                                      <motion.span
                                        aria-hidden="true"
                                        className={[
                                          'relative z-10 w-1.5 h-1.5 rounded-full flex-shrink-0',
                                          isSelected ? 'bg-brand-gold' : 'bg-brand-red',
                                        ].join(' ')}
                                        initial={reduced ? false : { scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{
                                          type: 'spring',
                                          stiffness: 400,
                                          damping: 15,
                                          delay: reduced ? 0 : (day ?? 0) * 0.015,
                                        }}
                                      />
                                    )}
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Selected day events panel */}
                  {selectedDay !== null && (
                    <div className="mt-8">
                      <h3 className="font-display text-xl font-semibold text-brand-blue mb-5">
                        Events on {MONTH_NAMES[calMonth]} {selectedDay}
                      </h3>
                      {selectedDayEvents.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          {selectedDayEvents.map((ev) => (
                            <EventCard key={ev.id} event={ev} />
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-400 italic">No events on this day.</p>
                      )}
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>

        {/* ── Upcoming sidebar (desktop only) ── */}
        <aside
          className="hidden lg:block w-64 xl:w-72 flex-shrink-0"
          aria-label="Upcoming events"
        >
          <div className="sticky top-24">
            <h3 className="font-display text-lg font-semibold text-brand-blue mb-4 pb-2 border-b border-brand-gold/30">
              Coming Up Next
            </h3>
            {sidebarEvents.length > 0 ? (
              <div className="space-y-5">
                {sidebarEvents.map((ev) => (
                  <MiniEventItem key={ev.id} event={ev} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 italic">No upcoming events.</p>
            )}

            {/* Online services reminder */}
            <div className="mt-7 bg-brand-blue rounded-2xl p-5 text-white">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-brand-gold flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                </svg>
                <div>
                  <p className="text-sm font-semibold mb-1">Join Online</p>
                  <p className="text-xs text-white/70 leading-relaxed">
                    All our services are available online. Look for the gold
                    &ldquo;Join Online&rdquo; badge on each event.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>

      </div>
    </section>
  );
}
