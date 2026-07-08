import { useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useOrderDraftStore } from '../../src/stores/orderDraftStore';
import { formatCurrency } from '../../src/utils/format';
import { colors } from '../../src/config/colors';
import { spacing, borderRadius } from '../../src/config/spacing';
import { typography } from '../../src/config/typography';

function EmptyDraft() {
  const router = useRouter();
  return (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons name="cart-outline" size={64} color={colors.text.tertiary} />
      <Text style={styles.emptyTitle}>Your order is empty</Text>
      <Text style={styles.emptySubtitle}>Add services to get started</Text>
        <Button
            mode="contained"
            onPress={() => router.push('/order/services' as any)}
            style={styles.browseButton}
            contentStyle={styles.browseButtonContent}
            accessibilityLabel="Browse services"
          >
            Browse Services
          </Button>
    </View>
  );
}

export default function ReviewScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const selectedServices = useOrderDraftStore((s) => s.selectedServices);
  const branchId = useOrderDraftStore((s) => s.branchId);
  const branchName = useOrderDraftStore((s) => s.branchName);
  const notes = useOrderDraftStore((s) => s.notes);
  const addressId = useOrderDraftStore((s) => s.addressId);
  const addressLabel = useOrderDraftStore((s) => s.addressLabel);
  const removeService = useOrderDraftStore((s) => s.removeService);
  const updateServiceQuantity = useOrderDraftStore((s) => s.updateServiceQuantity);

  const estimatedSubtotal = useOrderDraftStore((s) => s.getEstimatedSubtotal());
  const itemCount = useOrderDraftStore((s) => s.getItemCount());
  const isDraftValid = useOrderDraftStore((s) => s.isValid());

  const handleQuantityChange = useCallback(
    (index: number, delta: number) => {
      const item = selectedServices[index];
      const newQty = Math.max(1, item.quantity + delta);
      updateServiceQuantity(index, newQty);
    },
    [selectedServices, updateServiceQuantity]
  );

  const handleRemove = useCallback(
    (index: number) => {
      removeService(index);
    },
    [removeService]
  );

  const handleSelectBranch = useCallback(() => {
    router.push('/order/branch' as any);
  }, [router]);

  const handleSelectAddress = useCallback(() => {
    router.push('/order/address' as any);
  }, [router]);

  const handleProceedToPayment = useCallback(() => {
    if (!isDraftValid) return;
    router.push('/order/payment' as any);
  }, [isDraftValid, router]);

  if (selectedServices.length === 0) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.headerBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton} accessibilityLabel="Go back" accessibilityRole="button">
            <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerBarTitle} accessibilityRole="header">Review Order</Text>
          <View style={{ width: 40 }} />
        </View>
        <EmptyDraft />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} accessibilityLabel="Go back" accessibilityRole="button">
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerBarTitle} accessibilityRole="header">Review Order</Text>
        <TouchableOpacity onPress={() => router.push('/order/services' as any)} style={styles.addMoreButton} accessibilityLabel="Add more services" accessibilityRole="button">
          <MaterialCommunityIcons name="plus" size={24} color={colors.primary[500]} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Services ({selectedServices.length})</Text>
            {selectedServices.map((item, index) => (
              <View key={`${item.serviceId}-${index}`}>
                <View style={styles.serviceItem}>
                  <View style={styles.serviceItemInfo}>
                    <Text style={styles.serviceItemName}>{item.serviceName}</Text>
                    <Text style={styles.serviceItemPrice}>
                      {formatCurrency(item.estimatedPrice)} each
                    </Text>
                    <View style={styles.quantityRow}>
                      <TouchableOpacity
                        style={[styles.qtyButton, item.quantity <= 1 && styles.qtyButtonDisabled]}
                        onPress={() => handleQuantityChange(index, -1)}
                        disabled={item.quantity <= 1}
                        activeOpacity={0.7}
                        accessibilityLabel={`Decrease quantity of ${item.serviceName}`}
                        accessibilityRole="button"
                        accessibilityState={{ disabled: item.quantity <= 1 }}
                      >
                        <MaterialCommunityIcons
                          name="minus"
                          size={16}
                          color={item.quantity <= 1 ? colors.text.disabled : colors.primary[500]}
                        />
                      </TouchableOpacity>
                      <Text style={styles.qtyValue}>{item.quantity}</Text>
                      <TouchableOpacity
                        style={styles.qtyButton}
                        onPress={() => handleQuantityChange(index, 1)}
                        activeOpacity={0.7}
                        accessibilityLabel={`Increase quantity of ${item.serviceName}`}
                        accessibilityRole="button"
                      >
                        <MaterialCommunityIcons name="plus" size={16} color={colors.primary[500]} />
                      </TouchableOpacity>
                    </View>
                    {item.notes && (
                      <Text style={styles.serviceItemNotes}>{item.notes}</Text>
                    )}
                  </View>
                  <View style={styles.serviceItemRight}>
                    <Text style={styles.serviceItemTotal}>
                      {formatCurrency(item.estimatedPrice * item.quantity)}
                    </Text>
                    <TouchableOpacity
                      onPress={() => handleRemove(index)}
                      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                      accessibilityLabel={`Remove ${item.serviceName} from order`}
                      accessibilityRole="button"
                    >
                      <MaterialCommunityIcons name="delete-outline" size={20} color={colors.error.DEFAULT} />
                    </TouchableOpacity>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.garmentRow}
                  onPress={() => router.push(`/order/garments?index=${index}` as any)}
                  activeOpacity={0.7}
                  accessibilityLabel={
                    item.garments && item.garments.length > 0
                      ? `${item.garments.length} garments specified for ${item.serviceName}. Tap to edit.`
                      : `Add garment details for ${item.serviceName}`
                  }
                  accessibilityRole="button"
                >
                  <MaterialCommunityIcons
                    name="hanger"
                    size={18}
                    color={item.garments && item.garments.length > 0 ? colors.primary[500] : colors.text.tertiary}
                  />
                  <Text style={[
                    styles.garmentRowText,
                    item.garments && item.garments.length > 0 && styles.garmentRowTextFilled,
                  ]}>
                    {item.garments && item.garments.length > 0
                      ? `${item.garments.length} garment${item.garments.length !== 1 ? 's' : ''} specified`
                      : 'Add garment details'}
                  </Text>
                  <MaterialCommunityIcons name="chevron-right" size={18} color={colors.text.tertiary} />
                </TouchableOpacity>
                {index < selectedServices.length - 1 && <View style={styles.divider} />}
              </View>
            ))}
          </Card.Content>
        </Card>

        <Card style={styles.sectionCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Branch</Text>
            {branchId && branchName ? (
              <TouchableOpacity onPress={handleSelectBranch} style={styles.branchRow} activeOpacity={0.7}>
                <MaterialCommunityIcons name="store" size={20} color={colors.primary[500]} />
                <View style={styles.branchInfo}>
                  <Text style={styles.branchName}>{branchName}</Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={20} color={colors.text.tertiary} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={handleSelectBranch} style={styles.selectBranchRow} activeOpacity={0.7}>
                <MaterialCommunityIcons name="store-outline" size={20} color={colors.primary[500]} />
                <Text style={styles.selectBranchText}>Select a branch</Text>
                <MaterialCommunityIcons name="chevron-right" size={20} color={colors.text.tertiary} />
              </TouchableOpacity>
            )}
          </Card.Content>
        </Card>

        <Card style={styles.sectionCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Delivery Address</Text>
            {addressId && addressLabel ? (
              <TouchableOpacity onPress={handleSelectAddress} style={styles.branchRow} activeOpacity={0.7}>
                <MaterialCommunityIcons name="map-marker" size={20} color={colors.primary[500]} />
                <View style={styles.branchInfo}>
                  <Text style={styles.branchName}>{addressLabel}</Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={20} color={colors.text.tertiary} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={handleSelectAddress} style={styles.selectBranchRow} activeOpacity={0.7}>
                <MaterialCommunityIcons name="map-marker-outline" size={20} color={colors.primary[500]} />
                <Text style={styles.selectBranchText}>Select delivery address</Text>
                <MaterialCommunityIcons name="chevron-right" size={20} color={colors.text.tertiary} />
              </TouchableOpacity>
            )}
          </Card.Content>
        </Card>

        {notes.length > 0 && (
          <Card style={styles.sectionCard}>
            <Card.Content>
              <Text style={styles.sectionTitle}>Order Notes</Text>
              <Text style={styles.notesText}>{notes}</Text>
            </Card.Content>
          </Card>
        )}

        <Card style={styles.pricingCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Estimated Pricing</Text>
            <View style={styles.pricingRow}>
              <Text style={styles.pricingLabel}>Subtotal ({itemCount} items)</Text>
              <Text style={styles.pricingValue}>{formatCurrency(estimatedSubtotal)}</Text>
            </View>
            <Text style={styles.pricingDisclaimer}>
              Estimated pricing only — final amount confirmed at pickup
            </Text>
          </Card.Content>
        </Card>

        <View style={{ height: spacing[8] }} />
      </ScrollView>

      <View style={styles.bottomBar}>
        <Button
          mode="outlined"
          onPress={handleSelectBranch}
          style={styles.branchButton}
          contentStyle={styles.branchButtonContent}
          icon="store"
        >
          Change Branch
        </Button>
        <Button
          mode="contained"
          onPress={handleProceedToPayment}
          style={styles.submitButton}
          contentStyle={styles.submitButtonContent}
          disabled={!isDraftValid}
          icon="credit-card"
          accessibilityLabel="Proceed to payment"
          accessibilityState={{ disabled: !isDraftValid }}
        >
          Proceed to Payment
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[2],
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBarTitle: {
    ...typography['heading-sm'],
    color: colors.text.primary,
  },
  addMoreButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    flex: 1,
  },
  sectionCard: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing[4],
    marginBottom: spacing[3],
    borderRadius: borderRadius.lg,
  },
  sectionTitle: {
    ...typography['heading-sm'],
    color: colors.text.primary,
    marginBottom: spacing[3],
  },
  serviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: spacing[2],
  },
  serviceItemInfo: {
    flex: 1,
    marginRight: spacing[3],
  },
  serviceItemName: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '500',
  },
  serviceItemPrice: {
    ...typography['body-sm'],
    color: colors.text.tertiary,
    marginTop: 2,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing[1],
    gap: spacing[2],
  },
  qtyButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  qtyButtonDisabled: {
    backgroundColor: colors.gray[100],
  },
  qtyValue: {
    ...typography['label-lg'],
    color: colors.text.primary,
    minWidth: 24,
    textAlign: 'center',
  },
  serviceItemNotes: {
    ...typography.caption,
    color: colors.text.tertiary,
    fontStyle: 'italic',
    marginTop: spacing[1],
  },
  serviceItemRight: {
    alignItems: 'flex-end',
    gap: spacing[1],
  },
  serviceItemTotal: {
    ...typography['label-lg'],
    color: colors.text.primary,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
  },
  branchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  branchInfo: {
    flex: 1,
  },
  branchName: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '500',
  },
  selectBranchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  selectBranchText: {
    ...typography.body,
    color: colors.primary[500],
    flex: 1,
    fontWeight: '500',
  },
  notesText: {
    ...typography.body,
    color: colors.text.secondary,
    fontStyle: 'italic',
  },
  pricingCard: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing[4],
    marginBottom: spacing[3],
    borderRadius: borderRadius.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary[500],
  },
  pricingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pricingLabel: {
    ...typography.body,
    color: colors.text.secondary,
  },
  pricingValue: {
    ...typography['label-lg'],
    color: colors.text.primary,
    fontWeight: '600',
  },
  pricingDisclaimer: {
    ...typography.caption,
    color: colors.text.tertiary,
    marginTop: spacing[2],
    fontStyle: 'italic',
  },
  bottomBar: {
    flexDirection: 'row',
    padding: spacing[4],
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing[2],
  },
  branchButton: {
    flex: 1,
    borderRadius: borderRadius.lg,
  },
  branchButtonContent: {
    paddingVertical: spacing[1],
  },
  submitButton: {
    flex: 1,
    borderRadius: borderRadius.lg,
  },
  submitButtonContent: {
    paddingVertical: spacing[1],
  },
  garmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[1],
    gap: spacing[2],
    backgroundColor: colors.gray[50],
    borderRadius: borderRadius.md,
    marginTop: spacing[1],
  },
  garmentRowText: {
    ...typography['body-sm'],
    color: colors.text.tertiary,
    flex: 1,
  },
  garmentRowTextFilled: {
    color: colors.primary[600],
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing[8],
  },
  emptyTitle: {
    ...typography.heading,
    color: colors.text.primary,
    marginTop: spacing[4],
  },
  emptySubtitle: {
    ...typography.body,
    color: colors.text.secondary,
    marginTop: spacing[2],
    textAlign: 'center',
  },
  browseButton: {
    marginTop: spacing[5],
    borderRadius: borderRadius.lg,
  },
  browseButtonContent: {
    paddingHorizontal: spacing[6],
  },
});
