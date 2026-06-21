'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Video,
  Calendar,
  FileText,
  Users,
  Heart,
  Globe,
  Mail,
  Radio,
  Images,
  Menu,
  X,
  LogOut,
  HandHeart,
  QrCode,
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  badge?: number;
  liveDot?: boolean;
}

interface AdminSidebarProps {
  userEmail: string;
  unreadPrayers: number;
  unreadMessages: number;
  newMinistryInterests: number;
  isLive: boolean;
}

export default function AdminSidebar({
  userEmail,
  unreadPrayers,
  unreadMessages,
  newMinistryInterests,
  isLive,
}: AdminSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const navItems: NavItem[] = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/sermons', label: 'Sermons', icon: Video },
    { href: '/admin/events', label: 'Events', icon: Calendar },
    { href: '/admin/blog', label: 'Blog', icon: FileText },
    { href: '/admin/ministries', label: 'Ministries', icon: Users },
    { href: '/admin/gallery', label: 'Gallery', icon: Images },
    { href: '/admin/prayer-requests', label: 'Prayer Requests', icon: Heart, badge: unreadPrayers },
    { href: '/admin/ministry-interests', label: 'Ministry Interests', icon: HandHeart, badge: newMinistryInterests },
    { href: '/admin/members', label: 'Members', icon: Users },
    { href: '/admin/welcome-pack', label: 'Welcome Pack QR', icon: QrCode },
    { href: '/admin/online-members', label: 'Online Members', icon: Globe },
    { href: '/admin/messages', label: 'Messages', icon: Mail, badge: unreadMessages },
    { href: '/admin#livestream', label: 'Live Stream', icon: Radio, liveDot: isLive },
  ];

  async function handleSignOut() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  }

  const SidebarContent = (
    <div className="flex flex-col h-full bg-brand-blue text-white">
      <div className="px-6 py-6 border-b border-white/10">
        <p className="font-display text-lg font-semibold">The SpringHouse Church</p>
        <p className="text-xs text-white/60 mt-0.5">Admin Dashboard</p>
      </div>

      <nav className="flex-1 overflow-y-auto py-4" aria-label="Admin navigation">
        <ul className="flex flex-col gap-1 px-3" role="list">
          {navItems.map(({ href, label, icon: Icon, badge, liveDot }) => {
            const isActive = href === '/admin' ? pathname === href : pathname.startsWith(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setIsOpen(false)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? 'bg-brand-red text-white' : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                  <span className="flex-1">{label}</span>
                  {liveDot && (
                    <span
                      className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-400 animate-pulse' : 'bg-white/30'}`}
                      aria-label={isLive ? 'Currently live' : 'Offline'}
                    />
                  )}
                  {!!badge && badge > 0 && (
                    <span className="bg-brand-red text-white text-xs font-semibold rounded-full min-w-[1.25rem] h-5 flex items-center justify-center px-1.5">
                      {badge}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="px-4 py-4 border-t border-white/10">
        <p className="text-xs text-white/60 truncate px-2 mb-2">{userEmail}</p>
        <button
          type="button"
          onClick={handleSignOut}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" aria-hidden="true" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-brand-blue flex items-center justify-between px-4">
        <p className="font-display text-white text-sm font-semibold">SpringHouse Admin</p>
        <button
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          className="p-2 text-white"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Desktop fixed sidebar */}
      <aside className="hidden lg:block fixed top-0 left-0 h-screen w-[240px] z-30">
        {SidebarContent}
      </aside>

      {/* Mobile drawer */}
      <div
        className={`lg:hidden fixed inset-0 z-30 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="absolute inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
        <aside
          className={`absolute top-0 left-0 h-full w-[240px] transition-transform duration-300 ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {SidebarContent}
        </aside>
      </div>
    </>
  );
}
