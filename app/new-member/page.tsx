import type { Metadata } from 'next';
import MemberRegistrationForm from '@/components/MemberRegistrationForm';
import FadedBackgroundPhoto from '@/components/FadedBackgroundPhoto';

export const metadata: Metadata = {
  title: 'New Member Registration | The SpringHouse Church',
  description: 'Welcome to the family! Register as a new member of The SpringHouse Church.',
};

export default function NewMemberPage() {
  return (
    <>
      {/* Hero banner */}
      <section
        data-navbar-dark
        className="relative bg-brand-blue py-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
      >
        <FadedBackgroundPhoto destination="bg_who_we_are" />

        {/* Gold cross watermark */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.05] pointer-events-none"
          aria-hidden="true"
          preserveAspectRatio="xMidYMid slice"
          viewBox="0 0 200 200"
        >
          <rect x="92" y="20" width="16" height="160" fill="#D4A017" />
          <rect x="30" y="76" width="140" height="16" fill="#D4A017" />
        </svg>

        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px w-8 bg-brand-gold" />
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-gold">Welcome Package</p>
            <div className="h-px w-8 bg-brand-gold" />
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
            You&rsquo;re Part of the Family
          </h1>
          <p className="text-white/70 leading-relaxed text-lg">
            We are so glad you&rsquo;re here. Take a moment to register so we can
            stay connected and walk this journey together.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="bg-brand-warm py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Intro card */}
          <div className="bg-white rounded-2xl border border-brand-gold/20 shadow-sm px-6 py-5 mb-10 flex gap-4 items-start">
            <div className="mt-0.5 flex-shrink-0 w-9 h-9 rounded-full bg-brand-gold/15 flex items-center justify-center">
              <svg className="w-5 h-5 text-brand-gold" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-brand-blue mb-1">All fields are optional</p>
              <p className="text-sm text-gray-500 leading-relaxed">
                Share only what you are comfortable with. Your information is kept
                securely and will only be used to help us serve you better as part of
                our church community.
              </p>
            </div>
          </div>

          <MemberRegistrationForm memberType="new" />
        </div>
      </section>
    </>
  );
}
