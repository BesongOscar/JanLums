import { useState, useMemo, useCallback } from 'react';
import {
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { Text, Card, Chip, ActivityIndicator } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useServices } from '../../src/hooks/useServices';
import { useAnalytics } from '../../src/hooks/useAnalytics';
import { useOrderDraftStore } from '../../src/stores/orderDraftStore';
import { useDebounce } from '../../src/hooks/useDebounce';
import { colors } from '../../src/config/colors';
import { spacing, borderRadius } from '../../src/config/spacing';
import { typography } from '../../src/config/typography';
import { formatCurrency } from '../../src/utils/format';
import { Service } from '../../src/types';
import { ScreenHeader } from '../../src/components/common/ScreenHeader';
import { StepIndicator } from '../../src/components/common/StepIndicator';
import { SearchFilterBar } from '../../src/components/common/SearchFilterBar';
import { SkeletonList } from '../../src/components/common/SkeletonLoader';
import { ErrorState, EmptyState } from '../../src/components/common/DataState';

const CATEGORY_ALL = '__all__';
const ORDER_STEPS = [
  { key: 'services', label: 'Services' },
  { key: 'review', label: 'Review' },
  { key: 'payment', label: 'Payment' },
];

function getUniqueCategories(services: Service[]): string[] {
  const cats = services.map((s) => s.category);
  return [...new Set(cats)].sort();
}

