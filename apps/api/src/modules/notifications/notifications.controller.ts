import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { NotificationsService, NotificationPayload } from './notifications.service';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('send')
  @ApiOperation({ summary: 'Send notification' })
  async sendNotification(@Body() payload: NotificationPayload): Promise<{ success: boolean }> {
    const success = await this.notificationsService.sendNotification(payload);
    return { success };
  }

  @Post('order-status')
  @ApiOperation({ summary: 'Send order status update' })
  async sendOrderStatusUpdate(
    @Body() body: { phone: string; email?: string; orderId: string; status: string }
  ): Promise<{ success: boolean }> {
    await this.notificationsService.sendOrderStatusUpdate(
      body.phone,
      body.email,
      body.orderId,
      body.status
    );
    return { success: true };
  }

  @Post('ready-pickup')
  @ApiOperation({ summary: 'Send ready for pickup notification' })
  async sendReadyForPickup(
    @Body() body: { phone: string; email?: string; orderId: string }
  ): Promise<{ success: boolean }> {
    await this.notificationsService.sendReadyForPickup(body.phone, body.email, body.orderId);
    return { success: true };
  }
}
