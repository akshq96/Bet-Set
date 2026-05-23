'use client';
import { MOCK_PREDICTION_MARKETS } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { TrendingUp } from 'lucide-react';

export default function PredictionsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-display font-bold mb-8 flex items-center gap-2">
        <TrendingUp className="text-accent" /> Prediction Markets
      </h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {MOCK_PREDICTION_MARKETS.map((m) => (
          <div key={m.id} className="glass-card">
            <span className="text-xs text-accent">{m.category}</span>
            <h3 className="font-semibold mt-2 mb-4">{m.title}</h3>
            <div className="grid grid-cols-2 gap-2">
              <button className="p-3 rounded-xl border border-primary/30 bg-primary/5">
                <p className="text-xs text-muted">YES</p>
                <p className="text-lg font-bold text-primary">₹{m.yesPrice.toFixed(2)}</p>
              </button>
              <button className="p-3 rounded-xl border border-danger/30 bg-danger/5">
                <p className="text-xs text-muted">NO</p>
                <p className="text-lg font-bold text-danger">₹{m.noPrice.toFixed(2)}</p>
              </button>
            </div>
            <Button className="w-full mt-3" variant="secondary">Trade</Button>
          </div>
        ))}
      </div>
    </div>
  );
}