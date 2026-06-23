import api from '../api/client';
import { API_ENDPOINTS } from '../api/endpoints';
import { Customer } from '../types';

export const customerService = {
  async getProfile(): Promise<Customer> {
    const response = await api.get<Customer>(API_ENDPOINTS.CUSTOMERS.ME);
    return response.data;
  },

  async updateProfile(data: Partial<Pick<Customer, 'firstName' | 'lastName' | 'phone' | 'address' | 'city'>>): Promise<Customer> {
    const response = await api.patch<Customer>(API_ENDPOINTS.CUSTOMERS.ME, data);
    return response.data;
  },
};
