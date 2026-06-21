'use client';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import useScrollReveal from '@/lib/useScrollReveal';
import usePrefersReducedMotion from '@/lib/usePrefersReducedMotion';

interface KenBurnsInProps {
  children: ReactNode;
  className?: string;
  fromScale?: number;
  duration?: number;
}

/** Fades in from a slight scale offset to scale(1) on reveal — a gentle Ken Burns-style entrance. */
export default function KenBurnsIn({ children, className = '', fromScale = 1.05, duration = 1 }: KenBurnsInProps) {
  const { ref, isVisible } = useScrollReveal();
  const reduced = usePrefersReducedMotion();
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={reduced ? false : { opacity: 0, scale: fromScale }}
      animate={isVisible ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
