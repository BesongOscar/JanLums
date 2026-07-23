import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

export const useReportsSummary = (tenantId: string, period?: string, branchId?: string) => {
  return useQuery({
    queryKey: ['reports', 'summary', tenantId, period, branchId],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('tenantId', tenantId);
      if (period) params.append('period', period);
      if (branchId) params.append('branchId', branchId);
      const { data } = await api.get(`/reports/summary?${params.toString()}`);
      return data;
    },
    enabled: !!tenantId,
  });
};

export const useTopServices = (tenantId: string, branchId?: string) => {
  return useQuery({
    queryKey: ['reports', 'top-services', tenantId, branchId],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('tenantId', tenantId);
      if (branchId) params.append('branchId', branchId);
      const { data } = await api.get(`/reports/top-services?${params.toString()}`);
      return data;
    },
    enabled: !!tenantId,
  });
};
