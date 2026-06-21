import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { QrCodeService } from './qr-code.service';

@ApiTags('qr-code')
@Controller('qr-code')
export class QrCodeController {
  constructor(private readonly qrCodeService: QrCodeService) {}

  @Post('generate/order')
  @ApiOperation({ summary: 'Generate QR code for order' })
  generateOrderQrCode(
    @Body() body: { tenantId: string; orderId: string }
  ): { qrCode: string } {
    const qrCode = this.qrCodeService.generateOrderQrCode(body.tenantId, body.orderId);
    return { qrCode };
  }

  @Post('generate/garment')
  @ApiOperation({ summary: 'Generate QR code for garment' })
  generateGarmentQrCode(
    @Body() body: { tenantId: string; orderId: string; itemId: string; garmentType: string }
  ): { qrCode: string } {
    const qrCode = this.qrCodeService.generateGarmentQrCode(
      body.tenantId, 
      body.orderId, 
      body.itemId, 
      body.garmentType
    );
    return { qrCode };
  }

  @Get('parse/:code')
  @ApiOperation({ summary: 'Parse QR code data' })
  parseQrCode(@Param('code') code: string): any {
    return this.qrCodeService.parseQrCode(code);
  }

  @Get('short-code')
  @ApiOperation({ summary: 'Generate short code' })
  generateShortCode(): { code: string } {
    return { code: this.qrCodeService.generateShortCode() };
  }
}
