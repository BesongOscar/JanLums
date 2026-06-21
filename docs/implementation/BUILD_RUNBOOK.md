# Build Runbook

**Version:** 1.0.0  
**Status:** Active  
**Last Updated:** 2026-05-25  
**Related Modules:** All  
**Implementation Status:** In Progress  
**Dependencies:** IMPLEMENTATION_PLAN, 21A_OPENCODE_EXECUTION_RUNBOOK  

## 1. Purpose

Executable commands and scripts for scaffolding, building, and deploying JanLunMS.

---

## 2. Repository Initialization

### Create Monorepo

```bash
# Create project directory
mkdir janlums
cd janlums

# Initialize pnpm workspace
pnpm init

# Create workspace file
cat > pnpm-workspace.yaml << 'EOF'
packages:
  - 'apps/*'
  - 'packages/*'
EOF

# Create root package.json
cat > package.json << 'EOF'
{
  "name": "janlums",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint"
  },
  "devDependencies": {
    "turbo": "^2.0.0",
    "typescript": "^5.4.5"
  }
}
EOF

# Create directories
mkdir -p apps/{api,pressing-web,customer-web,customer-mobile,admin-web}
mkdir -p packages/{shared-types,ui,utils}
```

### Initialize Turbo

```bash
cat > turbo.json << 'EOF'
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "test": {
      "dependsOn": ["build"]
    },
    "lint": {}
  }
}
EOF
```

---

## 3. Backend Scaffolding

### Initialize NestJS API

```bash
cd apps/api

# Initialize NestJS
nest new . --strict --package-manager pnpm

# Install dependencies
pnpm add @nestjs/config @nestjs/typeorm typeorm pg
pnpm add @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt
pnpm add class-validator class-transformer
pnpm add @nestjs/swagger swagger-ui-express

# Install dev dependencies
pnpm add -D @types/bcrypt @types/passport-jwt

# Create module structure
nest g module database
nest g module auth
nest g module users
nest g module tenants
nest g module branches
nest g module customers
nest g module services
nest g module orders
nest g module lots
nest g module inventory
nest g module delivery
nest g module payments
nest g module notifications
nest g module employees
nest g module payroll
nest g module reports
nest g module qr-codes
```

### Database Migration

```bash
# Create initial migration
cd apps/api
npx typeorm migration:create src/database/migrations/InitialSetup

# Run migrations
pnpm migration:run

# Generate migration from entities
pnpm migration:generate src/database/migrations/FeatureName
```

---

## 4. Frontend Scaffolding

### Initialize React App

```bash
cd apps/pressing-web

# Create Vite React app
pnpm create vite . --template react-ts

# Install dependencies
pnpm add react-router-dom axios
pnpm add react-hook-form zod @hookform/resolvers
pnpm add @fortawesome/free-solid-svg-icons @fortawesome/react-fontawesome

# Install dev dependencies
pnpm add -D tailwindcss postcss autoprefixer

# Initialize Tailwind
npx tailwindcss init -p
```

### Configure Tailwind

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0ea5e9',
          dark: '#0284c7',
        },
        success: '#22c55e',
        warning: '#f59e0b',
        danger: '#ef4444',
        info: '#3b82f6',
      },
    },
  },
  plugins: [],
}
```

---

## 5. Shared Packages

### shared-types

```bash
cd packages/shared-types

# Initialize
pnpm init

# Install TypeScript
pnpm add -D typescript

# Create tsconfig.json
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "declaration": true,
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true
  },
  "include": ["src/**/*"]
}
EOF

# Create source files
mkdir -p src
```

---

## 6. Code Generation

### Generate NestJS CRUD

```bash
cd apps/api

# Generate full CRUD for a module
nest g resource orders --no-spec

# Generate individual components
nest g controller orders
nest g service orders
nest g module orders
nest g class orders/dto/create-order.dto --no-spec
nest g class orders/dto/update-order.dto --no-spec
nest g class orders/entities/order.entity --no-spec
```

### Generate React Components

```bash
# Using custom script
node scripts/generate-component.js OrderCard

# Or manually
mkdir -p src/components/OrderCard
cat > src/components/OrderCard/index.tsx << 'EOF'
import React from 'react';

