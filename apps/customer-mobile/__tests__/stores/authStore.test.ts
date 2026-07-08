import { useAuthStore, restoreTenant } from '../../src/stores/authStore';
import { secureStorage } from '../../src/services/secureStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('../../src/services/secureStorage', () => ({
  secureStorage: {
    setTokens: jest.fn(),
    getAccessToken: jest.fn(),
    clearTokens: jest.fn(),
  },
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

const mockUser = {
  id: 'user-1',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  role: 'customer',
  tenantId: 'tenant-1',
};

const mockTenant = {
  slug: 'test-business',
  name: 'Test Business',
  logoUrl: undefined,
  primaryColor: '#00A86B',
};

describe('authStore', () => {
  beforeEach(() => {
    useAuthStore.setState({
      accessToken: null,
      refreshToken: null,
      user: null,
      tenantId: null,
      tenant: null,
      isAuthenticated: false,
      isLoading: true,
    });
    jest.clearAllMocks();
  });

  describe('initial state', () => {
    it('starts with unauthenticated state', () => {
      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
      expect(state.accessToken).toBeNull();
      expect(state.user).toBeNull();
      expect(state.tenant).toBeNull();
    });
  });

  describe('setAuth', () => {
    it('sets authenticated state with tokens and user', async () => {
      await useAuthStore.getState().setAuth('token-123', 'refresh-456', mockUser);

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(true);
      expect(state.accessToken).toBe('token-123');
      expect(state.refreshToken).toBe('refresh-456');
      expect(state.user).toEqual(mockUser);
      expect(state.tenantId).toBe('tenant-1');
    });

    it('persists tokens and user to storage', async () => {
      await useAuthStore.getState().setAuth('token-123', 'refresh-456', mockUser);

      expect(secureStorage.setTokens).toHaveBeenCalledWith('token-123', 'refresh-456');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('auth-user', JSON.stringify(mockUser));
    });

    it('handles missing refresh token', async () => {
      await useAuthStore.getState().setAuth('token-123', null, mockUser);

      expect(secureStorage.setTokens).toHaveBeenCalledWith('token-123', undefined);
    });
  });

  describe('logout', () => {
    it('clears auth state but preserves tenant', async () => {
      await useAuthStore.getState().setTenant(mockTenant);
      await useAuthStore.getState().setAuth('token-123', 'refresh-456', mockUser);
      await useAuthStore.getState().logout();

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
      expect(state.accessToken).toBeNull();
      expect(state.user).toBeNull();
      expect(state.tenant).toEqual(mockTenant);
    });

    it('clears storage', async () => {
      await useAuthStore.getState().logout();

      expect(secureStorage.clearTokens).toHaveBeenCalled();
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('auth-user');
    });
  });

  describe('restoreSession', () => {
    it('restores session when token and user exist', async () => {
      (secureStorage.getAccessToken as jest.Mock).mockResolvedValue('stored-token');
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockUser));

      await useAuthStore.getState().restoreSession();

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(true);
      expect(state.accessToken).toBe('stored-token');
      expect(state.user).toEqual(mockUser);
      expect(state.isLoading).toBe(false);
    });

    it('sets loading false when no session exists', async () => {
      (secureStorage.getAccessToken as jest.Mock).mockResolvedValue(null);
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      await useAuthStore.getState().restoreSession();

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(false);
    });

    it('sets loading false on error', async () => {
      (secureStorage.getAccessToken as jest.Mock).mockRejectedValue(new Error('storage error'));

      await useAuthStore.getState().restoreSession();

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(false);
    });
  });

  describe('updateUser', () => {
    it('updates user fields', async () => {
      await useAuthStore.getState().setAuth('token-123', null, mockUser);
      useAuthStore.getState().updateUser({ firstName: 'Updated' });

      const state = useAuthStore.getState();
      expect(state.user?.firstName).toBe('Updated');
      expect(state.user?.lastName).toBe('User');
    });
  });

  describe('setTenant', () => {
    it('sets tenant in state', async () => {
      await useAuthStore.getState().setTenant(mockTenant);

      const state = useAuthStore.getState();
      expect(state.tenant).toEqual(mockTenant);
    });

    it('persists tenant to storage', async () => {
      await useAuthStore.getState().setTenant(mockTenant);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@janlums/tenant',
        JSON.stringify(mockTenant)
      );
    });
  });

  describe('clearTenant', () => {
    it('clears tenant from state', async () => {
      await useAuthStore.getState().setTenant(mockTenant);
      await useAuthStore.getState().clearTenant();

      const state = useAuthStore.getState();
      expect(state.tenant).toBeNull();
    });

    it('removes tenant from storage', async () => {
      await useAuthStore.getState().clearTenant();

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('@janlums/tenant');
    });
  });

  describe('restoreTenant', () => {
    it('returns tenant from storage', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockTenant));

      const tenant = await restoreTenant();

      expect(tenant).toEqual(mockTenant);
    });

    it('returns null when no tenant stored', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const tenant = await restoreTenant();

      expect(tenant).toBeNull();
    });

    it('returns null on error', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(new Error('storage error'));

      const tenant = await restoreTenant();

      expect(tenant).toBeNull();
    });
  });
});
