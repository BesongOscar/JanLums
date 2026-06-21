# 02 — Monorepo Structure

**Version:** 1.0.0  
**Status:** Active  
**Last Updated:** 2026-05-25  
**Related Modules:** All  
**Implementation Status:** In Progress  
**Dependencies:** 01_UNIFIED_SYSTEM_ARCHITECTURE  

## 1. Purpose

This document defines the approved JanLunMS monorepo layout.

---

## 2. Approved Folder Structure

```text
apps/
  pressing-web/
  customer-web/
  customer-mobile/
  admin-web/
  api/

packages/
  shared-types/
  ui/
  utils/
```

---

## 3. Apps

### `apps/pressing-web`

Custom React web application for laundry/branch operations under the pressing237 brand.

### `apps/customer-web`

React web application for customer-facing pressing237 workflows.

### `apps/customer-mobile`

React Native / Expo customer mobile app.

### `apps/admin-web`

React web application for LaundryOS platform administration.

### `apps/api`

NestJS API backend. Owns business logic and all database access.

---

## 4. Packages

### `packages/shared-types`

Frontend-safe API contracts and common TypeScript interfaces.

Do not dump raw database entities blindly here.

### `packages/ui`

Shared UI primitives if needed later.

### `packages/utils`

Shared utility functions.

---

## 5. Package Manager

Use:
- `pnpm`
- workspace root install
- Turbo where useful

Do not use `npm install` inside individual apps unless explicitly instructed.

---

## 6. Important Windows/Local Development Note

Avoid heavy dependency installs in temporary worktrees when possible. Prefer the stable main repo folder for local development.

Recommended working folder:
```text
D:\Projects\janlums
```

Avoid duplicating full `node_modules` inside many `.claude/worktrees` when working on Windows/external drives.
