import { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, HelperText } from 'react-native-paper';
import { Link } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormData } from '../../src/utils/validation';
import { useAuthStore } from '../../src/stores/authStore';
import { API_ENDPOINTS } from '../../src/api/endpoints';
import { colors } from '../../src/config/colors';
import api from '../../src/api/client';
import { normalizeError } from '../../src/utils/errorHandler';

export default function LoginScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setAuth = useAuthStore((state) => state.setAuth);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, data);
      const { accessToken, refreshToken, user } = response.data;
      await setAuth(accessToken, refreshToken, user);
    } catch (err: unknown) {
      setError(normalizeError(err).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text variant="displayMedium" style={styles.title}>
            JanLums
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Professional Laundry Services
          </Text>
        </View>

        <View style={styles.form}>
          {error && (
            <HelperText type="error" visible style={styles.error}>
              {error}
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
              />
            )}
          />
          {errors.email && (
            <HelperText type="error" visible>
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
              />
            )}
          />
          {errors.password && (
            <HelperText type="error" visible>
              {errors.password.message}
            </HelperText>
          )}

          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            loading={isLoading}
            disabled={isLoading}
            style={styles.button}
          >
            Log In
          </Button>

          <Link href="/(auth)/register" asChild>
            <Button mode="text" style={styles.linkButton}>
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
