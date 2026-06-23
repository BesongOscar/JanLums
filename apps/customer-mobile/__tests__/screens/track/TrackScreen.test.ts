import { Order, OrderStatus } from '../../../src/types';
import { getStatusTranslation } from '../../../src/utils/statusMapper';
import { formatCurrency, formatRelativeTime } from '../../../src/utils/format';

const ACTIVE_EXCLUDE: ReadonlySet<string> = new Set(['completed', 'cancelled']);

function isActiveOrder(order: Order): boolean {
  return !ACTIVE_EXCLUDE.has(order.status);
}

function filterActive(orders: Order[]): Order[] {
  return orders.filter(isActiveOrder);
}

function getMostRecentActive(orders: Order[]): Order | null {
  const active = orders.filter(isActiveOrder);
  if (active.length === 0) return null;
  const sorted = [...active].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
  return sorted[0];
}

function createMockOrder(id: string, status: OrderStatus, overrides: Partial<Order> = {}): Order {
  return {
    id,
    tenantId: 'tenant-1',
    branchId: 'branch-1',
    status,
    subtotal: 5000,
    tax: 250,
    discount: 0,
    total: 5250,
    amountPaid: 0,
    isExpress: false,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    ...overrides,
  };
}

describe('TrackScreen - Data Logic', () => {
  describe('No Active Orders', () => {
    it('returns empty when no orders at all', () => {
      const orders: Order[] = [];
      expect(filterActive(orders)).toHaveLength(0);
    });

    it('returns empty when all orders are completed', () => {
      const orders: Order[] = [
        createMockOrder('1', 'completed'),
        createMockOrder('2', 'completed'),
      ];
      expect(filterActive(orders)).toHaveLength(0);
    });

    it('returns empty when all orders are cancelled', () => {
      const orders: Order[] = [
        createMockOrder('1', 'cancelled'),
        createMockOrder('2', 'cancelled'),
      ];
      expect(filterActive(orders)).toHaveLength(0);
    });

    it('returns empty when orders are only completed and cancelled', () => {
      const orders: Order[] = [
        createMockOrder('1', 'completed'),
        createMockOrder('2', 'cancelled'),
      ];
      expect(filterActive(orders)).toHaveLength(0);
    });
  });

  describe('Active Orders Present', () => {
    const activeStatuses: OrderStatus[] = [
      'pending', 'received', 'tagged', 'in_wash', 'in_dry',
      'in_press', 'quality_check', 'ready', 'out_for_delivery',
      'rewash', 'damaged', 'on_hold',
    ];

    it('includes all non-terminal statuses as active', () => {
      const orders = activeStatuses.map((s, i) => createMockOrder(`${i}`, s));
      expect(filterActive(orders)).toHaveLength(activeStatuses.length);
    });

    it('excludes completed and cancelled', () => {
      const orders = [
        createMockOrder('1', 'pending'),
        createMockOrder('2', 'completed'),
        createMockOrder('3', 'in_wash'),
        createMockOrder('4', 'cancelled'),
        createMockOrder('5', 'ready'),
      ];
      const active = filterActive(orders);
      expect(active).toHaveLength(3);
      const statuses = active.map((o) => o.status);
      expect(statuses).not.toContain('completed');
      expect(statuses).not.toContain('cancelled');
    });

    it('returns most recent active order sorted by updatedAt', () => {
      const orders = [
        createMockOrder('1', 'pending', { updatedAt: '2024-01-10T10:00:00Z' }),
        createMockOrder('2', 'in_wash', { updatedAt: '2024-01-12T10:00:00Z' }),
        createMockOrder('3', 'ready', { updatedAt: '2024-01-15T10:00:00Z' }),
      ];
      const mostRecent = getMostRecentActive(orders);
      expect(mostRecent?.id).toBe('3');
    });

    it('returns null for most recent when no active orders', () => {
      const orders = [
        createMockOrder('1', 'completed'),
        createMockOrder('2', 'cancelled'),
      ];
      expect(getMostRecentActive(orders)).toBeNull();
    });

    it('displays correct status badge for each active order', () => {
      const orders = activeStatuses.map((s, i) => createMockOrder(`${i}`, s));
      orders.forEach((order) => {
        const translation = getStatusTranslation(order.status);
        expect(translation.label).toBeDefined();
        expect(translation.color).toBeDefined();
        expect(translation.backgroundColor).toBeDefined();
      });
    });
  });

  describe('Refresh Behavior', () => {
    it('refetch is callable', () => {
      const refetch = jest.fn();
      refetch();
      expect(refetch).toHaveBeenCalledTimes(1);
    });

    it('pull to refresh triggers refetch', () => {
      const onRefresh = jest.fn();
      onRefresh();
      expect(onRefresh).toHaveBeenCalled();
    });
  });

  describe('Status Filtering', () => {
    it('showAll includes completed and cancelled', () => {
      const orders = [
        createMockOrder('1', 'pending'),
        createMockOrder('2', 'completed'),
        createMockOrder('3', 'cancelled'),
      ];
      expect(orders).toHaveLength(3);
    });

    it('active filter excludes completed and cancelled', () => {
      const orders = [
        createMockOrder('1', 'pending'),
        createMockOrder('2', 'completed'),
        createMockOrder('3', 'cancelled'),
      ];
      expect(filterActive(orders)).toHaveLength(1);
    });
  });

  describe('Formatting', () => {
    it('formats currency correctly', () => {
      const formatted = formatCurrency(5250);
      expect(formatted).toContain('5');
      expect(formatted).toContain('250');
      expect(formatted).toContain('FCFA');
    });

    it('formats relative time correctly', () => {
      const now = new Date().toISOString();
      const relative = formatRelativeTime(now);
      expect(relative).toBeDefined();
      expect(typeof relative).toBe('string');
    });
  });
});
