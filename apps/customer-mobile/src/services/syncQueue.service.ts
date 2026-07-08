import api from '../api/client';
import { API_ENDPOINTS } from '../api/endpoints';

export const syncQueueService = {
  async processCreateOrder(payload: Record<string, unknown>): Promise<unknown> {
    const response = await api.post(API_ENDPOINTS.ORDERS.BASE, payload);
    return response.data;
  },
};
