import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

const USERS_KEY = 'users';

export const useUsers = (tenantId: string, role?: string) => {
  return useQuery({
    queryKey: [USERS_KEY, tenantId, role],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('tenantId', tenantId);
      if (role) params.append('role', role);
      const { data } = await api.get(`/users?${params.toString()}`);
      return data;
    },
    enabled: !!tenantId,
  });
};
