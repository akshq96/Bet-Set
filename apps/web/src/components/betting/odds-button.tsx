'use client';

import { motion } from 'framer-motion';
import { cn, formatOdds } from '@/lib/utils';
import { useBetSlipStore } from '@/store/bet-slip-store';

interface OddsButtonProps {
  selectionId: string;
  marketId: string;
  marketName: string;
  name: string;
  odds: number;
  suspended?: boolean;
}

export function OddsButton({
  selectionId,
  marketId,
  marketName,
  name,
  odds,
  suspended,
}: OddsButtonProps) {
  const addItem = useBetSlipStore((s) => s.addItem);
  const isSelected = useBetSlipStore((s) =>
    s.items.some((i) => i.selectionId === selectionId),
  );

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      disabled={suspended}
      onClick={() =>
        addItem({
          selectionId,
          marketId,
          marketName,
          selectionName: name,
          odds,
          stake: 100,
        })
      }
      className={cn(
        'flex flex-col items-center justify-center p-3 rounded-xl border transition-all min-w-[100px]',
        suspended && 'opacity-40 cursor-not-allowed',
        isSelected
          ? 'border-primary bg-primary/10 shadow-lg shadow-primary/10'
          : 'border-border bg-card hover:border-primary/40 hover:bg-primary/5',
      )}
    >
      <span className="text-xs text-muted truncate max-w-full">{name}</span>
      <span className="text-lg font-bold font-display text-primary mt-1">
        {formatOdds(odds)}
      </span>
    </motion.button>
  );
}