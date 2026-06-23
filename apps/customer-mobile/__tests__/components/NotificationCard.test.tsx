import { render, screen, fireEvent } from '@testing-library/react-native';
import { NotificationCard } from '../../src/components/features/NotificationCard';
import { AppNotification, BackendNotificationType } from '../../src/types';

jest.mock('../../src/utils/format', () => ({
  formatRelativeTime: () => '5 minutes ago',
}));

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

function getCardButton() {
  return screen.getAllByRole('button').find((b) => b.props.accessibilityState !== undefined)!;
}

function getDeleteButton() {
  return screen.getByLabelText(/^Delete notification/);
}

describe('NotificationCard', () => {
  it('renders title and message', () => {
    render(
      <NotificationCard notification={createNotification()} onPress={() => {}} onDelete={() => {}} />
    );
    expect(screen.getByText('Test Notification')).toBeTruthy();
    expect(screen.getByText('This is a test message.')).toBeTruthy();
  });

  it('renders relative timestamp', () => {
    render(
      <NotificationCard notification={createNotification()} onPress={() => {}} onDelete={() => {}} />
    );
    expect(screen.getByText('5 minutes ago')).toBeTruthy();
  });

  describe('unread state', () => {
    it('shows Unread in accessibility label', () => {
      render(
        <NotificationCard notification={createNotification({ isRead: false })} onPress={() => {}} onDelete={() => {}} />
      );
      expect(screen.getByLabelText(/^Unread notification/)).toBeTruthy();
    });

    it('sets accessibilityState selected to true', () => {
      render(
        <NotificationCard notification={createNotification({ isRead: false })} onPress={() => {}} onDelete={() => {}} />
      );
      expect(getCardButton().props.accessibilityState?.selected).toBe(true);
    });
  });

  describe('read state', () => {
    it('does not show Unread in accessibility label', () => {
      render(
        <NotificationCard notification={createNotification({ isRead: true })} onPress={() => {}} onDelete={() => {}} />
      );
      expect(screen.queryByLabelText(/^Unread notification/)).toBeNull();
      // Card still renders with selected=false
      expect(getCardButton().props.accessibilityState?.selected).toBe(false);
    });

    it('sets accessibilityState selected to false', () => {
      render(
        <NotificationCard notification={createNotification({ isRead: true })} onPress={() => {}} onDelete={() => {}} />
      );
      expect(getCardButton().props.accessibilityState?.selected).toBe(false);
    });
  });

  describe('interactions', () => {
    it('calls onPress when card is pressed', () => {
      const onPress = jest.fn();
      render(
        <NotificationCard notification={createNotification()} onPress={onPress} onDelete={() => {}} />
      );
      fireEvent.press(getCardButton());
      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('calls onDelete when delete button is pressed', () => {
      const onDelete = jest.fn();
      render(
        <NotificationCard notification={createNotification()} onPress={() => {}} onDelete={onDelete} />
      );
      fireEvent.press(getDeleteButton());
      expect(onDelete).toHaveBeenCalledTimes(1);
    });

    it('calls onDelete on long press of card', () => {
      const onDelete = jest.fn();
      render(
        <NotificationCard notification={createNotification()} onPress={() => {}} onDelete={onDelete} />
      );
      fireEvent(getCardButton(), 'onLongPress');
      expect(onDelete).toHaveBeenCalledTimes(1);
    });
  });

  describe('type icon rendering', () => {
    it('renders type icon container for each notification type', () => {
      const types: BackendNotificationType[] = [
        'order_created', 'order_received', 'order_processing',
        'order_ready', 'order_completed', 'system',
      ];
      types.forEach((type) => {
        const { unmount } = render(
          <NotificationCard notification={createNotification({ type })} onPress={() => {}} onDelete={() => {}} />
        );
        expect(screen.getByText('Test Notification')).toBeTruthy();
        expect(screen.getByText('5 minutes ago')).toBeTruthy();
        unmount();
      });
    });
  });
});
