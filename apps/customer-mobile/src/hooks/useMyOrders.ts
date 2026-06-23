import { useQuery } from '@tanstack/react-query';
import { orderService } from '../services/order.service';

export const orderKeys = {
  all: ['orders'] as const,
  mine: () => [...orderKeys.all, 'mine'] as const,
};

export function useMyOrders() {
  return useQuery({
    queryKey: orderKeys.mine(),
    queryFn: orderService.getMyOrders,
  });
}
