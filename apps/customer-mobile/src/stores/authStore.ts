import { create } from 'zustand';
import { AuthUser } from '../types';
import { secureStorage } from '../services/secureStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  tenantId: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  setAuth: (token: string, refreshToken: string | null, user: AuthUser) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<AuthUser>) => void;
  loadStoredAuth: () => Promise<void>;
  getTenantId: () => string | null;
  getUserId: () => string | null;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  refreshToken: null,
  user: null,
  tenantId: null,
  isAuthenticated: false,
  isLoading: true,

  setAuth: async (token, refreshToken, user) => {
    await secureStorage.setTokens(token, refreshToken ?? undefined);
    await AsyncStorage.setItem('auth-user', JSON.stringify(user));

    set({
      token,
      refreshToken,
      user,
      tenantId: user.tenantId,
      isAuthenticated: true,
    });
  },

  logout: async () => {
    await secureStorage.clearTokens();
    await AsyncStorage.removeItem('auth-user');

    set({
      token: null,
      refreshToken: null,
      user: null,
      tenantId: null,
      isAuthenticated: false,
    });
  },

  updateUser: (updates) => {
    const { user } = get();
    if (user) {
      const updatedUser = { ...user, ...updates };
      AsyncStorage.setItem('auth-user', JSON.stringify(updatedUser));
      set({ user: updatedUser });
    }
  },

  loadStoredAuth: async () => {
    try {
      const token = await secureStorage.getAccessToken();
      const userJson = await AsyncStorage.getItem('auth-user');

      if (token && userJson) {
        const user: AuthUser = JSON.parse(userJson);
        set({
          token,
          user,
          tenantId: user.tenantId,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },

  getTenantId: () => get().tenantId,
  getUserId: () => get().user?.id ?? null,
}));
