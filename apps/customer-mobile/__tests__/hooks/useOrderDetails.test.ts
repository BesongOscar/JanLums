import { orderService } from '../../src/services/order.service';
import { Order } from '../../src/types';

jest.mock('../../src/services/order.service', () => ({
  orderService: {
    getOrderById: jest.fn(),
  },
}));

const mockedGetOrderById = orderService.getOrderById as jest.MockedFunction<
  typeof orderService.getOrderById
>;

const mockOrder: Order = {
  id: '1',
  tenantId: 'tenant-1',
  branchId: 'branch-1',
  status: 'in_wash',
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
      orderId: '1',
      garmentType: 'Shirt',
      quantity: 2,
      unitPrice: 1500,
      totalPrice: 3000,
      status: 'in_wash',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
    },
  ],
  branch: { id: 'branch-1', name: 'Downtown', address: '123 Main' },
};

describe('useOrderDetails (query key & service integration)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls getOrderById with correct id', async () => {
    mockedGetOrderById.mockResolvedValue(mockOrder);
    const result = await orderService.getOrderById('1');
    expect(mockedGetOrderById).toHaveBeenCalledWith('1');
    expect(result).toEqual(mockOrder);
  });

  it('returns full order with items and branch', async () => {
    mockedGetOrderById.mockResolvedValue(mockOrder);
    const result = await orderService.getOrderById('1');
    expect(result.items).toHaveLength(1);
    expect(result.branch?.name).toBe('Downtown');
  });

  it('throws on API failure', async () => {
    mockedGetOrderById.mockRejectedValue(new Error('Not found'));
    await expect(orderService.getOrderById('999')).rejects.toThrow('Not found');
  });
});
