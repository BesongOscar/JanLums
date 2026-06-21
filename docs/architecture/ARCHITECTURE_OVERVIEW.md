# Architecture Overview

**Version:** 1.0.0  
**Status:** Active  
**Last Updated:** 2026-05-25  
**Related Modules:** All  
**Implementation Status:** In Progress  

---

## Executive Summary

JanLunMS is a multi-tenant SaaS platform for laundry and dry-cleaning businesses. It consists of four frontend applications sharing a single NestJS backend API, PostgreSQL database, and integrated payment/notification providers.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENTS                               │
├──────────────┬──────────────┬──────────────┬────────────────┤
│  pressing237 │  pressing237 │   LaundryOS  │  pressing237   │
│   Web Portal │  Mobile App  │   Admin      │   Customer Web │
│   (Staff)    │  (Customers) │   (Platform) │   (Customers)  │
└──────┬───────┴──────┬───────┴──────┬───────┴────────┬───────┘
       │              │              │                │
       └──────────────┴──────┬───────┴────────────────┘
                             │
              ┌──────────────▼──────────────┐
              │      JanLunMS API           │
              │      (NestJS + TypeORM)     │
              └──────────────┬──────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
┌───────▼───────┐  ┌─────────▼────────┐  ┌──────▼──────┐
│  PostgreSQL   │  │   Redis/Queue    │  │   Supabase  │
│  (Primary DB) │  │   (Jobs/Cache)   │  │   (Auth)    │
└───────────────┘  └──────────────────┘  └─────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
┌───────▼───────┐  ┌─────────▼────────┐  ┌──────▼──────┐
│  MTN MoMo     │  │  Orange Money    │  │   Stripe    │
│  (Payments)   │  │  (Payments)      │  │  (Cards)    │
└───────────────┘  └──────────────────┘  └─────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
┌───────▼───────┐  ┌─────────▼────────┐  ┌──────▼──────┐
│   Twilio      │  │  WhatsApp Bus.   │  │  SendGrid   │
│   (SMS)       │  │  API             │  │  (Email)    │
└───────────────┘  └──────────────────┘  └─────────────┘
```

## Application Architecture

### Frontend Applications

| Application | Framework | Port | Audience |
|------------|-----------|------|----------|
| pressing-web | React + Vite | 3025 | Laundry staff, branch managers |
| customer-web | React + Vite | 3035 | Customers (self-service) |
| customer-mobile | Expo + React Native | 8081 | Customers (mobile) |
| admin-web | React + Vite | 3085 | Platform administrators |

### Backend Architecture

| Layer | Technology | Purpose |
|-------|------------|---------|
| API Framework | NestJS 10 | HTTP API, modular architecture |
| ORM | TypeORM 0.3 | Database abstraction |
| Database | PostgreSQL 15 | Primary data store |
| Cache/Queue | Redis | Job queues, caching |
| Auth | JWT + Passport | Authentication/authorization |
| Validation | class-validator | Request validation |
| Documentation | Swagger/OpenAPI | API documentation |

## Data Flow

### Order Processing Flow

1. Customer places order via web/mobile or staff creates via pressing-web
2. API creates order record with `status = pending`
3. Garments received at branch → `status = received`
4. Staff tags garments → `status = tagged`
5. Garments processed through pipeline (wash → dry → press)
6. Quality check gate → pass (`ready`) or fail (`rewash`)
7. Customer notified when ready
8. Payment processed
9. Pickup or delivery executed
10. Order completed

### Payment Flow

1. Order total calculated by pricing engine
2. Customer selects payment method (MTN/Orange/Card/Cash)
3. Payment provider transaction initiated
4. Webhook confirmation received
5. Order payment status updated
6. Receipt generated and sent

## Tenancy Model

- **Tenant** = Laundry chain/brand (e.g., "CleanPress", "QuickWash")
- **Branch** = Physical location under a tenant
- **User** = Staff member or customer belonging to a tenant
- **Data Isolation** = Row-level security via tenant_id foreign keys

### Tenant Resolution

1. Subdomain: `<tenant>.pressing237.com`
2. JWT claim: `tenant_id` in token payload
3. Header: `X-Tenant-ID` for API requests

## Key Architectural Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Monorepo | pnpm + Turbo | Shared code, consistent tooling |
| API-first | NestJS | Type safety, modularity, Swagger |
| Database | PostgreSQL | Relational data, JSON support, PostGIS |
| Frontend | React + Vite | Performance, modern tooling |
| Mobile | Expo | Cross-platform, rapid development |
| Styling | Tailwind CSS | Utility-first, design system |
| Forms | RHF + Zod | Type-safe validation |
| Payments | Multiple providers | Local market requirements |

## Scalability Considerations

- Horizontal scaling via Docker/Kubernetes
- Database read replicas for reporting
- Redis caching for frequent queries
- CDN for static assets
- Async processing for notifications
- File storage via S3-compatible service

## Security Architecture

- JWT-based authentication
- Role-based access control (RBAC)
- Tenant isolation at database level
- API rate limiting
- Input validation on all endpoints
- Audit logging for state changes
- HTTPS everywhere

---

## Related Documents

- [01_UNIFIED_SYSTEM_ARCHITECTURE](./01_UNIFIED_SYSTEM_ARCHITECTURE.md)
- [MODULE_DEPENDENCY_MAP](./MODULE_DEPENDENCY_MAP.md)
- [20_NESTJS_MODULE_AND_TABLE_BLUEPRINT](../backend/20_NESTJS_MODULE_AND_TABLE_BLUEPRINT.md)
- [SECURITY_MODEL](../security/SECURITY_MODEL.md)
