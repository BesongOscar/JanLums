import { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, HelperText } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useValidateTenant } from '../../src/features/auth/hooks/useValidateTenant';
import { useAuthStore } from '../../src/stores/authStore';
import { normalizeError } from '../../src/utils/errorHandler';
import { useOfflineBlock } from '../../src/hooks/useOfflineBlock';
import { colors } from '../../src/config/colors';
import { spacing, borderRadius } from '../../src/config/spacing';
import { typography } from '../../src/config/typography';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function BusinessCodeScreen() {
  const router = useRouter();
  const validateMutation = useValidateTenant();
  const setTenant = useAuthStore((state) => state.setTenant);
  const { blockIfOffline } = useOfflineBlock();
  const [slug, setSlug] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    const trimmed = slug.trim().toLowerCase();
    if (!trimmed) {
      setError('Please enter a business code');
      return;
    }

    if (blockIfOffline('find your business')) return;

    setError(null);

    try {
      const tenant = await validateMutation.mutateAsync(trimmed);
      await setTenant(tenant);
      router.replace('/(auth)/login');
    } catch (err) {
      const normalized = normalizeError(err);
      if (normalized.statusCode === 404) {
        setError('Business not found. Please check the code and try again.');
      } else {
        setError(normalized.message);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        accessibilityLabel="Business code form"
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <MaterialCommunityIcons name="store-search" size={56} color={colors.primary[500]} />
          <Text style={styles.title} accessibilityRole="header">
            Welcome
          </Text>
          <Text style={styles.subtitle}>
            Enter your business code to get started
          </Text>
        </View>

        <View style={styles.form}>
          {error && (
            <HelperText type="error" visible style={styles.error} accessibilityRole="alert">
              {error}
            </HelperText>
          )}

          <TextInput
            label="Business Code"
            value={slug}
            onChangeText={(text) => {
              setSlug(text);
              setError(null);
            }}
            error={!!error}
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.input}
            mode="outlined"
            accessibilityLabel="Business code"
            disabled={validateMutation.isPending}
          />

          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={validateMutation.isPending}
            disabled={validateMutation.isPending || !slug.trim()}
            style={styles.button}
            contentStyle={styles.buttonContent}
            accessibilityLabel="Continue with this business code"
            accessibilityState={{ disabled: validateMutation.isPending || !slug.trim() }}
          >
            Continue
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing[6],
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing[10],
  },
  title: {
    ...typography['display'],
    color: colors.primary[500],
    marginTop: spacing[4],
    marginBottom: spacing[2],
  },
  subtitle: {
    ...typography['body-lg'],
    color: colors.text.secondary,
    textAlign: 'center',
  },
  form: {
    gap: spacing[2],
  },
  input: {
    backgroundColor: colors.surface,
  },
  button: {
    marginTop: spacing[4],
    borderRadius: borderRadius.lg,
  },
  buttonContent: {
    paddingVertical: spacing[2],
  },
  error: {
    backgroundColor: colors.error.light,
    borderRadius: borderRadius.md,
    marginBottom: spacing[2],
  },
});
