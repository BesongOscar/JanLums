import api from '../api/client';
import { API_ENDPOINTS } from '../api/endpoints';
import { Service } from '../types';
import { useAuthStore } from '../stores/authStore';

export const serviceService = {
  async getAll(): Promise<Service[]> {
    const tenantId = useAuthStore.getState().tenantId;
    const response = await api.get<Service[]>(API_ENDPOINTS.SERVICES.BASE, {
      params: { tenantId },
    });
    return response.data;
  },

  async getById(id: string): Promise<Service> {
    const tenantId = useAuthStore.getState().tenantId;
    const response = await api.get<Service>(API_ENDPOINTS.SERVICES.BY_ID(id), {
      params: { tenantId },
    });
    return response.data;
  },
};
