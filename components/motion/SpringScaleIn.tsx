'use client';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import useScrollReveal from '@/lib/useScrollReveal';
import usePrefersReducedMotion from '@/lib/usePrefersReducedMotion';

interface SpringScaleInProps {
  children: ReactNode;
  className?: string;
}

/** Scales from 0.85 to 1.0 with a soft spring bounce as the element enters the viewport. */
export default function SpringScaleIn({ children, className = '' }: SpringScaleInProps) {
  const { ref, isVisible } = useScrollReveal();
  const reduced = usePrefersReducedMotion();
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={reduced ? false : { scale: 0.85, opacity: 0 }}
      animate={isVisible ? { scale: 1, opacity: 1 } : {}}
      transition={{ type: 'spring', stiffness: 200, damping: 14 }}
    >
      {children}
    </motion.div>
  );
}
