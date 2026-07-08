import { useCallback } from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Text, Card, Button, ActivityIndicator } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAddresses, useDeleteAddress } from '../../../src/hooks/useAddresses';
import { useOfflineBlock } from '../../../src/hooks/useOfflineBlock';
import { useAnalytics } from '../../../src/hooks/useAnalytics';
import { colors } from '../../../src/config/colors';
import { spacing, borderRadius } from '../../../src/config/spacing';
import { typography } from '../../../src/config/typography';
import type { Address } from '../../../src/types';

export default function AddressesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const analytics = useAnalytics();
  const { data: addresses, isLoading, isError, refetch, isRefetching } = useAddresses();
  const deleteMutation = useDeleteAddress();
  const { blockIfOffline } = useOfflineBlock();

  const handleAddNew = useCallback(() => {
    router.push('/order/address-form?from=account' as any);
  }, [router]);

  const handleEdit = useCallback(
    (addr: Address) => {
      router.push(`/order/address-form?id=${addr.id}&from=account` as any);
    },
    [router]
  );

  const handleDelete = useCallback(
    (addr: Address) => {
      if (blockIfOffline('delete this address')) return;
      Alert.alert(
        'Delete Address',
        `Are you sure you want to delete this ${addr.label} address?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              try {
                await deleteMutation.mutateAsync(addr.id);
              } catch {
                // Error handled by react-query
              }
            },
          },
        ]
      );
    },
    [blockIfOffline, deleteMutation]
  );

  if (isLoading) {
    return (
      <View style={[styles.center, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={[styles.center, { paddingTop: insets.top }]}>
        <MaterialCommunityIcons name="alert-circle-outline" size={48} color={colors.error.DEFAULT} />
        <Text style={styles.errorTitle}>Failed to load addresses</Text>
        <Button mode="contained" onPress={() => refetch()} style={styles.retryButton}>
          Retry
        </Button>
      </View>
    );
  }

  if (!addresses || addresses.length === 0) {
    return (
      <View style={[styles.center, { paddingTop: insets.top }]}>
        <MaterialCommunityIcons name="map-marker-off" size={48} color={colors.text.tertiary} />
        <Text style={styles.emptyTitle}>No saved addresses</Text>
        <Text style={styles.emptySubtitle}>
          Add a delivery address to get started
        </Text>
        <Button
          mode="contained"
          onPress={handleAddNew}
          style={styles.addButton}
          icon="plus"
        >
          Add New Address
        </Button>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: spacing[4], paddingTop: spacing[2] }}
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.primary[500]} />
      }
    >
      <Card style={styles.listCard}>
        <Card.Content>
          <View style={styles.listHeader}>
            <Text style={styles.sectionTitle}>Saved Addresses</Text>
            <TouchableOpacity
              onPress={handleAddNew}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityLabel="Add new address"
            >
              <MaterialCommunityIcons name="plus-circle" size={24} color={colors.primary[500]} />
            </TouchableOpacity>
          </View>
          <View style={styles.addressList}>
            {addresses.map((addr: Address) => {
              const labelColor =
                addr.label === 'home'
                  ? colors.primary[500]
                  : addr.label === 'work'
                    ? colors.info.DEFAULT
                    : colors.text.tertiary;
              return (
                <View key={addr.id} style={styles.addressItem}>
                  <View style={styles.addressLeft}>
                    <MaterialCommunityIcons
                      name={
                        addr.label === 'home'
                          ? 'home'
                          : addr.label === 'work'
                            ? 'briefcase'
                            : 'map-marker'
                      }
                      size={22}
                      color={colors.text.secondary}
                    />
                    <View style={styles.addressText}>
                      <View style={styles.addressLabelRow}>
                        <Text style={[styles.addressLabel, { color: labelColor }]}>
                          {addr.label.charAt(0).toUpperCase() + addr.label.slice(1)}
                        </Text>
                        {addr.isDefault && (
                          <View style={styles.defaultBadge}>
                            <Text style={styles.defaultBadgeText}>Default</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.addressLine1}>{addr.addressLine1}</Text>
                      {addr.addressLine2 && (
                        <Text style={styles.addressLine2}>{addr.addressLine2}</Text>
                      )}
                      <Text style={styles.addressCity}>
                        {[addr.city, addr.state, addr.postalCode].filter(Boolean).join(', ')}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.addressActions}>
                    <TouchableOpacity
                      onPress={() => handleEdit(addr)}
                      style={styles.actionButton}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      accessibilityLabel={`Edit ${addr.label} address`}
                    >
                      <MaterialCommunityIcons name="pencil" size={18} color={colors.text.tertiary} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDelete(addr)}
                      style={styles.actionButton}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      accessibilityLabel={`Delete ${addr.label} address`}
                    >
                      <MaterialCommunityIcons name="delete-outline" size={18} color={colors.error.DEFAULT} />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        </Card.Content>
      </Card>
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
  listCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[3],
  },
  sectionTitle: {
    ...typography['label-lg'],
    color: colors.text.primary,
    fontWeight: '600',
  },
  addressList: {
    gap: spacing[2],
  },
  addressItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing[3],
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  addressLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[3],
    flex: 1,
  },
  addressText: {
    flex: 1,
    gap: 2,
  },
  addressLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  addressLabel: {
    ...typography.label,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  defaultBadge: {
    backgroundColor: colors.success.light,
    paddingHorizontal: spacing[2],
    paddingVertical: 1,
    borderRadius: borderRadius.full,
  },
  defaultBadgeText: {
    ...typography.caption,
    color: colors.success.DEFAULT,
    fontWeight: '600',
    fontSize: 10,
  },
  addressLine1: {
    ...typography.body,
    color: colors.text.primary,
  },
  addressLine2: {
    ...typography['body-sm'],
    color: colors.text.secondary,
  },
  addressCity: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
  addressActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    marginLeft: spacing[2],
  },
  actionButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  emptyTitle: {
    ...typography['label-lg'],
    color: colors.text.primary,
    fontWeight: '600',
  },
  emptySubtitle: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  addButton: {
    borderRadius: borderRadius.lg,
    marginTop: spacing[3],
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
});
