# 07 — Zustand Store Design

**Version:** 2.0.0
**Status:** Active
**Last Updated:** 2026-06-20
**Revisions Applied:** #2 (SecureStore), #6 (Pricing Authority)

---

## 1. Storage Strategy

| Store | Persistence | Storage | Purpose |
|-------|-------------|---------|---------|
| `authStore` | SecureStore | `expo-secure-store` | Token, credentials |
| `authStore` (profile) | AsyncStorage | `@react-native-async-storage` | User profile |
| `orderDraftStore` | AsyncStorage | `@react-native-async-storage` | Order draft |
| `notificationStore` | AsyncStorage | `@react-native-async-storage` | Notification preferences |
| `uiStore` | None | Memory only | Online status, theme |

---

## 2. Auth Store

```typescript
interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  tenantId: string;
}

interface AuthState {
  // State
  token: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  tenantId: string | null;
  isAuthenticated: boolean;

  // Actions
  setAuth: (token: string, refreshToken: string, user: AuthUser) => void;
  logout: () => void;
  updateUser: (updates: Partial<AuthUser>) => void;
  getTenantId: () => string | null;
  getUserId: () => string | null;
}
```

### Persistence Logic

```typescript
// On login:
await SecureStore.setItemAsync('accessToken', token);
await AsyncStorage.setItem('auth-user', JSON.stringify(user));

// On logout:
await SecureStore.deleteItemAsync('accessToken');
await AsyncStorage.removeItem('auth-user');

// On app load:
const token = await SecureStore.getItemAsync('accessToken');
const userJson = await AsyncStorage.getItem('auth-user');
```

---

## 3. Order Draft Store (Revised — No Pricing)

```typescript
interface OrderDraftItem {
  garmentType: string;
  fabricType?: string;
  color?: string;
  quantity: number;
  unitPrice: number;           // Display only — not authoritative
  specialInstructions?: string;
}

interface OrderDraftState {
  // State
  serviceId: string | null;
  serviceName: string | null;
  items: OrderDraftItem[];
  pickupType: 'drop-off' | 'pickup' | 'delivery';
  branchId: string | null;
  branchName: string | null;
  scheduledDate: string | null;
  scheduledTime: string | null;
  notes: string;
  isExpress: boolean;

  // Computed (estimates only)
  getEstimatedSubtotal: () => number;
  getEstimatedTax: () => number;
  getEstimatedTotal: () => number;
  getItemCount: () => number;
  isValid: () => boolean;

  // Actions
  setService: (id: string, name: string) => void;
  addItem: (item: OrderDraftItem) => void;
  removeItem: (index: number) => void;
  updateItem: (index: number, updates: Partial<OrderDraftItem>) => void;
  setPickupType: (type: 'drop-off' | 'pickup' | 'delivery') => void;
  setBranch: (id: string, name: string) => void;
  setScheduledDate: (date: string | null) => void;
  setScheduledTime: (time: string | null) => void;
  setNotes: (notes: string) => void;
  setExpress: (isExpress: boolean) => void;
  reset: () => void;
  toOrderPayload: (tenantId: string, customerId: string) => object;
}

// Computed methods (estimates only):
getEstimatedSubtotal: () => {
  return items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
}

getEstimatedTax: () => {
  return getEstimatedSubtotal() * 0.1925; // TVA display only
}

getEstimatedTotal: () => {
  const subtotal = getEstimatedSubtotal();
  const tax = getEstimatedTax();
  const express = isExpress ? subtotal * 0.5 : 0;
  return subtotal + tax + express;
}

// API payload builder:
toOrderPayload: (tenantId, customerId) => ({
  tenantId,
  customerId,
  branchId,
  status: 'pending',
  isExpress,
  notes,
  pickupDate: scheduledDate && scheduledTime
    ? `${scheduledDate}T${scheduledTime}` : undefined,
  items: items.map(item => ({
    garmentType: item.garmentType,
    fabricType: item.fabricType,
    color: item.color,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    totalPrice: item.unitPrice * item.quantity,
    specialInstructions: item.specialInstructions,
    status: 'pending',
  })),
})
```

---

## 4. Notification Store

```typescript
interface Notification {
  id: string;
  title: string;
  body: string;
  type: 'order_update' | 'promotion' | 'system';
  orderId?: string;
  read: boolean;
  createdAt: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  getUnreadCount: () => number;
}
```

---

## 5. UI Store

```typescript
interface UIState {
  isOnline: boolean;
  theme: 'light' | 'dark';
  searchQuery: string;
  selectedCategory: string | null;
  showOrderSuccess: boolean;

  setOnline: (online: boolean) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string | null) => void;
  setShowOrderSuccess: (show: boolean) => void;
}
```

---

## 6. Store Interaction Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                        SCREEN LAYER                               │
│                                                                   │
│  LoginScreen ────────► useAuthStore                               │
│  HomeScreen ─────────► useAuthStore + useUIStore + useNotificationStore
│  ServiceSelectScreen ► useOrderDraftStore + useUIStore            │
│  OrderReviewScreen ──► useOrderDraftStore                         │
│  ConfirmationScreen ─► useOrderDraftStore + useAuthStore          │
│  TrackScreen ────────► useAuthStore + useUIStore                  │
│  ProfileScreen ──────► useAuthStore                               │
│  NotificationsScreen ► useNotificationStore                       │
│  AddressListScreen ──► useAuthStore (React Query for addresses)   │
└──────────────────────────────────────────────────────────────────┘
         │                        │                        │
         ▼                        ▼                        ▼
┌─────────────────┐  ┌──────────────────────┐  ┌─────────────────┐
│  AuthStore       │  │  OrderDraftStore      │  │  UIStore         │
│  (SecureStore    │  │  (AsyncStorage)       │  │  (Memory only)   │
│   + AsyncStorage)│  │                       │  │                  │
└─────────────────┘  └──────────────────────┘  └─────────────────┘
         │                        │                        │
         ▼                        ▼                        ▼
┌─────────────────┐  ┌──────────────────────┐  ┌─────────────────┐
│  Notification    │  │  React Query Cache    │  │  Feature Flags   │
│  Store           │  │  (Server State)       │  │  (Config)        │
│  (AsyncStorage)  │  │                       │  │                  │
└─────────────────┘  └──────────────────────┘  └─────────────────┘
```
