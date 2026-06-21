# JanLums Customer Mobile App — Architecture Master Document

**Version:** 2.0.0
**Status:** Active
**Last Updated:** 2026-06-20
**Revisions:** 14 architecture corrections applied
**Implementation Status:** Pre-Implementation
**Framework:** Expo SDK 51 + React Native 0.74

---

## Revision Summary

| # | Correction | Status | Document |
|---|-----------|--------|----------|
| 1 | Authentication Architecture Review (no refresh tokens) | Applied | `01_AUTHENTICATION.md` |
| 2 | Secure Credential Storage (Expo SecureStore) | Applied | `01_AUTHENTICATION.md` |
| 3 | Customer Registration Architecture (onboarding) | Applied | `03_REGISTRATION.md` |
| 4 | Customer Data Isolation Review | Applied | `04_SECURITY.md` |
| 5 | Order Status Translation Layer | Applied | `05_STATUS_TRANSLATION.md` |
| 6 | Pricing Authority Revision (backend authoritative) | Applied | `06_API_MATRIX.md` |
| 7 | QR Security Review | Applied | `04_SECURITY.md` |
| 8 | Notification Architecture Review | Applied | `08_NOTIFICATIONS.md` |
| 9 | Address Management Module | Applied | `09_ADDRESSES.md` |
| 10 | Environment Configuration | Applied | `10_ENVIRONMENT.md` |
| 11 | Error Handling Architecture | Applied | `11_ERROR_HANDLING.md` |
| 12 | Feature Flag System | Applied | `12_FEATURE_FLAGS.md` |
| 13 | Design System Revision (#0078D4) | Applied | `13_DESIGN_SYSTEM.md` |
| 14 | Production Readiness Checklist | Applied | `14_PRODUCTION_CHECKLIST.md` |

## Pre-Phase-0 Corrections (Applied)

| # | Correction | Status | Document |
|---|-----------|--------|----------|
| P1 | Replace hardcoded tenant ID with environment config | Applied | `03_REGISTRATION.md`, `10_ENVIRONMENT.md` |
| P2 | Compress roadmap from 12 weeks to 8 weeks | Applied | `18_ROADMAP.md` |
| P3 | Add CI/CD and code quality tooling to Phase 0 | Applied | `18_ROADMAP.md` |
| P4 | Registration does NOT create Customer entity (backend gap) | Applied | `03_REGISTRATION.md` |

---

## Architecture Documents Index

| Doc | Title | File |
|-----|-------|------|
| 01 | Authentication Architecture | `01_AUTHENTICATION.md` |
| 02 | API Integration Matrix | `02_API_MATRIX.md` |
| 03 | Registration Architecture | `03_REGISTRATION.md` |
| 04 | Security Architecture | `04_SECURITY.md` |
| 05 | Status Translation Layer | `05_STATUS_TRANSLATION.md` |
| 06 | Screen Map & Navigation | `06_SCREEN_MAP.md` |
| 07 | Zustand Store Design | `07_STATE_MANAGEMENT.md` |
| 08 | Notification Center | `08_NOTIFICATIONS.md` |
| 09 | Address Management | `09_ADDRESSES.md` |
| 10 | Environment Configuration | `10_ENVIRONMENT.md` |
| 11 | Error Handling Architecture | `11_ERROR_HANDLING.md` |
| 12 | Feature Flag System | `12_FEATURE_FLAGS.md` |
| 13 | Design System | `13_DESIGN_SYSTEM.md` |
| 14 | Production Readiness Checklist | `14_PRODUCTION_CHECKLIST.md` |
| 15 | Component Inventory | `15_COMPONENTS.md` |
| 16 | Order Lifecycle Diagram | `16_ORDER_LIFECYCLE.md` |
| 17 | Pricing Authority | `17_PRICING.md` |
| 18 | Implementation Roadmap | `18_ROADMAP.md` |

---

## Key Architectural Decisions

### Decision 1: No Refresh Tokens

**Rationale:** Backend has no `/auth/refresh` endpoint. The `auth.service.ts` generates a `refreshToken` field but no endpoint exists to validate it. JWT expires in 7 days per `JWT_EXPIRES_IN=7d`.

**Impact:**
- Remove all refresh token logic from interceptor
- On 401, prompt user to re-login
- Consider long-lived access token (7d) acceptable for customer app
- Future: implement refresh endpoint before adding biometric re-auth

### Decision 2: Expo SecureStore for Credentials

**Rationale:** AsyncStorage is unencrypted. JWT tokens and refresh tokens contain sensitive claims (userId, tenantId, role).

**Impact:**
- `expo-secure-store` for: `accessToken`, `refreshToken` (when implemented)
- AsyncStorage for: `theme`, `onboardingStatus`, `orderDraft`, `addresses`
- Keychain (iOS) / EncryptedSharedPreferences (Android) under the hood

### Decision 3: Backend-Authored Pricing

**Rationale:** Frontend price calculation creates inconsistencies. Tax rules, discounts, and surcharges are business logic owned by the backend.

**Impact:**
- Mobile shows estimated prices only
- Final price confirmed server-side on order creation
- OrderReviewScreen displays estimate with disclaimer

### Decision 4: Tenant ID via Environment Configuration

**Rationale:** `POST /auth/register` requires `tenantId`. Hardcoding is inflexible. Environment config allows different values per build profile.

**Impact:**
- Tenant ID configured in `EXPO_PUBLIC_TENANT_ID` env var
- Value set per environment (dev, staging, production)
- No user input required — auto-assigned from config
- Future: migrate to invite code flow for multi-tenant support

### Decision 5: Customer-Safe API Endpoints

**Rationale:** `GET /orders?tenantId=` exposes tenant data. Customer users must only see their own orders.

**Impact:**
- Mobile calls `GET /orders?tenantId=X` with JWT-validated customerId
- Backend must filter by customerId from JWT, not client-supplied customerId
- Future: implement `/orders/me` endpoint for cleaner API

---

## Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Expo SDK | 51 |
| Runtime | React Native | 0.74.x |
| Navigation | Expo Router | 3.5.x |
| State (server) | React Query | 5.40.x |
| State (client) | Zustand | 4.5.x |
| HTTP | Axios | 1.7.x |
| Secure Storage | expo-secure-store | ~13 |
| Async Storage | @react-native-async-storage/async-storage | 1.23.x |
| Forms | React Hook Form | 7.51.x |
| Validation | Zod | 3.23.x |
| UI Kit | React Native Paper | 5.x |
| Icons | @expo/vector-icons | Latest |
| QR Display | react-native-qrcode-svg | 6.x |
| QR Scanner | expo-camera | ~15 |
| Animations | react-native-reanimated | 3.x |
| Dates | date-fns | 3.6.x |
| Env Config | expo-constants | ~16 |
| Linting | ESLint + Prettier | Latest |
| Testing | Jest + React Native Testing Library | Latest |
| E2E Testing | Detox | Latest |
| CI/CD | EAS Build + GitHub Actions | — |
| Error Tracking | Sentry (sentry-expo) | Latest |

---

## Project Structure

```
apps/customer-mobile/
├── app/                          # Expo Router file-based routes
│   ├── _layout.tsx               # Root layout (providers)
│   ├── (auth)/
│   │   ├── _layout.tsx           # Auth stack layout
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   └── onboarding.tsx
│   ├── (tabs)/
│   │   ├── _layout.tsx           # Tab navigator layout
│   │   ├── index.tsx             # Home tab
│   │   ├── order/
│   │   │   ├── _layout.tsx
│   │   │   ├── services.tsx
│   │   │   ├── garments.tsx
│   │   │   ├── pickup.tsx
│   │   │   ├── review.tsx
│   │   │   ├── payment.tsx
│   │   │   └── confirmation.tsx
│   │   ├── track/
│   │   │   ├── _layout.tsx
│   │   │   ├── index.tsx
│   │   │   ├── [id].tsx
│   │   │   └── scan.tsx
│   │   └── account/
│   │       ├── _layout.tsx
│   │       ├── profile.tsx
│   │       ├── orders.tsx
│   │       ├── addresses.tsx
│   │       ├── address-new.tsx
│   │       ├── address-edit.tsx
│   │       ├── notifications.tsx
│   │       └── settings.tsx
│   └── order/[id].tsx            # Deep link order detail
├── src/
│   ├── api/
│   │   ├── client.ts             # Axios instance
│   │   ├── interceptors.ts       # Auth + error interceptors
│   │   └── endpoints.ts          # API endpoint constants
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useServices.ts
│   │   ├── useOrders.ts
│   │   ├── useCustomers.ts
│   │   ├── useBranches.ts
│   │   ├── useProfile.ts
│   │   ├── useQRCode.ts
│   │   ├── useNotifications.ts
│   │   └── useAddresses.ts
│   ├── stores/
│   │   ├── authStore.ts
│   │   ├── orderDraftStore.ts
│   │   ├── notificationStore.ts
│   │   └── uiStore.ts
│   ├── services/
│   │   ├── secureStorage.ts      # Expo SecureStore wrapper
│   │   ├── cacheService.ts       # AsyncStorage cache
│   │   └── syncQueue.ts          # Offline sync queue
│   ├── components/
│   │   ├── ui/                   # Atomic components
│   │   └── features/             # Feature components
│   ├── utils/
│   │   ├── format.ts
│   │   ├── validation.ts
│   │   ├── statusMapper.ts       # Status translation
│   │   ├── errorHandler.ts       # Error normalization
│   │   └── constants.ts
│   └── config/
│       ├── environment.ts        # Env config
│       └── features.ts           # Feature flags
├── __tests__/                    # Unit tests
│   ├── stores/
│   ├── hooks/
│   └── utils/
├── e2e/                          # E2E tests (Detox)
│   ├── auth.test.ts
│   ├── order.test.ts
│   └── tracking.test.ts
├── assets/
├── .eslintrc.js                  # ESLint config
├── .prettierrc                   # Prettier config
├── app.json                      # Expo config
├── eas.json                      # EAS Build config
├── package.json
├── tsconfig.json
├── .env.development
├── .env.staging
├── .env.production
└── .gitignore
```
