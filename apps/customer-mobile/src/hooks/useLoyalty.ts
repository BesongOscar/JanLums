import { useQuery } from '@tanstack/react-query';
import { loyaltyService } from '../services/loyalty.service';

export const loyaltyKeys = {
  all: ['loyalty'] as const,
  data: () => [...loyaltyKeys.all, 'data'] as const,
};

export function useLoyalty() {
  return useQuery({
    queryKey: loyaltyKeys.data(),
    queryFn: loyaltyService.getLoyaltyData,
  });
}
