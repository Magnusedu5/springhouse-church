import MinistryCard from '@/components/MinistryCard';
import FadeIn from '@/components/FadeIn';
import { CascadeGroup, CascadeItem } from '@/components/motion';
import HeroBackground from '@/components/HeroBackground';
import type { Ministry, GalleryDestination } from '@/lib/types';

const MINISTRY_GALLERY: Record<string, GalleryDestination> = {
  'noble-men': 'ministry_men',
  'womens-fellowship': 'ministry_women',
  'youth-teens-church': 'ministry_youth',
  'the-springhouse-choir': 'ministry_worship',
  'church-care': 'ministry_children',
  'celebration-church': 'ministry_missions',
};

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api';

// Empty fallback — if API is unavailable, show nothing rather than stale placeholder data
export const DEFAULT_MINISTRIES: Ministry[] = [];

async function getMinistries(): Promise<Ministry[]> {
  try {
    const res = await fetch(`${BASE}/ministries/`, { next: { revalidate: 3600 } });
    if (!res.ok) return DEFAULT_MINISTRIES;
    const data = await res.json();
    const list: Ministry[] = Array.isArray(data) ? data : (data.results ?? []);
    return list.length > 0 ? list : DEFAULT_MINISTRIES;
  } catch {
    return DEFAULT_MINISTRIES;
  }
}

export default async function MinistriesPage() {
  const ministries = await getMinistries();

  return (
    <main>
      {/* ── Hero ── */}
      <section
        className="relative flex flex-col items-center justify-center bg-brand-blue text-center px-4 py-24 overflow-hidden"
        style={{ minHeight: '40vh' }}
        aria-label="Ministries hero"
      >
        <HeroBackground destination="hero_ministries" />
        <div className="absolute inset-0 bg-brand-blue/80" aria-hidden="true" />
        <div className="relative z-10">
          <FadeIn>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-gold mb-4">
              Get Involved
            </p>
            <h1 className="font-display text-5xl sm:text-6xl font-semibold text-white mb-4 leading-tight">
              Our Ministries
            </h1>
            <p className="text-white/70 text-lg sm:text-xl max-w-md">
              Every member, a minister.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── Ministries Grid ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white" aria-label="Ministries grid">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <div className="text-center mb-12">
              <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed">
                The SpringHouse Church is made up of vibrant ministries, each with a unique calling.
                Find where you belong and join in the mission.
              </p>
            </div>
          </FadeIn>

          <CascadeGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ministries.map((ministry) => (
              <CascadeItem key={ministry.id}>
                <MinistryCard ministry={ministry} galleryDestination={MINISTRY_GALLERY[ministry.slug]} />
              </CascadeItem>
            ))}
          </CascadeGroup>
        </div>
      </section>
    </main>
  );
}
