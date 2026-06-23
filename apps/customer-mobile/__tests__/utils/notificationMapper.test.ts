import {
  getNotificationTypeConfig,
  getNotificationLabel,
} from '../../src/utils/notificationMapper';
import { BackendNotificationType } from '../../src/types';

describe('notificationMapper', () => {
  describe('getNotificationTypeConfig', () => {
    const types: BackendNotificationType[] = [
      'order_created',
      'order_received',
      'order_processing',
      'order_ready',
      'order_completed',
      'system',
    ];

    types.forEach((type) => {
      it(`returns config for ${type}`, () => {
        const config = getNotificationTypeConfig(type);
        expect(config.label).toBeDefined();
        expect(config.label.length).toBeGreaterThan(0);
        expect(config.icon).toBeDefined();
        expect(config.color).toBeDefined();
        expect(config.backgroundColor).toBeDefined();
      });
    });

    it('returns system config for unknown type', () => {
      const config = getNotificationTypeConfig('unknown' as BackendNotificationType);
      expect(config.label).toBe('System');
      expect(config.icon).toBe('information');
    });

    it('order_created has correct label', () => {
      expect(getNotificationTypeConfig('order_created').label).toBe('Order Created');
    });

    it('order_received has correct label', () => {
      expect(getNotificationTypeConfig('order_received').label).toBe('Order Received');
    });

    it('order_processing has correct label', () => {
      expect(getNotificationTypeConfig('order_processing').label).toBe('Processing');
    });

    it('order_ready has correct label', () => {
      expect(getNotificationTypeConfig('order_ready').label).toBe('Ready for Pickup');
    });

    it('order_completed has correct label', () => {
      expect(getNotificationTypeConfig('order_completed').label).toBe('Completed');
    });

    it('system has correct label', () => {
      expect(getNotificationTypeConfig('system').label).toBe('System');
    });

    it('order_created has clipboard-check icon', () => {
      expect(getNotificationTypeConfig('order_created').icon).toBe('clipboard-check');
    });

    it('order_ready has bell-ring icon', () => {
      expect(getNotificationTypeConfig('order_ready').icon).toBe('bell-ring');
    });
  });

  describe('getNotificationLabel', () => {
    it('returns label for order_created', () => {
      expect(getNotificationLabel('order_created')).toBe('Order Created');
    });

    it('returns label for order_ready', () => {
      expect(getNotificationLabel('order_ready')).toBe('Ready for Pickup');
    });

    it('returns label for system type', () => {
      expect(getNotificationLabel('system')).toBe('System');
    });
  });
});
