'use client';
import { useState } from 'react';

const FAQS = [
  {
    q: 'Is my donation tax-deductible?',
    // TODO: Add answer from church admin / accountant
    a: 'Our team is currently documenting this information. Please reach out to us via the Contact page or email for current guidance on tax deductibility in your region.',
  },
  {
    q: 'Can I set up a recurring donation?',
    // TODO: Confirm recurring giving options with admin
    a: 'We are working on setting up a recurring giving option. In the meantime, please contact us directly and we will be happy to guide you through the process manually.',
  },
  {
    q: 'How is my giving used?',
    a: 'Your generosity directly funds three streams of ministry: local ministry in Calabar (Sunday services, children\'s and youth programmes, community outreach), online ministry (live-streaming, digital discipleship, website infrastructure), and global missions partnerships. We are committed to the faithful and transparent stewardship of every gift.',
  },
  {
    q: 'I gave online but didn\'t get a confirmation. What do I do?',
    a: 'Please send us a message via the Contact page or WhatsApp with your name, the amount transferred, and the date. Our team will verify and acknowledge your gift as soon as possible — usually within 24 hours.',
  },
] as const;

export default function GiveFAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <div className="divide-y divide-gray-100" role="list" aria-label="Frequently asked questions">
      {FAQS.map(({ q, a }, idx) => {
        const isOpen = openIdx === idx;
        return (
          <div key={idx} role="listitem">
            <button
              type="button"
              id={`faq-q-${idx}`}
              aria-expanded={isOpen}
              aria-controls={`faq-a-${idx}`}
              onClick={() => setOpenIdx(isOpen ? null : idx)}
              className="w-full text-left flex items-start justify-between gap-4 py-5 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-inset group"
            >
              <span className="font-display text-lg font-semibold text-brand-blue group-hover:text-brand-red transition-colors leading-snug">
                {q}
              </span>
              <span
                aria-hidden="true"
                className={`flex-shrink-0 mt-0.5 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                  isOpen
                    ? 'border-brand-red rotate-45'
                    : 'border-gray-200 group-hover:border-brand-blue'
                }`}
              >
                <svg
                  className={`w-3.5 h-3.5 ${isOpen ? 'text-brand-red' : 'text-gray-400'}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </span>
            </button>

            <div
              id={`faq-a-${idx}`}
              role="region"
              aria-labelledby={`faq-q-${idx}`}
              hidden={!isOpen}
            >
              <p className="pb-5 text-gray-600 leading-relaxed text-sm pr-11">{a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
