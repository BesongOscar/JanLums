import { AuthUser } from '../../../types';

export interface LoginCredentials {
  email: string;
  password: string;
  tenantSlug: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  tenantSlug: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  user: AuthUser;
}
