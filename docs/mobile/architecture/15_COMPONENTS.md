# 15 — Component Inventory

**Version:** 2.0.0
**Status:** Active
**Last Updated:** 2026-06-20

---

## 1. Atomic Components (`src/components/ui/`)

| Component | Props | Description |
|-----------|-------|-------------|
| `Button` | `variant, size, loading, disabled, onPress, icon, children` | Touchable button with loading state |
| `Card` | `variant, padding, onPress, children` | Container card |
| `Input` | `label, value, onChangeText, error, placeholder, secureTextEntry, keyboardType, multiline` | Text input with label/error |
| `Loading` | `size, color` | Activity indicator wrapper |
| `EmptyState` | `icon, title, description, action` | Empty state placeholder |
| `ErrorBoundary` | `children, fallback` | Error boundary wrapper |
| `Badge` | `count, variant` | Numeric badge |
| `Avatar` | `uri, name, size` | User avatar with initials |
| `Divider` | `spacing` | Horizontal separator |
| `Text` | `variant, color, align, children` | Typography component |
| `Icon` | `name, size, color` | Icon wrapper |
| `Toast` | `message, type, duration, visible` | Global toast notification |

---

## 2. Feature Components (`src/components/features/`)

| Component | Props | Used By |
|-----------|-------|---------|
| `ServiceCard` | `service, selected, onSelect` | ServiceSelectScreen |
| `ServiceCategoryFilter` | `categories, selected, onSelect` | ServiceSelectScreen |
| `GarmentListItem` | `item, index, onRemove, onUpdate` | GarmentEntryScreen |
| `GarmentTypePicker` | `selected, onSelect` | GarmentEntryScreen |
| `BranchCard` | `branch, selected, onSelect` | PickupDetailsScreen |
| `DatePicker` | `value, onChange, minDate, maxDate` | PickupDetailsScreen |
| `TimePicker` | `value, onChange, options` | PickupDetailsScreen |
| `OrderSummaryCard` | `order, compact` | OrderDetailScreen |
| `StatusTimeline` | `status, createdAt` | OrderDetailScreen |
| `OrderStatusBadge` | `status` | OrderCard, OrderSummaryCard |
| `OrderCard` | `order, onPress` | TrackScreen, OrderHistoryScreen |
| `QRCodeDisplay` | `qrData, size, onShare` | ConfirmationScreen |
| `QRScanner` | `onScan, onClose` | QRScanScreen |
| `ProfileField` | `label, value, editable, onPress` | ProfileScreen |
| `OrderHistoryItem` | `order, onPress, onReorder` | OrderHistoryScreen |
| `PriceBreakdown` | `subtotal, tax, discount, total, isEstimate` | OrderReviewScreen |
| `PaymentMethodSelector` | `selected, onSelect` | PaymentScreen |
| `NotificationItem` | `notification, onPress, onRead` | NotificationsScreen |
| `AddressCard` | `address, selected, onSelect, onEdit, onDelete` | AddressListScreen |
| `AddressForm` | `address, onSubmit` | AddAddressScreen, EditAddressScreen |
| `OfflineBanner` | `isOnline` | All screens |
| `OrderSuccessModal` | `order, visible, onClose` | ConfirmationScreen |

---

## 3. Layout Components

| Component | Props | Used By |
|-----------|-------|---------|
| `ScreenContainer` | `children, scrollable, padding` | All screens |
| `Header` | `title, showBack, rightAction` | All stack screens |
| `BottomSheet` | `visible, onClose, children` | Pickers, modals |
| `SearchBar` | `value, onChangeText, placeholder` | TrackScreen |
| `TabIcon` | `name, focused, color` | Tab bar |

---

## 4. Shared Types

```typescript
// src/types/index.ts

export type OrderStatus = 
  | 'pending' | 'received' | 'tagged' | 'in_wash' | 'in_dry'
  | 'in_press' | 'quality_check' | 'ready' | 'out_for_delivery'
  | 'completed' | 'cancelled' | 'rewash' | 'damaged' | 'on_hold';

export type PaymentProvider = 'mtn' | 'orange' | 'cash' | 'card';

export type AddressLabel = 'home' | 'work' | 'other';

export type NotificationType =
  | 'order_received' | 'order_status_update' | 'order_ready'
  | 'order_completed' | 'order_cancelled' | 'order_issue'
  | 'payment_reminder' | 'promotion' | 'system';
```

---

## 5. Component Dependencies

```
ui/
├── Button ──────────► Icon, Loading
├── Card ────────────► Text
├── Input ───────────► Text, Icon
├── Badge ───────────► Text
├── Avatar ──────────► Text
├── Toast ───────────► Icon
└── ErrorBoundary ───► Button, Text

features/
├── ServiceCard ─────► Card, Badge, Icon, Text
├── OrderCard ───────► Card, OrderStatusBadge, Text
├── StatusTimeline ──► Icon, Text, Divider
├── QRCodeDisplay ───► Button (share)
├── PriceBreakdown ──► Text, Divider
└── AddressCard ─────► Card, Button, Icon
```
