import { useQuery } from '@tanstack/react-query';
import { customerService } from '../services/customer.service';

export const customerKeys = {
  all: ['customer'] as const,
  profile: () => [...customerKeys.all, 'profile'] as const,
};

export function useCustomerProfile() {
  return useQuery({
    queryKey: customerKeys.profile(),
    queryFn: customerService.getProfile,
  });
}
