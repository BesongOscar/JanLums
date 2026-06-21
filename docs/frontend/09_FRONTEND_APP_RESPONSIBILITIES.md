# 09 — Frontend App Responsibilities

**Version:** 1.0.0  
**Status:** Active  
**Last Updated:** 2026-05-25  
**Related Modules:** All frontend apps  
**Implementation Status:** In Progress  
**Dependencies:** 03_TECH_ARCHITECTURE, 10_UI_UX_DESIGN_SYSTEM_GUIDE  

## 1. Purpose

This document defines what each frontend application owns and where domain boundaries lie.

---

## 2. App Overview

| App | Brand | Audience | Port |
|---|---|---|---|
| `apps/pressing-web` | pressing237 | Laundry staff, branch managers, drivers | 3025 |
| `apps/customer-web` | pressing237 | Customers placing orders | 3035 |
| `apps/customer-mobile` | pressing237 | Customers on mobile | Expo |
| `apps/admin-web` | LaundryOS | Platform administrators | 3085 |

---

## 3. pressing-web — Operational Portal

### Domain Ownership

| Domain | Pages | Description |
|---|---|---|
| Dashboard | `/dashboard` | KPI cards, charts, activity feed |
| Orders | `/orders` | Order intake, processing pipeline, status management |
| Lots | `/lots` | Batch grouping, rack location, lot tracking |
| Garments | `/garments` | Individual garment tracking, QC, rewash handling |
| Customers | `/customers` | Customer profiles, order history, loyalty |
| Delivery | `/delivery` | Routes, drivers, stops, pickup/delivery tracking |
| Employees | `/employees` | Staff records, shifts, roles |
| Payroll | `/payroll` | Periods, work entries, payslips, reports |
| Inventory | `/inventory` | Stock levels, transactions, suppliers |
| Reports | `/reports` | Revenue, efficiency, customer analytics |
| Settings | `/settings/*` | Reference data, configuration, promotions |
| Website | `/website` | Public-facing content management |

### Key Responsibilities
- Order intake and garment tagging
- Processing pipeline state transitions
- Quality control checkpoints
- Delivery route management
- Employee shift scheduling
- Payroll data entry and review

---

## 4. customer-web — Customer Self-Service

### Domain Ownership

| Domain | Pages | Description |
|---|---|---|
| Home | `/` | Service catalog, hero, pricing |
| Services | `/services` | Browse service types and pricing |
| Order | `/order` | Place new order (walk-in or pickup) |
| Track | `/track` | Track order/garment status by number |
| Account | `/account` | Profile, addresses, order history |
| Payment | `/payment` | Pay outstanding orders |
| Contact | `/contact` | Branch locator, contact form |

### Key Responsibilities
- Service catalog browsing
- Order placement with address selection
- Real-time order tracking
- Online payment
- Customer profile management

---

## 5. customer-mobile — Mobile App

### Domain Ownership

| Domain | Screens | Description |
|---|---|---|
| Home | `(tabs)/index` | Service catalog, quick actions |
| Order | `(tabs)/order` | Place order, schedule pickup |
| Track | `(tabs)/track` | Order status, QR pickup code |
| Account | `(tabs)/account` | Profile, addresses, history |
| Notifications | `(tabs)/notifications` | Order updates, promotions |

### Key Responsibilities
- Same as customer-web but mobile-optimized
- Push notifications for order status
- QR code display for pickup verification
- GPS address selection for pickup/delivery
- Camera for garment photo upload

---

## 6. admin-web — Platform Administration

### Domain Ownership

| Domain | Pages | Description |
|---|---|---|
| Tenants | `/tenants` | Tenant management, subscription |
| Analytics | `/analytics` | Platform-wide KPIs |
| Users | `/users` | Platform user management |
| System | `/system` | Global settings, integrations |
| Billing | `/billing` | Subscription billing, invoices |

### Key Responsibilities
- Tenant onboarding and management
- Platform-wide analytics
- System configuration
- User administration across tenants

---

## 7. Shared Component Rules

### What lives in `packages/ui`
- Button, Input, Select primitives
- Modal, Card, Table base components
- Icon set
- Theme tokens

### What lives in app-specific `components/`
- PageTemplate (pressing-web)
- TableCard with filter band (pressing-web)
- StepModal (pressing-web)
- OrderTimeline (customer-web)
- QRDisplay (customer-mobile)

### What NEVER lives in shared packages
- Business logic
- API calls
- Domain-specific forms
- Tenant-specific styling

---

## 8. API Consumption Rules

1. All apps consume the same NestJS API
2. Each app has its own `src/api/` folder with service functions
3. Use `packages/shared-types` for API contract types
4. No direct database access from any frontend
5. Auth token managed per-app (context or Redux)
