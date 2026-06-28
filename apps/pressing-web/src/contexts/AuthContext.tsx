import { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  user: { email: string; name?: string } | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const token = localStorage.getItem('token');
  const [user, setUser] = useState<{ email: string; name?: string } | null>(
    token ? { email: '' } : null
  );

  const login = (accessToken: string) => {
    localStorage.setItem('token', accessToken);
    setUser({ email: '' });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function PrivateRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    window.location.href = '/login';
    return null;
  }
  return <>{children}</>;
}

export function useAuth() {
  return useContext(AuthContext);
}
