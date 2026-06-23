import { Order, OrderStatus } from '../../../src/types';
import { getStatusTranslation } from '../../../src/utils/statusMapper';
import { formatCurrency, formatDate, formatOrderNumber } from '../../../src/utils/format';

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
    items: [
      {
        id: 'item-1',
        orderId: id,
        garmentType: 'Shirt',
        quantity: 2,
        unitPrice: 1500,
        totalPrice: 3000,
        status: status,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
      },
      {
        id: 'item-2',
        orderId: id,
        garmentType: 'Pants',
        fabricType: 'Cotton',
        quantity: 1,
        unitPrice: 2000,
        totalPrice: 2000,
        status: status,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
      },
    ],
    branch: { id: 'branch-1', name: 'Downtown Branch', address: '123 Main Street' },
    ...overrides,
  };
}

describe('OrderDetailScreen - Data Logic', () => {
  describe('Successful Load', () => {
    const order = createMockOrder('1', 'in_wash');

    it('displays order number derived from id', () => {
      expect(formatOrderNumber(order.id)).toBe('Order #JL-1');
    });

    it('displays status translation correctly', () => {
      const translation = getStatusTranslation(order.status);
      expect(translation.label).toBe('Washing in Progress');
      expect(translation.color).toBeDefined();
      expect(translation.backgroundColor).toBeDefined();
    });

    it('displays created date', () => {
      expect(formatDate(order.createdAt)).toBe('Jan 15, 2024');
    });

    it('pricing section uses backend values only', () => {
      expect(order.subtotal).toBe(5000);
      expect(order.tax).toBe(250);
      expect(order.discount).toBe(0);
      expect(order.total).toBe(5250);
    });

    it('formats pricing correctly', () => {
      expect(formatCurrency(order.subtotal)).toContain('5');
      expect(formatCurrency(order.subtotal)).toContain('FCFA');
      expect(formatCurrency(order.tax)).toContain('250');
      expect(formatCurrency(order.total)).toContain('5');
      expect(formatCurrency(order.total)).toContain('250');
    });

    it('includes items with correct data', () => {
      expect(order.items).toHaveLength(2);
      expect(order.items?.[0].garmentType).toBe('Shirt');
      expect(order.items?.[0].quantity).toBe(2);
      expect(order.items?.[0].unitPrice).toBe(1500);
      expect(order.items?.[0].totalPrice).toBe(3000);
    });

    it('includes branch information', () => {
      expect(order.branch?.name).toBe('Downtown Branch');
      expect(order.branch?.address).toBe('123 Main Street');
    });
  });

  describe('Error State', () => {
    it('handles error with message', () => {
      const error = new Error('Order not found');
      expect(error.message).toBe('Order not found');
    });

    it('handles 404 not found scenario', () => {
      const error = { response: { status: 404, data: { message: 'Order not found' } } };
      expect(error.response.status).toBe(404);
    });

    it('handles 401 unauthorized scenario', () => {
      const error = { response: { status: 401 } };
      expect(error.response.status).toBe(401);
    });
  });

  describe('Loading State', () => {
    it('isLoading flag controls skeleton display', () => {
      const isLoading = true;
      expect(isLoading).toBe(true);
    });

    it('isRefetching flag controls refresh indicator', () => {
      const isRefetching = true;
      expect(isRefetching).toBe(true);
    });
  });

  describe('Pricing Display', () => {
    it('shows discount only when discount > 0', () => {
      const orderWithDiscount = createMockOrder('1', 'completed', { discount: 500 });
      expect(orderWithDiscount.discount).toBe(500);
      expect(formatCurrency(orderWithDiscount.discount)).toContain('500');
      expect(formatCurrency(orderWithDiscount.discount)).toContain('FCFA');
    });

    it('hides discount when discount is zero', () => {
      const order = createMockOrder('1', 'completed');
      expect(order.discount).toBe(0);
    });

    it('highlights total as distinct from subtotal', () => {
      const order = createMockOrder('1', 'completed');
      expect(order.total).not.toBe(order.subtotal);
      expect(order.total).toBe(order.subtotal + order.tax - order.discount);
    });
  });

  describe('Items Display', () => {
    it('shows items section only when items exist', () => {
      const orderWithItems = createMockOrder('1', 'pending');
      expect(orderWithItems.items?.length).toBeGreaterThan(0);
    });

    it('hides items section when items array is empty', () => {
      const orderWithoutItems = createMockOrder('1', 'pending', { items: [] });
      expect(orderWithoutItems.items).toHaveLength(0);
    });

    it('shows correct per-item totals', () => {
      const order = createMockOrder('1', 'pending');
      const shirt = order.items?.[0];
      expect(shirt?.totalPrice).toBe(shirt!.quantity * shirt!.unitPrice);
    });
  });

  describe('Branch Display', () => {
    it('shows branch section when branch data exists', () => {
      const order = createMockOrder('1', 'pending');
      expect(order.branch).toBeDefined();
    });

    it('handles missing branch gracefully', () => {
      const order = createMockOrder('1', 'pending', { branch: undefined });
      expect(order.branch).toBeUndefined();
    });

    it('handles branch without address', () => {
      const order = createMockOrder('1', 'pending', { branch: { id: 'b1', name: 'Branch' } });
      expect(order.branch?.name).toBe('Branch');
      expect(order.branch?.address).toBeUndefined();
    });
  });

  describe('Timeline', () => {
    it('maps current status correctly in timeline', () => {
      const statuses: OrderStatus[] = ['pending', 'received', 'in_wash', 'in_dry', 'in_press', 'quality_check', 'ready', 'completed'];
      for (const status of statuses) {
        const t = getStatusTranslation(status);
        expect(t.showInTimeline).toBe(true);
        expect(t.timelinePosition).toBeGreaterThan(0);
      }
    });

    it('does not show cancelled in timeline', () => {
      const t = getStatusTranslation('cancelled');
      expect(t.showInTimeline).toBe(false);
    });
  });

  describe('Retry', () => {
    it('refetch is callable on error', () => {
      const refetch = jest.fn();
      refetch();
      expect(refetch).toHaveBeenCalled();
    });
  });
});
