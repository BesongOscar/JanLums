# 02 — API Integration Matrix

**Version:** 2.0.0
**Status:** Active
**Last Updated:** 2026-06-20
**Revisions Applied:** #6 (Pricing Authority), #4 (Data Isolation)

---

## 1. Base Configuration

| Property | Value |
|----------|-------|
| Base URL (dev) | `http://localhost:3015/api/v1` |
| Base URL (staging) | `https://staging-api.janlums.com/api/v1` |
| Base URL (production) | `https://api.janlums.com/api/v1` |
| Auth Header | `Authorization: Bearer {token}` |
| Content-Type | `application/json` |
| Tenant Propagation | Via JWT payload `tenantId` claim |

---

## 2. Complete Endpoint Matrix

### Auth Module — No Guard

| # | Method | Endpoint | Request Body | Response | Error | Mobile Use |
|---|--------|----------|-------------|----------|-------|------------|
| 1 | `POST` | `/auth/login` | `{ email, password }` | `{ accessToken, refreshToken, user: { id, email, firstName, lastName, role, tenantId } }` | 401 | Login screen |
| 2 | `POST` | `/auth/register` | `{ email, password, firstName, lastName, tenantId, role? }` | `{ accessToken, user: { id, email, firstName, lastName, role, tenantId } }` | 409 | Register screen |

### Users Module — Bearer JWT

| # | Method | Endpoint | Query/Params | Response | Error | Mobile Use |
|---|--------|----------|-------------|----------|-------|------------|
| 3 | `GET` | `/users/:id` | — | `User` entity | 404 | Profile screen |
| 4 | `PUT` | `/users/:id` | Body: `Partial<User>` | `User` entity | 404 | Edit profile |

**User entity fields:** `id, tenantId, email, passwordHash, phone, firstName, lastName, role, isActive, lastLoginAt, createdAt, updatedAt`

### Services Module — JwtAuthGuard

| # | Method | Endpoint | Query/Params | Response | Error | Mobile Use |
|---|--------|----------|-------------|----------|-------|------------|
| 5 | `GET` | `/services` | `?tenantId=` | `Service[]` | — | Service catalog |
| 6 | `GET` | `/services/category/:category` | `?tenantId=` | `Service[]` | — | Category filter |
| 7 | `GET` | `/services/:id` | `?tenantId=` | `Service` entity | 404 | Service detail |

**Service entity fields:** `id, tenantId, name, description, category, basePrice, expressPrice, pricingUnit, estimatedHours, fabricTypes, isActive, createdAt, updatedAt`

### Branches Module — Bearer JWT

| # | Method | Endpoint | Query/Params | Response | Error | Mobile Use |
|---|--------|----------|-------------|----------|-------|------------|
| 8 | `GET` | `/branches` | `?tenantId=` | `Branch[]` | — | Branch selector |
| 9 | `GET` | `/branches/:id` | — | `Branch` entity | 404 | Branch detail |

**Branch entity fields:** `id, tenantId, name, address, city, phone, email, isActive, operatingHours, createdAt, updatedAt`

### Orders Module — JwtAuthGuard

| # | Method | Endpoint | Query/Params | Body | Response | Error | Mobile Use |
|---|--------|----------|-------------|------|----------|-------|------------|
| 10 | `GET` | `/orders` | `?tenantId=&branchId=` | — | `Order[]` (with items, staff) | — | Order history |
| 11 | `GET` | `/orders/stats` | `?tenantId=&branchId=` | — | `{ totalOrders, pending, processing, ready, completed }` | — | Stats |
| 12 | `GET` | `/orders/:id` | `?tenantId=` | — | `Order` entity (with items, staff, branch) | 404 | Order detail |
| 13 | `POST` | `/orders` | — | `Partial<Order> & { items[] }` | `Order` entity | 400 | Create order |
| 14 | `PUT` | `/orders/:id/status` | `?tenantId=` | `{ status }` | `Order` entity | 404 | Status update |

### Customers Module — JwtAuthGuard

