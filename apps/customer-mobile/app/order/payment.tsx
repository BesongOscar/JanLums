import { useState, useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAnalytics } from '../../src/hooks/useAnalytics';
import { useOrderDraftStore } from '../../src/stores/orderDraftStore';
import { useCreateOrder } from '../../src/hooks/useCreateOrder';
import { useEnqueueOperation } from '../../src/hooks/useSyncQueue';
import { useUIStore } from '../../src/stores/uiStore';
import { normalizeError } from '../../src/utils/errorHandler';
import { formatCurrency } from '../../src/utils/format';
import { colors } from '../../src/config/colors';
import { spacing, borderRadius } from '../../src/config/spacing';
import { typography } from '../../src/config/typography';
import type { PaymentProvider } from '../../src/types';
import { ScreenHeader } from '../../src/components/common/ScreenHeader';
import { StepIndicator } from '../../src/components/common/StepIndicator';

const ORDER_STEPS = [
  { key: 'services', label: 'Services' },
  { key: 'review', label: 'Review' },
  { key: 'payment', label: 'Payment' },
];

interface PaymentOption {
  key: PaymentProvider;
  label: string;
  icon: string;
  description: string;
}

const PAYMENT_OPTIONS: PaymentOption[] = [
  {
    key: 'mtn',
    label: 'MTN Mobile Money',
    icon: 'cellphone',
    description: 'Pay with MTN MoMo',
  },
  {
    key: 'orange',
    label: 'Orange Money',
    icon: 'cellphone',
    description: 'Pay with Orange Money',
  },
  {
    key: 'cash',
    label: 'Cash',
    icon: 'cash',
    description: 'Pay with cash at pickup',
  },
  {
    key: 'card',
    label: 'Card',
    icon: 'credit-card',
    description: 'Pay with debit/credit card',
  },
];

