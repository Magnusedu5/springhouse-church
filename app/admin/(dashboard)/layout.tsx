import { cookies } from 'next/headers';
import AdminSidebar from '@/components/admin/AdminSidebar';
import type { AdminStats, LiveStreamConfig } from '@/lib/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api';

async function getSidebarData() {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;
  const userEmail = cookieStore.get('admin_email')?.value ?? '';

  if (!token) {
    return { unreadPrayers: 0, unreadMessages: 0, newMinistryInterests: 0, isLive: false, userEmail };
  }

  try {
    const [statsRes, liveRes] = await Promise.all([
      fetch(`${API_URL}/admin/stats/`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      }),
      fetch(`${API_URL}/livestream/`, { cache: 'no-store' }),
    ]);

    const stats: AdminStats | null = statsRes.ok ? await statsRes.json() : null;
    const live: LiveStreamConfig | null = liveRes.ok ? await liveRes.json() : null;

    return {
      unreadPrayers: stats?.unread_prayers ?? 0,
      unreadMessages: stats?.unread_messages ?? 0,
      newMinistryInterests: stats?.new_ministry_interests ?? 0,
      isLive: live?.is_live ?? false,
      userEmail,
    };
  } catch {
    return { unreadPrayers: 0, unreadMessages: 0, newMinistryInterests: 0, isLive: false, userEmail };
  }
}

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const { unreadPrayers, unreadMessages, newMinistryInterests, isLive, userEmail } = await getSidebarData();

  return (
    <div className="min-h-screen bg-brand-cream">
      <AdminSidebar
        userEmail={userEmail}
        unreadPrayers={unreadPrayers}
        unreadMessages={unreadMessages}
        newMinistryInterests={newMinistryInterests}
        isLive={isLive}
      />
      <main className="lg:ml-[240px] pt-14 lg:pt-0 min-h-screen">
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
