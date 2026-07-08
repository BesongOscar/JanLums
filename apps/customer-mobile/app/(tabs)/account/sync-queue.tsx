import { useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Text, Button, Card, Chip, Divider } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSyncQueueStore } from '../../../src/stores/syncQueueStore';
import { useRetryOperation, useRetryAllFailed } from '../../../src/hooks/useSyncQueue';
import { useAnalytics } from '../../../src/hooks/useAnalytics';
import { colors } from '../../../src/config/colors';
import { spacing, borderRadius } from '../../../src/config/spacing';
import { typography } from '../../../src/config/typography';
import type { QueuedOperation } from '../../../src/types';

const STATUS_CONFIG: Record<string, { label: string; icon: string; color: string }> = {
  pending: { label: 'Pending', icon: 'clock-outline', color: colors.warning.DEFAULT },
  processing: { label: 'Processing', icon: 'sync', color: colors.primary[500] },
  completed: { label: 'Completed', icon: 'check-circle', color: colors.success.DEFAULT },
  failed: { label: 'Failed', icon: 'alert-circle', color: colors.error.DEFAULT },
};

const TYPE_LABELS: Record<string, string> = {
  create_order: 'Create Order',
};

function SyncQueueItem({
  item,
  onRetry,
}: {
  item: QueuedOperation;
  onRetry: (id: string) => void;
}) {
  const config = STATUS_CONFIG[item.status] ?? STATUS_CONFIG.pending;
  const typeLabel = TYPE_LABELS[item.type] ?? item.type;

  return (
    <Card style={styles.card} mode="outlined">
      <Card.Content>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <MaterialCommunityIcons name={config.icon as any} size={20} color={config.color} />
            <View style={styles.cardTitleGroup}>
              <Text style={styles.cardTitle}>{typeLabel}</Text>
              <Text style={styles.cardLabel}>{item.label}</Text>
            </View>
          </View>
          <Chip
            mode="flat"
            style={[styles.statusChip, { backgroundColor: `${config.color}18` }]}
            textStyle={[styles.statusChipText, { color: config.color }]}
          >
            {config.label}
          </Chip>
        </View>

        <Divider style={styles.cardDivider} />

        <View style={styles.cardMeta}>
          <Text style={styles.metaText}>
            Queued: {new Date(item.createdAt).toLocaleString()}
          </Text>
          {item.attemptCount > 0 && (
            <Text style={styles.metaText}>
              Attempts: {item.attemptCount}/{item.maxAttempts}
            </Text>
          )}
        </View>

        {item.error && (
          <View style={styles.errorBox}>
            <MaterialCommunityIcons name="alert-circle" size={16} color={colors.error.DEFAULT} />
            <Text style={styles.errorText}>{item.error}</Text>
          </View>
        )}

        {(item.status === 'failed' || item.status === 'pending') && (
          <Button
            mode="contained"
            compact
            onPress={() => onRetry(item.id)}
            style={styles.retryButton}
            contentStyle={styles.retryButtonContent}
            icon="refresh"
          >
            {item.status === 'failed' ? 'Retry' : 'Pending...'}
          </Button>
        )}
      </Card.Content>
    </Card>
  );
}

