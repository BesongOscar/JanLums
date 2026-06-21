# 03 — Customer Registration Architecture

**Version:** 2.0.0
**Status:** Active
**Last Updated:** 2026-06-20
**Revisions Applied:** #3 (Customer Registration / Onboarding)

---

## 1. Problem Statement

The backend `POST /auth/register` endpoint requires `tenantId`:

```typescript
// RegisterDto (from auth/dto/register.dto.ts)
export class RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  tenantId: string;    // ← Customer cannot know this
  role?: string;
}
```

A customer downloading the app has no way to know which `tenantId` to use. The app serves a single tenant (Pressing 237), but the backend is multi-tenant by design.

### Critical Backend Gap

**Registration creates a `User` entity but NOT a `Customer` entity.**

```typescript
// auth.service.ts:53-65
async register(registerDto: RegisterDto) {
  const existingUser = await this.usersService.findByEmail(registerDto.email);
  if (existingUser) {
    throw new ConflictException('User already exists');
  }
  const passwordHash = await bcrypt.hash(registerDto.password, 10);
  const user = await this.usersService.create({
    ...registerDto,
    passwordHash,
  });
  // NOTE: No Customer entity created!
}
```

**Impact:**
- Registered customer has a `User` record but no `Customer` record
- Orders cannot be associated with a customer profile
- Customer search (`GET /customers/search`) won't find registered users
- `totalOrders`, `totalSpent`, loyalty points cannot be tracked

**Required backend change:** Create a `Customer` entity automatically on registration.

---

## 2. Recommended Solution: Environment Configuration

Since the mobile app is built for **Pressing 237** specifically (not a white-label app), the tenant ID is configured via environment variables.

### Strategy: Environment-Based Tenant Resolution

```
┌─────────┐     ┌────────────┐     ┌─────────┐     ┌─────────┐
│  User    │     │ Onboarding │     │ Config  │     │ Backend  │
└────┬────┘     └─────┬──────┘     └────┬────┘     └────┬────┘
     │                │                  │                │
     │  Open app      │                  │                │
     │───────────────>│                  │                │
     │                │                  │                │
     │                │  Read env config │                │
     │                │  EXPO_PUBLIC_    │                │
     │                │  TENANT_ID       │                │
     │                │─────────────────>│                │
     │                │                  │                │
     │                │  Register with   │                │
     │                │  env tenantId    │                │
     │                │─────────────────────────────────>│
     │                │                  │                │
     │                │  201 Created     │                │
     │                │<─────────────────────────────────│
```

### Implementation

```typescript
// src/config/environment.ts
import Constants from 'expo-constants';

function getEnvVar(key: string, fallback?: string): string {
  const value = Constants.expoConfig?.extra?.[key]
    ?? process.env[`EXPO_PUBLIC_${key}`];
  if (value === undefined && fallback === undefined) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value ?? fallback ?? '';
}

export const CONFIG = {
  apiUrl: getEnvVar('API_URL', 'http://localhost:3015/api/v1'),
  env: getEnvVar('ENV', 'development'),
  appName: getEnvVar('APP_NAME', 'JanLums'),
  tenantId: getEnvVar('TENANT_ID'),  // Required — no fallback
};
```

```typescript
// Registration screen
const handleRegister = async (data: RegisterFormData) => {
  await registerMutation.mutateAsync({
    email: data.email,
    password: data.password,
    firstName: data.firstName,
    lastName: data.lastName,
    phone: data.phone,
    tenantId: CONFIG.tenantId,  // From environment
    role: 'customer',
  });
};
```

### Advantages

| Advantage | Description |
|-----------|-------------|
| Zero friction | Customer never sees or enters tenantId |
| Secure | TenantId from environment, not user-modifiable |
| Flexible | Different values per environment (dev, staging, prod) |
| Works now | Requires no backend changes |

### Limitations

| Limitation | Mitigation |
|------------|------------|
| Single tenant only | Acceptable — app is for Pressing 237 |
| TenantId in env | Can be extracted by RE tools — acceptable for B2C |
| No white-label support | Not a requirement for MVP |
| No Customer entity created | Backend must add auto-creation |

---

## 3. Alternative: Invite Code Flow (For Future Multi-Tenant)

If the app ever needs to support multiple tenants:

### Flow

