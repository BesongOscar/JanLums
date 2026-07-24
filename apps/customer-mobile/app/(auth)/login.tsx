import { useCallback } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, HelperText } from 'react-native-paper';
import { Link, useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormData } from '../../src/features/auth/validation';
import { useLogin } from '../../src/features/auth/hooks/useLogin';
import { useAuthStore } from '../../src/stores/authStore';
import { normalizeError } from '../../src/utils/errorHandler';
import { useOfflineBlock } from '../../src/hooks/useOfflineBlock';
import { colors } from '../../src/config/colors';
import { spacing, borderRadius } from '../../src/config/spacing';
import { typography } from '../../src/config/typography';
import { MaterialCommunityIcons } from '@expo/vector-icons';

function goToBusinessCode(router: ReturnType<typeof useRouter>) {
  router.replace('/(auth)/business-code' as any);
}

export default function LoginScreen() {
  const router = useRouter();
  const loginMutation = useLogin();
  const { tenant, clearTenant } = useAuthStore();
  const { blockIfOffline } = useOfflineBlock();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = useCallback(
    (data: LoginFormData) => {
      if (blockIfOffline('log in')) return;
      if (!tenant?.slug) {
        goToBusinessCode(router);
        return;
      }
      loginMutation.mutate({ ...data, tenantSlug: tenant.slug, platform: 'customer-mobile' });
    },
    [loginMutation, blockIfOffline, tenant, router]
  );

  const handleChangeBusiness = useCallback(async () => {
    await clearTenant();
    goToBusinessCode(router);
  }, [clearTenant, router]);

  const errorMessage = loginMutation.error
    ? normalizeError(loginMutation.error).message
    : null;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        accessibilityLabel="Login form"
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <MaterialCommunityIcons name="tshirt-crew" size={56} color={colors.primary[500]} />
          <Text style={styles.title} accessibilityRole="header">
            {tenant?.name || 'JanLums'}
          </Text>
          <Text style={styles.subtitle}>
            Professional Laundry Services
          </Text>
          <Button
            mode="text"
            onPress={handleChangeBusiness}
            compact
            style={styles.changeBusiness}
            textColor={colors.text.secondary}
            accessibilityLabel="Change business"
          >
            Change Business
          </Button>
        </View>

        <View style={styles.form}>
          {errorMessage && (
            <HelperText type="error" visible style={styles.error} accessibilityRole="alert">
              {errorMessage}
            </HelperText>
          )}

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Email"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={!!errors.email}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                mode="outlined"
                style={styles.input}
                accessibilityLabel="Email address"
              />
            )}
          />
          {errors.email && (
            <HelperText type="error" visible accessibilityRole="alert">
              {errors.email.message}
            </HelperText>
          )}

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Password"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={!!errors.password}
                secureTextEntry
                mode="outlined"
                style={styles.input}
                accessibilityLabel="Password"
              />
            )}
          />
          {errors.password && (
            <HelperText type="error" visible accessibilityRole="alert">
              {errors.password.message}
            </HelperText>
          )}

          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            loading={loginMutation.isPending}
            disabled={loginMutation.isPending}
            style={styles.button}
            contentStyle={styles.buttonContent}
            accessibilityLabel="Log in to your account"
            accessibilityState={{ disabled: loginMutation.isPending }}
          >
            Log In
          </Button>

          <Link href="/(auth)/register" asChild>
            <Button mode="text" style={styles.linkButton} accessibilityLabel="Create a new account">
              Don&apos;t have an account? Sign Up
            </Button>
          </Link>
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
    marginTop: spacing[3],
    marginBottom: spacing[1],
  },
  subtitle: {
    ...typography['body-lg'],
    color: colors.text.secondary,
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
  linkButton: {
    marginTop: spacing[2],
  },
  error: {
    backgroundColor: colors.error.light,
    borderRadius: borderRadius.md,
    marginBottom: spacing[2],
  },
  changeBusiness: {
    marginTop: spacing[1],
  },
});
