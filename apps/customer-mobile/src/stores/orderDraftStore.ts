import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ServiceDraftItem } from '../types';

interface OrderDraftState {
  selectedServices: ServiceDraftItem[];
  branchId: string | null;
  branchName: string | null;
  notes: string;

  getEstimatedSubtotal: () => number;
  getItemCount: () => number;
  isValid: () => boolean;

  addService: (item: ServiceDraftItem) => void;
  removeService: (index: number) => void;
  updateServiceQuantity: (index: number, quantity: number) => void;
  updateServiceNotes: (index: number, notes: string) => void;
  setBranch: (id: string, name: string) => void;
  setNotes: (notes: string) => void;
  reset: () => void;
  toOrderPayload: () => Record<string, any>;
}

const initialState = {
  selectedServices: [] as ServiceDraftItem[],
  branchId: null as string | null,
  branchName: null as string | null,
  notes: '',
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

      setBranch: (id, name) => set({ branchId: id, branchName: name }),
      setNotes: (notes) => set({ notes }),

      reset: () => set(initialState),

      toOrderPayload: () => {
        const state = get();
        return {
          branchId: state.branchId,
          notes: state.notes,
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
