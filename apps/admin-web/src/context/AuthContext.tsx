import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import adminApi from '../api/adminApi';
import type { User, LoginCredentials, AuthState } from '../types/auth';

interface AuthContextValue extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function getStoredAuth(): { user: User | null; token: string | null } {
  try {
    const token = localStorage.getItem('admin_token');
    const userStr = localStorage.getItem('admin_user');
    const user = userStr ? JSON.parse(userStr) : null;
    return { user, token };
  } catch {
    return { user: null, token: null };
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(getStoredAuth().user);
  const [token, setToken] = useState<string | null>(getStoredAuth().token);
  const [loading, setLoading] = useState(false);

  const isAuthenticated = !!token && !!user;
  const isPlatformAdmin = user?.role === 'platform_admin';

  const login = useCallback(async (credentials: LoginCredentials) => {
    setLoading(true);
    try {
      const { data } = await adminApi.post('/auth/login', credentials);
      localStorage.setItem('admin_token', data.accessToken);
      localStorage.setItem('admin_user', JSON.stringify(data.user));
      setToken(data.accessToken);
      setUser(data.user);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    if (token) {
      adminApi.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      delete adminApi.defaults.headers.common.Authorization;
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, isPlatformAdmin, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
