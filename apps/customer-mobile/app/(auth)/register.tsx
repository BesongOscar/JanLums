import { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, HelperText } from 'react-native-paper';
import { Link } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterFormData } from '../../src/utils/validation';
import { useAuthStore } from '../../src/stores/authStore';
import { API_ENDPOINTS } from '../../src/api/endpoints';
import { CONFIG } from '../../src/config/environment';
import { colors } from '../../src/config/colors';
import api from '../../src/api/client';
import { normalizeError } from '../../src/utils/errorHandler';

export default function RegisterScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setAuth = useAuthStore((state) => state.setAuth);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        tenantId: CONFIG.tenantId,
        role: 'customer',
      });
      const { accessToken, user } = response.data;
      await setAuth(accessToken, null, user);
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
            Create Account
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Join JanLums
          </Text>
        </View>

        <View style={styles.form}>
          {error && (
            <HelperText type="error" visible style={styles.error}>
              {error}
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
                  style={[styles.input, styles.halfInput]}
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
                  style={[styles.input, styles.halfInput]}
                />
              )}
            />
          </View>
          {(errors.firstName || errors.lastName) && (
            <HelperText type="error" visible>
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
            name="phone"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Phone Number"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={!!errors.phone}
                keyboardType="phone-pad"
                style={styles.input}
              />
            )}
          />
          {errors.phone && (
            <HelperText type="error" visible>
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
                style={styles.input}
              />
            )}
          />
          {errors.password && (
            <HelperText type="error" visible>
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
                style={styles.input}
              />
            )}
          />
          {errors.confirmPassword && (
            <HelperText type="error" visible>
              {errors.confirmPassword.message}
            </HelperText>
          )}

          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            loading={isLoading}
            disabled={isLoading}
            style={styles.button}
          >
            Create Account
          </Button>

          <Link href="/(auth)/login" asChild>
            <Button mode="text" style={styles.linkButton}>
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
    padding: 24,
    paddingTop: 60,
  },
  header: {
    marginBottom: 32,
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
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  input: {
    backgroundColor: colors.surface,
  },
  halfInput: {
    flex: 1,
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
