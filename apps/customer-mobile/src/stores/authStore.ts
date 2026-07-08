import { create } from 'zustand';
import { AuthUser, TenantInfo } from '../types';
import { secureStorage } from '../services/secureStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TENANT_STORAGE_KEY = '@janlums/tenant';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  tenantId: string | null;
  tenant: TenantInfo | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  setAuth: (token: string, refreshToken: string | null, user: AuthUser) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
  updateUser: (updates: Partial<AuthUser>) => void;
  setTenant: (tenant: TenantInfo) => Promise<void>;
  clearTenant: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  refreshToken: null,
  user: null,
  tenantId: null,
  tenant: null,
  isAuthenticated: false,
  isLoading: true,

  setAuth: async (token, refreshToken, user) => {
    await secureStorage.setTokens(token, refreshToken ?? undefined);
    await AsyncStorage.setItem('auth-user', JSON.stringify(user));

    set({
      accessToken: token,
      refreshToken,
      user,
      tenantId: user.tenantId,
      isAuthenticated: true,
    });
  },

  logout: async () => {
    await secureStorage.clearTokens();
    await AsyncStorage.removeItem('auth-user');
    await AsyncStorage.removeItem(TENANT_STORAGE_KEY);

    set({
      accessToken: null,
      refreshToken: null,
      user: null,
      tenantId: null,
      tenant: null,
      isAuthenticated: false,
    });
  },

  restoreSession: async () => {
    try {
      const token = await secureStorage.getAccessToken();
      const userJson = await AsyncStorage.getItem('auth-user');

      if (token && userJson) {
        const user: AuthUser = JSON.parse(userJson);
        set({
          accessToken: token,
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

  updateUser: (updates) => {
    const { user } = get();
    if (user) {
      const updatedUser = { ...user, ...updates };
      AsyncStorage.setItem('auth-user', JSON.stringify(updatedUser));
      set({ user: updatedUser });
    }
  },

  setTenant: async (tenant) => {
    await AsyncStorage.setItem(TENANT_STORAGE_KEY, JSON.stringify(tenant));
    set({ tenant });
  },

  clearTenant: async () => {
    await AsyncStorage.removeItem(TENANT_STORAGE_KEY);
    set({ tenant: null });
  },
}));

export async function restoreTenant(): Promise<TenantInfo | null> {
  try {
    const json = await AsyncStorage.getItem(TENANT_STORAGE_KEY);
    if (json) {
      return JSON.parse(json) as TenantInfo;
    }
  } catch {
    // ignore
  }
  return null;
}
