import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationType } from './entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  async create(dto: CreateNotificationDto): Promise<Notification> {
    const notification = this.notificationRepository.create(dto);
    return this.notificationRepository.save(notification);
  }

  async findAllForCustomer(tenantId: string, customerId: string): Promise<Notification[]> {
    return this.notificationRepository.find({
      where: { tenantId, customerId },
      order: { createdAt: 'DESC' },
    });
  }

  async findUnreadForCustomer(tenantId: string, customerId: string): Promise<Notification[]> {
    return this.notificationRepository.find({
      where: { tenantId, customerId, isRead: false },
      order: { createdAt: 'DESC' },
    });
  }

  async getUnreadCount(tenantId: string, customerId: string): Promise<number> {
    return this.notificationRepository.count({
      where: { tenantId, customerId, isRead: false },
    });
  }

  async markAsRead(id: string, tenantId: string, customerId: string): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: { id, tenantId, customerId },
    });
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }
    notification.isRead = true;
    return this.notificationRepository.save(notification);
  }

  async markAllAsRead(tenantId: string, customerId: string): Promise<number> {
    const result = await this.notificationRepository.update(
      { tenantId, customerId, isRead: false },
      { isRead: true },
    );
    return result.affected ?? 0;
  }

  async delete(id: string, tenantId: string, customerId: string): Promise<void> {
    const notification = await this.notificationRepository.findOne({
      where: { id, tenantId, customerId },
    });
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }
    await this.notificationRepository.remove(notification);
  }

  async deleteAll(tenantId: string, customerId: string): Promise<number> {
    const result = await this.notificationRepository.delete({ tenantId, customerId });
    return result.affected ?? 0;
  }

  async createOrderNotification(
    tenantId: string,
    customerId: string,
    orderId: string,
    type: NotificationType,
    orderStatus?: string,
  ): Promise<Notification> {
    const config = this.getOrderNotificationConfig(type, orderId, orderStatus);
    return this.create({
      tenantId,
      customerId,
      title: config.title,
      message: config.message,
      type,
      metadata: { orderId, orderStatus },
    });
  }

  private getOrderNotificationConfig(
    type: NotificationType,
    orderId: string,
    orderStatus?: string,
  ): { title: string; message: string } {
    switch (type) {
      case NotificationType.ORDER_CREATED:
        return {
          title: 'Order Created',
          message: `Your order #${orderId.slice(0, 8)} has been placed successfully.`,
        };
      case NotificationType.ORDER_RECEIVED:
        return {
          title: 'Order Received',
          message: `Your order #${orderId.slice(0, 8)} has been received at our facility.`,
        };
      case NotificationType.ORDER_PROCESSING:
        return {
          title: 'Order Processing',
          message: `Your order #${orderId.slice(0, 8)} is now being processed.`,
        };
      case NotificationType.ORDER_READY:
        return {
          title: 'Ready for Pickup',
          message: `Your order #${orderId.slice(0, 8)} is ready for pickup.`,
        };
      case NotificationType.ORDER_COMPLETED:
        return {
          title: 'Order Completed',
          message: `Your order #${orderId.slice(0, 8)} has been completed. Thank you!`,
        };
      default:
        return {
          title: 'Order Update',
          message: `Your order #${orderId.slice(0, 8)} status: ${orderStatus ?? type}`,
        };
    }
  }
}
