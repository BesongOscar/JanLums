import api from '../../src/api/client';
import { customerService } from '../../src/services/customer.service';
import { Customer } from '../../src/types';

jest.mock('../../src/api/client', () => ({
  get: jest.fn(),
  patch: jest.fn(),
}));

const mockedApi = api as jest.Mocked<typeof api>;

const mockCustomer: Customer = {
  id: '1',
  tenantId: 'tenant-1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  phone: '671234567',
  address: '123 Main St',
  city: 'Yaounde',
  totalSpent: 0,
  totalOrders: 0,
  isActive: true,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

describe('customerService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getProfile', () => {
    it('returns customer profile on success', async () => {
      (mockedApi.get as jest.Mock).mockResolvedValue({ data: mockCustomer });

      const result = await customerService.getProfile();

      expect(mockedApi.get).toHaveBeenCalledWith('/customers/me');
      expect(result).toEqual(mockCustomer);
    });

    it('throws when API fails', async () => {
      const error = new Error('Network error');
      (mockedApi.get as jest.Mock).mockRejectedValue(error);

      await expect(customerService.getProfile()).rejects.toThrow('Network error');
    });

    it('throws when profile not found', async () => {
      const error = { response: { status: 404, data: { message: 'Customer profile not found' } } };
      (mockedApi.get as jest.Mock).mockRejectedValue(error);

      await expect(customerService.getProfile()).rejects.toEqual(error);
    });

    it('throws on 401 unauthorized', async () => {
      const error = { response: { status: 401 } };
      (mockedApi.get as jest.Mock).mockRejectedValue(error);

      await expect(customerService.getProfile()).rejects.toEqual(error);
    });
  });

  describe('updateProfile', () => {
    const updateData = { firstName: 'Jane', lastName: 'Smith', phone: '691234567', address: '456 Oak Ave', city: 'Douala' };

    it('updates profile and returns updated customer', async () => {
      const updated = { ...mockCustomer, ...updateData };
      (mockedApi.patch as jest.Mock).mockResolvedValue({ data: updated });

      const result = await customerService.updateProfile(updateData);

      expect(mockedApi.patch).toHaveBeenCalledWith('/customers/me', updateData);
      expect(result).toEqual(updated);
    });

    it('throws on validation error', async () => {
      const error = { response: { status: 400, data: { message: 'Validation failed' } } };
      (mockedApi.patch as jest.Mock).mockRejectedValue(error);

      await expect(customerService.updateProfile(updateData)).rejects.toEqual(error);
    });

    it('throws on network failure', async () => {
      const error = new Error('Network error');
      (mockedApi.patch as jest.Mock).mockRejectedValue(error);

      await expect(customerService.updateProfile(updateData)).rejects.toThrow('Network error');
    });
  });
});
