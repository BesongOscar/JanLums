import { getOrderStatusDescription, getOrderStatusLabel } from '../../src/utils/orderStatusDescriptions';

describe('orderStatusDescriptions', () => {
  describe('getOrderStatusDescription', () => {
    it('returns expected description for pending', () => {
      const description = getOrderStatusDescription('pending');
      expect(description).toBe('Your order has been received and is awaiting confirmation.');
    });

    it('returns expected description for processing statuses', () => {
      expect(getOrderStatusDescription('in_wash')).toContain('being washed');
      expect(getOrderStatusDescription('in_dry')).toContain('being dried');
      expect(getOrderStatusDescription('in_press')).toContain('being ironed');
    });

    it('returns expected description for ready', () => {
      expect(getOrderStatusDescription('ready')).toContain('ready');
    });

    it('returns description for completed', () => {
      const description = getOrderStatusDescription('completed');
      expect(description).toContain('completed');
    });

    it('returns description for cancelled', () => {
      const description = getOrderStatusDescription('cancelled');
      expect(description).toContain('cancelled');
    });

    it('returns description for all known statuses', () => {
      const statuses = [
        'pending', 'received', 'tagged', 'in_wash', 'in_dry',
        'in_press', 'quality_check', 'ready', 'out_for_delivery',
        'completed', 'cancelled', 'rewash', 'damaged', 'on_hold',
      ] as const;
      statuses.forEach((status) => {
        const description = getOrderStatusDescription(status);
        expect(description).toBeTruthy();
        expect(typeof description).toBe('string');
      });
    });
  });

  describe('getOrderStatusLabel', () => {
    it('returns expected label for pending', () => {
      expect(getOrderStatusLabel('pending')).toBe('Order Placed');
    });

    it('returns expected label for completed', () => {
      expect(getOrderStatusLabel('completed')).toBe('Completed');
    });

    it('returns expected label for in_wash', () => {
      expect(getOrderStatusLabel('in_wash')).toBe('Washing in Progress');
    });
  });
});
