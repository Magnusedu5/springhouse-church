'use client';
import { useEffect, useRef } from 'react';

interface Props {
  html: string;
}

export default function BlogArticleBody({ html }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    const quotes = container.querySelectorAll('blockquote.scripture');
    if (quotes.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('scripture-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 }
    );

    quotes.forEach((quote) => observer.observe(quote));
    return () => observer.disconnect();
  }, [html]);

  return (
    <div
      ref={ref}
      className="article-body"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
