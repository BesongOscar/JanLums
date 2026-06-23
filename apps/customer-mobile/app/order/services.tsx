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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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

const CATEGORY_ALL = '__all__';

function getUniqueCategories(services: Service[]): string[] {
  const cats = services.map((s) => s.category);
  return [...new Set(cats)].sort();
}

function SkeletonCard() {
  return (
    <View style={styles.skeletonCard}>
      <ActivityIndicator size="small" color={colors.primary[300]} />
    </View>
  );
}

function EmptyState({ onRefresh }: { onRefresh: () => void }) {
  return (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons name="tshirt-crew-outline" size={64} color={colors.text.tertiary} />
      <Text style={styles.emptyTitle}>No services available</Text>
      <Text style={styles.emptySubtitle}>Services will appear here once added</Text>
      <TouchableOpacity style={styles.retryButton} onPress={onRefresh} activeOpacity={0.7}>
        <MaterialCommunityIcons name="refresh" size={18} color={colors.white} />
        <Text style={styles.retryButtonText}>Refresh</Text>
      </TouchableOpacity>
    </View>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons name="alert-circle-outline" size={64} color={colors.error.DEFAULT} />
      <Text style={styles.emptyTitle}>Something went wrong</Text>
      <Text style={styles.emptySubtitle}>{message}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={onRetry} activeOpacity={0.7}>
        <MaterialCommunityIcons name="refresh" size={18} color={colors.white} />
        <Text style={styles.retryButtonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function ServicesScreen() {
  const insets = useSafeAreaInsets();
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
      result = result.filter((s) => s.category === activeCategory);
    }
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.trim().toLowerCase();
      result = result.filter(
        (s) =>
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
                  <Text style={styles.serviceCategory}>{item.category}</Text>
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
        <View style={[styles.headerContainer, { paddingTop: insets.top + spacing[4] }]}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text.primary} />
            </TouchableOpacity>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>Services</Text>
              <Text style={styles.headerSubtitle}>
                {services?.length ?? 0} services available
              </Text>
            </View>
            {draftCount > 0 && (
              <TouchableOpacity onPress={handleGoToDraft} style={styles.draftBadge}>
                <MaterialCommunityIcons name="clipboard-text" size={20} color={colors.primary[500]} />
                <Text style={styles.draftBadgeText}>{draftCount}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.searchContainer}>
          <MaterialCommunityIcons name="magnify" size={20} color={colors.text.tertiary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search services..."
            placeholderTextColor={colors.text.tertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <MaterialCommunityIcons name="close-circle" size={18} color={colors.text.tertiary} />
            </TouchableOpacity>
          )}
        </View>

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
                const label = cat === CATEGORY_ALL ? 'All' : cat;
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
  }, [
    insets,
    router,
    draftCount,
    handleGoToDraft,
    searchQuery,
    categories,
    activeCategory,
    categoryCounts,
    services,
  ]);

  if (isLoading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top + spacing[4] }]}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Services</Text>
        </View>
        <View style={styles.skeletonList}>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </View>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={[styles.container, { paddingTop: insets.top + spacing[4] }]}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Services</Text>
        </View>
        <ErrorState
          message={error instanceof Error ? error.message : 'Unable to load services'}
          onRetry={() => refetch()}
        />
      </View>
    );
  }

  if (!services || services.length === 0) {
    return (
      <View style={[styles.container, { paddingTop: insets.top + spacing[4] }]}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Services</Text>
        </View>
        <EmptyState onRefresh={() => refetch()} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredServices}
        keyExtractor={(item) => item.id}
        renderItem={renderServiceItem}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="search-off" size={48} color={colors.text.tertiary} />
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing[1],
  },
  headerTextContainer: {
    flex: 1,
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
  draftBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary[50],
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.full,
    gap: spacing[1],
  },
  draftBadgeText: {
    ...typography['label-lg'],
    color: colors.primary[500],
    fontWeight: '700',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    marginHorizontal: spacing[4],
    marginBottom: spacing[3],
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing[3],
    height: 44,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing[2],
    fontSize: 14,
    color: colors.text.primary,
    paddingVertical: 0,
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
  skeletonCard: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing[4],
    marginBottom: spacing[2],
    borderRadius: borderRadius.lg,
    padding: spacing[8],
    justifyContent: 'center',
    alignItems: 'center',
  },
  skeletonList: {
    paddingTop: spacing[4],
    gap: spacing[2],
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
});
