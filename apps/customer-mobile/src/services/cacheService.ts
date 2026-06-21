import AsyncStorage from '@react-native-async-storage/async-storage';

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

export const cacheService = {
  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await AsyncStorage.getItem(key);
      if (!data) return null;

      const parsed: CacheEntry<T> = JSON.parse(data);
      if (parsed.expiresAt < Date.now()) {
        await AsyncStorage.removeItem(key);
        return null;
      }

      return parsed.value;
    } catch {
      return null;
    }
  },

  async set<T>(key: string, value: T, ttlMs: number): Promise<void> {
    try {
      const entry: CacheEntry<T> = {
        value,
        expiresAt: Date.now() + ttlMs,
      };
      await AsyncStorage.setItem(key, JSON.stringify(entry));
    } catch (error) {
      console.error('Failed to cache data:', error);
    }
  },

  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove cached data:', error);
    }
  },

  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  },
};

export const CACHE_TTL = {
  SERVICES: 24 * 60 * 60 * 1000,
  BRANCHES: 24 * 60 * 60 * 1000,
  ORDERS: 5 * 60 * 1000,
  USER_PROFILE: 5 * 60 * 1000,
  ADDRESSES: 24 * 60 * 60 * 1000,
} as const;
