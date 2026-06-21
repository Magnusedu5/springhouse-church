'use client';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion } from 'framer-motion';
import DecorativeDoves from './DecorativeDoves';
import HeroBackground from './HeroBackground';
import usePrefersReducedMotion from '@/lib/usePrefersReducedMotion';

const ParticleField = dynamic(() => import('./ParticleField'), { ssr: false });

export default function HeroSection() {
  const reduced = usePrefersReducedMotion();

  return (
    <section
      aria-label="Hero"
      data-navbar-dark
      className="relative h-screen -mt-20 flex flex-col items-center justify-center bg-brand-blue overflow-hidden"
    >
      <HeroBackground destination="hero_home" />

      {/* Warm layered overlay */}
      <div className="absolute inset-0 bg-brand-blue/80" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#3D1F08]/70 via-transparent to-transparent" aria-hidden="true" />

      {/* Particle field — embers rising, prayers ascending */}
      <ParticleField />

      {/* Decorative doves crossing the upper third */}
      <DecorativeDoves />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-brand-gold mb-5">
          Welcome to
        </p>
        <h1
          className={`font-display font-bold text-white leading-[1.15] mb-6 ${reduced ? '' : 'animate-breath'}`}
          style={{ fontSize: 'clamp(2.75rem, 9vw, 5.5rem)' }}
        >
          The SpringHouse Church
        </h1>
        <motion.p
          className="font-display italic text-amber-100/90 mb-10"
          style={{ fontSize: 'clamp(1.35rem, 3.2vw, 2rem)' }}
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: reduced ? 0 : 0.8 }}
        >
          Across the street, across the seas!
        </motion.p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: reduced ? 0 : 0.2, ease: 'easeOut' }}
          >
            <Link
              href="/contact"
              className="inline-flex items-center px-9 py-4 bg-gradient-to-br from-brand-red to-[#943E22] text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:from-[#c4633e] hover:to-[#7a3018] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-brand-blue"
            >
              Plan Your Visit
            </Link>
          </motion.div>
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: reduced ? 0 : 0.4, ease: 'easeOut' }}
          >
            <Link
              href="/sermons"
              className="inline-flex items-center px-9 py-4 border-2 border-brand-gold text-brand-gold font-semibold rounded-full hover:bg-brand-gold hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2 focus:ring-offset-brand-blue"
            >
              Watch Sermons
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Bouncing scroll chevron */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-white/60"
        aria-hidden="true"
      >
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}
