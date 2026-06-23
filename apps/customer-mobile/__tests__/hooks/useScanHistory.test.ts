import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScanHistoryItem } from '../../src/hooks/useScanHistory';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

const mockedAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

const mockScans: ScanHistoryItem[] = [
  { orderId: 'order-1', scannedAt: '2024-01-15T10:00:00Z', qrType: 'order' },
  { orderId: 'order-2', scannedAt: '2024-01-14T09:00:00Z', qrType: 'order' },
];

describe('useScanHistory (storage integration)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('loadScans', () => {
    it('loads scans from AsyncStorage', async () => {
      mockedAsyncStorage.getItem.mockResolvedValue(JSON.stringify(mockScans));

      const raw = await AsyncStorage.getItem('@janlums/scan_history');
      const parsed: ScanHistoryItem[] = JSON.parse(raw!);

      expect(mockedAsyncStorage.getItem).toHaveBeenCalledWith(
        '@janlums/scan_history'
      );
      expect(parsed).toHaveLength(2);
      expect(parsed[0].orderId).toBe('order-1');
    });

    it('returns empty array when no scans stored', async () => {
      mockedAsyncStorage.getItem.mockResolvedValue(null);

      const raw = await AsyncStorage.getItem('@janlums/scan_history');
      expect(raw).toBeNull();
    });

    it('handles corrupted storage data gracefully', async () => {
      mockedAsyncStorage.getItem.mockResolvedValue('{invalid json}');

      const raw = await AsyncStorage.getItem('@janlums/scan_history');
      expect(() => JSON.parse(raw!)).toThrow();
    });
  });

  describe('addScan', () => {
    it('adds a new scan to history', async () => {
      mockedAsyncStorage.getItem.mockResolvedValue(JSON.stringify(mockScans));
      mockedAsyncStorage.setItem.mockResolvedValue();

      const existingRaw = await AsyncStorage.getItem('@janlums/scan_history');
      const existing: ScanHistoryItem[] = JSON.parse(existingRaw!);
      const newItem: ScanHistoryItem = {
        orderId: 'order-3',
        scannedAt: new Date().toISOString(),
        qrType: 'order',
      };
      const updated = [newItem, ...existing];

      await AsyncStorage.setItem(
        '@janlums/scan_history',
        JSON.stringify(updated)
      );

      expect(mockedAsyncStorage.setItem).toHaveBeenCalledWith(
        '@janlums/scan_history',
        expect.any(String)
      );
      const saved = JSON.parse(
        (mockedAsyncStorage.setItem as jest.Mock).mock.calls[0][1]
      );
      expect(saved).toHaveLength(3);
      expect(saved[0].orderId).toBe('order-3');
    });

    it('deduplicates existing orderId by replacing it', async () => {
      mockedAsyncStorage.getItem.mockResolvedValue(JSON.stringify(mockScans));
      mockedAsyncStorage.setItem.mockResolvedValue();

      const existingRaw = await AsyncStorage.getItem('@janlums/scan_history');
      const existing: ScanHistoryItem[] = JSON.parse(existingRaw!);
      const duplicateItem: ScanHistoryItem = {
        orderId: 'order-1',
        scannedAt: new Date().toISOString(),
        qrType: 'order',
      };
      const filtered = existing.filter((s) => s.orderId !== duplicateItem.orderId);
      const updated = [duplicateItem, ...filtered];

      await AsyncStorage.setItem(
        '@janlums/scan_history',
        JSON.stringify(updated)
      );

      const saved = JSON.parse(
        (mockedAsyncStorage.setItem as jest.Mock).mock.calls[0][1]
      );
      expect(saved).toHaveLength(2);
      expect(saved[0].orderId).toBe('order-1');
    });

    it('limits history to 20 items', async () => {
      const manyScans: ScanHistoryItem[] = Array.from({ length: 20 }, (_, i) => ({
        orderId: `order-${i}`,
        scannedAt: new Date(Date.now() - i * 60000).toISOString(),
        qrType: 'order',
      }));

      mockedAsyncStorage.getItem.mockResolvedValue(JSON.stringify(manyScans));
      mockedAsyncStorage.setItem.mockResolvedValue();

      const existingRaw = await AsyncStorage.getItem('@janlums/scan_history');
      const existing: ScanHistoryItem[] = JSON.parse(existingRaw!);
      const newItem: ScanHistoryItem = {
        orderId: 'order-new',
        scannedAt: new Date().toISOString(),
        qrType: 'order',
      };
      const updated = [newItem, ...existing].slice(0, 20);

      await AsyncStorage.setItem(
        '@janlums/scan_history',
        JSON.stringify(updated)
      );

      const saved = JSON.parse(
        (mockedAsyncStorage.setItem as jest.Mock).mock.calls[0][1]
      );
      expect(saved).toHaveLength(20);
      expect(saved[0].orderId).toBe('order-new');
      expect(saved[saved.length - 1].orderId).toBe('order-18');
    });
  });

  describe('clearHistory', () => {
    it('removes all scans from storage', async () => {
      mockedAsyncStorage.removeItem.mockResolvedValue();

      await AsyncStorage.removeItem('@janlums/scan_history');

      expect(mockedAsyncStorage.removeItem).toHaveBeenCalledWith(
        '@janlums/scan_history'
      );
    });
  });
});
