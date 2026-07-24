import { useEffect } from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import {
  Text,
  Card,
  ProgressBar,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLoyalty } from '../../../src/hooks/useLoyalty';
import { useAnalytics } from '../../../src/hooks/useAnalytics';
import { formatCurrency } from '../../../src/utils/format';
import { colors } from '../../../src/config/colors';
import { spacing, borderRadius } from '../../../src/config/spacing';
import { typography } from '../../../src/config/typography';
import { ScreenHeader } from '../../../src/components/common/ScreenHeader';
import { SkeletonCard } from '../../../src/components/common/SkeletonLoader';
import { ErrorState } from '../../../src/components/common/DataState';

const TIER_CONFIG: Record<string, { label: string; icon: string; color: string; bg: string }> = {
  bronze: { label: 'Bronze', icon: 'shield-star-outline', color: '#CD7F32', bg: '#FFF3E0' },
  silver: { label: 'Silver', icon: 'shield-star', color: '#9CA3AF', bg: '#F3F4F6' },
  gold: { label: 'Gold', icon: 'crown-outline', color: '#F59E0B', bg: '#FEF3C7' },
  platinum: { label: 'Platinum', icon: 'crown', color: '#6366F1', bg: '#EEF2FF' },
};

const TIER_THRESHOLDS = [
  { tier: 'bronze', minSpend: 0 },
  { tier: 'silver', minSpend: 50000 },
  { tier: 'gold', minSpend: 150000 },
  { tier: 'platinum', minSpend: 500000 },
];

export default function LoyaltyScreen() {
  const analytics = useAnalytics();
  const { data, isLoading, isError, refetch, isRefetching } = useLoyalty();

  useEffect(() => {
    analytics.track({ name: 'loyalty_screen_viewed' });
  }, [analytics]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ScreenHeader title="Loyalty & Rewards" />
        <View style={styles.content}>
          <SkeletonCard lines={4} />
        </View>
      </View>
    );
  }

  if (isError || !data) {
    return (
      <View style={styles.container}>
        <ScreenHeader title="Loyalty & Rewards" />
        <ErrorState
          title="Failed to load loyalty data"
          onRetry={() => refetch()}
        />
      </View>
    );
  }

  const tierConfig = TIER_CONFIG[data.tier] || TIER_CONFIG.bronze;

  return (
    <View style={styles.container}>
      <ScreenHeader title="Loyalty & Rewards" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.primary[500]} />
        }
      >
        <Card style={styles.tierCard}>
          <Card.Content style={styles.tierCardContent}>
            <View style={[styles.tierBadge, { backgroundColor: tierConfig.bg }]}>
              <MaterialCommunityIcons
                name={tierConfig.icon as keyof typeof MaterialCommunityIcons.glyphMap}
                size={40}
                color={tierConfig.color}
              />
            </View>
            <Text style={styles.tierLabel}>{tierConfig.label}</Text>
            <Text style={styles.pointsValue}>{data.points.toLocaleString()}</Text>
            <Text style={styles.pointsLabel}>Loyalty Points</Text>
            {data.nextTier && (
              <View style={styles.progressSection}>
                <View style={styles.progressInfo}>
                  <Text style={styles.progressText}>
                    {data.pointsToNextTier.toLocaleString()} points to {TIER_CONFIG[data.nextTier]?.label || data.nextTier}
                  </Text>
                  <Text style={styles.progressPercent}>{data.progressPercent}%</Text>
                </View>
                <ProgressBar
                  progress={data.progressPercent / 100}
                  color={TIER_CONFIG[data.nextTier]?.color || colors.primary[500]}
                  style={styles.progressBar}
                />
              </View>
            )}
          </Card.Content>
        </Card>

        <Card style={styles.statsCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Statistics</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <MaterialCommunityIcons name="shopping-outline" size={24} color={colors.primary[500]} />
                <Text style={styles.statValue}>{data.totalOrders}</Text>
                <Text style={styles.statLabel}>Total Orders</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <MaterialCommunityIcons name="cash" size={24} color={colors.success.DEFAULT} />
                <Text style={styles.statValue}>{formatCurrency(data.totalSpent)}</Text>
                <Text style={styles.statLabel}>Total Spent</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.infoCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Tiers & Benefits</Text>
            {TIER_THRESHOLDS.map((tier) => {
              const config = TIER_CONFIG[tier.tier];
              const isCurrent = tier.tier === data.tier;
              return (
                <View
                  key={tier.tier}
                  style={[styles.tierRow, isCurrent && styles.tierRowCurrent]}
                >
                  <View style={[styles.tierDot, { backgroundColor: config.color }]} />
                  <View style={styles.tierInfo}>
                    <Text style={[styles.tierName, isCurrent && styles.tierNameCurrent]}>
                      {config.label}
                    </Text>
                    <Text style={styles.tierRequirement}>
                      {tier.minSpend === 0 ? 'Join and start earning' : `${formatCurrency(tier.minSpend)}+ lifetime spend`}
                    </Text>
                  </View>
                  {isCurrent && (
                    <View style={[styles.currentBadge, { backgroundColor: config.bg }]}>
                      <Text style={[styles.currentBadgeText, { color: config.color }]}>Current</Text>
                    </View>
                  )}
                </View>
              );
            })}
          </Card.Content>
        </Card>

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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing[4],
  },
  tierCard: {
    backgroundColor: colors.surface,
    marginBottom: spacing[3],
    borderRadius: borderRadius.xl,
  },
  tierCardContent: {
    alignItems: 'center',
    paddingVertical: spacing[6],
  },
  tierBadge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing[3],
  },
  tierLabel: {
    ...typography['heading-lg'],
    color: colors.text.primary,
    marginBottom: spacing[1],
  },
  pointsValue: {
    ...typography['display-lg'],
    color: colors.primary[500],
    fontWeight: '700',
  },
  pointsLabel: {
    ...typography['body-sm'],
    color: colors.text.secondary,
    marginBottom: spacing[4],
  },
  progressSection: {
    width: '100%',
    paddingHorizontal: spacing[4],
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  progressText: {
    ...typography.caption,
    color: colors.text.secondary,
    flex: 1,
  },
  progressPercent: {
    ...typography['label-sm'],
    color: colors.text.primary,
    fontWeight: '600',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  statsCard: {
    backgroundColor: colors.surface,
    marginBottom: spacing[3],
    borderRadius: borderRadius.lg,
  },
  sectionTitle: {
    ...typography['heading-sm'],
    color: colors.text.primary,
    marginBottom: spacing[3],
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: spacing[1],
  },
  statDivider: {
    width: 1,
    height: 48,
    backgroundColor: colors.border,
  },
  statValue: {
    ...typography['heading-lg'],
    color: colors.text.primary,
    fontWeight: '700',
  },
  statLabel: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
  },
  tierRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[2],
    borderRadius: borderRadius.md,
    marginBottom: spacing[1],
  },
  tierRowCurrent: {
    backgroundColor: colors.gray[50],
  },
  tierDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: spacing[3],
  },
  tierInfo: {
    flex: 1,
  },
  tierName: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '500',
  },
  tierNameCurrent: {
    fontWeight: '700',
  },
  tierRequirement: {
    ...typography.caption,
    color: colors.text.tertiary,
    marginTop: 2,
  },
  currentBadge: {
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.full,
  },
  currentBadgeText: {
    ...typography['label-sm'],
    fontWeight: '600',
  },
});
