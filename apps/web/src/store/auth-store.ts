import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '@/lib/api';

interface User {
  id: string;
  displayName: string;
  email?: string;
  role?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; displayName: string }) => Promise<void>;
  logout: () => void;
  setAuth: (user: User, token: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (user, token) => {
        api.setToken(token);
        set({ user, token, isAuthenticated: true });
      },

      login: async (email, password) => {
        const res = await api.post<{ user: User; accessToken: string }>('/auth/login', {
          email,
          password,
        });
        api.setToken(res.accessToken);
        set({ user: res.user, token: res.accessToken, isAuthenticated: true });
      },

      register: async (data) => {
        const res = await api.post<{ user: User; accessToken: string }>('/auth/register', data);
        api.setToken(res.accessToken);
        set({ user: res.user, token: res.accessToken, isAuthenticated: true });
      },

      logout: () => {
        api.setToken(null);
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    { name: 'sportstrike-auth' },
  ),
);
