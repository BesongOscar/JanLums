# 14 — Environments and Deployment

**Version:** 1.0.0  
**Status:** Active  
**Last Updated:** 2026-05-25  
**Related Modules:** All  
**Implementation Status:** Planned  
**Dependencies:** 15_INFRASTRUCTURE_IMPLEMENTATION_GUIDE, 16_DOMAIN_AND_ENVIRONMENT_MATRIX  

## 1. Purpose

Define environment configuration and deployment strategy for JanLunMS.

---

## 2. Environment Matrix

| Environment | Purpose | Data | Auto-deploy |
|-------------|---------|------|-------------|
| Local | Development | Seed + mock | N/A |
| Staging | Testing | Anonymized prod | Yes (main branch) |
| Production | Live | Real | Manual approval |

---

## 3. Local Development

### Ports

| Service | Port | URL |
|---------|------|-----|
| API | 3015 | http://localhost:3015 |
| pressing-web | 3025 | http://localhost:3025 |
| customer-web | 3035 | http://localhost:3035 |
| customer-mobile | 8081 | Expo dev client |
| admin-web | 3085 | http://localhost:3085 |
| PostgreSQL | 54322 | localhost:54322 |
| Supabase | 54321 | http://localhost:54321 |

### Environment Files

```
apps/api/.env.local
apps/pressing-web/.env
apps/customer-web/.env
apps/admin-web/.env
```

### Required Variables

```bash
# API
NODE_ENV=development
PORT=3000
DATABASE_HOST=localhost
DATABASE_PORT=54322
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=janlums
JWT_SECRET=your-super-secret-jwt-key
CORS_ALLOWED_ORIGINS=http://localhost:3025,http://localhost:3035,http://localhost:3085

# Supabase
SUPABASE_URL=http://localhost:54321
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# Payment (sandbox)
MTN_MOMO_API_KEY=test
MTN_MOMO_API_SECRET=test
ORANGE_MONEY_API_KEY=test

# Frontend
VITE_API_URL=http://localhost:3015/api/v1
VITE_SUPABASE_URL=http://localhost:54321
```

---

## 4. Staging Deployment

### Infrastructure

- **Server**: VPS or Cloud Run
- **Database**: Supabase or RDS
- **CDN**: Cloudflare
- **Storage**: S3-compatible

### Domains

| Service | Domain |
|---------|--------|
| pressing-web | staging.pressing237.com |
| customer-web | app-staging.pressing237.com |
| admin-web | admin-staging.laundryos.com |
| API | api-staging.pressing237.com |

### CI/CD Pipeline

```yaml
# .github/workflows/staging.yml
name: Deploy Staging
on:
  push:
    branches: [main]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm test
  deploy-api:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - run: docker build -t janlums-api:${{ github.sha }} apps/api
      - run: docker push ...
      - run: kubectl set image deployment/api api=janlums-api:${{ github.sha }}
  deploy-web:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - run: pnpm build --filter pressing-web
      - run: aws s3 sync apps/pressing-web/dist s3://staging-pressing-web
```

---

## 5. Production Deployment

### Checklist

- [ ] Database migrations run
- [ ] Environment variables set
- [ ] SSL certificates valid
- [ ] Payment providers in production mode
- [ ] SMS/WhatsApp providers configured
- [ ] Monitoring enabled
- [ ] Backups configured
- [ ] Rollback plan documented

### Domains

| Service | Domain |
|---------|--------|
| pressing-web | pressing237.com |
| customer-web | app.pressing237.com |
| admin-web | admin.laundryos.com |
| API | api.pressing237.com |

---

## 6. Database Migrations

### Migration Strategy

- TypeORM migrations only
- Never use `synchronize: true` in production
- Migrations run before app start
- Rollback plan for each migration
- Migration test in staging first

### Migration Naming

```
YYYYMMDDHHMMSS-DescriptiveName.ts
```

Example:
```
20240525120000-CreateOrdersTable.ts
20240525130000-AddOrderStatusIndex.ts
```

---

## 7. Rollback Procedures

### Application Rollback

```bash
# Rollback to previous version
kubectl rollout undo deployment/api
# Or
docker-compose down && docker-compose up -d --previous
```

### Database Rollback

```bash
# Revert last migration
npx typeorm migration:revert
# Or restore from backup
pg_restore -d janlums backup.dump
```

---

## 8. Monitoring

| Tool | Purpose |
|------|---------|
| Sentry | Error tracking |
| Prometheus | Metrics |
| Grafana | Dashboards |
| UptimeRobot | Uptime monitoring |
| LogRocket | Session replay (web) |

---

## 9. Backup Strategy

| Data | Frequency | Retention |
|------|-----------|-----------|
| Database | Daily | 30 days |
| Uploads | Real-time | 90 days |
| Logs | Daily | 7 days |
