import { useQuery } from '@tanstack/react-query';
import { serviceService } from '../services/service.service';

export const serviceKeys = {
  all: ['services'] as const,
  lists: () => [...serviceKeys.all, 'list'] as const,
  details: () => [...serviceKeys.all, 'detail'] as const,
  detail: (id: string) => [...serviceKeys.details(), id] as const,
};

export function useServices() {
  return useQuery({
    queryKey: serviceKeys.lists(),
    queryFn: serviceService.getAll,
  });
}

export function useServiceDetails(id: string) {
  return useQuery({
    queryKey: serviceKeys.detail(id),
    queryFn: () => serviceService.getById(id),
    enabled: !!id,
  });
}
