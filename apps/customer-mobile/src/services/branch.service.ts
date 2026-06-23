import api from '../api/client';
import { API_ENDPOINTS } from '../api/endpoints';
import { Branch } from '../types';
import { useAuthStore } from '../stores/authStore';

export const branchService = {
  async getAll(): Promise<Branch[]> {
    const tenantId = useAuthStore.getState().tenantId;
    const response = await api.get<Branch[]>(API_ENDPOINTS.BRANCHES.BASE, {
      params: { tenantId },
    });
    return response.data;
  },

  async getById(id: string): Promise<Branch> {
    const response = await api.get<Branch>(API_ENDPOINTS.BRANCHES.BY_ID(id));
    return response.data;
  },
};
