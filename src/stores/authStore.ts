import { create } from 'zustand';

interface AuthState {
  token: string | null;
  user: any | null;
  login: (access: string, refresh: string, userData: any) => void;
  logout: () => void;
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

  return {
    token,
    user,
    login: (access, refresh, userData) => {
      localStorage.setItem('access', access);
      localStorage.setItem('refresh', refresh);
      localStorage.setItem('user', JSON.stringify(userData));
      set({ token: access, user: userData });
    },
    logout: () => {
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      localStorage.removeItem('user');
      set({ token: null, user: null });
    },
  };
});
