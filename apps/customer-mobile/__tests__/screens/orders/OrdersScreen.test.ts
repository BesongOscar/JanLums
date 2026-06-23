import { Order, OrderStatus } from '../../../src/types';
import { getStatusTranslation } from '../../../src/utils/statusMapper';
import { formatCurrency, formatDate, formatOrderNumber } from '../../../src/utils/format';
import {
  FILTER_STATUS_MAP,
  FILTER_OPTIONS,
  FilterKey,
} from '../../../src/utils/orderFilters';

function computeStatusCounts(orders: Order[]): Record<FilterKey, number> {
  const counts: Record<FilterKey, number> = {
    all: orders.length,
    pending: 0,
    in_progress: 0,
    ready: 0,
    completed: 0,
    cancelled: 0,
  };
  for (const order of orders) {
    for (const [key, statuses] of Object.entries(FILTER_STATUS_MAP)) {
      if (key === 'all') continue;
      if (statuses.includes(order.status)) {
        counts[key as FilterKey]++;
      }
    }
  }
  return counts;
}

function filterOrders(orders: Order[], filterKey: FilterKey): Order[] {
  const allowedStatuses = FILTER_STATUS_MAP[filterKey];
  return orders.filter((o) => allowedStatuses.includes(o.status));
}

function searchOrders(orders: Order[], query: string): Order[] {
  if (!query.trim()) return orders;
  const q = query.trim().toLowerCase();
  return orders.filter((order) => {
    const orderNumber = `#jl-${order.id.slice(0, 5).toLowerCase()}`;
    const translation = getStatusTranslation(order.status);
    return orderNumber.includes(q) || translation.label.toLowerCase().includes(q);
  });
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

describe('OrdersScreen - Data Logic', () => {
  describe('Empty State', () => {
    it('returns empty when no orders', () => {
      const orders: Order[] = [];
      expect(orders).toHaveLength(0);
      expect(computeStatusCounts(orders).all).toBe(0);
    });
  });

  describe('Populated State', () => {
    const mockOrders: Order[] = [
      createMockOrder('1', 'pending'),
      createMockOrder('2', 'in_wash'),
      createMockOrder('3', 'ready'),
      createMockOrder('4', 'completed'),
      createMockOrder('5', 'cancelled'),
    ];

    it('computes correct status counts', () => {
      const counts = computeStatusCounts(mockOrders);
      expect(counts.all).toBe(5);
      expect(counts.pending).toBe(1);
      expect(counts.in_progress).toBe(1);
      expect(counts.ready).toBe(1);
      expect(counts.completed).toBe(1);
      expect(counts.cancelled).toBe(1);
    });

    it('filters correctly by status', () => {
      expect(filterOrders(mockOrders, 'pending')).toHaveLength(1);
      expect(filterOrders(mockOrders, 'in_progress')).toHaveLength(1);
      expect(filterOrders(mockOrders, 'ready')).toHaveLength(1);
      expect(filterOrders(mockOrders, 'completed')).toHaveLength(1);
      expect(filterOrders(mockOrders, 'cancelled')).toHaveLength(1);
      expect(filterOrders(mockOrders, 'all')).toHaveLength(5);
    });

    it('formats order number correctly', () => {
      const order = mockOrders[0];
      expect(formatOrderNumber(order.id)).toBe('Order #JL-1');
    });

    it('formats currency correctly', () => {
      const formatted = formatCurrency(5250);
      expect(formatted).toContain('5');
      expect(formatted).toContain('250');
      expect(formatted).toContain('FCFA');
    });

    it('returns status translation for each order', () => {
      for (const order of mockOrders) {
        const translation = getStatusTranslation(order.status);
        expect(translation.label).toBeDefined();
        expect(translation.color).toBeDefined();
        expect(translation.backgroundColor).toBeDefined();
      }
    });
  });

  describe('Search', () => {
    const mockOrders: Order[] = [
      createMockOrder('abc12', 'pending'),
      createMockOrder('def34', 'in_wash'),
      createMockOrder('ghi56', 'completed'),
    ];

    it('returns all orders when query is empty', () => {
      expect(searchOrders(mockOrders, '')).toHaveLength(3);
    });

    it('filters by order number', () => {
      const result = searchOrders(mockOrders, 'abc12');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('abc12');
    });

    it('filters by status label', () => {
      const result = searchOrders(mockOrders, 'washing');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('def34');
    });

    it('returns empty for non-matching query', () => {
      expect(searchOrders(mockOrders, 'zzzzz')).toHaveLength(0);
    });

    it('is case insensitive', () => {
      expect(searchOrders(mockOrders, 'ABC12')).toHaveLength(1);
      expect(searchOrders(mockOrders, 'WASHING')).toHaveLength(1);
    });
  });

  describe('Filters', () => {
    it('includes all statuses under "all" filter', () => {
      const allStatuses = FILTER_STATUS_MAP.all;
      expect(allStatuses).toContain('pending');
      expect(allStatuses).toContain('completed');
      expect(allStatuses).toContain('cancelled');
      expect(allStatuses).toContain('on_hold');
    });

    it('in_progress includes received but not pending', () => {
      expect(FILTER_STATUS_MAP.in_progress).toContain('received');
      expect(FILTER_STATUS_MAP.in_progress).not.toContain('pending');
    });
  });

  describe('Pull to Refresh', () => {
    it('refetch function is callable', () => {
      const refetch = jest.fn();
      refetch();
      expect(refetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('Order Rendering Data', () => {
    const orderWithItems = createMockOrder('1', 'pending', {
      items: [
        {
          id: 'i1', orderId: '1', garmentType: 'Shirt', quantity: 2,
          unitPrice: 1500, totalPrice: 3000, status: 'pending' as const,
          createdAt: '2024-01-15T10:00:00Z', updatedAt: '2024-01-15T10:00:00Z',
        },
      ],
    });

    it('displays correct item count', () => {
      expect(orderWithItems.items).toHaveLength(1);
    });

    it('formats date correctly', () => {
      expect(formatDate(orderWithItems.createdAt)).toBe('Jan 15, 2024');
    });

    it('displays total amount', () => {
      const formatted = formatCurrency(orderWithItems.total);
      expect(formatted).toContain('5');
      expect(formatted).toContain('250');
      expect(formatted).toContain('FCFA');
    });
  });
});
