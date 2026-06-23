import api from '../../src/api/client';
import { orderService } from '../../src/services/order.service';
import { Order } from '../../src/types';

jest.mock('../../src/api/client', () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

const mockedApi = api as jest.Mocked<typeof api>;

const mockOrder: Order = {
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
  items: [
    {
      id: 'item-1',
      orderId: '1',
      garmentType: 'Shirt',
      quantity: 2,
      unitPrice: 1500,
      totalPrice: 3000,
      status: 'pending',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
    },
  ],
  branch: {
    id: 'branch-1',
    name: 'Downtown Branch',
    address: '123 Main Street',
  },
};

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

const createOrderPayload = {
  tenantId: 'tenant-1',
  customerId: 'cust-1',
  branchId: 'branch-1',
  status: 'pending',
  items: [
    {
      garmentType: 'Wash & Fold',
      quantity: 2,
      unitPrice: 1500,
      totalPrice: 3000,
      status: 'pending',
    },
  ],
};

describe('orderService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getOrderById', () => {
    it('returns a single order on success', async () => {
      (mockedApi.get as jest.Mock).mockResolvedValue({ data: mockOrder });

      const result = await orderService.getOrderById('1');

      expect(mockedApi.get).toHaveBeenCalledWith('/orders/1');
      expect(result).toEqual(mockOrder);
      expect(result.id).toBe('1');
    });

    it('includes items and branch when available', async () => {
      (mockedApi.get as jest.Mock).mockResolvedValue({ data: mockOrder });

      const result = await orderService.getOrderById('1');

      expect(result.items).toHaveLength(1);
      expect(result.items?.[0].garmentType).toBe('Shirt');
      expect(result.branch?.name).toBe('Downtown Branch');
    });

    it('throws on 404 not found', async () => {
      const error = { response: { status: 404, data: { message: 'Order not found' } } };
      (mockedApi.get as jest.Mock).mockRejectedValue(error);

      await expect(orderService.getOrderById('999')).rejects.toEqual(error);
    });

    it('throws on 401 unauthorized', async () => {
      const error = { response: { status: 401 } };
      (mockedApi.get as jest.Mock).mockRejectedValue(error);

      await expect(orderService.getOrderById('1')).rejects.toEqual(error);
    });

    it('throws on network failure', async () => {
      const error = new Error('Network error');
      (mockedApi.get as jest.Mock).mockRejectedValue(error);

      await expect(orderService.getOrderById('1')).rejects.toThrow('Network error');
    });
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

  describe('createOrder', () => {
    it('creates an order successfully', async () => {
      (mockedApi.post as jest.Mock).mockResolvedValue({ data: mockOrder });

      const result = await orderService.createOrder(createOrderPayload);

      expect(mockedApi.post).toHaveBeenCalledWith('/orders', createOrderPayload);
      expect(result).toEqual(mockOrder);
      expect(result.status).toBe('pending');
    });

    it('sends correct payload structure', async () => {
      (mockedApi.post as jest.Mock).mockResolvedValue({ data: mockOrder });

      await orderService.createOrder(createOrderPayload);

      const sentPayload = (mockedApi.post as jest.Mock).mock.calls[0][1];
      expect(sentPayload).toHaveProperty('tenantId');
      expect(sentPayload).toHaveProperty('branchId');
      expect(sentPayload).toHaveProperty('items');
      expect(sentPayload.items).toHaveLength(1);
    });

    it('handles validation failure', async () => {
      const error = { response: { status: 400, data: { message: 'Validation failed' } } };
      (mockedApi.post as jest.Mock).mockRejectedValue(error);

      await expect(orderService.createOrder(createOrderPayload)).rejects.toEqual(error);
    });

    it('handles network failure', async () => {
      const error = new Error('Network error');
      (mockedApi.post as jest.Mock).mockRejectedValue(error);

      await expect(orderService.createOrder(createOrderPayload)).rejects.toThrow('Network error');
    });

    it('handles server error', async () => {
      const error = { response: { status: 500, data: { message: 'Internal server error' } } };
      (mockedApi.post as jest.Mock).mockRejectedValue(error);

      await expect(orderService.createOrder(createOrderPayload)).rejects.toEqual(error);
    });
  });
});