| # | Method | Endpoint | Query/Params | Response | Error | Mobile Use |
|---|--------|----------|-------------|----------|-------|------------|
| 15 | `GET` | `/customers` | `?tenantId=` | `Customer[]` | — | Customer list |
| 16 | `GET` | `/customers/search` | `?tenantId=&q=` | `Customer[]` | — | Search |
| 17 | `GET` | `/customers/:id` | `?tenantId=` | `Customer` entity | 404 | Detail |
| 18 | `POST` | `/customers` | Body: `Partial<Customer>` | `Customer` entity | — | Create |
| 19 | `PUT` | `/customers/:id` | `?tenantId=` | `Partial<Customer>` | `Customer` entity | 404 | Update |

**Customer entity fields:** `id, tenantId, firstName, lastName, email, phone, address, city, preferences, totalSpent, totalOrders, isActive, createdAt, updatedAt`

### QR Code Module — No Guard (Security Concern)

| # | Method | Endpoint | Body/Params | Response | Error | Mobile Use |
|---|--------|----------|------------|----------|-------|------------|
| 20 | `POST` | `/qr-code/generate/order` | `{ tenantId, orderId }` | `{ qrCode: string }` | — | Order confirmation |
| 21 | `POST` | `/qr-code/generate/garment` | `{ tenantId, orderId, itemId, garmentType }` | `{ qrCode: string }` | — | Garment tag |
| 22 | `GET` | `/qr-code/parse/:code` | — | `{ type, code, ... }` | — | QR scan |

### Notifications Module — No Guard

| # | Method | Endpoint | Body | Response | Error | Mobile Use |
|---|--------|----------|------|----------|-------|------------|
| 23 | `POST` | `/notifications/order-status` | `{ phone, email?, orderId, status }` | `{ success }` | — | Status trigger |
| 24 | `POST` | `/notifications/ready-pickup` | `{ phone, email?, orderId }` | `{ success }` | — | Pickup trigger |

---

## 3. Tenant ID Propagation

### Current Strategy (Query Parameter)

All endpoints accept `tenantId` as a query parameter. The mobile app must:

1. Extract `tenantId` from JWT payload at login
2. Store in authStore
3. Append to all API requests

```typescript
// Every API call must include tenantId
const params = new URLSearchParams();
params.append('tenantId', authStore.tenantId);
const { data } = await api.get(`/orders?${params.toString()}`);
```

### Future Strategy (Middleware — Backend Change Required)

```
X-Tenant-ID: {uuid} header
```

Backend middleware extracts from header, not query param. Cleaner and more secure.

---

## 4. Customer Data Isolation (Revision #4)

### Current Risk

```
GET /orders?tenantId=abc-123
```

A malicious customer could modify the `tenantId` parameter to access another tenant's data. The backend relies on the client to supply the correct `tenantId`.

### Recommended Backend Changes

| Priority | Change | Implementation |
|----------|--------|----------------|
| P0 | Filter by customerId from JWT | `WHERE customerId = :jwtUserId AND tenantId = :jwtTenantId` |
| P0 | Validate JWT tenantId matches query tenantId | Reject if mismatch |
| P1 | Add `/orders/me` endpoint | Clean API, no tenantId in query |
| P1 | Add `/customers/me` endpoint | Customer self-service |
| P2 | Add middleware for tenant isolation | Auto-inject tenantId from JWT |

### Mobile App Mitigation

Until backend implements ownership filtering:

```typescript
// Mobile always passes tenantId from JWT, never from user input
const tenantId = useAuthStore.getState().tenantId;
const { data } = await api.get('/orders', { params: { tenantId } });
```

**Never allow the user to:**
- Modify tenantId
- View orders from other tenants
- Access customer data not belonging to them

---

## 5. Pricing Authority (Revision #6)

### Current Issue

The `OrderDraftStore` computes:
- `getSubtotal()` — client-side
- `getTax()` — client-side (hardcoded 19.25%)
- `getTotal()` — client-side

### Revised Strategy

