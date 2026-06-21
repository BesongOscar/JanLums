import { AxiosError } from 'axios';
import { ApiError } from '../types';

export function normalizeError(error: unknown): ApiError {
  if (isAxiosError(error)) {
    const response = error.response;

    if (!response) {
      return {
        statusCode: 0,
        message: 'Network error. Please check your connection.',
        error: 'NETWORK_ERROR',
        timestamp: new Date().toISOString(),
        path: error.config?.url ?? '',
      };
    }

    const data = response.data as Record<string, unknown> | undefined;
    const rawDetails = data?.details;
    const rawMessage = data?.message;
    const message = Array.isArray(rawMessage)
      ? rawMessage.join(', ')
      : typeof rawMessage === 'string'
        ? rawMessage
        : getDefaultMessage(response.status);
    return {
      statusCode: response.status,
      message,
      error: (data?.error as string) || getErrorCode(response.status),
      details: Array.isArray(rawDetails)
        ? (rawDetails as Array<{ field: string; message: string; value?: unknown }>)
        : undefined,
      timestamp: new Date().toISOString(),
      path: error.config?.url ?? '',
    };
  }

  return {
    statusCode: 500,
    message: 'An unexpected error occurred',
    error: 'UNKNOWN',
    timestamp: new Date().toISOString(),
    path: '',
  };
}

function isAxiosError(error: unknown): error is AxiosError {
  return error instanceof AxiosError;
}

function getDefaultMessage(status: number): string {
  const messages: Record<number, string> = {
    400: 'Invalid request. Please check your input.',
    401: 'Please log in to continue.',
    403: "You don't have permission to do this.",
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
