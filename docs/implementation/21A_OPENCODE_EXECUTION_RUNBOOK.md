# 21A — OpenCode Execution Runbook

**Version:** 1.0.0  
**Status:** Active  
**Last Updated:** 2026-05-25  
**Related Modules:** All  
**Implementation Status:** In Progress  
**Dependencies:** All SRD and SPEC documents  

## 1. Purpose

This is the master execution playbook for building JanLunMS.

All other documents are constraints. This document is the engine.

---

## 2. Execution Philosophy

1. **Backend first** — API before UI
2. **Domain by domain** — Complete module, then move on
3. **Vertical slices** — Feature from DB → API → UI
4. **Test at every gate** — No untested code merged
5. **Stub liberally** — UI stubs prevent blocking
6. **Document as you go** — Keep docs in sync

---

## 3. Phase Structure

| Phase | Duration | Focus | Deliverable |
|-------|----------|-------|-------------|
| Phase 0 | Week 0 | Bootstrap | Monorepo, DB, CI/CD |
| Phase 1 | Weeks 1-2 | Foundation | Auth, Users, Tenants, Branches |
| Phase 2 | Weeks 3-4 | Core Orders | Customers, Services, Orders, Lots |
| Phase 3 | Weeks 5-6 | Processing | Garments, Inventory, QC |
| Phase 4 | Weeks 7-8 | Delivery | Routes, Vehicles, Drivers |
| Phase 5 | Weeks 9-10 | Payments | Payment integration, Wallet |
| Phase 6 | Weeks 11-12 | HR/Payroll | Employees, Shifts, Payroll |
| Phase 7 | Weeks 13-14 | Customer Web | Customer-facing UI |
| Phase 8 | Weeks 15-16 | Customer Mobile | Expo app |
| Phase 9 | Weeks 17-18 | Admin Dashboard | LaundryOS |
| Phase 10 | Weeks 19-20 | Polish | Reports, Analytics, Notifications |

---

## 4. Phase 0: Bootstrap

### Week 0 Tasks

**Day 1-2: Monorepo Setup**
```bash
# Create structure
mkdir -p apps/{api,pressing-web,customer-web,customer-mobile,admin-web}
mkdir -p packages/{shared-types,ui,utils}

# Initialize
pnpm init
# Add workspace config
# Add Turbo config
# Add .gitignore
# Add root package.json
```

**Day 3: Database Setup**
- Install PostgreSQL locally
- Configure Supabase Docker
- Create initial migration
- Test connection

**Day 4-5: API Skeleton**
```bash
cd apps/api
# NestJS setup
nest new . --strict
# Add TypeORM
# Add config module
# Add health check
# Add Swagger
```

**Day 5: CI/CD**
- GitHub Actions workflow
- Docker files
- Environment templates

### Gate 0 Criteria
- [ ] `pnpm install` works
- [ ] API starts with health check
- [ ] Database connects
- [ ] Swagger loads
- [ ] CI pipeline passes

---

## 5. Phase 1: Foundation (Auth, Users, Tenants, Branches)

### Week 1-2 Tasks

**Module 1: Reference Data**
```bash
# Create modules
nest g module reference
nest g service reference
nest g controller reference

# Tables
# - countries
# - cities
# - garment_types
# - fabric_types
# - care_labels
```

**Module 2: Auth**
```bash
nest g module auth
# JWT strategy
# Local strategy
# Guards
# Decorators
```

**Module 3: Users**
```bash
nest g module users
# user_profiles
# user_roles
# permissions
```

**Module 4: Tenants**
```bash
nest g module tenants
# tenants
# tenant_domains
# tenant_settings
```

**Module 5: Branches**
```bash
nest g module branches
# branches
# branch_hours
```

### Frontend Tasks
- pressing-web: Login page
- pressing-web: Basic layout (MainNav stub)
- shared-types: Export enums

### Gate 1 Criteria
- [ ] Can register/login
- [ ] Tenant created
- [ ] Branch created
- [ ] Auth guards work
- [ ] pressing-web login works

---

## 6. Phase 2: Core Orders (Customers, Services, Orders, Lots)

### Week 3-4 Tasks

**Module 6: Customers**
```bash
nest g module customers
# customer_profiles
# customer_addresses
# customer_loyalty
```

