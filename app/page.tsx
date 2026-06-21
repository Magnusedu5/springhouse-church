import Image from 'next/image';
import Link from 'next/link';
import LiveStreamBanner from '@/components/LiveStreamBanner';
import GiveButton from '@/components/GiveButton';
import PrayerForm from '@/components/PrayerForm';
import FadeIn from '@/components/FadeIn';
import SermonSection from '@/components/SermonSection';
import EventsSection from '@/components/EventsSection';
import NewHereSection from '@/components/NewHereSection';
import HeroSection from '@/components/HeroSection';
import CountUp from '@/components/CountUp';
import { DriftIn } from '@/components/motion';
import FadedBackgroundPhoto from '@/components/FadedBackgroundPhoto';
import WhoWeAreImage from '@/components/WhoWeAreImage';

export default function HomePage() {
  return (
    <>
      {/* ─────────────────────────── 1. HERO ─────────────────────────── */}
      <HeroSection />

      {/* ─────────────────── 2. LIVE STREAM BANNER ───────────────────── */}
      <LiveStreamBanner isLive={false} streamUrl="" />

      {/* ─────────────────────── 3. WHO WE ARE ───────────────────────── */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-brand-warm overflow-hidden" aria-label="Who we are">
        <FadedBackgroundPhoto destination="bg_who_we_are" />
        <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left: Image */}
          <DriftIn direction="left">
            <div className="relative h-80 lg:h-[500px] rounded-2xl overflow-hidden shadow-lg">
              <WhoWeAreImage />
            </div>
          </DriftIn>

          {/* Right: Text */}
          <DriftIn direction="right" delay={0.15}>
            <div>
              <div className="flex items-center mb-3 gap-3">
                <div className="h-px w-8 bg-brand-gold" />
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-gold">Our Heart</p>
              </div>
              <h2 className="font-display text-4xl sm:text-5xl font-bold text-brand-blue mb-6 leading-[1.2]">
                A Church for Every Nation
              </h2>
              <p className="text-gray-600 leading-relaxed mb-5">
                To bring the lost to the saving knowledge of Christ and to mature believers who
                will minister across the seas. The SpringHouse Church was founded with a heart
                for Calabar and a vision that reaches far beyond our city — to every nation on earth.
              </p>
              <p className="font-display italic text-brand-gold text-lg mb-8 pl-4 border-l-2 border-brand-gold">
                &ldquo;All the ends of the world shall remember and turn to the Lord.&rdquo;
                <span className="block text-sm mt-1 not-italic">— Matthew 28:19</span>
              </p>
              <Link
                href="/about"
                className="inline-flex items-center text-brand-red font-medium hover:text-brand-blue transition-colors focus:outline-none focus:underline"
              >
                Meet Our Pastor →
              </Link>
            </div>
          </DriftIn>
        </div>
      </section>

      {/* ─────────────────── 4. LATEST SERMON ────────────────────────── */}
      <FadeIn>
        <SermonSection />
      </FadeIn>

      {/* ─────────────────── 5. UPCOMING EVENTS ──────────────────────── */}
      <FadeIn>
        <EventsSection />
      </FadeIn>

      {/* ──────────── 6. NEW HERE / FIRST STEPS ─────────────────────── */}
      <FadeIn>
        <NewHereSection />
      </FadeIn>

      {/* ───────────────────────── 7. GIVE ───────────────────────────── */}
      <FadeIn>
        <section
          data-navbar-dark
          className="relative py-20 px-4 sm:px-6 lg:px-8 bg-brand-blue overflow-hidden"
          aria-label="Sow a Seed"
        >
          <FadedBackgroundPhoto destination="bg_give" />

          {/* Gold cross watermark */}
          <svg
            className="absolute inset-0 w-full h-full opacity-[0.06] pointer-events-none animate-float-gentle"
            aria-hidden="true"
            preserveAspectRatio="xMidYMid slice"
            viewBox="0 0 200 200"
          >
            <rect x="92" y="20" width="16" height="160" fill="#D4A017" />
            <rect x="30" y="76" width="140" height="16" fill="#D4A017" />
          </svg>

          <div className="relative z-10 max-w-5xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="text-center lg:text-left max-w-xl">
              <h2 className="font-display text-4xl sm:text-5xl font-bold mb-5 leading-[1.2] shimmer-gold inline-block">
                Support the Mission
              </h2>
              <p className="text-white/70 leading-relaxed mb-4">
                Your giving enables ministry across the street — in Calabar&apos;s homes, schools,
                and communities — and across the seas, funding missionaries and reaching thousands
                of online members around the globe. Every gift makes a difference.
              </p>
              <p className="text-white/90 text-sm">
                {/* TODO: Replace with real stats from API */}
                <CountUp end={2000} suffix="+" className="text-brand-gold font-display text-2xl font-semibold" />
                {' '}members online
              </p>
            </div>
            <div className="flex-shrink-0">
              <GiveButton variant="primary" size="lg" label="Sow a Seed" />
            </div>
          </div>
        </section>
      </FadeIn>

      {/* ─────────────────── 8. PRAYER REQUEST ───────────────────────── */}
      <FadeIn>
        <section data-navbar-dark className="river-bg-slow py-20 px-4 sm:px-6 lg:px-8" aria-label="Prayer request">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-gold mb-3">
              Prayer
            </p>
            <h2 className="font-display text-4xl sm:text-5xl font-semibold text-white mb-4">
              We&apos;re Praying With You
            </h2>
            <p className="text-white/70 mb-10 leading-relaxed">
              Send us your prayer request. Our prayer team prays over every submission.
            </p>
            <PrayerForm />
          </div>
        </section>
      </FadeIn>
    </>
  );
}
