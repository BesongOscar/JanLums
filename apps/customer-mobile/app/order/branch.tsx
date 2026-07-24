import { useCallback } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { Text, Card } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useBranches } from '../../src/hooks/useBranches';
import { useOrderDraftStore } from '../../src/stores/orderDraftStore';
import { colors } from '../../src/config/colors';
import { spacing, borderRadius } from '../../src/config/spacing';
import { typography } from '../../src/config/typography';
import { Branch } from '../../src/types';
import { ScreenHeader } from '../../src/components/common/ScreenHeader';
import { StepIndicator } from '../../src/components/common/StepIndicator';
import { SkeletonList } from '../../src/components/common/SkeletonLoader';
import { ErrorState, EmptyState } from '../../src/components/common/DataState';

const ORDER_STEPS = [
  { key: 'services', label: 'Services' },
  { key: 'review', label: 'Review' },
  { key: 'payment', label: 'Payment' },
];

export default function BranchSelectionScreen() {
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

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ScreenHeader title="Select Branch" subtitle="Choose a service location" />
        <StepIndicator steps={ORDER_STEPS} currentStep="review" />
        <SkeletonList count={3} lines={2} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.container}>
        <ScreenHeader title="Select Branch" />
        <StepIndicator steps={ORDER_STEPS} currentStep="review" />
        <ErrorState
          message={error instanceof Error ? error.message : 'Unable to load branches'}
          onRetry={() => refetch()}
        />
      </View>
    );
  }

  if (activeBranches.length === 0) {
    return (
      <View style={styles.container}>
        <ScreenHeader title="Select Branch" />
        <StepIndicator steps={ORDER_STEPS} currentStep="review" />
        <EmptyState
          icon="store-off-outline"
          title="No branches available"
          message="Branches will appear here once added"
          actionLabel="Refresh"
          onAction={() => refetch()}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScreenHeader title="Select Branch" subtitle="Choose a service location" />
      <StepIndicator steps={ORDER_STEPS} currentStep="review" />
      <FlatList
        data={activeBranches}
        keyExtractor={(item) => item.id}
        renderItem={renderBranchItem}
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
  listContent: {
    paddingTop: spacing[3],
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
});
