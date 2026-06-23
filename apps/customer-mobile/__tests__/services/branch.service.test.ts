import api from '../../src/api/client';
import { branchService } from '../../src/services/branch.service';
import { useAuthStore } from '../../src/stores/authStore';
import { Branch } from '../../src/types';

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

jest.mock('../../src/api/client', () => ({
  get: jest.fn(),
}));

const mockedApi = api as jest.Mocked<typeof api>;

const mockBranches: Branch[] = [
  {
    id: 'br-1',
    tenantId: 'tenant-1',
    name: 'Downtown Branch',
    address: '123 Main Street',
    city: 'Yaounde',
    phone: '+237 612345678',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'br-2',
    tenantId: 'tenant-1',
    name: 'Market Branch',
    address: '45 Market Road',
    city: 'Douala',
    phone: '+237 698765432',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

describe('branchService', () => {
  beforeAll(() => {
    useAuthStore.setState({ tenantId: 'tenant-1' });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('returns all branches on success', async () => {
      (mockedApi.get as jest.Mock).mockResolvedValue({ data: mockBranches });

      const result = await branchService.getAll();

      expect(mockedApi.get).toHaveBeenCalledWith('/branches', {
        params: { tenantId: 'tenant-1' },
      });
      expect(result).toEqual(mockBranches);
      expect(result).toHaveLength(2);
    });

    it('returns empty array when no branches', async () => {
      (mockedApi.get as jest.Mock).mockResolvedValue({ data: [] });

      const result = await branchService.getAll();

      expect(result).toEqual([]);
    });

    it('throws on network failure', async () => {
      const error = new Error('Network error');
      (mockedApi.get as jest.Mock).mockRejectedValue(error);

      await expect(branchService.getAll()).rejects.toThrow('Network error');
    });
  });

  describe('getById', () => {
    it('returns a single branch on success', async () => {
      (mockedApi.get as jest.Mock).mockResolvedValue({ data: mockBranches[0] });

      const result = await branchService.getById('br-1');

      expect(mockedApi.get).toHaveBeenCalledWith('/branches/br-1');
      expect(result.name).toBe('Downtown Branch');
    });
  });
});
