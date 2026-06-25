import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '../services/notification.service';
import { AppNotification } from '../types';

export const notificationKeys = {
  all: ['notifications'] as const,
  lists: () => [...notificationKeys.all, 'list'] as const,
  list: () => [...notificationKeys.lists()] as const,
  unreadCount: () => [...notificationKeys.all, 'unread-count'] as const,
};

export function useNotifications() {
  return useQuery({
    queryKey: notificationKeys.list(),
    queryFn: notificationService.getNotifications,
  });
}

export function useUnreadNotificationCount() {
  return useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: notificationService.getUnreadCount,
    refetchInterval: 30000,
    refetchIntervalInBackground: false,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: notificationKeys.list() });
      const previous = queryClient.getQueryData<AppNotification[]>(notificationKeys.list());

      queryClient.setQueryData<AppNotification[]>(notificationKeys.list(), (old: AppNotification[] | undefined) =>
        old?.map((n: AppNotification) => (n.id === id ? { ...n, isRead: true } : n)),
      );

      queryClient.setQueryData<{ count: number }>(notificationKeys.unreadCount(), (old: { count: number } | undefined) =>
        old ? { count: Math.max(0, old.count - 1) } : old,
      );

      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(notificationKeys.list(), context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.list() });
      queryClient.invalidateQueries({ queryKey: notificationKeys.unreadCount() });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationService.markAllAsRead,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: notificationKeys.list() });
      const previous = queryClient.getQueryData<AppNotification[]>(notificationKeys.list());

      queryClient.setQueryData<AppNotification[]>(notificationKeys.list(), (old: AppNotification[] | undefined) =>
        old?.map((n: AppNotification) => ({ ...n, isRead: true })),
      );

      queryClient.setQueryData<{ count: number }>(notificationKeys.unreadCount(), { count: 0 });

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(notificationKeys.list(), context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.list() });
      queryClient.invalidateQueries({ queryKey: notificationKeys.unreadCount() });
    },
  });
}

export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationService.deleteNotification(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: notificationKeys.list() });
      const previous = queryClient.getQueryData<AppNotification[]>(notificationKeys.list());

      const deleted = previous?.find((n: AppNotification) => n.id === id);
      queryClient.setQueryData<AppNotification[]>(notificationKeys.list(), (old: AppNotification[] | undefined) =>
        old?.filter((n: AppNotification) => n.id !== id),
      );

      if (deleted && !deleted.isRead) {
        queryClient.setQueryData<{ count: number }>(notificationKeys.unreadCount(), (old: { count: number } | undefined) =>
          old ? { count: Math.max(0, old.count - 1) } : old,
        );
      }

      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(notificationKeys.list(), context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.list() });
      queryClient.invalidateQueries({ queryKey: notificationKeys.unreadCount() });
    },
  });
}

export function useDeleteAllNotifications() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationService.deleteAllNotifications,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: notificationKeys.list() });
      const previous = queryClient.getQueryData<AppNotification[]>(notificationKeys.list());

      queryClient.setQueryData<AppNotification[]>(notificationKeys.list(), []);
      queryClient.setQueryData<{ count: number }>(notificationKeys.unreadCount(), { count: 0 });

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(notificationKeys.list(), context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.list() });
      queryClient.invalidateQueries({ queryKey: notificationKeys.unreadCount() });
    },
  });
}
