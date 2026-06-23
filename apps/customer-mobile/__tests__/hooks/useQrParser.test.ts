import { qrService } from '../../src/services/qr.service';
import { orderService } from '../../src/services/order.service';

jest.mock('../../src/services/qr.service', () => ({
  qrService: {
    parseQrCode: jest.fn(),
    validateQrPayload: jest.fn(),
  },
}));

jest.mock('../../src/services/order.service', () => ({
  orderService: {
    getOrderById: jest.fn(),
  },
}));

jest.mock('../../src/services/secureStorage', () => ({
  secureStorage: {
    getAccessToken: jest.fn().mockResolvedValue('fake-token'),
  },
}));

jest.mock('../../src/api/client', () => ({
  get: jest.fn(),
}));

jest.mock('../../src/hooks/useCustomerProfile', () => ({
  useCustomerProfile: jest.fn(() => ({
    data: { id: 'customer-1', tenantId: 'tenant-1' },
    isLoading: false,
  })),
}));

const mockedParseQrCode = qrService.parseQrCode as jest.MockedFunction<
  typeof qrService.parseQrCode
>;
const mockedValidateQrPayload = qrService.validateQrPayload as jest.MockedFunction<
  typeof qrService.validateQrPayload
>;
const mockedGetOrderById = orderService.getOrderById as jest.MockedFunction<
  typeof orderService.getOrderById
>;

describe('useQrParser (service integration)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('qrService.parseQrCode', () => {
    it('calls parseQrCode with the QR data string', async () => {
      mockedParseQrCode.mockResolvedValue({
        type: 'order',
        tenantId: 'tenant-1',
        orderId: 'order-123',
      });

      const result = await qrService.parseQrCode('scanned-qr-data');

      expect(mockedParseQrCode).toHaveBeenCalledWith('scanned-qr-data');
      expect(result.type).toBe('order');
      expect(result.orderId).toBe('order-123');
    });

    it('throws on parse failure', async () => {
      mockedParseQrCode.mockRejectedValue(new Error('QR code not recognized'));

      await expect(qrService.parseQrCode('bad-data')).rejects.toThrow(
        'QR code not recognized'
      );
    });
  });

  describe('qrService.validateQrPayload', () => {
    it('validates a correct order payload', () => {
      const payload = { type: 'order', tenantId: 't1', orderId: 'o1' };
      mockedValidateQrPayload.mockReturnValue(payload);

      const result = qrService.validateQrPayload(payload);

      expect(result.type).toBe('order');
    });

    it('throws for null payload', () => {
      mockedValidateQrPayload.mockImplementation(() => {
        throw new Error('Invalid QR code format.');
      });

      expect(() => qrService.validateQrPayload(null)).toThrow(
        'Invalid QR code format.'
      );
    });
  });

  describe('orderService.getOrderById (ownership check)', () => {
    it('returns order for own account', async () => {
      const mockOrder = {
        id: 'order-123',
        tenantId: 'tenant-1',
        customerId: 'customer-1',
        status: 'in_wash',
        total: 5000,
      };

      mockedGetOrderById.mockResolvedValue(mockOrder as any);

      const order = await orderService.getOrderById('order-123');

      expect(mockedGetOrderById).toHaveBeenCalledWith('order-123');
      expect(order.tenantId).toBe('tenant-1');
      expect(order.customerId).toBe('customer-1');
    });

    it('throws on 404 when order not found', async () => {
      mockedGetOrderById.mockRejectedValue({
        response: { status: 404, data: { message: 'Order not found' } },
      });

      await expect(orderService.getOrderById('nonexistent')).rejects.toEqual(
        expect.objectContaining({
          response: expect.objectContaining({ status: 404 }),
        })
      );
    });

    it('throws on network error when resolving order', async () => {
      mockedGetOrderById.mockRejectedValue(new Error('Network error'));

      await expect(orderService.getOrderById('order-123')).rejects.toThrow(
        'Network error'
      );
    });
  });
});
