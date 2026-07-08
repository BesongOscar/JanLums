import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QueuedOperation, QueuedOperationType } from '../types';

interface SyncQueueState {
  operations: QueuedOperation[];
  enqueue: (type: QueuedOperationType, label: string, payload: Record<string, unknown>, maxAttempts?: number) => string;
  updateStatus: (id: string, status: QueuedOperation['status'], error?: string) => void;
  remove: (id: string) => void;
  clearCompleted: () => void;
  clearAll: () => void;
  getPending: () => QueuedOperation[];
  getFailed: () => QueuedOperation[];
  getCount: (status?: QueuedOperation['status']) => number;
}

export const useSyncQueueStore = create<SyncQueueState>()(
  persist(
    (set, get) => ({
      operations: [],

      enqueue: (type, label, payload, maxAttempts = 3) => {
        const id = `sync_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
        const operation: QueuedOperation = {
          id,
          type,
          label,
          payload,
          status: 'pending',
          createdAt: new Date().toISOString(),
          attemptCount: 0,
          maxAttempts,
        };
        set((state) => ({
          operations: [...state.operations, operation],
        }));
        return id;
      },

      updateStatus: (id, status, error) => {
        set((state) => ({
          operations: state.operations.map((op) =>
            op.id === id
              ? {
                  ...op,
                  status,
                  lastAttemptAt: status === 'processing' || status === 'failed' ? new Date().toISOString() : op.lastAttemptAt,
                  attemptCount: status === 'processing' ? op.attemptCount + 1 : op.attemptCount,
                  error: error ?? op.error,
                }
              : op
          ),
        }));
      },

      remove: (id) => {
        set((state) => ({
          operations: state.operations.filter((op) => op.id !== id),
        }));
      },

      clearCompleted: () => {
        set((state) => ({
          operations: state.operations.filter((op) => op.status !== 'completed'),
        }));
      },

      clearAll: () => {
        set({ operations: [] });
      },

      getPending: () => get().operations.filter((op) => op.status === 'pending'),
      getFailed: () => get().operations.filter((op) => op.status === 'failed'),

      getCount: (status) => {
        const ops = get().operations;
        if (status) return ops.filter((op) => op.status === status).length;
        return ops.length;
      },
    }),
    {
      name: 'sync-queue-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
