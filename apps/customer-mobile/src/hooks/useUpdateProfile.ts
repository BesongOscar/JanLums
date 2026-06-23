import { useMutation, useQueryClient } from '@tanstack/react-query';
import { customerService } from '../services/customer.service';
import { customerKeys } from './useCustomerProfile';
import type { Customer } from '../types';

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Pick<Customer, 'firstName' | 'lastName' | 'phone' | 'address' | 'city'>>) =>
      customerService.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.profile() });
    },
  });
}
