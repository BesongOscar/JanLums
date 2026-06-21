# Implementation Plan

**Version:** 1.0.0  
**Status:** Active  
**Last Updated:** 2026-05-25  
**Related Modules:** All  
**Implementation Status:** In Progress  
**Dependencies:** 21A_OPENCODE_EXECUTION_RUNBOOK, MODULE_DEPENDENCY_MAP  

## 1. Purpose

Detailed implementation plan with module sequencing, dependency graph, milestone phases, and risk mitigation.

---

## 2. Module Sequencing

### Build Order

```
Phase 0: Foundation
├── Monorepo setup
├── Database configuration
├── CI/CD pipeline
└── Shared packages

Phase 1: Identity & Access
├── reference (countries, cities, garment_types)
├── auth (JWT, guards)
├── users (profiles, roles)
├── tenants (multi-tenancy)
└── branches (locations)

Phase 2: Core Domain
├── customers (profiles, addresses, loyalty)
├── services (types, pricing rules)
├── orders (creation, status workflow)
└── lots (batch grouping)

Phase 3: Processing
├── garments (tracking, QC)
├── inventory (stock, suppliers)
└── qr-codes (tags, scans)

Phase 4: Operations
├── delivery (routes, vehicles, drivers)
├── payments (MTN/Orange/Card)
└── notifications (SMS/WhatsApp/Email)

Phase 5: HR & Finance
├── employees (profiles, shifts)
├── payroll (periods, payslips)
└── reports (analytics, exports)

Phase 6: Customer Experience
├── customer-web (ordering, tracking)
├── customer-mobile (Expo app)
└── admin-web (LaundryOS)
```

---

## 3. Dependency Graph

```
Config, Database, Health (Foundation)
    ↓
Reference, Auth, Users (Identity)
    ↓
Tenants, Branches (Organization)
    ↓
Customers, Services, Employees (Business)
    ↓
Orders, Lots, Garments (Core Operations)
    ↓
Inventory, Delivery, Payments (Support)
    ↓
Payroll, Notifications, Reports (Reporting)
    ↓
Customer Web, Mobile, Admin (Frontend)
```

---

## 4. Milestone Phases

### Milestone 1: Foundation (Week 0)
**Goal:** Working development environment

| Task | Owner | Duration | Dependencies |
|------|-------|----------|--------------|
| Monorepo scaffolding | DevOps | 2 days | None |
| PostgreSQL + Supabase setup | Backend | 1 day | None |
| NestJS API skeleton | Backend | 2 days | Database |
| React app skeletons | Frontend | 1 day | None |
| CI/CD pipeline | DevOps | 1 day | Monorepo |

**Deliverable:** All apps start, database connects, CI passes

### Milestone 2: Auth & Tenancy (Weeks 1-2)
**Goal:** Secure, multi-tenant system

| Task | Owner | Duration | Dependencies |
|------|-------|----------|--------------|
| Reference data module | Backend | 2 days | Database |
| JWT auth implementation | Backend | 2 days | None |
| User management | Backend | 2 days | Auth |
| Tenant isolation | Backend | 2 days | Users |
| Branch management | Backend | 2 days | Tenants |
| Login page | Frontend | 2 days | Auth API |

**Deliverable:** Users can register, login, create tenants/branches

### Milestone 3: Core Business (Weeks 3-4)
**Goal:** Order creation and tracking

| Task | Owner | Duration | Dependencies |
|------|-------|----------|--------------|
| Customer module | Backend | 3 days | Tenants |
| Service catalog | Backend | 2 days | Reference |
| Pricing engine | Backend | 3 days | Services |
| Order module | Backend | 4 days | Customers, Services |
| Lot management | Backend | 2 days | Orders |
| Orders UI | Frontend | 4 days | Order API |

**Deliverable:** Orders can be created, priced, tracked

### Milestone 4: Processing Pipeline (Weeks 5-6)
**Goal:** Garment lifecycle management

| Task | Owner | Duration | Dependencies |
|------|-------|----------|--------------|
| Garment tracking | Backend | 3 days | Orders |
| QC workflow | Backend | 2 days | Garments |
| QR code generation | Backend | 2 days | Garments |
| Inventory module | Backend | 3 days | Branches |
| Processing UI | Frontend | 4 days | Garment API |
| QR scanner | Frontend | 2 days | QR API |

**Deliverable:** Garments flow through processing pipeline

### Milestone 5: Operations (Weeks 7-8)
**Goal:** Delivery and payments

| Task | Owner | Duration | Dependencies |
|------|-------|----------|--------------|
| Delivery routes | Backend | 3 days | Branches |
| Vehicle management | Backend | 2 days | Delivery |
| Payment integration | Backend | 4 days | Orders |
| Notification system | Backend | 3 days | Orders |
| Delivery UI | Frontend | 3 days | Delivery API |
| Payment UI | Frontend | 2 days | Payment API |

**Deliverable:** Delivery scheduled, payments processed

### Milestone 6: HR & Reporting (Weeks 9-10)
**Goal:** Staff management and analytics

