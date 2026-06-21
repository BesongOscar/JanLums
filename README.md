# JanLunMS - Jan Laundry Management System

A production-grade, multi-tenant SaaS laundry management platform built with modern technologies.

## Architecture

- **Backend**: NestJS + TypeORM + PostgreSQL
- **Frontend**: React + Vite + Tailwind CSS
- **State Management**: Zustand + React Query
- **Monorepo**: pnpm workspaces + Turbo
- **Authentication**: JWT + Passport

## Apps

| App | Port | Description |
|-----|------|-------------|
| `api` | 3015 | NestJS Backend API |
| `pressing-web` | 3025 | Counter staff operations interface |
| `customer-web` | 3035 | Customer self-service portal |
| `admin-web` | 3085 | Platform admin dashboard |

## Quick Start

### Prerequisites
- Node.js >= 20.0.0
- pnpm >= 8.15.0
- PostgreSQL >= 15

### Installation

```bash
# Install dependencies
pnpm install

# Setup environment
cp apps/api/.env.example apps/api/.env
# Edit apps/api/.env with your database credentials

# Run database migrations
pnpm db:migrate

# Seed demo data
pnpm db:seed

# Start all apps in development mode
pnpm dev
```

### Individual Apps

```bash
# Backend API only
pnpm --filter @janlums/api dev

# Pressing web only
pnpm --filter @janlums/pressing-web dev

# Customer web only
pnpm --filter @janlums/customer-web dev

# Admin web only
pnpm --filter @janlums/admin-web dev
```

## Database

### Migrations
```bash
# Create new migration
cd apps/api && pnpm migration:create src/database/migrations/MigrationName

# Generate migration from entities
cd apps/api && pnpm migration:generate src/database/migrations/MigrationName

# Run migrations
pnpm db:migrate

# Revert last migration
cd apps/api && pnpm migration:revert
```

### Seed Data
```bash
# Run seeds
pnpm db:seed
```

## Project Structure

```
janlums/
├── apps/
│   ├── api/                 # NestJS backend
│   │   ├── src/
│   │   │   ├── modules/     # Feature modules
│   │   │   ├── database/    # Migrations & seeds
│   │   │   └── main.ts      # Entry point
│   ├── pressing-web/        # Staff operations UI
│   ├── customer-web/        # Customer portal
│   └── admin-web/           # Admin dashboard
├── packages/
│   ├── shared-types/        # Shared TypeScript types
│   └── utils/               # Shared utilities
└── docs/                    # Documentation
```

## Backend Modules

- **Auth**: JWT authentication & authorization
- **Users**: User management with roles
- **Tenants**: Multi-tenant support
- **Branches**: Branch/locations management
- **Customers**: Customer database
- **Orders**: Order management & tracking
- **Services**: Laundry service catalog & pricing

## Features Implemented

### Phase 0: Foundation
- [x] Monorepo setup with pnpm + Turbo
- [x] NestJS API with TypeORM
- [x] PostgreSQL database with migrations
- [x] JWT authentication
- [x] Multi-tenant architecture
- [x] React frontend apps (3 apps)
- [x] Tailwind CSS styling
- [x] React Query data fetching
- [x] Demo data seeding

### Phase 1: Core Operations (In Progress)
- [x] Order creation & management
- [x] Customer management
- [x] Service catalog
- [ ] QR code tracking
- [ ] Inventory management
- [ ] Payment integration
- [ ] Notifications (SMS/Email)

## Default Credentials

After seeding, you can login with:
- **Admin**: admin@pressing237.com / admin123
- **Counter Staff**: counter@pressing237.com / counter123

## Documentation

See the `docs/` directory for comprehensive documentation including:
- Architecture overview
- Implementation plan
- API standards
- Feature playbooks
- Testing strategy

## License

Proprietary - Pressing 237
