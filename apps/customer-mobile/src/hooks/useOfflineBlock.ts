import { useCallback } from 'react';
import { Alert } from 'react-native';
import { useUIStore } from '../stores/uiStore';

export function useOfflineBlock() {
  const isOnline = useUIStore((state) => state.isOnline);

  const blockIfOffline = useCallback(
    (action: string = 'perform this action'): boolean => {
      if (!isOnline) {
        Alert.alert(
          'No Internet Connection',
          `You need an internet connection to ${action}. Please check your connection and try again.`
        );
        return true;
      }
      return false;
    },
    [isOnline]
  );

  return { isOnline, blockIfOffline };
}
