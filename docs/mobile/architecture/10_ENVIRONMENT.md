# 10 — Environment Configuration

**Version:** 2.0.0
**Status:** Active
**Last Updated:** 2026-06-20
**Revisions Applied:** #10 (Environment Configuration)

---

## 1. Environment Variables

### Required Variables

| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| `EXPO_PUBLIC_API_URL` | string | YES | Backend API base URL |
| `EXPO_PUBLIC_ENV` | string | YES | Environment name |
| `EXPO_PUBLIC_APP_NAME` | string | YES | Display name |
| `EXPO_PUBLIC_TENANT_ID` | string | YES | Tenant identifier (from backend seed) |
| `EXPO_PUBLIC_SENTRY_DSN` | string | NO | Error tracking |
| `EXPO_PUBLIC_POSTHOG_KEY` | string | NO | Analytics |

### Environment Values

| Environment | `EXPO_PUBLIC_ENV` | `EXPO_PUBLIC_API_URL` | `EXPO_PUBLIC_TENANT_ID` |
|-------------|-------------------|----------------------|------------------------|
| Development | `development` | `http://localhost:3015/api/v1` | From seed data |
| Staging | `staging` | `https://staging-api.janlums.com/api/v1` | From seed data |
| Production | `production` | `https://api.janlums.com/api/v1` | From seed data |

---

## 2. Configuration File

```typescript
// src/config/environment.ts
import Constants from 'expo-constants';

function getEnvVar(key: string, fallback?: string): string {
  const value = Constants.expoConfig?.extra?.[key]
    ?? process.env[`EXPO_PUBLIC_${key}`];
  if (value === undefined && fallback === undefined) {
    throw new Error(`Missing required environment variable: EXPO_PUBLIC_${key}`);
  }
  return value ?? fallback ?? '';
}

const ENV = {
  apiUrl: getEnvVar('API_URL', 'http://localhost:3015/api/v1'),
  env: getEnvVar('ENV', 'development'),
  appName: getEnvVar('APP_NAME', 'JanLums'),
  tenantId: getEnvVar('TENANT_ID'),  // Required — no fallback
  sentryDsn: getEnvVar('SENTRY_DSN', ''),
  posthogKey: getEnvVar('POSTHOG_KEY', ''),
};

export const CONFIG = {
  ...ENV,
  isDevelopment: ENV.env === 'development',
  isStaging: ENV.env === 'staging',
  isProduction: ENV.env === 'production',
};
```

---

## 3. Expo Config (app.json)

```json
{
  "expo": {
    "name": "JanLums",
    "slug": "janlums-customer",
    "version": "1.0.0",
    "extra": {
      "env": "development",
      "apiUrl": "http://localhost:3015/api/v1",
      "appName": "JanLums",
      "tenantId": "CHANGE_ME_TO_SEED_TENANT_ID",
      "sentryDsn": "",
      "posthogKey": ""
    }
  }
}
```

---

## 4. Environment Files

### .env.development

```
EXPO_PUBLIC_API_URL=http://localhost:3015/api/v1
EXPO_PUBLIC_ENV=development
EXPO_PUBLIC_APP_NAME=JanLums
EXPO_PUBLIC_TENANT_ID=CHANGE_ME_TO_SEED_TENANT_ID
```

### .env.staging

```
EXPO_PUBLIC_API_URL=https://staging-api.janlums.com/api/v1
EXPO_PUBLIC_ENV=staging
EXPO_PUBLIC_APP_NAME=JanLums (Staging)
EXPO_PUBLIC_TENANT_ID=CHANGE_ME_TO_SEED_TENANT_ID
```

### .env.production

```
EXPO_PUBLIC_API_URL=https://api.janlums.com/api/v1
EXPO_PUBLIC_ENV=production
EXPO_PUBLIC_APP_NAME=JanLums
EXPO_PUBLIC_TENANT_ID=CHANGE_ME_TO_SEED_TENANT_ID
EXPO_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx
EXPO_PUBLIC_POSTHOG_KEY=phc_xxx
```

---

## 5. Build Profiles

```json
{
  "expo": {
    "extra": {
      "eas": {
        "projectId": "xxx"
      }
    }
  }
}
```

### EAS Build Profiles

| Profile | Environment | Purpose |
|---------|-------------|---------|
| `development` | development | Local dev with dev API |
| `preview` | staging | QA testing |
| `production` | production | App Store / Play Store |

---

## 6. Tenant Configuration

```typescript
// src/config/tenant.ts
import { CONFIG } from './environment';

export const TENANT = {
  id: CONFIG.tenantId,  // From environment — required
  name: 'Pressing 237',
  primaryColor: '#0078D4',
  currency: 'XAF',
  taxRate: 0.1925, // TVA
};
```

### Getting Tenant ID from Backend

The tenant ID is obtained from the backend seed data:

```bash
# Run seed to get tenant ID
pnpm --filter @janlums/api run seed

# Output will show:
# Tenant created: id=<TENANT_UUID>, name=Pressing 237
# Use this UUID in EXPO_PUBLIC_TENANT_ID
```
