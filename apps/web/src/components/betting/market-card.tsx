'use client';

import { OddsButton } from './odds-button';

interface Selection {
  id: string;
  name: string;
  odds: number;
}

interface MarketCardProps {
  market: {
    id: string;
    name: string;
    status: string;
    selections: Selection[];
  };
}

export function MarketCard({ market }: MarketCardProps) {
  const suspended = market.status === 'SUSPENDED';

  return (
    <div className="glass-card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">{market.name}</h3>
        {suspended && (
          <span className="text-xs bg-warning/20 text-warning px-2 py-0.5 rounded-full">
            Suspended
          </span>
        )}
        {market.status === 'OPEN' && (
          <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full animate-pulse">
            LIVE
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {market.selections.map((sel) => (
          <OddsButton
            key={sel.id}
            selectionId={sel.id}
            marketId={market.id}
            marketName={market.name}
            name={sel.name}
            odds={Number(sel.odds)}
            suspended={suspended}
          />
        ))}
      </div>
    </div>
  );
}