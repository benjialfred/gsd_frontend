import { create } from 'zustand';
import api, { clearApiCache } from '../services/api';

interface AuthState {
  token: string | null;
  user: any | null;
  login: (access: string, refresh: string, userData: any) => void;
  logout: () => void;
  updateUser: (userData: any) => void;
  checkAuth: () => Promise<any>;
  fetchUser: () => Promise<any>;
}

export const useAuthStore = create<AuthState>((set) => {
  // Load initial state from LocalStorage
  const token = localStorage.getItem('access');
  let user = null;
  const savedUser = localStorage.getItem('user');
  if (savedUser) {
    try {
      user = JSON.parse(savedUser);
    } catch (e) {
      // Ignored
    }
  }

  const checkAuth = async () => {
    const accessToken = localStorage.getItem('access');
    if (!accessToken) return null;
    try {
      const res = await api.get('/api/users/me/');
      localStorage.setItem('user', JSON.stringify(res.data));
      set({ user: res.data });
      return res.data;
    } catch (err) {
      console.error('Error refreshing current user profile:', err);
      return null;
    }
  };

  return {
    token,
    user,
    login: (access, refresh, userData) => {
      clearApiCache();
      localStorage.setItem('access', access);
      localStorage.setItem('refresh', refresh);
      localStorage.setItem('user', JSON.stringify(userData));
      set({ token: access, user: userData });
    },
    logout: () => {
      clearApiCache();
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      localStorage.removeItem('user');
      set({ token: null, user: null });
    },
    updateUser: (userData) => {
      localStorage.setItem('user', JSON.stringify(userData));
      set({ user: userData });
    },
    checkAuth,
    fetchUser: checkAuth,
  };
});

