import { useEffect, useMemo, useRef, useState } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { PaperProvider, DefaultTheme } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useQueryClient } from '@tanstack/react-query';
import { QueryProvider } from '../src/providers/QueryProvider';
import { ErrorBoundary } from '../src/components/ErrorBoundary';
import { OfflineBanner } from '../src/components/common/OfflineBanner';
import { useAuthStore, restoreTenant } from '../src/stores/authStore';
import { useOrderDraftStore } from '../src/stores/orderDraftStore';
import { useNotificationStore } from '../src/stores/notificationStore';
import { useSyncQueueStore } from '../src/stores/syncQueueStore';
import { useSyncQueueProcessor } from '../src/hooks/useSyncQueue';
import { useDeepLinkHandler } from '../src/hooks/useDeepLinkHandler';
import { initializeSentry } from '../src/lib/sentry';
import { colors } from '../src/config/colors';
import { TenantInfo } from '../src/types';

const ONBOARDING_KEY = '@janlums/onboarding_complete';

function buildTheme(tenantPrimaryColor?: string) {
  const activePrimary = tenantPrimaryColor || colors.primary[500];
  return {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: activePrimary,
      accent: colors.secondary[500],
      background: colors.background,
      surface: colors.surface,
      text: colors.text.primary,
      error: colors.error.DEFAULT,
    },
  };
}

function AppContent() {
  useDeepLinkHandler();
  useSyncQueueProcessor();

  const { isAuthenticated, isLoading, tenant } = useAuthStore();
  const [storedTenant, setStoredTenant] = useState<TenantInfo | null>(null);
  const [tenantLoaded, setTenantLoaded] = useState(false);
  const segments = useSegments();
  const router = useRouter();
  const queryClient = useQueryClient();
  const prevIsAuthenticated = useRef(isAuthenticated);

  useEffect(() => {
    if (prevIsAuthenticated.current === true && isAuthenticated === false) {
      queryClient.clear();
      AsyncStorage.multiRemove(['order-draft-storage', 'notification-storage', 'sync-queue-storage']);
      useOrderDraftStore.getState().reset();
      useNotificationStore.getState().clearAll();
      useSyncQueueStore.getState().clearAll();
    }
    prevIsAuthenticated.current = isAuthenticated;
  }, [isAuthenticated, queryClient]);

  useEffect(() => {
    async function loadTenant() {
      const t = await restoreTenant();
      setStoredTenant(t);
      setTenantLoaded(true);
    }
    loadTenant();
  }, []);

  const activeTenant = tenant || storedTenant;

  const theme = useMemo(() => buildTheme(activeTenant?.primaryColor), [activeTenant?.primaryColor]);

  useEffect(() => {
    if (isLoading || !tenantLoaded) return;

    async function route() {
      const onboardingValue = await AsyncStorage.getItem(ONBOARDING_KEY);
      const isOnboardingComplete = onboardingValue === 'true';

      const inAuthGroup = segments[0] === '(auth)' as any;
      const inOnboarding = segments[1] === 'onboarding' as any;
      const inBusinessCode = segments[1] === 'business-code' as any;

      if (!isAuthenticated) {
        if (!isOnboardingComplete && !inOnboarding) {
          router.replace('/(auth)/onboarding');
        } else if (isOnboardingComplete) {
          if (!activeTenant && !inBusinessCode) {
            router.replace('/(auth)/business-code' as any);
          } else if (activeTenant && !inAuthGroup) {
            router.replace('/(auth)/login');
          }
        }
      } else if (isAuthenticated && inAuthGroup) {
        router.replace('/(tabs)');
      }
    }

    route();
  }, [isAuthenticated, isLoading, tenantLoaded, segments, router, activeTenant]);

  return (
    <PaperProvider theme={theme}>
      <View style={styles.container}>
        <Slot />
        <OfflineBanner />
        {(isLoading || !tenantLoaded) && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={activeTenant?.primaryColor || colors.primary[500]} />
          </View>
        )}
        <StatusBar style="auto" />
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});

export default function RootLayout() {
  const restoreSession = useAuthStore((state) => state.restoreSession);

  useEffect(() => {
    initializeSentry();
    restoreSession();
  }, [restoreSession]);

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <QueryProvider>
          <AppContent />
        </QueryProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
