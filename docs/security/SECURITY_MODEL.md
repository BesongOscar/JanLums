# Security Model

**Version:** 1.0.0  
**Status:** Active  
**Last Updated:** 2026-05-25  
**Related Modules:** All  
**Implementation Status:** In Progress  
**Dependencies:** 03_TECH_ARCHITECTURE, API_STANDARDS  

---

## 1. RBAC (Role-Based Access Control)

### Roles

| Role | Description | Permissions |
|------|-------------|-------------|
| `platform_admin` | System administrator | Full access |
| `tenant_admin` | Tenant owner | Tenant-wide access |
| `manager` | Branch manager | Branch + team management |
| `counter_staff` | Front desk | Orders, customers |
| `washer` | Machine operator | Process garments |
| `presser` | Finishing | Process garments |
| `qc_inspector` | Quality control | QC decisions |
| `driver` | Delivery | Routes, stops |
| `customer` | End user | Own orders, profile |

### Permission Matrix

| Resource | Create | Read | Update | Delete |
|----------|--------|------|--------|--------|
| Orders | counter_staff+ | staff+ | staff+ | manager+ |
| Customers | counter_staff+ | staff+ | counter_staff+ | manager+ |
| Employees | manager+ | staff+ | manager+ | admin+ |
| Payroll | admin+ | employee (self) | admin+ | admin+ |
| Reports | all | role-based | - | - |
| Settings | admin+ | staff+ | admin+ | admin+ |

---

## 2. Tenant Isolation

### Database Level

```sql
-- Row-level security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON orders
  USING (tenant_id = current_setting('app.current_tenant')::UUID);
```

### Application Level

```typescript
// Middleware
@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const tenantId = request.headers['x-tenant-id'];
    
    return user.tenantId === tenantId;
  }
}
```

---

## 3. Audit Logging

### Logged Events

| Event | Data | Retention |
|-------|------|-----------|
| Login | User, IP, device, result | 7 years |
| Order created | Order, user, timestamp | 7 years |
| Payment processed | Transaction, amount | 7 years |
| Status changed | Entity, old, new, user | 7 years |
| Data export | User, data type, timestamp | 7 years |

### Audit Log Schema

```typescript
interface AuditLog {
  id: string;
  tenantId: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  oldValues: object;
  newValues: object;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
}
```

---

## 4. Encryption

### Data at Rest

| Data Type | Encryption | Key Management |
|-----------|-----------|----------------|
| Passwords | bcrypt (hash) | - |
| API keys | AES-256 | AWS KMS / HashiCorp Vault |
| PII | AES-256 | AWS KMS |
| Payment data | PCI DSS compliant | Stripe |

### Data in Transit

- TLS 1.3 for all connections
- HSTS headers
- Certificate pinning (mobile)

---

## 5. Secrets Handling

### Environment Variables

```bash
# .env.local (never commit)
DATABASE_PASSWORD=...
JWT_SECRET=...
API_KEYS=...

# Use dotenv
require('dotenv').config({ path: '.env.local' });
```

### Secret Management

- Development: .env.local files
- Staging: Docker secrets
- Production: AWS Secrets Manager / Vault

---

## 6. Session Strategy

### JWT Configuration

```typescript
// auth.module.ts
JwtModule.register({
  secret: process.env.JWT_SECRET,
  signOptions: {
    expiresIn: '24h',
    issuer: 'janlums-api',
  },
});
```

### Token Refresh

```typescript
// Refresh token rotation
POST /api/v1/auth/refresh
Request:
{
  "refreshToken": "..."
}

Response:
{
  "accessToken": "new-access-token",
  "refreshToken": "new-refresh-token"
}
```

---

## 7. API Security

### Rate Limiting

```typescript
// Throttle configuration
ThrottlerModule.forRoot({
  ttl: 60,
  limit: 100,
});

// Per-route
@Throttle(5, 60) // 5 requests per minute
@Post('login')
async login() { }
```

### Input Validation

```typescript
@Post()
async create(@Body() dto: CreateOrderDto) {
  // class-validator handles validation
}
```

### CORS

```typescript
app.enableCors({
  origin: [
    'https://pressing237.com',
    'https://app.pressing237.com',
  ],
  credentials: true,
});
```

---

## 8. Mobile Security

### Certificate Pinning

```typescript
// React Native
fetch(url, {
  sslPinning: {
    certs: ['cert1', 'cert2'],
  },
});
```

### Secure Storage

```typescript
// Store tokens securely
import * as Keychain from 'react-native-keychain';

await Keychain.setGenericPassword('token', jwtToken);
```

---

## 9. Upload Security

### File Validation

```typescript
@UseInterceptors(
  FileInterceptor('file', {
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/image\/(jpg|jpeg|png)/)) {
        return cb(new Error('Only images allowed'), false);
      }
      cb(null, true);
    },
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
    },
  }),
)
```

### Storage

- Scan for malware
- Store outside web root
- Use UUID filenames
- Limit file types

---

## 10. Security Checklist

### Development

- [ ] No secrets in code
- [ ] Input validation on all endpoints
- [ ] Output encoding
- [ ] CSRF protection
- [ ] XSS prevention

### Deployment

- [ ] HTTPS only
- [ ] Security headers (CSP, HSTS)
- [ ] Rate limiting enabled
- [ ] Audit logging active
- [ ] Error handling (no stack traces to client)

### Monitoring

- [ ] Failed login alerts
- [ ] Unusual activity detection
- [ ] Vulnerability scanning
- [ ] Dependency audits
- [ ] Penetration testing