function formatCategoryLabel(category: string): string {
  return category
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function ServicesScreen() {
  const router = useRouter();
  const analytics = useAnalytics();
  const draftCount = useOrderDraftStore((s) => s.getItemCount());

  const { data: services, isLoading, isError, error, refetch, isRefetching } = useServices();

  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);
  const [activeCategory, setActiveCategory] = useState(CATEGORY_ALL);

  const categories = useMemo(() => {
    if (!services) return [];
    return getUniqueCategories(services);
  }, [services]);

  const filteredServices = useMemo(() => {
    if (!services) return [];
    let result = services;
    if (activeCategory !== CATEGORY_ALL) {
      result = result.filter((s: Service) => s.category === activeCategory);
    }
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.trim().toLowerCase();
      result = result.filter(
        (s: Service) =>
          s.name.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q)
      );
    }
    return result;
  }, [services, activeCategory, debouncedSearch]);

  const categoryCounts = useMemo(() => {
    if (!services) return {};
    const counts: Record<string, number> = { [CATEGORY_ALL]: services.length };
    for (const s of services) {
      counts[s.category] = (counts[s.category] || 0) + 1;
    }
    return counts;
  }, [services]);

  const handleServicePress = useCallback(
    (service: Service) => {
      analytics.track({
        name: 'service_viewed',
        properties: { serviceId: service.id, serviceName: service.name },
      });
      router.push(`/order/service/${service.id}` as any);
    },
    [analytics, router]
  );

  const handleGoToDraft = useCallback(() => {
    analytics.track({ name: 'order_review_opened' });
    router.push('/order/review' as any);
  }, [analytics, router]);

  const renderServiceItem = useCallback(
    ({ item }: { item: Service }) => {
      const iconName =
        item.category === 'wash_fold' || item.category === 'Wash & Fold'
          ? 'washing-machine'
          : item.category === 'dry_cleaning' || item.category === 'Dry Cleaning'
            ? 'chemical-weapon'
            : item.category === 'ironing' || item.category === 'Ironing'
              ? 'iron'
              : item.category === 'express' || item.category === 'Express'
                ? 'lightning-bolt'
                : 'tshirt-crew';

      return (
        <TouchableOpacity onPress={() => handleServicePress(item)} activeOpacity={0.7}>
          <Card style={styles.serviceCard}>
            <Card.Content style={styles.serviceContent}>
              <View style={styles.serviceIcon}>
                <MaterialCommunityIcons name={iconName as any} size={32} color={colors.primary[500]} />
              </View>
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceName}>{item.name}</Text>
                {item.description && (
                  <Text style={styles.serviceDescription} numberOfLines={2}>
                    {item.description}
                  </Text>
                )}
                <View style={styles.serviceMeta}>
                  <Text style={styles.servicePrice}>{formatCurrency(item.basePrice)}</Text>
                  <Text style={styles.serviceCategory}>{formatCategoryLabel(item.category)}</Text>
                </View>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={20} color={colors.text.tertiary} />
            </Card.Content>
          </Card>
        </TouchableOpacity>
      );
    },
    [handleServicePress]
  );

  const renderHeader = useCallback(() => {
    return (
      <View>
        <SearchFilterBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search services..."
        />

        {categories.length > 0 && (
          <View style={styles.filtersRow}>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={[CATEGORY_ALL, ...categories]}
              keyExtractor={(c) => c}
              contentContainerStyle={styles.filtersContent}
              renderItem={({ item: cat }) => {
                const isActive = activeCategory === cat;
                const label = cat === CATEGORY_ALL ? 'All' : formatCategoryLabel(cat);
                const count = categoryCounts[cat] ?? 0;
                return (
                  <Chip
                    selected={isActive}
                    onPress={() => setActiveCategory(cat)}
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
                    {label} ({count})
                  </Chip>
                );
              }}
            />
          </View>
        )}
      </View>
    );
  }, [searchQuery, categories, activeCategory, categoryCounts]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ScreenHeader title="Services" subtitle="Select laundry services" showBack />
        <SkeletonList count={4} lines={2} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.container}>
        <ScreenHeader title="Services" showBack onBack={() => router.back()} />
        <ErrorState
          message={error instanceof Error ? error.message : 'Unable to load services'}
          onRetry={() => refetch()}
        />
      </View>
    );
  }

  if (!services || services.length === 0) {
    return (
      <View style={styles.container}>
        <ScreenHeader title="Services" showBack />
        <EmptyState
          icon="tshirt-crew-outline"
          title="No services available"
          message="Services will appear here once added"
          actionLabel="Refresh"
          onAction={() => refetch()}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScreenHeader title="Services" subtitle="Select laundry services" showBack={false} />
      <StepIndicator steps={ORDER_STEPS} currentStep="services" />
      <FlatList
        data={filteredServices}
        keyExtractor={(item) => item.id}
        renderItem={renderServiceItem}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="package-variant-closed" size={48} color={colors.text.tertiary} />
            <Text style={styles.emptyTitle}>No results</Text>
            <Text style={styles.emptySubtitle}>Try a different search or filter</Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => refetch()}
            tintColor={colors.primary[500]}
          />
        }
      />

      {draftCount > 0 && (
        <TouchableOpacity onPress={handleGoToDraft} style={styles.fab} activeOpacity={0.85} accessibilityLabel="View order draft">
          <MaterialCommunityIcons name="clipboard-text" size={24} color={colors.white} />
          <Text style={styles.fabText}>{draftCount}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
  serviceCard: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing[4],
    marginBottom: spacing[2],
    borderRadius: borderRadius.lg,
  },
  serviceContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing[3],
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    ...typography['label-lg'],
    color: colors.text.primary,
    fontWeight: '600',
  },
  serviceDescription: {
    ...typography['body-sm'],
    color: colors.text.secondary,
    marginTop: 2,
  },
  serviceMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing[1],
    gap: spacing[2],
  },
  servicePrice: {
    ...typography['label-lg'],
    color: colors.primary[500],
    fontWeight: '600',
  },
  serviceCategory: {
    ...typography.caption,
    color: colors.text.tertiary,
    backgroundColor: colors.gray[100],
    paddingHorizontal: spacing[2],
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: spacing[12],
    paddingHorizontal: spacing[8],
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
  fab: {
    position: 'absolute',
    right: spacing[4],
    bottom: spacing[6],
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary[500],
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderRadius: borderRadius.full,
    gap: spacing[2],
    elevation: 6,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fabText: {
    ...typography['label-lg'],
    color: colors.white,
    fontWeight: '700',
  },
});
