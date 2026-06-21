import Link from 'next/link';
import { DriftIn } from '@/components/motion';

const steps = [
  {
    number: '01',
    title: 'Attend a Service',
    body: 'Join us every Sunday at 9 AM in Calabar — or watch live online. Come exactly as you are.',
  },
  {
    number: '02',
    title: 'Receive Your Welcome Pack',
    body: 'Our welcome team will greet you and hand you a pack that includes everything you need to get connected — including your registration link.',
  },
  {
    number: '03',
    title: 'Scan & Register',
    body: 'Use the QR code in your welcome pack — or the button below — to register and officially become part of The SpringHouse Church family.',
  },
];

export default function NewHereSection() {
  return (
    <section
      className="relative bg-brand-blue py-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
      aria-label="New here — join the family"
    >
      {/* Warm ambient glow */}
      <div
        className="absolute -left-40 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(212,160,23,0.12) 0%, transparent 70%)' }}
        aria-hidden="true"
      />
      <div
        className="absolute -right-40 bottom-0 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(180,60,30,0.10) 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      {/* Faint cross watermark */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.04] pointer-events-none"
        aria-hidden="true"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 200 200"
      >
        <rect x="92" y="20" width="16" height="160" fill="#D4A017" />
        <rect x="30" y="76" width="140" height="16" fill="#D4A017" />
      </svg>

      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">

        {/* Left — copy */}
        <DriftIn direction="left">
          <div>
            <span className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 rounded-full bg-brand-gold/15 border border-brand-gold/30 text-brand-gold text-xs font-semibold uppercase tracking-widest">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path d="M10 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM6 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM1.49 15.326a.78.78 0 0 1-.358-.442 3 3 0 0 1 4.308-3.516 6.484 6.484 0 0 0-1.905 3.959c-.023.222-.014.442.025.654a4.97 4.97 0 0 1-2.07-.655ZM16.44 15.98a4.97 4.97 0 0 0 2.07-.654.78.78 0 0 0 .357-.442 3 3 0 0 0-4.308-3.517 6.484 6.484 0 0 1 1.907 3.96 2.32 2.32 0 0 1-.026.654ZM18 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM5.304 16.19a.844.844 0 0 1-.277-.71 5 5 0 0 1 9.947 0 .843.843 0 0 1-.277.71A6.975 6.975 0 0 1 10 18a6.974 6.974 0 0 1-4.696-1.81Z" />
              </svg>
              New to SpringHouse?
            </span>

            <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-5 leading-tight">
              Your First Step<br />
              Into the Family
            </h2>

            <p className="text-white/70 leading-relaxed mb-8 text-lg">
              Everyone who calls The SpringHouse Church home started exactly where you are now.
              We&apos;re a warm, Spirit-filled family and we&apos;d love for you to take that
              first step with us.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/new-member"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-brand-gold text-white font-semibold rounded-full hover:bg-brand-gold/90 transition-all shadow-lg shadow-brand-gold/20 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2 focus:ring-offset-brand-blue"
              >
                Register as New Member
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center px-7 py-3.5 border border-white/30 text-white/80 font-medium rounded-full hover:border-white hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-brand-blue"
              >
                Learn About Us
              </Link>
            </div>
          </div>
        </DriftIn>

        {/* Right — 3 steps */}
        <DriftIn direction="right" delay={0.15}>
          <div className="flex flex-col gap-4">
            {steps.map(({ number, title, body }) => (
              <div
                key={number}
                className="group flex gap-5 items-start bg-white/5 hover:bg-white/10 border border-white/10 hover:border-brand-gold/30 rounded-2xl px-6 py-5 transition-all duration-300"
              >
                <span className="flex-shrink-0 font-display text-3xl font-bold text-brand-gold/40 group-hover:text-brand-gold/70 transition-colors leading-none mt-0.5 select-none">
                  {number}
                </span>
                <div>
                  <h3 className="font-display text-lg font-semibold text-white mb-1.5">{title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </DriftIn>

      </div>
    </section>
  );
}
