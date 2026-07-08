import { useCallback, useEffect, useRef } from 'react';
import { useSyncQueueStore } from '../stores/syncQueueStore';
import { useUIStore } from '../stores/uiStore';
import { syncQueueService } from '../services/syncQueue.service';
import { normalizeError } from '../utils/errorHandler';
import { QueuedOperationType } from '../types';

const TYPE_HANDLERS: Record<QueuedOperationType, (payload: Record<string, unknown>) => Promise<unknown>> = {
  create_order: syncQueueService.processCreateOrder,
};

export function useEnqueueOperation() {
  const enqueue = useSyncQueueStore((s) => s.enqueue);
  return useCallback(
    (type: QueuedOperationType, label: string, payload: Record<string, unknown>) => {
      return enqueue(type, label, payload);
    },
    [enqueue]
  );
}

export function useRetryOperation() {
  const updateStatus = useSyncQueueStore((s) => s.updateStatus);
  return useCallback(
    (operationId: string) => {
      updateStatus(operationId, 'pending');
    },
    [updateStatus]
  );
}

export function useRetryAllFailed() {
  const updateStatus = useSyncQueueStore((s) => s.updateStatus);
  return useCallback(() => {
    const store = useSyncQueueStore.getState();
    store.operations
      .filter((op) => op.status === 'failed')
      .forEach((op) => updateStatus(op.id, 'pending'));
  }, [updateStatus]);
}

export function useProcessQueue() {
  const processingRef = useRef(false);

  const processQueue = useCallback(async () => {
    if (processingRef.current) return;
    processingRef.current = true;

    try {
      const store = useSyncQueueStore.getState();
      const pending = store.operations.filter(
        (op) => op.status === 'pending' && op.attemptCount < op.maxAttempts
      );

      for (const operation of pending) {
        const handler = TYPE_HANDLERS[operation.type];
        if (!handler) {
          store.updateStatus(operation.id, 'failed', `Unknown operation type: ${operation.type}`);
          continue;
        }

        store.updateStatus(operation.id, 'processing');

        try {
          await handler(operation.payload);
          store.updateStatus(operation.id, 'completed');
        } catch (err) {
          const normalized = normalizeError(err);
          store.updateStatus(operation.id, 'failed', normalized.message);
        }
      }
    } finally {
      processingRef.current = false;
    }
  }, []);

  return processQueue;
}

export function useSyncQueueProcessor() {
  const isOnline = useUIStore((s) => s.isOnline);
  const processQueue = useProcessQueue();
  const wasOffline = useRef(!isOnline);

  useEffect(() => {
    const cameOnline = wasOffline.current && isOnline;
    wasOffline.current = !isOnline;

    if (cameOnline || (isOnline && useSyncQueueStore.getState().operations.some((op) => op.status === 'pending'))) {
      processQueue();
    }
  }, [isOnline, processQueue]);
}
