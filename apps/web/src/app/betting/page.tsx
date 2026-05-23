'use client';

import { useState } from 'react';
import { LiveScoreCard } from '@/components/match/live-score-card';
import { MarketCard } from '@/components/betting/market-card';
import { MOCK_LIVE_MATCH } from '@/lib/mock-data';

const SPORTS = ['Cricket', 'Football', 'Kabaddi', 'Tennis', 'Basketball'];

export default function BettingPage() {
  const [sport, setSport] = useState('Cricket');

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-display font-bold mb-6">Sports Betting</h1>

      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {SPORTS.map((s) => (
          <button
            key={s}
            onClick={() => setSport(s)}
            className={`px-4 py-2 rounded-xl text-sm whitespace-nowrap transition-colors ${
              sport === s ? 'bg-primary text-black font-semibold' : 'glass text-muted'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <LiveScoreCard match={MOCK_LIVE_MATCH} />
      <section className="mt-8 space-y-4">
        <h2 className="text-xl font-bold">All Markets</h2>
        {MOCK_LIVE_MATCH.markets?.map((m) => (
          <MarketCard key={m.id} market={m} />
        ))}
      </section>
    </div>
  );
}
