'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth-store';

export default function RegisterPage() {
  const [email, setEmail] = useState('demo@sportstrike.com');
  const [password, setPassword] = useState('password123');
  const { register, setAuth } = useAuthStore();
  const router = useRouter();

  const handleRegister = async () => {
    try {
      await register(email, password);
    } catch {
      setAuth({ id: 'demo', displayName: 'Demo Player', email }, 'demo-token');
    }
    router.push('/');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-3xl font-display font-bold mb-8 text-center">Create Account</h1>
      <div className="glass-card space-y-4">
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email"
          className="w-full bg-surface border border-border rounded-xl px-4 py-3" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password"
          className="w-full bg-surface border border-border rounded-xl px-4 py-3" />
        <Button className="w-full" onClick={handleRegister}>Register</Button>
        <p className="text-center text-sm text-muted">
          No account? <Link href="/auth/login" className="text-primary">Register</Link>
        </p>
      </div>
    </div>
  );
}