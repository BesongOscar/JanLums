import { orderService } from '../../src/services/order.service';

jest.mock('../../src/services/order.service', () => ({
  orderService: {
    createOrder: jest.fn(),
  },
}));

const mockedCreateOrder = orderService.createOrder as jest.MockedFunction<
  typeof orderService.createOrder
>;

const validPayload = {
  tenantId: 'tenant-1',
  customerId: 'cust-1',
  branchId: 'br-1',
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

const mockCreatedOrder = {
  id: 'order-new-1',
  tenantId: 'tenant-1',
  branchId: 'br-1',
  customerId: 'cust-1',
  status: 'pending',
  subtotal: 6000,
  tax: 0,
  discount: 0,
  total: 6000,
  amountPaid: 0,
  isExpress: false,
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-01-15T10:00:00Z',
  items: [
    {
      id: 'item-1',
      orderId: 'order-new-1',
      garmentType: 'Wash & Fold',
      quantity: 2,
      unitPrice: 1500,
      totalPrice: 3000,
      status: 'pending',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
    },
  ],
};

describe('useCreateOrder (service integration)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('order submission success', () => {
    it('submits order successfully', async () => {
      mockedCreateOrder.mockResolvedValue(mockCreatedOrder);

      const result = await orderService.createOrder(validPayload);

      expect(mockedCreateOrder).toHaveBeenCalledWith(validPayload);
      expect(result).toEqual(mockCreatedOrder);
      expect(result.status).toBe('pending');
    });

    it('returns created order with correct id', async () => {
      mockedCreateOrder.mockResolvedValue(mockCreatedOrder);

      const result = await orderService.createOrder(validPayload);

      expect(result.id).toBe('order-new-1');
    });
  });

  describe('order submission validation failure', () => {
    it('handles validation error from backend', async () => {
      const validationError = {
        response: {
          status: 400,
          data: {
            message: 'Validation failed',
            details: [{ field: 'branchId', message: 'branchId is required' }],
          },
        },
      };
      mockedCreateOrder.mockRejectedValue(validationError);

      await expect(orderService.createOrder(validPayload)).rejects.toEqual(validationError);
    });

    it('handles missing branch id', async () => {
      const badPayload = { ...validPayload, branchId: undefined };
      const error = {
        response: { status: 400, data: { message: 'branchId should not be empty' } },
      };
      mockedCreateOrder.mockRejectedValue(error);

      await expect(orderService.createOrder(badPayload as any)).rejects.toEqual(error);
    });
  });

  describe('order submission network failure', () => {
    it('handles network error', async () => {
      mockedCreateOrder.mockRejectedValue(new Error('Network error'));

      await expect(orderService.createOrder(validPayload)).rejects.toThrow('Network error');
    });

    it('handles server error', async () => {
      const serverError = {
        response: { status: 500, data: { message: 'Internal server error' } },
      };
      mockedCreateOrder.mockRejectedValue(serverError);

      await expect(orderService.createOrder(validPayload)).rejects.toEqual(serverError);
    });
  });
});
