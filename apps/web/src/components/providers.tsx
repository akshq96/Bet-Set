'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { api } from '@/lib/api';

export function Providers({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    if (token) api.setToken(token);
  }, [token]);

  return <>{children}</>;
}