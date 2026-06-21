# 11 — Error Handling Architecture

**Version:** 2.0.0
**Status:** Active
**Last Updated:** 2026-06-20
**Revisions Applied:** #11 (Error Handling)

---

## 1. Error Handling Layers

```
┌─────────────────────────────────────────────────────────┐
│                    LAYER 1: React Error Boundary          │
│  Catches render errors, component crashes                 │
│  → Shows fallback UI, reports to Sentry                   │
└─────────────────────────────┬───────────────────────────┘
                              │
┌─────────────────────────────▼───────────────────────────┐
│                    LAYER 2: React Query Error Handling    │
│  Catches API errors in hooks                             │
│  → Provides error state to components                    │
│  → Retries based on configuration                        │
└─────────────────────────────┬───────────────────────────┘
                              │
┌─────────────────────────────▼───────────────────────────┐
│                    LAYER 3: Axios Interceptor             │
│  Catches HTTP errors before they reach hooks             │
│  → Normalizes error format                               │
│  → Handles 401 (auth) globally                           │
└─────────────────────────────┬───────────────────────────┘
                              │
┌─────────────────────────────▼───────────────────────────┐
│                    LAYER 4: Global Toast System           │
│  Shows persistent notifications                          │
│  → Success, error, warning, info toasts                  │
└─────────────────────────────────────────────────────────┘
```

---

## 2. Error Types

```typescript
// src/utils/errorHandler.ts

export interface AppError {
  statusCode: number;
  message: string;
  error: string;
  field?: string;
  details?: Array<{
    field: string;
    message: string;
    value?: any;
  }>;
  timestamp: string;
  path: string;
}

export type ErrorCode = 
  | 'BAD_REQUEST'      // 400
  | 'UNAUTHORIZED'     // 401
  | 'FORBIDDEN'        // 403
  | 'NOT_FOUND'        // 404
  | 'CONFLICT'         // 409
  | 'UNPROCESSABLE'    // 422
  | 'INTERNAL_ERROR'   // 500
  | 'NETWORK_ERROR'    // Network timeout/offline
  | 'UNKNOWN';         // Unexpected
```

---

## 3. Error Handler Implementation

```typescript
// src/utils/errorHandler.ts
import { AxiosError } from 'axios';

export function normalizeError(error: unknown): AppError {
  // Axios error
  if (isAxiosError(error)) {
    const response = error.response;
    
    if (!response) {
      // Network error
      return {
        statusCode: 0,
        message: 'Network error. Please check your connection.',
        error: 'NETWORK_ERROR',
        timestamp: new Date().toISOString(),
        path: error.config?.url ?? '',
      };
    }
    
    return {
      statusCode: response.status,
      message: response.data?.message || getDefaultMessage(response.status),
      error: response.data?.error || getErrorCode(response.status),
      details: response.data?.details,
      timestamp: new Date().toISOString(),
      path: error.config?.url ?? '',
    };
  }
  
  // Generic error
  return {
    statusCode: 500,
    message: 'An unexpected error occurred',
    error: 'UNKNOWN',
    timestamp: new Date().toISOString(),
    path: '',
  };
}

function getDefaultMessage(status: number): string {
  const messages: Record<number, string> = {
    400: 'Invalid request. Please check your input.',
    401: 'Please log in to continue.',
    403: 'You don\'t have permission to do this.',
    404: 'The requested resource was not found.',
    409: 'This action conflicts with existing data.',
    422: 'Unable to process your request.',
    500: 'Server error. Please try again later.',
  };
  return messages[status] || 'An error occurred.';
}

function getErrorCode(status: number): string {
  const codes: Record<number, string> = {
    400: 'BAD_REQUEST',
    401: 'UNAUTHORIZED',
    403: 'FORBIDDEN',
    404: 'NOT_FOUND',
    409: 'CONFLICT',
    422: 'UNPROCESSABLE',
    500: 'INTERNAL_ERROR',
  };
  return codes[status] || 'UNKNOWN';
}
```

