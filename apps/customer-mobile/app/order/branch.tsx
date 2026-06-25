import { useCallback } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { Text, Card, ActivityIndicator } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useBranches } from '../../src/hooks/useBranches';
import { useOrderDraftStore } from '../../src/stores/orderDraftStore';
import { colors } from '../../src/config/colors';
import { spacing, borderRadius } from '../../src/config/spacing';
import { typography } from '../../src/config/typography';
import { Branch } from '../../src/types';

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
      <MaterialCommunityIcons name="store-off-outline" size={64} color={colors.text.tertiary} />
      <Text style={styles.emptyTitle}>No branches available</Text>
      <Text style={styles.emptySubtitle}>Branches will appear here once added</Text>
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

export default function BranchSelectionScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const selectedBranchId = useOrderDraftStore((s) => s.branchId);
  const setBranch = useOrderDraftStore((s) => s.setBranch);

  const { data: branches, isLoading, isError, error, refetch, isRefetching } = useBranches();

  const handleSelectBranch = useCallback(
    (branch: Branch) => {
      setBranch(branch.id, branch.name);
      router.back();
    },
    [setBranch, router]
  );

  const activeBranches = branches?.filter((b: Branch) => b.isActive) ?? [];

  const renderBranchItem = useCallback(
    ({ item }: { item: Branch }) => {
      const isSelected = selectedBranchId === item.id;
      return (
        <TouchableOpacity
          onPress={() => handleSelectBranch(item)}
          activeOpacity={0.7}
          disabled={isSelected}
        >
          <Card
            style={[
              styles.branchCard,
              isSelected && styles.branchCardSelected,
            ]}
          >
            <Card.Content style={styles.branchContent}>
              <View style={styles.branchIcon}>
                <MaterialCommunityIcons name="store" size={28} color={colors.primary[500]} />
              </View>
              <View style={styles.branchInfo}>
                <Text style={styles.branchName}>{item.name}</Text>
                {item.address && (
                  <Text style={styles.branchAddress} numberOfLines={1}>
                    {item.address}
                  </Text>
                )}
                {(item.city || item.phone) && (
                  <View style={styles.branchMeta}>
                    {item.city && (
                      <View style={styles.branchMetaItem}>
                        <MaterialCommunityIcons name="map-marker" size={14} color={colors.text.tertiary} />
                        <Text style={styles.branchMetaText}>{item.city}</Text>
                      </View>
                    )}
                    {item.phone && (
                      <View style={styles.branchMetaItem}>
                        <MaterialCommunityIcons name="phone" size={14} color={colors.text.tertiary} />
                        <Text style={styles.branchMetaText}>{item.phone}</Text>
                      </View>
                    )}
                  </View>
                )}
              </View>
              {isSelected && (
                <MaterialCommunityIcons name="check-circle" size={24} color={colors.primary[500]} />
              )}
            </Card.Content>
          </Card>
        </TouchableOpacity>
      );
    },
    [selectedBranchId, handleSelectBranch]
  );

  const renderHeader = useCallback(() => {
    return (
      <View style={[styles.headerContainer, { paddingTop: insets.top + spacing[4] }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Select Branch</Text>
            <Text style={styles.headerSubtitle}>
              {activeBranches.length} {activeBranches.length === 1 ? 'branch' : 'branches'} available
            </Text>
          </View>
        </View>
      </View>
    );
  }, [insets, router, activeBranches.length]);

  if (isLoading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top + spacing[4] }]}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Select Branch</Text>
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
          <Text style={styles.headerTitle}>Select Branch</Text>
        </View>
        <ErrorState
          message={error instanceof Error ? error.message : 'Unable to load branches'}
          onRetry={() => refetch()}
        />
      </View>
    );
  }

  if (activeBranches.length === 0) {
    return (
      <View style={[styles.container, { paddingTop: insets.top + spacing[4] }]}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Select Branch</Text>
        </View>
        <EmptyState onRefresh={() => refetch()} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={activeBranches}
        keyExtractor={(item) => item.id}
        renderItem={renderBranchItem}
        ListHeaderComponent={renderHeader}
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
  headerTitle: {
    ...typography['heading-lg'],
    color: colors.text.primary,
  },
  headerSubtitle: {
    ...typography.body,
    color: colors.text.secondary,
    marginTop: spacing[1],
  },
  listContent: {
    paddingBottom: spacing[8],
  },
  branchCard: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing[4],
    marginBottom: spacing[2],
    borderRadius: borderRadius.lg,
  },
  branchCardSelected: {
    borderWidth: 2,
    borderColor: colors.primary[500],
  },
  branchContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  branchIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing[3],
  },
  branchInfo: {
    flex: 1,
  },
  branchName: {
    ...typography['label-lg'],
    color: colors.text.primary,
    fontWeight: '600',
  },
  branchAddress: {
    ...typography['body-sm'],
    color: colors.text.secondary,
    marginTop: 2,
  },
  branchMeta: {
    flexDirection: 'row',
    gap: spacing[3],
    marginTop: spacing[1],
  },
  branchMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
  },
  branchMetaText: {
    ...typography.caption,
    color: colors.text.tertiary,
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
