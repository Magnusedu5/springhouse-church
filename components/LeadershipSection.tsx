'use client';
import { useEffect, useState } from 'react';
import FadeIn from '@/components/FadeIn';
import { CascadeGroup, CascadeItem } from '@/components/motion';
import type { LeadershipMember } from '@/lib/types';

const PLACEHOLDER_COLORS = [
  'bg-brand-blue/10',
  'bg-brand-gold/10',
  'bg-brand-red/10',
  'bg-brand-blue/15',
  'bg-brand-gold/15',
  'bg-brand-red/15',
  'bg-brand-blue/20',
];

function getInitials(role: string): string {
  return role
    .split(' ')
    .filter((w) => /^[A-Z]/i.test(w))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
}

export default function LeadershipSection() {
  const [leaders, setLeaders] = useState<LeadershipMember[]>([]);

  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api';
    fetch(`${base}/leadership/`)
      .then((r) => r.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : (data?.results ?? []);
        setLeaders(list);
      })
      .catch(() => setLeaders([]));
  }, []);

  if (leaders.length === 0) return null;

  return (
    <section className="bg-brand-cream py-20 px-4 sm:px-6 lg:px-8" aria-label="Leadership team">
      <div className="max-w-5xl mx-auto">
        <FadeIn>
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-gold mb-3">
              The Team
            </p>
            <h2 className="font-display text-4xl sm:text-5xl font-semibold text-brand-blue">
              Our Leadership
            </h2>
          </div>
        </FadeIn>

        <CascadeGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {leaders.map(({ role, name, photo }, i) => (
            <CascadeItem key={role}>
              <div className="text-center">
                {photo ? (
                  <div className="mx-auto mb-4 w-32 h-32 rounded-full overflow-hidden ring-2 ring-brand-gold/30">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo}
                      alt={name || role}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div
                    className={`mx-auto mb-4 w-32 h-32 rounded-full ${PLACEHOLDER_COLORS[i % PLACEHOLDER_COLORS.length]} flex items-center justify-center ring-2 ring-brand-gold/30`}
                  >
                    <span className="font-display text-2xl font-semibold text-brand-blue/40 select-none">
                      {getInitials(role)}
                    </span>
                  </div>
                )}
                <p className="text-xs font-semibold uppercase tracking-widest text-brand-gold mb-1">
                  {role}
                </p>
                <h3 className="font-display text-xl font-semibold text-brand-blue">
                  {name || 'TBA'}
                </h3>
              </div>
            </CascadeItem>
          ))}
        </CascadeGroup>
      </div>
    </section>
  );
}
