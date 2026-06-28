import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';

const CUSTOMERS_KEY = 'customers';

export const useCustomers = (tenantId: string) => {
  return useQuery({
    queryKey: [CUSTOMERS_KEY, tenantId],
    queryFn: async () => {
      const { data } = await api.get(`/customers?tenantId=${tenantId}`);
      return data;
    },
    enabled: !!tenantId,
  });
};

export const useCustomerById = (tenantId: string, id: string) => {
  return useQuery({
    queryKey: [CUSTOMERS_KEY, tenantId, id],
    queryFn: async () => {
      const { data } = await api.get(`/customers/${id}?tenantId=${tenantId}`);
      return data;
    },
    enabled: !!tenantId && !!id,
  });
};

export const useSearchCustomers = (tenantId: string, query: string) => {
  return useQuery({
    queryKey: [CUSTOMERS_KEY, 'search', tenantId, query],
    queryFn: async () => {
      const { data } = await api.get(`/customers/search?tenantId=${tenantId}&q=${encodeURIComponent(query)}`);
      return data;
    },
    enabled: !!tenantId && query.length > 2,
  });
};

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (customerData: any) => {
      const { data } = await api.post('/customers', customerData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CUSTOMERS_KEY] });
    },
  });
};
