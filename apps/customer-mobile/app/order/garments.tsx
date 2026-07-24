import { useState, useCallback, useMemo } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Text, Card, Button, TextInput, Dialog, Portal, Chip } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useOrderDraftStore } from '../../src/stores/orderDraftStore';
import { colors } from '../../src/config/colors';
import { spacing, borderRadius } from '../../src/config/spacing';
import { typography } from '../../src/config/typography';
import type { GarmentDraftItem } from '../../src/types';
import { ScreenHeader } from '../../src/components/common/ScreenHeader';

const GARMENT_TYPES = [
  'Shirt', 'Pant', 'Suit', 'Dress', 'Skirt', 'Jacket',
  'Tie', 'Scarf', 'Sweater', 'Hoodie', 'Blanket', 'Towel', 'Other',
];

const FABRIC_TYPES = [
  'Cotton', 'Wool', 'Silk', 'Linen', 'Polyester', 'Nylon',
  'Viscose', 'Denim', 'Rayon', 'Cashmere', 'Other',
];

function GarmentForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: GarmentDraftItem;
  onSave: (item: GarmentDraftItem) => void;
  onCancel: () => void;
}) {
  const [garmentType, setGarmentType] = useState(initial?.garmentType ?? '');
  const [fabricType, setFabricType] = useState(initial?.fabricType ?? '');
  const [color, setColor] = useState(initial?.color ?? '');
  const [quantity, setQuantity] = useState(initial?.quantity ?? 1);
  const [specialInstructions, setSpecialInstructions] = useState(initial?.specialInstructions ?? '');
  const [showCustomGarment, setShowCustomGarment] = useState(false);
  const [customGarment, setCustomGarment] = useState('');

  const handleSubmit = useCallback(() => {
    const type = showCustomGarment ? customGarment.trim() : garmentType;
    if (!type || quantity < 1) return;

    onSave({
      garmentType: type,
      fabricType: fabricType || undefined,
      color: color.trim() || undefined,
      quantity,
      specialInstructions: specialInstructions.trim() || undefined,
    });
  }, [garmentType, fabricType, color, quantity, specialInstructions, showCustomGarment, customGarment, onSave]);

  const handleSelectGarmentType = useCallback((type: string) => {
    if (type === 'Other') {
      setShowCustomGarment(true);
      setGarmentType('');
    } else {
      setShowCustomGarment(false);
      setGarmentType(type);
      setCustomGarment('');
    }
  }, []);

  const isFormValid = (showCustomGarment ? customGarment.trim() : garmentType) !== '' && quantity >= 1;

  return (
    <ScrollView style={styles.formContainer} keyboardShouldPersistTaps="handled">
      <Text style={styles.formSectionTitle}>Garment Type</Text>
      <View style={styles.chipRow}>
        {GARMENT_TYPES.map((type) => {
          const selected = !showCustomGarment && garmentType === type;
          return (
            <Chip
              key={type}
              selected={selected}
              onPress={() => handleSelectGarmentType(type)}
              style={[styles.chip, selected && styles.chipSelected]}
              textStyle={[styles.chipText, selected && styles.chipTextSelected]}
              accessibilityLabel={`Select ${type} as garment type`}
              accessibilityState={{ selected }}
            >
              {type}
            </Chip>
          );
        })}
      </View>
      {showCustomGarment && (
        <TextInput
          label="Custom Garment Type"
          value={customGarment}
          onChangeText={setCustomGarment}
          mode="outlined"
          style={styles.formInput}
          accessibilityLabel="Enter custom garment type"
        />
      )}

      <Text style={styles.formSectionTitle}>Fabric Type (optional)</Text>
      <View style={styles.chipRow}>
        {FABRIC_TYPES.map((type) => {
          const selected = fabricType === type;
          return (
            <Chip
              key={type}
              selected={selected}
              onPress={() => setFabricType(selected ? '' : type)}
              style={[styles.chip, selected && styles.chipSelected]}
              textStyle={[styles.chipText, selected && styles.chipTextSelected]}
              accessibilityLabel={`Select ${type} as fabric type`}
              accessibilityState={{ selected }}
            >
              {type}
            </Chip>
          );
        })}
      </View>

      <TextInput
        label="Color (optional)"
        value={color}
        onChangeText={setColor}
        mode="outlined"
        style={styles.formInput}
        placeholder="e.g. White, Navy, Red"
        accessibilityLabel="Enter garment color"
      />

      <Text style={styles.formSectionTitle}>Quantity</Text>
      <View style={styles.quantityRow}>
        <TouchableOpacity
          style={[styles.qtyButton, quantity <= 1 && styles.qtyButtonDisabled]}
          onPress={() => setQuantity(Math.max(1, quantity - 1))}
          disabled={quantity <= 1}
          activeOpacity={0.7}
          accessibilityLabel="Decrease quantity"
          accessibilityRole="button"
          accessibilityState={{ disabled: quantity <= 1 }}
        >
          <MaterialCommunityIcons
            name="minus"
            size={20}
            color={quantity <= 1 ? colors.text.disabled : colors.primary[500]}
          />
        </TouchableOpacity>
        <Text style={styles.qtyValue}>{quantity}</Text>
        <TouchableOpacity
          style={styles.qtyButton}
          onPress={() => setQuantity(quantity + 1)}
          activeOpacity={0.7}
          accessibilityLabel="Increase quantity"
          accessibilityRole="button"
        >
          <MaterialCommunityIcons name="plus" size={20} color={colors.primary[500]} />
        </TouchableOpacity>
      </View>

      <TextInput
        label="Special Instructions (optional)"
        value={specialInstructions}
        onChangeText={setSpecialInstructions}
        mode="outlined"
        multiline
        numberOfLines={2}
        style={styles.formInput}
        placeholder="e.g. Remove collar stain, Handle with care"
        accessibilityLabel="Enter special instructions for this garment"
      />

      <View style={styles.formActions}>
        <Button
          mode="outlined"
          onPress={onCancel}
          style={styles.formActionButton}
          accessibilityLabel="Cancel adding garment"
        >
          Cancel
        </Button>
        <Button
          mode="contained"
          onPress={handleSubmit}
          disabled={!isFormValid}
          style={styles.formActionButton}
          accessibilityLabel={initial ? 'Save garment changes' : 'Add garment'}
          accessibilityState={{ disabled: !isFormValid }}
        >
          {initial ? 'Save' : 'Add'}
        </Button>
      </View>
    </ScrollView>
  );
}

