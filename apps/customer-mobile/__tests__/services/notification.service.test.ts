import api from '../../src/api/client';
import { notificationService } from '../../src/services/notification.service';
import { AppNotification } from '../../src/types';

jest.mock('../../src/api/client', () => ({
  get: jest.fn(),
  patch: jest.fn(),
  delete: jest.fn(),
}));

const mockedApi = api as jest.Mocked<typeof api>;

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

describe('notificationService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getNotifications', () => {
    it('returns notifications on success', async () => {
      (mockedApi.get as jest.Mock).mockResolvedValue({ data: [mockNotification] });

      const result = await notificationService.getNotifications();

      expect(mockedApi.get).toHaveBeenCalledWith('/notifications/me');
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Order Created');
    });

    it('throws when API fails', async () => {
      (mockedApi.get as jest.Mock).mockRejectedValue(new Error('Network error'));

      await expect(notificationService.getNotifications()).rejects.toThrow('Network error');
    });
  });

  describe('getUnreadCount', () => {
    it('returns unread count', async () => {
      (mockedApi.get as jest.Mock).mockResolvedValue({ data: { count: 3 } });

      const result = await notificationService.getUnreadCount();

      expect(mockedApi.get).toHaveBeenCalledWith('/notifications/me/unread-count');
      expect(result.count).toBe(3);
    });

    it('returns zero when no unread', async () => {
      (mockedApi.get as jest.Mock).mockResolvedValue({ data: { count: 0 } });

      const result = await notificationService.getUnreadCount();

      expect(result.count).toBe(0);
    });
  });

  describe('markAsRead', () => {
    it('marks notification as read and returns it', async () => {
      const read = { ...mockNotification, isRead: true };
      (mockedApi.patch as jest.Mock).mockResolvedValue({ data: read });

      const result = await notificationService.markAsRead('notif-1');

      expect(mockedApi.patch).toHaveBeenCalledWith('/notifications/notif-1/read');
      expect(result.isRead).toBe(true);
    });

    it('throws on not found', async () => {
      (mockedApi.patch as jest.Mock).mockRejectedValue(new Error('Notification not found'));

      await expect(notificationService.markAsRead('bad-id')).rejects.toThrow('Notification not found');
    });
  });

  describe('markAllAsRead', () => {
    it('marks all as read and returns affected count', async () => {
      (mockedApi.patch as jest.Mock).mockResolvedValue({ data: { affected: 5 } });

      const result = await notificationService.markAllAsRead();

      expect(mockedApi.patch).toHaveBeenCalledWith('/notifications/me/read-all');
      expect(result.affected).toBe(5);
    });
  });

  describe('deleteNotification', () => {
    it('deletes a notification', async () => {
      (mockedApi.delete as jest.Mock).mockResolvedValue({});

      await notificationService.deleteNotification('notif-1');

      expect(mockedApi.delete).toHaveBeenCalledWith('/notifications/notif-1');
    });

    it('throws on not found', async () => {
      (mockedApi.delete as jest.Mock).mockRejectedValue(new Error('Notification not found'));

      await expect(notificationService.deleteNotification('bad-id')).rejects.toThrow('Notification not found');
    });
  });

  describe('deleteAllNotifications', () => {
    it('deletes all notifications and returns affected count', async () => {
      (mockedApi.delete as jest.Mock).mockResolvedValue({ data: { affected: 3 } });

      const result = await notificationService.deleteAllNotifications();

      expect(mockedApi.delete).toHaveBeenCalledWith('/notifications/me');
      expect(result.affected).toBe(3);
    });
  });
});
