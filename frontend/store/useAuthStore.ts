import { create } from 'zustand';
import { User } from '../types';
import { storage } from '../utils/storage';
import { authService } from '../services/api';

interface AuthState {
  user: User | null;
  loading: boolean;
  initialized: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  setInitialized: (initialized: boolean) => void;
  init: () => Promise<void>;
  login: (credentials: any) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  initialized: false,
  error: null,

  setUser: (user) => set({ user, loading: false }),
  setInitialized: (initialized) => set({ initialized }),

  init: async () => {
    try {
      const token = await storage.getItem('token');
      const userStr = await storage.getItem('user');
      if (token && userStr) {
        set({ user: JSON.parse(userStr), loading: false, initialized: true });
      } else {
        set({ user: null, loading: false, initialized: true });
      }
    } catch (e) {
      set({ user: null, loading: false, initialized: true });
    }
  },

  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const res = await authService.login(credentials);
      const { token, user } = res.data;
      await storage.setItem('token', token);
      await storage.setItem('user', JSON.stringify(user));
      set({ user, loading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Login failed', loading: false });
      throw error;
    }
  },

  register: async (userData) => {
    set({ loading: true, error: null });
    try {
      const res = await authService.register(userData);
      const { token, user } = res.data;
      await storage.setItem('token', token);
      await storage.setItem('user', JSON.stringify(user));
      set({ user, loading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Registration failed', loading: false });
      throw error;
    }
  },

  logout: async () => {
    set({ loading: true });
    await storage.deleteItem('token');
    await storage.deleteItem('user');
    set({ user: null, loading: false });
  }
}));
