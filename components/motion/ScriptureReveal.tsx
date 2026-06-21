'use client';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import useScrollReveal from '@/lib/useScrollReveal';

interface ScriptureRevealProps {
  children: ReactNode;
  className?: string;
}

/** Pattern F — "Scripture Reveal": blur(8px) → blur(0), opacity 0 → 1, 1.2s. For scripture references and the vision statement quote. */
export default function ScriptureReveal({ children, className = '' }: ScriptureRevealProps) {
  const { ref, isVisible } = useScrollReveal();
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, filter: 'blur(8px)' }}
      animate={isVisible ? { opacity: 1, filter: 'blur(0px)' } : {}}
      transition={{ duration: 1.2, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