export default function GarmentEntryScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ index: string }>();
  const serviceIndex = parseInt(params.index ?? '', 10);

  const selectedServices = useOrderDraftStore((s) => s.selectedServices);
  const setServiceGarments = useOrderDraftStore((s) => s.setServiceGarments);

  const service = useMemo(
    () => selectedServices[serviceIndex],
    [selectedServices, serviceIndex]
  );

  const [garments, setGarments] = useState<GarmentDraftItem[]>(
    () => service?.garments ?? []
  );
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleAddGarment = useCallback((item: GarmentDraftItem) => {
    setGarments((prev) => [...prev, item]);
    setShowForm(false);
  }, []);

  const handleEditGarment = useCallback((item: GarmentDraftItem) => {
    if (editingIndex === null) return;
    setGarments((prev) => prev.map((g, i) => (i === editingIndex ? item : g)));
    setEditingIndex(null);
  }, [editingIndex]);

  const handleRemoveGarment = useCallback((index: number) => {
    setGarments((prev) => prev.filter((_, i) => i !== index));
    if (editingIndex === index) setEditingIndex(null);
  }, [editingIndex]);

  const handleSave = useCallback(() => {
    if (isNaN(serviceIndex)) return;
    setServiceGarments(serviceIndex, garments);
    router.back();
  }, [serviceIndex, garments, setServiceGarments, router]);

  if (isNaN(serviceIndex) || !service) {
    return (
      <View style={[styles.container, styles.centerContent, { paddingTop: insets.top }]}>
        <MaterialCommunityIcons name="alert-circle-outline" size={48} color={colors.error.DEFAULT} />
        <Text style={styles.errorText}>Service not found</Text>
        <Button
          mode="contained"
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityLabel="Go back"
        >
          Go Back
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScreenHeader title="Garment Details" />

      <View style={styles.serviceInfo}>
        <MaterialCommunityIcons name="tshirt-crew" size={20} color={colors.primary[500]} />
        <Text style={styles.serviceInfoText}>
          {service.serviceName} × {service.quantity}
        </Text>
      </View>

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Card style={styles.sectionCard}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                Garments ({garments.length})
              </Text>
            </View>
            {garments.length === 0 ? (
              <View style={styles.emptyGarments}>
                <MaterialCommunityIcons name="hanger" size={40} color={colors.text.tertiary} />
                <Text style={styles.emptyGarmentsText}>
                  No garments added yet. Tap &ldquo;Add Garment&rdquo; to specify details for each item.
                </Text>
              </View>
            ) : (
              garments.map((garment, index) => (
                <View key={`${garment.garmentType}-${index}`}>
                  <View style={styles.garmentItem}>
                    <View style={styles.garmentInfo}>
                      <Text style={styles.garmentType}>
                        {garment.garmentType} × {garment.quantity}
                      </Text>
                      {garment.fabricType && (
                        <Text style={styles.garmentDetail}>{garment.fabricType}</Text>
                      )}
                      {garment.color && (
                        <Text style={styles.garmentDetail}>Color: {garment.color}</Text>
                      )}
                      {garment.specialInstructions && (
                        <Text style={styles.garmentNote}>{garment.specialInstructions}</Text>
                      )}
                    </View>
                    <View style={styles.garmentActions}>
                      <TouchableOpacity
                        onPress={() => setEditingIndex(index)}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        accessibilityLabel={`Edit ${garment.garmentType}`}
                        accessibilityRole="button"
                      >
                        <MaterialCommunityIcons name="pencil" size={20} color={colors.primary[500]} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleRemoveGarment(index)}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        accessibilityLabel={`Remove ${garment.garmentType}`}
                        accessibilityRole="button"
                      >
                        <MaterialCommunityIcons name="delete-outline" size={20} color={colors.error.DEFAULT} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  {index < garments.length - 1 && <View style={styles.divider} />}
                </View>
              ))
            )}
          </Card.Content>
        </Card>

        <Button
          mode="outlined"
          onPress={() => {
            setEditingIndex(null);
            setShowForm(true);
          }}
          style={styles.addButton}
          icon="plus"
          accessibilityLabel="Add a new garment"
        >
          Add Garment
        </Button>
      </ScrollView>

      <View style={styles.bottomBar}>
        <Button
          mode="contained"
          onPress={handleSave}
          style={styles.saveButton}
          accessibilityLabel="Save garment details and return"
        >
          Save & Return
        </Button>
      </View>

      <Portal>
        <Dialog
          visible={showForm || editingIndex !== null}
          onDismiss={() => {
            setShowForm(false);
            setEditingIndex(null);
          }}
          style={styles.dialog}
        >
          <Dialog.Icon icon={editingIndex !== null ? 'pencil' : 'hanger'} />
          <Dialog.Title accessibilityRole="header">
            {editingIndex !== null ? 'Edit Garment' : 'Add Garment'}
          </Dialog.Title>
          <Dialog.Content>
            <GarmentForm
              initial={editingIndex !== null ? garments[editingIndex] : undefined}
              onSave={(item) => {
                if (editingIndex !== null) {
                  handleEditGarment(item);
                } else {
                  handleAddGarment(item);
                }
              }}
              onCancel={() => {
                setShowForm(false);
                setEditingIndex(null);
              }}
            />
          </Dialog.Content>
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
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing[4],
  },
  serviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    backgroundColor: colors.primary[50],
    gap: spacing[2],
  },
  serviceInfoText: {
    ...typography['label-lg'],
    color: colors.primary[700],
    fontWeight: '600',
  },
  scrollContent: {
    flex: 1,
    padding: spacing[4],
  },
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  sectionTitle: {
    ...typography['heading-sm'],
    color: colors.text.primary,
  },
  emptyGarments: {
    alignItems: 'center',
    paddingVertical: spacing[6],
    gap: spacing[2],
  },
  emptyGarmentsText: {
    ...typography.body,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
  garmentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: spacing[2],
  },
  garmentInfo: {
    flex: 1,
    marginRight: spacing[2],
  },
  garmentType: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '500',
  },
  garmentDetail: {
    ...typography['body-sm'],
    color: colors.text.secondary,
    marginTop: 2,
  },
  garmentNote: {
    ...typography.caption,
    color: colors.text.tertiary,
    fontStyle: 'italic',
    marginTop: 2,
  },
  garmentActions: {
    flexDirection: 'row',
    gap: spacing[2],
    paddingTop: spacing[1],
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
  },
  addButton: {
    marginTop: spacing[3],
    borderRadius: borderRadius.lg,
    borderColor: colors.primary[500],
  },
  bottomBar: {
    padding: spacing[4],
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  saveButton: {
    borderRadius: borderRadius.lg,
    paddingVertical: spacing[1],
  },
  backButton: {
    marginTop: spacing[4],
    backgroundColor: colors.primary[500],
    borderRadius: borderRadius.lg,
  },
  errorText: {
    ...typography.body,
    color: colors.text.secondary,
    marginTop: spacing[3],
  },
  dialog: {
    maxHeight: '85%',
  },
  formContainer: {
    maxHeight: 400,
  },
  formSectionTitle: {
    ...typography['label-lg'],
    color: colors.text.primary,
    fontWeight: '600',
    marginBottom: spacing[2],
    marginTop: spacing[3],
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  chip: {
    backgroundColor: colors.gray[100],
  },
  chipSelected: {
    backgroundColor: colors.primary[500],
  },
  chipText: {
    ...typography['label'],
    color: colors.text.secondary,
    fontSize: 12,
  },
  chipTextSelected: {
    color: colors.white,
  },
  formInput: {
    backgroundColor: colors.surface,
    marginTop: spacing[2],
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  qtyButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  qtyButtonDisabled: {
    backgroundColor: colors.gray[100],
  },
  qtyValue: {
    ...typography['label-lg'],
    color: colors.text.primary,
    minWidth: 32,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
  },
  formActions: {
    flexDirection: 'row',
    gap: spacing[2],
    marginTop: spacing[4],
  },
  formActionButton: {
    flex: 1,
    borderRadius: borderRadius.lg,
  },
});
