import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';

const PAYROLL_KEY = 'payroll';

export const usePayrollPeriods = (tenantId: string) => {
  return useQuery({
    queryKey: [PAYROLL_KEY, 'periods', tenantId],
    queryFn: async () => {
      const { data } = await api.get(`/payroll/periods?tenantId=${tenantId}`);
      return data;
    },
    enabled: !!tenantId,
  });
};

export const useWorkEntries = (tenantId: string, periodId?: string) => {
  return useQuery({
    queryKey: [PAYROLL_KEY, 'entries', tenantId, periodId],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('tenantId', tenantId);
      if (periodId) params.append('periodId', periodId);
      const { data } = await api.get(`/payroll/work-entries?${params.toString()}`);
      return data;
    },
    enabled: !!tenantId,
  });
};

export const usePayslips = (tenantId: string, periodId?: string) => {
  return useQuery({
    queryKey: [PAYROLL_KEY, 'payslips', tenantId, periodId],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('tenantId', tenantId);
      if (periodId) params.append('periodId', periodId);
      const { data } = await api.get(`/payroll/payslips?${params.toString()}`);
      return data;
    },
    enabled: !!tenantId,
  });
};

export const useCreatePayrollPeriod = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (periodData: any) => {
      const { data } = await api.post('/payroll/periods', periodData);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [PAYROLL_KEY] }),
  });
};
