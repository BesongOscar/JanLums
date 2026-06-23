import * as SecureStore from 'expo-secure-store';
import { secureStorage } from '../../src/services/secureStorage';

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

const mockedSecureStore = SecureStore as jest.Mocked<typeof SecureStore>;

describe('secureStorage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAccessToken', () => {
    it('returns token when stored', async () => {
      mockedSecureStore.getItemAsync.mockResolvedValue('test-token');
      const result = await secureStorage.getAccessToken();
      expect(result).toBe('test-token');
      expect(mockedSecureStore.getItemAsync).toHaveBeenCalledWith('accessToken');
    });

    it('returns null when no token exists', async () => {
      mockedSecureStore.getItemAsync.mockResolvedValue(null);
      const result = await secureStorage.getAccessToken();
      expect(result).toBeNull();
    });

    it('returns null on error', async () => {
      mockedSecureStore.getItemAsync.mockRejectedValue(new Error('storage error'));
      const result = await secureStorage.getAccessToken();
      expect(result).toBeNull();
    });
  });

  describe('setAccessToken', () => {
    it('stores token successfully', async () => {
      mockedSecureStore.setItemAsync.mockResolvedValue(undefined);
      await secureStorage.setAccessToken('new-token');
      expect(mockedSecureStore.setItemAsync).toHaveBeenCalledWith('accessToken', 'new-token');
    });

    it('handles storage error gracefully', async () => {
      mockedSecureStore.setItemAsync.mockRejectedValue(new Error('write failed'));
      await expect(secureStorage.setAccessToken('token')).resolves.toBeUndefined();
    });
  });

  describe('getRefreshToken', () => {
    it('returns refresh token when stored', async () => {
      mockedSecureStore.getItemAsync.mockResolvedValue('refresh-token');
      const result = await secureStorage.getRefreshToken();
      expect(result).toBe('refresh-token');
      expect(mockedSecureStore.getItemAsync).toHaveBeenCalledWith('refreshToken');
    });

    it('returns null on error', async () => {
      mockedSecureStore.getItemAsync.mockRejectedValue(new Error('error'));
      const result = await secureStorage.getRefreshToken();
      expect(result).toBeNull();
    });
  });

  describe('setTokens', () => {
    it('sets both access and refresh tokens', async () => {
      mockedSecureStore.setItemAsync.mockResolvedValue(undefined);
      await secureStorage.setTokens('access-123', 'refresh-456');
      expect(mockedSecureStore.setItemAsync).toHaveBeenCalledWith('accessToken', 'access-123');
      expect(mockedSecureStore.setItemAsync).toHaveBeenCalledWith('refreshToken', 'refresh-456');
    });

    it('sets only access token when no refresh token provided', async () => {
      mockedSecureStore.setItemAsync.mockResolvedValue(undefined);
      await secureStorage.setTokens('access-123');
      expect(mockedSecureStore.setItemAsync).toHaveBeenCalledWith('accessToken', 'access-123');
      expect(mockedSecureStore.setItemAsync).toHaveBeenCalledTimes(1);
    });
  });

  describe('clearTokens', () => {
    it('deletes both tokens', async () => {
      mockedSecureStore.deleteItemAsync.mockResolvedValue(undefined);
      await secureStorage.clearTokens();
      expect(mockedSecureStore.deleteItemAsync).toHaveBeenCalledWith('accessToken');
      expect(mockedSecureStore.deleteItemAsync).toHaveBeenCalledWith('refreshToken');
    });

    it('handles deletion error gracefully', async () => {
      mockedSecureStore.deleteItemAsync.mockRejectedValue(new Error('delete failed'));
      await expect(secureStorage.clearTokens()).resolves.toBeUndefined();
    });
  });
});