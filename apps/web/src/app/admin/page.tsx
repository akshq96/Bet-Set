'use client';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const DATA = [
  { date: 'Mon', revenue: 120000, bets: 45000 },
  { date: 'Tue', revenue: 180000, bets: 62000 },
  { date: 'Wed', revenue: 150000, bets: 51000 },
  { date: 'Thu', revenue: 220000, bets: 78000 },
  { date: 'Fri', revenue: 280000, bets: 95000 },
];

export default function AdminPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-display font-bold mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Users', value: '12,450' },
          { label: 'Live Bets', value: '3,280' },
          { label: 'Pending KYC', value: '24' },
          { label: 'Today Revenue', value: '₹2.8L' },
        ].map((s) => (
          <div key={s.label} className="glass-card">
            <p className="text-muted text-sm">{s.label}</p>
            <p className="text-2xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>
      <div className="glass-card p-4 h-80">
        <h2 className="font-semibold mb-4">Revenue Analytics</h2>
        <ResponsiveContainer width="100%" height="90%">
          <BarChart data={DATA}>
            <XAxis dataKey="date" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip contentStyle={{ background: '#1a1a26', border: '1px solid #2a2a3d' }} />
            <Bar dataKey="revenue" fill="#00e676" radius={4} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}