import { Injectable } from '@nestjs/common';

export interface NotificationPayload {
  to: string;
  subject?: string;
  message: string;
  type: 'sms' | 'email' | 'push';
  template?: string;
  data?: Record<string, any>;
}

@Injectable()
export class NotificationsService {
  async sendNotification(payload: NotificationPayload): Promise<boolean> {
    // TODO: Implement actual SMS/Email sending
    // For now, just log the notification
    console.log(`[${payload.type.toUpperCase()}] To: ${payload.to}`);
    console.log(`Subject: ${payload.subject || 'N/A'}`);
    console.log(`Message: ${payload.message}`);
    return true;
  }

  async sendBulkNotifications(payloads: NotificationPayload[]): Promise<boolean[]> {
    return Promise.all(payloads.map(payload => this.sendNotification(payload)));
  }

  // Order status notifications
  async sendOrderStatusUpdate(
    phone: string,
    email: string | undefined,
    orderId: string,
    status: string
  ): Promise<void> {
    const message = `Your order ${orderId} status has been updated to: ${status}`;
    
    // Send SMS
    await this.sendNotification({
      to: phone,
      message,
      type: 'sms',
    });

    // Send Email if available
    if (email) {
      await this.sendNotification({
        to: email,
        subject: `Order ${orderId} Update`,
        message,
        type: 'email',
      });
    }
  }

  // Ready for pickup notification
  async sendReadyForPickup(
    phone: string,
    email: string | undefined,
    orderId: string
  ): Promise<void> {
    const message = `Great news! Your order ${orderId} is ready for pickup. Thank you for choosing Pressing 237!`;
    
    await this.sendNotification({
      to: phone,
      message,
      type: 'sms',
    });

    if (email) {
      await this.sendNotification({
        to: email,
        subject: `Your Order is Ready!`,
        message,
        type: 'email',
      });
    }
  }

  // Payment confirmation
  async sendPaymentConfirmation(
    phone: string,
    email: string | undefined,
    orderId: string,
    amount: number
  ): Promise<void> {
    const message = `Payment of ${amount} FCFA received for order ${orderId}. Thank you!`;
    
    await this.sendNotification({
      to: phone,
      message,
      type: 'sms',
    });

    if (email) {
      await this.sendNotification({
        to: email,
        subject: `Payment Confirmation`,
        message,
        type: 'email',
      });
    }
  }
}
