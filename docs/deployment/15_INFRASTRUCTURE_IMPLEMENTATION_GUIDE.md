# 15 — Infrastructure Implementation Guide

**Version:** 1.0.0  
**Status:** Active  
**Last Updated:** 2026-05-25  
**Related Modules:** All  
**Implementation Status:** Planned  
**Dependencies:** 14_ENVIRONMENTS_AND_DEPLOYMENT  

## 1. Purpose

Step-by-step guide to set up JanLunMS infrastructure.

---

## 2. Prerequisites

- Node.js ≥ 20.0.0
- pnpm ≥ 8.0.0
- Docker & Docker Compose
- Git

---

## 3. Local Setup

### Step 1: Clone Repository

```bash
git clone https://github.com/janlums/janlums.git
cd janlums
```

### Step 2: Install Dependencies

```bash
pnpm install
```

### Step 3: Start Supabase

```bash
cd supabase-local
docker-compose up -d
```

### Step 4: Run Migrations

```bash
cd apps/api
pnpm migration:run
```

### Step 5: Seed Data

```bash
pnpm seed
```

### Step 6: Start API

```bash
pnpm start:dev
```

### Step 7: Start Frontend (new terminal)

```bash
cd apps/pressing-web
pnpm dev
```

### Step 8: Verify

- API: http://localhost:3015/api/docs
- pressing-web: http://localhost:3025

---

## 4. Supabase Setup

### Local Config

```yaml
# docker-compose.yml
version: '3.8'
services:
  supabase-db:
    image: supabase/postgres:15.1.0
    ports:
      - "54322:5432"
    environment:
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: janlums
  
  supabase-api:
    image: supabase/gotrue:v2
    ports:
      - "54321:9999"
    environment:
      GOTRUE_JWT_SECRET: your-jwt-secret
      GOTRUE_DB_DRIVER: postgres
```

### Production Config

Use Supabase Cloud or self-hosted:
- Create project
- Get connection string
- Configure auth providers
- Set up storage buckets

---

## 5. SSL/TLS

### Let's Encrypt

```bash
certbot --nginx -d pressing237.com -d api.pressing237.com
```

### Cloudflare

- Enable proxy
- Set SSL to Full (strict)
- Configure Page Rules

---

## 6. Payment Providers

### MTN MoMo

1. Register developer account
2. Get API keys
3. Configure webhook
4. Test in sandbox

### Orange Money

1. Register merchant account
2. Get API credentials
3. Configure callback URL
4. Test in sandbox

---

## 7. SMS/WhatsApp

### Twilio

1. Sign up
2. Buy phone number
3. Get SID and token
4. Configure webhook

### Africa's Talking

1. Create account
2. Get API key
3. Configure sender ID

---

## 8. Monitoring Setup

### Sentry

```bash
# Install
pnpm add @sentry/node @sentry/react

# Configure
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

### Prometheus

```yaml
# prometheus.yml
scrape_configs:
  - job_name: 'janlums-api'
    static_configs:
      - targets: ['api:3015']
```

---

## 9. Scaling Considerations

| Component | Strategy |
|-----------|----------|
| API | Horizontal (load balancer) |
| Database | Vertical + read replicas |
| Static files | CDN |
| Uploads | Object storage (S3) |
| Queue | Redis |
