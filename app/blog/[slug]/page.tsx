import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { BlogPost } from '@/lib/types';
import FadeIn from '@/components/FadeIn';
import ShareButtons from '@/components/ShareButtons';
import BlogCard from '@/components/BlogCard';
import BlogArticleBody from '@/components/BlogArticleBody';
import ReadingProgressBar from '@/components/ReadingProgressBar';
import FadedBackgroundPhoto from '@/components/FadedBackgroundPhoto';
import { CascadeGroup, CascadeItem } from '@/components/motion';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://springhousechurch.org';

// ── Server-side HTML sanitiser ────────────────────────────────────────────────
// Strips script/iframe tags and dangerous on* event handlers before rendering.
function sanitiseHtml(raw: string): string {
  return raw
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/\s+on\w+="[^"]*"/gi, '')
    .replace(/\s+on\w+='[^']*'/gi, '')
    .replace(/href="javascript:[^"]*"/gi, 'href="#"')
    .trim();
}

// ── Data fetching ─────────────────────────────────────────────────────────────

async function getPost(slug: string): Promise<BlogPost | null> {
  try {
    const res = await fetch(`${BASE}/blog/${slug}/`, { next: { revalidate: 3600 } });
    if (res.ok) return res.json();
  } catch { /* fall through */ }
  return null;
}

