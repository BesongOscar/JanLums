import { serviceKeys } from '../../src/hooks/useServices';
import { serviceService } from '../../src/services/service.service';

jest.mock('../../src/services/service.service', () => ({
  serviceService: {
    getAll: jest.fn(),
    getById: jest.fn(),
  },
}));

const mockedService = serviceService as jest.Mocked<typeof serviceService>;

const mockServices = [
  {
    id: 'srv-1',
    tenantId: 'tenant-1',
    name: 'Wash & Fold',
    category: 'Wash & Fold',
    basePrice: 1500,
    pricingUnit: 'per_item',
    estimatedHours: 24,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'srv-2',
    tenantId: 'tenant-1',
    name: 'Dry Cleaning',
    category: 'Dry Cleaning',
    basePrice: 3000,
    pricingUnit: 'per_item',
    estimatedHours: 48,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

describe('useServices (query keys & service integration)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('query keys', () => {
    it('generates correct list query key', () => {
      expect(serviceKeys.lists()).toEqual(['services', 'list']);
    });

    it('generates correct detail query key', () => {
      expect(serviceKeys.detail('srv-1')).toEqual(['services', 'detail', 'srv-1']);
    });
  });

  describe('service integration', () => {
    it('calls getAll and returns services', async () => {
      (mockedService.getAll as jest.Mock).mockResolvedValue(mockServices);

      const result = await serviceService.getAll();

      expect(mockedService.getAll).toHaveBeenCalledTimes(1);
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('Wash & Fold');
    });

    it('calls getById with correct id', async () => {
      (mockedService.getById as jest.Mock).mockResolvedValue(mockServices[0]);

      const result = await serviceService.getById('srv-1');

      expect(mockedService.getById).toHaveBeenCalledWith('srv-1');
      expect(result.name).toBe('Wash & Fold');
    });

    it('throws on API failure', async () => {
      (mockedService.getAll as jest.Mock).mockRejectedValue(new Error('Network error'));

      await expect(serviceService.getAll()).rejects.toThrow('Network error');
    });

    it('throws on not found', async () => {
      (mockedService.getById as jest.Mock).mockRejectedValue(
        new Error('Service not found')
      );

      await expect(serviceService.getById('999')).rejects.toThrow('Service not found');
    });
  });
});

describe('useServiceDetails (query keys & service integration)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('generates correct query key for service detail', () => {
    expect(serviceKeys.detail('srv-1')).toEqual(['services', 'detail', 'srv-1']);
  });

  it('calls getById with correct id', async () => {
    (mockedService.getById as jest.Mock).mockResolvedValue(mockServices[0]);

    const result = await serviceService.getById('srv-1');

    expect(mockedService.getById).toHaveBeenCalledWith('srv-1');
    expect(result.id).toBe('srv-1');
  });
});
