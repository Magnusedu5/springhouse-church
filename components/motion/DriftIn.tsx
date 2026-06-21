'use client';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import useScrollReveal from '@/lib/useScrollReveal';

interface DriftInProps {
  children: ReactNode;
  direction: 'left' | 'right';
  className?: string;
  delay?: number;
}

/**
 * Pattern C/D — "Drift In Left/Right": x: ±50 → 0, opacity 0 → 1.
 * Left for left-column content, right for right-column images in 2-col layouts.
 */
export default function DriftIn({ children, direction, className = '', delay = 0 }: DriftInProps) {
  const { ref, isVisible } = useScrollReveal();
  const offset = direction === 'left' ? -50 : 50;
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, x: offset }}
      animate={isVisible ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, ease: 'easeOut', delay }}
    >
      {children}
    </motion.div>
  );
}
