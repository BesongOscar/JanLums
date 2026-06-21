# 03 — Tech Architecture

**Version:** 1.0.0  
**Status:** Active  
**Last Updated:** 2026-05-25  
**Related Modules:** All  
**Implementation Status:** In Progress  
**Dependencies:** 01_UNIFIED_SYSTEM_ARCHITECTURE, 02_MONOREPO_STRUCTURE  

## 1. Approved Stack

| Layer | Technology |
|---|---|
| Customer Web | React + Vite |
| Pressing Web | React + Vite |
| Admin Web | React + Vite |
| Customer Mobile | React Native / Expo |
| Backend API | NestJS |
| Database | Supabase/Postgres |
| ORM | TypeORM |
| Web forms | React Hook Form + Zod |
| Web styling | Tailwind CSS for general UI; scoped CSS allowed for complex builders |
| Package manager | pnpm |
| Runtime | Node.js |

---

## 2. Backend Principles

- NestJS module-per-domain design
- TypeORM entities and migrations
- `synchronize: false`
- service-layer business logic
- provider adapters for external systems
- API boundary validation

---

## 3. Frontend Principles

- API-driven frontends
- no business-table direct access from frontend
- shared contracts via `packages/shared-types`
- React Hook Form + Zod for complex forms
- Tailwind for normal page layout once frontend lock is fully applied
- scoped CSS permitted for garment tag builders or specialized grid components

---

## 4. Mobile Principles

The customer mobile app remains:
- React Native
- Expo
- expo-router
- API-driven

Do not migrate it to Ionic.

---

## 5. Styling Decision

For web:
- Tailwind CSS is approved as the standard styling system.
- Existing fragile inline styles should be phased out.
- Specialized components such as garment tag designers may retain scoped CSS.

For mobile:
- Tailwind is not required.
- Use React Native styling/design system already present in the Expo app.

---

## 6. Form Decision

Use:
- React Hook Form
- Zod
- `@hookform/resolvers`

First reference form:
- `AddOrderModal`

---

## 7. Auth Direction

Current development may use mock auth temporarily, but the final direction is:
- Supabase Auth or JWT-backed auth layer
- API guards
- RBAC
- tenant-aware authorization

Production auth is not part of STEP 24.5 and should be handled later.
