import { useState, useMemo, useCallback } from 'react';
import {
  View,
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Text, Card, Switch } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMyOrders } from '../../src/hooks/useMyOrders';
import { useAnalytics } from '../../src/hooks/useAnalytics';
import { colors } from '../../src/config/colors';
import { spacing, borderRadius } from '../../src/config/spacing';
import { typography } from '../../src/config/typography';
import { formatCurrency, formatRelativeTime } from '../../src/utils/format';
import { getStatusTranslation, getTimelineStatuses } from '../../src/utils/statusMapper';
import { Order } from '../../src/types';

const ACTIVE_EXCLUDE: ReadonlySet<string> = new Set(['completed', 'cancelled']);

function isActiveOrder(order: Order): boolean {
  return !ACTIVE_EXCLUDE.has(order.status);
}

function SkeletonCard() {
  return (
    <View style={styles.skeletonCard}>
      <View style={styles.skeletonRow}>
        <View style={[styles.skeletonBlock, { width: '40%', height: 16 }]} />
        <View style={[styles.skeletonBlock, { width: '30%', height: 24 }]} />
      </View>
      <View style={{ height: spacing[2] }} />
      <View style={styles.skeletonRow}>
        <View style={[styles.skeletonBlock, { width: '25%', height: 14 }]} />
        <View style={[styles.skeletonBlock, { width: '20%', height: 14 }]} />
      </View>
    </View>
  );
}

function SkeletonTimeline() {
  const timelineStatuses = useMemo(() => getTimelineStatuses(), []);
  return (
    <View style={styles.skeletonTimeline}>
      {timelineStatuses.map((_, index) => (
        <View key={index} style={styles.skeletonTimelineRow}>
          <View style={styles.skeletonTimelineDot} />
          {index < timelineStatuses.length - 1 && (
            <View style={styles.skeletonTimelineLine} />
          )}
          <View style={[styles.skeletonBlock, { flex: 1, height: 14, marginLeft: spacing[3] }]} />
        </View>
      ))}
    </View>
  );
}

