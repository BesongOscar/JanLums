import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { Notification, NotificationType } from './entities/notification.entity';

const mockNotification = (overrides: Partial<Notification> = {}): Notification =>
  ({
    id: 'notif-1',
    tenantId: 'tenant-1',
    customerId: 'customer-1',
    title: 'Test Notification',
    message: 'Test message',
    type: NotificationType.SYSTEM,
    isRead: false,
    metadata: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }) as Notification;

describe('NotificationsService', () => {
  let service: NotificationsService;
  let repo: jest.Mocked<Repository<Notification>>;

  const mockRepo = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    count: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        { provide: getRepositoryToken(Notification), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
    repo = module.get(getRepositoryToken(Notification));
  });

  describe('create', () => {
    it('should create and save a notification', async () => {
      const dto = {
        tenantId: 'tenant-1',
        customerId: 'customer-1',
        title: 'Order Created',
        message: 'Your order has been placed.',
        type: NotificationType.ORDER_CREATED,
      };

      const created = mockNotification(dto);
      mockRepo.create.mockReturnValue(created);
      mockRepo.save.mockResolvedValue(created);

      const result = await service.create(dto);

      expect(mockRepo.create).toHaveBeenCalledWith(dto);
      expect(mockRepo.save).toHaveBeenCalledWith(created);
      expect(result.title).toBe('Order Created');
      expect(result.type).toBe(NotificationType.ORDER_CREATED);
    });
  });

  describe('findAllForCustomer', () => {
    it('should return all notifications for a customer scoped by tenant', async () => {
      const notifications = [
        mockNotification({ id: 'n1' }),
        mockNotification({ id: 'n2' }),
      ];
      mockRepo.find.mockResolvedValue(notifications);

      const result = await service.findAllForCustomer('tenant-1', 'customer-1');

      expect(mockRepo.find).toHaveBeenCalledWith({
        where: { tenantId: 'tenant-1', customerId: 'customer-1' },
        order: { createdAt: 'DESC' },
      });
      expect(result).toHaveLength(2);
    });

    it('should return empty array when no notifications exist', async () => {
      mockRepo.find.mockResolvedValue([]);

      const result = await service.findAllForCustomer('tenant-1', 'customer-1');

      expect(result).toEqual([]);
    });
  });

  describe('findUnreadForCustomer', () => {
    it('should return only unread notifications', async () => {
      const unread = [mockNotification({ id: 'n1', isRead: false })];
      mockRepo.find.mockResolvedValue(unread);

      const result = await service.findUnreadForCustomer('tenant-1', 'customer-1');

      expect(mockRepo.find).toHaveBeenCalledWith({
        where: { tenantId: 'tenant-1', customerId: 'customer-1', isRead: false },
        order: { createdAt: 'DESC' },
      });
      expect(result).toHaveLength(1);
      expect(result[0].isRead).toBe(false);
    });
  });

  describe('getUnreadCount', () => {
    it('should return the count of unread notifications', async () => {
      mockRepo.count.mockResolvedValue(3);

      const result = await service.getUnreadCount('tenant-1', 'customer-1');

      expect(mockRepo.count).toHaveBeenCalledWith({
        where: { tenantId: 'tenant-1', customerId: 'customer-1', isRead: false },
      });
      expect(result).toBe(3);
    });

    it('should return 0 when no unread notifications', async () => {
      mockRepo.count.mockResolvedValue(0);

      const result = await service.getUnreadCount('tenant-1', 'customer-1');

      expect(result).toBe(0);
    });
  });

  describe('markAsRead', () => {
    it('should mark a notification as read', async () => {
      const notif = mockNotification({ isRead: false });
      mockRepo.findOne.mockResolvedValue(notif);
      mockRepo.save.mockResolvedValue({ ...notif, isRead: true });

      const result = await service.markAsRead('notif-1', 'tenant-1', 'customer-1');

      expect(mockRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'notif-1', tenantId: 'tenant-1', customerId: 'customer-1' },
      });
      expect(notif.isRead).toBe(true);
      expect(mockRepo.save).toHaveBeenCalledWith(notif);
      expect(result.isRead).toBe(true);
    });

    it('should throw NotFoundException when notification does not exist', async () => {
      mockRepo.findOne.mockResolvedValue(null);

      await expect(
        service.markAsRead('not-found', 'tenant-1', 'customer-1'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException for cross-tenant access', async () => {
      mockRepo.findOne.mockResolvedValue(null);

      await expect(
        service.markAsRead('notif-1', 'other-tenant', 'customer-1'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException for other customer access', async () => {
      mockRepo.findOne.mockResolvedValue(null);

      await expect(
        service.markAsRead('notif-1', 'tenant-1', 'other-customer'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('markAllAsRead', () => {
    it('should mark all unread notifications as read', async () => {
      mockRepo.update.mockResolvedValue({ affected: 5, generatedMaps: [], raw: [] });

      const result = await service.markAllAsRead('tenant-1', 'customer-1');

      expect(mockRepo.update).toHaveBeenCalledWith(
        { tenantId: 'tenant-1', customerId: 'customer-1', isRead: false },
        { isRead: true },
      );
      expect(result).toBe(5);
    });

    it('should return 0 when no unread notifications', async () => {
      mockRepo.update.mockResolvedValue({ affected: 0, generatedMaps: [], raw: [] });

      const result = await service.markAllAsRead('tenant-1', 'customer-1');

      expect(result).toBe(0);
    });
  });

  describe('delete', () => {
    it('should delete a notification', async () => {
      const notif = mockNotification();
      mockRepo.findOne.mockResolvedValue(notif);
      mockRepo.remove.mockResolvedValue(notif);

      await service.delete('notif-1', 'tenant-1', 'customer-1');

      expect(mockRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'notif-1', tenantId: 'tenant-1', customerId: 'customer-1' },
      });
      expect(mockRepo.remove).toHaveBeenCalledWith(notif);
    });

    it('should throw NotFoundException when notification does not exist', async () => {
      mockRepo.findOne.mockResolvedValue(null);

      await expect(
        service.delete('not-found', 'tenant-1', 'customer-1'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteAll', () => {
    it('should delete all notifications for a customer scoped by tenant', async () => {
      mockRepo.delete.mockResolvedValue({ affected: 3, raw: [] });

      const result = await service.deleteAll('tenant-1', 'customer-1');

      expect(mockRepo.delete).toHaveBeenCalledWith({
        tenantId: 'tenant-1',
        customerId: 'customer-1',
      });
      expect(result).toBe(3);
    });

    it('should return 0 when no notifications to delete', async () => {
      mockRepo.delete.mockResolvedValue({ affected: 0, raw: [] });

      const result = await service.deleteAll('tenant-1', 'customer-1');

      expect(result).toBe(0);
    });
  });

  describe('createOrderNotification', () => {
    it('should create an order created notification', async () => {
      const dto = {
        tenantId: 'tenant-1',
        customerId: 'customer-1',
        title: 'Order Created',
        message: 'Your order #abc12345 has been placed successfully.',
        type: NotificationType.ORDER_CREATED,
        metadata: { orderId: 'abc12345-full', orderStatus: undefined },
      };

      const created = mockNotification(dto);
      mockRepo.create.mockReturnValue(created);
      mockRepo.save.mockResolvedValue(created);

      const result = await service.createOrderNotification(
        'tenant-1',
        'customer-1',
        'abc12345-full',
        NotificationType.ORDER_CREATED,
      );

      expect(mockRepo.create).toHaveBeenCalledWith(dto);
      expect(result.type).toBe(NotificationType.ORDER_CREATED);
      expect(result.title).toBe('Order Created');
    });

    it('should create a ready for pickup notification', async () => {
      const dto = {
        tenantId: 'tenant-1',
        customerId: 'customer-1',
        title: 'Ready for Pickup',
        message: 'Your order #abc12345 is ready for pickup.',
        type: NotificationType.ORDER_READY,
        metadata: { orderId: 'abc12345-full', orderStatus: undefined },
      };

      const created = mockNotification(dto);
      mockRepo.create.mockReturnValue(created);
      mockRepo.save.mockResolvedValue(created);

      const result = await service.createOrderNotification(
        'tenant-1',
        'customer-1',
        'abc12345-full',
        NotificationType.ORDER_READY,
      );

      expect(result.title).toBe('Ready for Pickup');
    });

    it('should create an order processing notification', async () => {
      const created = mockNotification({
        title: 'Order Processing',
        message: 'Your order #abc12345 is now being processed.',
        type: NotificationType.ORDER_PROCESSING,
      });
      mockRepo.create.mockReturnValue(created);
      mockRepo.save.mockResolvedValue(created);

      const result = await service.createOrderNotification(
        'tenant-1', 'customer-1', 'abc12345',
        NotificationType.ORDER_PROCESSING,
      );

      expect(result.title).toBe('Order Processing');
      expect(result.type).toBe(NotificationType.ORDER_PROCESSING);
    });

    it('should create an order received notification', async () => {
      const created = mockNotification({
        title: 'Order Received',
        message: 'Your order #abc12345 has been received at our facility.',
        type: NotificationType.ORDER_RECEIVED,
      });
      mockRepo.create.mockReturnValue(created);
      mockRepo.save.mockResolvedValue(created);

      const result = await service.createOrderNotification(
        'tenant-1', 'customer-1', 'abc12345',
        NotificationType.ORDER_RECEIVED,
      );

      expect(result.title).toBe('Order Received');
      expect(result.type).toBe(NotificationType.ORDER_RECEIVED);
    });

    it('should create an order completed notification', async () => {
      const created = mockNotification({
        title: 'Order Completed',
        message: 'Your order #abc12345 has been completed. Thank you!',
        type: NotificationType.ORDER_COMPLETED,
      });
      mockRepo.create.mockReturnValue(created);
      mockRepo.save.mockResolvedValue(created);

      const result = await service.createOrderNotification(
        'tenant-1', 'customer-1', 'abc12345',
        NotificationType.ORDER_COMPLETED,
      );

      expect(result.title).toBe('Order Completed');
      expect(result.type).toBe(NotificationType.ORDER_COMPLETED);
    });

    it('should include orderStatus in metadata when provided', async () => {
      const dto = {
        tenantId: 'tenant-1',
        customerId: 'customer-1',
        title: 'Ready for Pickup',
        message: 'Your order #abc12345 is ready for pickup.',
        type: NotificationType.ORDER_READY,
        metadata: { orderId: 'abc12345', orderStatus: 'ready' },
      };

      const created = mockNotification(dto);
      mockRepo.create.mockReturnValue(created);
      mockRepo.save.mockResolvedValue(created);

      const result = await service.createOrderNotification(
        'tenant-1',
        'customer-1',
        'abc12345',
        NotificationType.ORDER_READY,
        'ready',
      );

      expect(result.metadata?.orderStatus).toBe('ready');
    });
  });

  describe('cross-tenant isolation', () => {
    it('should not find notifications from other tenants via findOne', async () => {
      mockRepo.findOne.mockResolvedValue(null);

      const result = await service.markAsRead('notif-1', 'tenant-2', 'customer-1').catch(e => e);

      expect(result).toBeInstanceOf(NotFoundException);
      expect(mockRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'notif-1', tenantId: 'tenant-2', customerId: 'customer-1' },
      });
    });

    it('should scope findAllForCustomer by tenant', async () => {
      mockRepo.find.mockResolvedValue([]);

      await service.findAllForCustomer('tenant-2', 'customer-1');

      expect(mockRepo.find).toHaveBeenCalledWith({
        where: { tenantId: 'tenant-2', customerId: 'customer-1' },
        order: { createdAt: 'DESC' },
      });
    });

    it('should scope getUnreadCount by tenant', async () => {
      mockRepo.count.mockResolvedValue(0);

      await service.getUnreadCount('tenant-2', 'customer-1');

      expect(mockRepo.count).toHaveBeenCalledWith({
        where: { tenantId: 'tenant-2', customerId: 'customer-1', isRead: false },
      });
    });

    it('should scope deleteAll by tenant', async () => {
      mockRepo.delete.mockResolvedValue({ affected: 0, raw: [] });

      await service.deleteAll('tenant-2', 'customer-1');

      expect(mockRepo.delete).toHaveBeenCalledWith({
        tenantId: 'tenant-2',
        customerId: 'customer-1',
      });
    });
  });
});
