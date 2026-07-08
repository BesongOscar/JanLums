import { render, screen, fireEvent } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';

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

const mockUseLoyalty = jest.fn();
jest.mock('../../../src/hooks/useLoyalty', () => ({
  useLoyalty: () => mockUseLoyalty(),
}));

import LoyaltyScreen from '../../../app/(tabs)/account/loyalty';

const mockLoyaltyData = {
  tier: 'gold',
  points: 3200,
  totalOrders: 12,
  totalSpent: 145000,
  nextTier: 'platinum',
  pointsToNextTier: 1800,
  progressPercent: 64,
};

function renderScreen() {
  return render(
    <PaperProvider>
      <LoyaltyScreen />
    </PaperProvider>
  );
}

describe('LoyaltyScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseLoyalty.mockReturnValue({
      data: mockLoyaltyData,
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
      isRefetching: false,
    });
  });

  describe('loading state', () => {
    it('shows loading indicator', () => {
      mockUseLoyalty.mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
        refetch: jest.fn(),
        isRefetching: false,
      });
      renderScreen();
      expect(screen.getByRole('progressbar', { busy: true })).toBeTruthy();
    });
  });

  describe('error state', () => {
    it('shows error message and retry button', () => {
      const refetch = jest.fn();
      mockUseLoyalty.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
        refetch,
        isRefetching: false,
      });
      renderScreen();
      expect(screen.getByText('Failed to load loyalty data')).toBeTruthy();
      fireEvent.press(screen.getByText('Retry'));
      expect(refetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('populated state', () => {
    it('renders tier information', () => {
      renderScreen();
      const goldElements = screen.getAllByText('Gold');
      expect(goldElements.length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('3,200')).toBeTruthy();
      expect(screen.getByText('Loyalty Points')).toBeTruthy();
    });

    it('renders progress section when next tier exists', () => {
      renderScreen();
      expect(screen.getByText(/1,800 points to/)).toBeTruthy();
      expect(screen.getByText('64%')).toBeTruthy();
    });

    it('renders statistics', () => {
      renderScreen();
      expect(screen.getByText('12')).toBeTruthy();
      expect(screen.getByText('Total Orders')).toBeTruthy();
      expect(screen.getByText(/145.*000.*FCFA/)).toBeTruthy();
      expect(screen.getByText('Total Spent')).toBeTruthy();
    });

    it('renders tiers info section', () => {
      renderScreen();
      expect(screen.getByText('Tiers & Benefits')).toBeTruthy();
      expect(screen.getByText(/Join and start earning/)).toBeTruthy();
    });

    it('marks current tier with badge', () => {
      renderScreen();
      expect(screen.getByText('Current')).toBeTruthy();
    });

    it('tracks screen view on mount', () => {
      renderScreen();
      expect(mockTrack).toHaveBeenCalledWith({ name: 'loyalty_screen_viewed' });
    });
  });

  describe('edge cases', () => {
    it('handles platinum tier with no next tier', () => {
      mockUseLoyalty.mockReturnValue({
        data: {
          tier: 'platinum',
          points: 10000,
          totalOrders: 40,
          totalSpent: 600000,
          nextTier: null,
          pointsToNextTier: 0,
          progressPercent: 100,
        },
        isLoading: false,
        isError: false,
        refetch: jest.fn(),
        isRefetching: false,
      });
      renderScreen();
      const platinumElements = screen.getAllByText('Platinum');
      expect(platinumElements.length).toBeGreaterThanOrEqual(1);
      expect(screen.queryByText(/points to/)).toBeNull();
    });
  });
});
