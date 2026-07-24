import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../../../stores/authStore';

export function useLogin() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: async (response) => {
      if (response.user.role !== 'customer') {
        throw new Error('This account is not authorized for the customer app.');
      }
      await setAuth(response.accessToken, response.refreshToken ?? null, response.user);
      queryClient.clear();
      router.replace('/(tabs)');
    },
  });
}
