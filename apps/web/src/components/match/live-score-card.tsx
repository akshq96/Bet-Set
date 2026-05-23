'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Radio } from 'lucide-react';

interface LiveScoreCardProps {
  match: {
    id: string;
    homeTeam: { shortName: string; name: string };
    awayTeam: { shortName: string; name: string };
    status: string;
    liveScore?: {
      score?: string;
      overs?: string;
      batting?: string;
      required?: number;
      ballsRemaining?: number;
    };
    winProbability?: { home: number; away: number };
  };
}

export function LiveScoreCard({ match }: LiveScoreCardProps) {
  const score = match.liveScore;
  const isLive = match.status === 'LIVE';

  return (
    <Link href={`/match/${match.id}`}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="glass-card cursor-pointer relative overflow-hidden"
      >
        {isLive && (
          <div className="absolute top-3 right-3 flex items-center gap-1 text-xs text-danger">
            <Radio className="w-3 h-3 animate-pulse" />
            LIVE
          </div>
        )}

        <div className="flex items-center justify-between gap-4">
          <TeamBlock team={match.homeTeam} prob={match.winProbability?.home} />
          <div className="text-center flex-shrink-0">
            {score ? (
              <>
                <p className="text-2xl font-display font-bold">{score.score}</p>
                <p className="text-xs text-muted">{score.overs} ov</p>
                {score.required && (
                  <p className="text-xs text-primary mt-1">
                    Need {score.required} off {score.ballsRemaining}
                  </p>
                )}
              </>
            ) : (
              <p className="text-muted text-sm">vs</p>
            )}
          </div>
          <TeamBlock team={match.awayTeam} prob={match.winProbability?.away} align="right" />
        </div>
      </div>
    </Link>
  );
}

function TeamBlock({
  team,
  prob,
  align = 'left',
}: {
  team: { shortName: string; name: string };
  prob?: number;
  align?: 'left' | 'right';
}) {
  return (
    <div className={`flex-1 ${align === 'right' ? 'text-right' : ''}`}>
      <div className="w-12 h-12 rounded-full bg-surface border border-border flex items-center justify-center text-lg font-bold mb-2 mx-auto">
        {team.shortName}
      </div>
      <p className="font-semibold text-sm">{team.shortName}</p>
      {prob !== undefined && (
        <div className="mt-2">
          <div className="h-1 bg-border rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${prob * 100}%` }}
            />
          </div>
          <p className="text-xs text-muted mt-1">{Math.round(prob * 100)}%</p>
        </div>
      )}
    </div>
  );
}