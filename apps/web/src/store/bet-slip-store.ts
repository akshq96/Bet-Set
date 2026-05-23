import { create } from 'zustand';
import type { BetSlipItem } from '@sportstrike/shared';

interface BetSlipState {
  items: BetSlipItem[];
  isOpen: boolean;
  addItem: (item: BetSlipItem) => void;
  removeItem: (selectionId: string) => void;
  updateStake: (selectionId: string, stake: number) => void;
  clear: () => void;
  toggle: () => void;
  totalStake: () => number;
  potentialReturn: () => number;
}

export const useBetSlipStore = create<BetSlipState>((set, get) => ({
  items: [],
  isOpen: false,

  addItem: (item) => {
    set((state) => {
      const exists = state.items.find((i) => i.selectionId === item.selectionId);
      if (exists) return state;
      return { items: [...state.items, item], isOpen: true };
    });
  },

  removeItem: (selectionId) => {
    set((state) => ({
      items: state.items.filter((i) => i.selectionId !== selectionId),
    }));
  },

  updateStake: (selectionId, stake) => {
    set((state) => ({
      items: state.items.map((i) =>
        i.selectionId === selectionId ? { ...i, stake } : i,
      ),
    }));
  },

  clear: () => set({ items: [], isOpen: false }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),

  totalStake: () => get().items.reduce((sum, i) => sum + (i.stake || 0), 0),

  potentialReturn: () =>
    get().items.reduce((sum, i) => sum + (i.stake || 0) * i.odds, 0),
}));
