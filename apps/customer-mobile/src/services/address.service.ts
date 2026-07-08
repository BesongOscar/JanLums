import api from '../api/client';
import { API_ENDPOINTS } from '../api/endpoints';
import { Address } from '../types';

export const addressService = {
  async getAll(): Promise<Address[]> {
    const response = await api.get<Address[]>(API_ENDPOINTS.ADDRESSES.BASE);
    return response.data;
  },

  async getById(id: string): Promise<Address> {
    const response = await api.get<Address>(API_ENDPOINTS.ADDRESSES.BY_ID(id));
    return response.data;
  },

  async create(
    data: Omit<Address, 'id' | 'createdAt' | 'updatedAt' | 'customerId'>
  ): Promise<Address> {
    const response = await api.post<Address>(API_ENDPOINTS.ADDRESSES.BASE, data);
    return response.data;
  },

  async update(
    id: string,
    data: Partial<Omit<Address, 'id' | 'createdAt' | 'updatedAt' | 'customerId'>>
  ): Promise<Address> {
    const response = await api.patch<Address>(API_ENDPOINTS.ADDRESSES.BY_ID(id), data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(API_ENDPOINTS.ADDRESSES.BY_ID(id));
  },
};
