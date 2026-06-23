import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, HelperText } from 'react-native-paper';
import { Link } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormData } from '../../src/features/auth/validation';
import { useLogin } from '../../src/features/auth/hooks/useLogin';
import { normalizeError } from '../../src/utils/errorHandler';
import { useOfflineBlock } from '../../src/hooks/useOfflineBlock';
import { colors } from '../../src/config/colors';

export default function LoginScreen() {
  const loginMutation = useLogin();
  const { blockIfOffline } = useOfflineBlock();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    if (blockIfOffline('log in')) return;
    loginMutation.mutate(data);
  };

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
          <Text variant="displayMedium" style={styles.title} accessibilityRole="header">
            JanLums
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Professional Laundry Services
          </Text>
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
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    color: colors.primary[500],
    marginBottom: 8,
  },
  subtitle: {
    color: colors.text.secondary,
  },
  form: {
    gap: 8,
  },
  input: {
    backgroundColor: colors.surface,
  },
  button: {
    marginTop: 16,
    paddingVertical: 8,
  },
  linkButton: {
    marginTop: 8,
  },
  error: {
    backgroundColor: colors.error.light,
    borderRadius: 8,
    marginBottom: 8,
  },
});
