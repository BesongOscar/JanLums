import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class QrCodeService {
  generateOrderQrCode(tenantId: string, orderId: string): string {
    // Generate a unique QR code identifier
    const qrData = {
      type: 'order',
      tenantId,
      orderId,
      code: `ORD-${uuidv4().slice(0, 8).toUpperCase()}`,
      generatedAt: new Date().toISOString(),
    };
    return JSON.stringify(qrData);
  }

  generateGarmentQrCode(
    tenantId: string, 
    orderId: string, 
    itemId: string,
    garmentType: string
  ): string {
    const qrData = {
      type: 'garment',
      tenantId,
      orderId,
      itemId,
      garmentType,
      code: `GRM-${uuidv4().slice(0, 8).toUpperCase()}`,
      generatedAt: new Date().toISOString(),
    };
    return JSON.stringify(qrData);
  }

  parseQrCode(qrString: string): any {
    try {
      return JSON.parse(qrString);
    } catch (error) {
      // If not JSON, treat as plain code
      return {
        type: 'unknown',
        code: qrString,
      };
    }
  }

  generateShortCode(): string {
    // Generate a short 6-character alphanumeric code
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}
