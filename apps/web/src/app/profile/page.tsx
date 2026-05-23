'use client';
import { useAuthStore } from '@/store/auth-store';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, isAuthenticated, logout } = useAuthStore();
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <p className="text-muted mb-4">Please login to view profile</p>
        <Link href="/auth/login"><Button>Login</Button></Link>
      </div>
    );
  }
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="glass-card flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-2xl font-bold text-primary">
          {user?.displayName?.[0]}
        </div>
        <div>
          <h1 className="text-xl font-bold">{user?.displayName}</h1>
          <p className="text-muted text-sm">{user?.email}</p>
        </div>
      </div>
      <div className="space-y-2">
        {['Betting History', 'KYC Verification', 'Referrals', 'Achievements', 'Settings'].map((item) => (
          <div key={item} className="glass-card py-3 px-4 cursor-pointer hover:border-primary/30">{item}</div>
        ))}
      </div>
      <Button variant="danger" className="w-full mt-6" onClick={logout}>Logout</Button>
    </div>
  );
}