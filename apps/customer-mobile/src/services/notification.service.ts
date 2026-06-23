import api from '../api/client';
import { API_ENDPOINTS } from '../api/endpoints';
import { AppNotification } from '../types';

export const notificationService = {
  async getNotifications(): Promise<AppNotification[]> {
    const response = await api.get<AppNotification[]>(API_ENDPOINTS.NOTIFICATIONS.ME);
    return response.data;
  },

  async getUnreadCount(): Promise<{ count: number }> {
    const response = await api.get<{ count: number }>(API_ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT);
    return response.data;
  },

  async markAsRead(id: string): Promise<AppNotification> {
    const response = await api.patch<AppNotification>(API_ENDPOINTS.NOTIFICATIONS.MARK_READ(id));
    return response.data;
  },

  async markAllAsRead(): Promise<{ affected: number }> {
    const response = await api.patch<{ affected: number }>(API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ);
    return response.data;
  },

  async deleteNotification(id: string): Promise<void> {
    await api.delete(API_ENDPOINTS.NOTIFICATIONS.DELETE(id));
  },

  async deleteAllNotifications(): Promise<{ affected: number }> {
    const response = await api.delete<{ affected: number }>(API_ENDPOINTS.NOTIFICATIONS.DELETE_ALL);
    return response.data;
  },
};
