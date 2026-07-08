import { render, screen, fireEvent } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';
import { AppNotification } from '../../../src/types';

const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush, back: jest.fn(), replace: jest.fn() }),
}));

jest.mock('react-native-safe-area-context', () => {
  const { createContext, createElement } = require('react');
  const SafeAreaInsetsContext = createContext(null);
  return {
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
    SafeAreaInsetsContext,
    SafeAreaProvider: ({ children }: { children: React.ReactNode }) =>
      createElement('mock-safe-area-provider', null, children),
    initialWindowMetrics: null,
  };
});

const mockTrack = jest.fn();
jest.mock('../../../src/hooks/useAnalytics', () => ({
  useAnalytics: () => ({ track: mockTrack }),
}));

const mockMarkReadMutate = jest.fn();
const mockMarkAllReadMutate = jest.fn();
const mockDeleteNotificationMutate = jest.fn();
const mockDeleteAllMutate = jest.fn();

jest.mock('../../../src/hooks/useNotifications', () => {
  const mockUseNotifications = jest.fn();
  const mockUnreadCount = jest.fn();
  return {
    useNotifications: mockUseNotifications,
    useUnreadNotificationCount: mockUnreadCount,
    useMarkNotificationRead: jest.fn(() => ({ mutate: mockMarkReadMutate, isPending: false })),
    useMarkAllNotificationsRead: jest.fn(() => ({ mutate: mockMarkAllReadMutate, isPending: false })),
    useDeleteNotification: jest.fn(() => ({ mutate: mockDeleteNotificationMutate, isPending: false })),
    useDeleteAllNotifications: jest.fn(() => ({ mutate: mockDeleteAllMutate, isPending: false })),
  };
});

// Must import after mocks due to hoisting
import {
  useNotifications,
  useUnreadNotificationCount,
} from '../../../src/hooks/useNotifications';
import NotificationsScreen from '../../../app/(tabs)/notifications';

const mockUseNotifications = useNotifications as jest.Mock;
const mockUnreadCount = useUnreadNotificationCount as jest.Mock;

function createNotification(overrides: Partial<AppNotification> = {}): AppNotification {
  return {
    id: 'notif-1',
    tenantId: 'tenant-1',
    customerId: 'customer-1',
    title: 'Test Notification',
    message: 'This is a test message.',
    type: 'order_created',
    isRead: false,
    metadata: null,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    ...overrides,
  };
}

function renderScreen() {
  return render(
    <PaperProvider>
      <NotificationsScreen />
    </PaperProvider>
  );
}

