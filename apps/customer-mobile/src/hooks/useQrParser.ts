import { useState, useCallback } from 'react';
import { useAnalytics } from './useAnalytics';
import { qrService, QrParsedPayload } from '../services/qr.service';
import { useAuthStore } from '../stores/authStore';
import { useCustomerProfile } from './useCustomerProfile';
import { orderService } from '../services/order.service';
import { useQueryClient } from '@tanstack/react-query';
import { orderKeys } from './useMyOrders';

export type ScanPhase =
  | 'idle'
  | 'scanning'
  | 'parsing'
  | 'parsed'
  | 'loading_order'
  | 'error'
  | 'success';

interface QrParserState {
  phase: ScanPhase;
  error: string | null;
  parsedPayload: QrParsedPayload | null;
}

export function useQrParser() {
  const analytics = useAnalytics();
  const { tenantId } = useAuthStore();
  const { data: profile } = useCustomerProfile();
  const queryClient = useQueryClient();
  const [state, setState] = useState<QrParserState>({
    phase: 'idle',
    error: null,
    parsedPayload: null,
  });

  const processQrCode = useCallback(
    async (qrData: string) => {
      if (!qrData) return;

      setState({ phase: 'parsing', error: null, parsedPayload: null });
      analytics.track({ name: 'qr_scan_started' });

      try {
        const payload = await qrService.parseQrCode(qrData);
        const validated = qrService.validateQrPayload(payload);

        setState({
          phase: 'parsed',
          error: null,
          parsedPayload: validated,
        });

        analytics.track({
          name: 'qr_scan_success',
          properties: { type: validated.type, orderId: validated.orderId },
        });
      } catch (err: unknown) {
        const message =
          (err as { response?: { data?: { message?: string } } })?.response?.data
            ?.message ||
          (err as Error)?.message ||
          'Failed to scan QR code. Please try again.';

        setState({ phase: 'error', error: message, parsedPayload: null });
        analytics.track({
          name: 'qr_scan_failed',
          properties: { reason: message },
        });
      }
    },
    [analytics]
  );

  const resolveOrder = useCallback(
    async (): Promise<'success' | 'unauthorized' | 'error'> => {
      const payload = state.parsedPayload;
      if (!payload) return 'error';

      if (payload.type === 'garment') {
        setState({
          phase: 'error',
          error: 'Garment-level tracking is not yet available.',
          parsedPayload: payload,
        });
        analytics.track({
          name: 'qr_scan_failed',
          properties: { reason: 'garment_type_unsupported' },
        });
        return 'error';
      }

      if (payload.type !== 'order') {
        setState({
          phase: 'error',
          error: 'Unsupported QR code.',
          parsedPayload: payload,
        });
        analytics.track({
          name: 'qr_scan_failed',
          properties: { reason: 'unsupported_type', type: payload.type },
        });
        return 'error';
      }

      if (!payload.orderId) {
        setState({
          phase: 'error',
          error: 'Invalid order QR code.',
          parsedPayload: payload,
        });
        analytics.track({
          name: 'qr_scan_failed',
          properties: { reason: 'missing_order_id' },
        });
        return 'error';
      }

      setState({
        phase: 'loading_order',
        error: null,
        parsedPayload: payload,
      });

      try {
        const order = await orderService.getOrderById(payload.orderId);

        if (!profile || !tenantId) {
          setState({
            phase: 'error',
            error: 'Please log in to view this order.',
            parsedPayload: payload,
          });
          return 'unauthorized';
        }

        if (order.tenantId !== tenantId) {
          setState({
            phase: 'error',
            error: 'This order is not associated with your account.',
            parsedPayload: payload,
          });
          analytics.track({
            name: 'qr_scan_failed',
            properties: { reason: 'tenant_mismatch' },
          });
          return 'unauthorized';
        }

        if (order.customerId && order.customerId !== profile.id) {
          setState({
            phase: 'error',
            error: 'This order is not associated with your account.',
            parsedPayload: payload,
          });
          analytics.track({
            name: 'qr_scan_failed',
            properties: { reason: 'customer_mismatch' },
          });
          return 'unauthorized';
        }

        queryClient.setQueryData(
          [...orderKeys.all, 'detail', payload.orderId],
          order
        );

        analytics.track({
          name: 'qr_order_opened',
          properties: { orderId: payload.orderId },
        });

        setState({
          phase: 'success',
          error: null,
          parsedPayload: payload,
        });

        return 'success';
      } catch (err: unknown) {
        const message =
          (err as { response?: { data?: { message?: string }; status?: number } })
            ?.response?.data?.message ||
          (err as Error)?.message ||
          'This order could not be found.';

        setState({
          phase: 'error',
          error:
            (err as { response?: { status?: number } })?.response?.status === 404
              ? 'This order could not be found.'
              : message,
          parsedPayload: payload,
        });
        analytics.track({
          name: 'qr_scan_failed',
          properties: { reason: 'resolve_failed', message },
        });
        return 'error';
      }
    },
    [state.parsedPayload, analytics, profile, tenantId, queryClient]
  );

  const reset = useCallback(() => {
    setState({ phase: 'idle', error: null, parsedPayload: null });
  }, []);

  return {
    phase: state.phase,
    error: state.error,
    parsedPayload: state.parsedPayload,
    isIdle: state.phase === 'idle',
    isParsing: state.phase === 'parsing',
    isParsed: state.phase === 'parsed',
    isLoadingOrder: state.phase === 'loading_order',
    isSuccess: state.phase === 'success',
    isError: state.phase === 'error',
    processQrCode,
    resolveOrder,
    reset,
  };
}
