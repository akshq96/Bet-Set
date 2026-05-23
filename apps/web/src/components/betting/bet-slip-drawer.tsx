'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2 } from 'lucide-react';
import { useBetSlipStore } from '@/store/bet-slip-store';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatOdds } from '@/lib/utils';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth-store';

export function BetSlipDrawer() {
  const { items, isOpen, toggle, removeItem, updateStake, clear, totalStake, potentialReturn } =
    useBetSlipStore();
  const { isAuthenticated } = useAuthStore();

  const placeBets = async () => {
    if (!isAuthenticated) {
      window.location.href = '/auth/login';
      return;
    }
    for (const item of items) {
      try {
        await api.post('/betting/place', {
          selectionId: item.selectionId,
          stake: item.stake || 100,
        });
      } catch {
        /* use mock success in demo */
      }
    }
    clear();
    toggle();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[70]"
            onClick={toggle}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md glass z-[80] p-6 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-display font-bold">Bet Slip</h2>
              <button onClick={toggle} className="p-2 hover:bg-white/5 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            {items.length === 0 ? (
              <p className="text-muted text-center py-12">No selections added yet</p>
            ) : (
              <>
                <div className="space-y-3 mb-6">
                  {items.map((item) => (
                    <div key={item.selectionId} className="glass-card p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs text-muted">{item.marketName}</p>
                          <p className="font-medium">{item.selectionName}</p>
                          <p className="text-primary font-bold">{formatOdds(item.odds)}</p>
                        </div>
                        <button onClick={() => removeItem(item.selectionId)}>
                          <Trash2 className="w-4 h-4 text-danger" />
                        </button>
                      </div>
                      <input
                        type="number"
                        value={item.stake || 100}
                        onChange={(e) =>
                          updateStake(item.selectionId, Number(e.target.value))
                        }
                        className="mt-2 w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm"
                        min={10}
                      />
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Total Stake</span>
                    <span className="font-bold">{formatCurrency(totalStake())}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Potential Return</span>
                    <span className="font-bold text-primary">
                      {formatCurrency(potentialReturn())}
                    </span>
                  </div>
                  <Button className="w-full mt-4" onClick={placeBets}>
                    Place Bet
                  </Button>
                  <Button variant="ghost" className="w-full" onClick={clear}>
                    Clear All
                  </Button>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </AnimatePresence>
  );
}