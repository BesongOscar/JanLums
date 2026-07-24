import { useState, useMemo, useCallback, useEffect } from 'react';
import {
  View,
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Text, Card, Chip } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMyOrders } from '../../src/hooks/useMyOrders';
import { useAnalytics } from '../../src/hooks/useAnalytics';
import { useDebounce } from '../../src/hooks/useDebounce';
import { colors } from '../../src/config/colors';
import { spacing, borderRadius } from '../../src/config/spacing';
import { typography } from '../../src/config/typography';
import { formatCurrency, formatDate, formatOrderNumber } from '../../src/utils/format';
import { getStatusTranslation } from '../../src/utils/statusMapper';
import { FILTER_OPTIONS, FILTER_STATUS_MAP, FilterKey } from '../../src/utils/orderFilters';
import { Order } from '../../src/types';
import { SkeletonList } from '../../src/components/common/SkeletonLoader';
import { SearchFilterBar } from '../../src/components/common/SearchFilterBar';
import { ErrorState, EmptyState } from '../../src/components/common/DataState';

export default function OrdersScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const analytics = useAnalytics();

  const {
    data: orders,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useMyOrders();

  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');

  useFocusEffect(
    useCallback(() => {
      analytics.track({ name: 'order_viewed' });
    }, [analytics])
  );

  const statusCounts = useMemo(() => {
    const list = orders ?? [];
    const counts: Record<FilterKey, number> = {
      all: list.length,
      pending: 0,
      in_progress: 0,
      ready: 0,
      completed: 0,
      cancelled: 0,
    };
    for (const order of list) {
      const status = order.status;
      for (const [key, statuses] of Object.entries(FILTER_STATUS_MAP)) {
        if (statuses.includes(status)) {
          counts[key as FilterKey]++;
        }
      }
    }
    return counts;
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const list = orders ?? [];
    const allowedStatuses = FILTER_STATUS_MAP[activeFilter];
    return list.filter((order: Order) => allowedStatuses.includes(order.status));
  }, [orders, activeFilter]);

  const searchedOrders = useMemo(() => {
    if (!debouncedSearch.trim()) return filteredOrders;
    const query = debouncedSearch.trim().toLowerCase();
    return filteredOrders.filter((order: Order) => {
      const orderNumber = `#jl-${order.id.slice(0, 5).toLowerCase()}`;
      const translation = getStatusTranslation(order.status);
      const statusLabel = translation.label.toLowerCase();
      return orderNumber.includes(query) || statusLabel.includes(query);
    });
  }, [filteredOrders, debouncedSearch]);

  const handleOrderPress = useCallback(
    (order: Order) => {
      analytics.track({ name: 'order_detail_opened', properties: { orderId: order.id } });
      router.push(`/orders/${order.id}` as any);
    },
    [analytics, router]
  );

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleScanAnotherOrder = useCallback(() => {
    router.push('/scan' as any);
  }, [router]);

  const handleSearchChange = useCallback((text: string) => {
    setSearchQuery(text);
  }, []);

  const renderOrderItem = useCallback(
    ({ item }: { item: Order }) => {
      const statusTranslation = getStatusTranslation(item.status);
      const itemCount = item.items?.length ?? 0;

      return (
        <TouchableOpacity
          onPress={() => handleOrderPress(item)}
          activeOpacity={0.7}
        >
          <Card style={styles.orderCard}>
            <Card.Content>
              <View style={styles.orderHeader}>
                <Text style={styles.orderNumber}>
                  {formatOrderNumber(item.id)}
                </Text>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: statusTranslation.backgroundColor },
                  ]}
                >
                  <Text style={[styles.statusText, { color: statusTranslation.color }]}>
                    {statusTranslation.label}
                  </Text>
                </View>
              </View>
              <View style={styles.orderBody}>
                <View style={styles.orderDetailRow}>
                  <Text style={styles.orderDetailLabel}>Total</Text>
                  <Text style={styles.orderDetailValue}>
                    {formatCurrency(item.total)}
                  </Text>
                </View>
                <View style={styles.orderDetailRow}>
                  <Text style={styles.orderDetailLabel}>Items</Text>
                  <Text style={styles.orderDetailValue}>
                    {itemCount} {itemCount === 1 ? 'item' : 'items'}
                  </Text>
                </View>
                <View style={styles.orderDetailRow}>
                  <Text style={styles.orderDetailLabel}>Date</Text>
                  <Text style={styles.orderDetailValue}>
                    {formatDate(item.createdAt)}
                  </Text>
                </View>
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
          <Text style={styles.headerTitle} accessibilityRole="header">My Orders</Text>
          <Text style={styles.headerSubtitle}>
            {statusCounts.all} {statusCounts.all === 1 ? 'order' : 'orders'}
          </Text>
        </View>

        <SearchFilterBar
          value={searchQuery}
          onChangeText={handleSearchChange}
          placeholder="Search orders..."
        />

        <View style={styles.filtersRow}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={FILTER_OPTIONS}
            keyExtractor={(f) => f.key}
            contentContainerStyle={styles.filtersContent}
            renderItem={({ item: filter }) => {
              const isActive = activeFilter === filter.key;
              const count = statusCounts[filter.key];
              return (
                <Chip
                  selected={isActive}
                  onPress={() => setActiveFilter(filter.key)}
                  style={[
                    styles.filterChip,
                    isActive && { backgroundColor: colors.primary[500] },
                  ]}
                  textStyle={[
                    styles.filterChipText,
                    isActive && { color: colors.white },
                  ]}
                  compact
                >
                  {filter.label} ({count})
                </Chip>
              );
            }}
          />
        </View>
      </View>
    );
  }, [insets, statusCounts, searchQuery, handleSearchChange, activeFilter]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={[styles.headerContainer, { paddingTop: insets.top + spacing[4] }]}>
          <Text style={styles.headerTitle}>My Orders</Text>
        </View>
        <SkeletonList count={4} lines={3} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.container}>
        <View style={[styles.headerContainer, { paddingTop: insets.top + spacing[4] }]}>
          <Text style={styles.headerTitle}>My Orders</Text>
        </View>
        <ErrorState
          title="Something went wrong"
          message={error instanceof Error ? error.message : 'Unable to load orders'}
          onRetry={handleRefresh}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={searchedOrders}
        keyExtractor={(item) => item.id}
        renderItem={renderOrderItem}
        ListHeaderComponent={renderListHeader}
        ListEmptyComponent={
          <EmptyState
            icon="clipboard-text-outline"
            title="No orders yet"
            message="Your laundry orders will appear here"
            actionLabel="Refresh"
            onAction={handleRefresh}
          />
        }
        ListFooterComponent={
          searchedOrders.length > 0 ? (
            <TouchableOpacity
              style={styles.scanAnotherButton}
              onPress={handleScanAnotherOrder}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons name="qrcode-scan" size={18} color={colors.primary[500]} />
              <Text style={styles.scanAnotherText}>Scan Another Order</Text>
            </TouchableOpacity>
          ) : null
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
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/order/services' as any)}
        activeOpacity={0.85}
        accessibilityLabel="Create new order"
        accessibilityRole="button"
      >
        <MaterialCommunityIcons name="plus" size={28} color={colors.white} />
      </TouchableOpacity>
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
  filtersRow: {
    marginBottom: spacing[2],
  },
  filtersContent: {
    paddingHorizontal: spacing[4],
    gap: spacing[2],
  },
  filterChip: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: borderRadius.full,
  },
  filterChipText: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  listContent: {
    paddingBottom: spacing[8],
  },
  orderCard: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing[4],
    marginBottom: spacing[2],
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
  },
  orderDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  orderDetailLabel: {
    ...typography['body-sm'],
    color: colors.text.secondary,
  },
  orderDetailValue: {
    ...typography['body-sm'],
    color: colors.text.primary,
    fontWeight: '500',
  },
  scanAnotherButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    paddingVertical: spacing[4],
    marginTop: spacing[2],
  },
  scanAnotherText: {
    ...typography.button,
    color: colors.primary[500],
  },
  fab: {
    position: 'absolute',
    right: spacing[4],
    bottom: spacing[6],
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