| Calculation | Authority | Source |
|-------------|-----------|--------|
| Service base price | Backend | `Service.basePrice` |
| Item quantity × unit price | Client (estimated) | `orderDraftStore` |
| Subtotal | **Backend** | Calculated on `POST /orders` |
| Tax (TVA) | **Backend** | Business rules in backend |
| Discounts | **Backend** | Promotion engine |
| Express surcharge | **Backend** | Service expressPrice |
| Final total | **Backend** | Returned in order response |

### Mobile Display Strategy

```
┌─────────────────────────────────────────────┐
│  Order Review Screen                         │
│                                              │
│  Subtotal (estimated):     6,500 XAF        │
│  Tax (estimated):          ~1,252 XAF        │
│  Express surcharge:        +0 XAF           │
│  ─────────────────────────────────          │
│  Estimated Total:          ~7,752 XAF        │
│                                              │
│  ⓘ Final price confirmed at checkout         │
│                                              │
│  [ Place Order ]                             │
└─────────────────────────────────────────────┘
```

### OrderDraftStore Revised

```typescript
// REMOVE these methods:
// - getSubtotal()
// - getTax()
// - getTotal()

// ADD these methods:
getEstimatedTotal: () => number;  // subtotal + estimated tax
getEstimatedTax: () => number;    // subtotal × 0.1925 (display only)

// The backend returns the actual total in the POST /orders response
```

---

## 6. Error Response Format

### Standard Error (from `API_STANDARDS.md`)

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "BAD_REQUEST",
  "path": "/api/v1/orders",
  "timestamp": "2026-06-20T10:00:00Z",
  "details": [
    {
      "field": "customerId",
      "message": "customerId must be a UUID",
      "value": "invalid"
    }
  ]
}
```

### HTTP Status Code Handling

| Status | Code | Mobile Handling |
|--------|------|-----------------|
| 200 | OK | Render data |
| 201 | Created | Navigate to detail |
| 400 | BAD_REQUEST | Show validation errors inline |
| 401 | UNAUTHORIZED | Clear token, redirect to login |
| 403 | FORBIDDEN | Show "no permission" toast |
| 404 | NOT_FOUND | Show empty state |
| 409 | CONFLICT | Show "already exists" message |
| 422 | UNPROCESSABLE | Show business rule violation |
| 500 | INTERNAL_ERROR | Show retry prompt |

---

## 7. React Query Hook Mapping

| Endpoint | Hook | Query Key | Cache TTL | Refetch |
|----------|------|-----------|-----------|---------|
| `GET /services` | `useServices(tenantId)` | `['services', tenantId]` | 24h | On focus |
| `GET /services/category/:cat` | `useServicesByCategory(tenantId, cat)` | `['services', tenantId, cat]` | 24h | On focus |
| `GET /orders` | `useOrders(tenantId)` | `['orders', tenantId]` | 30s | On focus, interval |
| `GET /orders/:id` | `useOrder(tenantId, orderId)` | `['order', tenantId, orderId]` | 10s | Interval 15s |
| `POST /orders` | `useCreateOrder()` | invalidates `['orders']` | — | — |
| `PUT /orders/:id/status` | `useUpdateOrderStatus()` | invalidates `['orders']` | — | — |
| `GET /customers/search` | `useSearchCustomers(tenantId, q)` | `['customers', 'search', q]` | 0 | Disabled |
| `GET /branches` | `useBranches(tenantId)` | `['branches', tenantId]` | 24h | On focus |
| `GET /users/:id` | `useProfile(userId)` | `['user', userId]` | 5m | On focus |
| `PUT /users/:id` | `useUpdateProfile()` | invalidates `['user']` | — | — |
| `POST /qr-code/generate/order` | `useGenerateOrderQR()` | — | — | — |
| `GET /qr-code/parse/:code` | `useParseQRCode()` | — | — | — |

---

## 8. Axios Client Configuration

```typescript
// src/api/client.ts
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '../config/environment';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — attach token
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('accessToken');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — handle 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync('accessToken');
      // Emit event for navigation to login
      EventEmitter.emit('AUTH_LOGOUT');
    }
    return Promise.reject(error);
  }
);

export default api;
```