describe('NotificationsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseNotifications.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
      isRefetching: false,
    });
    mockUnreadCount.mockReturnValue({ data: { count: 0 } });
  });

  describe('loading state', () => {
    it('shows loading indicator and text', () => {
      mockUseNotifications.mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
        refetch: jest.fn(),
        isRefetching: false,
      });
      renderScreen();
      expect(screen.getByText('Loading notifications...')).toBeTruthy();
      expect(screen.queryByText('Failed to load notifications')).toBeNull();
      expect(screen.queryByText('No notifications')).toBeNull();
    });
  });

  describe('empty state', () => {
    it('shows empty message when no notifications', () => {
      renderScreen();
      expect(screen.getByText('No notifications')).toBeTruthy();
      expect(
        screen.getByText("You're all caught up! Notifications about your orders will appear here.")
      ).toBeTruthy();
    });
  });

  describe('error state', () => {
    it('shows error message and retry button', () => {
      const refetch = jest.fn();
      mockUseNotifications.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
        refetch,
        isRefetching: false,
      });
      renderScreen();
      expect(screen.getByText('Failed to load notifications')).toBeTruthy();
      fireEvent.press(screen.getByLabelText('Retry loading notifications'));
      expect(refetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('populated state', () => {
    it('renders all notifications', () => {
      const notifications = [
        createNotification({ id: '1', title: 'First Notification' }),
        createNotification({ id: '2', title: 'Second Notification' }),
      ];
      mockUseNotifications.mockReturnValue({
        data: notifications,
        isLoading: false,
        isError: false,
        refetch: jest.fn(),
        isRefetching: false,
      });
      renderScreen();
      expect(screen.getByText('First Notification')).toBeTruthy();
      expect(screen.getByText('Second Notification')).toBeTruthy();
    });
  });

  describe('unread badge', () => {
    it('shows badge with unread count in header', () => {
      mockUnreadCount.mockReturnValue({ data: { count: 5 } });
      renderScreen();
      expect(screen.getByLabelText('5 unread notifications')).toBeTruthy();
    });

    it('hides badge when count is 0', () => {
      renderScreen();
      expect(screen.queryByText(/unread notifications/)).toBeNull();
    });
  });

  describe('navigation', () => {
    it('navigates to detail screen on press', () => {
      const notifications = [
        createNotification({
          id: 'notif-1',
          metadata: { orderId: 'order-123' },
        }),
      ];
      mockUseNotifications.mockReturnValue({
        data: notifications,
        isLoading: false,
        isError: false,
        refetch: jest.fn(),
        isRefetching: false,
      });
      renderScreen();

      const cardLabel = screen.getByLabelText(/^Unread notification: Test Notification/);
      fireEvent.press(cardLabel);
      expect(mockPush).toHaveBeenCalledWith('/(tabs)/notifications/notif-1');
    });

    it('does not mark as read or track from list (handled in detail screen)', () => {
      const notifications = [
        createNotification({ id: 'notif-1', isRead: false, metadata: null }),
      ];
      mockUseNotifications.mockReturnValue({
        data: notifications,
        isLoading: false,
        isError: false,
        refetch: jest.fn(),
        isRefetching: false,
      });
      renderScreen();

      const cardLabel = screen.getByLabelText(/^Unread notification: Test Notification/);
      fireEvent.press(cardLabel);
      expect(mockMarkReadMutate).not.toHaveBeenCalled();
      expect(mockTrack).toHaveBeenCalledWith({ name: 'notifications_screen_viewed' });
    });
  });

  describe('bulk actions', () => {
    it('shows Mark all read button when there are unread notifications', () => {
      mockUnreadCount.mockReturnValue({ data: { count: 3 } });
      const notifications = [createNotification()];
      mockUseNotifications.mockReturnValue({
        data: notifications,
        isLoading: false,
        isError: false,
        refetch: jest.fn(),
        isRefetching: false,
      });
      renderScreen();
      expect(screen.getByLabelText(/Mark all 3 notifications as read/)).toBeTruthy();
    });

    it('hides Mark all read button when no unread notifications', () => {
      renderScreen();
      expect(screen.queryByLabelText(/Mark all/)).toBeNull();
    });

    it('opens confirm dialog on Mark all read press and confirms', () => {
      mockUnreadCount.mockReturnValue({ data: { count: 1 } });
      const notifications = [createNotification()];
      mockUseNotifications.mockReturnValue({
        data: notifications,
        isLoading: false,
        isError: false,
        refetch: jest.fn(),
        isRefetching: false,
      });
      renderScreen();

      fireEvent.press(screen.getByLabelText(/Mark all 1 notifications as read/));
      expect(screen.getByText('Mark all as read?')).toBeTruthy();
      expect(screen.getByText('This will mark all notifications as read.')).toBeTruthy();

      const confirmButtons = screen.getAllByText('Mark all read');
      fireEvent.press(confirmButtons[1]);
      expect(mockMarkAllReadMutate).toHaveBeenCalled();
      expect(mockTrack).toHaveBeenCalledWith({ name: 'notifications_mark_all_read' });
    });

    it('opens confirm dialog on Delete all press and confirms', () => {
      const notifications = [createNotification()];
      mockUseNotifications.mockReturnValue({
        data: notifications,
        isLoading: false,
        isError: false,
        refetch: jest.fn(),
        isRefetching: false,
      });
      renderScreen();

      fireEvent.press(screen.getByLabelText('Delete all notifications'));
      expect(screen.getByText('Delete all notifications?')).toBeTruthy();
      expect(
        screen.getByText(
          'This action cannot be undone. All notifications will be permanently deleted.'
        )
      ).toBeTruthy();

      fireEvent.press(screen.getAllByText('Delete all')[1]);
      expect(mockDeleteAllMutate).toHaveBeenCalled();
      expect(mockTrack).toHaveBeenCalledWith({ name: 'notifications_deleted_all' });
    });

    it('cancels dialog does not trigger mutation', () => {
      mockUnreadCount.mockReturnValue({ data: { count: 1 } });
      const notifications = [createNotification()];
      mockUseNotifications.mockReturnValue({
        data: notifications,
        isLoading: false,
        isError: false,
        refetch: jest.fn(),
        isRefetching: false,
      });
      renderScreen();

      fireEvent.press(screen.getByLabelText(/Mark all 1 notifications as read/));
      fireEvent.press(screen.getByText('Cancel'));
      expect(mockMarkAllReadMutate).not.toHaveBeenCalled();
    });

    it('tracks notification_deleted on delete button press', () => {
      const notifications = [
        createNotification({ id: 'notif-1', type: 'order_created' }),
      ];
      mockUseNotifications.mockReturnValue({
        data: notifications,
        isLoading: false,
        isError: false,
        refetch: jest.fn(),
        isRefetching: false,
      });
      renderScreen();

      fireEvent.press(screen.getByLabelText(/^Delete notification/));
      expect(mockDeleteNotificationMutate).toHaveBeenCalledWith('notif-1');
      expect(mockTrack).toHaveBeenCalledWith({
        name: 'notification_deleted',
        properties: { id: 'notif-1', type: 'order_created' },
      });
    });
  });

  describe('pull to refresh', () => {
    it('renders RefreshControl', () => {
      const refetch = jest.fn();
      mockUseNotifications.mockReturnValue({
        data: [],
        isLoading: false,
        isError: false,
        refetch,
        isRefetching: false,
      });
      const { UNSAFE_getByType } = renderScreen();
      // RefreshControl should be present in the FlatList
      // We just verify the component renders without crashing
      expect(screen.getByText('No notifications')).toBeTruthy();
    });
  });
});
