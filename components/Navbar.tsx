'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import usePrefersReducedMotion from '@/lib/usePrefersReducedMotion';
import SiteLogo from '@/components/SiteLogo';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/sermons', label: 'Sermons' },
  { href: '/ministries', label: 'Ministries' },
  { href: '/events', label: 'Events' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];

const NAV_H = 80; // matches h-20

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const pathname = usePathname();
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    function update() {
      setScrolled(window.scrollY > 60);
      // Check if any section tagged data-navbar-dark is currently under the navbar
      const darkEls = document.querySelectorAll<HTMLElement>('[data-navbar-dark]');
      let dark = false;
      darkEls.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < NAV_H && r.bottom > 0) dark = true;
      });
      setIsDark(dark);
    }
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, [pathname]); // re-run on route change so dark sections are re-evaluated

  useEffect(() => { setIsOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const showDark = isDark || scrolled;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          showDark
            ? 'bg-brand-blue/40 backdrop-blur-md border-b border-white/10'
            : 'bg-brand-cream border-b border-brand-gold/40'
        }`}
      >
        <nav
          aria-label="Main navigation"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20"
        >
          <Link
            href="/"
            className={`self-stretch flex items-center flex-shrink-0 focus:outline-none focus:ring-2 rounded ${
              showDark ? 'focus:ring-white' : 'focus:ring-brand-blue'
            }`}
            aria-label="The SpringHouse Church — home"
          >
            <SiteLogo variant="navbar" isDark={showDark} />
          </Link>

          {/* Desktop nav links */}
          <ul className="hidden lg:flex items-center gap-7" role="list">
            {navLinks.map(({ href, label }, index) => {
              const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
              return (
                <motion.li
                  key={href}
                  initial={reduced ? false : { opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: reduced ? 0 : index * 0.08, ease: 'easeOut' }}
                >
                  <Link
                    href={href}
                    aria-current={isActive ? 'page' : undefined}
                    className={`relative text-sm font-medium transition-colors pb-1 focus:outline-none focus:ring-2 rounded ${
                      showDark
                        ? `text-white/90 hover:text-brand-gold focus:ring-white ${isActive ? 'after:absolute after:left-0 after:bottom-0 after:w-full after:h-0.5 after:bg-brand-gold' : ''}`
                        : `text-brand-blue hover:text-brand-red focus:ring-brand-blue ${isActive ? 'after:absolute after:left-0 after:bottom-0 after:w-full after:h-0.5 after:bg-brand-gold' : ''}`
                    }`}
                  >
                    {label}
                  </Link>
                </motion.li>
              );
            })}

            {/* First Visit? — visually distinct, lives in the nav flow */}
            <motion.li
              initial={reduced ? false : { opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: reduced ? 0 : navLinks.length * 0.08, ease: 'easeOut' }}
            >
              <Link
                href="/new-member"
                className={`inline-flex items-center px-3.5 py-1.5 text-xs font-semibold rounded-full border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-transparent ${
                  showDark
                    ? 'border-brand-gold/50 text-brand-gold hover:bg-brand-gold/20'
                    : 'border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-white'
                }`}
              >
                First Visit?
              </Link>
            </motion.li>
          </ul>

          {/* Give button + hamburger */}
          <div className="flex items-center gap-3">
            <Link
              href="/give"
              className={`hidden lg:inline-flex items-center px-5 py-2 text-sm font-medium rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                reduced ? '' : 'animate-give-pulse'
              } ${
                showDark
                  ? 'border border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-white focus:ring-brand-gold focus:ring-offset-transparent'
                  : 'bg-gradient-to-br from-brand-red to-[#943E22] text-white shadow-sm hover:from-[#c4663e] hover:to-[#7a3018] focus:ring-brand-red focus:ring-offset-brand-cream'
              }`}
            >
              Give
            </Link>

            <button
              type="button"
              onClick={() => setIsOpen((v) => !v)}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className={`lg:hidden p-2 rounded-md focus:outline-none focus:ring-2 transition-colors ${
                showDark ? 'text-white focus:ring-white' : 'text-brand-blue focus:ring-brand-blue'
              }`}
            >
              {isOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile slide-in panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            className="fixed inset-0 z-40 bg-brand-blue flex flex-col pt-20 px-8 pb-10 lg:hidden"
            initial={reduced ? false : { x: '100%' }}
            animate={{ x: 0 }}
            exit={reduced ? {} : { x: '100%' }}
            transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 30 }}
          >
            <ul className="flex flex-col gap-6 mt-4" role="list">
              {navLinks.map(({ href, label }) => {
                const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      aria-current={isActive ? 'page' : undefined}
                      className={`text-2xl font-display font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-white rounded ${
                        isActive ? 'text-brand-gold' : 'text-white hover:text-brand-gold'
                      }`}
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}
              <li>
                <Link
                  href="/new-member"
                  onClick={() => setIsOpen(false)}
                  className="text-2xl font-display font-semibold text-brand-gold hover:text-brand-gold/70 transition-colors focus:outline-none focus:ring-2 focus:ring-white rounded"
                >
                  First Visit?
                </Link>
              </li>
            </ul>

            <div className="mt-10">
              <Link
                href="/give"
                className={`self-start inline-flex items-center px-8 py-3 bg-gradient-to-br from-brand-red to-[#943E22] text-white text-base font-medium rounded-full shadow-sm hover:from-[#c4633e] hover:to-[#7a3018] transition-all focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-brand-blue ${
                  reduced ? '' : 'animate-give-pulse'
                }`}
              >
                Give
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
