\'use client\';

import Link from 'next/link';
import { MOCK_FANTASY_CONTESTS } from '@/lib/mock-data';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Users, Trophy } from 'lucide-react';

export default function FantasyPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-display font-bold mb-2">Fantasy Cricket</h1>
      <p className="text-muted mb-8">Dream11-style contests</p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {MOCK_FANTASY_CONTESTS.map((contest) => (
          <div key={contest.id} className="glass-card">
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="w-5 h-5 text-primary" />
              <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">{contest.type}</span>
            </div>
            <h3 className="font-bold text-lg mb-1">{contest.name}</h3>
            <div className="flex justify-between mb-4">
              <div>
                <p className="text-xs text-muted">Prize Pool</p>
                <p className="text-2xl font-bold text-primary">{formatCurrency(contest.prizePool)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted">Entry</p>
                <p className="font-bold">{formatCurrency(contest.entryFee)}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted mb-4">
              <Users className="w-3 h-3" />
              {contest.currentEntries.toLocaleString()} joined
            </div>
            <Link href={`/fantasy/contest/${contest.id}`}>
              <Button className="w-full">Join Contest</Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
