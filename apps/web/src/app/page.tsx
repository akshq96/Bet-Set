'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Trophy, TrendingUp, Target, Sparkles, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LiveScoreCard } from '@/components/match/live-score-card';
import { MOCK_LIVE_MATCH, MOCK_PREDICTION_MARKETS, MOCK_FANTASY_CONTESTS } from '@/lib/mock-data';
import { formatCurrency } from '@/lib/utils';

const FEATURES = [
  { icon: Target, title: 'Live Betting', desc: 'Ball-by-ball IPL odds with instant cashout', href: '/betting', color: 'text-primary' },
  { icon: Trophy, title: 'Fantasy Sports', desc: 'Dream11-style mega contests & private leagues', href: '/fantasy', color: 'text-accent' },
  { icon: TrendingUp, title: 'Predictions', desc: 'Probo-style YES/NO markets with live charts', href: '/predictions', color: 'text-warning' },
  { icon: Sparkles, title: 'AI Insights', desc: 'Smart predictions & personalized picks', href: '/ipl', color: 'text-primary' },
];

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl glass p-8 md:p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-2xl"
        >
          <span className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm px-3 py-1 rounded-full mb-4">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            IPL 2026 Live Now
          </span>
          <h1 className="text-4xl md:text-6xl font-display font-bold leading-tight mb-4">
            Bet Smarter.
            <br />
            <span className="text-primary">Play Harder.</span>
          </h1>
          <p className="text-muted text-lg mb-8 max-w-lg">
            India&apos;s premium sports platform — live cricket betting, fantasy contests,
            and prediction markets with real-time odds.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/ipl">
              <Button size="lg">
                Watch IPL Live <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button variant="outline" size="lg">Get ₹500 Bonus</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Live Match */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-display font-bold">🔴 Live Now</h2>
          <Link href="/ipl" className="text-primary text-sm hover:underline">View all</Link>
        </div>
        <LiveScoreCard match={MOCK_LIVE_MATCH} />
      </section>

      {/* Features Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link href={f.href} className="glass-card block h-full hover:scale-[1.02] transition-transform">
              <f.icon className={`w-8 h-8 ${f.color} mb-3`} />
              <h3 className="font-semibold mb-1">{f.title}</h3>
              <p className="text-sm text-muted">{f.desc}</p>
            </Link>
          </div>
        ))}
      </section>

      {/* Fantasy + Predictions */}
      <section className="grid md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-display font-bold mb-4">🏆 Mega Contests</h2>
          {MOCK_FANTASY_CONTESTS.map((c) => (
            <Link key={c.id} href="/fantasy" className="glass-card block mb-3 hover:border-primary/30">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{c.name}</p>
                  <p className="text-sm text-muted">Entry {formatCurrency(c.entryFee)}</p>
                </div>
                <div className="text-right">
                  <p className="text-primary font-bold">{formatCurrency(c.prizePool)}</p>
                  <p className="text-xs text-muted">{c.currentEntries.toLocaleString()} joined</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div>
          <h2 className="text-xl font-display font-bold mb-4">📈 Trending Markets</h2>
          {MOCK_PREDICTION_MARKETS.slice(0, 2).map((m) => (
            <Link key={m.id} href="/predictions" className="glass-card block mb-3 hover:border-accent/30">
              <p className="font-medium mb-2">{m.title}</p>
              <div className="flex gap-4">
                <span className="text-primary font-bold">YES ₹{m.yesPrice.toFixed(2)}</span>
                <span className="text-danger font-bold">NO ₹{m.noPrice.toFixed(2)}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trust badges */}
      <section className="flex flex-wrap justify-center gap-8 py-8 text-muted text-sm">
        <span className="flex items-center gap-2"><Shield className="w-4 h-4 text-primary" /> SSL Encrypted</span>
        <span className="flex items-center gap-2"><Shield className="w-4 h-4 text-primary" /> Instant Withdrawals</span>
        <span className="flex items-center gap-2"><Shield className="w-4 h-4 text-primary" /> 24/7 Support</span>
      </section>
    </div>
  );
}