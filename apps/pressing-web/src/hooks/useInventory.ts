import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';

const INVENTORY_KEY = 'inventory';

export const useInventory = (tenantId: string) => {
  return useQuery({
    queryKey: [INVENTORY_KEY, tenantId],
    queryFn: async () => {
      const { data } = await api.get(`/inventory?tenantId=${tenantId}`);
      return data;
    },
    enabled: !!tenantId,
  });
};

export const useInventoryTransactions = (tenantId: string) => {
  return useQuery({
    queryKey: [INVENTORY_KEY, 'transactions', tenantId],
    queryFn: async () => {
      const { data } = await api.get(`/inventory/transactions?tenantId=${tenantId}`);
      return data;
    },
    enabled: !!tenantId,
  });
};

export const useSuppliers = (tenantId: string) => {
  return useQuery({
    queryKey: [INVENTORY_KEY, 'suppliers', tenantId],
    queryFn: async () => {
      const { data } = await api.get(`/inventory/suppliers?tenantId=${tenantId}`);
      return data;
    },
    enabled: !!tenantId,
  });
};

export const useCreateInventoryItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (itemData: any) => {
      const { data } = await api.post('/inventory', itemData);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [INVENTORY_KEY] }),
  });
};
