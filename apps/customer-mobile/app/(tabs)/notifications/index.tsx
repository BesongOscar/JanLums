import { useState, useCallback, useEffect } from 'react';
import { View, FlatList, RefreshControl, StyleSheet } from 'react-native';
import { Text, Button, ActivityIndicator, Dialog, Portal } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAnalytics } from '../../../src/hooks/useAnalytics';
import {
  useNotifications,
  useUnreadNotificationCount,
  useMarkAllNotificationsRead,
  useDeleteNotification,
  useDeleteAllNotifications,
} from '../../../src/hooks/useNotifications';
import { NotificationCard } from '../../../src/components/features/NotificationCard';
import { useOfflineBlock } from '../../../src/hooks/useOfflineBlock';
import { colors } from '../../../src/config/colors';
import { spacing, borderRadius } from '../../../src/config/spacing';
import { typography } from '../../../src/config/typography';
import { AppNotification } from '../../../src/types';
import { ScreenHeader } from '../../../src/components/common/ScreenHeader';
import { ErrorState, EmptyState } from '../../../src/components/common/DataState';

type ConfirmAction = 'markAllRead' | 'deleteAll' | null;

export default function NotificationsScreen() {
  const router = useRouter();
  const analytics = useAnalytics();
  const { blockIfOffline } = useOfflineBlock();

  useEffect(() => {
    analytics.track({ name: 'notifications_screen_viewed' });
  }, [analytics]);

  const { data: notifications, isLoading, isError, refetch, isRefetching } = useNotifications();
  const { data: unreadData } = useUnreadNotificationCount();
  const markAllRead = useMarkAllNotificationsRead();
  const deleteNotification = useDeleteNotification();
  const deleteAll = useDeleteAllNotifications();

  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);

  const unreadCount = unreadData?.count ?? 0;
  const hasNotifications = notifications && notifications.length > 0;

  const handleNotificationPress = useCallback((notification: AppNotification) => {
    router.push(`/(tabs)/notifications/${notification.id}` as any);
  }, [router]);

  const handleDelete = useCallback((notification: AppNotification) => {
    if (blockIfOffline('delete notifications')) return;
    analytics.track({ name: 'notification_deleted', properties: { id: notification.id, type: notification.type } });
    deleteNotification.mutate(notification.id);
  }, [analytics, deleteNotification, blockIfOffline]);

  const handleMarkAllRead = useCallback(() => {
    if (blockIfOffline('mark notifications as read')) return;
    analytics.track({ name: 'notifications_mark_all_read' });
    markAllRead.mutate();
    setConfirmAction(null);
  }, [analytics, markAllRead, blockIfOffline]);

  const handleDeleteAll = useCallback(() => {
    if (blockIfOffline('delete all notifications')) return;
    analytics.track({ name: 'notifications_deleted_all' });
    deleteAll.mutate();
    setConfirmAction(null);
  }, [analytics, deleteAll, blockIfOffline]);

  const renderItem = useCallback(({ item }: { item: AppNotification }) => (
    <NotificationCard
      notification={item}
      onPress={() => handleNotificationPress(item)}
      onDelete={() => handleDelete(item)}
    />
  ), [handleNotificationPress, handleDelete]);

  const renderHeader = () => {
    if (!hasNotifications) return null;

    return (
      <View style={styles.headerActions}>
        {unreadCount > 0 && (
          <Button
            mode="text"
            compact
            onPress={() => setConfirmAction('markAllRead')}
            textColor={colors.primary[500]}
            loading={markAllRead.isPending}
            accessibilityLabel={`Mark all ${unreadCount} notifications as read`}
          >
            Mark all read
          </Button>
        )}
        <Button
          mode="text"
          compact
          onPress={() => setConfirmAction('deleteAll')}
          textColor={colors.error.DEFAULT}
          loading={deleteAll.isPending}
          accessibilityLabel="Delete all notifications"
        >
          Delete all
        </Button>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ScreenHeader
          title="Notifications"
          showBack={false}
        />
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary[500]} />
          <Text style={styles.loadingText}>Loading notifications...</Text>
        </View>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.container}>
        <ScreenHeader
          title="Notifications"
          showBack={false}
        />
        <ErrorState
          title="Failed to load notifications"
          onRetry={() => refetch()}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Notifications"
        showBack={false}
        rightAction={unreadCount > 0 ? (
          <View style={styles.badgeContainer} accessibilityLabel={`${unreadCount} unread notifications`} accessibilityRole="text">
            <Text style={styles.badgeText}>{unreadCount}</Text>
          </View>
        ) : undefined}
      />

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <EmptyState
            icon="bell-off-outline"
            title="No notifications"
            message="You're all caught up! Notifications about your orders will appear here."
          />
        }
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={colors.primary[500]}
            accessibilityLabel="Pull to refresh notifications"
          />
        }
        contentContainerStyle={!hasNotifications ? styles.emptyList : undefined}
      />

      <Portal>
        <Dialog visible={confirmAction === 'markAllRead'} onDismiss={() => setConfirmAction(null)}>
          <Dialog.Icon icon="check-all" />
          <Dialog.Title>Mark all as read?</Dialog.Title>
          <Dialog.Content>
            <Text>This will mark all notifications as read.</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setConfirmAction(null)}>Cancel</Button>
            <Button onPress={handleMarkAllRead} loading={markAllRead.isPending}>Mark all read</Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog visible={confirmAction === 'deleteAll'} onDismiss={() => setConfirmAction(null)}>
          <Dialog.Icon icon="delete" />
          <Dialog.Title>Delete all notifications?</Dialog.Title>
          <Dialog.Content>
            <Text>This action cannot be undone. All notifications will be permanently deleted.</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setConfirmAction(null)}>Cancel</Button>
            <Button onPress={handleDeleteAll} textColor={colors.error.DEFAULT} loading={deleteAll.isPending}>Delete all</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing[8],
  },
  badgeContainer: {
    backgroundColor: colors.primary[500],
    borderRadius: borderRadius.full,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing[2],
    marginLeft: spacing[2],
  },
  badgeText: {
    ...typography.label,
    color: colors.white,
    fontWeight: '700',
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    gap: spacing[1],
  },
  emptyList: {
    flexGrow: 1,
  },
  loadingText: {
    ...typography.body,
    color: colors.text.secondary,
    marginTop: spacing[4],
  },
});
