import MinistryCard from '@/components/MinistryCard';
import FadeIn from '@/components/FadeIn';
import { CascadeGroup, CascadeItem } from '@/components/motion';
import HeroBackground from '@/components/HeroBackground';
import type { Ministry, GalleryDestination } from '@/lib/types';

const MINISTRY_GALLERY: Record<string, GalleryDestination> = {
  'childrens-ministry': 'ministry_children',
  'youth-ministry': 'ministry_youth',
  'mens-fellowship': 'ministry_men',
  'womens-fellowship': 'ministry_women',
  'missions-outreach': 'ministry_missions',
  'worship-team': 'ministry_worship',
};

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api';

// Static fallback — shown when API is unavailable or returns no data
export const DEFAULT_MINISTRIES: Ministry[] = [
  {
    id: 1,
    slug: 'childrens-ministry',
    name: "Children's Ministry",
    tagline: 'Raising the next generation for Christ',
    description:
      'Our Children\'s Ministry is a vibrant, safe, and Spirit-filled environment where children from infancy through age 12 encounter the love of Jesus. Through age-appropriate teaching, worship, and creative activities, we partner with parents to lay a strong foundation of faith.',
    leader_name: 'TBC',
    leader_title: "Children's Ministry Leader",
    image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=800&q=80',
    color_accent: '#C0272D',
    meeting_schedule: 'Sundays during service (9:00 AM)',
    order: 1,
  },
  {
    id: 2,
    slug: 'youth-ministry',
    name: 'Youth Ministry',
    tagline: 'Young, bold, and Spirit-led',
    description:
      'The SpringHouse Youth Ministry is a movement of young people aged 13–25 who are passionate about God and unashamed of the Gospel. We create spaces where young people are discipled, challenged, and released to lead — in their schools, communities, and beyond.',
    leader_name: 'TBC',
    leader_title: 'Youth Pastor',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
    color_accent: '#1A3A6B',
    meeting_schedule: 'Fridays at 5:00 PM',
    order: 2,
  },
  {
    id: 3,
    slug: 'mens-fellowship',
    name: "Men's Fellowship",
    tagline: 'Iron sharpens iron',
    description:
      'The Men\'s Fellowship is a brotherhood of men committed to growing in faith, integrity, and godly character. We gather to pray, study the Word, support one another, and be challenged to lead with strength in our homes, workplaces, and the Church.',
    leader_name: 'TBC',
    leader_title: "Men's Fellowship Leader",
    image: 'https://images.unsplash.com/photo-1522543558187-768b6df7c25c?auto=format&fit=crop&w=800&q=80',
    color_accent: '#1A3A6B',
    meeting_schedule: 'First Saturday of every month at 8:00 AM',
    order: 3,
  },
  {
    id: 4,
    slug: 'womens-fellowship',
    name: "Women's Fellowship",
    tagline: 'Women of purpose and prayer',
    description:
      'Our Women\'s Fellowship is a community of purpose-driven women who gather to worship, pray, and sharpen one another. We celebrate the strength, wisdom, and calling of women in the Church and in society, equipping every woman to walk fully in her God-given destiny.',
    leader_name: 'TBC',
    leader_title: "Women's Fellowship Leader",
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    color_accent: '#D4A017',
    meeting_schedule: 'Second Saturday of every month at 9:00 AM',
    order: 4,
  },
  {
    id: 5,
    slug: 'missions-outreach',
    name: 'Missions & Outreach',
    tagline: 'Across the street, across the seas',
    description:
      'Missions & Outreach is the heartbeat of our vision to reach beyond the four walls of the church. We mobilise teams for community service in Calabar, support missionaries in the field, and carry the Gospel to the unreached — both locally and globally.',
    leader_name: 'TBC',
    leader_title: 'Missions Director',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80',
    color_accent: '#C0272D',
    meeting_schedule: 'Monthly — dates announced in service',
    order: 5,
  },
  {
    id: 6,
    slug: 'worship-team',
    name: 'Worship Team',
    tagline: 'Excellence in His presence',
    description:
      'The Worship Team leads The SpringHouse Church into encounters with God every week. We believe worship is a lifestyle and an offering. Our team of singers, musicians, and creatives are dedicated to cultivating an atmosphere where people encounter the presence of God.',
    leader_name: 'TBC',
    leader_title: 'Worship Leader',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
    color_accent: '#D4A017',
    meeting_schedule: 'Rehearsals: Saturdays at 4:00 PM',
    order: 6,
  },
];

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