**Module 7: Services**
```bash
nest g module services
# service_types
# pricing_rules
# promotions
```

**Module 8: Orders**
```bash
nest g module orders
# orders
# order_items
# order_status_history
```

**Module 9: Lots**
```bash
nest g module lots
# lots
# lot_garments
```

### Frontend Tasks
- pressing-web: Orders page (list + detail)
- pressing-web: Order creation modal
- pressing-web: Customer page
- pressing-web: Service settings

### Gate 2 Criteria
- [ ] Can create customer
- [ ] Can create service
- [ ] Can create order
- [ ] Order status transitions work
- [ ] Pricing calculates correctly

---

## 7. Phase 3: Processing (Garments, Inventory, QC)

### Week 5-6 Tasks

**Module 10: Garments**
```bash
# Extend orders module
# Garment tracking
# QC workflow
# Rewash handling
```

**Module 11: Inventory**
```bash
nest g module inventory
# inventory_items
# inventory_transactions
# suppliers
```

**Module 12: QR Codes**
```bash
nest g module qr-codes
# qr_tags
# qr_scans
```

### Frontend Tasks
- pressing-web: Garments page
- pressing-web: QR scan interface
- pressing-web: QC modal
- pressing-web: Inventory page

### Gate 3 Criteria
- [ ] Can tag garments
- [ ] QR codes generate
- [ ] Status transitions via QR
- [ ] QC pass/fail works
- [ ] Inventory tracks stock

---

## 8. Phase 4: Delivery (Routes, Vehicles, Drivers)

### Week 7-8 Tasks

**Module 13: Delivery**
```bash
nest g module delivery
# delivery_routes
# delivery_stops
# vehicles
# driver_assignments
```

### Frontend Tasks
- pressing-web: Delivery page
- pressing-web: Route map
- pressing-web: Driver assignment
- Driver mobile view (basic)

### Gate 4 Criteria
- [ ] Routes created
- [ ] Stops scheduled
- [ ] Driver assigned
- [ ] Delivery status updates
- [ ] GPS tracking works

---

## 9. Phase 5: Payments

### Week 9-10 Tasks

**Module 14: Payments**
```bash
nest g module payments
# transactions
# payment_methods
# refunds
# wallet_balances
```

**Integrations**
- MTN MoMo sandbox
- Orange Money sandbox
- Card processing (Stripe/PayPal)

### Frontend Tasks
- pressing-web: Payment modal
- customer-web: Payment page
- pressing-web: Transactions report

### Gate 5 Criteria
- [ ] Payment initiates
- [ ] Webhook received
- [ ] Order status updates
- [ ] Receipt generated
- [ ] Refund works

---

## 10. Phase 6: HR/Payroll

### Week 11-12 Tasks

**Module 15: Employees**
```bash
# Extend existing
# shifts
# attendance
```

**Module 16: Payroll**
```bash
nest g module payroll
# payroll_periods
# payslips
# work_entries
# deductions
```

### Frontend Tasks
- pressing-web: Employees page
- pressing-web: Shift calendar
- pressing-web: Payroll page
- pressing-web: Payslip view

### Gate 6 Criteria
- [ ] Employee added
- [ ] Shift scheduled
- [ ] Attendance tracked
- [ ] Payroll calculated
- [ ] Payslip generated

---

## 11. Phase 7: Customer Web

### Week 13-14 Tasks

**Pages**
- Home/Services catalog
- Order flow (5 steps)
- Order tracking
- Account/Profile
- Payment

**API Integration**
- Service catalog endpoint
- Order creation endpoint
- Payment endpoint
- Customer profile endpoint

### Gate 7 Criteria
- [ ] Service catalog loads
- [ ] Order placed end-to-end
- [ ] Payment processed
- [ ] Tracking shows status
- [ ] Mobile responsive

---

## 12. Phase 8: Customer Mobile

### Week 15-16 Tasks

**Expo Setup**
- App structure
- Navigation
- API client
- Push notifications

**Screens**
- Home
- Order
- Track
- Account

### Gate 8 Criteria
- [ ] App builds
- [ ] Order placed
- [ ] Push received
- [ ] QR displayed
- [ ] GPS works

---

## 13. Phase 9: Admin Dashboard

