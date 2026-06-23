import api from '../../src/api/client';
import { orderService } from '../../src/services/order.service';
import { Order } from '../../src/types';

jest.mock('../../src/api/client', () => ({
  get: jest.fn(),
}));

const mockedApi = api as jest.Mocked<typeof api>;

const mockOrders: Order[] = [
  {
    id: '1',
    tenantId: 'tenant-1',
    branchId: 'branch-1',
    status: 'pending',
    subtotal: 5000,
    tax: 250,
    discount: 0,
    total: 5250,
    amountPaid: 0,
    isExpress: false,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    tenantId: 'tenant-1',
    branchId: 'branch-1',
    status: 'completed',
    subtotal: 3000,
    tax: 150,
    discount: 0,
    total: 3150,
    amountPaid: 3150,
    isExpress: false,
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-12T16:00:00Z',
  },
];

describe('orderService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getMyOrders', () => {
    it('returns orders array on success', async () => {
      (mockedApi.get as jest.Mock).mockResolvedValue({ data: mockOrders });

      const result = await orderService.getMyOrders();

      expect(mockedApi.get).toHaveBeenCalledWith('/orders/me');
      expect(result).toEqual(mockOrders);
      expect(result).toHaveLength(2);
    });

    it('returns empty array when customer has no orders', async () => {
      (mockedApi.get as jest.Mock).mockResolvedValue({ data: [] });

      const result = await orderService.getMyOrders();

      expect(result).toEqual([]);
    });

    it('throws on API failure', async () => {
      const error = new Error('Network error');
      (mockedApi.get as jest.Mock).mockRejectedValue(error);

      await expect(orderService.getMyOrders()).rejects.toThrow('Network error');
    });

    it('throws on 500 server error', async () => {
      const error = { response: { status: 500 } };
      (mockedApi.get as jest.Mock).mockRejectedValue(error);

      await expect(orderService.getMyOrders()).rejects.toEqual(error);
    });
  });
});
