'use client';
import { useState, useEffect } from 'react';
import type { BlogPost } from '@/lib/types';
import BlogCard from './BlogCard';
import { CascadeGroup, CascadeItem } from '@/components/motion';

const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'devotional', label: 'Devotionals' },
  { key: 'teaching', label: 'Teaching' },
  { key: 'testimony', label: 'Testimony' },
  { key: 'missions', label: 'Missions' },
  { key: 'general', label: 'General' },
] as const;

type CategoryKey = (typeof CATEGORIES)[number]['key'];

const PAGE_SIZE = 9;

interface Props {
  initialPosts: BlogPost[];
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
      <div className="h-52 bg-gray-100" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-gray-100 rounded w-3/4" />
        <div className="h-4 bg-gray-100 rounded w-full" />
        <div className="h-4 bg-gray-100 rounded w-1/2" />
      </div>
    </div>
  );
}

export default function BlogContent({ initialPosts }: Props) {
  const [category, setCategory] = useState<CategoryKey>('all');
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialPosts.length >= PAGE_SIZE);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const base = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api';

  // Re-fetch when category changes
  useEffect(() => {
    setLoading(true);
    setPage(1);
    const params = new URLSearchParams({ page: '1' });
    if (category !== 'all') params.set('category', category);

    fetch(`${base}/blog/?${params}`)
      .then((r) => r.json())
      .then((data: unknown) => {
        const arr: BlogPost[] = Array.isArray(data)
          ? data
          : (data as { results?: BlogPost[] }).results ?? [];
        setPosts(arr);
        setHasMore(arr.length >= PAGE_SIZE);
      })
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, [category, base]);

  async function loadMore() {
    setLoadingMore(true);
    const nextPage = page + 1;
    const params = new URLSearchParams({ page: String(nextPage) });
    if (category !== 'all') params.set('category', category);

    try {
      const r = await fetch(`${base}/blog/?${params}`);
      const data = await r.json();
      const arr: BlogPost[] = Array.isArray(data)
        ? data
        : (data as { results?: BlogPost[] }).results ?? [];
      setPosts((prev) => [...prev, ...arr]);
      setPage(nextPage);
      setHasMore(arr.length >= PAGE_SIZE);
    } catch {
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  }

  return (
    <div>
      {/* Category filter pills */}
      <div
        className="flex gap-2 overflow-x-auto pb-2 mb-8 -mx-1 px-1 scrollbar-hide"
        role="tablist"
        aria-label="Filter posts by category"
      >
        {CATEGORIES.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={category === key}
            onClick={() => setCategory(key)}
            className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-1 ${
              category === key
                ? 'bg-brand-blue text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Blog grid — CSS columns for masonry layout */}
      {loading ? (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5" aria-busy="true" aria-label="Loading posts">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="break-inside-avoid mb-5">
              <SkeletonCard />
            </div>
          ))}
        </div>
      ) : posts.length > 0 ? (
        <CascadeGroup className="columns-1 sm:columns-2 lg:columns-3 gap-5">
          {posts.map((post) => (
            <CascadeItem key={post.id} className="break-inside-avoid mb-5">
              <BlogCard post={post} />
            </CascadeItem>
          ))}
        </CascadeGroup>
      ) : (
        <div className="text-center py-20">
          <p className="font-display text-xl italic text-gray-400">No posts in this category yet.</p>
        </div>
      )}

      {/* Load more button */}
      {!loading && hasMore && (
        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={loadMore}
            disabled={loadingMore}
            className="inline-flex items-center gap-2 px-8 py-3 bg-brand-blue text-white font-display font-semibold uppercase tracking-widest text-sm rounded-full hover:bg-brand-blue/80 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2 disabled:opacity-60"
          >
            {loadingMore ? 'Loading…' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
}