```
┌─────────┐     ┌────────────┐     ┌─────────┐     ┌─────────┐
│  User    │     │ Onboarding │     │ API     │     │ Backend  │
└────┬────┘     └─────┬──────┘     └────┬────┘     └────┬────┘
     │                │                  │                │
     │  Enter invite  │                  │                │
     │  code          │                  │                │
     │───────────────>│                  │                │
     │                │                  │                │
     │                │  POST /invite-   │                │
     │                │  code/validate   │                │
     │                │  { code: "XYZ" } │                │
     │                │─────────────────────────────────>│
     │                │                  │                │
     │                │  200 OK          │                │
     │                │  { tenantId,     │                │
     │                │   tenantName,    │                │
     │                │   branchId }     │                │
     │                │<─────────────────────────────────│
     │                │                  │                │
     │  Show:         │                  │                │
     │  "Welcome to   │                  │                │
     │   Pressing 237"│                  │                │
     │<───────────────│                  │                │
     │                │                  │                │
     │  Complete      │                  │                │
     │  registration  │                  │                │
     │───────────────>│                  │                │
     │                │  POST /auth/     │                │
     │                │  register        │                │
     │                │  { email, pass,  │                │
     │                │   firstName,     │                │
     │                │   lastName,      │                │
     │                │   tenantId }     │                │
     │                │─────────────────────────────────>│
```

### Backend Endpoint Required

```typescript
// POST /api/v1/invite-code/validate
// Request: { code: string }
// Response: { tenantId: string, tenantName: string, branchId?: string }
```

---

## 4. Registration UX Flow

### Screen 1: Welcome / Login

```
┌─────────────────────────────────────┐
│                                     │
│         [JanLums Logo]              │
│                                     │
│    Welcome to Pressing 237          │
│    Professional Laundry Services    │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Email                       │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ Password                    │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │         LOG IN              │   │
│  └─────────────────────────────┘   │
│                                     │
│  Don't have an account? Sign Up     │
│                                     │
└─────────────────────────────────────┘
```

### Screen 2: Registration

```
┌─────────────────────────────────────┐
│  ← Back                            │
│                                     │
│       Create Your Account           │
│       Join Pressing 237             │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ First Name                  │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ Last Name                   │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ Email                       │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ Phone Number                │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ Password                    │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ Confirm Password            │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │       CREATE ACCOUNT        │   │
│  └─────────────────────────────┘   │
│                                     │
│  Already have an account? Log In    │
│                                     │
└─────────────────────────────────────┘
```

### Screen 3: Email Verification (Future)

```
┌─────────────────────────────────────┐
│                                     │
│       Check Your Email              │
│                                     │
│  We sent a verification link to     │
│  user@example.com                   │
│                                     │
│  [Resend Email]                     │
│                                     │
│  [Continue to App]                  │
│                                     │
└─────────────────────────────────────┘
```

---

## 5. Validation Schema

```typescript
// src/utils/validation.ts
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(9, 'Invalid phone number').max(15),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});
```

---

## 6. Security Considerations

| Risk | Mitigation |
|------|------------|
| Brute force registration | Rate limit on `/auth/register` (backend) |
| Email enumeration | Generic error messages ("If account exists, check email") |
| Weak passwords | Enforce complexity in Zod schema |
| TenantId in app config | Acceptable — not a secret, just a routing hint |
| Duplicate accounts | Backend returns 409 — handle gracefully |

---

## 7. Backend Changes Required

| Priority | Change | Status |
|----------|--------|--------|
| **P0** | Auto-create Customer entity on registration | **NOT IMPLEMENTED** — critical gap |
| P1 | Add `phone` field to RegisterDto | Backend: `register.dto.ts` needs `phone` |
| P1 | Add invite code validation endpoint | New endpoint required |
| P2 | Add email verification flow | New module required |
| P2 | Add rate limiting on auth endpoints | Infrastructure |

### Customer Entity Auto-Creation (Required)

```typescript
// auth.service.ts — REQUIRED CHANGE
async register(registerDto: RegisterDto) {
  const existingUser = await this.usersService.findByEmail(registerDto.email);
  if (existingUser) {
    throw new ConflictException('User already exists');
  }

  const passwordHash = await bcrypt.hash(registerDto.password, 10);
  
  // Create User
  const user = await this.usersService.create({
    ...registerDto,
    passwordHash,
  });

  // Create Customer profile (REQUIRED)
  await this.customersService.create({
    tenantId: registerDto.tenantId,
    firstName: registerDto.firstName,
    lastName: registerDto.lastName,
    email: registerDto.email,
    phone: registerDto.phone,
    userId: user.id,
  });

  // ... return token
}
```
