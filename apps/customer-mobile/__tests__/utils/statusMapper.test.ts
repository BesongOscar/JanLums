import { getStatusTranslation, getProgressPercent, STATUS_MAP } from '../../src/utils/statusMapper';

describe('statusMapper', () => {
  describe('getStatusTranslation', () => {
    it('returns correct translation for pending', () => {
      const result = getStatusTranslation('pending');
      expect(result.label).toBe('Order Placed');
      expect(result.color).toBe('#D97706');
      expect(result.backgroundColor).toBe('#FEF3C7');
      expect(result.icon).toBe('clock-outline');
      expect(result.showInTimeline).toBe(true);
      expect(result.isTerminal).toBe(false);
    });

    it('returns correct translation for completed', () => {
      const result = getStatusTranslation('completed');
      expect(result.label).toBe('Completed');
      expect(result.color).toBe('#047857');
      expect(result.backgroundColor).toBe('#D1FAE5');
      expect(result.icon).toBe('check-all');
      expect(result.isTerminal).toBe(true);
    });

    it('returns correct translation for cancelled', () => {
      const result = getStatusTranslation('cancelled');
      expect(result.label).toBe('Cancelled');
      expect(result.isTerminal).toBe(true);
    });

    it('returns pending as fallback for unknown status', () => {
      const result = getStatusTranslation('unknown_status' as any);
      expect(result.label).toBe('Order Placed');
    });
  });

  describe('getProgressPercent', () => {
    it('returns 0 for pending', () => {
      expect(getProgressPercent('pending')).toBe(0);
    });

    it('returns 100 for completed', () => {
      expect(getProgressPercent('completed')).toBe(100);
    });

    it('returns 50 for in_dry', () => {
      expect(getProgressPercent('in_dry')).toBe(50);
    });

    it('returns 0 for cancelled', () => {
      expect(getProgressPercent('cancelled')).toBe(0);
    });
  });

  describe('STATUS_MAP', () => {
    it('contains all expected statuses', () => {
      const expectedStatuses = [
        'pending', 'received', 'tagged', 'in_wash', 'in_dry',
        'in_press', 'quality_check', 'ready', 'out_for_delivery',
        'completed', 'cancelled', 'rewash', 'damaged', 'on_hold',
      ];
      expectedStatuses.forEach((status) => {
        expect(STATUS_MAP[status as keyof typeof STATUS_MAP]).toBeDefined();
      });
    });

    it('each status has required fields', () => {
      Object.values(STATUS_MAP).forEach((translation) => {
        expect(translation).toHaveProperty('label');
        expect(translation).toHaveProperty('color');
        expect(translation).toHaveProperty('backgroundColor');
        expect(translation).toHaveProperty('icon');
        expect(translation).toHaveProperty('showInTimeline');
        expect(translation).toHaveProperty('timelinePosition');
        expect(translation).toHaveProperty('isTerminal');
      });
    });
  });
});
