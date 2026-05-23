'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';

export default function WalletPage() {
  const [amount, setAmount] = useState(500);
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-display font-bold mb-8">Wallet</h1>
      <div className="glass-card p-6 mb-6">
        <p className="text-muted text-sm">Balance</p>
        <p className="text-4xl font-bold text-primary">{formatCurrency(10000)}</p>
      </div>
      <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))}
        className="w-full bg-surface border border-border rounded-xl px-4 py-3 mb-4" />
      <Button className="w-full">Deposit via Razorpay</Button>
    </div>
  );
}