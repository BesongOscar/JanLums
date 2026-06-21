# Docker Development Guide for JanLunMS

## Quick Start with Docker

### Prerequisites
- Docker Desktop installed and running
- Docker Compose v2+

### 1. Start All Services

```bash
# Build and start all containers
docker-compose up --build

# Or run in background (detached mode)
docker-compose up -d --build
```

This will start:
- PostgreSQL database on port 5432
- API server on port 3015
- Pressing Web on port 3025
- Customer Web on port 3035
- Admin Web on port 3085

### 2. Run Migrations and Seed Data

```bash
# Run database migrations
docker-compose exec api npx typeorm migration:run -d src/database/data-source.ts

# Seed demo data
docker-compose exec api npm run seed
```

### 3. Access the Applications

| Service | URL | Description |
|---------|-----|-------------|
| API Docs | http://localhost:3015/api/docs | Swagger UI |
| Pressing Web | http://localhost:3025 | Staff operations |
| Customer Web | http://localhost:3035 | Customer portal |
| Admin Web | http://localhost:3085 | Platform admin |

### 4. Useful Commands

```bash
# View logs
docker-compose logs -f api
docker-compose logs -f pressing-web

# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: deletes database data)
docker-compose down -v

# Rebuild a specific service
docker-compose up -d --build api

# Execute commands in containers
docker-compose exec api bash
docker-compose exec postgres psql -U postgres -d janlums

# Check container status
docker-compose ps
```

## Development Mode

For development with hot-reload:

```bash
# Start only database
docker-compose up -d postgres

# Run API locally (for hot-reload)
cd apps/api
npm install
npm run dev

# Run frontend apps locally
cd apps/pressing-web
npm install
npm run dev
```

## Production Deployment

```bash
# Use production docker-compose
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## Troubleshooting

### Port Already in Use
```bash
# Find what's using the port
netstat -ano | findstr :3015

# Stop the container and change ports in docker-compose.yml
```

### Database Connection Issues
```bash
# Check if postgres is running
docker-compose ps

# View postgres logs
docker-compose logs postgres

# Connect to postgres
docker-compose exec postgres psql -U postgres -d janlums
```

### Container Won't Start
```bash
# Rebuild from scratch
docker-compose down
docker-compose up -d --build --force-recreate
```

## Environment Variables

Create a `.env` file in the project root:

```env
# Database
DATABASE_HOST=postgres
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=janlums

# API
JWT_SECRET=your-super-secret-jwt-key
PORT=3015

# Frontend
VITE_API_URL=http://localhost:3015/api/v1
```
