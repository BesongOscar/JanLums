jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

import { useOrderDraftStore } from '../../src/stores/orderDraftStore';

describe('orderDraftStore', () => {
  beforeEach(() => {
    useOrderDraftStore.setState({
      selectedServices: [],
      branchId: null,
      branchName: null,
      notes: '',
    });
  });

  describe('initial state', () => {
    it('starts with empty draft', () => {
      const state = useOrderDraftStore.getState();
      expect(state.selectedServices).toEqual([]);
      expect(state.branchId).toBeNull();
      expect(state.branchName).toBeNull();
      expect(state.notes).toBe('');
    });

    it('starts invalid', () => {
      expect(useOrderDraftStore.getState().isValid()).toBe(false);
    });
  });

  describe('addService', () => {
    it('adds a service to the draft', () => {
      useOrderDraftStore.getState().addService({
        serviceId: 'srv-1',
        serviceName: 'Wash & Fold',
        quantity: 2,
        estimatedPrice: 1500,
      });

      const items = useOrderDraftStore.getState().selectedServices;
      expect(items).toHaveLength(1);
      expect(items[0].serviceName).toBe('Wash & Fold');
      expect(items[0].quantity).toBe(2);
      expect(items[0].estimatedPrice).toBe(1500);
    });

    it('adds multiple services', () => {
      useOrderDraftStore.getState().addService({
        serviceId: 'srv-1',
        serviceName: 'Wash & Fold',
        quantity: 1,
        estimatedPrice: 1500,
      });
      useOrderDraftStore.getState().addService({
        serviceId: 'srv-2',
        serviceName: 'Dry Cleaning',
        quantity: 3,
        estimatedPrice: 3000,
      });

      expect(useOrderDraftStore.getState().selectedServices).toHaveLength(2);
    });

    it('adds service with notes', () => {
      useOrderDraftStore.getState().addService({
        serviceId: 'srv-1',
        serviceName: 'Wash & Fold',
        quantity: 1,
        estimatedPrice: 1500,
        notes: 'Delicate fabrics',
      });

      const item = useOrderDraftStore.getState().selectedServices[0];
      expect(item.notes).toBe('Delicate fabrics');
    });
  });

  describe('removeService', () => {
    it('removes a service by index', () => {
      useOrderDraftStore.getState().addService({
        serviceId: 'srv-1',
        serviceName: 'Wash & Fold',
        quantity: 1,
        estimatedPrice: 1500,
      });
      useOrderDraftStore.getState().addService({
        serviceId: 'srv-2',
        serviceName: 'Dry Cleaning',
        quantity: 1,
        estimatedPrice: 3000,
      });

      useOrderDraftStore.getState().removeService(0);

      const items = useOrderDraftStore.getState().selectedServices;
      expect(items).toHaveLength(1);
      expect(items[0].serviceName).toBe('Dry Cleaning');
    });

    it('removes last service leaving empty list', () => {
      useOrderDraftStore.getState().addService({
        serviceId: 'srv-1',
        serviceName: 'Wash & Fold',
        quantity: 1,
        estimatedPrice: 1500,
      });

      useOrderDraftStore.getState().removeService(0);

      expect(useOrderDraftStore.getState().selectedServices).toEqual([]);
    });
  });

  describe('updateServiceQuantity', () => {
    it('updates quantity for a service', () => {
      useOrderDraftStore.getState().addService({
        serviceId: 'srv-1',
        serviceName: 'Wash & Fold',
        quantity: 1,
        estimatedPrice: 1500,
      });

      useOrderDraftStore.getState().updateServiceQuantity(0, 5);

      expect(useOrderDraftStore.getState().selectedServices[0].quantity).toBe(5);
    });

    it('does not affect other services', () => {
      useOrderDraftStore.getState().addService({
        serviceId: 'srv-1',
        serviceName: 'Wash & Fold',
        quantity: 1,
        estimatedPrice: 1500,
      });
      useOrderDraftStore.getState().addService({
        serviceId: 'srv-2',
        serviceName: 'Dry Cleaning',
        quantity: 2,
        estimatedPrice: 3000,
      });

      useOrderDraftStore.getState().updateServiceQuantity(0, 10);

      expect(useOrderDraftStore.getState().selectedServices[0].quantity).toBe(10);
      expect(useOrderDraftStore.getState().selectedServices[1].quantity).toBe(2);
    });
  });

  describe('updateServiceNotes', () => {
    it('updates notes for a service', () => {
      useOrderDraftStore.getState().addService({
        serviceId: 'srv-1',
        serviceName: 'Wash & Fold',
        quantity: 1,
        estimatedPrice: 1500,
      });

      useOrderDraftStore.getState().updateServiceNotes(0, 'Stain treatment needed');

      expect(useOrderDraftStore.getState().selectedServices[0].notes).toBe(
        'Stain treatment needed'
      );
    });
  });

  describe('setBranch', () => {
    it('sets branch id and name', () => {
      useOrderDraftStore.getState().setBranch('br-1', 'Downtown Branch');

      expect(useOrderDraftStore.getState().branchId).toBe('br-1');
      expect(useOrderDraftStore.getState().branchName).toBe('Downtown Branch');
    });
  });

  describe('setNotes', () => {
    it('sets order notes', () => {
      useOrderDraftStore.getState().setNotes('Please handle with care');

      expect(useOrderDraftStore.getState().notes).toBe('Please handle with care');
    });
  });

  describe('getItemCount', () => {
    it('returns total quantity across all services', () => {
      useOrderDraftStore.getState().addService({
        serviceId: 'srv-1',
        serviceName: 'Wash & Fold',
        quantity: 2,
        estimatedPrice: 1500,
      });
      useOrderDraftStore.getState().addService({
        serviceId: 'srv-2',
        serviceName: 'Dry Cleaning',
        quantity: 3,
        estimatedPrice: 3000,
      });

      expect(useOrderDraftStore.getState().getItemCount()).toBe(5);
    });

    it('returns 0 when no services', () => {
      expect(useOrderDraftStore.getState().getItemCount()).toBe(0);
    });
  });

  describe('getEstimatedSubtotal', () => {
    it('calculates subtotal correctly', () => {
      useOrderDraftStore.getState().addService({
        serviceId: 'srv-1',
        serviceName: 'Wash & Fold',
        quantity: 2,
        estimatedPrice: 1500,
      });
      useOrderDraftStore.getState().addService({
        serviceId: 'srv-2',
        serviceName: 'Dry Cleaning',
        quantity: 3,
        estimatedPrice: 3000,
      });

      expect(useOrderDraftStore.getState().getEstimatedSubtotal()).toBe(12000);
    });

    it('returns 0 when no services', () => {
      expect(useOrderDraftStore.getState().getEstimatedSubtotal()).toBe(0);
    });
  });

  describe('isValid', () => {
    it('returns true when services and branch are selected', () => {
      useOrderDraftStore.getState().addService({
        serviceId: 'srv-1',
        serviceName: 'Wash & Fold',
        quantity: 1,
        estimatedPrice: 1500,
      });
      useOrderDraftStore.getState().setBranch('br-1', 'Downtown Branch');

      expect(useOrderDraftStore.getState().isValid()).toBe(true);
    });

    it('returns false without services', () => {
      useOrderDraftStore.getState().setBranch('br-1', 'Downtown Branch');

      expect(useOrderDraftStore.getState().isValid()).toBe(false);
    });

    it('returns false without branch', () => {
      useOrderDraftStore.getState().addService({
        serviceId: 'srv-1',
        serviceName: 'Wash & Fold',
        quantity: 1,
        estimatedPrice: 1500,
      });

      expect(useOrderDraftStore.getState().isValid()).toBe(false);
    });
  });

  describe('reset', () => {
    it('clears entire draft', () => {
      useOrderDraftStore.getState().addService({
        serviceId: 'srv-1',
        serviceName: 'Wash & Fold',
        quantity: 1,
        estimatedPrice: 1500,
      });
      useOrderDraftStore.getState().setBranch('br-1', 'Downtown Branch');
      useOrderDraftStore.getState().setNotes('Test notes');

      useOrderDraftStore.getState().reset();

      const state = useOrderDraftStore.getState();
      expect(state.selectedServices).toEqual([]);
      expect(state.branchId).toBeNull();
      expect(state.branchName).toBeNull();
      expect(state.notes).toBe('');
    });
  });

  describe('toOrderPayload', () => {
    it('generates minimal payload without pricing fields', () => {
      useOrderDraftStore.getState().addService({
        serviceId: 'srv-1',
        serviceName: 'Wash & Fold',
        quantity: 2,
        estimatedPrice: 1500,
        notes: 'Fold neatly',
      });
      useOrderDraftStore.getState().setBranch('br-1', 'Downtown Branch');
      useOrderDraftStore.getState().setNotes('Please deliver');

      const payload = useOrderDraftStore.getState().toOrderPayload();

      expect(payload.branchId).toBe('br-1');
      expect(payload.notes).toBe('Please deliver');
      expect(payload.items).toHaveLength(1);
      expect(payload.items[0].serviceId).toBe('srv-1');
      expect(payload.items[0].quantity).toBe(2);
      expect(payload.items[0].specialInstructions).toBe('Fold neatly');
      expect(payload.tenantId).toBeUndefined();
      expect(payload.customerId).toBeUndefined();
      expect(payload.status).toBeUndefined();
      expect(payload.items[0].unitPrice).toBeUndefined();
      expect(payload.items[0].totalPrice).toBeUndefined();
      expect(payload.items[0].garmentType).toBeUndefined();
    });

    it('generates payload with multiple items', () => {
      useOrderDraftStore.getState().addService({
        serviceId: 'srv-1',
        serviceName: 'Wash & Fold',
        quantity: 2,
        estimatedPrice: 1500,
      });
      useOrderDraftStore.getState().addService({
        serviceId: 'srv-2',
        serviceName: 'Dry Cleaning',
        quantity: 1,
        estimatedPrice: 3000,
      });
      useOrderDraftStore.getState().setBranch('br-1', 'Downtown Branch');

      const payload = useOrderDraftStore.getState().toOrderPayload();

      expect(payload.items).toHaveLength(2);
      expect(payload.items[0].serviceId).toBe('srv-1');
      expect(payload.items[0].quantity).toBe(2);
      expect(payload.items[1].serviceId).toBe('srv-2');
      expect(payload.items[1].quantity).toBe(1);
    });
  });
});
