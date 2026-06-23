import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order, OrderItem } from './entities/order.entity';
import { Service } from '../services/entities/service.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { Notification, NotificationType } from '../notifications/entities/notification.entity';

describe('OrdersService', () => {
  let service: OrdersService;
  let notificationsService: jest.Mocked<NotificationsService>;

  const mockOrder = (overrides: Partial<Order> = {}): Order =>
    ({
      id: 'order-1',
      tenantId: 'tenant-1',
      customerId: 'customer-1',
      branchId: 'branch-1',
      status: 'pending',
      subtotal: 100,
      tax: 19.25,
      total: 119.25,
      amountPaid: 0,
      isExpress: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      items: [],
      ...overrides,
    }) as Order;

  const mockRepo = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  };

  const mockItemRepo = {
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockServiceRepo = {
    findOne: jest.fn(),
  };

  const mockDataSource = {
    transaction: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: getRepositoryToken(Order), useValue: mockRepo },
        { provide: getRepositoryToken(OrderItem), useValue: mockItemRepo },
        { provide: getRepositoryToken(Service), useValue: mockServiceRepo },
        { provide: DataSource, useValue: mockDataSource },
        {
          provide: NotificationsService,
          useValue: { createOrderNotification: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    notificationsService = module.get(NotificationsService);
  });

  describe('updateStatus', () => {
    it('should skip notification when status is unchanged', async () => {
      const order = mockOrder({ status: 'ready' });
      mockRepo.findOne.mockResolvedValue(order);

      const result = await service.updateStatus('order-1', 'tenant-1', 'ready');

      expect(mockRepo.update).not.toHaveBeenCalled();
      expect(notificationsService.createOrderNotification).not.toHaveBeenCalled();
      expect(result.status).toBe('ready');
    });

    it('should create notification on status change', async () => {
      const order = mockOrder({ status: 'pending' });
      const updatedOrder = mockOrder({ status: 'ready' });
      mockRepo.findOne
        .mockResolvedValueOnce(order)
        .mockResolvedValueOnce(updatedOrder);
      mockRepo.update.mockResolvedValue({ affected: 1, generatedMaps: [], raw: [] });
      notificationsService.createOrderNotification.mockResolvedValue({} as Notification);

      const result = await service.updateStatus('order-1', 'tenant-1', 'ready');

      expect(mockRepo.update).toHaveBeenCalledWith(
        { id: 'order-1', tenantId: 'tenant-1' },
        { status: 'ready' },
      );
      expect(notificationsService.createOrderNotification).toHaveBeenCalledWith(
        'tenant-1', 'customer-1', 'order-1', NotificationType.ORDER_READY, 'ready',
      );
      expect(result.status).toBe('ready');
    });

    it('should not create notification when customerId is null', async () => {
      const order = mockOrder({ status: 'pending', customerId: undefined });
      const updatedOrder = mockOrder({ status: 'ready', customerId: undefined });
      mockRepo.findOne
        .mockResolvedValueOnce(order)
        .mockResolvedValueOnce(updatedOrder);
      mockRepo.update.mockResolvedValue({ affected: 1, generatedMaps: [], raw: [] });

      const result = await service.updateStatus('order-1', 'tenant-1', 'ready');

      expect(notificationsService.createOrderNotification).not.toHaveBeenCalled();
      expect(result.status).toBe('ready');
    });

    it('should throw NotFoundException when order does not exist', async () => {
      mockRepo.findOne.mockResolvedValue(null);

      await expect(
        service.updateStatus('not-found', 'tenant-1', 'ready'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('mapStatusToNotificationType (via updateStatus)', () => {
    const processingStatuses = ['tagged', 'in_wash', 'in_dry', 'in_press', 'quality_check', 'rewash', 'processing'];

    for (const status of processingStatuses) {
      it(`should map '${status}' to ORDER_PROCESSING`, async () => {
        const order = mockOrder({ status: 'pending' });
        const updatedOrder = mockOrder({ status });
        mockRepo.findOne
          .mockResolvedValueOnce(order)
          .mockResolvedValueOnce(updatedOrder);
        mockRepo.update.mockResolvedValue({ affected: 1, generatedMaps: [], raw: [] });
        notificationsService.createOrderNotification.mockResolvedValue({} as Notification);

        await service.updateStatus('order-1', 'tenant-1', status);

        expect(notificationsService.createOrderNotification).toHaveBeenCalledWith(
          'tenant-1', 'customer-1', 'order-1', NotificationType.ORDER_PROCESSING, status,
        );
      });
    }

    it('should map out_for_delivery to ORDER_READY', async () => {
      const order = mockOrder({ status: 'processing' });
      const updatedOrder = mockOrder({ status: 'out_for_delivery' });
      mockRepo.findOne
        .mockResolvedValueOnce(order)
        .mockResolvedValueOnce(updatedOrder);
      mockRepo.update.mockResolvedValue({ affected: 1, generatedMaps: [], raw: [] });
      notificationsService.createOrderNotification.mockResolvedValue({} as Notification);

      await service.updateStatus('order-1', 'tenant-1', 'out_for_delivery');

      expect(notificationsService.createOrderNotification).toHaveBeenCalledWith(
        'tenant-1', 'customer-1', 'order-1', NotificationType.ORDER_READY, 'out_for_delivery',
      );
    });

    it('should not create notification for cancelled status', async () => {
      const order = mockOrder({ status: 'processing' });
      const updatedOrder = mockOrder({ status: 'cancelled' });
      mockRepo.findOne
        .mockResolvedValueOnce(order)
        .mockResolvedValueOnce(updatedOrder);
      mockRepo.update.mockResolvedValue({ affected: 1, generatedMaps: [], raw: [] });

      await service.updateStatus('order-1', 'tenant-1', 'cancelled');

      expect(notificationsService.createOrderNotification).not.toHaveBeenCalled();
    });
  });
});
