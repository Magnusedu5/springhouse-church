'use client';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { cascadeItemVariants } from './CascadeGroup';

interface CascadeItemProps {
  children: ReactNode;
  className?: string;
}

export default function CascadeItem({ children, className = '' }: CascadeItemProps) {
  return (
    <motion.div className={className} variants={cascadeItemVariants}>
      {children}
    </motion.div>
  );
}