---

## 4. Axios Interceptor

```typescript
// src/api/interceptors.ts
import { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { normalizeError } from '../utils/errorHandler';
import { EventEmitter } from '../utils/eventEmitter';

export async function requestInterceptor(
  config: InternalAxiosRequestConfig
): Promise<InternalAxiosRequestConfig> {
  const token = await SecureStore.getItemAsync('accessToken');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}

export function responseInterceptor(error: AxiosError): Promise<never> {
  const appError = normalizeError(error);
  
  // Handle 401 globally
  if (appError.statusCode === 401) {
    SecureStore.deleteItemAsync('accessToken');
    EventEmitter.emit('AUTH_LOGOUT');
  }
  
  return Promise.reject(appError);
}
```

---

## 5. React Query Error Handling

```typescript
// src/hooks/useOrders.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/client';

export function useOrders(tenantId: string) {
  return useQuery({
    queryKey: ['orders', tenantId],
    queryFn: async () => {
      const { data } = await api.get('/orders', { params: { tenantId } });
      return data;
    },
    enabled: !!tenantId,
    retry: (failureCount, error: any) => {
      // Don't retry on auth errors
      if (error?.statusCode === 401) return false;
      // Don't retry on client errors (4xx)
      if (error?.statusCode >= 400 && error?.statusCode < 500) return false;
      // Retry server errors up to 2 times
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}
```

---

## 6. Global Toast System

```typescript
// src/components/ui/Toast.tsx
import { Snackbar, Portal } from 'react-native-paper';

interface ToastState {
  visible: boolean;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

// Global toast state (Zustand or context)
let toastState: ToastState = { visible: false, message: '', type: 'info' };
let setToast: ((state: ToastState) => void) | null = null;

export function showToast(message: string, type: ToastState['type'] = 'info', duration = 3000) {
  setToast?.({ visible: true, message, type, duration });
}

export function ToastProvider() {
  // Renders Portal with Snackbar
  // Auto-dismisses after duration
}
```

### Toast Usage

```typescript
// After successful mutation
showToast('Order created successfully!', 'success');

// After error
showToast('Failed to create order. Please try again.', 'error');

// Warning
showToast('Your session will expire soon.', 'warning');
```

---

## 7. React Error Boundary

```typescript
// src/components/ui/ErrorBoundary.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { Button } from 'react-native-paper';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Report to Sentry
    console.error('ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>
            Something went wrong
          </Text>
          <Text style={{ color: '#6B7280', marginBottom: 16, textAlign: 'center' }}>
            {this.state.error?.message || 'An unexpected error occurred'}
          </Text>
          <Button mode="contained" onPress={() => this.setState({ hasError: false, error: null })}>
            Try Again
          </Button>
        </View>
      );
    }

    return this.props.children;
  }
}
```

---

## 8. Error Display Strategy

| Error Type | Display | Duration |
|-----------|---------|----------|
| 400 Validation | Inline field errors | Persistent |
| 401 Auth | Redirect to login | Immediate |
| 403 Forbidden | Toast warning | 3s |
| 404 Not Found | Empty state component | Persistent |
| 409 Conflict | Toast error | 3s |
| 422 Business Rule | Toast error | 3s |
| 500 Server | Toast error + retry | 5s |
| Network Error | Offline banner + retry | Persistent |

---

## 9. Sentry Integration (Production)

```typescript
// src/config/sentry.ts
import * as Sentry from 'sentry-expo';
import { CONFIG } from './environment';

export function initSentry() {
  if (CONFIG.sentryDsn) {
    Sentry.init({
      dsn: CONFIG.sentryDsn,
      environment: CONFIG.env,
      enableAutoSessionTracking: true,
      tracesSampleRate: CONFIG.isProduction ? 0.2 : 1.0,
    });
  }
}

export function captureError(error: Error, context?: Record<string, any>) {
  if (CONFIG.sentryDsn) {
    Sentry.captureException(error, { extra: context });
  }
}
```
