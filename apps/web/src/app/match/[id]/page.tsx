'use client';

import { useParams } from 'next/navigation';
import { MOCK_LIVE_MATCH } from '@/lib/mock-data';
import { LiveScoreCard } from '@/components/match/live-score-card';
import { MarketCard } from '@/components/betting/market-card';

export default function MatchDetailPage() {
  const params = useParams();
  const match = { ...MOCK_LIVE_MATCH, id: params.id as string };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <LiveScoreCard match={match} />
      <section>
        <h2 className="text-xl font-bold mb-4">Betting Markets</h2>
        <div className="space-y-4">
          {match.markets?.map((m) => (
            <MarketCard key={m.id} market={m} />
          ))}
        </div>
      </section>
    </div>
  );
}
