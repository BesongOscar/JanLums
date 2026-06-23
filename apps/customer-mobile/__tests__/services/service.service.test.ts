import api from '../../src/api/client';
import { serviceService } from '../../src/services/service.service';
import { useAuthStore } from '../../src/stores/authStore';
import { Service } from '../../src/types';

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

const mockServices: Service[] = [
  {
    id: 'srv-1',
    tenantId: 'tenant-1',
    name: 'Wash & Fold',
    description: 'Standard wash and fold service',
    category: 'Wash & Fold',
    basePrice: 1500,
    expressPrice: 2500,
    pricingUnit: 'per_item',
    estimatedHours: 24,
    fabricTypes: ['Cotton', 'Polyester'],
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'srv-2',
    tenantId: 'tenant-1',
    name: 'Dry Cleaning',
    description: 'Professional dry cleaning',
    category: 'Dry Cleaning',
    basePrice: 3000,
    pricingUnit: 'per_item',
    estimatedHours: 48,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

describe('serviceService', () => {
  beforeAll(() => {
    useAuthStore.setState({ tenantId: 'tenant-1' });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('returns all services on success', async () => {
      (mockedApi.get as jest.Mock).mockResolvedValue({ data: mockServices });

      const result = await serviceService.getAll();

      expect(mockedApi.get).toHaveBeenCalledWith('/services', {
        params: { tenantId: 'tenant-1' },
      });
      expect(result).toEqual(mockServices);
      expect(result).toHaveLength(2);
    });

    it('returns empty array when no services', async () => {
      (mockedApi.get as jest.Mock).mockResolvedValue({ data: [] });

      const result = await serviceService.getAll();

      expect(result).toEqual([]);
    });

    it('throws on network failure', async () => {
      const error = new Error('Network error');
      (mockedApi.get as jest.Mock).mockRejectedValue(error);

      await expect(serviceService.getAll()).rejects.toThrow('Network error');
    });
  });

  describe('getById', () => {
    it('returns a single service on success', async () => {
      (mockedApi.get as jest.Mock).mockResolvedValue({ data: mockServices[0] });

      const result = await serviceService.getById('srv-1');

      expect(mockedApi.get).toHaveBeenCalledWith('/services/srv-1', {
        params: { tenantId: 'tenant-1' },
      });
      expect(result).toEqual(mockServices[0]);
      expect(result.name).toBe('Wash & Fold');
    });

    it('throws on 404', async () => {
      const error = { response: { status: 404, data: { message: 'Service not found' } } };
      (mockedApi.get as jest.Mock).mockRejectedValue(error);

      await expect(serviceService.getById('999')).rejects.toEqual(error);
    });
  });
});
