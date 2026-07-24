import { useState, useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Text, Card, Button, Dialog, Portal } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAddresses, useDeleteAddress } from '../../src/hooks/useAddresses';
import { useOrderDraftStore } from '../../src/stores/orderDraftStore';
import { useOfflineBlock } from '../../src/hooks/useOfflineBlock';
import { colors } from '../../src/config/colors';
import { spacing, borderRadius } from '../../src/config/spacing';
import { typography } from '../../src/config/typography';
import type { Address } from '../../src/types';
import { ScreenHeader } from '../../src/components/common/ScreenHeader';

function formatAddressSummary(a: Address): string {
  const parts = [a.addressLine1, a.city, a.state].filter(Boolean);
  return parts.join(', ');
}

export default function AddressScreen() {
  const router = useRouter();

  const { data: addresses, isLoading, isError, refetch } = useAddresses();
  const addressId = useOrderDraftStore((s) => s.addressId);
  const setAddress = useOrderDraftStore((s) => s.setAddress);
  const deleteMutation = useDeleteAddress();
  const { blockIfOffline } = useOfflineBlock();

  const [deleteTarget, setDeleteTarget] = useState<Address | null>(null);

  const handleSelect = useCallback(
    (addr: Address) => {
      setAddress(addr.id, formatAddressSummary(addr));
    },
    [setAddress]
  );

  const handleSave = useCallback(() => {
    if (addressId) {
      router.back();
    }
  }, [addressId, router]);

  const handleAddNew = useCallback(() => {
    router.push('/order/address-form' as any);
  }, [router]);

  const handleEdit = useCallback(
    (addr: Address) => {
      router.push(`/order/address-form?id=${addr.id}&from=order` as any);
    },
    [router]
  );

  const handleDelete = useCallback(
    async (addr: Address) => {
      if (blockIfOffline('delete this address')) return;
      setDeleteTarget(null);
      try {
        await deleteMutation.mutateAsync(addr.id);
        if (addressId === addr.id) {
          setAddress(null, '');
        }
      } catch {
        // Error handled by react-query, address stays in list
      }
    },
    [blockIfOffline, deleteMutation, addressId, setAddress]
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={colors.primary[500]} />
        </View>
      );
    }

    if (isError) {
      return (
        <View style={styles.centerContent}>
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
        <View style={styles.centerContent}>
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
      <Card style={styles.listCard}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Saved Addresses</Text>
          <View style={styles.addressList}>
            {addresses.map((addr: Address) => {
              const isSelected = addressId === addr.id;
              const labelColor =
                addr.label === 'home'
                  ? colors.primary[500]
                  : addr.label === 'work'
                    ? colors.info.DEFAULT
                    : colors.text.tertiary;
              return (
                <TouchableOpacity
                  key={addr.id}
                  style={[
                    styles.addressItem,
                    isSelected && styles.addressItemSelected,
                  ]}
                  onPress={() => handleSelect(addr)}
                  accessibilityLabel={`${addr.label} address: ${formatAddressSummary(addr)}`}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: isSelected }}
                >
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
                      color={isSelected ? colors.primary[500] : colors.text.secondary}
                    />
                    <View style={styles.addressText}>
                      <View style={styles.addressLabelRow}>
                        <Text
                          style={[
                            styles.addressLabel,
                            { color: labelColor },
                          ]}
                        >
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
                        {[addr.city, addr.state, addr.postalCode]
                          .filter(Boolean)
                          .join(', ')}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.addressActions}>
                    {isSelected ? (
                      <MaterialCommunityIcons
                        name="check-circle"
                        size={22}
                        color={colors.success.DEFAULT}
                      />
                    ) : (
                      <>
                        <TouchableOpacity
                          onPress={() => handleEdit(addr)}
                          style={styles.actionButton}
                          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                          accessibilityLabel={`Edit ${addr.label} address`}
                        >
                          <MaterialCommunityIcons
                            name="pencil"
                            size={18}
                            color={colors.text.tertiary}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => setDeleteTarget(addr)}
                          style={styles.actionButton}
                          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                          accessibilityLabel={`Delete ${addr.label} address`}
                        >
                          <MaterialCommunityIcons
                            name="delete-outline"
                            size={18}
                            color={colors.error.DEFAULT}
                          />
                        </TouchableOpacity>
                      </>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
          <Button
            mode="outlined"
            onPress={handleAddNew}
            style={styles.addListButton}
            icon="plus"
          >
            Add New Address
          </Button>
        </Card.Content>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Delivery Address" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderContent()}
        <View style={{ height: spacing[8] }} />
      </ScrollView>

      <View style={styles.bottomBar}>
        <Button
          mode="outlined"
          onPress={() => router.back()}
          style={styles.cancelButton}
          contentStyle={styles.cancelButtonContent}
          icon="close"
        >
          Cancel
        </Button>
        <Button
          mode="contained"
          onPress={handleSave}
          style={styles.saveButton}
          contentStyle={styles.saveButtonContent}
          disabled={!addressId}
          icon="check"
          accessibilityLabel="Save address and return"
          accessibilityState={{ disabled: !addressId }}
        >
          Save & Return
        </Button>
      </View>

      <Portal>
        <Dialog visible={deleteTarget !== null} onDismiss={() => setDeleteTarget(null)}>
          <Dialog.Icon icon="delete" />
          <Dialog.Title>Delete Address</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure you want to delete this {deleteTarget?.label} address?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteTarget(null)}>Cancel</Button>
            <Button
              onPress={() => deleteTarget && handleDelete(deleteTarget)}
              textColor={colors.error.DEFAULT}
              loading={deleteMutation.isPending}
            >
              Delete
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: spacing[4],
    paddingBottom: spacing[4],
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[12],
    gap: spacing[3],
  },
  errorTitle: {
    ...typography.body,
    color: colors.error.DEFAULT,
    textAlign: 'center',
  },
  retryButton: {
    borderRadius: borderRadius.lg,
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
  listCard: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing[4],
    borderRadius: borderRadius.lg,
  },
  sectionTitle: {
    ...typography['label-lg'],
    color: colors.text.primary,
    fontWeight: '600',
    marginBottom: spacing[3],
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
  addressItemSelected: {
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[50],
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
  addListButton: {
    marginTop: spacing[4],
    borderRadius: borderRadius.lg,
    borderColor: colors.border,
  },
  bottomBar: {
    flexDirection: 'row',
    padding: spacing[4],
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing[2],
  },
  cancelButton: {
    flex: 1,
    borderRadius: borderRadius.lg,
  },
  cancelButtonContent: {
    paddingVertical: spacing[1],
  },
  saveButton: {
    flex: 1,
    borderRadius: borderRadius.lg,
  },
  saveButtonContent: {
    paddingVertical: spacing[1],
  },
});
