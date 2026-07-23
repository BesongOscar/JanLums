import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';

export const useGarmentTypes = (tenantId: string) => {
  return useQuery({
    queryKey: ['garment-types', tenantId],
    queryFn: async () => {
      const { data } = await api.get(`/settings/garment-types?tenantId=${tenantId}`);
      return data;
    },
    enabled: !!tenantId,
  });
};

export const useCreateGarmentType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: any) => { const { data } = await api.post('/settings/garment-types', body); return data; },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['garment-types'] }),
  });
};

export const useFabricTypes = (tenantId: string) => {
  return useQuery({
    queryKey: ['fabric-types', tenantId],
    queryFn: async () => {
      const { data } = await api.get(`/settings/fabric-types?tenantId=${tenantId}`);
      return data;
    },
    enabled: !!tenantId,
  });
};

export const useCreateFabricType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: any) => { const { data } = await api.post('/settings/fabric-types', body); return data; },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['fabric-types'] }),
  });
};

export const usePromotions = (tenantId: string) => {
  return useQuery({
    queryKey: ['promotions', tenantId],
    queryFn: async () => {
      const { data } = await api.get(`/settings/promotions?tenantId=${tenantId}`);
      return data;
    },
    enabled: !!tenantId,
  });
};

export const useCreatePromotion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: any) => { const { data } = await api.post('/settings/promotions', body); return data; },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['promotions'] }),
  });
};

export const useCustomerTiers = (tenantId: string) => {
  return useQuery({
    queryKey: ['customer-tiers', tenantId],
    queryFn: async () => {
      const { data } = await api.get(`/settings/customer-tiers?tenantId=${tenantId}`);
      return data;
    },
    enabled: !!tenantId,
  });
};

export const useCreateCustomerTier = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: any) => { const { data } = await api.post('/settings/customer-tiers', body); return data; },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['customer-tiers'] }),
  });
};

export const usePricingRules = (tenantId: string) => {
  return useQuery({
    queryKey: ['pricing-rules', tenantId],
    queryFn: async () => {
      const { data } = await api.get(`/settings/pricing-rules?tenantId=${tenantId}`);
      return data;
    },
    enabled: !!tenantId,
  });
};

export const useCreatePricingRule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: any) => { const { data } = await api.post('/settings/pricing-rules', body); return data; },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pricing-rules'] }),
  });
};

export const useVehicleTypes = (tenantId: string) => {
  return useQuery({
    queryKey: ['vehicle-types', tenantId],
    queryFn: async () => {
      const { data } = await api.get(`/settings/vehicle-types?tenantId=${tenantId}`);
      return data;
    },
    enabled: !!tenantId,
  });
};

export const useCreateVehicleType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: any) => { const { data } = await api.post('/settings/vehicle-types', body); return data; },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['vehicle-types'] }),
  });
};
