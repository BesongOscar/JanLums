import { useState } from 'react';
import { useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Button, TextInput, ActivityIndicator, Snackbar } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AxiosError } from 'axios';
import { useCustomerProfile } from '../../../src/hooks/useCustomerProfile';
import { useUpdateProfile } from '../../../src/hooks/useUpdateProfile';
import { useAnalytics } from '../../../src/hooks/useAnalytics';
import { useOfflineBlock } from '../../../src/hooks/useOfflineBlock';
import { profileUpdateSchema } from '../../../src/utils/validation';
import type { ProfileUpdateFormData } from '../../../src/utils/validation';
import { colors } from '../../../src/config/colors';
import { spacing } from '../../../src/config/spacing';
import { typography } from '../../../src/config/typography';

export default function EditProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const analytics = useAnalytics();
  const { blockIfOffline } = useOfflineBlock();

  useEffect(() => {
    analytics.track({ name: 'profile_viewed' });
  }, [analytics]);

  const {
    data: profile,
    isLoading: isProfileLoading,
    isError: isProfileError,
    error: profileError,
    refetch: refetchProfile,
  } = useCustomerProfile();
  const updateProfileMutation = useUpdateProfile();
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarError, setSnackbarError] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ProfileUpdateFormData>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      firstName: profile?.firstName || '',
      lastName: profile?.lastName || '',
      phone: profile?.phone || '',
      address: profile?.address || '',
      city: profile?.city || '',
    },
    values: {
      firstName: profile?.firstName || '',
      lastName: profile?.lastName || '',
      phone: profile?.phone || '',
      address: profile?.address || '',
      city: profile?.city || '',
    },
  });

  const onSubmit = async (data: ProfileUpdateFormData) => {
    if (blockIfOffline('update your profile')) return;
    try {
      await updateProfileMutation.mutateAsync(data);
      analytics.track({ name: 'profile_updated' });
      setSnackbarMessage('Profile updated successfully');
      setSnackbarError(false);
      setSnackbarVisible(true);
      setTimeout(() => router.back(), 1500);
    } catch (error) {
      analytics.track({ name: 'profile_update_failed', properties: { error: (error as Error).message } });
      const axiosError = error as AxiosError<{ message?: string }>;
      const message =
        axiosError?.response?.data?.message || axiosError?.message || 'Failed to update profile';
      setSnackbarMessage(message);
      setSnackbarError(true);
      setSnackbarVisible(true);
    }
  };

  if (isProfileLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
      </View>
    );
  }

  if (isProfileError) {
    return (
      <View style={styles.center}>
        <MaterialCommunityIcons name="alert-circle-outline" size={48} color={colors.error.DEFAULT} />
        <Text style={styles.errorTitle}>Failed to load profile</Text>
        <Text style={styles.errorDescription}>
          {(profileError as any)?.response?.data?.message || (profileError as any)?.message || 'Unable to load your profile information'}
        </Text>
        <Button
          mode="contained"
          onPress={() => refetchProfile()}
          style={styles.retryButton}
        >
          Retry
        </Button>
        <Button
          mode="text"
          onPress={() => router.back()}
          style={styles.goBackButton}
        >
          Go Back
        </Button>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: spacing[4], paddingTop: insets.top + spacing[4] }} keyboardShouldPersistTaps="handled">
      <View style={styles.headerSection}>
        <MaterialCommunityIcons name="account-circle" size={64} color={colors.primary[500]} />
        <Text style={styles.headerTitle}>Edit Your Profile</Text>
      </View>

      <View style={styles.form}>
        <Controller
          control={control}
          name="firstName"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="First Name"
              mode="outlined"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              error={!!errors.firstName}
              style={styles.input}
              outlineColor={colors.border}
              activeOutlineColor={colors.primary[500]}
            />
          )}
        />
        {errors.firstName && (
          <Text style={styles.errorText}>{errors.firstName.message}</Text>
        )}

        <Controller
          control={control}
          name="lastName"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Last Name"
              mode="outlined"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              error={!!errors.lastName}
              style={styles.input}
              outlineColor={colors.border}
              activeOutlineColor={colors.primary[500]}
            />
          )}
        />
        {errors.lastName && (
          <Text style={styles.errorText}>{errors.lastName.message}</Text>
        )}

        <Controller
          control={control}
          name="phone"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Phone"
              mode="outlined"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              error={!!errors.phone}
              style={styles.input}
              keyboardType="phone-pad"
              outlineColor={colors.border}
              activeOutlineColor={colors.primary[500]}
            />
          )}
        />
        {errors.phone && (
          <Text style={styles.errorText}>{errors.phone.message}</Text>
        )}

        <Controller
          control={control}
          name="address"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Address"
              mode="outlined"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              error={!!errors.address}
              style={styles.input}
              outlineColor={colors.border}
              activeOutlineColor={colors.primary[500]}
            />
          )}
        />
        {errors.address && (
          <Text style={styles.errorText}>{errors.address.message}</Text>
        )}

        <Controller
          control={control}
          name="city"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="City"
              mode="outlined"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              error={!!errors.city}
              style={styles.input}
              outlineColor={colors.border}
              activeOutlineColor={colors.primary[500]}
            />
          )}
        />
        {errors.city && (
          <Text style={styles.errorText}>{errors.city.message}</Text>
        )}

        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          style={styles.submitButton}
          loading={updateProfileMutation.isPending}
          disabled={updateProfileMutation.isPending || !isDirty}
        >
          {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
        </Button>

        <Button
          mode="text"
          onPress={() => router.back()}
          style={styles.cancelButton}
          disabled={updateProfileMutation.isPending}
        >
          Cancel
        </Button>
      </View>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={{
          backgroundColor: snackbarError ? colors.error.DEFAULT : colors.success.DEFAULT,
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: spacing[4],
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: spacing[6],
  },
  headerTitle: {
    ...typography['heading-lg'],
    color: colors.text.primary,
    marginTop: spacing[3],
  },
  form: {
    gap: spacing[1],
  },
  input: {
    backgroundColor: colors.surface,
    marginBottom: spacing[1],
  },
  errorText: {
    ...typography['body-sm'],
    color: colors.error.DEFAULT,
    marginBottom: spacing[2],
    marginLeft: spacing[1],
  },
  errorTitle: {
    ...typography['heading-sm'],
    color: colors.text.primary,
    marginTop: spacing[3],
    marginBottom: spacing[1],
  },
  errorDescription: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing[4],
  },
  retryButton: {
    backgroundColor: colors.primary[500],
    marginBottom: spacing[2],
  },
  goBackButton: {
    marginTop: spacing[1],
  },
  submitButton: {
    marginTop: spacing[4],
    backgroundColor: colors.primary[500],
    paddingVertical: spacing[1],
  },
  cancelButton: {
    marginTop: spacing[2],
  },
});
