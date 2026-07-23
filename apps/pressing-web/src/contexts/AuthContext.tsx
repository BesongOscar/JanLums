import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  tenantId: string;
  tenantName?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthUser | null;
  tenantSlug: string | null;
  login: (accessToken: string, user: AuthUser, tenantSlug: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  tenantSlug: null,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const token = localStorage.getItem('token');
  const savedTenantSlug = localStorage.getItem('tenantSlug');
  const savedUserJson = localStorage.getItem('user');
  const savedUser = savedUserJson ? JSON.parse(savedUserJson) as AuthUser : null;

  const [user, setUser] = useState<AuthUser | null>(
    token && savedUser ? savedUser : null
  );
  const [tenantSlug, setTenantSlug] = useState<string | null>(
    token && savedTenantSlug ? savedTenantSlug : null
  );

  const login = useCallback((accessToken: string, userData: AuthUser, slug: string) => {
    localStorage.setItem('token', accessToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('tenantSlug', slug);
    setUser(userData);
    setTenantSlug(slug);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('tenantSlug');
    setUser(null);
    setTenantSlug(null);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, tenantSlug, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function PrivateRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) {
    window.location.href = '/login';
    return null;
  }
  if (user?.role !== 'admin') {
    window.location.href = '/login';
    return null;
  }
  return <>{children}</>;
}

export function useAuth() {
  return useContext(AuthContext);
}
