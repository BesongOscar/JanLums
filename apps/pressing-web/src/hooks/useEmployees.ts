import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';

const EMPLOYEES_KEY = 'employees';

export const useEmployees = (tenantId: string) => {
  return useQuery({
    queryKey: [EMPLOYEES_KEY, tenantId],
    queryFn: async () => {
      const { data } = await api.get(`/employees?tenantId=${tenantId}`);
      return data;
    },
    enabled: !!tenantId,
  });
};

export const useShifts = (tenantId: string) => {
  return useQuery({
    queryKey: [EMPLOYEES_KEY, 'shifts', tenantId],
    queryFn: async () => {
      const { data } = await api.get(`/employees/shifts?tenantId=${tenantId}`);
      return data;
    },
    enabled: !!tenantId,
  });
};

export const useAttendance = (tenantId: string, date?: string) => {
  return useQuery({
    queryKey: [EMPLOYEES_KEY, 'attendance', tenantId, date],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('tenantId', tenantId);
      if (date) params.append('date', date);
      const { data } = await api.get(`/employees/attendance?${params.toString()}`);
      return data;
    },
    enabled: !!tenantId,
  });
};

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (employeeData: any) => {
      const { data } = await api.post('/employees', employeeData);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [EMPLOYEES_KEY] }),
  });
};
