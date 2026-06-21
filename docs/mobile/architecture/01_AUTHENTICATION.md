# 01 — Authentication Architecture

**Version:** 2.0.0
**Status:** Active
**Last Updated:** 2026-06-20
**Revisions Applied:** #1 (No Refresh Tokens), #2 (SecureStore)

---

## 1. Backend Verification

### Endpoints Confirmed

| Endpoint | Exists | Auth Guard | Response |
|----------|--------|------------|----------|
| `POST /auth/login` | YES | None | `{ accessToken, refreshToken, user }` |
| `POST /auth/register` | YES | None | `{ accessToken, user }` |
| `POST /auth/refresh` | **NO** | — | — |

### JWT Configuration (from `auth.module.ts:18-19`)

```typescript
secret: configService.get('JWT_SECRET', 'default-secret'),
signOptions: { expiresIn: configService.get('JWT_EXPIRATION', '24h') }
```

**`.env.example` default:** `JWT_EXPIRES_IN=7d`

### Token Payload (from `auth.service.ts:30-35`)

```json
{
  "sub": "user-uuid",
  "email": "user@example.com",
  "tenantId": "tenant-uuid",
  "role": "customer",
  "iat": 1716624000,
  "exp": 1716710400
}
```

### Backend Refresh Token Issue

The `auth.service.ts` (line 39-41) generates a `refreshToken` in the login response:

```typescript
refreshToken: this.jwtService.sign(payload, {
  expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION', '7d'),
}),
```

However, **no endpoint exists to validate this token**. The mobile app must:

1. **Store** the accessToken (ignore refreshToken until endpoint is added)
2. **On 401**: Prompt user to re-login
3. **Never assume** a refresh endpoint exists

---

## 2. Authentication Flow (Revised)

```
┌─────────┐     ┌────────────┐     ┌─────────────┐     ┌────────────┐
│  User    │     │LoginScreen │     │ AuthStore    │     │ SecureStore │
└────┬────┘     └─────┬──────┘     └─────┬───────┘     └─────┬──────┘
     │                │                   │                    │
     │  Enter email   │                   │                    │
     │  + password    │                   │                    │
     │───────────────>│                   │                    │
     │                │                   │                    │
     │  Tap "Login"   │                   │                    │
     │───────────────>│                   │                    │
     │                │  POST /auth/login │                    │
     │                │  {email, password}│                    │
     │                │──────────────────────────────────────>│
     │                │                   │                    │
     │                │  200 OK           │                    │
     │                │  {accessToken,    │                    │
     │                │   refreshToken,   │                    │
     │                │   user}           │                    │
     │                │<──────────────────────────────────────│
     │                │                   │                    │
     │                │  setAuth(token,   │                    │
     │                │  refreshToken,    │                    │
     │                │  user)            │                    │
     │                │──────────────────>│                    │
     │                │                   │  SecureStore.setItem│
     │                │                   │  ('accessToken',   │
     │                │                   │   token)           │
     │                │                   │───────────────────>│
     │                │                   │                    │
     │                │                   │  AsyncStorage.setItem│
     │                │                   │  ('user', user)    │
     │                │                   │───────────────────>│
     │                │                   │                    │
     │  Navigate to   │                   │                    │
     │  (tabs)        │                   │                    │
     │<───────────────│                   │                    │
```

---

## 3. Credential Storage Strategy

### Expo SecureStore (Sensitive)

| Key | Value | Access |
|-----|-------|--------|
| `accessToken` | JWT string | Read/Write on login, Delete on logout |
| `refreshToken` | JWT string (future) | Read/Write on login, Delete on logout |

**Platform Implementation:**
- **iOS:** Keychain Services (encrypted, accessible only to app)
- **Android:** EncryptedSharedPreferences (AES-256-GCM)

**Limitations:**
- Max 128 bytes per key (tokens fit within limit)
- No background access
- Cleared on app uninstall

### AsyncStorage (Non-Sensitive)

| Key | Value | TTL |
|-----|-------|-----|
| `auth-user` | User profile JSON | Until logout |
| `order-draft` | Order draft JSON | Until submitted |
| `notification-preferences` | Notification settings | Persistent |
| `theme-preference` | 'light' / 'dark' | Persistent |
| `onboarding-complete` | boolean | Persistent |
| `address-book` | Address list JSON | Until logout |
| `notification-history` | Notification list | 30 days |

---

## 4. Axios Interceptor Strategy (Revised)

### Request Interceptor

```typescript
// src/api/interceptors.ts
import * as SecureStore from 'expo-secure-store';
import { AxiosError, InternalAxiosRequestConfig } from 'axios';

export async function requestInterceptor(
  config: InternalAxiosRequestConfig
): Promise<InternalAxiosRequestConfig> {
  const token = await SecureStore.getItemAsync('accessToken');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}
```

### Response Interceptor (No Refresh)

