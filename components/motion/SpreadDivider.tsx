'use client';
import { motion } from 'framer-motion';
import useScrollReveal from '@/lib/useScrollReveal';

interface SpreadDividerProps {
  className?: string;
}

/** Pattern B — "Spread": scaleX 0 → 1 from center, 0.6s. For gold divider lines. */
export default function SpreadDivider({ className = '' }: SpreadDividerProps) {
  const { ref, isVisible } = useScrollReveal();
  return (
    <motion.div
      ref={ref}
      className={`h-px bg-brand-gold origin-center ${className}`}
      initial={{ scaleX: 0 }}
      animate={isVisible ? { scaleX: 1 } : {}}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    />
  );
}
