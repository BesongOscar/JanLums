# Implementation Roadmap

**Version:** 1.0.0  
**Status:** Active  
**Last Updated:** 2026-05-25  
**Related Modules:** All  
**Implementation Status:** In Progress  

---

## Roadmap Overview

20-week implementation plan with 6 major phases.

```
Week:  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16 17 18 19 20
       |--Phase 0--||----Phase 1----||----Phase 2----||----Phase 3----|
                                              |----Phase 4----||---Phase 5---|
       Foundation    Identity & Access        Core Domain      Operations
                                                             Financials
```

## Phase 0: Foundation (Weeks 1-2)

**Goal:** Working development environment with CI/CD

| Week | Tasks | Deliverables |
|------|-------|-------------|
| 1 | Monorepo setup, workspace config, shared packages | `pnpm install` works, build succeeds |
| 1 | Database setup, Docker, Supabase local | PostgreSQL running, migrations work |
| 2 | API skeleton, health check, Swagger | API responds, docs accessible |
| 2 | CI/CD pipeline, linting, formatting | GitHub Actions passing |
| 2 | pressing-web skeleton, routing, layout | pressing-web loads, nav visible |

**Gate 0 Criteria:**
- [ ] All builds pass
- [ ] Database connects
- [ ] API health check passes
- [ ] pressing-web renders
- [ ] CI pipeline green

## Phase 1: Identity & Access (Weeks 3-4)

**Goal:** Authentication, authorization, multi-tenancy

| Week | Tasks | Deliverables |
|------|-------|-------------|
| 3 | Reference data module (countries, cities, garment types) | Seed data loaded |
| 3 | Auth module (JWT, guards, decorators) | Login/logout works |
| 3 | Users module (profiles, roles) | User CRUD works |
| 4 | Tenants module (multi-tenancy) | Tenant isolation works |
| 4 | Branches module | Branch CRUD works |
| 4 | pressing-web: Login page, auth context | Can log in/out |

**Modules:** reference, auth, users, tenants, branches

**Gate 1 Criteria:**
- [ ] Can register/login
- [ ] Tenant created and isolated
- [ ] Branch created
- [ ] Auth guards protect routes
- [ ] pressing-web login works

## Phase 2: Core Domain (Weeks 5-6)

**Goal:** Customers, services, orders, garment tracking

| Week | Tasks | Deliverables |
|------|-------|-------------|
| 5 | Customers module | Customer CRUD works |
| 5 | Services module (types, pricing rules) | Service catalog loaded |
| 5 | Orders module (creation, status) | Order CRUD works |
| 6 | Lots module (batch grouping) | Lot creation works |
| 6 | Garment tracking (items, QR generation) | Garments tracked |
| 6 | pressing-web: Orders page, customer page | UI functional |

**Modules:** customers, services, orders, lots, qr-codes

**Gate 2 Criteria:**
- [ ] Customer created
- [ ] Service catalog configured
- [ ] Order placed end-to-end
- [ ] Garments tagged with QR
- [ ] Pricing calculates correctly

## Phase 3: Operations (Weeks 7-10)

**Goal:** Processing pipeline, QC, delivery, inventory

| Week | Tasks | Deliverables |
|------|-------|-------------|
| 7 | Order status workflow (wash, dry, press) | Status transitions work |
| 7 | Quality control module | QC pass/fail works |
| 8 | Inventory module (stock, suppliers) | Stock tracked |
| 8 | Delivery module (routes, vehicles) | Routes created |
| 9 | Driver assignments, stops | Deliveries scheduled |
| 9 | pressing-web: Processing pipeline UI | Staff can process orders |
| 10 | Reports foundation | Basic reports work |
| 10 | pressing-web: Delivery page | Delivery UI functional |

**Modules:** inventory, delivery

**Gate 3 Criteria:**
- [ ] Order flows through processing pipeline
- [ ] QC gate works
- [ ] Rewash handled
- [ ] Delivery route created
- [ ] Inventory updated

## Phase 4: Financials (Weeks 11-14)

**Goal:** Payments, payroll, invoicing

| Week | Tasks | Deliverables |
|------|-------|-------------|
| 11 | Payments module (MTN/Orange/Card) | Payment processing works |
| 11 | Transaction tracking | Transactions recorded |
| 12 | Payroll module (periods, payslips) | Payroll calculated |
| 12 | Employee timesheets | Time tracking works |
| 13 | pressing-web: Payment modal, payroll page | UI functional |
| 13 | customer-web: Service catalog, order flow | Customer web works |
| 14 | customer-web: Payment, tracking | End-to-end customer flow |
| 14 | Notifications (SMS/WhatsApp/Email) | Notifications sent |

**Modules:** payments, payroll, notifications

**Gate 4 Criteria:**
- [ ] Payment processed end-to-end
- [ ] Payroll generated
- [ ] Payslip created
- [ ] Notification delivered
- [ ] Customer web order works

## Phase 5: Scale & Polish (Weeks 15-20)

**Goal:** Mobile app, admin dashboard, analytics, performance

| Week | Tasks | Deliverables |
|------|-------|-------------|
| 15 | customer-mobile: Expo setup, screens | Mobile app builds |
| 15 | customer-mobile: Order flow | Can place order |
| 16 | customer-mobile: QR pickup, push notifications | QR works |
| 16 | admin-web: Tenant management | Admin dashboard works |
| 17 | Reports and analytics | Dashboards populated |
| 17 | Performance optimization | Load times < 200ms |
| 18 | Security hardening | Pen test passed |
| 18 | Documentation finalization | All docs current |
| 19 | Staging deployment | Staging live |
| 20 | Production deployment | Go live |

**Modules:** Reports, Analytics, Admin

**Final Gate Criteria:**
- [ ] Mobile app on stores
- [ ] Admin dashboard functional
- [ ] Analytics accurate
- [ ] Performance targets met
- [ ] Security audit passed
- [ ] Documentation complete

## Parallel Development Strategy

```
Backend Dev:  ████████████████████████████████████████
Frontend Dev:        ██████████████████████████████████
Mobile Dev:                    ████████████████████████
DevOps:       ████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
QA:                 ░░████████████░░░░░░████████████░░
```

## Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| Payment provider delay | Start integration in Week 11 with mocks |
| Performance issues | Optimize in Phase 5, load test early |
| Mobile rejection | Submit to stores in Week 16 for review |
| Scope creep | Strict sprint planning, weekly demos |

## Success Metrics

| Metric | Target | Phase |
|--------|--------|-------|
| API response time | < 200ms | Phase 5 |
| Build time | < 5 min | Phase 0 |
| Test coverage | > 80% | Phase 5 |
| Order processing | < 24h | Phase 3 |
| System uptime | > 99.5% | Phase 5 |

---

## Related Documents

- [IMPLEMENTATION_PLAN](./IMPLEMENTATION_PLAN.md) - Detailed task breakdown
- [BUILD_RUNBOOK](./BUILD_RUNBOOK.md) - Development commands
- [21A_OPENCODE_EXECUTION_RUNBOOK](./21A_OPENCODE_EXECUTION_RUNBOOK.md) - Execution details