```typescript
export function responseInterceptor(error: AxiosError): Promise<never> {
  if (error.response?.status === 401) {
    // No refresh endpoint exists — force re-login
    SecureStore.deleteItemAsync('accessToken');
    // Navigate to login (via event bus or navigation ref)
  }
  return Promise.reject(error);
}
```

**Removed from original design:**
- ~~Refresh token retry logic~~
- ~~Token refresh queue~~
- ~~Exponential backoff on auth errors~~
- ~~401 retry interceptor~~

---

## 5. Token Lifecycle

```
┌──────────────────────────────────────────────────────────┐
│                    Token Lifecycle                         │
│                                                            │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌────────┐ │
│  │  Login   │───>│  Store  │───>│  Use    │───>│ Expiry │ │
│  │  Screen  │    │ Secure  │    │  on all │    │ (401)  │ │
│  │          │    │  Store  │    │  calls  │    │        │ │
│  └─────────┘    └─────────┘    └─────────┘    └───┬────┘ │
│                                                    │      │
│                                                    ▼      │
│                                              ┌──────────┐ │
│                                              │ Re-login │ │
│                                              │  Screen  │ │
│                                              └──────────┘ │
└──────────────────────────────────────────────────────────┘
```

### Token Expiration Handling

| Scenario | Behavior |
|----------|----------|
| Token expired on API call | 401 response → Clear token → Navigate to login |
| Token expires while app is open | Next API call triggers 401 → Re-login |
| App killed and reopened | Token still valid (7d TTL) → Resume session |
| Token in SecureStore but invalid | 401 on next call → Clear and re-login |

---

## 6. Logout Flow

```
┌─────────┐     ┌────────────┐     ┌─────────────┐     ┌────────────┐
│  User    │     │ProfileScreen│    │ AuthStore    │     │SecureStore │
└────┬────┘     └─────┬──────┘     └─────┬───────┘     └─────┬──────┘
     │                │                   │                    │
     │  Tap "Logout"  │                   │                    │
     │───────────────>│                   │                    │
     │                │  Confirm dialog   │                    │
     │  Confirm       │                   │                    │
     │───────────────>│                   │                    │
     │                │  logout()         │                    │
     │                │──────────────────>│                    │
     │                │                   │  SecureStore       │
     │                │                   │  .deleteItemAsync  │
     │                │                   │  ('accessToken')   │
     │                │                   │───────────────────>│
     │                │                   │                    │
     │                │                   │  AsyncStorage      │
     │                │                   │  .removeItem       │
     │                │                   │  ('auth-user')     │
     │                │                   │───────────────────>│
     │                │                   │                    │
     │                │                   │  Clear state:      │
     │                │                   │  token=null        │
     │                │                   │  user=null         │
     │                │                   │  tenantId=null     │
     │                │                   │  isAuthenticated=false
     │                │                   │                    │
     │  Navigate to   │                   │                    │
     │  (auth)/login  │                   │                    │
     │<───────────────│                   │                    │
```

---

## 7. Biometric Authentication (Future)

When the backend implements `/auth/refresh`:

| Feature | Implementation |
|---------|---------------|
| Face ID / Fingerprint | `expo-local-authentication` |
| Token refresh | SecureStore stores refreshToken, interceptor refreshes accessToken |
| Re-auth for sensitive ops | Biometric prompt before payment, profile changes |

**Prerequisite:** Backend must implement `POST /auth/refresh` endpoint.

---

## 8. Session Management

### App State Transitions

| State | Behavior |
|-------|----------|
| Active (foreground) | Normal operation, API calls succeed |
| Background | No API calls, token remains valid |
| Killed | Token persists in SecureStore (7d TTL) |
| Token expires in background | Next API call returns 401 → Re-login |

### Multi-Device Support

- Same user can login on multiple devices
- Each device gets independent JWT
- No session invalidation on new login (backend limitation)
- Future: implement token family tracking

---

## 9. Security Considerations

| Concern | Mitigation |
|---------|------------|
| Token in memory | Clear on logout, minimal exposure |
| SecureStore limits | 128 bytes max per key — tokens fit |
| Token theft | HTTPS required in production |
| No refresh rotation | Acceptable for 7-day customer token |
| Biometric bypass | Future enhancement |
| Account lockout | Backend responsibility (rate limiting on /auth/login) |

---

## 10. Backend Changes Required

| Priority | Change | Reason |
|----------|--------|--------|
| P0 | Add `customerId` to JWT payload (via `sub` claim) | Customer data isolation |
| P0 | Filter orders by `customerId` from JWT, not query param | Security |
| P1 | Add `POST /auth/refresh` endpoint | Token refresh without re-login |
| P1 | Add `POST /auth/invite-code/validate` | Customer onboarding |
| P2 | Add token revocation on logout | Session management |
| P2 | Add rate limiting on auth endpoints | Brute force protection |
