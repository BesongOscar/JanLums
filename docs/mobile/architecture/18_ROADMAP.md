# 18 — Implementation Roadmap

**Version:** 3.0.0
**Status:** Active
**Last Updated:** 2026-06-20
**Duration:** 8 Weeks (compressed from 12)

---

## 1. Phase Overview

| Phase | Duration | Focus | Deliverable |
|-------|----------|-------|-------------|
| 0 | Week 1 | Setup + CI/CD | Scaffolded app with tooling |
| 1 | Weeks 2-3 | Auth + Home | Login, register, home dashboard |
| 2 | Weeks 4-5 | Order Creation | Full order flow |
| 3 | Weeks 5-6 | Order Tracking | Status timeline, QR scan |
| 4 | Weeks 6-7 | Account + Addresses | Profile, addresses, settings |
| 5 | Weeks 7-8 | Notifications + Polish | Notification center, error handling |
| 6 | Week 8 | Production Readiness | EAS build, store submission |

**Note:** Phases 2-5 have overlapping weeks due to parallel workstreams.

---

## 2. Phase 0 — Setup + CI/CD (Week 1)

### Project Scaffolding

| Task | Details | Day |
|------|---------|-----|
| Initialize Expo project | `npx create-expo-app apps/customer-mobile --template tabs` | 1 |
| Configure monorepo | Add to pnpm-workspace.yaml, tsconfig paths | 1 |
| Install core dependencies | React Query, Zustand, Axios, React Native Paper, Zod | 1 |
| Set up navigation | Expo Router with (auth) and (tabs) groups | 1 |
| Set up API client | Axios with interceptors, SecureStore | 2 |
| Set up Zustand stores | Auth, OrderDraft, UI | 2 |
| Set up React Query provider | QueryClient configuration | 2 |
| Add shared-types dependency | Import from `@janlums/shared-types` | 2 |
| Create environment config | .env files, environment.ts | 2 |
| Create feature flags | features.ts with all flags | 2 |

### CI/CD & Code Quality

| Task | Details | Day |
|------|---------|-----|
| Configure ESLint | Match monorepo conventions, add React Native rules | 3 |
| Configure Prettier | Consistent formatting across team | 3 |
| Set up Husky | Pre-commit hooks (lint, typecheck) | 3 |
| Set up lint-staged | Run lint on staged files | 3 |
| Configure Jest | Unit test setup with React Native Testing Library | 3 |
| Create GitHub Actions workflow | Lint → TypeCheck → Test → Build | 4 |
| Set up EAS Build | eas.json with dev/preview/production profiles | 4 |
| Configure Sentry | Error tracking initialization | 4 |
| Set up branch protection | Require CI pass before merge | 4 |
| Create .gitignore | Exclude .env, node_modules, .expo | 4 |
| Document setup | README with local dev instructions | 5 |

### CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/mobile.yml
name: Mobile CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm --filter @janlums/customer-mobile lint

  typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm --filter @janlums/customer-mobile typecheck

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm --filter @janlums/customer-mobile test

  build:
    needs: [lint, typecheck, test]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - uses: expo/expo-github-action@v8
        with:
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
      - run: eas build --platform all --profile preview
