'use client';
import type { ChurchEvent } from '@/lib/types';

interface Props {
  event: ChurchEvent;
}

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function toICSDate(dateStr: string): string {
  const d = new Date(dateStr);
  return (
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}` +
    `T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`
  );
}

function escapeICS(str: string): string {
  return (str ?? '')
    .replace(/\\/g, '\\\\')
    .replace(/[,;]/g, '\\$&')
    .replace(/\r?\n/g, '\\n');
}

export default function AddToCalendarButton({ event }: Props) {
  function download() {
    const location = event.is_virtual
      ? (event.virtual_link ?? 'Online')
      : '137 Ndidem Usang Iso (Parliamentary Extension)\\, Calabar\\, Nigeria';

    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//The SpringHouse Church//Events//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `DTSTART:${toICSDate(event.date)}`,
      `DTEND:${event.end_date ? toICSDate(event.end_date) : toICSDate(event.date)}`,
      `SUMMARY:${escapeICS(event.title)}`,
      `DESCRIPTION:${escapeICS(event.description ?? '')}`,
      `LOCATION:${escapeICS(location)}`,
      `URL:${window.location.href}`,
      'STATUS:CONFIRMED',
      `UID:${event.slug}-${event.id}@springhousechurch.org`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${event.slug || 'event'}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <button
      type="button"
      onClick={download}
      aria-label={`Add "${event.title}" to your calendar`}
      className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-blue text-white text-sm font-medium rounded-full hover:bg-brand-blue/80 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      Add to Calendar
    </button>
  );
}
