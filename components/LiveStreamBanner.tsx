'use client';
import { useState, useEffect } from 'react';

interface Props {
  isLive: boolean;
  streamUrl: string;
}

export default function LiveStreamBanner({ isLive, streamUrl }: Props) {
  const [dismissed, setDismissed] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isLive && !dismissed) {
      // Brief delay so the CSS transition fires after mount
      const t = setTimeout(() => setVisible(true), 50);
      return () => clearTimeout(t);
    } else {
      setVisible(false);
    }
  }, [isLive, dismissed]);

  if (!isLive || dismissed) return null;

  return (
    <div
      role="banner"
      aria-live="polite"
      aria-label="Live service notification"
      style={{ transform: visible ? 'translateY(0)' : 'translateY(-100%)' }}
      className="bg-white border-b border-brand-red/20 transition-transform duration-500 ease-out"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          {/* Pulsing red dot */}
          <span className="relative flex h-3 w-3 flex-shrink-0" aria-hidden="true">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-red opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-brand-red" />
          </span>
          <span className="text-sm font-medium text-gray-800">
            We&apos;re{' '}
            <strong className="text-brand-red">LIVE</strong>{' '}
            right now — Join the service
          </span>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={streamUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-1.5 bg-brand-red text-white text-sm font-medium rounded-full hover:bg-[#a82126] transition-colors focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-offset-1"
          >
            Watch Now →
          </a>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            aria-label="Dismiss live stream notification"
            className="p-1 text-gray-400 hover:text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue rounded"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
