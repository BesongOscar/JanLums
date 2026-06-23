import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BackendNotificationType } from '../types';
import { colors } from '../config/colors';

export interface NotificationTypeConfig {
  label: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  color: string;
  backgroundColor: string;
}

const NOTIFICATION_TYPE_MAP: Record<BackendNotificationType, NotificationTypeConfig> = {
  order_created: {
    label: 'Order Created',
    icon: 'clipboard-check',
    color: '#2563EB',
    backgroundColor: '#DBEAFE',
  },
  order_received: {
    label: 'Order Received',
    icon: 'package-variant-closed',
    color: '#059669',
    backgroundColor: '#D1FAE5',
  },
  order_processing: {
    label: 'Processing',
    icon: 'cogs',
    color: '#D97706',
    backgroundColor: '#FEF3C7',
  },
  order_ready: {
    label: 'Ready for Pickup',
    icon: 'bell-ring',
    color: '#0078D4',
    backgroundColor: '#E6F0FA',
  },
  order_completed: {
    label: 'Completed',
    icon: 'check-circle',
    color: '#047857',
    backgroundColor: '#D1FAE5',
  },
  system: {
    label: 'System',
    icon: 'information',
    color: '#6B7280',
    backgroundColor: '#F3F4F6',
  },
};

export function getNotificationTypeConfig(type: BackendNotificationType): NotificationTypeConfig {
  return NOTIFICATION_TYPE_MAP[type] ?? NOTIFICATION_TYPE_MAP.system;
}

export function getNotificationLabel(type: BackendNotificationType): string {
  return getNotificationTypeConfig(type).label;
}
