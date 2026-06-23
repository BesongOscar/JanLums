import { OrderStatus } from '../../src/types';
import { getStatusTranslation, getTimelineStatuses } from '../../src/utils/statusMapper';

describe('OrderTimeline - Data Logic', () => {
  describe('Timeline Statuses', () => {
    it('returns all timeline-visible statuses in order', () => {
      const statuses = getTimelineStatuses();
      expect(statuses.length).toBeGreaterThan(0);
      statuses.forEach((status) => {
        const translation = getStatusTranslation(status);
        expect(translation.showInTimeline).toBe(true);
        expect(translation.timelinePosition).toBeGreaterThan(0);
      });
    });

    it('statuses are sorted by timelinePosition', () => {
      const statuses = getTimelineStatuses();
      for (let i = 1; i < statuses.length; i++) {
        const prev = getStatusTranslation(statuses[i - 1]);
        const curr = getStatusTranslation(statuses[i]);
        expect(prev.timelinePosition).toBeLessThan(curr.timelinePosition);
      }
    });

    it('first status is pending', () => {
      const statuses = getTimelineStatuses();
      expect(statuses[0]).toBe('pending');
    });

    it('last status is completed', () => {
      const statuses = getTimelineStatuses();
      expect(statuses[statuses.length - 1]).toBe('completed');
    });

    it('includes intermediate processing statuses', () => {
      const statuses = getTimelineStatuses();
      expect(statuses).toContain('received');
      expect(statuses).toContain('in_wash');
      expect(statuses).toContain('in_dry');
      expect(statuses).toContain('in_press');
      expect(statuses).toContain('quality_check');
      expect(statuses).toContain('ready');
    });

    it('excludes hidden statuses from timeline', () => {
      const statuses = getTimelineStatuses();
      expect(statuses).not.toContain('tagged');
      expect(statuses).not.toContain('cancelled');
      expect(statuses).not.toContain('rewash');
      expect(statuses).not.toContain('damaged');
      expect(statuses).not.toContain('on_hold');
    });
  });

  describe('Each Status Stage', () => {
    const timelineStatuses = getTimelineStatuses();

    timelineStatuses.forEach((status) => {
      it(`status ${status} has valid timeline configuration`, () => {
        const translation = getStatusTranslation(status);
        expect(translation.label).toBeDefined();
        expect(translation.label.length).toBeGreaterThan(0);
        expect(translation.color).toBeDefined();
        expect(translation.backgroundColor).toBeDefined();
        expect(translation.icon).toBeDefined();
        expect(translation.icon.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Completed Orders', () => {
    it('completed status has all steps before it', () => {
      const statuses = getTimelineStatuses();
      const completedIndex = statuses.indexOf('completed');
      expect(completedIndex).toBeGreaterThan(0);
      expect(completedIndex).toBe(statuses.length - 1);
    });

    it('completed is marked as terminal', () => {
      const translation = getStatusTranslation('completed');
      expect(translation.isTerminal).toBe(true);
    });
  });

  describe('Active Orders', () => {
    const activeStatuses: OrderStatus[] = [
      'pending', 'received', 'in_wash', 'in_dry',
      'in_press', 'quality_check', 'ready', 'out_for_delivery',
    ];

    activeStatuses.forEach((status) => {
      it(`${status} shows correct timeline position`, () => {
        const timelineStatuses = getTimelineStatuses();
        const position = timelineStatuses.indexOf(status);
        expect(position).not.toBe(-1);
        const translation = getStatusTranslation(status);
        expect(translation.showInTimeline).toBe(true);
      });
    });
  });

  describe('Status Labels', () => {
    it('pending displays as Order Placed', () => {
      expect(getStatusTranslation('pending').label).toBe('Order Placed');
    });

    it('received displays as Received at Branch', () => {
      expect(getStatusTranslation('received').label).toBe('Received at Branch');
    });

    it('in_wash displays as Washing in Progress', () => {
      expect(getStatusTranslation('in_wash').label).toBe('Washing in Progress');
    });

    it('ready displays as Ready for Pickup', () => {
      expect(getStatusTranslation('ready').label).toBe('Ready for Pickup');
    });

    it('completed displays as Completed', () => {
      expect(getStatusTranslation('completed').label).toBe('Completed');
    });
  });
});
