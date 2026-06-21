'use client';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface BounceIconProps {
  children: ReactNode;
  className?: string;
}

/** Bounces with spring physics on hover — for icon cards. */
export default function BounceIcon({ children, className = '' }: BounceIconProps) {
  return (
    <motion.div
      className={className}
      whileHover={{ scale: 1.15, y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 10 }}
    >
      {children}
    </motion.div>
  );
}
