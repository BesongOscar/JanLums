import api from '../api/client';
import { API_ENDPOINTS } from '../api/endpoints';
import { Order } from '../types';

export const orderService = {
  async getMyOrders(): Promise<Order[]> {
    const response = await api.get<Order[]>(API_ENDPOINTS.ORDERS.ME);
    return response.data;
  },
};
