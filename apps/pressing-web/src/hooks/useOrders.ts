import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';

const ORDERS_KEY = 'orders';

export const useOrders = (tenantId: string, branchId?: string) => {
  return useQuery({
    queryKey: [ORDERS_KEY, tenantId, branchId],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('tenantId', tenantId);
      if (branchId) params.append('branchId', branchId);
      const { data } = await api.get(`/orders?${params.toString()}`);
      return data;
    },
    enabled: !!tenantId,
  });
};

export const useOrderStats = (tenantId: string, branchId?: string) => {
  return useQuery({
    queryKey: [ORDERS_KEY, 'stats', tenantId, branchId],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('tenantId', tenantId);
      if (branchId) params.append('branchId', branchId);
      const { data } = await api.get(`/orders/stats?${params.toString()}`);
      return data;
    },
    enabled: !!tenantId,
  });
};

export const useOrderById = (tenantId: string, id: string) => {
  return useQuery({
    queryKey: [ORDERS_KEY, tenantId, id],
    queryFn: async () => {
      const { data } = await api.get(`/orders/${id}?tenantId=${tenantId}`);
      return data;
    },
    enabled: !!tenantId && !!id,
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (orderData: any) => {
      const { data } = await api.post('/orders', orderData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ORDERS_KEY] });
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, tenantId, status }: { id: string; tenantId: string; status: string }) => {
      const { data } = await api.put(`/orders/${id}/status?tenantId=${tenantId}`, { status });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ORDERS_KEY] });
    },
  });
};
