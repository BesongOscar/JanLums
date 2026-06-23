import { useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Text, Card, ActivityIndicator } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useScanHistory, ScanHistoryItem } from '../../src/hooks/useScanHistory';
import { colors } from '../../src/config/colors';
import { spacing, borderRadius } from '../../src/config/spacing';
import { typography } from '../../src/config/typography';
import { formatDate } from '../../src/utils/format';

export default function ScanHistoryScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { scans, isLoading, clearHistory } = useScanHistory();

  const handleOpenOrder = useCallback(
    (item: ScanHistoryItem) => {
      router.push(`/orders/${item.orderId}` as any);
    },
    [router]
  );

  const handleGoBack = useCallback(() => {
    router.back();
  }, [router]);

  const renderItem = useCallback(
    ({ item }: { item: ScanHistoryItem }) => {
      const orderLabel = `Order #JL-${item.orderId.slice(0, 5).toUpperCase()}`;
      return (
        <Card style={styles.scanCard}>
          <Card.Content style={styles.scanCardContent}>
            <View style={styles.scanInfo}>
              <View style={styles.scanIconContainer}>
                <MaterialCommunityIcons
                  name="qrcode"
                  size={20}
                  color={colors.primary[500]}
                />
              </View>
              <View style={styles.scanDetails}>
                <Text style={styles.orderLabel}>{orderLabel}</Text>
                <Text style={styles.scanDate}>
                  Scanned {formatDate(item.scannedAt, 'datetime')}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.openButton}
              onPress={() => handleOpenOrder(item)}
            >
              <Text style={styles.openButtonText}>Open</Text>
              <MaterialCommunityIcons
                name="chevron-right"
                size={18}
                color={colors.primary[500]}
              />
            </TouchableOpacity>
          </Card.Content>
        </Card>
      );
    },
    [handleOpenOrder]
  );

  const renderHeader = useCallback(() => {
    return (
      <View>
        <View style={[styles.headerContainer, { paddingTop: insets.top + spacing[4] }]}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
              <MaterialCommunityIcons
                name="arrow-left"
                size={24}
                color={colors.text.primary}
              />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Scan History</Text>
            <View style={styles.backButton} />
          </View>
          <Text style={styles.headerSubtitle}>
            {scans.length} {scans.length === 1 ? 'scan' : 'scans'}
          </Text>
        </View>
      </View>
    );
  }, [insets, scans.length, handleGoBack]);

  const renderEmpty = useCallback(() => {
    if (isLoading) return null;
    return (
      <View style={styles.emptyContainer}>
        <MaterialCommunityIcons
          name="qrcode-scan"
          size={64}
          color={colors.text.tertiary}
        />
        <Text style={styles.emptyTitle}>No scan history</Text>
        <Text style={styles.emptySubtitle}>
          Scanned QR codes will appear here
        </Text>
      </View>
    );
  }, [isLoading]);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={scans}
        keyExtractor={(item) => `${item.orderId}-${item.scannedAt}`}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
      {scans.length > 0 && (
        <View style={[styles.footer, { paddingBottom: insets.bottom + spacing[4] }]}>
          <TouchableOpacity
            style={styles.clearButton}
            onPress={clearHistory}
          >
            <MaterialCommunityIcons
              name="delete-outline"
              size={18}
              color={colors.error.DEFAULT}
            />
            <Text style={styles.clearButtonText}>Clear History</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[3],
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...typography['heading-lg'],
    color: colors.text.primary,
    textAlign: 'center',
  },
  headerSubtitle: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: spacing[1],
  },
  listContent: {
    paddingBottom: spacing[8],
  },
  scanCard: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing[4],
    marginBottom: spacing[2],
    borderRadius: borderRadius.lg,
  },
  scanCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scanInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  scanIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing[3],
  },
  scanDetails: {
    flex: 1,
  },
  orderLabel: {
    ...typography['label-lg'],
    color: colors.text.primary,
    fontWeight: '600',
  },
  scanDate: {
    ...typography['body-sm'],
    color: colors.text.secondary,
    marginTop: 2,
  },
  openButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    paddingVertical: spacing[2],
    paddingLeft: spacing[3],
  },
  openButtonText: {
    ...typography.button,
    color: colors.primary[500],
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
  footer: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[2],
    alignItems: 'center',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    paddingVertical: spacing[2],
  },
  clearButtonText: {
    ...typography.button,
    color: colors.error.DEFAULT,
  },
});
