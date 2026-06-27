export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  tenantId: number | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isPlatformAdmin: boolean;
}
