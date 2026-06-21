# 16 — Domain and Environment Matrix

**Version:** 1.0.0  
**Status:** Active  
**Last Updated:** 2026-05-25  
**Related Modules:** All  
**Implementation Status:** Planned  
**Dependencies:** 14_ENVIRONMENTS_AND_DEPLOYMENT, 15_INFRASTRUCTURE_IMPLEMENTATION_GUIDE  

## 1. Purpose

Map all domains across environments.

---

## 2. Environment Domains

### Local

| Surface | Domain | Port |
|---------|--------|------|
| pressing-web | localhost | 3025 |
| customer-web | localhost | 3035 |
| admin-web | localhost | 3085 |
| API | localhost | 3000 |
| Supabase | localhost | 54321 |
| Database | localhost | 54322 |

### Staging

| Surface | Domain |
|---------|--------|
| pressing-web | staging.pressing237.com |
| customer-web | app-staging.pressing237.com |
| admin-web | admin-staging.laundryos.com |
| API | api-staging.pressing237.com |
| Supabase | be-staging.pressing237.com |

### Production

| Surface | Domain |
|---------|--------|
| pressing-web | pressing237.com |
| customer-web | app.pressing237.com |
| admin-web | admin.laundryos.com |
| API | api.pressing237.com |
| Supabase | be.pressing237.com |

---

## 3. Tenant Subdomains

| Tenant | Staging | Production |
|--------|---------|------------|
| Example Laundry | example.staging.pressing237.com | example.pressing237.com |
| CleanPress | cleanpress.staging.pressing237.com | cleanpress.pressing237.com |

---

## 4. Environment Variables

### Local (.env)

```
NODE_ENV=development
API_URL=http://localhost:3015
WEB_URL=http://localhost:3025
```

### Staging (.env.staging)

```
NODE_ENV=staging
API_URL=https://api-staging.pressing237.com
WEB_URL=https://staging.pressing237.com
```

### Production (.env.production)

```
NODE_ENV=production
API_URL=https://api.pressing237.com
WEB_URL=https://pressing237.com
```

---

## 5. Feature Flags by Environment

| Feature | Local | Staging | Production |
|---------|-------|---------|------------|
| Mock payments | ✅ | ✅ | ❌ |
| Debug logging | ✅ | ✅ | ❌ |
| Email sandbox | ✅ | ✅ | ❌ |
| Real payments | ❌ | ❌ | ✅ |
| Analytics | ❌ | ✅ | ✅ |
