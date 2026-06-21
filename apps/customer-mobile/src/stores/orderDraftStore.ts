import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OrderDraftItem } from '../types';

interface OrderDraftState {
  serviceId: string | null;
  serviceName: string | null;
  items: OrderDraftItem[];
  pickupType: 'drop-off' | 'pickup' | 'delivery';
  branchId: string | null;
  branchName: string | null;
  scheduledDate: string | null;
  scheduledTime: string | null;
  notes: string;
  isExpress: boolean;

  getEstimatedSubtotal: () => number;
  getEstimatedTax: () => number;
  getEstimatedTotal: () => number;
  getItemCount: () => number;
  isValid: () => boolean;

  setService: (id: string, name: string) => void;
  addItem: (item: OrderDraftItem) => void;
  removeItem: (index: number) => void;
  updateItem: (index: number, updates: Partial<OrderDraftItem>) => void;
  setPickupType: (type: 'drop-off' | 'pickup' | 'delivery') => void;
  setBranch: (id: string, name: string) => void;
  setScheduledDate: (date: string | null) => void;
  setScheduledTime: (time: string | null) => void;
  setNotes: (notes: string) => void;
  setExpress: (isExpress: boolean) => void;
  reset: () => void;
  toOrderPayload: (tenantId: string, customerId: string) => Record<string, any>;
}

const initialState = {
  serviceId: null,
  serviceName: null,
  items: [] as OrderDraftItem[],
  pickupType: 'drop-off' as const,
  branchId: null,
  branchName: null,
  scheduledDate: null,
  scheduledTime: null,
  notes: '',
  isExpress: false,
};

export const useOrderDraftStore = create<OrderDraftState>()(
  persist(
    (set, get) => ({
      ...initialState,

      getEstimatedSubtotal: () => {
        const { items } = get();
        return items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
      },

      getEstimatedTax: () => {
        return Math.round(get().getEstimatedSubtotal() * 0.1925);
      },

      getEstimatedTotal: () => {
        const subtotal = get().getEstimatedSubtotal();
        const tax = get().getEstimatedTax();
        const express = get().isExpress ? Math.round(subtotal * 0.5) : 0;
        return subtotal + tax + express;
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      isValid: () => {
        const state = get();
        return state.serviceId !== null && state.items.length > 0 && state.branchId !== null;
      },

      setService: (id, name) => set({ serviceId: id, serviceName: name }),

      addItem: (item) => set((state) => ({ items: [...state.items, item] })),

      removeItem: (index) =>
        set((state) => ({
          items: state.items.filter((_, i) => i !== index),
        })),

      updateItem: (index, updates) =>
        set((state) => ({
          items: state.items.map((item, i) => (i === index ? { ...item, ...updates } : item)),
        })),

      setPickupType: (type) => set({ pickupType: type }),
      setBranch: (id, name) => set({ branchId: id, branchName: name }),
      setScheduledDate: (date) => set({ scheduledDate: date }),
      setScheduledTime: (time) => set({ scheduledTime: time }),
      setNotes: (notes) => set({ notes }),
      setExpress: (isExpress) => set({ isExpress }),

      reset: () => set(initialState),

      toOrderPayload: (tenantId, customerId) => {
        const state = get();
        return {
          tenantId,
          customerId,
          branchId: state.branchId,
          status: 'pending',
          isExpress: state.isExpress,
          notes: state.notes,
          pickupDate:
            state.scheduledDate && state.scheduledTime
              ? `${state.scheduledDate}T${state.scheduledTime}`
              : undefined,
          items: state.items.map((item) => ({
            garmentType: item.garmentType,
            fabricType: item.fabricType,
            color: item.color,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.unitPrice * item.quantity,
            specialInstructions: item.specialInstructions,
            status: 'pending',
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
