import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useOrderDetails } from '../../src/hooks/useOrderDetails';
import { colors } from '../../src/config/colors';
import { spacing, borderRadius } from '../../src/config/spacing';
import { typography } from '../../src/config/typography';

const PAYMENT_LABELS: Record<string, string> = {
  mtn: 'MTN Mobile Money',
  orange: 'Orange Money',
  cash: 'Cash',
  card: 'Card',
};

export default function OrderSuccessScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id, paymentMethod, queued } = useLocalSearchParams<{ id: string; paymentMethod: string; queued: string }>();

  const { data: order } = useOrderDetails(id ?? '');

  useEffect(() => {
    if (!id) {
      const timer = setTimeout(() => {
        router.replace('/(tabs)');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [id, router]);

  const handleTrackOrder = () => {
    if (id) {
      router.replace(`/orders/${id}` as any);
    }
  };

  const handleBackToHome = () => {
    router.replace('/(tabs)');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        {queued === 'true' ? (
          <>
            <View style={styles.successIcon}>
              <MaterialCommunityIcons name="clock-outline" size={80} color={colors.warning.DEFAULT} />
            </View>
            <Text style={styles.title}>Order Queued</Text>
            <Text style={styles.subtitle}>
              Your order has been saved and will be submitted automatically once you're back online.
            </Text>
            <View style={styles.orderInfo}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Payment</Text>
                <Text style={styles.infoValue}>{paymentMethod && PAYMENT_LABELS[paymentMethod] ? PAYMENT_LABELS[paymentMethod] : 'Not selected'}</Text>
              </View>
            </View>
            <View style={styles.actions}>
              <Button
                mode="outlined"
                onPress={handleBackToHome}
                style={styles.homeButton}
                contentStyle={styles.homeButtonContent}
                icon="home"
              >
                Back To Home
              </Button>
            </View>
          </>
        ) : (
          <>
            <View style={styles.successIcon}>
              <MaterialCommunityIcons name="check-circle" size={80} color={colors.success.DEFAULT} />
            </View>
            <Text style={styles.title}>Order Submitted!</Text>
            <Text style={styles.subtitle}>
              Your laundry order has been received and is being processed.
            </Text>
            {order && (
              <View style={styles.orderInfo}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Order Number</Text>
                  <Text style={styles.infoValue}>
                    #{order.id.slice(0, 8).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Status</Text>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>Pending</Text>
                  </View>
                </View>
                {order.branch?.name && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Branch</Text>
                    <Text style={styles.infoValue}>{order.branch.name}</Text>
                  </View>
                )}
                {paymentMethod && PAYMENT_LABELS[paymentMethod] && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Payment</Text>
                    <Text style={styles.infoValue}>{PAYMENT_LABELS[paymentMethod]}</Text>
                  </View>
                )}
              </View>
            )}
            <View style={styles.actions}>
              <Button
                mode="contained"
                onPress={handleTrackOrder}
                style={styles.trackButton}
                contentStyle={styles.trackButtonContent}
                icon="map-marker-path"
              >
                Track Order
              </Button>
              <Button
                mode="outlined"
                onPress={handleBackToHome}
                style={styles.homeButton}
                contentStyle={styles.homeButtonContent}
                icon="home"
              >
                Back To Home
              </Button>
            </View>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing[6],
  },
  successIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.success.light,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing[5],
  },
  title: {
    ...typography['display-lg'],
    color: colors.text.primary,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: spacing[2],
    lineHeight: 22,
  },
  orderInfo: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing[4],
    marginTop: spacing[6],
    gap: spacing[3],
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    ...typography.body,
    color: colors.text.secondary,
  },
  infoValue: {
    ...typography['label-lg'],
    color: colors.text.primary,
    fontWeight: '600',
  },
  statusBadge: {
    backgroundColor: colors.warning.light,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.full,
  },
  statusText: {
    ...typography.label,
    color: colors.warning.DEFAULT,
    fontWeight: '600',
  },
  actions: {
    width: '100%',
    marginTop: spacing[8],
    gap: spacing[3],
  },
  trackButton: {
    borderRadius: borderRadius.lg,
  },
  trackButtonContent: {
    paddingVertical: spacing[2],
  },
  homeButton: {
    borderRadius: borderRadius.lg,
  },
  homeButtonContent: {
    paddingVertical: spacing[2],
  },
});
