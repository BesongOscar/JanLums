import { useQuery } from '@tanstack/react-query';
import { orderService } from '../services/order.service';
import { orderKeys } from './useMyOrders';

export function useOrderDetails(orderId: string) {
  return useQuery({
    queryKey: [...orderKeys.all, 'detail', orderId] as const,
    queryFn: () => orderService.getOrderById(orderId),
    enabled: !!orderId,
  });
}