| Task | Owner | Duration | Dependencies |
|------|-------|----------|--------------|
| Employee shifts | Backend | 3 days | Employees |
| Payroll calculation | Backend | 3 days | Shifts |
| Reports engine | Backend | 3 days | All modules |
| Payroll UI | Frontend | 3 days | Payroll API |
| Reports UI | Frontend | 3 days | Reports API |

**Deliverable:** Payroll generated, reports available

### Milestone 7: Customer Experience (Weeks 11-14)
**Goal:** Self-service customer apps

| Task | Owner | Duration | Dependencies |
|------|-------|----------|--------------|
| Customer web catalog | Frontend | 3 days | Service API |
| Customer order flow | Frontend | 4 days | Order API |
| Customer tracking | Frontend | 2 days | Order API |
| Mobile app setup | Mobile | 2 days | None |
| Mobile screens | Mobile | 5 days | Customer APIs |
| Admin dashboard | Frontend | 4 days | Admin APIs |

**Deliverable:** Customers can order via web/mobile

---

## 5. Weekly Breakdown

| Week | Focus | Key Tasks |
|------|-------|-----------|
| 0 | Bootstrap | Monorepo, DB, CI/CD |
| 1 | Identity | Auth, Users, Tenants |
| 2 | Organization | Branches, Reference data |
| 3 | Customers | Customer module, addresses |
| 4 | Services | Service catalog, pricing |
| 5 | Orders | Order creation, status |
| 6 | Lots/Garments | Batch tracking, QR codes |
| 7 | Processing | Wash/dry/press pipeline |
| 8 | QC | Quality control workflow |
| 9 | Delivery | Routes, vehicles, drivers |
| 10 | Payments | MTN/Orange/Card integration |
| 11 | Employees | Staff management, shifts |
| 12 | Payroll | Payroll calculation |
| 13 | Reports | Analytics, exports |
| 14 | Customer Web | Self-service portal |
| 15 | Mobile | Expo app development |
| 16 | Mobile | Push notifications, QR |
| 17 | Admin | LaundryOS dashboard |
| 18 | Polish | Performance, security |
| 19 | Testing | E2E, load testing |
| 20 | Launch | Production deployment |

---

## 6. Implementation Priorities

### P0 — Critical (Must Have for MVP)
- Authentication & authorization
- Tenant isolation
- Order creation & tracking
- Payment processing
- Basic reporting

### P1 — High Priority (MVP+)
- Customer self-service web
- QR code tracking
- Delivery scheduling
- SMS notifications
- Mobile app

### P2 — Medium Priority (Post-MVP)
- Payroll system
- Advanced analytics
- Inventory management
- Loyalty program
- Multi-language support

### P3 — Low Priority (Future)
- AI recommendations
- Predictive maintenance
- Advanced routing
- White-label customization

---

## 7. Risk Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Payment provider delays | High | Medium | Start with sandbox, use mocks |
| Performance issues | Medium | Low | Load test in Phase 8 |
| Mobile app rejection | Medium | Low | Early submission to stores |
| Database scaling | Medium | Low | Read replicas, caching |
| Third-party outages | High | Low | Fallback providers |
| Security vulnerabilities | High | Low | Security audit in Phase 9 |

---

## 8. Rollout Strategy

### Staged Rollout

| Stage | Audience | Duration | Criteria |
|-------|----------|----------|----------|
| Alpha | Internal team | 2 weeks | All P0 complete |
| Beta | Select customers | 2 weeks | No critical bugs |
| GA | All customers | 1 week | > 95% satisfaction |

### Feature Flags

Use feature flags for gradual rollout:
- `enable_payments`
- `enable_delivery`
- `enable_loyalty`
- `enable_express_service`

---

## 9. Parallelization Strategy

### Parallel Workstreams

```
Backend Team:     ████████████████████████████████████████
Frontend Team:         ████████████████████████████████████
Mobile Team:                    ████████████████████████████
DevOps Team:      ████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
QA Team:               ░░████████████░░░░░░████████████░░
```

### Team Allocation

| Phase | Backend | Frontend | Mobile | DevOps | QA |
|-------|---------|----------|--------|--------|-----|
| 0 | 1 | 1 | 0 | 1 | 0 |
| 1-2 | 2 | 1 | 0 | 1 | 0 |
| 3-6 | 2 | 2 | 1 | 0 | 1 |
| 7-10 | 1 | 2 | 2 | 0 | 1 |
| 11-14 | 1 | 1 | 1 | 1 | 1 |
| 15-20 | 1 | 1 | 1 | 1 | 2 |

---

## 10. Quality Gates

### Per Phase

- [ ] All tests passing
- [ ] Code coverage > 80%
- [ ] Security scan clean
- [ ] Performance benchmarks met
- [ ] Documentation updated

### Per Milestone

- [ ] Feature complete
- [ ] QA sign-off
- [ ] Stakeholder demo
- [ ] Deployment to staging
- [ ] No critical bugs