```

### Package.json Scripts

```json
{
  "scripts": {
    "dev": "expo start",
    "android": "expo run:android",
    "ios": "expo run:ios",
    "lint": "eslint . --ext .ts,.tsx",
    "lint:fix": "eslint . --ext .ts,.tsx --fix",
    "typecheck": "tsc --noEmit",
    "test": "jest",
    "test:coverage": "jest --coverage",
    "format": "prettier --write \"src/**/*.{ts,tsx}\"",
    "format:check": "prettier --check \"src/**/*.{ts,tsx}\"",
    "prepare": "husky install"
  }
}
```

### Deliverable
Working app shell with navigation, API client, stores, CI/CD pipeline, and code quality tooling.

---

## 3. Phase 1 — Auth + Home (Weeks 2-3)

### Tasks

| Task | Screen | API Integration | Week |
|------|--------|-----------------|------|
| Login flow | `LoginScreen` | `POST /auth/login` | 2 |
| Register flow | `RegisterScreen` | `POST /auth/register` | 2 |
| Token persistence | SecureStore + AsyncStorage | — | 2 |
| Home dashboard | `HomeScreen` | `GET /services`, `GET /orders` | 3 |
| Service carousel | `ServiceCard` | `GET /services` | 3 |
| Recent orders list | `OrderCard` | `GET /orders` | 3 |
| Pull-to-refresh | All screens | React Query refetch | 3 |
| Offline banner | `OfflineBanner` | Network detection | 3 |
| Unit tests (auth) | Auth store, login hook | Jest | 3 |

### Deliverable
Working auth flow, home screen with services and orders.

---

## 4. Phase 2 — Order Creation (Weeks 4-5)

### Tasks

| Task | Screen | API Integration | Week |
|------|--------|-----------------|------|
| Service selection | `ServiceSelectScreen` | `GET /services` | 4 |
| Category filter | `ServiceCategoryFilter` | `GET /services/category/:cat` | 4 |
| Garment entry | `GarmentEntryScreen` | Local state (OrderDraft) | 4 |
| Garment type picker | `GarmentTypePicker` | Local state | 4 |
| Pickup details | `PickupDetailsScreen` | `GET /branches` | 5 |
| Branch selector | `BranchCard` | `GET /branches` | 5 |
| Date/time picker | `DatePicker`, `TimePicker` | Local state | 5 |
| Order review | `OrderReviewScreen` | Computed estimates | 5 |
| Payment selection | `PaymentScreen` | Local state | 5 |
| Order submission | `ConfirmationScreen` | `POST /orders` | 5 |
| QR generation | `QRCodeDisplay` | `POST /qr-code/generate/order` | 5 |
| Draft persistence | AsyncStorage | OrderDraft store | 5 |
| Unit tests (order) | Order draft store, hooks | Jest | 5 |

### Deliverable
Complete order creation flow from service selection to confirmation.

---

## 5. Phase 3 — Order Tracking (Weeks 5-6)

### Tasks

| Task | Screen | API Integration | Week |
|------|--------|-----------------|------|
| Track by order number | `TrackScreen` | `GET /orders` | 5 |
| Order detail timeline | `OrderDetailScreen` | `GET /orders/:id` | 5 |
| Status translation | `statusMapper.ts` | Status enum mapping | 5 |
| Status color mapping | `OrderStatusBadge` | Status → color | 5 |
| QR code scanner | `QRScanScreen` | `GET /qr-code/parse/:code` | 6 |
| Recent orders section | `TrackScreen` | `GET /orders` | 6 |
| Deep link handling | `order/[id].tsx` | expo-linking | 6 |
| Order polling | `useOrderPolling` | `GET /orders` (30s interval) | 6 |

### Deliverable
Order tracking with timeline, QR scanning, and real-time updates.

---

## 6. Phase 4 — Account + Addresses (Weeks 6-7)

### Tasks

| Task | Screen | API Integration | Week |
|------|--------|-----------------|------|
| Profile view | `ProfileScreen` | `GET /users/:id` | 6 |
| Profile edit | `ProfileScreen` | `PUT /users/:id` | 6 |
| Order history | `OrderHistoryScreen` | `GET /orders` | 6 |
| Reorder | `OrderHistoryItem` | `POST /orders` (clone) | 6 |
| Address list | `AddressListScreen` | AsyncStorage | 7 |
| Add address | `AddAddressScreen` | AsyncStorage | 7 |
| Edit address | `EditAddressScreen` | AsyncStorage | 7 |
| Default address | `AddressCard` | AsyncStorage | 7 |
| Settings | `SettingsScreen` | Local state | 7 |
| Logout | `ProfileScreen` | Auth store reset | 7 |

### Deliverable
Complete account management with addresses and settings.

---

## 7. Phase 5 — Notifications + Polish (Weeks 7-8)

### Tasks

| Task | Screen | API Integration | Week |
|------|--------|-----------------|------|
| Notification center | `NotificationsScreen` | NotificationStore | 7 |
| Notification detail | `NotificationDetailScreen` | Local state | 7 |
| Notification badges | Tab bar badge | Unread count | 7 |
| Error handling | `errorHandler.ts` | Axios interceptor | 7 |
| Global toast | `Toast` component | Error/success display | 7 |
| Form validation | Zod schemas | All forms | 7 |
| Loading states | `Loading` component | Skeleton loaders | 8 |
| Empty states | `EmptyState` component | No orders, no results | 8 |
| Unit tests (coverage) | All stores, hooks, utils | Jest | 8 |
| Accessibility | Labels, contrast | All screens | 8 |
| Performance | FlatList, memo | All lists | 8 |

### Deliverable
Polished app with notifications, error handling, and tests.

---

## 8. Phase 6 — Production Readiness (Week 8)

### Tasks

| Task | Details | Day |
|------|---------|-----|
| Environment config | Verify all .env files | 1 |
| App icons | 1024x1024 icon, adaptive icon | 1 |
| Splash screen | 1284x2778 splash | 1 |
| Sentry setup | Verify error tracking | 1 |
| Analytics setup | PostHog or similar | 2 |
| EAS Build config | Verify eas.json profiles | 2 |
| Store assets | Screenshots, descriptions | 2 |
| TestFlight beta | iOS beta testing | 3 |
| Play Console beta | Android beta testing | 3 |
| Store submission | App Store + Play Store | 4 |
| OTA channel | expo-updates config | 5 |

### Deliverable
Production-ready app submitted to stores.

---

## 9. Dependency Graph

```
Phase 0 (Setup + CI/CD)
    │
    ▼
