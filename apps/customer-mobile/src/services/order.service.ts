import api from '../api/client';
import { API_ENDPOINTS } from '../api/endpoints';
import { Order } from '../types';

export const orderService = {
  async getMyOrders(): Promise<Order[]> {
    const response = await api.get<Order[]>(API_ENDPOINTS.ORDERS.ME);
    return response.data;
  },

  async getOrderById(id: string): Promise<Order> {
    const response = await api.get<Order>(API_ENDPOINTS.ORDERS.BY_ID(id));
    return response.data;
  },

  async createOrder(payload: Record<string, unknown>): Promise<Order> {
    const response = await api.post<Order>(API_ENDPOINTS.ORDERS.BASE, payload);
    return response.data;
  },
};