### Week 17-18 Tasks

**Pages**
- Dashboard
- Tenants
- Users
- Analytics
- Billing
- System

### Gate 9 Criteria
- [ ] Tenant list loads
- [ ] Can create tenant
- [ ] Analytics show data
- [ ] Billing configured

---

## 14. Phase 10: Polish

### Week 19-20 Tasks

**Reports**
- Revenue
- Efficiency
- Customer analytics
- Employee productivity

**Notifications**
- SMS/WhatsApp/Email templates
- Trigger configuration
- Delivery monitoring

**Performance**
- API optimization
- Frontend bundle size
- Database indexing
- Caching

**Documentation**
- API docs complete
- User guides
- Admin guides

### Final Gate Criteria
- [ ] All tests pass > 95%
- [ ] Performance budget met
- [ ] Security scan clean
- [ ] Accessibility audit pass
- [ ] Documentation complete

---

## 15. Testing Strategy

### Unit Tests

| Layer | Tool | Coverage Target |
|-------|------|----------------|
| API services | Jest | 80% |
| Frontend components | Vitest | 70% |
| Utilities | Jest | 90% |

### Integration Tests

| Flow | Tool |
|------|------|
| Order creation | Supertest |
| Payment flow | Supertest + mocks |
| Auth flow | Supertest |

### E2E Tests

| Flow | Tool |
|------|------|
| pressing-web | Playwright |
| customer-web | Playwright |
| customer-mobile | Detox |

---

## 16. Code Quality Gates

Before any merge:

- [ ] TypeScript strict mode passes
- [ ] Lint passes (ESLint + Prettier)
- [ ] Tests pass
- [ ] No console errors
- [ ] No hardcoded secrets
- [ ] No French-only strings (use `useT()`)
- [ ] No `any` types without comment
- [ ] Swagger docs updated
- [ ] Migration file included

---

## 17. Deployment Gates

### Staging

- [ ] All tests pass
- [ ] Build succeeds
- [ ] Migrations run
- [ ] Smoke tests pass
- [ ] No Sentry errors (24h)

### Production

- [ ] Staging stable (48h)
- [ ] Database backup
- [ ] Rollback plan ready
- [ ] Monitoring active
- [ ] Team on standby

---

## 18. Emergency Procedures

### Production Incident

1. Detect (monitoring alert)
2. Assess (severity)
3. Communicate (team + users)
4. Mitigate (rollback or fix)
5. Resolve (verify)
6. Post-mortem (within 48h)

### Database Corruption

1. Stop writes
2. Assess extent
3. Restore from backup
4. Verify data integrity
5. Resume operations

---

## 19. Team Roles

| Role | Responsibility |
|------|----------------|
| Tech Lead | Architecture, code review, decisions |
| Backend Dev | API modules, database |
| Frontend Dev | pressing-web, customer-web |
| Mobile Dev | customer-mobile |
| DevOps | Infrastructure, CI/CD |
| QA | Testing, quality gates |
| Product | Requirements, prioritization |

---

## 20. Communication

| Channel | Purpose |
|---------|---------|
| Daily standup | Blockers, progress |
| Slack | Quick questions |
| GitHub Issues | Bugs, tasks |
| Pull Requests | Code review |
| Weekly demo | Stakeholder update |
| Retrospective | Process improvement |

---

## 21. Definition of Done

For every feature:

- [ ] Code written
- [ ] Tests written
- [ ] Tests passing
- [ ] Code reviewed
- [ ] Merged to main
- [ ] Deployed to staging
- [ ] QA verified
- [ ] Documented
- [ ] Deployed to production

---

## 22. Risk Register

| Risk | Impact | Mitigation |
|------|--------|------------|
| Payment provider delay | High | Start integration early, use mocks |
| Performance issues | Medium | Load testing, optimization phase |
| Mobile app rejection | Medium | Follow guidelines, early submission |
| Team turnover | Medium | Documentation, knowledge sharing |
| Scope creep | High | Strict backlog, sprint planning |

---

## 23. Success Metrics

| Metric | Target |
|--------|--------|
| Time to first order | < 2 weeks after launch |
| Order processing time | < 24h standard |
| Customer satisfaction | > 4.5/5 |
| System uptime | > 99.5% |
| API response time | < 200ms |
