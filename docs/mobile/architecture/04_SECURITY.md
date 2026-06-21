# 04 — Security Architecture

**Version:** 2.0.0
**Status:** Active
**Last Updated:** 2026-06-20
**Revisions Applied:** #4 (Data Isolation), #7 (QR Security)

---

## 1. Customer Data Isolation

### Current Risk Analysis

**Backend endpoint:** `GET /orders?tenantId=abc-123`

**Vulnerabilities:**
1. Customer can modify `tenantId` parameter to access another tenant's data
2. No server-side validation that JWT tenantId matches query tenantId
3. No ownership filtering — any user in a tenant can see all orders

### Threat Model

| Attacker | Method | Impact | Severity |
|----------|--------|--------|----------|
| Customer A | Change tenantId param | View Customer B's orders | CRITICAL |
| Customer A | Guess orderId UUID | View any order in tenant | HIGH |
| Customer A | Modify customerId | View other customers' data | CRITICAL |
| Customer A | Scan other customer's QR | Access order details | HIGH |

### Recommended Backend Changes

#### Priority 0: Ownership Filtering

```typescript
// orders.service.ts — REQUIRED CHANGE
async findAll(tenantId: string, customerId?: string): Promise<Order[]> {
  const where: any = { tenantId };
  
  // CRITICAL: If user is customer role, filter by customerId
  if (customerId) {
    where.customerId = customerId;
  }
  
  return this.orderRepository.find({
    where,
    relations: ['items', 'staff'],
    order: { createdAt: 'DESC' },
  });
}
```

#### Priority 0: JWT TenantId Validation

```typescript
// orders.controller.ts — REQUIRED CHANGE
@Get()
async findAll(
  @Query('tenantId') queryTenantId: string,
  @Request() req: any,
): Promise<Order[]> {
  // Validate JWT tenantId matches query tenantId
  if (req.user.tenantId !== queryTenantId) {
    throw new ForbiddenException('Access denied');
  }
  
  // For customers, filter by their ID
  const customerId = req.user.role === 'customer' ? req.user.userId : undefined;
  
  return this.ordersService.findAll(queryTenantId, customerId);
}
```

#### Priority 1: Dedicated Customer Endpoints

```typescript
// New endpoints for customer self-service
@Get('me/orders')
@UseGuards(JwtAuthGuard)
async getMyOrders(@Request() req) {
  return this.ordersService.findAll(req.user.tenantId, req.user.userId);
}

@Get('me/orders/:id')
@UseGuards(JwtAuthGuard)
async getMyOrder(@Param('id') id: string, @Request() req) {
  return this.ordersService.findById(id, req.user.tenantId, req.user.userId);
}
```

---

## 2. QR Code Security

### Current Architecture

```
POST /qr-code/generate/order
Body: { tenantId, orderId }
Response: { qrCode: JSON string }

GET /qr-code/parse/:code
Response: { type, tenantId, orderId, code, generatedAt }
```

### Security Issues

| Issue | Risk | Severity |
|-------|------|----------|
| No auth on QR parse | Anyone can scan and get order data | HIGH |
| No ownership validation | Customer A can scan Customer B's QR | HIGH |
| QR contains orderId | UUID can be reused to fetch order | MEDIUM |
| No expiration | Old QR codes remain valid | LOW |

### Recommended QR Validation Flow

```
┌─────────┐     ┌────────────┐     ┌─────────┐     ┌─────────┐
│  User    │     │ QRScanner  │     │ API     │     │ Backend  │
└────┬────┘     └─────┬──────┘     └────┬────┘     └────┬────┘
     │                │                  │                │
     │  Scan QR       │                  │                │
     │───────────────>│                  │                │
     │                │                  │                │
     │                │  Parse QR JSON   │                │
     │                │  Extract orderId │                │
     │                │──────┐           │                │
     │                │      │           │                │
     │                │<─────┘           │                │
     │                │                  │                │
     │                │  GET /qr-code/   │                │
     │                │  parse/:code     │                │
     │                │  + Authorization │                │
     │                │─────────────────────────────────>│
     │                │                  │                │
     │                │                  │  Validate:     │
     │                │                  │  1. QR exists   │
     │                │                  │  2. Owner matches JWT
     │                │                  │  3. Not expired │
     │                │                  │                │
     │                │  200 OK          │                │
     │                │  { order }       │                │
     │                │<─────────────────────────────────│
     │                │                  │                │
     │  Show order    │                  │                │
     │<───────────────│                  │                │
```

