import { renderHook, act } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { useLogin } from '../../../../src/features/auth/hooks/useLogin';
import { authService } from '../../../../src/features/auth/services/auth.service';
import { useAuthStore } from '../../../../src/stores/authStore';

const mockReplace = jest.fn();

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({ replace: mockReplace }),
}));

jest.mock('../../../../src/features/auth/services/auth.service', () => ({
  authService: {
    login: jest.fn(),
  },
}));

const mockedAuthService = authService as jest.Mocked<typeof authService>;

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
});

function Wrapper({ children }: { children: ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

const mockLoginResponse = {
  accessToken: 'access-token-123',
  refreshToken: 'refresh-token-456',
  user: {
    id: 'user-1',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    role: 'customer',
    tenantId: 'tenant-1',
  },
};

describe('useLogin', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
    useAuthStore.setState({
      accessToken: null,
      refreshToken: null,
      user: null,
      tenantId: null,
      tenant: null,
      isAuthenticated: false,
      isLoading: false,
    });
  });

  it('calls authService.login with credentials including tenantSlug', async () => {
    mockedAuthService.login.mockResolvedValue(mockLoginResponse);

    const { result } = renderHook(() => useLogin(), { wrapper: Wrapper });

    await act(async () => {
      await result.current.mutateAsync({
        email: 'test@example.com',
        password: 'password123',
        tenantSlug: 'test-business',
      });
    });

    expect(mockedAuthService.login.mock.calls[0][0]).toEqual({
      email: 'test@example.com',
      password: 'password123',
      tenantSlug: 'test-business',
    });
  });

  it('sets auth state on successful login', async () => {
    mockedAuthService.login.mockResolvedValue(mockLoginResponse);

    const { result } = renderHook(() => useLogin(), { wrapper: Wrapper });

    await act(async () => {
      await result.current.mutateAsync({
        email: 'test@example.com',
        password: 'password123',
        tenantSlug: 'test-business',
      });
    });

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.accessToken).toBe('access-token-123');
    expect(state.user).toEqual(mockLoginResponse.user);
  });

  it('navigates to tabs on success', async () => {
    mockedAuthService.login.mockResolvedValue(mockLoginResponse);

    const { result } = renderHook(() => useLogin(), { wrapper: Wrapper });

    await act(async () => {
      await result.current.mutateAsync({
        email: 'test@example.com',
        password: 'password123',
        tenantSlug: 'test-business',
      });
    });

    expect(mockReplace).toHaveBeenCalledWith('/(tabs)');
  });

  it('handles login failure', async () => {
    mockedAuthService.login.mockRejectedValue(new Error('Invalid credentials'));

    const { result } = renderHook(() => useLogin(), { wrapper: Wrapper });

    await act(async () => {
      try {
        await result.current.mutateAsync({
          email: 'wrong@example.com',
          password: 'wrong',
          tenantSlug: 'test-business',
        });
      } catch {
        // expected
      }
    });

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(mockReplace).not.toHaveBeenCalled();
  });
});