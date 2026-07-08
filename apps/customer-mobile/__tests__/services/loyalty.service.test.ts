import api from '../../src/api/client';
import { loyaltyService } from '../../src/services/loyalty.service';

jest.mock('../../src/api/client', () => ({
  get: jest.fn(),
}));

const mockedApi = api as jest.Mocked<typeof api>;

const mockLoyaltyData = {
  tier: 'gold',
  points: 3200,
  totalOrders: 12,
  totalSpent: 145000,
  nextTier: 'platinum',
  pointsToNextTier: 1800,
  progressPercent: 64,
};

describe('loyaltyService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getLoyaltyData', () => {
    it('returns loyalty data on success', async () => {
      (mockedApi.get as jest.Mock).mockResolvedValue({ data: mockLoyaltyData });

      const result = await loyaltyService.getLoyaltyData();

      expect(mockedApi.get).toHaveBeenCalledWith('/customers/me/loyalty');
      expect(result).toEqual(mockLoyaltyData);
    });

    it('throws when API fails', async () => {
      const error = new Error('Network error');
      (mockedApi.get as jest.Mock).mockRejectedValue(error);

      await expect(loyaltyService.getLoyaltyData()).rejects.toThrow('Network error');
    });

    it('throws on 401 unauthorized', async () => {
      const error = { response: { status: 401 } };
      (mockedApi.get as jest.Mock).mockRejectedValue(error);

      await expect(loyaltyService.getLoyaltyData()).rejects.toEqual(error);
    });
  });
});
