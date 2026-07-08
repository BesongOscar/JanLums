import api from '../api/client';
import { API_ENDPOINTS } from '../api/endpoints';

export interface LoyaltyData {
  tier: string;
  points: number;
  totalOrders: number;
  totalSpent: number;
  nextTier: string | null;
  pointsToNextTier: number;
  progressPercent: number;
}

export const loyaltyService = {
  async getLoyaltyData(): Promise<LoyaltyData> {
    const response = await api.get<LoyaltyData>(API_ENDPOINTS.LOYALTY.ME);
    return response.data;
  },
};
