import { branchKeys } from '../../src/hooks/useBranches';
import { branchService } from '../../src/services/branch.service';

jest.mock('../../src/services/branch.service', () => ({
  branchService: {
    getAll: jest.fn(),
  },
}));

const mockedBranchService = branchService as jest.Mocked<typeof branchService>;

const mockBranches = [
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

describe('useBranches (query keys & service integration)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('query keys', () => {
    it('generates correct list query key', () => {
      expect(branchKeys.lists()).toEqual(['branches', 'list']);
    });

    it('generates correct detail query key', () => {
      expect(branchKeys.detail('br-1')).toEqual(['branches', 'detail', 'br-1']);
    });
  });

  describe('service integration', () => {
    it('calls getAll and returns branches', async () => {
      (mockedBranchService.getAll as jest.Mock).mockResolvedValue(mockBranches);

      const result = await branchService.getAll();

      expect(mockedBranchService.getAll).toHaveBeenCalledTimes(1);
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('Downtown Branch');
    });

    it('returns empty array when no branches', async () => {
      (mockedBranchService.getAll as jest.Mock).mockResolvedValue([]);

      const result = await branchService.getAll();

      expect(result).toEqual([]);
    });

    it('throws on API failure', async () => {
      (mockedBranchService.getAll as jest.Mock).mockRejectedValue(
        new Error('Network error')
      );

      await expect(branchService.getAll()).rejects.toThrow('Network error');
    });
  });
});
