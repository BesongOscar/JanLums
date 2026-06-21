import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

const SERVICES_KEY = 'services';

export const useServices = (tenantId: string) => {
  return useQuery({
    queryKey: [SERVICES_KEY, tenantId],
    queryFn: async () => {
      const { data } = await api.get(`/services?tenantId=${tenantId}`);
      return data;
    },
    enabled: !!tenantId,
  });
};

export const useServicesByCategory = (tenantId: string, category: string) => {
  return useQuery({
    queryKey: [SERVICES_KEY, 'category', tenantId, category],
    queryFn: async () => {
      const { data } = await api.get(`/services/category/${category}?tenantId=${tenantId}`);
      return data;
    },
    enabled: !!tenantId && !!category,
  });
};