Phase 1 (Auth + Home)
    │
    ├──► Phase 2 (Order Creation) ──┐
    │                               │
    └──► Phase 3 (Tracking) ◄───────┤
              │                      │
              ▼                      │
         Phase 4 (Account) ◄─────────┤
              │                      │
              ▼                      │
         Phase 5 (Notifications) ◄───┘
              │
              ▼
         Phase 6 (Production)
```

---

## 10. Risk Mitigation

| Risk | Mitigation | Phase |
|------|------------|-------|
| Backend not ready | Mock API with local data | All |
| No refresh token endpoint | 401 → re-login | 1 |
| No address API | AsyncStorage fallback | 4 |
| Payment API missing | Cash-only mode | 2 |
| Push notifications missing | In-app polling | 5 |
| QR security gaps | Ownership validation on scan | 3 |
| No Customer entity on registration | Backend must add auto-creation | 0 |

---

## 11. Backend Changes Required

| Priority | Change | Required By |
|----------|--------|-------------|
| **P0** | Auto-create Customer entity on registration | Phase 1 |
| **P0** | Filter orders by customerId from JWT | Phase 3 |
| **P0** | Validate JWT tenantId matches query | Phase 2 |
| P1 | Add `phone` field to RegisterDto | Phase 1 |
| P1 | Add `POST /auth/refresh` endpoint | Phase 5 |
| P1 | Add address CRUD endpoints | Phase 4 |
| P2 | Add notification read/status tracking | Phase 5 |
| P2 | Implement real notification service (SMS/Email) | Phase 5 |

---

## 12. Weekly Milestones

| Week | Milestone | Status |
|------|-----------|--------|
| 1 | App shell + CI/CD + linting | — |
| 2 | Login + Register working | — |
| 3 | Home screen + service list | — |
| 4 | Service selection + garment entry | — |
| 5 | Order flow complete + tracking | — |
| 6 | QR scan + account + profile | — |
| 7 | Addresses + notifications | — |
| 8 | Polish + tests + store submission | — |
