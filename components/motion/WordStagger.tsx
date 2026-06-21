'use client';
import { motion, type Variants } from 'framer-motion';
import useScrollReveal from '@/lib/useScrollReveal';
import usePrefersReducedMotion from '@/lib/usePrefersReducedMotion';

interface WordStaggerProps {
  text: string;
  staggerDelay?: number;
  className?: string;
  as?: 'p' | 'h2';
}

const wordVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

/** Splits text into words that reveal with a tiny stagger as the element enters the viewport. */
export default function WordStagger({ text, staggerDelay = 0.03, className = '', as = 'p' }: WordStaggerProps) {
  const { ref, isVisible } = useScrollReveal();
  const reduced = usePrefersReducedMotion();
  const words = text.split(' ');

  if (reduced) {
    const Tag = as;
    return <Tag className={className}>{text}</Tag>;
  }

  const containerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: staggerDelay } },
  };

  const content = words.map((word, i) => (
    <motion.span key={i} className="inline-block" variants={wordVariants}>
      {word}
      {i < words.length - 1 ? ' ' : ''}
    </motion.span>
  ));

  if (as === 'h2') {
    return (
      <motion.h2
        ref={ref}
        className={className}
        initial="hidden"
        animate={isVisible ? 'visible' : 'hidden'}
        variants={containerVariants}
      >
        {content}
      </motion.h2>
    );
  }

  return (
    <motion.p
      ref={ref}
      className={className}
      initial="hidden"
      animate={isVisible ? 'visible' : 'hidden'}
      variants={containerVariants}
    >
      {content}
    </motion.p>
  );
}