export default function PaymentScreen() {
  const router = useRouter();
  const analytics = useAnalytics();
  const isOnline = useUIStore((s) => s.isOnline);

  const selectedServices = useOrderDraftStore((s) => s.selectedServices);
  const branchName = useOrderDraftStore((s) => s.branchName);
  const notes = useOrderDraftStore((s) => s.notes);
  const paymentMethod = useOrderDraftStore((s) => s.paymentMethod);
  const setPaymentMethod = useOrderDraftStore((s) => s.setPaymentMethod);
  const reset = useOrderDraftStore((s) => s.reset);
  const toOrderPayload = useOrderDraftStore((s) => s.toOrderPayload);

  const estimatedSubtotal = useOrderDraftStore((s) => s.getEstimatedSubtotal());
  const itemCount = useOrderDraftStore((s) => s.getItemCount());
  const isDraftValid = useOrderDraftStore((s) => s.isValid());

  const { mutate: createOrder, isPending: isSubmitting } = useCreateOrder();
  const enqueueOperation = useEnqueueOperation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isQueuing, setIsQueuing] = useState(false);

  const handleSelectMethod = useCallback(
    (method: PaymentProvider) => {
      setPaymentMethod(method);
    },
    [setPaymentMethod]
  );

  const handlePlaceOrder = useCallback(() => {
    if (!paymentMethod) return;

    analytics.track({ name: 'order_submission_started' });
    const payload = toOrderPayload();

    if (!isOnline) {
      setIsQueuing(true);
      const id = enqueueOperation('create_order', `${itemCount} service${itemCount !== 1 ? 's' : ''}`, payload);
      analytics.track({ name: 'order_queued_for_sync', properties: { queueId: id } });
      reset();
      router.replace(
        `/order/success?paymentMethod=${paymentMethod}&queued=true` as any
      );
      return;
    }

    createOrder(payload, {
      onSuccess: (order) => {
        analytics.track({
          name: 'order_submission_completed',
          properties: { orderId: order.id },
        });
        reset();
        router.replace(
          `/order/success?id=${order.id}&paymentMethod=${paymentMethod}` as any
        );
      },
      onError: (err) => {
        const normalized = normalizeError(err);
        setErrorMessage(normalized.message);
      },
    });
  }, [
    paymentMethod,
    isOnline,
    analytics,
    toOrderPayload,
    enqueueOperation,
    itemCount,
    reset,
    router,
    createOrder,
  ]);

  return (
    <View style={styles.container}>
      <ScreenHeader title="Payment" />
      <StepIndicator steps={ORDER_STEPS} currentStep="payment" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.summaryCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Order Summary</Text>
            <View style={styles.summaryRow}>
              <MaterialCommunityIcons name="store" size={18} color={colors.text.secondary} />
              <Text style={styles.summaryLabel}>Branch</Text>
              <Text style={styles.summaryValue}>{branchName || 'Selected branch'}</Text>
            </View>
            <View style={styles.summaryRow}>
              <MaterialCommunityIcons name="package-variant" size={18} color={colors.text.secondary} />
              <Text style={styles.summaryLabel}>Items</Text>
              <Text style={styles.summaryValue}>{itemCount} service{itemCount !== 1 ? 's' : ''}</Text>
            </View>
            {notes ? (
              <View style={styles.summaryRow}>
                <MaterialCommunityIcons name="note-text" size={18} color={colors.text.secondary} />
                <Text style={styles.summaryLabel}>Notes</Text>
                <Text style={styles.summaryValue} numberOfLines={1}>{notes}</Text>
              </View>
            ) : null}
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Estimated Total</Text>
              <Text style={styles.totalValue}>{formatCurrency(estimatedSubtotal)}</Text>
            </View>
            <Text style={styles.pricingDisclaimer}>
              Estimated pricing only — final amount confirmed at pickup
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.paymentCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Payment Method</Text>
            <Text style={styles.paymentSubtitle}>
              Select how you'd like to pay
            </Text>
            <View style={styles.paymentOptions}>
              {PAYMENT_OPTIONS.map((option) => {
                const isSelected = paymentMethod === option.key;
                return (
                  <TouchableOpacity
                    key={option.key}
                    style={[
                      styles.paymentOption,
                      isSelected && styles.paymentOptionSelected,
                    ]}
                    onPress={() => handleSelectMethod(option.key)}
                    accessibilityLabel={option.label}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: isSelected }}
                  >
                    <View style={styles.optionLeft}>
                      <MaterialCommunityIcons
                        name={option.icon as any}
                        size={24}
                        color={isSelected ? colors.primary[500] : colors.text.secondary}
                      />
                      <View style={styles.optionText}>
                        <Text
                          style={[
                            styles.optionLabel,
                            isSelected && styles.optionLabelSelected,
                          ]}
                        >
                          {option.label}
                        </Text>
                        <Text style={styles.optionDescription}>
                          {option.description}
                        </Text>
                      </View>
                    </View>
                    {isSelected && (
                      <MaterialCommunityIcons
                        name="check-circle"
                        size={22}
                        color={colors.success.DEFAULT}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </Card.Content>
        </Card>

        {errorMessage && (
          <Card style={styles.errorCard}>
            <Card.Content style={styles.errorContent}>
              <MaterialCommunityIcons name="alert-circle" size={18} color={colors.error.DEFAULT} />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </Card.Content>
          </Card>
        )}

        <View style={{ height: spacing[8] }} />
      </ScrollView>

      <View style={styles.bottomBar}>
        <Button
          mode="outlined"
          onPress={() => router.back()}
          style={styles.backBtn}
          contentStyle={styles.backBtnContent}
          icon="arrow-left"
        >
          Back
        </Button>
        <Button
          mode="contained"
          onPress={handlePlaceOrder}
          style={styles.placeOrderButton}
          contentStyle={styles.placeOrderButtonContent}
          disabled={!paymentMethod || !isDraftValid || isSubmitting}
          loading={isSubmitting}
          icon="check"
          accessibilityLabel="Place order"
          accessibilityState={{
            disabled: !paymentMethod || !isDraftValid || isSubmitting,
          }}
        >
          Place Order
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: spacing[4],
    paddingBottom: spacing[4],
  },
  summaryCard: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing[4],
    marginBottom: spacing[3],
    borderRadius: borderRadius.lg,
  },
  sectionTitle: {
    ...typography['label-lg'],
    color: colors.text.primary,
    fontWeight: '600',
    marginBottom: spacing[3],
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    marginBottom: spacing[2],
  },
  summaryLabel: {
    ...typography.body,
    color: colors.text.secondary,
    flex: 1,
  },
  summaryValue: {
    ...typography['label-lg'],
    color: colors.text.primary,
    fontWeight: '500',
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: spacing[2],
  },
  totalLabel: {
    ...typography['label-lg'],
    color: colors.text.primary,
    fontWeight: '600',
    flex: 1,
  },
  totalValue: {
    ...typography['display-sm'],
    color: colors.primary[600],
    fontWeight: '700',
  },
  pricingDisclaimer: {
    ...typography.caption,
    color: colors.text.tertiary,
    marginTop: spacing[1],
    fontStyle: 'italic',
  },
  paymentCard: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing[4],
    marginBottom: spacing[3],
    borderRadius: borderRadius.lg,
  },
  paymentSubtitle: {
    ...typography['body-sm'],
    color: colors.text.tertiary,
    marginBottom: spacing[3],
    marginTop: -spacing[1],
  },
  paymentOptions: {
    gap: spacing[2],
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing[3],
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  paymentOptionSelected: {
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[50],
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    flex: 1,
  },
  optionText: {
    flex: 1,
  },
  optionLabel: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '500',
  },
  optionLabelSelected: {
    color: colors.primary[700],
    fontWeight: '600',
  },
  optionDescription: {
    ...typography.caption,
    color: colors.text.tertiary,
    marginTop: 1,
  },
  errorCard: {
    backgroundColor: colors.error.light,
    marginHorizontal: spacing[4],
    marginBottom: spacing[3],
    borderRadius: borderRadius.lg,
  },
  errorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  errorText: {
    ...typography['body-sm'],
    color: colors.error.DEFAULT,
    flex: 1,
  },
  bottomBar: {
    flexDirection: 'row',
    padding: spacing[4],
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing[2],
  },
  backBtn: {
    flex: 1,
    borderRadius: borderRadius.lg,
  },
  backBtnContent: {
    paddingVertical: spacing[1],
  },
  placeOrderButton: {
    flex: 1,
    borderRadius: borderRadius.lg,
  },
  placeOrderButtonContent: {
    paddingVertical: spacing[1],
  },
});
