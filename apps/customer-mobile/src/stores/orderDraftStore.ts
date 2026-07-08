import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ServiceDraftItem, PaymentProvider } from '../types';

interface OrderDraftState {
  selectedServices: ServiceDraftItem[];
  branchId: string | null;
  branchName: string | null;
  notes: string;
  paymentMethod: PaymentProvider | null;
  addressId: string | null;
  addressLabel: string | null;

  getEstimatedSubtotal: () => number;
  getItemCount: () => number;
  isValid: () => boolean;

  addService: (item: ServiceDraftItem) => void;
  removeService: (index: number) => void;
  updateServiceQuantity: (index: number, quantity: number) => void;
  updateServiceNotes: (index: number, notes: string) => void;
  setServiceGarments: (index: number, garments: ServiceDraftItem['garments']) => void;
  setBranch: (id: string, name: string) => void;
  setNotes: (notes: string) => void;
  setPaymentMethod: (method: PaymentProvider | null) => void;
  setAddress: (id: string | null, label: string | null) => void;
  reset: () => void;
  toOrderPayload: () => Record<string, any>;
}

const initialState = {
  selectedServices: [] as ServiceDraftItem[],
  branchId: null as string | null,
  branchName: null as string | null,
  notes: '',
  paymentMethod: null as PaymentProvider | null,
  addressId: null as string | null,
  addressLabel: null as string | null,
};

// Warning: Order drafts are persisted in AsyncStorage (unencrypted).
// Avoid storing personally identifiable information (PII) or payment data here.
// If order drafts grow to contain such data, migrate to expo-secure-store.

export const useOrderDraftStore = create<OrderDraftState>()(
  persist(
    (set, get) => ({
      ...initialState,

      getEstimatedSubtotal: () => {
        const { selectedServices } = get();
        return selectedServices.reduce(
          (sum, item) => sum + item.estimatedPrice * item.quantity,
          0
        );
      },

      getItemCount: () => {
        return get().selectedServices.reduce((sum, item) => sum + item.quantity, 0);
      },

      isValid: () => {
        const state = get();
        return state.selectedServices.length > 0 && state.branchId !== null;
      },

      addService: (item) =>
        set((state) => ({ selectedServices: [...state.selectedServices, item] })),

      removeService: (index) =>
        set((state) => ({
          selectedServices: state.selectedServices.filter((_, i) => i !== index),
        })),

      updateServiceQuantity: (index, quantity) =>
        set((state) => ({
          selectedServices: state.selectedServices.map((item, i) =>
            i === index ? { ...item, quantity } : item
          ),
        })),

      updateServiceNotes: (index, notes) =>
        set((state) => ({
          selectedServices: state.selectedServices.map((item, i) =>
            i === index ? { ...item, notes } : item
          ),
        })),

      setServiceGarments: (index, garments) =>
        set((state) => ({
          selectedServices: state.selectedServices.map((item, i) =>
            i === index ? { ...item, garments } : item
          ),
        })),

      setBranch: (id, name) => set({ branchId: id, branchName: name }),
      setNotes: (notes) => set({ notes }),
      setPaymentMethod: (method) => set({ paymentMethod: method }),
      setAddress: (id, label) => set({ addressId: id, addressLabel: label }),

      reset: () => set(initialState),

      toOrderPayload: () => {
        const state = get();
        return {
          branchId: state.branchId,
          notes: state.notes,
          addressId: state.addressId,
          items: state.selectedServices.map((item) => ({
            serviceId: item.serviceId,
            quantity: item.quantity,
            specialInstructions: item.notes,
          })),
        };
      },
    }),
    {
      name: 'order-draft-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
