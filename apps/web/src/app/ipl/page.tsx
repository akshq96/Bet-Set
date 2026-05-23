'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LiveScoreCard } from '@/components/match/live-score-card';
import { MarketCard } from '@/components/betting/market-card';
import { MOCK_LIVE_MATCH } from '@/lib/mock-data';
import { api } from '@/lib/api';
import { getSocket, joinMatchRoom, WS_EVENTS } from '@/lib/socket';

export default function IPLPage() {
  const [match, setMatch] = useState(MOCK_LIVE_MATCH);
  const [commentary, setCommentary] = useState<string[]>([]);

  useEffect(() => {
    api.get<unknown[]>('/sports/live?sport=cricket')
      .then((matches) => {
        if (matches[0]) setMatch(matches[0] as typeof MOCK_LIVE_MATCH);
      })
      .catch(() => {});

    const socket = getSocket();
    joinMatchRoom(match.id);
    socket.on(WS_EVENTS.MATCH_SCORE, (data: { commentary?: { text: string }[] }) => {
      if (data.commentary) setCommentary(data.commentary.map((c) => c.text));
    });
    return () => { socket.off(WS_EVENTS.MATCH_SCORE); };
  }, [match.id]);

  const defaultCommentary = [
    'FOUR! Dhoni finds the gap at deep mid-wicket!',
    'Single taken, good running between the wickets.',
    'Dot ball. Excellent line and length.',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-3xl font-display font-bold mb-2">IPL 2026 Live</h1>
        <p className="text-muted mb-8">Ball-by-ball betting • Live scores • Win probability</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <LiveScoreCard match={match} />
          <section>
            <h2 className="text-xl font-bold mb-4">Live Markets</h2>
            <div className="space-y-4">
              {match.markets?.map((market) => (
                <MarketCard key={market.id} market={market} />
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-4">
          <div className="glass-card">
            <h3 className="font-semibold mb-3">Ball-by-Ball Commentary</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {(commentary.length ? commentary : defaultCommentary).map((text, i) => (
                <p key={i} className="text-sm border-l-2 border-primary/30 pl-3 py-1">{text}</p>
              ))}
            </div>
          </div>

          <div className="glass-card">
            <h3 className="font-semibold mb-2">Win Probability</h3>
            <ProbBar label={match.homeTeam.shortName} value={match.winProbability?.home ?? 0.38} />
            <ProbBar label={match.awayTeam.shortName} value={match.winProbability?.away ?? 0.62} />
          </div>
        </aside>
      </div>
    </div>
  );
}

function ProbBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="mb-3">
      <div className="flex justify-between text-sm mb-1">
        <span>{label}</span>
        <span className="text-primary">{Math.round(value * 100)}%</span>
      </div>
      <div className="h-2 bg-border rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${value * 100}%` }}
        />
      </div>
    </div>
  );
}
