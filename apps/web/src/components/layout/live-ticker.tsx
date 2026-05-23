'use client';

import { TICKER_ITEMS } from '@/lib/mock-data';

export function LiveTicker() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-surface/90 border-b border-border overflow-hidden h-8 flex items-center">
      <div className="flex animate-ticker whitespace-nowrap">
        {items.map((item, i) => (
          <span key={i} className="mx-8 text-xs text-muted">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}