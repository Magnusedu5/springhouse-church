import type { Metadata } from 'next';
import Link from 'next/link';
import FadeIn from '@/components/FadeIn';
import PrayerForm from '@/components/PrayerForm';
import ContactForm from '@/components/ContactForm';
import OnlineMembersForm from '@/components/OnlineMembersForm';
import { DriftIn, KenBurnsIn } from '@/components/motion';
import HeroBackground from '@/components/HeroBackground';

export const metadata: Metadata = {
  title: 'Get in Touch — The SpringHouse Church',
  description:
    "We'd love to hear from you — whether you're across the street or across the seas. Contact The SpringHouse Church, Calabar, Nigeria.",
  openGraph: {
    title: 'Get in Touch — The SpringHouse Church',
    description:
      "We'd love to hear from you — whether you're across the street or across the seas.",
  },
};

// ── SVG social icons ──────────────────────────────────────────────────────────

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

function YouTubeIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 01-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 01-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 011.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418zM15.194 12L10 15V9l5.194 3z" clipRule="evenodd" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg className="w-5 h-5 flex-shrink-0 text-brand-gold mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg className="w-5 h-5 flex-shrink-0 text-brand-gold mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg className="w-5 h-5 flex-shrink-0 text-brand-gold mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.338c0-1.243 1.154-2.138 2.371-1.857a17.953 17.953 0 015.925 2.26 17.614 17.614 0 014.692 4.693 17.952 17.952 0 012.261 5.925c.28 1.218-.615 2.37-1.857 2.37h-2.002c-.95 0-1.766-.68-1.956-1.613a13.46 13.46 0 00-.763-2.726.496.496 0 01.112-.523l1.433-1.433c.215-.216.267-.545.124-.816a15.408 15.408 0 00-3.37-4.294 15.407 15.407 0 00-4.294-3.37.484.484 0 00-.816.124L4.477 6.337a.496.496 0 01-.523.112 13.46 13.46 0 00-2.726-.763A1.97 1.97 0 01.25 3.73V2.25" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg className="w-5 h-5 flex-shrink-0 text-brand-gold mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ContactPage() {
  return (
    <main>
      {/* ══ SECTION 1: HERO ══════════════════════════════════════════════════ */}
      <section
        className="relative flex flex-col items-center justify-center text-center px-4 bg-brand-blue overflow-hidden"
        style={{ minHeight: '40vh' }}
        aria-label="Contact page hero"
      >
        <HeroBackground destination="hero_contact" />
        <div className="absolute inset-0 bg-brand-blue/80" aria-hidden="true" />
        <div className="absolute inset-0 bg-cross-pattern opacity-10" aria-hidden="true" />
        <div className="relative z-10 max-w-2xl mx-auto py-20">
          <FadeIn>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-gold mb-4">
              Reach Out
            </p>
            <h1 className="font-display text-5xl sm:text-6xl font-semibold text-white mb-4 leading-tight">
              Get in Touch
            </h1>
            <p className="text-white/70 text-lg sm:text-xl max-w-md mx-auto">
              We&apos;d love to hear from you — whether you&apos;re across the street or across the seas.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ══ SECTION 2: CONTACT DETAILS + MAP ════════════════════════════════ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white" aria-label="Contact details and location">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

          {/* Left: Contact info */}
          <div className="space-y-7">
            <DriftIn direction="left">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-brand-gold mb-5">
                  Find Us
                </p>
                <h2 className="font-display text-4xl font-semibold text-brand-blue mb-8 leading-snug">
                  Visit The SpringHouse Church
                </h2>
              </div>
            </DriftIn>

            {/* Address */}
            <DriftIn direction="left" delay={0.1}>
              <div className="flex gap-3">
                <MapPinIcon />
                <div>
                  <p className="text-sm font-semibold text-brand-blue mb-0.5">Address</p>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    137 Ndidem Usang Iso (Parliamentary Extension),<br />
                    Calabar, Cross River State, Nigeria
                  </p>
                </div>
              </div>
            </DriftIn>

            {/* Service times */}
            <DriftIn direction="left" delay={0.2}>
              <div className="flex gap-3">
                <ClockIcon />
                <div>
                  <p className="text-sm font-semibold text-brand-blue mb-1">Service Times</p>
                  <div className="space-y-0.5 text-sm text-gray-600">
                    <p><span className="font-medium text-brand-blue">Sunday Service:</span> 9:00 AM</p>
                    <p><span className="font-medium text-brand-blue">Midweek Service:</span> Wednesdays 5:00 PM</p>
                  </div>
                </div>
              </div>
            </DriftIn>

            {/* Phone — TODO */}
            <DriftIn direction="left" delay={0.3}>
              <div className="flex gap-3">
                <PhoneIcon />
                <div>
                  <p className="text-sm font-semibold text-brand-blue mb-0.5">Phone</p>
                  {/* TODO: Add phone number */}
                  <p className="text-gray-400 text-sm italic">Coming soon</p>
                </div>
              </div>
            </DriftIn>

            {/* Email — TODO */}
            <DriftIn direction="left" delay={0.4}>
              <div className="flex gap-3">
                <MailIcon />
                <div>
                  <p className="text-sm font-semibold text-brand-blue mb-0.5">Email</p>
                  {/* TODO: Add email address */}
                  <p className="text-gray-400 text-sm italic">Coming soon</p>
                </div>
              </div>
            </DriftIn>

            {/* Social links */}
            <DriftIn direction="left" delay={0.5}>
              <div>
                <p className="text-sm font-semibold text-brand-blue mb-3">Follow Us</p>
                <div className="flex gap-3">
                  {[
                    { label: 'Facebook', icon: <FacebookIcon />, href: '#' /* TODO */ },
                    { label: 'Instagram', icon: <InstagramIcon />, href: '#' /* TODO */ },
                    { label: 'YouTube', icon: <YouTubeIcon />, href: '#' /* TODO */ },
                  ].map(({ label, icon, href }) => (
                    <a
                      key={label}
                      href={href}
                      aria-label={label}
                      className="w-10 h-10 rounded-full bg-brand-blue/5 flex items-center justify-center text-brand-blue hover:bg-brand-red hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    >
                      {icon}
                    </a>
                  ))}
                </div>
              </div>
            </DriftIn>

            {/* Online note */}
            <DriftIn direction="left" delay={0.6}>
              <div className="bg-brand-blue/5 rounded-xl p-4 border-l-4 border-brand-blue">
                <p className="text-sm text-brand-blue leading-relaxed">
                  <span className="font-semibold">Can&apos;t make it in person?</span> Our services are streamed
                  live every Sunday. Join our global family online.
                </p>
              </div>
            </DriftIn>
          </div>

          {/* Right: Google Maps embed */}
          <KenBurnsIn fromScale={0.97} duration={0.8}>
            <div
              className="rounded-2xl overflow-hidden border-2 border-brand-gold/30 shadow-sm"
              style={{ height: '400px' }}
              aria-label="Map showing The SpringHouse Church location in Calabar"
            >
              {/*
                TODO: Update coordinates with exact location.
                Current coordinates: 4.9757° N, 8.3417° E (Calabar, CRS — approximate).
                To use the Embed API with a real API key, replace the src below with:
                  https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=4.9757,8.3417
              */}
              <iframe
                src="https://maps.google.com/maps?q=4.9757,8.3417&z=15&output=embed"
                width="100%"
                height="100%"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="The SpringHouse Church location map"
                className="border-0"
              />
            </div>
          </KenBurnsIn>
        </div>
      </section>

      {/* ══ SECTION 3: CONTACT FORM ══════════════════════════════════════════ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-brand-cream" aria-label="Contact form">
        <div className="max-w-2xl mx-auto">
          <FadeIn>
            <div className="text-center mb-10">
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-gold mb-3">
                Write to Us
              </p>
              <h2 className="font-display text-4xl font-semibold text-brand-blue mb-3">
                Send Us a Message
              </h2>
              <p className="text-gray-500 leading-relaxed">
                Fill in the form below and a member of our team will respond as soon as possible.
              </p>
            </div>
            <ContactForm />
          </FadeIn>
        </div>
      </section>

      {/* ══ SECTION 4: PRAYER REQUEST ════════════════════════════════════════ */}
      <section
        id="prayer"
        className="py-16 px-4 sm:px-6 lg:px-8 bg-brand-blue"
        aria-label="Prayer request"
      >
        <div className="max-w-2xl mx-auto">
          <FadeIn>
            <div className="text-center mb-10">
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-gold mb-3">
                Prayer
              </p>
              <h2 className="font-display text-4xl font-semibold text-white mb-3">
                We&apos;re Standing in Agreement With You
              </h2>
              <p className="text-white/70 leading-relaxed">
                Our dedicated prayer team reads and prays over every request submitted here.
                You are not alone.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={80}>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-7 sm:p-10">
              <PrayerForm />
            </div>
          </FadeIn>

          <FadeIn delay={120}>
            <p className="text-center text-white/50 text-sm mt-8">
              You can also email your requests to{' '}
              <a
                href="mailto:prayer@springhousechurch.org"
                className="text-white/70 hover:text-white underline underline-offset-2 transition-colors focus:outline-none"
              >
                prayer@springhousechurch.org
              </a>
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ══ SECTION 5: ONLINE MEMBERS CTA ════════════════════════════════════ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-brand-cream" aria-label="Online members registration">
        <div className="max-w-2xl mx-auto">
          <FadeIn>
            <div className="text-center mb-10">
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-gold mb-3">
                Global Family
              </p>
              <h2 className="font-display text-4xl font-semibold text-brand-blue mb-4">
                Part of Our Global Family?
              </h2>
              <p className="text-gray-500 leading-relaxed">
                Thousands of members join us virtually every Sunday from across Nigeria and beyond.
                If you&apos;re watching online and want to officially connect with The SpringHouse Church,
                fill in the form below.
              </p>
            </div>
            <OnlineMembersForm />
          </FadeIn>
        </div>
      </section>

      {/* ══ QUICK LINKS ══════════════════════════════════════════════════════ */}
      <section className="py-10 px-4 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-400">
          <Link href="/sermons" className="hover:text-brand-blue transition-colors focus:outline-none focus:underline">Watch Sermons</Link>
          <span aria-hidden="true" className="hidden sm:inline">·</span>
          <Link href="/events" className="hover:text-brand-blue transition-colors focus:outline-none focus:underline">Upcoming Events</Link>
          <span aria-hidden="true" className="hidden sm:inline">·</span>
          <Link href="/give" className="hover:text-brand-blue transition-colors focus:outline-none focus:underline">Give to the Mission</Link>
          <span aria-hidden="true" className="hidden sm:inline">·</span>
          <Link href="/ministries" className="hover:text-brand-blue transition-colors focus:outline-none focus:underline">Join a Ministry</Link>
        </div>
      </section>
    </main>
  );
}
