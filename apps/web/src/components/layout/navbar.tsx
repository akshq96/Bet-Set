'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Wallet, User, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth-store';
import { useBetSlipStore } from '@/store/bet-slip-store';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/ipl', label: 'IPL Live' },
  { href: '/betting', label: 'Betting' },
  { href: '/fantasy', label: 'Fantasy' },
  { href: '/predictions', label: 'Predict' },
];

export function Navbar() {
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuthStore();
  const { items, toggle } = useBetSlipStore();

  return (
    <header className="fixed top-8 left-0 right-0 z-50 px-4">
      <nav className="glass mx-auto max-w-7xl rounded-2xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Zap className="w-5 h-5 text-black" />
          </div>
          <span className="font-display font-bold text-lg hidden sm:block">
            Sport<span className="text-primary">Strike</span>
          </span>
        </Link>

        <motion.div
          className="hidden md:flex items-center gap-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-medium transition-colors',
                pathname === link.href
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted hover:text-foreground hover:bg-white/5',
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            className="relative glass px-3 py-2 rounded-xl text-sm hover:border-primary/30 transition-colors"
          >
            Bet Slip
            {items.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-black text-xs rounded-full flex items-center justify-center font-bold">
                {items.length}
              </span>
            )}
          </button>

          <Link href="/wallet" className="glass p-2 rounded-xl hover:border-primary/30 transition-colors">
            <Wallet className="w-5 h-5 text-primary" />
          </Link>

          {isAuthenticated ? (
            <Link href="/profile" className="glass p-2 rounded-xl flex items-center gap-2">
              <User className="w-5 h-5" />
              <span className="text-sm hidden lg:block">{user?.displayName}</span>
            </Link>
          ) : (
            <Link
              href="/auth/login"
              className="bg-primary text-black px-4 py-2 rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors"
            >
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}