'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Trophy, Target, TrendingUp, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const MOBILE_LINKS = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/ipl', icon: Trophy, label: 'IPL' },
  { href: '/betting', icon: Target, label: 'Bet' },
  { href: '/predictions', icon: TrendingUp, label: 'Predict' },
  { href: '/profile', icon: User, label: 'Profile' },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-border">
      <div className="flex justify-around py-2">
        {MOBILE_LINKS.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg text-xs transition-colors',
              pathname === href ? 'text-primary' : 'text-muted',
            )}
          >
            <Icon className="w-5 h-5" />
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}