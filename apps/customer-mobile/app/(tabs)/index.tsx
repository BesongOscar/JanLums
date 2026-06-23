import { useMemo } from 'react';
import { View, ScrollView, RefreshControl, StyleSheet } from 'react-native';
import { Text, Card, ActivityIndicator } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useCustomerProfile } from '../../src/hooks/useCustomerProfile';
import { useMyOrders } from '../../src/hooks/useMyOrders';
import { colors } from '../../src/config/colors';
import { spacing, borderRadius } from '../../src/config/spacing';
import { typography } from '../../src/config/typography';
import { formatCurrency, formatDate } from '../../src/utils/format';
import { STATUS_MAP, getStatusTranslation } from '../../src/utils/statusMapper';

function SkeletonBlock({ height }: { height: number }) {
  return (
    <View style={[styles.skeleton, { height }]}>
      <ActivityIndicator size="small" color={colors.primary[300]} />
    </View>
  );
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const {
    data: profile,
    isLoading: profileLoading,
    isError: profileError,
    refetch: refetchProfile,
  } = useCustomerProfile();
  const {
    data: orders,
    isLoading: ordersLoading,
    isError: ordersError,
    refetch: refetchOrders,
    isRefetching,
  } = useMyOrders();

  const isLoading = profileLoading || ordersLoading;
  const isError = profileError || ordersError;


  const stats = useMemo(() => {
    const list = orders ?? [];
    return {
      total: list.length,
      active: list.filter((o) => !['completed', 'cancelled'].includes(o.status)).length,
      completed: list.filter((o) => o.status === 'completed').length,
      recent: list.slice(0, 3),
    };
  }, [orders]);

  const handleRefresh = () => {
    refetchProfile();
    refetchOrders();
  };

  if (isLoading) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <SkeletonBlock height={100} />
        <View style={{ height: spacing[4] }} />
        <SkeletonBlock height={80} />
        <View style={{ height: spacing[4] }} />
        <SkeletonBlock height={200} />
      </ScrollView>
    );
  }

  if (isError) {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.center}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={handleRefresh} tintColor={colors.primary[500]} />
        }
      >
        <MaterialCommunityIcons name="alert-circle-outline" size={48} color={colors.error.DEFAULT} />
        <Text style={styles.errorText}>Something went wrong</Text>
        <Text style={styles.errorSubtext}>Pull down to retry</Text>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing[4] }]}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={handleRefresh} tintColor={colors.primary[500]} />
      }
    >
      <View style={styles.welcomeCard}>
        <View style={styles.welcomeContent}>
          <Text style={styles.welcomeLabel}>Welcome back,</Text>
          <Text style={styles.welcomeName}>{profile?.firstName || 'there'}</Text>
        </View>
        <View style={styles.welcomeIcon}>
          <MaterialCommunityIcons name="tshirt-crew" size={40} color={colors.primary[100]} />
        </View>
      </View>

      <Text style={styles.sectionTitle}>Summary</Text>
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: colors.info.light }]}>
          <Text style={[styles.statValue, { color: colors.primary[700] }]}>{stats.total}</Text>
          <Text style={[styles.statLabel, { color: colors.primary[600] }]}>Total Orders</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.warning.light }]}>
          <Text style={[styles.statValue, { color: colors.warning.DEFAULT }]}>{stats.active}</Text>
          <Text style={[styles.statLabel, { color: colors.secondary[600] }]}>Active</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.success.light }]}>
          <Text style={[styles.statValue, { color: colors.success.DEFAULT }]}>{stats.completed}</Text>
          <Text style={[styles.statLabel, { color: colors.success.DEFAULT }]}>Completed</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Recent Orders</Text>
      {stats.recent.length === 0 ? (
        <Card style={styles.emptyCard}>
          <Card.Content style={styles.emptyContent}>
            <MaterialCommunityIcons name="clipboard-text-outline" size={40} color={colors.text.tertiary} />
            <Text style={styles.emptyText}>Your recent laundry activity will appear here</Text>
          </Card.Content>
        </Card>
      ) : (
        stats.recent.map((order) => {
          const translation = getStatusTranslation(order.status as any);
          return (
            <Card key={order.id} style={styles.orderCard}>
              <Card.Content>
                <View style={styles.orderHeader}>
                  <Text style={styles.orderNumber}>#{order.id.slice(0, 8).toUpperCase()}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: translation.backgroundColor }]}>
                    <Text style={[styles.statusText, { color: translation.color }]}>
                      {translation.label}
                    </Text>
                  </View>
                </View>
                <View style={styles.orderDetails}>
                  <View style={styles.orderDetailRow}>
                    <Text style={styles.orderDetailLabel}>Total</Text>
                    <Text style={styles.orderDetailValue}>{formatCurrency(order.total)}</Text>
                  </View>
                  <View style={styles.orderDetailRow}>
                    <Text style={styles.orderDetailLabel}>Date</Text>
                    <Text style={styles.orderDetailValue}>{formatDate(order.createdAt, 'short')}</Text>
                  </View>
                </View>
              </Card.Content>
            </Card>
          );
        })
      )}

      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.quickActions}>
        <Card style={styles.actionCard} onPress={() => router.push('/(tabs)/orders')}>
          <Card.Content style={styles.actionContent}>
            <MaterialCommunityIcons name="clipboard-list" size={28} color={colors.primary[500]} />
            <Text style={styles.actionLabel}>View Orders</Text>
          </Card.Content>
        </Card>
        <Card style={styles.actionCard} onPress={() => router.push('/(tabs)/account/edit')}>
          <Card.Content style={styles.actionContent}>
            <MaterialCommunityIcons name="account-edit" size={28} color={colors.primary[500]} />
            <Text style={styles.actionLabel}>Edit Profile</Text>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing[4],
    paddingBottom: spacing[8],
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing[4],
  },
  skeleton: {
    backgroundColor: colors.gray[100],
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeCard: {
    backgroundColor: colors.primary[500],
    borderRadius: borderRadius.xl,
    padding: spacing[5],
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[5],
  },
  welcomeContent: {
    flex: 1,
  },
  welcomeLabel: {
    ...typography.body,
    color: colors.primary[100],
  },
  welcomeName: {
    ...typography['display'],
    color: colors.white,
    marginTop: spacing[1],
  },
  welcomeIcon: {
    opacity: 0.6,
  },
  sectionTitle: {
    ...typography['heading-sm'],
    color: colors.text.primary,
    marginBottom: spacing[3],
    marginTop: spacing[2],
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing[2],
    marginBottom: spacing[4],
  },
  statCard: {
    flex: 1,
    borderRadius: borderRadius.lg,
    padding: spacing[3],
    alignItems: 'center',
  },
  statValue: {
    ...typography['display'],
    fontSize: 24,
    fontWeight: '700',
  },
  statLabel: {
    ...typography['label'],
    marginTop: spacing[1],
    textAlign: 'center',
  },
  orderCard: {
    backgroundColor: colors.surface,
    marginBottom: spacing[2],
    borderRadius: borderRadius.md,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  orderNumber: {
    ...typography['label-lg'],
    color: colors.text.primary,
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
  orderDetails: {
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
  emptyCard: {
    backgroundColor: colors.surface,
    marginBottom: spacing[2],
    borderRadius: borderRadius.md,
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: spacing[6],
  },
  emptyText: {
    ...typography.body,
    color: colors.text.tertiary,
    marginTop: spacing[3],
    textAlign: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    gap: spacing[2],
    marginBottom: spacing[4],
  },
  actionCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
  },
  actionContent: {
    alignItems: 'center',
    paddingVertical: spacing[4],
    gap: spacing[2],
  },
  actionLabel: {
    ...typography['label-lg'],
    color: colors.text.primary,
  },
  errorText: {
    ...typography['heading-sm'],
    color: colors.text.primary,
    marginTop: spacing[3],
  },
  errorSubtext: {
    ...typography.body,
    color: colors.text.secondary,
    marginTop: spacing[1],
  },
});
