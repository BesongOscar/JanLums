import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PropsWithChildren } from 'react';
import { useLoyalty } from '../../src/hooks/useLoyalty';
import { loyaltyService } from '../../src/services/loyalty.service';

jest.mock('../../src/services/loyalty.service');

const mockLoyaltyService = loyaltyService as jest.Mocked<typeof loyaltyService>;

const mockLoyaltyData = {
  tier: 'gold',
  points: 3200,
  totalOrders: 12,
  totalSpent: 145000,
  nextTier: 'platinum',
  pointsToNextTier: 1800,
  progressPercent: 64,
};

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('useLoyalty', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns loyalty data on success', async () => {
    mockLoyaltyService.getLoyaltyData.mockResolvedValue(mockLoyaltyData);

    const { result } = renderHook(() => useLoyalty(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(mockLoyaltyData);
    expect(result.current.isError).toBe(false);
  });

  it('handles error state', async () => {
    mockLoyaltyService.getLoyaltyData.mockRejectedValue(new Error('API error'));

    const { result } = renderHook(() => useLoyalty(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.data).toBeUndefined();
  });

  it('calls the loyalty service', () => {
    renderHook(() => useLoyalty(), {
      wrapper: createWrapper(),
    });

    expect(mockLoyaltyService.getLoyaltyData).toHaveBeenCalledTimes(1);
  });
});
