import { Order, OrderStatus } from '../../src/types';

type ComputedStats = {
  total: number;
  active: number;
  completed: number;
  recent: Order[];
};

function computeStats(orders: Order[]): ComputedStats {
  return {
    total: orders.length,
    active: orders.filter((o) => !['completed', 'cancelled'].includes(o.status)).length,
    completed: orders.filter((o) => o.status === 'completed').length,
    recent: orders.slice(0, 3),
  };
}

function createMockOrder(id: string, status: OrderStatus): Order {
  return {
    id,
    tenantId: 'tenant-1',
    branchId: 'branch-1',
    status,
    subtotal: 1000,
    tax: 50,
    discount: 0,
    total: 1050,
    amountPaid: 0,
    isExpress: false,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  };
}

describe('Dashboard Stats Computation', () => {
  it('returns zeros for empty orders', () => {
    const stats = computeStats([]);
    expect(stats.total).toBe(0);
    expect(stats.active).toBe(0);
    expect(stats.completed).toBe(0);
    expect(stats.recent).toEqual([]);
  });

  it('computes correct stats', () => {
    const orders: Order[] = [
      createMockOrder('1', 'completed'),
      createMockOrder('2', 'pending'),
      createMockOrder('3', 'in_wash'),
      createMockOrder('4', 'completed'),
      createMockOrder('5', 'cancelled'),
    ];

    const stats = computeStats(orders);
    expect(stats.total).toBe(5);
    expect(stats.active).toBe(2);
    expect(stats.completed).toBe(2);
  });

  it('returns most recent 3 orders', () => {
    const orders: Order[] = [
      createMockOrder('1', 'completed'),
      createMockOrder('2', 'pending'),
      createMockOrder('3', 'in_wash'),
      createMockOrder('4', 'completed'),
    ];

    const stats = computeStats(orders);
    expect(stats.recent).toHaveLength(3);
    expect(stats.recent[0].id).toBe('1');
    expect(stats.recent[1].id).toBe('2');
    expect(stats.recent[2].id).toBe('3');
  });

  it('does not count cancelled as active', () => {
    const orders: Order[] = [
      createMockOrder('1', 'cancelled'),
      createMockOrder('2', 'cancelled'),
    ];

    const stats = computeStats(orders);
    expect(stats.total).toBe(2);
    expect(stats.active).toBe(0);
    expect(stats.completed).toBe(0);
  });

  it('treats ready and out_for_delivery as active', () => {
    const orders: Order[] = [
      createMockOrder('1', 'ready'),
      createMockOrder('2', 'out_for_delivery'),
      createMockOrder('3', 'completed'),
    ];

    const stats = computeStats(orders);
    expect(stats.active).toBe(2);
    expect(stats.completed).toBe(1);
  });
});
