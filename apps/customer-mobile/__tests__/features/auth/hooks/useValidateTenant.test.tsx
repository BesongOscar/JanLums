import { renderHook, act } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { useValidateTenant } from '../../../../src/features/auth/hooks/useValidateTenant';
import { authService } from '../../../../src/features/auth/services/auth.service';

jest.mock('../../../../src/features/auth/services/auth.service', () => ({
  authService: {
    validateTenant: jest.fn(),
  },
}));

const mockedAuthService = authService as jest.Mocked<typeof authService>;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false, gcTime: 0 },
  },
});

function Wrapper({ children }: { children: ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

const mockTenantResponse = {
  id: 'tenant-1',
  slug: 'test-business',
  name: 'Test Business',
  logoUrl: null,
  primaryColor: '#00A86B',
};

describe('useValidateTenant', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  it('calls authService.validateTenant with the slug', async () => {
    mockedAuthService.validateTenant.mockResolvedValue(mockTenantResponse);

    const { result } = renderHook(() => useValidateTenant(), { wrapper: Wrapper });

    await act(async () => {
      await result.current.mutateAsync('test-business');
    });

    expect(mockedAuthService.validateTenant).toHaveBeenCalledWith('test-business');
  });

  it('returns tenant info on success', async () => {
    mockedAuthService.validateTenant.mockResolvedValue(mockTenantResponse);

    const { result } = renderHook(() => useValidateTenant(), { wrapper: Wrapper });

    await act(async () => {
      const data = await result.current.mutateAsync('test-business');
      expect(data).toEqual(mockTenantResponse);
    });
  });

  it('handles tenant not found error', async () => {
    mockedAuthService.validateTenant.mockRejectedValue({
      response: { status: 404, data: { message: 'Tenant not found' } },
    });

    const { result } = renderHook(() => useValidateTenant(), { wrapper: Wrapper });

    await act(async () => {
      try {
        await result.current.mutateAsync('non-existent');
      } catch (e) {
        const error = e as { response?: { status?: number } };
        expect(error.response?.status).toBe(404);
      }
    });
  });

  it('handles network failure', async () => {
    mockedAuthService.validateTenant.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useValidateTenant(), { wrapper: Wrapper });

    await act(async () => {
      try {
        await result.current.mutateAsync('test-business');
      } catch (e) {
        const error = e as Error;
        expect(error.message).toBe('Network error');
      }
    });
  });
});
