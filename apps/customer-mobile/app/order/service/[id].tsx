import { useState, useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useServiceDetails } from '../../../src/hooks/useServices';
import { useAnalytics } from '../../../src/hooks/useAnalytics';
import { useOrderDraftStore } from '../../../src/stores/orderDraftStore';
import { colors } from '../../../src/config/colors';
import { spacing, borderRadius } from '../../../src/config/spacing';
import { typography } from '../../../src/config/typography';
import { formatCurrency } from '../../../src/utils/format';

function SkeletonSection() {
  return (
    <View style={styles.skeletonSection}>
      <View style={[styles.skeletonBlock, { width: '60%', height: 24 }]} />
      <View style={{ height: spacing[3] }} />
      <View style={[styles.skeletonBlock, { width: '40%', height: 18 }]} />
      <View style={{ height: spacing[3] }} />
      <View style={[styles.skeletonBlock, { width: '100%', height: 60 }]} />
    </View>
  );
}

export default function ServiceDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const analytics = useAnalytics();
  const addService = useOrderDraftStore((s) => s.addService);

  const { data: service, isLoading, isError, error, refetch } = useServiceDetails(id ?? '');

  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [added, setAdded] = useState(false);

  const handleIncrement = useCallback(() => {
    setQuantity((prev) => prev + 1);
  }, []);

  const handleDecrement = useCallback(() => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  }, []);

  const handleAddToDraft = useCallback(() => {
    if (!service) return;

    addService({
      serviceId: service.id,
      serviceName: service.name,
      quantity,
      estimatedPrice: service.basePrice,
      notes: notes.trim() || undefined,
    });

    analytics.track({
      name: 'service_added_to_order',
      properties: {
        serviceId: service.id,
        serviceName: service.name,
        quantity,
      },
    });

    setAdded(true);
  }, [service, quantity, notes, addService, analytics]);

  const handleGoToDraft = useCallback(() => {
    analytics.track({ name: 'order_review_opened' });
    router.push('/order/review' as any);
  }, [analytics, router]);

  const handleContinueShopping = useCallback(() => {
    setAdded(false);
    setQuantity(1);
    setNotes('');
    router.back();
  }, [router]);

  if (isLoading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.headerBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerBarTitle}>Service Details</Text>
          <View style={{ width: 40 }} />
        </View>
        <ScrollView contentContainerStyle={styles.skeletonContent}>
          <SkeletonSection />
          <View style={{ height: spacing[4] }} />
          <SkeletonSection />
        </ScrollView>
      </View>
    );
  }

  if (isError || !service) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.headerBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerBarTitle}>Service Details</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.errorContainer}>
          <MaterialCommunityIcons name="alert-circle-outline" size={64} color={colors.error.DEFAULT} />
          <Text style={styles.errorTitle}>Unable to load service</Text>
          <Text style={styles.errorSubtext}>
            {error instanceof Error ? error.message : 'Something went wrong'}
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => refetch()} activeOpacity={0.7}>
            <MaterialCommunityIcons name="refresh" size={18} color={colors.white} />
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const estimatedTotal = service.basePrice * quantity;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerBarTitle}>Service Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.heroSection}>
          <View style={styles.heroIcon}>
            <MaterialCommunityIcons
              name={
                service.category === 'wash_fold' || service.category === 'Wash & Fold'
                  ? 'washing-machine'
                  : service.category === 'dry_cleaning' || service.category === 'Dry Cleaning'
                    ? 'chemical-weapon'
                    : service.category === 'ironing' || service.category === 'Ironing'
                      ? 'iron'
                      : service.category === 'express' || service.category === 'Express'
                        ? 'lightning-bolt'
                        : 'tshirt-crew'
              }
              size={40}
              color={colors.primary[500]}
            />
          </View>
          <Text style={styles.heroName}>{service.name}</Text>
          <View style={styles.heroCategory}>
            <Text style={styles.heroCategoryText}>{service.category}</Text>
          </View>
        </View>

        <Card style={styles.infoCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.descriptionText}>
              {service.description || 'No description available.'}
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.infoCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Pricing</Text>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Base Price</Text>
              <Text style={styles.priceValue}>{formatCurrency(service.basePrice)}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Pricing Unit</Text>
              <Text style={styles.priceValue}>{service.pricingUnit.replace('_', ' ')}</Text>
            </View>
            {service.expressPrice != null && (
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Express Price</Text>
                <Text style={styles.priceValue}>{formatCurrency(service.expressPrice)}</Text>
              </View>
            )}
          </Card.Content>
        </Card>

        <Card style={styles.infoCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Service Information</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Estimated Time</Text>
              <Text style={styles.infoValue}>
                {service.estimatedHours} {service.estimatedHours === 1 ? 'hour' : 'hours'}
              </Text>
            </View>
            {service.fabricTypes && service.fabricTypes.length > 0 && (
              <View style={styles.fabricSection}>
                <Text style={styles.infoLabel}>Fabric Types</Text>
                <View style={styles.fabricList}>
                  {service.fabricTypes.map((fabric: string) => (
                    <View key={fabric} style={styles.fabricChip}>
                      <Text style={styles.fabricChipText}>{fabric}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </Card.Content>
        </Card>

        <Card style={styles.infoCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Quantity</Text>
            <View style={styles.stepperContainer}>
              <TouchableOpacity
                style={[styles.stepperButton, quantity <= 1 && styles.stepperButtonDisabled]}
                onPress={handleDecrement}
                disabled={quantity <= 1}
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons
                  name="minus"
                  size={20}
                  color={quantity <= 1 ? colors.text.disabled : colors.primary[500]}
                />
              </TouchableOpacity>
              <Text style={styles.stepperValue}>{quantity}</Text>
              <TouchableOpacity
                style={styles.stepperButton}
                onPress={handleIncrement}
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons name="plus" size={20} color={colors.primary[500]} />
              </TouchableOpacity>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.infoCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Special Instructions</Text>
            <Text style={styles.notesSubtext}>Optional — e.g. delicate fabrics, stain treatment</Text>
            <TextInput
              style={styles.notesInput}
              placeholder="Add notes for this service..."
              placeholderTextColor={colors.text.tertiary}
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </Card.Content>
        </Card>

        <Card style={styles.totalCard}>
          <Card.Content style={styles.totalContent}>
            <Text style={styles.totalLabel}>Estimated Total</Text>
            <Text style={styles.totalValue}>{formatCurrency(estimatedTotal)}</Text>
            <Text style={styles.totalDisclaimer}>
              Estimated pricing only — final amount confirmed at pickup
            </Text>
          </Card.Content>
        </Card>

        <View style={{ height: spacing[8] }} />
      </ScrollView>

      <View style={styles.bottomBar}>
        {added ? (
          <View style={styles.addedActions}>
            <Button
              mode="outlined"
              onPress={handleContinueShopping}
              style={styles.addedActionButton}
              contentStyle={styles.addedActionContent}
            >
              Add More
            </Button>
            <Button
              mode="contained"
              onPress={handleGoToDraft}
              style={styles.addedActionButton}
              contentStyle={styles.addedActionContent}
            >
              View Order
            </Button>
          </View>
        ) : (
          <Button
            mode="contained"
            onPress={handleAddToDraft}
            style={styles.addButton}
            contentStyle={styles.addButtonContent}
            icon="cart-plus"
          >
            Add To Order — {formatCurrency(estimatedTotal)}
          </Button>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[2],
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBarTitle: {
    ...typography['heading-sm'],
    color: colors.text.primary,
  },
  scrollContent: {
    flex: 1,
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: spacing[6],
    paddingHorizontal: spacing[4],
  },
  heroIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing[3],
  },
  heroName: {
    ...typography['display'],
    color: colors.text.primary,
    textAlign: 'center',
  },
  heroCategory: {
    marginTop: spacing[2],
    backgroundColor: colors.gray[100],
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.full,
  },
  heroCategoryText: {
    ...typography.caption,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  infoCard: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing[4],
    marginBottom: spacing[3],
    borderRadius: borderRadius.lg,
  },
  sectionTitle: {
    ...typography['heading-sm'],
    color: colors.text.primary,
    marginBottom: spacing[2],
  },
  descriptionText: {
    ...typography.body,
    color: colors.text.secondary,
    lineHeight: 22,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing[1],
  },
  priceLabel: {
    ...typography.body,
    color: colors.text.secondary,
  },
  priceValue: {
    ...typography['label-lg'],
    color: colors.text.primary,
    fontWeight: '500',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing[1],
  },
  infoLabel: {
    ...typography.body,
    color: colors.text.secondary,
  },
  infoValue: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '500',
  },
  fabricSection: {
    marginTop: spacing[2],
  },
  fabricList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[1],
    marginTop: spacing[1],
  },
  fabricChip: {
    backgroundColor: colors.gray[100],
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.full,
  },
  fabricChipText: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[4],
  },
  stepperButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepperButtonDisabled: {
    backgroundColor: colors.gray[100],
  },
  stepperValue: {
    ...typography['display-lg'],
    color: colors.text.primary,
    minWidth: 48,
    textAlign: 'center',
  },
  notesSubtext: {
    ...typography['body-sm'],
    color: colors.text.tertiary,
    marginBottom: spacing[2],
  },
  notesInput: {
    backgroundColor: colors.gray[50],
    borderRadius: borderRadius.md,
    padding: spacing[3],
    fontSize: 14,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 80,
  },
  totalCard: {
    backgroundColor: colors.primary[50],
    marginHorizontal: spacing[4],
    marginBottom: spacing[3],
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.primary[200],
  },
  totalContent: {
    alignItems: 'center',
    paddingVertical: spacing[4],
  },
  totalLabel: {
    ...typography['body-sm'],
    color: colors.primary[700],
  },
  totalValue: {
    ...typography['display-lg'],
    color: colors.primary[500],
    fontWeight: '700',
    marginTop: spacing[1],
  },
  totalDisclaimer: {
    ...typography.caption,
    color: colors.primary[400],
    marginTop: spacing[1],
    textAlign: 'center',
  },
  bottomBar: {
    padding: spacing[4],
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  addButton: {
    borderRadius: borderRadius.lg,
  },
  addButtonContent: {
    paddingVertical: spacing[1],
  },
  addedActions: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  addedActionButton: {
    flex: 1,
    borderRadius: borderRadius.lg,
  },
  addedActionContent: {
    paddingVertical: spacing[1],
  },
  skeletonSection: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing[4],
    borderRadius: borderRadius.lg,
    padding: spacing[4],
  },
  skeletonBlock: {
    backgroundColor: colors.gray[100],
    borderRadius: borderRadius.sm,
  },
  skeletonContent: {
    paddingTop: spacing[4],
    paddingBottom: spacing[8],
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing[8],
  },
  errorTitle: {
    ...typography.heading,
    color: colors.text.primary,
    marginTop: spacing[4],
  },
  errorSubtext: {
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
