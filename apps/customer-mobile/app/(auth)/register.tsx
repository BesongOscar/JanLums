import { useCallback } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, HelperText } from 'react-native-paper';
import { Link, useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterFormData } from '../../src/features/auth/validation';
import { useRegister } from '../../src/features/auth/hooks/useRegister';
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

export default function RegisterScreen() {
  const router = useRouter();
  const registerMutation = useRegister();
  const { tenant } = useAuthStore();
  const { blockIfOffline } = useOfflineBlock();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = useCallback(
    (data: RegisterFormData) => {
      if (blockIfOffline('create an account')) return;
      if (!tenant?.slug) {
        goToBusinessCode(router);
        return;
      }
      registerMutation.mutate({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        password: data.password,
        tenantSlug: tenant.slug,
      });
    },
    [registerMutation, blockIfOffline, tenant, router]
  );

  const errorMessage = registerMutation.error
    ? normalizeError(registerMutation.error).message
    : null;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} accessibilityLabel="Registration form">
        <View style={styles.header}>
          <MaterialCommunityIcons name="account-plus" size={56} color={colors.primary[500]} />
          <Text style={styles.title} accessibilityRole="header">
            Create Account
          </Text>
          <Text style={styles.subtitle}>
            Join {tenant?.name || 'JanLums'}
          </Text>
        </View>

        <View style={styles.form}>
          {errorMessage && (
            <HelperText type="error" visible style={styles.error} accessibilityRole="alert">
              {errorMessage}
            </HelperText>
          )}

          <View style={styles.row}>
            <Controller
              control={control}
              name="firstName"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label="First Name"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={!!errors.firstName}
                  mode="outlined"
                  style={[styles.input, styles.halfInput]}
                  accessibilityLabel="First name"
                />
              )}
            />
            <Controller
              control={control}
              name="lastName"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label="Last Name"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={!!errors.lastName}
                  mode="outlined"
                  style={[styles.input, styles.halfInput]}
                  accessibilityLabel="Last name"
                />
              )}
            />
          </View>
          {(errors.firstName || errors.lastName) && (
            <HelperText type="error" visible accessibilityRole="alert">
              {errors.firstName?.message || errors.lastName?.message}
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
            name="phone"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Phone Number"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={!!errors.phone}
                keyboardType="phone-pad"
                mode="outlined"
                style={styles.input}
                accessibilityLabel="Phone number"
              />
            )}
          />
          {errors.phone && (
            <HelperText type="error" visible accessibilityRole="alert">
              {errors.phone.message}
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

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Confirm Password"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={!!errors.confirmPassword}
                secureTextEntry
                mode="outlined"
                style={styles.input}
                accessibilityLabel="Confirm password"
              />
            )}
          />
          {errors.confirmPassword && (
            <HelperText type="error" visible accessibilityRole="alert">
              {errors.confirmPassword.message}
            </HelperText>
          )}

          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            loading={registerMutation.isPending}
            disabled={registerMutation.isPending}
            style={styles.button}
            contentStyle={styles.buttonContent}
            accessibilityLabel="Create account"
            accessibilityState={{ disabled: registerMutation.isPending }}
          >
            Create Account
          </Button>

          <Link href="/(auth)/login" asChild>
            <Button mode="text" style={styles.linkButton} accessibilityLabel="Go to login">
              Already have an account? Log In
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
    padding: spacing[6],
    paddingTop: spacing[12],
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing[6],
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
  row: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  input: {
    backgroundColor: colors.surface,
  },
  halfInput: {
    flex: 1,
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
});
