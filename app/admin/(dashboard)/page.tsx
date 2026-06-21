'use client';
import { useEffect, useState, FormEvent } from 'react';
import Link from 'next/link';
import { Video, CalendarDays, Heart, Globe } from 'lucide-react';
import adminApi from '@/lib/adminApi';
import StatCard from '@/components/admin/StatCard';
import AdminToggle from '@/components/admin/AdminToggle';
import type { AdminStats, LiveStreamConfig, PrayerRequest, ChurchEvent, Paginated } from '@/lib/types';

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [live, setLive] = useState<LiveStreamConfig>({ is_live: false, stream_url: '', stream_title: '' });
  const [liveSaving, setLiveSaving] = useState(false);
  const [prayers, setPrayers] = useState<PrayerRequest[]>([]);
  const [events, setEvents] = useState<ChurchEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [statsRes, liveRes, prayersRes, eventsRes] = await Promise.all([
          adminApi.get<AdminStats>('/admin/stats/'),
          adminApi.get<LiveStreamConfig>('/livestream/'),
          adminApi.get<Paginated<PrayerRequest>>('/prayers/'),
          adminApi.get<Paginated<ChurchEvent>>('/events/', { params: { upcoming: 'true', limit: 3 } }),
        ]);
        if (cancelled) return;
        setStats(statsRes.data);
        setLive(liveRes.data);
        setPrayers(prayersRes.data.results.slice(0, 5));
        setEvents(eventsRes.data.results.slice(0, 3));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleLiveSubmit(e: FormEvent) {
    e.preventDefault();
    setLiveSaving(true);
    try {
      const res = await adminApi.patch<LiveStreamConfig>('/livestream/', live);
      setLive(res.data);
    } finally {
      setLiveSaving(false);
    }
  }

  async function markAsPrayed(id?: number) {
    if (!id) return;
    await adminApi.patch(`/prayers/${id}/`, { is_prayed_over: true });
    setPrayers((prev) => prev.map((p) => (p.id === id ? { ...p, is_prayed_over: true } : p)));
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold text-brand-blue">Dashboard</h1>

      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Video} label="Total Sermons" value={stats?.total_sermons ?? (loading ? '…' : 0)} />
        <StatCard icon={CalendarDays} label="Upcoming Events" value={stats?.upcoming_events ?? (loading ? '…' : 0)} />
        <StatCard
          icon={Heart}
          label="Unread Prayer Requests"
          value={stats?.unread_prayers ?? (loading ? '…' : 0)}
          variant={stats && stats.unread_prayers > 0 ? 'red' : 'default'}
        />
        <StatCard icon={Globe} label="Online Members" value={stats?.total_online_members ?? (loading ? '…' : 0)} />
      </div>

      {/* Live stream toggle */}
      <div
        id="livestream"
        className="bg-brand-blue rounded-xl shadow-sm p-6 text-white"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span
              className={`w-3 h-3 rounded-full ${live.is_live ? 'bg-green-400 animate-pulse' : 'bg-white/30'}`}
              aria-hidden="true"
            />
            <p className="font-display text-lg font-semibold">
              {live.is_live ? 'LIVE' : 'Offline'}
            </p>
          </div>
          <AdminToggle
            checked={live.is_live}
            onChange={(checked) => setLive((prev) => ({ ...prev, is_live: checked }))}
            label="Toggle live stream"
          />
        </div>

        <form onSubmit={handleLiveSubmit} className="space-y-3">
          <div>
            <label htmlFor="stream_title" className="block text-sm font-medium text-white/80 mb-1">
              Stream Title
            </label>
            <input
              id="stream_title"
              type="text"
              value={live.stream_title}
              onChange={(e) => setLive((prev) => ({ ...prev, stream_title: e.target.value }))}
              placeholder='e.g. "Sunday Service — 10:30 AM"'
              className="w-full px-3 py-2 rounded-lg text-brand-blue placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold"
            />
          </div>
          <div>
            <label htmlFor="stream_url" className="block text-sm font-medium text-white/80 mb-1">
              Stream URL
            </label>
            <input
              id="stream_url"
              type="url"
              value={live.stream_url}
              onChange={(e) => setLive((prev) => ({ ...prev, stream_url: e.target.value }))}
              placeholder="https://youtube.com/..."
              className="w-full px-3 py-2 rounded-lg text-brand-blue placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold"
            />
          </div>

          <p className="text-xs text-white/70">
            Going live will activate the banner on the public website immediately.
          </p>

          <button
            type="submit"
            disabled={liveSaving}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-60 ${
              live.is_live ? 'bg-brand-red hover:bg-[#a82126]' : 'bg-brand-gold text-brand-blue hover:bg-[#b8890f]'
            }`}
          >
            {liveSaving ? 'Saving…' : live.is_live ? 'Save & Go Live' : 'End Stream'}
          </button>
        </form>
      </div>

      {/* Recent prayer requests + upcoming events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-display text-base font-semibold text-brand-blue mb-4">
            Recent Prayer Requests
          </h2>
          {prayers.length === 0 ? (
            <p className="text-sm text-gray-400">No prayer requests yet.</p>
          ) : (
            <ul className="space-y-3" role="list">
              {prayers.map((p) => (
                <li key={p.id} className="flex items-start justify-between gap-3 text-sm">
                  <div>
                    <p className="font-medium text-gray-800">{p.name}</p>
                    <p className="text-gray-500 line-clamp-1">{p.request_text}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {p.submitted_at ? new Date(p.submitted_at).toLocaleDateString() : ''}
                    </p>
                  </div>
                  {!p.is_prayed_over && (
                    <button
                      type="button"
                      onClick={() => markAsPrayed(p.id)}
                      className="flex-shrink-0 text-xs font-medium text-brand-blue border border-brand-blue/30 px-2.5 py-1 rounded-full hover:bg-brand-blue/5 transition-colors"
                    >
                      Mark as Prayed
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
          <Link href="/admin/prayer-requests" className="block mt-4 text-sm text-brand-blue hover:text-brand-red">
            View all →
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-display text-base font-semibold text-brand-blue mb-4">
            Upcoming Events
          </h2>
          {events.length === 0 ? (
            <p className="text-sm text-gray-400">No upcoming events.</p>
          ) : (
            <ul className="space-y-3" role="list">
              {events.map((event) => (
                <li key={event.id} className="flex items-center justify-between gap-3 text-sm">
                  <div>
                    <p className="font-medium text-gray-800">{event.title}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(event.date).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  {event.is_virtual && (
                    <span className="flex-shrink-0 text-xs font-medium text-brand-gold bg-brand-gold/10 px-2 py-0.5 rounded-full">
                      Virtual
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
          <Link href="/admin/events" className="block mt-4 text-sm text-brand-blue hover:text-brand-red">
            View all →
          </Link>
        </div>
      </div>
    </div>
  );
}
