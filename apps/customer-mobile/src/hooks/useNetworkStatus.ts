import { useEffect, useState, useCallback, useRef } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
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
  const subscriptionRef = useRef<(() => void) | null>(null);

  const handleChange = useCallback(
    (state: NetInfoState) => {
      const isConnected = state.isConnected ?? false;
      const isInternetReachable = state.isInternetReachable ?? false;
      setOnline(isConnected);
      setStatus({ isConnected, isInternetReachable, isOffline: !isConnected });
    },
    [setOnline]
  );

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(handleChange);
    subscriptionRef.current = unsubscribe;
    return () => {
      unsubscribe();
    };
  }, [handleChange]);

  return status;
}
