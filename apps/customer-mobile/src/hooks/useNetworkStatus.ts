/**
 * useNetworkStatus
 * 
 * Replaces @react-native-community/netinfo with expo-network,
 * which works in Expo managed workflow without native linking.
 * Syncs online/offline state into the global UIStore.
 */
import { useEffect, useState } from 'react';
import * as Network from 'expo-network';
import { useUIStore } from '../stores/uiStore';

interface NetworkStatus {
  isConnected: boolean;
  isInternetReachable: boolean;
  isOffline: boolean;
}

export function useNetworkStatus(): NetworkStatus {
  const [status, setStatus] = useState<NetworkStatus>({
    isConnected: true,
    isInternetReachable: true,
    isOffline: false,
  });
  const setOnline = useUIStore((state) => state.setOnline);

  useEffect(() => {
    async function check() {
      const state = await Network.getNetworkStateAsync();
      const isConnected = state.isConnected ?? false;
      const isInternetReachable = state.isInternetReachable ?? false;
      setOnline(isConnected);
      setStatus({ isConnected, isInternetReachable, isOffline: !isConnected });
    }

    check();
    // Poll every 5s — expo-network has no event listener API
    const interval = setInterval(check, 5000);
    return () => clearInterval(interval);
  }, [setOnline]);

  return status;
}