export default function SyncQueueScreen() {
  const insets = useSafeAreaInsets();
  const analytics = useAnalytics();
  const operations = useSyncQueueStore((s) => s.operations);
  const clearCompleted = useSyncQueueStore((s) => s.clearCompleted);
  const retryOperation = useRetryOperation();
  const retryAllFailed = useRetryAllFailed();

  const {
    pending: pendingCount,
    processing: processingCount,
    completed: completedCount,
    failed: failedCount,
  } = {
    pending: operations.filter((o) => o.status === 'pending').length,
    processing: operations.filter((o) => o.status === 'processing').length,
    completed: operations.filter((o) => o.status === 'completed').length,
    failed: operations.filter((o) => o.status === 'failed').length,
  };

  const handleRetry = useCallback(
    (id: string) => {
      retryOperation(id);
    },
    [retryOperation]
  );

  const handleRetryAll = useCallback(() => {
    analytics.track({ name: 'sync_queue_processed', properties: { action: 'retry_all' } });
    retryAllFailed();
  }, [analytics, retryAllFailed]);

  const handleClearCompleted = useCallback(() => {
    clearCompleted();
  }, [clearCompleted]);

  const renderItem = useCallback(
    ({ item }: { item: QueuedOperation }) => <SyncQueueItem item={item} onRetry={handleRetry} />,
    [handleRetry]
  );

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <View style={styles.summaryRow}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{pendingCount}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={styles.stat}>
          <Text style={[styles.statValue, { color: colors.primary[500] }]}>{processingCount}</Text>
          <Text style={styles.statLabel}>Processing</Text>
        </View>
        <View style={styles.stat}>
          <Text style={[styles.statValue, { color: colors.success.DEFAULT }]}>{completedCount}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
        <View style={styles.stat}>
          <Text style={[styles.statValue, { color: colors.error.DEFAULT }]}>{failedCount}</Text>
          <Text style={styles.statLabel}>Failed</Text>
        </View>
      </View>

      {(failedCount > 0 || completedCount > 0) && (
        <View style={styles.actionRow}>
          {failedCount > 0 && (
            <Button
              mode="contained"
              compact
              onPress={handleRetryAll}
              style={styles.actionButton}
              icon="refresh"
            >
              Retry All ({failedCount})
            </Button>
          )}
          {completedCount > 0 && (
            <Button
              mode="outlined"
              compact
              onPress={handleClearCompleted}
              style={styles.actionButton}
              icon="delete-sweep"
            >
              Clear Completed
            </Button>
          )}
        </View>
      )}

      {operations.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="sync-off" size={64} color={colors.text.disabled} />
          <Text style={styles.emptyTitle}>All Synced</Text>
          <Text style={styles.emptySubtitle}>No pending operations. Orders are submitted in real-time.</Text>
        </View>
      ) : (
        <FlatList
          data={operations}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  summaryRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    backgroundColor: colors.surface,
    gap: spacing[2],
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    ...typography['display-sm'],
    color: colors.warning.DEFAULT,
    fontWeight: '700',
  },
  statLabel: {
    ...typography.label,
    color: colors.text.tertiary,
    marginTop: 2,
  },
  actionRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    gap: spacing[2],
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  actionButton: {
    flex: 1,
  },
  list: {
    padding: spacing[4],
    gap: spacing[3],
  },
  card: {
    borderRadius: borderRadius.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    flex: 1,
  },
  cardTitleGroup: {
    flex: 1,
  },
  cardTitle: {
    ...typography['label-lg'],
    color: colors.text.primary,
    fontWeight: '600',
  },
  cardLabel: {
    ...typography['body-sm'],
    color: colors.text.tertiary,
    marginTop: 1,
  },
  statusChip: {
    height: 28,
  },
  statusChipText: {
    ...typography.label,
    fontSize: 11,
    fontWeight: '600',
  },
  cardDivider: {
    marginVertical: spacing[2],
    backgroundColor: colors.border,
  },
  cardMeta: {
    gap: 2,
  },
  metaText: {
    ...typography['body-sm'],
    color: colors.text.tertiary,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[1],
    backgroundColor: `${colors.error.DEFAULT}10`,
    borderRadius: borderRadius.md,
    padding: spacing[2],
    marginTop: spacing[2],
  },
  errorText: {
    ...typography['body-sm'],
    color: colors.error.DEFAULT,
    flex: 1,
  },
  retryButton: {
    marginTop: spacing[2],
    borderRadius: borderRadius.md,
  },
  retryButtonContent: {
    paddingVertical: 2,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing[6],
  },
  emptyTitle: {
    ...typography['display-md'],
    color: colors.text.primary,
    marginTop: spacing[4],
  },
  emptySubtitle: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: spacing[2],
    lineHeight: 22,
  },
});
