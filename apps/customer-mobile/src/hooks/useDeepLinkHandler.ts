import { useEffect, useRef, useCallback } from 'react';
import { Linking, AppState, AppStateStatus } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../stores/authStore';
import { useAnalytics } from './useAnalytics';
import { parseDeepLink, getNavigationPath } from '../services/deepLink.service';
import type { DeepLinkTarget } from '../services/deepLink.service';

function useInitialize() {
  const initialized = useRef(false);
  return useCallback(() => {
    if (initialized.current) return false;
    initialized.current = true;
    return true;
  }, []);
}

async function getInitialUrl(): Promise<string | null> {
  try {
    const url = await Linking.getInitialURL();
    return url;
  } catch {
    return null;
  }
}

export function useDeepLinkHandler() {
  const router = useRouter();
  const analytics = useAnalytics();
  const isInitialized = useInitialize();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const pendingLink = useRef<string | null>(null);

  const navigateToTarget = useCallback(
    (target: DeepLinkTarget) => {
      const path = getNavigationPath(target);
      analytics.track({
        name: 'deep_link_opened',
        properties: { route: target.route, path },
      });
      router.replace(path as any);
    },
    [router, analytics]
  );

  const handleUrl = useCallback(
    (url: string) => {
      if (!isAuthenticated) {
        pendingLink.current = url;
        return;
      }

      const target = parseDeepLink(url);
      if (target.route !== 'unknown') {
        navigateToTarget(target);
      }
    },
    [isAuthenticated, navigateToTarget]
  );

  useEffect(() => {
    if (!isInitialized()) return;

    const subscription = Linking.addEventListener('url', (event) => {
      handleUrl(event.url);
    });

    getInitialUrl().then((url) => {
      if (url) {
        handleUrl(url);
      }
    });

    return () => {
      subscription.remove();
    };
  }, [isInitialized, handleUrl]);

  useEffect(() => {
    if (isAuthenticated && pendingLink.current) {
      const url = pendingLink.current;
      pendingLink.current = null;

      const target = parseDeepLink(url);
      if (target.route !== 'unknown') {
        navigateToTarget(target);
      }
    }
  }, [isAuthenticated, navigateToTarget]);

  return null;
}
