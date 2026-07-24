import { CONFIG } from './environment';

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
    defaultValue: true,
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

export function isFeatureEnabled(flagKey: string): boolean {
  const flag = FEATURE_FLAGS[flagKey];
  if (!flag) return false;

  if (flag.envOverrides?.[CONFIG.env] !== undefined) {
    return flag.envOverrides[CONFIG.env]!;
  }

  return flag.defaultValue;
}
