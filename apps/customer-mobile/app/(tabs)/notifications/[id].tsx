import { useEffect, useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAnalytics } from '../../../src/hooks/useAnalytics';
import {
  useNotifications,
  useMarkNotificationRead,
  useDeleteNotification,
} from '../../../src/hooks/useNotifications';
import { useOfflineBlock } from '../../../src/hooks/useOfflineBlock';
import { getNotificationTypeConfig } from '../../../src/utils/notificationMapper';
import { formatDate, formatRelativeTime } from '../../../src/utils/format';
import type { AppNotification } from '../../../src/types';
import { colors } from '../../../src/config/colors';
import { spacing, borderRadius } from '../../../src/config/spacing';
import { typography } from '../../../src/config/typography';

export default function NotificationDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const analytics = useAnalytics();
  const { blockIfOffline } = useOfflineBlock();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: notifications, isLoading } = useNotifications();
  const markRead = useMarkNotificationRead();
  const deleteNotification = useDeleteNotification();

  const notification = notifications?.find((n: AppNotification) => n.id === id);

  useEffect(() => {
    if (notification && !notification.isRead) {
      markRead.mutate(notification.id);
    }
  }, [notification?.id, notification?.isRead]);

  useEffect(() => {
    analytics.track({
      name: 'notification_opened',
      properties: { id: notification?.id, type: notification?.type },
    });
  }, [notification?.id, notification?.type, analytics]);

  const handleViewOrder = useCallback(() => {
    const orderId = notification?.metadata?.orderId;
    if (orderId) {
      router.push(`/orders/${orderId}` as any);
    }
  }, [notification, router]);

  const handleDelete = useCallback(() => {
    if (!notification) return;
    if (blockIfOffline('delete notification')) return;
    analytics.track({
      name: 'notification_deleted',
      properties: { id: notification.id, type: notification.type },
    });
    deleteNotification.mutate(notification.id, {
      onSuccess: () => {
        router.back();
      },
    });
  }, [notification, deleteNotification, analytics, blockIfOffline, router]);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.center, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
      </View>
    );
  }

  if (!notification) {
    return (
      <View style={[styles.container, styles.center, { paddingTop: insets.top }]}>
        <MaterialCommunityIcons name="bell-off-outline" size={48} color={colors.text.tertiary} />
        <Text style={styles.notFoundTitle}>Notification not found</Text>
        <Button mode="contained" onPress={() => router.back()} style={styles.backBtn}>
          Go Back
        </Button>
      </View>
    );
  }

  const typeConfig = getNotificationTypeConfig(notification.type);
  const hasOrderLink = !!notification.metadata?.orderId;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.headerBar}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.headerButton}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notification</Text>
        <TouchableOpacity
          onPress={handleDelete}
          style={styles.headerButton}
          accessibilityLabel="Delete notification"
          accessibilityRole="button"
        >
          <MaterialCommunityIcons name="delete-outline" size={24} color={colors.error.DEFAULT} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.typeSection}>
          <View style={[styles.typeBadge, { backgroundColor: typeConfig.backgroundColor }]}>
            <MaterialCommunityIcons name={typeConfig.icon} size={28} color={typeConfig.color} />
          </View>
          <Text style={[styles.typeLabel, { color: typeConfig.color }]}>
            {typeConfig.label}
          </Text>
          {!notification.isRead && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>New</Text>
            </View>
          )}
        </View>

        <Text style={styles.title}>{notification.title}</Text>
        <Text style={styles.message}>{notification.message}</Text>

        <View style={styles.metaSection}>
          <Card style={styles.metaCard}>
            <Card.Content style={styles.metaContent}>
              <View style={styles.metaRow}>
                <MaterialCommunityIcons name="clock-outline" size={18} color={colors.text.tertiary} />
                <Text style={styles.metaLabel}>Received</Text>
                <Text style={styles.metaValue}>
                  {formatRelativeTime(notification.createdAt)}
                </Text>
              </View>
              <View style={styles.metaDivider} />
              <View style={styles.metaRow}>
                <MaterialCommunityIcons name="calendar" size={18} color={colors.text.tertiary} />
                <Text style={styles.metaLabel}>Date</Text>
                <Text style={styles.metaValue}>
                  {formatDate(notification.createdAt, 'datetime')}
                </Text>
              </View>
            </Card.Content>
          </Card>
        </View>

        {hasOrderLink && (
          <Button
            mode="contained"
            onPress={handleViewOrder}
            style={styles.viewOrderButton}
            contentStyle={styles.viewOrderButtonContent}
            icon="clipboard-list"
          >
            View Order
          </Button>
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
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing[6],
    gap: spacing[3],
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[3],
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  headerTitle: {
    ...typography.heading,
    color: colors.text.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing[4],
  },
  typeSection: {
    alignItems: 'center',
    marginTop: spacing[4],
    marginBottom: spacing[5],
    gap: spacing[2],
  },
  typeBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typeLabel: {
    ...typography.label,
    fontWeight: '600',
  },
  unreadBadge: {
    backgroundColor: colors.primary[500],
    paddingHorizontal: spacing[3],
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  unreadBadgeText: {
    ...typography.caption,
    color: colors.white,
    fontWeight: '700',
    fontSize: 10,
  },
  title: {
    ...typography['display-sm'],
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing[3],
  },
  message: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  metaSection: {
    marginTop: spacing[6],
    marginBottom: spacing[6],
  },
  metaCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
  },
  metaContent: {
    gap: spacing[2],
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  metaLabel: {
    ...typography.body,
    color: colors.text.tertiary,
    flex: 1,
  },
  metaValue: {
    ...typography['label-lg'],
    color: colors.text.primary,
    fontWeight: '500',
  },
  metaDivider: {
    height: 1,
    backgroundColor: colors.divider,
  },
  viewOrderButton: {
    borderRadius: borderRadius.lg,
  },
  viewOrderButtonContent: {
    paddingVertical: spacing[2],
  },
  notFoundTitle: {
    ...typography.heading,
    color: colors.text.primary,
  },
  backBtn: {
    borderRadius: borderRadius.lg,
  },
});
