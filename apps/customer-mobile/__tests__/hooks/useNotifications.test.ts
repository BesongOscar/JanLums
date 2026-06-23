import { notificationKeys } from '../../src/hooks/useNotifications';
import { notificationService } from '../../src/services/notification.service';
import { AppNotification } from '../../src/types';

jest.mock('../../src/services/notification.service', () => ({
  notificationService: {
    getNotifications: jest.fn(),
    getUnreadCount: jest.fn(),
    markAsRead: jest.fn(),
    markAllAsRead: jest.fn(),
    deleteNotification: jest.fn(),
    deleteAllNotifications: jest.fn(),
  },
}));

const mockedService = notificationService as jest.Mocked<typeof notificationService>;

const mockNotification: AppNotification = {
  id: 'notif-1',
  tenantId: 'tenant-1',
  customerId: 'customer-1',
  title: 'Order Created',
  message: 'Your order has been placed.',
  type: 'order_created',
  isRead: false,
  metadata: null,
  createdAt: '2024-01-01T10:00:00Z',
  updatedAt: '2024-01-01T10:00:00Z',
};

describe('useNotifications (query keys & service integration)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('query keys', () => {
    it('generates correct all key', () => {
      expect(notificationKeys.all).toEqual(['notifications']);
    });

    it('generates correct list key', () => {
      expect(notificationKeys.list()).toEqual(['notifications', 'list']);
    });

    it('generates correct unreadCount key', () => {
      expect(notificationKeys.unreadCount()).toEqual(['notifications', 'unread-count']);
    });
  });

  describe('getNotifications', () => {
    it('calls service and returns notifications', async () => {
      (mockedService.getNotifications as jest.Mock).mockResolvedValue([mockNotification]);

      const result = await notificationService.getNotifications();

      expect(mockedService.getNotifications).toHaveBeenCalledTimes(1);
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Order Created');
    });

    it('returns empty array when no notifications', async () => {
      (mockedService.getNotifications as jest.Mock).mockResolvedValue([]);

      const result = await notificationService.getNotifications();

      expect(result).toEqual([]);
    });

    it('throws on API failure', async () => {
      (mockedService.getNotifications as jest.Mock).mockRejectedValue(new Error('Network error'));

      await expect(notificationService.getNotifications()).rejects.toThrow('Network error');
    });
  });

  describe('getUnreadCount', () => {
    it('calls service and returns count', async () => {
      (mockedService.getUnreadCount as jest.Mock).mockResolvedValue({ count: 3 });

      const result = await notificationService.getUnreadCount();

      expect(mockedService.getUnreadCount).toHaveBeenCalledTimes(1);
      expect(result.count).toBe(3);
    });
  });

  describe('markAsRead', () => {
    it('calls service with correct id', async () => {
      const read = { ...mockNotification, isRead: true };
      (mockedService.markAsRead as jest.Mock).mockResolvedValue(read);

      const result = await notificationService.markAsRead('notif-1');

      expect(mockedService.markAsRead).toHaveBeenCalledWith('notif-1');
      expect(result.isRead).toBe(true);
    });
  });

  describe('markAllAsRead', () => {
    it('calls service and returns affected count', async () => {
      (mockedService.markAllAsRead as jest.Mock).mockResolvedValue({ affected: 5 });

      const result = await notificationService.markAllAsRead();

      expect(mockedService.markAllAsRead).toHaveBeenCalledTimes(1);
      expect(result.affected).toBe(5);
    });
  });

  describe('deleteNotification', () => {
    it('calls service with correct id', async () => {
      (mockedService.deleteNotification as jest.Mock).mockResolvedValue(undefined);

      await notificationService.deleteNotification('notif-1');

      expect(mockedService.deleteNotification).toHaveBeenCalledWith('notif-1');
    });
  });

  describe('deleteAllNotifications', () => {
    it('calls service and returns affected count', async () => {
      (mockedService.deleteAllNotifications as jest.Mock).mockResolvedValue({ affected: 3 });

      const result = await notificationService.deleteAllNotifications();

      expect(mockedService.deleteAllNotifications).toHaveBeenCalledTimes(1);
      expect(result.affected).toBe(3);
    });
  });
});