### QR Code Data Structure

```json
{
  "type": "order",
  "tenantId": "uuid",
  "orderId": "uuid",
  "code": "ORD-a1b2c3d4",
  "generatedAt": "2026-06-20T10:00:00Z",
  "expiresAt": "2026-07-20T10:00:00Z"
}
```

### QR Validation Rules

| Rule | Implementation |
|------|---------------|
| Ownership | `QR.tenantId === JWT.tenantId && QR.orderId === JWT.orderId` |
| Expiration | `QR.expiresAt > Date.now()` |
| Revocation | Check order status (cancelled orders → invalid QR) |
| Single use | Mark QR as used on pickup confirmation |

---

## 3. Authentication Security

### Token Storage

| Storage | Contents | Encryption |
|---------|----------|------------|
| SecureStore | accessToken | iOS Keychain / Android EncryptedSharedPreferences |
| AsyncStorage | user profile, preferences | App-level only (not encrypted) |

### Transport Security

| Requirement | Implementation |
|-------------|---------------|
| HTTPS in production | Enforce via Expo config |
| Certificate pinning | Future enhancement |
| No HTTP fallback | Block plain HTTP in production |

### Session Management

| Policy | Implementation |
|--------|---------------|
| Token expiry | 7 days (JWT_EXPIRATION) |
| Logout | Clear SecureStore + AsyncStorage |
| Multi-device | Independent sessions (no revocation) |
| Account lockout | Backend rate limiting (5 attempts/min) |

---

## 4. Input Validation

### Client-Side (Zod)

```typescript
// All form inputs validated before API call
const schemas = {
  login: loginSchema,
  register: registerSchema,
  orderCreate: orderCreateSchema,
  profileUpdate: profileUpdateSchema,
};
```

### Server-Side (class-validator)

Backend validates:
- `whitelist: true` — strips unknown properties
- `forbidNonWhitelisted: true` — rejects unknown properties
- `transform: true` — auto-transforms types

---

## 5. API Security Headers

```
Authorization: Bearer {token}
Content-Type: application/json
X-Request-ID: {uuid}           // For tracing
X-Device-ID: {device-uuid}     // For analytics
```

### Rate Limiting (Documented in API_STANDARDS.md)

| Endpoint Type | Limit | Window |
|--------------|-------|--------|
| Auth | 5 | 1 minute |
| Public | 100 | 1 minute |
| Authenticated | 1000 | 1 minute |

---

## 6. Mobile-Specific Security

### App Security

| Concern | Mitigation |
|---------|------------|
| Token in memory | Clear on logout, minimize exposure |
| Screenshot protection | `react-native-screenshot-prevent` (sensitive screens) |
| App backgrounding | Mask sensitive data when backgrounded |
| Root/jailbreak | Detect and warn (not block for MVP) |
| Reverse engineering | Acceptable risk for B2C app |
| Deep link hijacking | Validate deep link source |

### Data at Rest

| Data | Storage | Protection |
|------|---------|------------|
| Access token | SecureStore | Keychain/EncryptedSharedPrefs |
| User profile | AsyncStorage | App sandbox only |
| Order draft | AsyncStorage | App sandbox only |
| Addresses | AsyncStorage | App sandbox only |
| Notifications | AsyncStorage | App sandbox only |

### Data in Transit

| Requirement | Status |
|-------------|--------|
| TLS 1.2+ | Required in production |
| Certificate validation | Default (Expo) |
| Certificate pinning | Future enhancement |

---

## 7. Privacy Considerations

| Data | Collection | Purpose | Retention |
|------|-----------|---------|-----------|
| Email | Registration | Authentication | Until account deletion |
| Phone | Registration | Notifications | Until account deletion |
| Name | Registration | Personalization | Until account deletion |
| Location | Branch selection | Service delivery | Not stored |
| Device ID | App launch | Analytics | 90 days |

---

## 8. Security Checklist for Mobile App

- [ ] All tokens stored in SecureStore
- [ ] HTTPS enforced in production
- [ ] Input validation on all forms (Zod)
- [ ] Error messages don't leak sensitive data
- [ ] No sensitive data in logs
- [ ] No sensitive data in deep links
- [ ] QR codes validated for ownership
- [ ] 401 clears token and redirects to login
- [ ] Logout clears all stored credentials
- [ ] No hardcoded secrets in source code
- [ ] Environment variables not committed
- [ ] App works correctly with expired tokens
