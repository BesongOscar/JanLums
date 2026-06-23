import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ScanHistoryItem {
  orderId: string;
  scannedAt: string;
  qrType: string;
}

const STORAGE_KEY = '@janlums/scan_history';
const MAX_ITEMS = 20;

export function useScanHistory() {
  const [scans, setScans] = useState<ScanHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadScans();
  }, []);

  async function loadScans() {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: ScanHistoryItem[] = JSON.parse(raw);
        setScans(parsed);
      }
    } catch {
    } finally {
      setIsLoading(false);
    }
  }

  const addScan = useCallback(
    async (item: Omit<ScanHistoryItem, 'scannedAt'>) => {
      const newItem: ScanHistoryItem = {
        ...item,
        scannedAt: new Date().toISOString(),
      };

      setScans((prev) => {
        const filtered = prev.filter((s) => s.orderId !== item.orderId);
        const updated = [newItem, ...filtered].slice(0, MAX_ITEMS);
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    },
    []
  );

  const clearHistory = useCallback(async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setScans([]);
  }, []);

  return {
    scans,
    isLoading,
    addScan,
    clearHistory,
  };
}
