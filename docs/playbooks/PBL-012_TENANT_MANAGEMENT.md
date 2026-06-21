# Feature Playbook: Tenant & Organization Management

**Version:** 1.0.0  
**Status:** Active  
**Last Updated:** 2026-05-25  
**Related Modules:** tenants, branches, admin-web  
**Implementation Status:** In Progress  
**Dependencies:** 20_NESTJS_MODULE_AND_TABLE_BLUEPRINT, 24_ADMIN_DASHBOARD_SCOPE  

## 1. Business Flow

### Overview
Platform admin manages laundry chains (tenants) and their branches, users, and configurations.

### Actors
- **Platform Admin**: Manages tenants, system config
- **Tenant Admin**: Manages their own tenant settings
- **Branch Manager**: Manages branch operations

---

## 2. UI Flow

### admin-web: Tenant Management

```
Tenants Page → Tenant List → Tenant Detail

Tenant Detail:
- Profile info
- Branches list
- Users list
- Subscription plan
- Usage metrics
- Actions: suspend, upgrade, delete
```

---

## 3. API Flow

### Create Tenant

```
POST /api/v1/tenants
Request:
{
  "name": "CleanPress Laundry",
  "slug": "cleanpress",
  "plan": "professional",
  "adminEmail": "admin@cleanpress.com"
}

Response:
{
  "id": "uuid",
  "name": "CleanPress Laundry",
  "slug": "cleanpress",
  "status": "active",
  "createdAt": "2026-05-25T10:00:00Z"
}
```

---

## 4. Database Entities

### tenants
- id (uuid, PK)
- name (varchar)
- slug (varchar)
- status (enum)
- subscription_plan (varchar)
- max_branches (int)
- max_users (int)

### tenant_domains
- id (uuid, PK)
- tenant_id (uuid, FK)
- domain (varchar)
- is_primary (boolean)

---

## 5. Validations

- Slug unique across platform
- Domain valid and not blacklisted
- Plan limits enforced
- Admin email valid

---

## 6. Permissions

| Role | Create Tenant | Manage Tenant | View All Tenants |
|------|--------------|---------------|------------------|
| platform_admin | ✅ | ✅ (all) | ✅ |
| tenant_admin | ❌ | ✅ (own) | ❌ |
| branch_manager | ❌ | ❌ | ❌ |

---

## 7. Edge Cases

- **Tenant suspension**: Grace period, data retention
- **Plan downgrade**: Features disabled, data preserved
- **Custom domain**: DNS verification required
- **Data migration**: Between tenants (rare)
- **White-label**: Custom branding per tenant

---

## 8. Reporting

- Tenant growth
- Revenue by tenant
- Usage metrics
- Churn rate
- Plan distribution
