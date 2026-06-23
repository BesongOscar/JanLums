import { useEffect } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { PaperProvider, DefaultTheme } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryProvider } from '../src/providers/QueryProvider';
import { ErrorBoundary } from '../src/components/ErrorBoundary';
import { OfflineBanner } from '../src/components/common/OfflineBanner';
import { useAuthStore } from '../src/stores/authStore';
import { initializeSentry } from '../src/lib/sentry';
import { colors } from '../src/config/colors';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary[500],
    accent: colors.secondary[500],
    background: colors.background,
    surface: colors.surface,
    text: colors.text.primary,
    error: colors.error.DEFAULT,
  },
};

const ONBOARDING_KEY = '@janlums/onboarding_complete';

function RootLayoutNav() {
  const { isAuthenticated, isLoading } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    async function route() {
      const onboardingValue = await AsyncStorage.getItem(ONBOARDING_KEY);
      const isOnboardingComplete = onboardingValue === 'true';

      const inAuthGroup = segments[0] === '(auth)';
      const inOnboarding = segments[1] === 'onboarding';

      if (!isAuthenticated) {
        if (!isOnboardingComplete && !inOnboarding) {
          router.replace('/(auth)/onboarding');
        } else if (isOnboardingComplete && !inAuthGroup) {
          router.replace('/(auth)/login');
        }
      } else if (isAuthenticated && inAuthGroup) {
        router.replace('/(tabs)');
      }
    }

    route();
  }, [isAuthenticated, isLoading, segments, router]);

  return (
    <View style={styles.container}>
      <Slot />
      <OfflineBanner />
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.primary[500]} />
        </View>
      )}
    </View>
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
          <PaperProvider theme={theme}>
            <RootLayoutNav />
            <StatusBar style="auto" />
          </PaperProvider>
        </QueryProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
