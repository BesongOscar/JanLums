import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';

export const useLots = (tenantId: string) => {
  return useQuery({
    queryKey: ['lots', tenantId],
    queryFn: async () => {
      const { data } = await api.get(`/lots?tenantId=${tenantId}`);
      return data;
    },
    enabled: !!tenantId,
  });
};

export const useLotById = (id: string, tenantId: string) => {
  return useQuery({
    queryKey: ['lots', id, tenantId],
    queryFn: async () => {
      const { data } = await api.get(`/lots/${id}?tenantId=${tenantId}`);
      return data;
    },
    enabled: !!id && !!tenantId,
  });
};

export const useCreateLot = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (lotData: any) => {
      const { data } = await api.post('/lots', lotData);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['lots'] }),
  });
};

export const useGarments = (tenantId: string) => {
  return useQuery({
    queryKey: ['garments', tenantId],
    queryFn: async () => {
      const { data } = await api.get(`/garments?tenantId=${tenantId}`);
      return data;
    },
    enabled: !!tenantId,
  });
};

export const useGarmentById = (id: string, tenantId: string) => {
  return useQuery({
    queryKey: ['garments', id, tenantId],
    queryFn: async () => {
      const { data } = await api.get(`/garments/${id}?tenantId=${tenantId}`);
      return data;
    },
    enabled: !!id && !!tenantId,
  });
};
