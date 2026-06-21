# Quick Start Guide

## Prerequisites
- Node.js >= 20.0.0
- pnpm >= 8.15.0
- PostgreSQL >= 15
- Git

## 1. Clone and Install

```bash
git clone <repository-url> janlums
cd janlums
pnpm install
```

## 2. Database Setup

### Create Database
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE janlums;
\q
```

### Configure Environment
```bash
cp apps/api/.env.example apps/api/.env
```

Edit `apps/api/.env`:
```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_password
DATABASE_NAME=janlums
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

## 3. Run Migrations

```bash
pnpm db:migrate
```

## 4. Seed Demo Data

```bash
pnpm db:seed
```

This creates:
- Demo tenant: "Pressing 237"
- Demo branch: "Main Branch" (Douala)
- Admin user: admin@pressing237.com / admin123
- Counter staff: counter@pressing237.com / counter123
- 4 sample customers
- 5 laundry services
- 3 sample orders

## 5. Start Development

### Option A: Start All Apps
```bash
pnpm dev
```

### Option B: Start Individual Apps

**Terminal 1 - Backend API:**
```bash
pnpm --filter @janlums/api dev
```

**Terminal 2 - Pressing Web (Staff):**
```bash
pnpm --filter @janlums/pressing-web dev
```

**Terminal 3 - Customer Web:**
```bash
pnpm --filter @janlums/customer-web dev
```

**Terminal 4 - Admin Web:**
```bash
pnpm --filter @janlums/admin-web dev
```

## 6. Access the Applications

| App | URL | Description |
|-----|-----|-------------|
| API Docs | http://localhost:3015/api | Swagger UI |
| Pressing Web | http://localhost:3025 | Staff operations |
| Customer Web | http://localhost:3035 | Customer portal |
| Admin Web | http://localhost:3085 | Platform admin |

## 7. Login Credentials

Use these credentials to test the system:

**Admin Account:**
- Email: admin@pressing237.com
- Password: admin123

**Counter Staff Account:**
- Email: counter@pressing237.com
- Password: counter123

## 8. Common Commands

### Database
```bash
# Run migrations
pnpm db:migrate

# Seed data
pnpm db:seed

# Reset database (migrate + seed)
pnpm db:reset

# Create new migration
cd apps/api && pnpm migration:create src/database/migrations/MigrationName

# Generate migration from entities
cd apps/api && pnpm migration:generate src/database/migrations/MigrationName
```

### Development
```bash
# Start all apps
pnpm dev

# Build all apps
pnpm build

# Run tests
pnpm test

# Lint all apps
pnpm lint

# Type check all apps
pnpm typecheck

# Clean build artifacts
pnpm clean
```

### Individual Apps
```bash
# API commands
pnpm --filter @janlums/api dev
pnpm --filter @janlums/api build
pnpm --filter @janlums/api test

# Pressing web commands
pnpm --filter @janlums/pressing-web dev
pnpm --filter @janlums/pressing-web build

# Similar for other apps...
```

## 9. Project Structure

```
janlums/
├── apps/
│   ├── api/              # NestJS backend (port 3015)
│   ├── pressing-web/     # Staff UI (port 3025)
│   ├── customer-web/     # Customer portal (port 3035)
│   └── admin-web/        # Admin dashboard (port 3085)
├── packages/
│   ├── shared-types/     # TypeScript types
│   └── utils/            # Shared utilities
├── docs/                 # Documentation
└── README.md            # Main documentation
```

## 10. Next Steps

### For Backend Developers
1. Explore `apps/api/src/modules/` to see existing modules
2. Check `docs/backend/20_NESTJS_MODULE_AND_TABLE_BLUEPRINT.md` for module specs
3. Create new modules following existing patterns

### For Frontend Developers
1. Explore `apps/pressing-web/src/` for the main staff interface
2. Check `docs/frontend/` for UI/UX specifications
3. Components use Tailwind CSS with custom color palette

### For Full Stack
1. Start with the Orders module (backend + frontend)
2. Implement QR code scanning feature
3. Add payment integration

## 11. Troubleshooting

### Port Already in Use
```bash
# Find and kill process using port 3015
npx kill-port 3015
```

### Database Connection Issues
- Verify PostgreSQL is running
- Check credentials in `apps/api/.env`
- Ensure database `janlums` exists

### Missing Dependencies
```bash
# Clean install
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Migration Failures
```bash
# Reset migrations (development only)
cd apps/api
npx typeorm migration:revert -d src/database/data-source.ts
# Repeat until all reverted, then run migrations again
```

## 12. API Testing

Use the Swagger UI at http://localhost:3015/api to test endpoints interactively.

Or use curl:
```bash
# Login
curl -X POST http://localhost:3015/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@pressing237.com","password":"admin123"}'

# Get orders (replace TOKEN with actual JWT)
curl http://localhost:3015/orders?tenantId=demo-tenant-id \
  -H "Authorization: Bearer TOKEN"
```

## 13. Contributing

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Make changes following existing patterns
3. Test your changes
4. Update documentation if needed
5. Submit a pull request

## Need Help?

- Check `docs/` directory for comprehensive documentation
- Review `docs/IMPLEMENTATION_STATUS.md` for current progress
- See feature playbooks in `docs/playbooks/`

---

**Happy Coding!** 🚀
