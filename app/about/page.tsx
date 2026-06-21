import Link from 'next/link';
import FadeIn from '@/components/FadeIn';
import { CascadeGroup, CascadeItem, WordStagger, SpringScaleIn } from '@/components/motion';
import HeroBackground from '@/components/HeroBackground';
import FadedBackgroundPhoto from '@/components/FadedBackgroundPhoto';
import CongregationGallery from '@/components/CongregationGallery';
import OurStoryImage from '@/components/OurStoryImage';
import PastorPhoto from '@/components/PastorPhoto';
import LeaderPhoto from '@/components/LeaderPhoto';

// ─── Belief icons ────────────────────────────────────────────────────────────

function BibleIcon() {
  return (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
  );
}

function TrinityIcon() {
  return (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="5" r="3" />
      <circle cx="5.5" cy="17" r="3" />
      <circle cx="18.5" cy="17" r="3" />
      <line x1="12" y1="8" x2="8.5" y2="14.5" strokeLinecap="round" />
      <line x1="12" y1="8" x2="15.5" y2="14.5" strokeLinecap="round" />
      <line x1="8.5" y1="17" x2="15.5" y2="17" strokeLinecap="round" />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M7 7h10" />
    </svg>
  );
}

function ChurchIcon() {
  return (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v4m0 0l-2-2m2 2l2-2M4 10h16M4 10v10h16V10M4 10l4-4h8l4 4M10 14h4v6h-4z" />
    </svg>
  );
}

