import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';

const DELIVERY_KEY = 'delivery';

export const useRoutes = (tenantId: string) => {
  return useQuery({
    queryKey: [DELIVERY_KEY, 'routes', tenantId],
    queryFn: async () => {
      const { data } = await api.get(`/delivery/routes?tenantId=${tenantId}`);
      return data;
    },
    enabled: !!tenantId,
  });
};

export const useVehicles = (tenantId: string) => {
  return useQuery({
    queryKey: [DELIVERY_KEY, 'vehicles', tenantId],
    queryFn: async () => {
      const { data } = await api.get(`/delivery/vehicles?tenantId=${tenantId}`);
      return data;
    },
    enabled: !!tenantId,
  });
};

export const useDrivers = (tenantId: string) => {
  return useQuery({
    queryKey: [DELIVERY_KEY, 'drivers', tenantId],
    queryFn: async () => {
      const { data } = await api.get(`/delivery/drivers?tenantId=${tenantId}`);
      return data;
    },
    enabled: !!tenantId,
  });
};

export const useStops = (tenantId: string, routeId?: string) => {
  return useQuery({
    queryKey: [DELIVERY_KEY, 'stops', tenantId, routeId],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('tenantId', tenantId);
      if (routeId) params.append('routeId', routeId);
      const { data } = await api.get(`/delivery/stops?${params.toString()}`);
      return data;
    },
    enabled: !!tenantId,
  });
};

export const useCreateRoute = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (routeData: any) => {
      const { data } = await api.post('/delivery/routes', routeData);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [DELIVERY_KEY] }),
  });
};