interface OrderCardProps {
  order: Order;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  return (
    <div className="rounded-lg border p-4">
      {/* Component content */}
    </div>
  );
};
EOF
```

---

## 7. Testing Commands

### Unit Tests

```bash
# Run all tests
pnpm test

# Run specific app tests
cd apps/api && pnpm test
cd apps/pressing-web && pnpm test

# Run with coverage
pnpm test --coverage

# Run in watch mode
pnpm test --watch
```

### Integration Tests

```bash
# Start test database
docker-compose -f docker-compose.test.yml up -d

# Run integration tests
pnpm test:integration

# Run specific suite
pnpm test:integration orders
```

### E2E Tests

```bash
# Install Playwright
pnpm add -D @playwright/test
npx playwright install

# Run E2E tests
pnpm test:e2e

# Run specific test
pnpm test:e2e orders.spec.ts

# Run with UI
pnpm test:e2e --ui
```

---

## 8. CI/CD Setup

### GitHub Actions Workflow

```yaml
# .github/workflows/ci.yml
name: CI
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm lint
      - run: pnpm test
      - run: pnpm build
```

### Docker Build

```bash
# Build API image
docker build -t janlums-api:latest -f apps/api/Dockerfile .

# Build frontend image
docker build -t janlums-web:latest -f apps/pressing-web/Dockerfile .

# Run with docker-compose
docker-compose up -d
```

---

## 9. Environment Setup

### Local Development

```bash
# Copy environment files
cp apps/api/.env.example apps/api/.env.local
cp apps/pressing-web/.env.example apps/pressing-web/.env

# Start services
docker-compose up -d postgres redis

# Run migrations
cd apps/api && pnpm migration:run

# Seed data
pnpm seed

# Start dev servers
pnpm dev
```

### Environment Variables Template

```bash
# .env.example
NODE_ENV=development
PORT=3000

# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=janlums

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRATION=24h

# Supabase
SUPABASE_URL=http://localhost:54321
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key

# Payment Providers
MTN_MOMO_API_KEY=test-key
MTN_MOMO_API_SECRET=test-secret
ORANGE_MONEY_API_KEY=test-key

# Frontend
VITE_API_URL=http://localhost:3015/api/v1
```

---

## 10. Deployment Procedures

### Staging Deployment

```bash
# Build all apps
pnpm build

# Deploy API
kubectl set image deployment/janlums-api api=janlums-api:${VERSION}

# Deploy frontend
aws s3 sync apps/pressing-web/dist s3://staging.pressing237.com
aws cloudfront create-invalidation --distribution-id XYZ --paths "/*"
```

### Production Deployment

```bash
# Tag release
git tag -a v${VERSION} -m "Release ${VERSION}"
git push origin v${VERSION}

# Deploy with approval
kubectl apply -f k8s/production/

# Verify deployment
kubectl rollout status deployment/janlums-api
```

---

## 11. Rollback Procedures

### Application Rollback

```bash
# Kubernetes rollback
kubectl rollout undo deployment/janlums-api

# Docker rollback
docker-compose down
docker-compose up -d --previous
```

### Database Rollback

```bash
# Revert migration
npx typeorm migration:revert

# Restore from backup
pg_restore -d janlums backup.dump
```

---

## 12. Useful Scripts

### package.json scripts

```json
{
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "test": "turbo run test",
    "test:integration": "jest --config jest.integration.config.js",
    "test:e2e": "playwright test",
    "lint": "turbo run lint",
    "format": "prettier --write .",
    "typecheck": "turbo run typecheck",
    "clean": "turbo run clean && rm -rf node_modules",
    "db:migrate": "cd apps/api && pnpm migration:run",
    "db:seed": "cd apps/api && pnpm seed",
    "db:reset": "pnpm db:migrate && pnpm db:seed"
  }
}
```

---

## 13. Troubleshooting

### Common Issues

**Issue:** `Module not found` error
```bash
# Solution: Reinstall dependencies
pnpm install
```

**Issue:** Database connection failed
```bash
# Solution: Check Docker containers
docker-compose ps
docker-compose restart postgres
```

**Issue:** Migration fails
```bash
# Solution: Reset database
pnpm db:reset
```

**Issue:** TypeScript compilation error
```bash
# Solution: Check types
pnpm typecheck
```