function HandsIcon() {
  return (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
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

// ─── Social icons ─────────────────────────────────────────────────────────────

function FacebookIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
    </svg>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const beliefs = [
  {
    Icon: BibleIcon,
    title: 'The Bible',
    text: 'We believe the Holy Bible is the inspired and infallible Word of God. It is our supreme authority in all matters of faith and conduct.',
  },
  {
    Icon: TrinityIcon,
    title: 'The Trinity',
    text: 'We believe in one God, eternally existing in three persons: Father, Son, and Holy Spirit — co-equal and co-eternal in power and glory.',
  },
  {
    Icon: CrossIcon,
    title: 'Salvation',
    text: 'We believe salvation is found in Jesus Christ alone, received by grace through faith. His finished work at the cross is sufficient for all.',
  },
  {
    Icon: ChurchIcon,
    title: 'The Church',
    text: 'We believe in the Church as the body of Christ — a community of believers called to worship, grow, and serve together in unity and love.',
  },
  {
    Icon: HandsIcon,
    title: 'Prayer',
    text: 'We believe in the power of prayer as the foundation of all ministry. We are a house of prayer, interceding for Calabar and the world.',
  },
  {
    Icon: GlobeIcon,
    title: 'The Great Commission',
    text: 'We believe every believer is called to go and make disciples of all nations — across the street and across the seas.',
  },
];

const leaders: { initials: string; name: string; title: string; bg: string }[] = [];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <main>

      {/* ──────────────────── 1. PAGE HERO ──────────────────────────── */}
      <section
        className="relative flex flex-col items-center justify-center bg-brand-blue overflow-hidden"
        style={{ minHeight: '50vh' }}
        aria-label="About page hero"
      >
        <HeroBackground destination="hero_about" />

        {/* Subtle dark overlay + cross pattern to deepen the photo */}
        <div className="absolute inset-0 bg-brand-blue/80 bg-cross-pattern" aria-hidden="true" />

        <div className="relative z-10 text-center px-4 py-24 max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center justify-center gap-2 text-white/50 text-sm mb-8">
            <Link href="/" className="hover:text-white transition-colors focus:outline-none focus:underline">Home</Link>
            <span aria-hidden="true">/</span>
            <span className="text-white/80" aria-current="page">About</span>
          </nav>

          <h1 className="font-display text-5xl sm:text-6xl font-semibold text-white mb-4 leading-tight">
            Who We Are
          </h1>
          <p className="font-display italic text-brand-gold text-xl sm:text-2xl">
            Rooted in Calabar. Reaching the world.
          </p>
        </div>
      </section>

      {/* ──────────────────── 2. OUR STORY ──────────────────────────── */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden" aria-label="Our story">
        <FadedBackgroundPhoto destination="bg_our_story" />
        <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Text — left */}
          <FadeIn>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-gold mb-3">
                Our Beginnings
              </p>
              <h2 className="font-display text-4xl sm:text-5xl font-semibold text-brand-blue mb-6 leading-snug">
                Our Story
              </h2>
              {/*
                TODO: Replace with actual church history
              */}
              <p className="text-gray-600 leading-relaxed mb-5">
                The SpringHouse Church began as a small gathering of believers with a simple but
                audacious conviction: that Calabar could be transformed by the power of the Gospel.
                What started in a modest space with a handful of faithful men and women has grown,
                by God&apos;s grace, into a thriving community of faith. Our name reflects our
                identity — a house that flows with the living water of Christ, refreshing every
                soul that enters.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Under the visionary leadership of Pastor Dr Austin Mboso, we have embraced a
                calling that is simultaneously local and global. We serve our neighbours across the
                street — in the homes, schools, and markets of Calabar — while planting seeds of
                faith across the seas through missions, media, and a growing online congregation
                that spans every continent. Every chapter of our story is written by God, and the
                best chapters are still ahead.
              </p>
            </div>
          </FadeIn>

          {/* Image — right */}
          <FadeIn delay={150}>
            <div className="relative">
              {/* Gold border accent frame */}
              <div className="absolute -top-3 -right-3 w-full h-full border-2 border-brand-gold/40 rounded-2xl" aria-hidden="true" />
              <div className="relative h-80 lg:h-[460px] rounded-2xl overflow-hidden shadow-lg">
                <OurStoryImage />
              </div>
            </div>
          </FadeIn>

        </div>
      </section>

      {/* ──────────────────── 3. VISION & MISSION ───────────────────── */}
      <section className="bg-brand-cream py-20 px-4 sm:px-6 lg:px-8" aria-label="Vision and mission">
        <div className="max-w-4xl mx-auto text-center">

          {/* Watermark quotation mark */}
          <div className="relative">
            <span
              className="absolute left-1/2 -translate-x-1/2 -top-8 font-display text-brand-gold select-none pointer-events-none leading-none animate-float-gentle"
              style={{ fontSize: '200px', opacity: 0.06, lineHeight: 1, animationDuration: '30s' }}
              aria-hidden="true"
            >
              &ldquo;
            </span>

            <FadeIn>
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-gold mb-6 relative z-10">
                Our Why
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-brand-blue mb-8 relative z-10">
                Vision &amp; Mission
              </h2>
              <WordStagger
                as="p"
                text="“To bring the lost to the saving knowledge of Christ and to mature believers who will minister across the seas.”"
                className="font-display italic text-brand-blue text-2xl sm:text-3xl leading-relaxed mb-6 relative z-10"
                staggerDelay={0.03}
              />
              <p className="shimmer-gold inline-block font-display text-lg font-semibold tracking-wide relative z-10">
                Across the street, across the seas!
              </p>
            </FadeIn>
          </div>

          {/* Vision & Mission cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-14">
            <FadeIn>
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-left">
                <div className="w-10 h-10 rounded-full bg-brand-gold/10 flex items-center justify-center mb-4 text-brand-gold">
                  <GlobeIcon />
                </div>
                <h3 className="font-display text-2xl font-semibold text-brand-blue mb-3">Our Vision</h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  To see every person in Calabar and beyond come into the saving knowledge of Jesus
                  Christ, growing into disciples who transform their communities and carry the Gospel
                  to the ends of the earth.
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={120}>
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-left">
                <div className="w-10 h-10 rounded-full bg-brand-gold/10 flex items-center justify-center mb-4 text-brand-gold">
                  <CrossIcon />
                </div>
                <h3 className="font-display text-2xl font-semibold text-brand-blue mb-3">Our Mission</h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  To plant, grow, and send — planting faith in hearts, growing believers into
                  maturity, and sending them out as ministers of the Gospel to every nation, tribe,
                  and tongue.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ──────────────────── 4. WHAT WE BELIEVE ────────────────────── */}
      <section className="bg-white py-20 px-4 sm:px-6 lg:px-8" aria-label="Core beliefs">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <div className="text-center mb-14">
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-gold mb-3">
                Foundations
              </p>
              <h2 className="font-display text-4xl sm:text-5xl font-semibold text-brand-blue">
                Our Core Beliefs
              </h2>
            </div>
          </FadeIn>

          <CascadeGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {beliefs.map(({ Icon, title, text }) => (
              <CascadeItem key={title}>
                <div className="group bg-brand-cream rounded-2xl p-8 hover:shadow-md transition-shadow border border-transparent hover:border-brand-gold/20 h-full">
                  <div className="w-12 h-12 rounded-full bg-brand-gold/10 flex items-center justify-center mb-5 text-brand-gold group-hover:bg-brand-gold/20 transition-all duration-300 ease-out group-hover:rotate-[15deg] group-hover:scale-[1.15]">
                    <Icon />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-brand-blue mb-3">
                    {title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{text}</p>
                </div>
              </CascadeItem>
            ))}
          </CascadeGroup>
        </div>
      </section>

      {/* ──────────────────── 5. MEET THE PASTOR ────────────────────── */}
      <section className="relative river-bg py-20 px-4 sm:px-6 lg:px-8 overflow-hidden" aria-label="Meet the pastor">
        <FadedBackgroundPhoto destination="bg_pastor" opacity={0.35} />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <FadeIn>
            {/* Circular image placeholder with gold ring */}
            <SpringScaleIn className="mx-auto mb-8 w-44 h-44 rounded-full ring-4 ring-brand-gold ring-offset-4 ring-offset-brand-blue overflow-hidden bg-brand-blue/50 flex items-center justify-center flex-shrink-0">
              <PastorPhoto />
            </SpringScaleIn>

            <h2 className="font-display text-4xl sm:text-5xl font-semibold text-white mb-2">
              Dr Austin Mboso
            </h2>
            <p className="font-display italic text-brand-gold text-lg mb-8">
              Senior Pastor, The SpringHouse Church
            </p>

            {/* TODO: Replace with real bio */}
            <div className="text-white/75 leading-relaxed space-y-4 text-left sm:text-center">
              <p>
                Dr Austin Mboso is a man marked by a profound love for God and a burning passion
                for the lost. Called into ministry at a young age, he has dedicated his life to
                building a church that is rooted in the Word of God and responsive to the moving
                of the Holy Spirit. His preaching is characterised by clarity, depth, and a
                compassion that draws people from every walk of life.
              </p>
              <p>
                With a strong academic foundation in theology and ministry leadership, Dr Mboso
                brings both intellectual rigour and spiritual fervour to his pastoral role. He
                believes that the Church is God&apos;s primary vehicle for transformation in
                society — and under his leadership, The SpringHouse Church has grown into a
                community known for its warmth, excellence in worship, and commitment to service
                both locally in Calabar and globally through missions and online ministry.
              </p>
              <p>
                His vision is simple and all-encompassing: to see every person encounter Jesus
                Christ and become a disciple who makes disciples. Pastor Austin is also a devoted
                husband and father, a role he considers his most sacred calling alongside his
                ministry to the Church and the world.
              </p>
            </div>

            {/* Social links */}
            <div className="flex items-center justify-center gap-5 mt-8">
              {/* TODO: Replace with real social URLs */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Dr Austin Mboso on Facebook"
                className="text-white/60 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white rounded"
              >
                <FacebookIcon />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Dr Austin Mboso on Instagram"
                className="text-white/60 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white rounded"
              >
                <InstagramIcon />
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ──────────────────── 6. LEADERSHIP TEAM ────────────────────── */}
      {leaders.length > 0 && (
        <section className="bg-brand-cream py-20 px-4 sm:px-6 lg:px-8" aria-label="Leadership team">
          <div className="max-w-5xl mx-auto">
            <FadeIn>
              <div className="text-center mb-14">
                <p className="text-xs font-semibold uppercase tracking-widest text-brand-gold mb-3">
                  The Team
                </p>
                <h2 className="font-display text-4xl sm:text-5xl font-semibold text-brand-blue">
                  Our Leadership
                </h2>
              </div>
            </FadeIn>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {leaders.map(({ initials, name, title, bg }, i) => (
                <FadeIn key={title} delay={i * 100}>
                  <div className="text-center">
                    <LeaderPhoto
                      destination={(['leadership_1_photo', 'leadership_2_photo', 'leadership_3_photo'] as const)[i]}
                      name={name}
                      initials={initials}
                      bg={bg}
                    />
                    <h3 className="font-display text-xl font-semibold text-brand-blue mb-1">{name}</h3>
                    <p className="text-gray-500 text-sm">{title}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ──────────────────── 7. NEW HERE? ───────────────────────────── */}
      <section className="bg-brand-red py-20 px-4 sm:px-6 lg:px-8" aria-label="First time visitor">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <div className="text-center mb-14">
              <h2 className="font-display text-4xl sm:text-5xl font-semibold text-white mb-4">
                Visiting for the First Time?
              </h2>
              <p className="text-white/75 max-w-xl mx-auto leading-relaxed">
                We&apos;re so glad you&apos;re here. Here&apos;s what to expect when you join us.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
            {[
              {
                step: '1',
                title: 'Arrive & Be Welcomed',
                desc: 'Our welcome team will greet you at the door with a warm smile. Come as you are — we are a warm, accepting family where everyone belongs.',
              },
              {
                step: '2',
                title: 'Join a Service',
                desc: 'Experience powerful worship and life-changing teaching. Our Sunday service holds every week at 9:00 AM, and our Midweek service is every Wednesday at 5:00 PM. All are welcome.',
              },
              {
                step: '3',
                title: 'Connect with Us',
                desc: 'Chat with a team member after service, fill in a connection card, or reach us online. We would love to get to know you and journey with you.',
              },
            ].map(({ step, title, desc }, i) => (
              <FadeIn key={step} delay={i * 100}>
                <div className="text-center">
                  <div className="mx-auto mb-5 w-12 h-12 rounded-full bg-brand-gold flex items-center justify-center">
                    <span className="font-display text-xl font-bold text-white">{step}</span>
                  </div>
                  <h3 className="font-display text-xl font-semibold text-white mb-3">{title}</h3>
                  <p className="text-white/75 text-sm leading-relaxed">{desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={300}>
            <div className="text-center mt-14 space-y-4">
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center px-8 py-3.5 border-2 border-white text-white font-medium rounded-full hover:bg-white hover:text-brand-red transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-brand-red"
                >
                  Plan Your Visit →
                </Link>
                <Link
                  href="/new-member"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-brand-red font-semibold rounded-full hover:bg-brand-gold hover:text-white transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-brand-red"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                  Register as New Member
                </Link>
              </div>
              <p className="text-white/50 text-sm">
                Already received your welcome pack? Scan the QR code or register above.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      <CongregationGallery />

    </main>
  );
}
