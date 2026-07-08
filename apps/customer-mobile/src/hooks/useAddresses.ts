import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { addressService } from '../services/address.service';
import type { Address } from '../types';

export const addressKeys = {
  all: ['addresses'] as const,
  lists: () => [...addressKeys.all, 'list'] as const,
  details: () => [...addressKeys.all, 'detail'] as const,
  detail: (id: string) => [...addressKeys.details(), id] as const,
};

export function useAddresses() {
  return useQuery({
    queryKey: addressKeys.lists(),
    queryFn: addressService.getAll,
  });
}

export function useAddress(id: string) {
  return useQuery({
    queryKey: addressKeys.detail(id),
    queryFn: () => addressService.getById(id),
    enabled: !!id,
  });
}

export function useCreateAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addressService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressKeys.lists() });
    },
  });
}

export function useUpdateAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Parameters<typeof addressService.update>[1];
    }) => addressService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressKeys.lists() });
    },
  });
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addressService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressKeys.lists() });
    },
  });
}
