'use client';
import { useEffect, useState } from 'react';
import { animate } from 'framer-motion';
import useScrollReveal from '@/lib/useScrollReveal';
import usePrefersReducedMotion from '@/lib/usePrefersReducedMotion';

interface CountUpProps {
  end: number;
  duration?: number;
  suffix?: string;
  className?: string;
}

export default function CountUp({ end, duration = 2, suffix = '', className = '' }: CountUpProps) {
  const { ref, isVisible } = useScrollReveal();
  const reduced = usePrefersReducedMotion();
  const [value, setValue] = useState(reduced ? end : 0);

  useEffect(() => {
    if (!isVisible || reduced) return;
    const controls = animate(0, end, {
      duration,
      ease: 'easeOut',
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [isVisible, reduced, end, duration]);

  return (
    <span ref={ref} className={className}>
      {value.toLocaleString()}
      {suffix}
    </span>
  );
}
