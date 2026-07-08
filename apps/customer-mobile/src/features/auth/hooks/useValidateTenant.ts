import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/auth.service';

export function useValidateTenant() {
  return useMutation({
    mutationFn: (slug: string) => authService.validateTenant(slug),
  });
}
