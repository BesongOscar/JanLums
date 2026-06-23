import api from '../api/client';
import { API_ENDPOINTS } from '../api/endpoints';

export interface QrParsedPayload {
  type: string;
  tenantId: string;
  orderId?: string;
  garmentId?: string;
  code?: string;
  [key: string]: unknown;
}

export const qrService = {
  async parseQrCode(code: string): Promise<QrParsedPayload> {
    const response = await api.get<QrParsedPayload>(
      API_ENDPOINTS.QR_CODE.PARSE(encodeURIComponent(code))
    );
    return response.data;
  },

  validateQrPayload(payload: unknown): QrParsedPayload {
    if (!payload || typeof payload !== 'object') {
      throw new Error('Invalid QR code format.');
    }

    const p = payload as Record<string, unknown>;

    if (!p.type || typeof p.type !== 'string') {
      throw new Error('Unsupported QR code.');
    }

    if (!p.tenantId || typeof p.tenantId !== 'string') {
      throw new Error('Invalid QR code data.');
    }

    return p as QrParsedPayload;
  },
};
