import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../../../stores/authStore';

export function useLogin() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: authService.login,
    onSuccess: async (response) => {
      await setAuth(response.accessToken, response.refreshToken ?? null, response.user);
      router.replace('/(tabs)');
    },
  });
}