async function getRelatedPosts(category: string, currentSlug: string): Promise<BlogPost[]> {
  try {
    const res = await fetch(`${BASE}/blog/?category=${category}&page_size=4`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    const posts: BlogPost[] = Array.isArray(data) ? data : (data.results ?? []);
    return posts.filter((p) => p.slug !== currentSlug).slice(0, 3);
  } catch {
    return [];
  }
}

// ── Static generation ─────────────────────────────────────────────────────────

export async function generateStaticParams() {
  try {
    const res = await fetch(`${BASE}/blog/?page=1`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const data = await res.json();
      const posts: BlogPost[] = Array.isArray(data) ? data : (data.results ?? []);
      if (posts.length > 0) return posts.map((p) => ({ slug: p.slug }));
    }
  } catch { /* fall through */ }
  return [];
}

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: 'Post Not Found' };

  return {
    title: `${post.title} — The SpringHouse Church`,
    description: post.excerpt ?? post.content?.substring(0, 160),
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.excerpt ?? post.content?.substring(0, 200),
      images: post.featured_image ? [{ url: post.featured_image }] : [],
      url: `${SITE_URL}/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.published_date ?? undefined,
      authors: [post.author],
    },
  };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const CATEGORY_LABELS: Record<string, string> = {
  devotional: 'Devotional',
  teaching: 'Teaching',
  testimony: 'Testimony',
  missions: 'Missions',
  general: 'General',
};

const CATEGORY_COLORS: Record<string, string> = {
  devotional: 'bg-brand-gold',
  teaching: 'bg-brand-blue',
  testimony: 'bg-brand-red',
  missions: 'bg-emerald-600',
  general: 'bg-gray-500',
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const relatedPosts = await getRelatedPosts(post.category, post.slug);

  const formattedDate = post.published_date
    ? new Date(post.published_date).toLocaleDateString('en-NG', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Draft';

  const safeContent = post.content ? sanitiseHtml(post.content) : '';
  const tags = post.tags ? post.tags.split(',').map((t) => t.trim()).filter(Boolean) : [];
  const categoryColor = CATEGORY_COLORS[post.category] ?? 'bg-brand-gold';
  const categoryLabel = CATEGORY_LABELS[post.category] ?? post.category;

  return (
    <main>
      <ReadingProgressBar />

      {/* ── Breadcrumb ── */}
      <div className="bg-brand-cream border-b border-gray-100 px-4 sm:px-6 lg:px-8 py-3">
        <nav aria-label="Breadcrumb" className="max-w-4xl mx-auto flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-brand-blue transition-colors focus:outline-none focus:underline">Home</Link>
          <span aria-hidden="true">/</span>
          <Link href="/blog" className="hover:text-brand-blue transition-colors focus:outline-none focus:underline">Blog</Link>
          <span aria-hidden="true">/</span>
          <span className="text-brand-blue truncate max-w-[200px]" aria-current="page">{post.title}</span>
        </nav>
      </div>

      {/* ── Article Hero ── */}
      <header className="relative bg-brand-blue overflow-hidden" aria-label="Article hero">
        {post.featured_image && (
          <>
            <Image
              src={post.featured_image}
              alt=""
              fill
              className="object-cover object-center"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-blue via-brand-blue/70 to-brand-blue/20" aria-hidden="true" />
          </>
        )}
        {!post.featured_image && (
          <div className="absolute inset-0 bg-cross-pattern opacity-10" aria-hidden="true" />
        )}

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-14">
          <FadeIn>
            <span className={`inline-block mb-5 ${categoryColor} text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full`}>
              {categoryLabel}
            </span>
            <h1
              className="font-display font-semibold text-white leading-tight mb-6"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
            >
              {post.title}
            </h1>
            {/* Author + meta row */}
            <div className="flex flex-wrap items-center gap-4 text-white/70 text-sm">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-white/10 overflow-hidden flex-shrink-0">
                  {post.author_image ? (
                    <Image
                      src={post.author_image}
                      alt={post.author}
                      width={36}
                      height={36}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-sm font-bold">
                      {post.author.charAt(0)}
                    </div>
                  )}
                </div>
                <span className="font-medium text-white">{post.author}</span>
              </div>
              <span aria-hidden="true">·</span>
              <time dateTime={post.published_date ?? undefined}>{formattedDate}</time>
              {post.read_time && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>{post.read_time}</span>
                </>
              )}
            </div>
          </FadeIn>
        </div>
      </header>

      {/* ── Article body ── */}
      <div className="relative py-14 px-4 sm:px-6 bg-white overflow-hidden">
        <FadedBackgroundPhoto destination="bg_article" />
        <div className="relative z-10 max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* ── Content column ── */}
          <article className="lg:col-span-2" aria-label="Article content">
            {safeContent ? (
              <FadeIn>
                <BlogArticleBody html={safeContent} />
              </FadeIn>
            ) : (
              <p className="text-gray-400 italic">Content coming soon.</p>
            )}

            {/* Tags */}
            {tags.length > 0 && (
              <FadeIn delay={50}>
                <div className="mt-10 flex flex-wrap gap-2" aria-label="Article tags">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-brand-gold/10 text-brand-gold text-xs font-semibold uppercase tracking-wider rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </FadeIn>
            )}

            {/* Share buttons */}
            <FadeIn delay={80}>
              <div className="mt-10 pt-8 border-t border-gray-100">
                <ShareButtons
                  url={`${SITE_URL}/blog/${post.slug}`}
                  title={post.title}
                />
              </div>
            </FadeIn>

            {/* Prayer CTA */}
            <FadeIn delay={100}>
              <div className="mt-10 bg-brand-cream rounded-2xl p-7 border border-gray-100">
                <p className="font-display text-lg font-semibold text-brand-blue mb-2">
                  Have a prayer need after reading this?
                </p>
                <p className="text-gray-500 text-sm mb-4">
                  Our prayer team would love to stand in agreement with you.
                </p>
                <Link
                  href="/contact#prayer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-red hover:text-brand-blue transition-colors focus:outline-none focus:underline"
                >
                  Submit a prayer request →
                </Link>
              </div>
            </FadeIn>
          </article>

          {/* ── Sidebar ── */}
          <aside className="lg:col-span-1" aria-label="Author and more">
            <div className="sticky top-24 space-y-8">
              {/* Author card */}
              <FadeIn delay={60}>
                <div className="bg-brand-cream rounded-2xl p-6 border border-gray-100">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-full bg-brand-blue/10 overflow-hidden mb-4">
                      {post.author_image ? (
                        <Image
                          src={post.author_image}
                          alt={post.author}
                          width={80}
                          height={80}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-brand-blue text-2xl font-bold">
                          {post.author.charAt(0)}
                        </div>
                      )}
                    </div>
                    <h3 className="font-display text-lg font-semibold text-brand-blue mb-1">
                      {post.author}
                    </h3>
                    <p className="text-xs font-semibold uppercase tracking-widest text-brand-gold mb-3">
                      Writer, The SpringHouse Church
                    </p>
                    {/* TODO: Add author bio from API */}
                    <p className="text-sm text-gray-500 leading-relaxed italic">
                      Sharing the Word that transforms lives — from Calabar and beyond.
                    </p>
                  </div>
                </div>
              </FadeIn>
            </div>
          </aside>
        </div>
      </div>

      {/* ── Related posts ── */}
      {relatedPosts.length > 0 && (
        <section className="bg-brand-cream py-16 px-4 sm:px-6 lg:px-8" aria-label="Related posts">
          <div className="max-w-7xl mx-auto">
            <FadeIn>
              <div className="mb-10">
                <p className="text-xs font-semibold uppercase tracking-widest text-brand-gold mb-2">
                  More to Read
                </p>
                <h2 className="font-display text-3xl font-semibold text-brand-blue">
                  Related Articles
                </h2>
              </div>
            </FadeIn>
            <CascadeGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((related) => (
                <CascadeItem key={related.id}>
                  <BlogCard post={related} />
                </CascadeItem>
              ))}
            </CascadeGroup>
            <FadeIn delay={250}>
              <div className="mt-10 text-center">
                <Link
                  href="/blog"
                  className="text-sm font-medium text-brand-red hover:text-brand-blue transition-colors focus:outline-none focus:underline"
                >
                  ← Back to all articles
                </Link>
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {/* ── Back nav ── */}
      {relatedPosts.length === 0 && (
        <div className="bg-white border-t border-gray-100 py-8 px-4 text-center">
          <Link
            href="/blog"
            className="text-sm font-medium text-brand-blue hover:text-brand-red transition-colors focus:outline-none focus:underline"
          >
            ← Back to all articles
          </Link>
        </div>
      )}
    </main>
  );
}
