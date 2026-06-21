# Architecture Decision Records (ADR)

**Version:** 1.0.0  
**Status:** Active  
**Last Updated:** 2026-05-25  
**Related Modules:** All  
**Implementation Status:** In Progress  

---

## ADR-001: Monorepo Structure

**Date:** 2026-05-25  
**Status:** Approved  

### Context
Need to organize multiple applications (API, web, mobile) with shared code.

### Decision
Use pnpm workspaces with Turbo for build orchestration.

### Rationale
- Shared packages (types, utils, UI)
- Consistent tooling
- Faster builds with caching
- Atomic changes across apps

### Alternatives Considered
- Separate repos: Hard to coordinate changes
- npm workspaces: Slower than pnpm
- Lerna: Deprecated, replaced by Nx/Turbo

### Consequences
- Learning curve for pnpm
- Need Turbo configuration
- CI/CD complexity

---

## ADR-002: Backend Framework

**Date:** 2026-05-25  
**Status:** Approved  

### Context
Need robust, scalable API framework for laundry management system.

### Decision
Use NestJS with TypeScript.

### Rationale
- Modular architecture
- Built-in DI container
- TypeORM integration
- Swagger generation
- Enterprise-grade

### Alternatives Considered
- Express: Too minimal, no structure
- Fastify: Fast but less ecosystem
- Django: Python, not TypeScript

### Consequences
- Learning curve for NestJS
- More boilerplate than Express
- Strong typing throughout

---

## ADR-003: Database

**Date:** 2026-05-25  
**Status:** Approved  

### Context
Need reliable database for transactional data with JSON support.

### Decision
Use PostgreSQL with TypeORM.

### Rationale
- ACID compliance
- JSONB for flexible data
- PostGIS for geospatial
- Mature tooling
- Multi-tenant row-level security

### Alternatives Considered
- MySQL: Less JSON support
- MongoDB: Not ACID for transactions
- SQLite: Not production-scale

### Consequences
- Need DBA expertise
- Migration management required
- Scaling considerations

---

## ADR-004: Frontend Framework

**Date:** 2026-05-25  
**Status:** Approved  

### Context
Need modern, performant frontend for operational and customer apps.

### Decision
Use React with Vite and Tailwind CSS.

### Rationale
- Component-based
- Vite for fast dev/build
- Tailwind for rapid styling
- Large ecosystem
- React Native for mobile

### Alternatives Considered
- Vue: Good but smaller ecosystem
- Angular: Too opinionated
- Svelte: Less mature

### Consequences
- JSX learning curve
- Tailwind utility classes
- State management decisions

---

## ADR-005: Authentication

**Date:** 2026-05-25  
**Status:** Approved  

### Context
Need secure, scalable authentication for multi-tenant system.

### Decision
Use JWT with Passport.js.

### Rationale
- Stateless
- Cross-domain compatible
- NestJS integration
- Token expiration control

### Alternatives Considered
- Session-based: Stateful, harder to scale
- OAuth only: Not suitable for internal users
- Supabase Auth: Vendor lock-in

### Consequences
- Token management complexity
- Need refresh token strategy
- Secure storage on client

---

## ADR-006: Payment Providers

**Date:** 2026-05-25  
**Status:** Approved  

### Context
Need to support local payment methods in Cameroon.

### Decision
Support MTN MoMo, Orange Money, and cards (Stripe).

### Rationale
- MTN and Orange dominate mobile money
- Cards for international customers
- Multiple providers for redundancy

### Alternatives Considered
- Single provider: Risk of outage
- Crypto: Not mainstream
- Bank transfer: Slow, manual

### Consequences
- Multiple integrations
- Different fee structures
- Reconciliation complexity

---

## ADR-007: Multi-Tenancy

**Date:** 2026-05-25  
**Status:** Approved  

### Context
Need to support multiple laundry chains on single platform.

### Decision
Use shared database with tenant_id column isolation.

### Rationale
- Cost effective
- Easier maintenance
- Centralized backups
- Row-level security

### Alternatives Considered
- Separate database per tenant: Expensive
- Separate schema per tenant: Complex migrations
- Cosmos DB: Vendor lock-in

### Consequences
- Need tenant-aware queries
- Risk of data leakage if bug
- Scaling limitations

---

## ADR-008: Mobile Framework

**Date:** 2026-05-25  
**Status:** Approved  

### Context
Need cross-platform mobile app for customers.

### Decision
Use Expo with React Native.

### Rationale
- Cross-platform (iOS/Android)
- Hot reload
- Over-the-air updates
- Large ecosystem

### Alternatives Considered
- Flutter: Dart learning curve
- Native: Double development effort
- Ionic: Webview, less native feel

### Consequences
- Bridge performance issues
- Native module complexity
- App store approval process

---

## ADR-009: Notifications

**Date:** 2026-05-25  
**Status:** Approved  

### Context
Need multi-channel notifications (SMS, WhatsApp, Email, Push).

### Decision
Use provider adapters with unified interface.

### Rationale
- Swap providers without code changes
- Fallback between channels
- Template management
- Analytics

### Alternatives Considered
- Single provider: Risk of outage
- Direct integration: Tight coupling

### Consequences
- Adapter maintenance
- Provider API differences
- Cost optimization needed

---

## ADR-010: State Management

**Date:** 2026-05-25  
**Status:** Approved  

### Context
Need state management for React frontend.

### Decision
Use React Context for global state, React Query for server state.

### Rationale
- Built-in, no extra dependency
- Sufficient for current needs
- React Query for caching
- Can migrate to Redux later

### Alternatives Considered
- Redux: Overkill for current needs
- Zustand: Good but not needed
- Recoil: Experimental

### Consequences
- Context re-renders
- Limited debugging tools
- May need migration later
