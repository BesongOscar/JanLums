export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
  },
  USERS: {
    BASE: '/users',
    BY_ID: (id: string) => `/users/${id}`,
  },
  SERVICES: {
    BASE: '/services',
    BY_CATEGORY: (category: string) => `/services/category/${category}`,
    BY_ID: (id: string) => `/services/${id}`,
  },
  BRANCHES: {
    BASE: '/branches',
    BY_ID: (id: string) => `/branches/${id}`,
  },
  ORDERS: {
    BASE: '/orders',
    ME: '/orders/me',
    STATS: '/orders/stats',
    BY_ID: (id: string) => `/orders/${id}`,
    STATUS: (id: string) => `/orders/${id}/status`,
  },
  CUSTOMERS: {
    BASE: '/customers',
    ME: '/customers/me',
    SEARCH: '/customers/search',
    BY_ID: (id: string) => `/customers/${id}`,
  },
  QR_CODE: {
    GENERATE_ORDER: '/qr-code/generate/order',
    GENERATE_GARMENT: '/qr-code/generate/garment',
    PARSE: (code: string) => `/qr-code/parse/${code}`,
    SHORT_CODE: '/qr-code/short-code',
  },
  NOTIFICATIONS: {
    ME: '/notifications/me',
    UNREAD_COUNT: '/notifications/me/unread-count',
    MARK_READ: (id: string) => `/notifications/${id}/read`,
    MARK_ALL_READ: '/notifications/me/read-all',
    DELETE: (id: string) => `/notifications/${id}`,
    DELETE_ALL: '/notifications/me',
  },
} as const;
