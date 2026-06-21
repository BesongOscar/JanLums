# Module Dependency Map

**Version:** 1.0.0  
**Status:** Active  
**Last Updated:** 2026-05-25  
**Related Modules:** All backend modules  
**Implementation Status:** In Progress  

---

## Dependency Graph

```
                        ┌─────────────┐
                        │   Config    │
                        └──────┬──────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
┌───────▼───────┐      ┌───────▼───────┐      ┌──────▼──────┐
│   Database    │      │     Auth      │      │   Health    │
│   (TypeORM)   │      │   (JWT/RBAC)  │      │   Check     │
└───────┬───────┘      └───────┬───────┘      └─────────────┘
        │                      │
        └──────────────┬───────┘
                       │
              ┌────────▼────────┐
              │   Reference     │
              │   (Countries,   │
              │   Garment Types)│
              └────────┬────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
┌───────▼───────┐ ┌────▼────┐ ┌──────▼──────┐
│    Tenants    │ │  Users  │ │   Branches  │
└───────┬───────┘ └────┬────┘ └──────┬──────┘
        │              │             │
        └──────────────┼─────────────┘
                       │
              ┌────────▼────────┐
              │   Customers     │
              │   (Profiles,    │
              │   Addresses)    │
              └────────┬────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
┌───────▼───────┐ ┌────▼────┐ ┌──────▼──────┐
│    Services   │ │ Orders  │ │  Employees  │
│   (Pricing)   │ │ (Lots)  │ │   (Shifts)  │
└───────┬───────┘ └────┬────┘ └──────┬──────┘
        │              │             │
        │              │             │
        │      ┌───────▼───────┐     │
        │      │   Garments    │     │
        │      │   (QR Tags)   │     │
        │      └───────┬───────┘     │
        │              │             │
        │      ┌───────▼───────┐     │
        │      │    Quality    │     │
        │      │    Control    │     │
        │      └───────┬───────┘     │
        │              │             │
        └──────────────┼─────────────┘
                       │
              ┌────────▼────────┐
              │    Delivery     │
              │  (Routes,       │
              │   Vehicles)     │
              └────────┬────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
┌───────▼───────┐ ┌────▼────┐ ┌──────▼──────┐
│   Inventory   │ │ Payments│ │   Payroll   │
│  (Suppliers)  │ │(MTN/Card│ │  (Payslips) │
└───────┬───────┘ └────┬────┘ └──────┬──────┘
        │              │             │
        │              │             │
        │      ┌───────▼───────┐     │
        │      │Notifications  │     │
        │      │(SMS/Email/    │     │
        │      │ WhatsApp)     │     │
        │      └───────┬───────┘     │
        │              │             │
        └──────────────┼─────────────┘
                       │
              ┌────────▼────────┐
              │    Reports      │
              │  (Analytics,    │
              │   Aggregates)   │
              └─────────────────┘
```

## Module Dependencies

### Foundation Layer (No Dependencies)

| Module | Tables | Description |
|--------|--------|-------------|
| Config | - | Environment configuration |
| Database | migrations | TypeORM connection |
| Health | - | Service health checks |

### Reference Layer

| Module | Depends On | Tables |
|--------|-----------|--------|
| Reference | Database | countries, cities, garment_types, fabric_types, care_labels |

### Core Layer

| Module | Depends On | Tables |
|--------|-----------|--------|
| Auth | Database | - (JWT only) |
| Users | Auth, Database | user_profiles, user_roles, permissions |
| Tenants | Users, Database | tenants, tenant_domains, tenant_settings |
| Branches | Tenants, Database | branches, branch_hours, branch_equipment |

### Business Layer

| Module | Depends On | Tables |
|--------|-----------|--------|
| Customers | Tenants, Branches, Users | customer_profiles, customer_addresses, customer_loyalty |
| Services | Tenants, Reference | service_types, pricing_rules, promotions |
| Employees | Tenants, Branches, Users | employee_profiles, employee_documents, shifts, attendance |

### Operations Layer

| Module | Depends On | Tables |
|--------|-----------|--------|
| Orders | Customers, Services, Branches | orders, order_items, order_status_history |
| Lots | Orders, Branches | lots, lot_garments |
| Garments | Orders, Lots, Reference | order_items (garment detail), qr_tags |
| Inventory | Branches, Suppliers | inventory_items, inventory_transactions, suppliers |
| Delivery | Branches, Employees, Orders | delivery_routes, delivery_stops, vehicles, driver_assignments |

### Integration Layer

| Module | Depends On | Tables |
|--------|-----------|--------|
| Payments | Orders, Customers | transactions, payment_methods, refunds, wallet_balances |
| Payroll | Employees, Tenants | payroll_periods, payslips, work_entries, deductions |
| Notifications | Customers, Employees, Orders | notifications, notification_templates |
| QR Codes | Orders, Garments | qr_tags, qr_scans |

### Reporting Layer

| Module | Depends On | Tables |
|--------|-----------|--------|
| Reports | All above | Read-only aggregates |

## Build Order

1. **Phase 0:** Config, Database, Health
2. **Phase 1:** Reference, Auth, Users, Tenants, Branches
3. **Phase 2:** Customers, Services, Employees
4. **Phase 3:** Orders, Lots, Garments, Inventory
5. **Phase 4:** Delivery, Payments, Payroll, Notifications, QR Codes
6. **Phase 5:** Reports, Analytics

## Circular Dependencies

**None allowed.** If a circular dependency is discovered:
1. Extract shared interface to `shared-types`
2. Use events for cross-module communication
3. Create a mediator/coordinator module

---

## Related Documents

- [20_NESTJS_MODULE_AND_TABLE_BLUEPRINT](../backend/20_NESTJS_MODULE_AND_TABLE_BLUEPRINT.md)
- [01_UNIFIED_SYSTEM_ARCHITECTURE](./01_UNIFIED_SYSTEM_ARCHITECTURE.md)
- [IMPLEMENTATION_PLAN](../implementation/IMPLEMENTATION_PLAN.md)
