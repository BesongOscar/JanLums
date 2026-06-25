import { useEffect } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useOrderDetails } from '../../src/hooks/useOrderDetails';
import { useAnalytics } from '../../src/hooks/useAnalytics';
import { OrderTimeline } from '../../src/components/features/OrderTimeline';
import { colors } from '../../src/config/colors';
import { spacing, borderRadius } from '../../src/config/spacing';
import { typography } from '../../src/config/typography';
import { formatCurrency, formatDate, formatOrderNumber } from '../../src/utils/format';
import { getStatusTranslation } from '../../src/utils/statusMapper';
import { getOrderStatusDescription } from '../../src/utils/orderStatusDescriptions';
import { OrderItem } from '../../src/types';

function SkeletonSection() {
  return (
    <View style={styles.skeletonSection}>
      <View style={[styles.skeletonBlock, { width: '35%', height: 16 }]} />
      <View style={{ height: spacing[3] }} />
      <View style={[styles.skeletonBlock, { width: '60%', height: 14 }]} />
      <View style={{ height: spacing[2] }} />
      <View style={[styles.skeletonBlock, { width: '45%', height: 14 }]} />
      <View style={{ height: spacing[2] }} />
      <View style={[styles.skeletonBlock, { width: '50%', height: 14 }]} />
    </View>
  );
}

function DetailRow({ label, value, isHighlighted }: { label: string; value: string; isHighlighted?: boolean }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={[styles.detailValue, isHighlighted && styles.highlightedValue]}>
        {value}
      </Text>
    </View>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card style={styles.sectionCard}>
      <Card.Content>
        <Text style={styles.sectionTitle}>{title}</Text>
        {children}
      </Card.Content>
    </Card>
  );
}

