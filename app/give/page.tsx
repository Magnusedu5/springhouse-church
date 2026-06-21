import type { Metadata } from 'next';
import Link from 'next/link';
import FadeIn from '@/components/FadeIn';
import GiveTabs from '@/components/GiveTabs';
import GiveFAQ from '@/components/GiveFAQ';
import { ScriptureReveal, CascadeGroup, CascadeItem, BounceIcon } from '@/components/motion';
import HeroBackground from '@/components/HeroBackground';

export const metadata: Metadata = {
  title: 'Sow a Seed — The SpringHouse Church',
  description:
    'Support the work of The SpringHouse Church across the street and across the seas. Your giving fuels local ministry, online ministry, and global missions.',
  openGraph: {
    title: 'Sow a Seed — The SpringHouse Church',
    description:
      'Your giving fuels ministry across the street and across the seas.',
  },
};

// ── Inline SVG icons for Why We Give cards ───────────────────────────────────

function HouseIcon() {
  return (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M3 12h18" />
    </svg>
  );
}

// ── Why We Give data ──────────────────────────────────────────────────────────

const WHY_CARDS = [
  {
    icon: <HouseIcon />,
    title: 'Local Ministry',
    tagline: 'Serving our community in Calabar',
    description:
      'Your giving funds Sunday services, children\'s and youth programmes, and community outreach right here in Calabar. Every gift serves our neighbourhood and strengthens the local body.',
  },
  {
    icon: <GlobeIcon />,
    title: 'Online Ministry',
    tagline: 'Reaching virtual members across Nigeria and the world',
    description:
      'Thousands of members join us online every week from across Nigeria and beyond. Your giving sustains the infrastructure — streaming, digital resources, and pastoral care — that keeps our global family connected.',
  },
  {
    icon: <CrossIcon />,
    title: 'Missions',
    tagline: 'Supporting missionaries and global outreach',
    description:
      'We partner with missionaries and mission organisations to carry the Gospel to unreached people. Your giving extends the reach of The SpringHouse Church across the street and across the seas.',
  },
] as const;

// ── Page ──────────────────────────────────────────────────────────────────────

export default function GivePage() {
  return (
    <main>
      {/* ══ SECTION 1: HERO ══════════════════════════════════════════════════ */}
      <section
        className="river-bg relative flex flex-col items-center justify-center text-center px-4 overflow-hidden"
        style={{ minHeight: '50vh' }}
        aria-label="Give page hero"
      >
        <HeroBackground destination="hero_give" />
        <div className="absolute inset-0 bg-brand-blue/70" aria-hidden="true" />
        <div className="absolute inset-0 bg-cross-pattern opacity-10" aria-hidden="true" />
        <div className="relative z-10 max-w-2xl mx-auto py-24">
          <FadeIn>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-gold mb-5">
              Partner With Us
            </p>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-semibold text-white mb-6 leading-tight">
              Sow a Seed
            </h1>
            <p className="text-white/70 text-lg sm:text-xl mb-8">
              Your giving fuels ministry across the street and across the seas.
            </p>
            {/* Scripture reference */}
            <ScriptureReveal>
              <blockquote className="font-display italic text-brand-gold text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
                &ldquo;Each of you should give what you have decided in your heart to give, not
                reluctantly or under compulsion, for God loves a cheerful giver.&rdquo;
                <footer className="mt-2 text-brand-gold/70 text-sm not-italic">
                  — 2 Corinthians 9:7
                </footer>
              </blockquote>
            </ScriptureReveal>
          </FadeIn>
        </div>
      </section>

      {/* ══ SECTION 2: WHY WE GIVE ═══════════════════════════════════════════ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white" aria-label="Why we give">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <div className="text-center mb-14">
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-gold mb-3">
                Your Impact
              </p>
              <h2 className="font-display text-4xl sm:text-5xl font-semibold text-brand-blue">
                Why We Sow
              </h2>
            </div>
          </FadeIn>

          <CascadeGroup className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {WHY_CARDS.map(({ icon, title, tagline, description }) => (
              <CascadeItem key={title}>
                <div className="flex flex-col items-center text-center p-8 rounded-2xl border border-gray-100 bg-brand-cream h-full hover:shadow-md transition-shadow">
                  <BounceIcon className="w-16 h-16 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold mb-6">
                    {icon}
                  </BounceIcon>
                  <h3 className="font-display text-2xl font-semibold text-brand-blue mb-1">
                    {title}
                  </h3>
                  <p className="text-xs font-semibold uppercase tracking-widest text-brand-gold mb-4">
                    {tagline}
                  </p>
                  <p className="text-gray-500 leading-relaxed text-sm">{description}</p>
                </div>
              </CascadeItem>
            ))}
          </CascadeGroup>
        </div>
      </section>

      {/* ══ SECTION 3: HOW TO GIVE ═══════════════════════════════════════════ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-brand-cream" aria-label="How to give">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <div className="text-center mb-12">
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-gold mb-3">
                Sow Now
              </p>
              <h2 className="font-display text-4xl sm:text-5xl font-semibold text-brand-blue mb-3">
                How to Sow
              </h2>
              <p className="text-gray-500 leading-relaxed">
                Choose the giving method that works best for you.
              </p>
            </div>
          </FadeIn>
          <FadeIn delay={80}>
            <GiveTabs />
          </FadeIn>
        </div>
      </section>

      {/* ══ SECTION 4: TESTIMONY CTA ═════════════════════════════════════════ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-brand-blue" aria-label="Share your testimony">
        <div className="max-w-3xl mx-auto text-center">
          <FadeIn>
            {/* Gold cross watermark */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
                <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="#D4A017" strokeWidth="0.5" opacity="0.12">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M3 12h18" />
                </svg>
              </div>
              <div className="relative z-10">
                <p className="text-xs font-semibold uppercase tracking-widest text-brand-gold mb-4">
                  Testimonies
                </p>
                <h2 className="font-display text-4xl sm:text-5xl font-semibold text-white mb-6 leading-tight">
                  Has Your Giving Made a Difference?
                </h2>
                <p className="text-white/70 leading-relaxed mb-8 max-w-xl mx-auto">
                  We love to hear how the ministry of The SpringHouse Church has touched your life.
                  Your story encourages others to give and trust God with their resources.
                </p>
                <Link
                  href="/contact?subject=Testimony"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-gold text-white font-display font-semibold uppercase tracking-widest text-sm rounded-full hover:bg-yellow-600 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2 focus:ring-offset-brand-blue"
                >
                  Share Your Testimony →
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══ SECTION 5: FAQ ═══════════════════════════════════════════════════ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white" aria-label="Frequently asked questions">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <div className="text-center mb-12">
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-gold mb-3">
                Questions
              </p>
              <h2 className="font-display text-4xl sm:text-5xl font-semibold text-brand-blue">
                Frequently Asked Questions
              </h2>
            </div>
          </FadeIn>
          <FadeIn delay={60}>
            <GiveFAQ />
          </FadeIn>

          {/* Still have questions */}
          <FadeIn delay={100}>
            <div className="mt-12 text-center">
              <p className="text-gray-400 text-sm mb-3">Still have questions?</p>
              <Link
                href="/contact"
                className="text-sm font-medium text-brand-red hover:text-brand-blue transition-colors focus:outline-none focus:underline"
              >
                Get in touch with us →
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </main>
  );
}
