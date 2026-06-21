import { useEffect } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider, DefaultTheme } from 'react-native-paper';
import { QueryProvider } from '../src/providers/QueryProvider';
import { useAuthStore } from '../src/stores/authStore';
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

function RootLayoutNav() {
  const { isAuthenticated, isLoading } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isLoading, segments]);

  return <Slot />;
}

export default function RootLayout() {
  const loadStoredAuth = useAuthStore((state) => state.loadStoredAuth);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  return (
    <QueryProvider>
      <PaperProvider theme={theme}>
        <RootLayoutNav />
        <StatusBar style="auto" />
      </PaperProvider>
    </QueryProvider>
  );
}