export default function OrderDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const analytics = useAnalytics();

  const {
    data: order,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useOrderDetails(id ?? '');

  useEffect(() => {
    if (order) {
      analytics.track({ name: 'order_detail_opened', properties: { orderId: order.id } });
      analytics.track({ name: 'order_status_viewed', properties: { orderId: order.id, status: order.status } });
    }
  }, [order, analytics]);

  if (isLoading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.headerBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerBarTitle}>Order Details</Text>
          <View style={{ width: 40 }} />
        </View>
        <ScrollView style={styles.scrollContent} contentContainerStyle={styles.skeletonContent}>
          <SkeletonSection />
          <View style={{ height: spacing[4] }} />
          <SkeletonSection />
          <View style={{ height: spacing[4] }} />
          <SkeletonSection />
          <View style={{ height: spacing[4] }} />
          <SkeletonSection />
        </ScrollView>
      </View>
    );
  }

  if (isError || !order) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.headerBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerBarTitle}>Order Details</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.errorContainer}>
          <MaterialCommunityIcons name="alert-circle-outline" size={64} color={colors.error.DEFAULT} />
          <Text style={styles.errorTitle}>Unable to load order</Text>
          <Text style={styles.errorSubtext}>
            {error instanceof Error ? error.message : 'Something went wrong'}
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => refetch()} activeOpacity={0.7}>
            <MaterialCommunityIcons name="refresh" size={18} color={colors.white} />
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const statusTranslation = getStatusTranslation(order.status);
  const itemCount = order.items?.length ?? 0;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerBarTitle}>Order Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => refetch()}
            tintColor={colors.primary[500]}
          />
        }
      >
        <View style={styles.headerContent}>
          <View style={styles.headerRow}>
            <Text style={styles.orderNumber}>
              {formatOrderNumber(order.id)}
            </Text>
            <View style={[styles.statusBadge, { backgroundColor: statusTranslation.backgroundColor }]}>
              <Text style={[styles.statusText, { color: statusTranslation.color }]}>
                {statusTranslation.label}
              </Text>
            </View>
          </View>
          <Text style={styles.orderDate}>{formatDate(order.createdAt, 'long')}</Text>
        </View>

        <SectionCard title="Tracking">
          <View style={styles.trackingSection}>
            <View style={styles.trackingStatusRow}>
              <View style={[styles.trackingStatusDot, { backgroundColor: statusTranslation.backgroundColor }]}>
                <MaterialCommunityIcons
                  name={statusTranslation.icon as any}
                  size={16}
                  color={statusTranslation.color}
                />
              </View>
              <View style={styles.trackingStatusInfo}>
                <Text style={styles.trackingStatusLabel}>{statusTranslation.label}</Text>
                <Text style={styles.trackingStatusDescription}>
                  {getOrderStatusDescription(order.status)}
                </Text>
              </View>
            </View>
          </View>
          <View style={{ height: spacing[3] }} />
          <OrderTimeline currentStatus={order.status} />
        </SectionCard>

        <SectionCard title="Pricing">
          <DetailRow label="Subtotal" value={formatCurrency(order.subtotal)} />
          <DetailRow label="Tax" value={formatCurrency(order.tax)} />
          {order.discount > 0 && (
            <DetailRow label="Discount" value={`-${formatCurrency(order.discount)}`} />
          )}
          <View style={styles.divider} />
          <DetailRow label="Total" value={formatCurrency(order.total)} isHighlighted />
        </SectionCard>

        {itemCount > 0 && (
          <SectionCard title={`Items (${itemCount})`}>
            {order.items?.map((item: OrderItem, index: number) => (
              <View key={item.id || index}>
                <View style={styles.itemRow}>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{item.garmentType}</Text>
                    {item.fabricType && (
                      <Text style={styles.itemMeta}>{item.fabricType}</Text>
                    )}
                  </View>
                  <Text style={styles.itemQty}>x{item.quantity}</Text>
                  <Text style={styles.itemPrice}>{formatCurrency(item.unitPrice)}</Text>
                  <Text style={styles.itemTotal}>{formatCurrency(item.totalPrice)}</Text>
                </View>
                {index < (order.items?.length ?? 0) - 1 && <View style={styles.itemDivider} />}
              </View>
            ))}
          </SectionCard>
        )}

        {order.branch && (
          <SectionCard title="Branch">
            <View style={styles.branchRow}>
              <MaterialCommunityIcons name="store" size={20} color={colors.primary[500]} />
              <View style={styles.branchInfo}>
                <Text style={styles.branchName}>{order.branch.name}</Text>
                {order.branch.address && (
                  <Text style={styles.branchAddress}>{order.branch.address}</Text>
                )}
              </View>
            </View>
          </SectionCard>
        )}

        <View style={{ height: spacing[8] }} />
      </ScrollView>
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
  scrollContent: {
    flex: 1,
  },
  headerContent: {
    padding: spacing[4],
    paddingBottom: spacing[3],
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  orderNumber: {
    ...typography['heading-lg'],
    color: colors.text.primary,
  },
  orderDate: {
    ...typography.body,
    color: colors.text.secondary,
  },
  statusBadge: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.full,
  },
  statusText: {
    ...typography.label,
    fontWeight: '600',
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
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing[1],
  },
  detailLabel: {
    ...typography.body,
    color: colors.text.secondary,
  },
  detailValue: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '500',
  },
  highlightedValue: {
    ...typography['label-lg'],
    color: colors.primary[500],
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing[2],
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[2],
    gap: spacing[2],
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '500',
  },
  itemMeta: {
    ...typography.caption,
    color: colors.text.tertiary,
    marginTop: 2,
  },
  itemQty: {
    ...typography.body,
    color: colors.text.secondary,
    minWidth: 28,
    textAlign: 'center',
  },
  itemPrice: {
    ...typography['body-sm'],
    color: colors.text.secondary,
    minWidth: 60,
    textAlign: 'right',
  },
  itemTotal: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '500',
    minWidth: 60,
    textAlign: 'right',
  },
  itemDivider: {
    height: 1,
    backgroundColor: colors.divider,
  },
  branchRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[3],
  },
  branchInfo: {
    flex: 1,
  },
  branchName: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '500',
  },
  branchAddress: {
    ...typography['body-sm'],
    color: colors.text.secondary,
    marginTop: 2,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing[8],
  },
  errorTitle: {
    ...typography.heading,
    color: colors.text.primary,
    marginTop: spacing[4],
  },
  errorSubtext: {
    ...typography.body,
    color: colors.text.secondary,
    marginTop: spacing[2],
    textAlign: 'center',
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary[500],
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.full,
    marginTop: spacing[5],
    gap: spacing[2],
  },
  retryButtonText: {
    ...typography.button,
    color: colors.white,
  },
  skeletonSection: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing[4],
    borderRadius: borderRadius.lg,
    padding: spacing[4],
  },
  skeletonBlock: {
    backgroundColor: colors.gray[100],
    borderRadius: borderRadius.sm,
  },
  trackingSection: {
    gap: spacing[1],
  },
  trackingStatusRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[3],
  },
  trackingStatusDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trackingStatusInfo: {
    flex: 1,
  },
  trackingStatusLabel: {
    ...typography['label-lg'],
    color: colors.text.primary,
    fontWeight: '600',
  },
  trackingStatusDescription: {
    ...typography['body-sm'],
    color: colors.text.secondary,
    marginTop: spacing[1],
    lineHeight: 18,
  },
  skeletonContent: {
    paddingTop: spacing[4],
    paddingBottom: spacing[8],
  },
});
