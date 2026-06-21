'use client';
import { motion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';
import useScrollReveal from '@/lib/useScrollReveal';

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export const cascadeItemVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};

interface CascadeGroupProps {
  children: ReactNode;
  className?: string;
}

/** Pattern E — "Cascade": staggered Rise for grid items, 0.1s between each card. Wrap a grid with this, each card in <CascadeItem>. */
export default function CascadeGroup({ children, className = '' }: CascadeGroupProps) {
  const { ref, isVisible } = useScrollReveal();
  return (
    <motion.div
      ref={ref}
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate={isVisible ? 'visible' : 'hidden'}
    >
      {children}
    </motion.div>
  );
}
