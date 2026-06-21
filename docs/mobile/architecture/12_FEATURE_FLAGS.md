# 12 — Feature Flag System

**Version:** 2.0.0
**Status:** Active
**Last Updated:** 2026-06-20
**Revisions Applied:** #12 (Feature Flag System)

---

## 1. Feature Flags Definition

```typescript
// src/config/features.ts

export interface FeatureFlag {
  key: string;
  label: string;
  description: string;
  defaultValue: boolean;
  envOverrides?: Partial<Record<string, boolean>>;
}

export const FEATURE_FLAGS: Record<string, FeatureFlag> = {
  payments: {
    key: 'payments',
    label: 'Digital Payments',
    description: 'Enable MTN MoMo and Orange Money payments',
    defaultValue: false,
    envOverrides: {
      development: false,
      staging: true,
      production: true,
    },
  },
  pushNotifications: {
    key: 'pushNotifications',
    label: 'Push Notifications',
    description: 'Enable push notification delivery',
    defaultValue: false,
    envOverrides: {
      development: false,
      staging: true,
      production: true,
    },
  },
  qrScanner: {
    key: 'qrScanner',
    label: 'QR Scanner',
    description: 'Enable QR code scanning for order lookup',
    defaultValue: true,
  },
  liveTracking: {
    key: 'liveTracking',
    label: 'Live Order Tracking',
    description: 'Enable real-time order status updates',
    defaultValue: false,
    envOverrides: {
      development: false,
      staging: true,
      production: true,
    },
  },
  addressManagement: {
    key: 'addressManagement',
    label: 'Address Management',
    description: 'Enable saved address feature',
    defaultValue: true,
  },
  notifications: {
    key: 'notifications',
    label: 'Notification Center',
    description: 'Enable in-app notification center',
    defaultValue: true,
  },
  deliveryTracking: {
    key: 'deliveryTracking',
    label: 'Delivery Tracking',
    description: 'Enable delivery map and tracking',
    defaultValue: false,
    envOverrides: {
      development: false,
      staging: false,
      production: true,
    },
  },
  loyaltyProgram: {
    key: 'loyaltyProgram',
    label: 'Loyalty Program',
    description: 'Enable loyalty points and tiers',
    defaultValue: false,
  },
  promotions: {
    key: 'promotions',
    label: 'Promotions',
    description: 'Enable promotional banners and offers',
    defaultValue: false,
    envOverrides: {
      development: false,
      staging: true,
      production: true,
    },
  },
};
```

---

## 2. Feature Flag Hook

```typescript
// src/hooks/useFeatureFlag.ts
import { CONFIG } from '../config/environment';
import { FEATURE_FLAGS } from '../config/features';

export function useFeatureFlag(flagKey: string): boolean {
  const flag = FEATURE_FLAGS[flagKey];
  if (!flag) return false;
  
  // Check environment override
  if (flag.envOverrides?.[CONFIG.env] !== undefined) {
    return flag.envOverrides[CONFIG.env]!;
  }
  
  return flag.defaultValue;
}

export function useFeatureFlags(): Record<string, boolean> {
  const flags: Record<string, boolean> = {};
  
  for (const [key, flag] of Object.entries(FEATURE_FLAGS)) {
    if (flag.envOverrides?.[CONFIG.env] !== undefined) {
      flags[key] = flag.envOverrides[CONFIG.env]!;
    } else {
      flags[key] = flag.defaultValue;
    }
  }
  
  return flags;
}
```

---

## 3. Usage in Components

```typescript
// Conditional rendering based on feature flags
function HomeScreen() {
  const paymentsEnabled = useFeatureFlag('payments');
  const notificationsEnabled = useFeatureFlag('notifications');
  
  return (
    <ScreenContainer>
      <ServiceCarousel />
      <RecentOrders />
      
      {paymentsEnabled && <PaymentBanner />}
      
      {notificationsEnabled && <NotificationBell />}
    </ScreenContainer>
  );
}

// Conditional navigation
function OrderConfirmationScreen() {
  const paymentsEnabled = useFeatureFlag('payments');
  
  return (
    <View>
      <OrderSummary />
      {paymentsEnabled ? (
        <PaymentButton />
      ) : (
        <Text>Pay at branch on pickup</Text>
      )}
    </View>
  );
}
```

---

## 4. Flag States by Environment

| Flag | Development | Staging | Production |
|------|-------------|---------|------------|
| `payments` | OFF | ON | ON |
| `pushNotifications` | OFF | ON | ON |
| `qrScanner` | ON | ON | ON |
| `liveTracking` | OFF | ON | ON |
| `addressManagement` | ON | ON | ON |
| `notifications` | ON | ON | ON |
| `deliveryTracking` | OFF | OFF | ON |
| `loyaltyProgram` | OFF | OFF | OFF |
| `promotions` | OFF | ON | ON |

---

## 5. Remote Feature Flags (Future)

When a remote feature flag service is integrated:

```typescript
// Future: Remote flag fetching
export async function fetchRemoteFlags(): Promise<void> {
  const { data } = await api.get('/feature-flags');
  remoteFlags = data;
}

// Merge local + remote
export function isFeatureEnabled(key: string): boolean {
  // Remote overrides local
  if (remoteFlags[key] !== undefined) return remoteFlags[key];
  return FEATURE_FLAGS[key]?.defaultValue ?? false;
}
```
