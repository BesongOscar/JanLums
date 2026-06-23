import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, HelperText } from 'react-native-paper';
import { Link } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterFormData } from '../../src/features/auth/validation';
import { useRegister } from '../../src/features/auth/hooks/useRegister';
import { normalizeError } from '../../src/utils/errorHandler';
import { useOfflineBlock } from '../../src/hooks/useOfflineBlock';
import { CONFIG } from '../../src/config/environment';
import { colors } from '../../src/config/colors';

export default function RegisterScreen() {
  const registerMutation = useRegister();
  const { blockIfOffline } = useOfflineBlock();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormData) => {
    if (blockIfOffline('create an account')) return;
    registerMutation.mutate({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      password: data.password,
      tenantId: CONFIG.tenantId,
    });
  };

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
          <Text variant="displayMedium" style={styles.title} accessibilityRole="header">
            Create Account
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Join JanLums
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
