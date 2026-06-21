# 24 — Admin Dashboard Scope

**Version:** 1.0.0  
**Status:** Active  
**Last Updated:** 2026-05-25  
**Related Modules:** admin-web  
**Implementation Status:** In Progress  
**Dependencies:** 01_UNIFIED_SYSTEM_ARCHITECTURE, 09_FRONTEND_APP_RESPONSIBILITIES  

## 1. Purpose

Define the scope and technical approach for the LaundryOS platform administration dashboard.

---

## 2. Framework Decision

**Approved:** Custom React UI (same stack as pressing-web)

**Rejected:** React-Admin

Rationale:
- Consistency with pressing-web component library
- Same team, same patterns
- No need for rapid CRUD scaffolding (admin tasks are complex analytics, not simple CRUD)
- Full control over UX

---

## 3. App Structure

```
apps/admin-web/
  src/
    pages/
      Dashboard.tsx
      Tenants.tsx
      TenantDetail.tsx
      Users.tsx
      Analytics.tsx
      System.tsx
      Billing.tsx
    components/
      AdminNav.tsx
      StatCard.tsx
      TenantTable.tsx
    api/
      adminApi.ts
```

---

## 4. Page Inventory

### Dashboard (`/dashboard`)
- Platform-wide KPI cards:
  - Total active tenants
  - Total orders today
  - Total revenue today
  - Active customers
- Charts:
  - Revenue trend (30 days)
  - Order volume by tenant
  - New tenant signups
- Recent activity feed

### Tenants (`/tenants`)
- Tenant list with:
  - Name, slug, status
  - Subscription plan
  - Branch count, user count
  - Created date
- Actions:
  - View detail
  - Suspend/activate
  - Upgrade/downgrade plan

### Tenant Detail (`/tenants/:id`)
- Tenant profile header
- Branches list
- User accounts
- Subscription history
- Usage metrics

### Users (`/users`)
- Platform user list
- Role filter
- Tenant filter
- Actions: view, suspend, reset password

### Analytics (`/analytics`)
- Platform-wide reports:
  - Revenue by tenant
  - Order volume trends
  - Customer acquisition
  - Geographic distribution
- Export to CSV/Excel

### System (`/system`)
- Global configuration:
  - Payment provider settings
  - SMS/WhatsApp provider settings
  - Email SMTP settings
  - Notification templates
  - System maintenance mode

### Billing (`/billing`)
- Subscription plans management
- Invoices list
- Revenue recognition
- Payout to tenants

---

## 5. Navigation

Single-tier navigation (no sub-nav needed):

| Label | Path |
|-------|------|
| Dashboard | `/dashboard` |
| Tenants | `/tenants` |
| Users | `/users` |
| Analytics | `/analytics` |
| Billing | `/billing` |
| System | `/system` |

---

## 6. Auth and Access

- Only `PLATFORM_ADMIN` role can access
- JWT token with role claim
- API guards on all routes
- Tenant isolation bypass for platform admins (can see all tenants)

---

## 7. Design Notes

- Dark sidebar (like pressing-web but darker)
- Light content area
- Same TableCard and DataTable components
- No filter band needed (simple search + filters)
- Charts using Chart.js or Recharts