function EmptyState({ onViewHistory }: { onViewHistory: () => void }) {
  return (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconWrapper}>
        <MaterialCommunityIcons name="package-variant-closed" size={48} color={colors.gray[300]} />
      </View>
      <Text style={styles.emptyTitle}>No active orders</Text>
      <Text style={styles.emptySubtitle}>We&apos;ll show your laundry progress here.</Text>
      <TouchableOpacity
        style={styles.viewHistoryButton}
        onPress={onViewHistory}
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons name="clipboard-list" size={18} color={colors.white} />
        <Text style={styles.viewHistoryButtonText}>View Order History</Text>
      </TouchableOpacity>
    </View>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons name="alert-circle-outline" size={64} color={colors.error.DEFAULT} />
      <Text style={styles.errorTitle}>Unable to load orders</Text>
      <Text style={styles.emptySubtitle}>{message}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={onRetry} activeOpacity={0.7}>
        <MaterialCommunityIcons name="refresh" size={18} color={colors.white} />
        <Text style={styles.retryButtonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function TrackScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const analytics = useAnalytics();
  const [showAll, setShowAll] = useState(false);

  const {
    data: orders,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useMyOrders();

  useFocusEffect(
    useCallback(() => {
      analytics.track({ name: 'track_screen_viewed' });
    }, [analytics])
  );

  const activeOrders = useMemo(() => {
    return (orders ?? []).filter(isActiveOrder);
  }, [orders]);

  const displayOrders = useMemo(() => {
    return showAll ? (orders ?? []) : activeOrders;
  }, [orders, activeOrders, showAll]);

  const activeCount = useMemo(() => activeOrders.length, [activeOrders]);

  const handleOrderPress = useCallback(
    (order: Order) => {
      analytics.track({ name: 'active_order_opened', properties: { orderId: order.id } });
      router.push(`/orders/${order.id}` as any);
    },
    [analytics, router]
  );

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleViewHistory = useCallback(() => {
    router.push('/(tabs)/orders' as any);
  }, [router]);

  const handleScanQr = useCallback(() => {
    router.push('/scan' as any);
  }, [router]);

  const handleToggleShowAll = useCallback(() => {
    setShowAll((prev) => !prev);
  }, []);

  const renderOrderItem = useCallback(
    ({ item }: { item: Order }) => {
      const translation = getStatusTranslation(item.status);
      return (
        <TouchableOpacity onPress={() => handleOrderPress(item)} activeOpacity={0.7}>
          <Card style={styles.orderCard}>
            <Card.Content>
              <View style={styles.orderHeader}>
                <Text style={styles.orderNumber}>
                  Order #JL-{item.id.slice(0, 5).toUpperCase()}
                </Text>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: translation.backgroundColor },
                  ]}
                >
                  <Text style={[styles.statusText, { color: translation.color }]}>
                    {translation.label}
                  </Text>
                </View>
              </View>
              <View style={styles.orderBody}>
                <View style={styles.orderRow}>
                  <MaterialCommunityIcons
                    name="clock-outline"
                    size={14}
                    color={colors.text.tertiary}
                  />
                  <Text style={styles.orderRowText}>
                    Updated {formatRelativeTime(item.updatedAt)}
                  </Text>
                </View>
                <View style={styles.orderRow}>
                  <MaterialCommunityIcons
                    name="currency-usd"
                    size={14}
                    color={colors.text.tertiary}
                  />
                  <Text style={styles.orderRowText}>
                    Total {formatCurrency(item.total)}
                  </Text>
                </View>
              </View>
              <View style={styles.viewDetailsRow}>
                <Text style={styles.viewDetailsText}>View Details</Text>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={18}
                  color={colors.primary[500]}
                />
              </View>
            </Card.Content>
          </Card>
        </TouchableOpacity>
      );
    },
    [handleOrderPress]
  );

  const renderListHeader = useCallback(() => {
    return (
      <View>
        <View style={[styles.headerContainer, { paddingTop: insets.top + spacing[4] }]}>
          <Text style={styles.headerTitle}>Track Orders</Text>
          <Text style={styles.headerSubtitle}>
            {activeCount > 0
              ? `${activeCount} active ${activeCount === 1 ? 'order' : 'orders'}`
              : 'No active orders'}
          </Text>
          <TouchableOpacity style={styles.scanQrButton} onPress={handleScanQr} activeOpacity={0.7}>
            <MaterialCommunityIcons name="qrcode-scan" size={16} color={colors.white} />
            <Text style={styles.scanQrButtonText}>Scan QR</Text>
          </TouchableOpacity>
        </View>

        {activeCount > 0 && (
          <View style={styles.showAllRow}>
            <Text style={styles.showAllLabel}>
              {showAll ? 'Showing all orders' : 'Showing active orders only'}
            </Text>
            <View style={styles.showAllToggle}>
              <Text style={styles.showAllToggleLabel}>Show all</Text>
              <Switch
                value={showAll}
                onValueChange={handleToggleShowAll}
                color={colors.primary[500]}
              />
            </View>
          </View>
        )}

        {activeCount > 0 && (
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={handleRefresh}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="refresh" size={16} color={colors.primary[500]} />
            <Text style={styles.refreshButtonLabel}>Refresh</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }, [insets, activeCount, showAll, handleToggleShowAll, handleRefresh]);

  if (isLoading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top + spacing[4] }]}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Track Orders</Text>
        </View>
        <View style={styles.skeletonList}>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonTimeline />
        </View>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={[styles.container, { paddingTop: insets.top + spacing[4] }]}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Track Orders</Text>
        </View>
        <ErrorState
          message={error instanceof Error ? error.message : 'Something went wrong'}
          onRetry={handleRefresh}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={displayOrders}
        keyExtractor={(item) => item.id}
        renderItem={renderOrderItem}
        ListHeaderComponent={renderListHeader}
        ListEmptyComponent={
          <EmptyState onViewHistory={handleViewHistory} />
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={handleRefresh}
            tintColor={colors.primary[500]}
            colors={[colors.primary[500]]}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerContainer: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[3],
  },
  headerTitle: {
    ...typography['heading-lg'],
    color: colors.text.primary,
  },
  headerSubtitle: {
    ...typography.body,
    color: colors.text.secondary,
    marginTop: spacing[1],
  },
  showAllRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[3],
  },
  showAllLabel: {
    ...typography['body-sm'],
    color: colors.text.secondary,
  },
  showAllToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  showAllToggleLabel: {
    ...typography['body-sm'],
    color: colors.text.secondary,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginRight: spacing[4],
    marginBottom: spacing[3],
    gap: spacing[1],
  },
  refreshButtonLabel: {
    ...typography['body-sm'],
    color: colors.primary[500],
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: spacing[8],
  },
  orderCard: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing[4],
    marginBottom: spacing[3],
    borderRadius: borderRadius.lg,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[3],
  },
  orderNumber: {
    ...typography['label-lg'],
    color: colors.text.primary,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.full,
  },
  statusText: {
    ...typography.label,
    fontWeight: '600',
  },
  orderBody: {
    gap: spacing[1],
    marginBottom: spacing[2],
  },
  orderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  orderRowText: {
    ...typography['body-sm'],
    color: colors.text.secondary,
  },
  viewDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: spacing[1],
    paddingTop: spacing[2],
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  viewDetailsText: {
    ...typography['body-sm'],
    color: colors.primary[500],
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: spacing[12],
    paddingHorizontal: spacing[8],
  },
  emptyIconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  emptyTitle: {
    ...typography.heading,
    color: colors.text.primary,
    marginBottom: spacing[2],
  },
  emptySubtitle: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  viewHistoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary[500],
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.full,
    marginTop: spacing[6],
    gap: spacing[2],
  },
  viewHistoryButtonText: {
    ...typography.button,
    color: colors.white,
  },
  errorTitle: {
    ...typography.heading,
    color: colors.text.primary,
    marginTop: spacing[4],
    marginBottom: spacing[2],
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
  skeletonCard: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing[4],
    marginBottom: spacing[3],
    borderRadius: borderRadius.lg,
    padding: spacing[4],
  },
  skeletonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skeletonBlock: {
    backgroundColor: colors.gray[100],
    borderRadius: borderRadius.sm,
  },
  skeletonList: {
    paddingTop: spacing[4],
    gap: spacing[2],
  },
  scanQrButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary[500],
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.full,
    gap: spacing[1],
    marginTop: spacing[3],
  },
  scanQrButtonText: {
    ...typography.button,
    color: colors.white,
  },
  skeletonTimeline: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing[4],
    borderRadius: borderRadius.lg,
    padding: spacing[4],
  },
  skeletonTimelineRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    minHeight: 36,
  },
  skeletonTimelineDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.gray[100],
  },
  skeletonTimelineLine: {
    position: 'absolute',
    left: 9,
    top: 20,
    width: 2,
    height: 28,
    backgroundColor: colors.gray[100],
  },
});
