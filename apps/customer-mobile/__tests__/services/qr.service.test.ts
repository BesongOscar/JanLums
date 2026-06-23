import api from '../../src/api/client';
import { qrService, QrParsedPayload } from '../../src/services/qr.service';

jest.mock('../../src/api/client', () => ({
  get: jest.fn(),
}));

const mockedApi = api as jest.Mocked<typeof api>;

const validOrderPayload: QrParsedPayload = {
  type: 'order',
  tenantId: 'tenant-1',
  orderId: 'order-123',
  code: 'ORD-ABC123',
};

const validGarmentPayload: QrParsedPayload = {
  type: 'garment',
  tenantId: 'tenant-1',
  garmentId: 'garment-456',
  code: 'GRM-DEF456',
};

describe('qrService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('parseQrCode', () => {
    it('parses a valid QR code successfully', async () => {
      (mockedApi.get as jest.Mock).mockResolvedValue({ data: validOrderPayload });

      const result = await qrService.parseQrCode('valid-qr-data');

      expect(mockedApi.get).toHaveBeenCalledWith('/qr-code/parse/valid-qr-data');
      expect(result).toEqual(validOrderPayload);
      expect(result.type).toBe('order');
      expect(result.orderId).toBe('order-123');
    });

    it('parses a garment QR code successfully', async () => {
      (mockedApi.get as jest.Mock).mockResolvedValue({ data: validGarmentPayload });

      const result = await qrService.parseQrCode('garment-qr-data');

      expect(result.type).toBe('garment');
      expect(result.garmentId).toBe('garment-456');
    });

    it('encodes special characters in QR code parameter', async () => {
      (mockedApi.get as jest.Mock).mockResolvedValue({ data: validOrderPayload });

      await qrService.parseQrCode('data with spaces and special chars!@#');

      expect(mockedApi.get).toHaveBeenCalledWith(
        '/qr-code/parse/data%20with%20spaces%20and%20special%20chars!%40%23'
      );
    });

    it('throws on API failure', async () => {
      const error = new Error('Network error');
      (mockedApi.get as jest.Mock).mockRejectedValue(error);

      await expect(qrService.parseQrCode('any-code')).rejects.toThrow('Network error');
    });

    it('throws on 404 not found', async () => {
      const error = { response: { status: 404, data: { message: 'QR code not found' } } };
      (mockedApi.get as jest.Mock).mockRejectedValue(error);

      await expect(qrService.parseQrCode('invalid-code')).rejects.toEqual(error);
    });

    it('throws on 401 unauthorized', async () => {
      const error = { response: { status: 401 } };
      (mockedApi.get as jest.Mock).mockRejectedValue(error);

      await expect(qrService.parseQrCode('any-code')).rejects.toEqual(error);
    });
  });

  describe('validateQrPayload', () => {
    it('validates a complete order payload', () => {
      const result = qrService.validateQrPayload(validOrderPayload);

      expect(result).toEqual(validOrderPayload);
      expect(result.type).toBe('order');
      expect(result.orderId).toBe('order-123');
    });

    it('validates a complete garment payload', () => {
      const result = qrService.validateQrPayload(validGarmentPayload);

      expect(result.type).toBe('garment');
      expect(result.garmentId).toBe('garment-456');
    });

    it('rejects null payload', () => {
      expect(() => qrService.validateQrPayload(null)).toThrow('Invalid QR code format.');
    });

    it('rejects undefined payload', () => {
      expect(() => qrService.validateQrPayload(undefined)).toThrow(
        'Invalid QR code format.'
      );
    });

    it('rejects non-object payload', () => {
      expect(() => qrService.validateQrPayload('string')).toThrow(
        'Invalid QR code format.'
      );
    });

    it('rejects payload missing type', () => {
      const payload = { tenantId: 't1' };
      expect(() => qrService.validateQrPayload(payload)).toThrow(
        'Unsupported QR code.'
      );
    });

    it('rejects payload with non-string type', () => {
      const payload = { type: 123, tenantId: 't1' };
      expect(() => qrService.validateQrPayload(payload)).toThrow(
        'Unsupported QR code.'
      );
    });

    it('rejects payload missing tenantId', () => {
      const payload = { type: 'order' };
      expect(() => qrService.validateQrPayload(payload)).toThrow(
        'Invalid QR code data.'
      );
    });

    it('accepts payload with additional unknown fields', () => {
      const payload = {
        type: 'order',
        tenantId: 't1',
        orderId: 'o1',
        extraField: 'value',
        nested: { key: 'val' },
      };
      const result = qrService.validateQrPayload(payload);
      expect(result.extraField).toBe('value');
      expect((result as Record<string, unknown>).nested).toEqual({ key: 'val' });
    });

    it('accepts payload with all optional fields', () => {
      const payload = {
        type: 'order',
        tenantId: 't1',
        orderId: 'o1',
        code: 'ORD-123',
      };
      const result = qrService.validateQrPayload(payload);
      expect(result.code).toBe('ORD-123');
    });
  });
});
