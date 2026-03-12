'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Heart, ClipboardList, Image, BookOpen } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';

const adminNav = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Users', href: '/users', icon: Users },
  { label: 'Weddings', href: '/weddings', icon: Heart },
  { label: 'RSVPs', href: '/rsvps', icon: ClipboardList },
];

const clientNav = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'My Wedding', href: '/my-wedding', icon: Heart },
  { label: 'Gallery', href: '/my-wedding/gallery', icon: Image },
  { label: 'Love Story', href: '/my-wedding/love-story', icon: BookOpen },
  { label: 'RSVPs', href: '/rsvps', icon: ClipboardList },
];

export default function Sidebar() {
  const pathname = usePathname();
  const role = useAuthStore((s) => s.user?.role);
  const nav = role === 'ADMIN' ? adminNav : clientNav;

  return (
    <aside className="w-56 shrink-0 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      <div className="px-6 py-5 border-b border-gray-100">
        <span className="text-base font-semibold text-gray-900">Wedding Admin</span>
        <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-medium">
          {role}
        </span>
      </div>
      <nav className="flex-1 py-4 px-3 space-y-1">
        {nav.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || (href !== '/' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-rose-50 text-rose-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
