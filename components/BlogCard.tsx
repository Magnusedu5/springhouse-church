import Link from 'next/link';
import Image from 'next/image';
import type { BlogPost } from '@/lib/types';

interface Props {
  post: BlogPost;
}

const CATEGORY_COLORS: Record<string, string> = {
  devotional: 'bg-brand-gold',
  teaching: 'bg-brand-blue',
  testimony: 'bg-brand-red',
  missions: 'bg-emerald-600',
  general: 'bg-gray-500',
};

const CATEGORY_LABELS: Record<string, string> = {
  devotional: 'Devotional',
  teaching: 'Teaching',
  testimony: 'Testimony',
  missions: 'Missions',
  general: 'General',
};

export default function BlogCard({ post }: Props) {
  const formattedDate = post.published_date
    ? new Date(post.published_date).toLocaleDateString('en-NG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : null;

  const categoryColor = CATEGORY_COLORS[post.category] ?? 'bg-brand-gold';
  const categoryLabel = CATEGORY_LABELS[post.category] ?? post.category;

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block bg-brand-warm rounded-2xl overflow-hidden shadow-sm shadow-amber-900/5 border border-amber-100 hover:shadow-lg hover:shadow-amber-900/10 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-1"
    >
      {/* Featured image */}
      <div className="relative h-52 overflow-hidden">
        {post.featured_image ? (
          <Image
            src={post.featured_image}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-amber-50 flex items-center justify-center">
            <svg className="w-10 h-10 text-brand-blue/20" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
          </div>
        )}
        {/* Category pill */}
        <span className={`absolute top-3 left-3 ${categoryColor} text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full transition-transform duration-300 group-hover:-translate-y-1`}>
          {categoryLabel}
        </span>
      </div>

      {/* Card body */}
      <div className="p-5">
        <h3 className="title-underline font-display text-xl font-semibold text-brand-blue leading-snug mb-2 group-hover:text-brand-red transition-colors line-clamp-2">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-4">
            {post.excerpt}
          </p>
        )}

        {/* Author + meta row */}
        <div className="flex items-center gap-3 pt-4 border-t border-amber-100">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 overflow-hidden">
            {post.author_image ? (
              <Image
                src={post.author_image}
                alt={post.author}
                width={32}
                height={32}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-brand-blue text-xs font-bold">
                {post.author.charAt(0)}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-brand-blue truncate">{post.author}</p>
            <p className="text-xs text-gray-400">
              {formattedDate}
              {post.read_time ? ` · ${post.read_time}` : ''}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
