import { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Button, TextInput, Snackbar, SegmentedButtons, Switch } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AxiosError } from 'axios';
import { useAddress, useCreateAddress, useUpdateAddress } from '../../src/hooks/useAddresses';
import { useOfflineBlock } from '../../src/hooks/useOfflineBlock';
import { useOrderDraftStore } from '../../src/stores/orderDraftStore';
import { addressSchema } from '../../src/utils/validation';
import type { AddressFormData } from '../../src/utils/validation';
import { colors } from '../../src/config/colors';
import { spacing } from '../../src/config/spacing';
import { typography } from '../../src/config/typography';
import { ScreenHeader } from '../../src/components/common/ScreenHeader';
import { SkeletonList } from '../../src/components/common/SkeletonLoader';

const LABEL_OPTIONS = [
  { value: 'home', label: 'Home', icon: 'home' },
  { value: 'work', label: 'Work', icon: 'briefcase' },
  { value: 'other', label: 'Other', icon: 'map-marker' },
];

export default function AddressFormScreen() {
  const router = useRouter();
  const { id, from } = useLocalSearchParams<{ id?: string; from?: string }>();
  const isEditing = !!id;
  const { blockIfOffline } = useOfflineBlock();

  const setAddress = useOrderDraftStore((s) => s.setAddress);

  const createMutation = useCreateAddress();
  const updateMutation = useUpdateAddress();
  const { data: existingAddress, isLoading: isAddressLoading, isError: isAddressError } = useAddress(id || '');

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarError, setSnackbarError] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    values: isEditing && existingAddress
      ? {
          label: existingAddress.label,
          addressLine1: existingAddress.addressLine1,
          addressLine2: existingAddress.addressLine2 || '',
          city: existingAddress.city,
          state: existingAddress.state || '',
          postalCode: existingAddress.postalCode || '',
          country: existingAddress.country,
          isDefault: existingAddress.isDefault,
        }
      : undefined,
    defaultValues: {
      label: 'home',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'Cameroon',
      isDefault: false,
    },
  });

  const formatAddressSummary = (data: AddressFormData): string =>
    [data.addressLine1, data.city, data.state].filter(Boolean).join(', ');

  const onSubmit = async (data: AddressFormData) => {
    if (blockIfOffline(isEditing ? 'update this address' : 'add a new address')) return;

    try {
      if (isEditing && id) {
        await updateMutation.mutateAsync({ id, data });
        setSnackbarMessage('Address updated successfully');
        setSnackbarError(false);
      } else {
        const newAddress = await createMutation.mutateAsync(data);
        if (from !== 'account') {
          setAddress(newAddress.id, formatAddressSummary(data));
        }
        setSnackbarMessage('Address added successfully');
        setSnackbarError(false);
      }
      setSnackbarVisible(true);
      setTimeout(() => router.back(), 1500);
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      const message =
        axiosError?.response?.data?.message || axiosError?.message || `Failed to ${isEditing ? 'update' : 'save'} address`;
      setSnackbarMessage(message);
      setSnackbarError(true);
      setSnackbarVisible(true);
    }
  };

  if (isEditing && isAddressLoading) {
    return (
      <View style={styles.container}>
        <ScreenHeader title={isEditing ? 'Edit Address' : 'Add New Address'} />
        <SkeletonList count={1} lines={4} />
      </View>
    );
  }

  if (isEditing && isAddressError) {
    return (
      <View style={styles.container}>
        <ScreenHeader title="Edit Address" />
        <View style={styles.center}>
          <MaterialCommunityIcons name="alert-circle-outline" size={48} color={colors.error.DEFAULT} />
          <Text style={styles.errorTitle}>Failed to load address</Text>
          <Button mode="contained" onPress={() => router.back()} style={styles.retryButton}>
            Go Back
          </Button>
        </View>
      </View>
    );
  }

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <ScreenHeader title={isEditing ? 'Edit Address' : 'Add New Address'} />

      <View style={styles.form}>
        <Text style={styles.fieldLabel}>Label</Text>
        <Controller
          control={control}
          name="label"
          render={({ field: { onChange, value } }) => (
            <SegmentedButtons
              value={value}
              onValueChange={onChange}
              buttons={LABEL_OPTIONS}
              style={styles.segmentedButtons}
            />
          )}
        />
        {errors.label && (
          <Text style={styles.errorText}>{errors.label.message}</Text>
        )}

        <Controller
          control={control}
          name="addressLine1"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Address Line 1"
              mode="outlined"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              error={!!errors.addressLine1}
              style={styles.input}
              outlineColor={colors.border}
              activeOutlineColor={colors.primary[500]}
            />
          )}
        />
        {errors.addressLine1 && (
          <Text style={styles.errorText}>{errors.addressLine1.message}</Text>
        )}

        <Controller
          control={control}
          name="addressLine2"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Address Line 2 (Optional)"
              mode="outlined"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              error={!!errors.addressLine2}
              style={styles.input}
              outlineColor={colors.border}
              activeOutlineColor={colors.primary[500]}
            />
          )}
        />
        {errors.addressLine2 && (
          <Text style={styles.errorText}>{errors.addressLine2.message}</Text>
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

        <Controller
          control={control}
          name="state"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="State / Region (Optional)"
              mode="outlined"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              error={!!errors.state}
              style={styles.input}
              outlineColor={colors.border}
              activeOutlineColor={colors.primary[500]}
            />
          )}
        />
        {errors.state && (
          <Text style={styles.errorText}>{errors.state.message}</Text>
        )}

        <Controller
          control={control}
          name="postalCode"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Postal Code (Optional)"
              mode="outlined"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              error={!!errors.postalCode}
              style={styles.input}
              keyboardType="numeric"
              outlineColor={colors.border}
              activeOutlineColor={colors.primary[500]}
            />
          )}
        />
        {errors.postalCode && (
          <Text style={styles.errorText}>{errors.postalCode.message}</Text>
        )}

        <Controller
          control={control}
          name="country"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Country"
              mode="outlined"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              error={!!errors.country}
              style={styles.input}
              outlineColor={colors.border}
              activeOutlineColor={colors.primary[500]}
            />
          )}
        />
        {errors.country && (
          <Text style={styles.errorText}>{errors.country.message}</Text>
        )}

        <View style={styles.switchRow}>
          <View style={styles.switchLabel}>
            <MaterialCommunityIcons name="star" size={20} color={colors.text.secondary} />
            <Text style={styles.switchText}>Set as default address</Text>
          </View>
          <Controller
            control={control}
            name="isDefault"
            render={({ field: { onChange, value } }) => (
              <Switch
                value={value}
                onValueChange={onChange}
                color={colors.primary[500]}
              />
            )}
          />
        </View>

        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          style={styles.submitButton}
          loading={isPending}
          disabled={isPending}
          icon={isEditing ? 'content-save' : 'plus'}
        >
          {isPending ? 'Saving...' : isEditing ? 'Save Changes' : 'Add Address'}
        </Button>

        <Button
          mode="text"
          onPress={() => router.back()}
          style={styles.cancelButton}
          disabled={isPending}
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
  content: {
    paddingBottom: spacing[8],
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: spacing[4],
  },
  form: {
    padding: spacing[4],
    gap: spacing[1],
  },
  fieldLabel: {
    ...typography.label,
    color: colors.text.secondary,
    marginBottom: spacing[1],
  },
  segmentedButtons: {
    marginBottom: spacing[2],
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
    marginBottom: spacing[4],
  },
  retryButton: {
    backgroundColor: colors.primary[500],
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing[2],
    marginTop: spacing[2],
  },
  switchLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  switchText: {
    ...typography.body,
    color: colors.text.primary,
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
