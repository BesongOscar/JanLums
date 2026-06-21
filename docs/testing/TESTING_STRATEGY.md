# Testing Strategy

**Version:** 1.0.0  
**Status:** Active  
**Last Updated:** 2026-05-25  
**Related Modules:** All  
**Implementation Status:** Planned  
**Dependencies:** IMPLEMENTATION_PLAN, BUILD_RUNBOOK  

## 1. Purpose

Comprehensive testing strategy covering unit, integration, E2E, mobile, API contract, performance, and security testing.

---

## 2. Testing Pyramid

```
         /\
        /  \     E2E Tests (10%)
       /----\    
      /      \   Integration Tests (20%)
     /--------\  
    /          \ Unit Tests (70%)
   /------------\
```

---

## 3. Unit Testing

### Backend (NestJS)

**Framework:** Jest

```typescript
// Example: Order Service Test
describe('OrdersService', () => {
  let service: OrdersService;
  let repository: Repository<Order>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: getRepositoryToken(Order),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    repository = module.get<Repository<Order>>(getRepositoryToken(Order));
  });

  it('should create an order', async () => {
    const createOrderDto = {
      customerId: 'uuid',
      serviceTypeId: 'uuid',
      items: [{ garmentTypeId: 'uuid', quantity: 1 }],
    };

    const result = await service.create(createOrderDto);
    expect(result).toBeDefined();
    expect(repository.save).toHaveBeenCalled();
  });
});
```

### Frontend (React)

**Framework:** Vitest + React Testing Library

```typescript
// Example: OrderCard Test
import { render, screen } from '@testing-library/react';
import { OrderCard } from './OrderCard';

describe('OrderCard', () => {
  it('renders order details', () => {
    const order = {
      id: '1',
      orderNumber: 'ORD-001',
      status: 'pending',
      totalAmount: 5000,
    };

    render(<OrderCard order={order} />);
    
    expect(screen.getByText('ORD-001')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });
});
```

### Coverage Standards

| Layer | Target Coverage |
|-------|----------------|
| Services (Backend) | 80% |
| Controllers (Backend) | 70% |
| Components (Frontend) | 70% |
| Utils/Helpers | 90% |
| Shared Types | 100% |

---

## 4. Integration Testing

### API Integration Tests

**Framework:** Supertest + Jest

```typescript
// Example: Order API Test
describe('Orders API', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('POST /orders - creates order', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/orders')
      .send({
        customerId: 'uuid',
        serviceTypeId: 'uuid',
        items: [{ garmentTypeId: 'uuid', quantity: 1 }],
      })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.status).toBe('pending');
  });

  it('GET /orders/:id - retrieves order', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/orders/123')
      .expect(200);

    expect(response.body).toHaveProperty('orderNumber');
  });
});
```

### Database Integration Tests

```typescript
describe('Order Repository', () => {
  let repository: Repository<Order>;

  beforeEach(async () => {
    // Use test database
    const module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5433, // Test DB port
          database: 'janlums_test',
          synchronize: true,
          entities: [Order],
        }),
        TypeOrmModule.forFeature([Order]),
      ],
    }).compile();

    repository = module.get<Repository<Order>>(getRepositoryToken(Order));
  });

  it('should save and retrieve order', async () => {
    const order = repository.create({
      orderNumber: 'ORD-001',
      status: 'pending',
    });

    const saved = await repository.save(order);
    const found = await repository.findOne({ where: { id: saved.id } });

    expect(found).toBeDefined();
    expect(found.orderNumber).toBe('ORD-001');
  });
});
```

---

## 5. E2E Testing

### Web Application E2E

**Framework:** Playwright

```typescript
// Example: Order Flow E2E Test
import { test, expect } from '@playwright/test';

test.describe('Order Flow', () => {
  test('customer places order', async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('[name="email"]', 'customer@test.com');
    await page.fill('[name="password"]', 'password');
    await page.click('button[type="submit"]');

    // Navigate to order page
    await page.goto('/order');

    // Select service
    await page.click('text=Wash & Fold');
    await page.click('button:has-text("Next")');

    // Add garments
    await page.click('button:has-text("Add Garment")');
    await page.selectOption('select[name="type"]', 'Shirt');
    await page.fill('input[name="quantity"]', '5');
    await page.click('button:has-text("Next")');

    // Review and confirm
    await page.click('button:has-text("Place Order")');

    // Verify order created
    await expect(page.locator('text=Order Confirmed')).toBeVisible();
  });
});
```

### Critical E2E Flows

| Flow | Priority | Test File |
|------|----------|-----------|
| Order creation | P0 | `order-flow.spec.ts` |
| Payment processing | P0 | `payment-flow.spec.ts` |
| Order status tracking | P0 | `tracking-flow.spec.ts` |
| User registration | P1 | `auth-flow.spec.ts` |
| Customer login | P1 | `auth-flow.spec.ts` |
| QR code scanning | P1 | `qr-scan-flow.spec.ts` |

---

## 6. Mobile Testing

### Framework: Detox (for React Native)

```javascript
// Example: Mobile Order Test
describe('Order Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  it('should place an order', async () => {
    await element(by.id('order-tab')).tap();
    await element(by.id('service-wash-fold')).tap();
    await element(by.id('add-garment')).tap();
    await element(by.id('garment-shirt')).tap();
    await element(by.id('next-button')).tap();
    await element(by.id('place-order')).tap();
    
    await expect(element(by.id('order-confirmation'))).toBeVisible();
  });
});
```

### Mobile Test Categories

| Category | Coverage |
|----------|----------|
| Unit tests | 70% |
| Component tests | 60% |
| Integration tests | 50% |
| E2E tests | Critical flows |

---

## 7. API Contract Testing

### Framework: Pact

```typescript
// Consumer Test (Frontend)
import { PactV3 } from '@pact-foundation/pact';

const provider = new PactV3({
  consumer: 'pressing-web',
  provider: 'janlums-api',
});

describe('Orders API Contract', () => {
  it('returns order details', async () => {
    await provider
      .given('order exists')
      .uponReceiving('get order by id')
      .withRequest({
        method: 'GET',
        path: '/api/v1/orders/123',
        headers: { Authorization: 'Bearer token' },
      })
      .willRespondWith({
        status: 200,
        body: {
          id: '123',
          orderNumber: 'ORD-001',
          status: 'pending',
        },
      });

    await provider.executeTest(async (mockserver) => {
      const api = new ApiClient(mockserver.url);
      const order = await api.getOrder('123');
      expect(order.orderNumber).toBe('ORD-001');
    });
  });
});
```

---

## 8. Performance Testing

### Load Testing

**Framework:** k6

```javascript
// load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 100 },  // Ramp up
    { duration: '5m', target: 100 },  // Steady state
    { duration: '2m', target: 200 },  // Spike
    { duration: '5m', target: 200 },  // Sustained load
    { duration: '2m', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<200'], // 95% under 200ms
    http_req_failed: ['rate<0.01'],   // Error rate < 1%
  },
};

export default function () {
  const response = http.get('https://api.pressing237.com/api/v1/services');
  
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 200ms': (r) => r.timings.duration < 200,
  });

  sleep(1);
}
```

### Performance Benchmarks

| Metric | Target | Test |
|--------|--------|------|
| API Response (p95) | < 200ms | Load test |
| Page Load Time | < 2s | Lighthouse |
| Database Query | < 50ms | Query analysis |
| Mobile App Launch | < 3s | Manual test |

---

## 9. Security Testing

### Static Analysis

```bash
# Run ESLint security rules
pnpm lint:security

# Run SonarQube analysis
sonar-scanner \
  -Dsonar.projectKey=janlums \
  -Dsonar.sources=. \
  -Dsonar.host.url=https://sonarqube.example.com
```

### Dependency Scanning

```bash
# Check for vulnerabilities
pnpm audit

# Fix automatically
pnpm audit --fix
```

### Penetration Testing Checklist

- [ ] SQL Injection
- [ ] XSS (Cross-Site Scripting)
- [ ] CSRF (Cross-Site Request Forgery)
- [ ] Authentication bypass
- [ ] Authorization flaws
- [ ] Sensitive data exposure
- [ ] API rate limiting
- [ ] File upload validation

---

## 10. Test Data Strategy

### Factories

```typescript
// test/factories/order.factory.ts
import { Factory } from 'rosie';
import { faker } from '@faker-js/faker';

export const OrderFactory = new Factory()
  .attr('id', () => faker.string.uuid())
  .attr('orderNumber', () => `ORD-${faker.number.int(999999)}`)
  .attr('status', () => faker.helpers.arrayElement(['pending', 'received', 'ready']))
  .attr('totalAmount', () => faker.number.int(50000))
  .attr('customerId', () => faker.string.uuid())
  .attr('createdAt', () => faker.date.past());
```

### Fixtures

```typescript
// test/fixtures/orders.fixture.ts
export const ordersFixture = [
  {
    id: 'order-1',
    orderNumber: 'ORD-001',
    status: 'pending',
    totalAmount: 5000,
  },
  {
    id: 'order-2',
    orderNumber: 'ORD-002',
    status: 'ready',
    totalAmount: 12000,
  },
];
```

### Seed Data

```bash
# Development seed
pnpm db:seed

# Test seed
NODE_ENV=test pnpm db:seed
```

---

## 11. Test Environment

### Docker Compose for Testing

```yaml
# docker-compose.test.yml
version: '3.8'
services:
  postgres-test:
    image: postgres:15
    environment:
      POSTGRES_DB: janlums_test
      POSTGRES_PASSWORD: test
    ports:
      - "5433:5432"
  
  redis-test:
    image: redis:7
    ports:
      - "6380:6379"
```

### CI/CD Test Pipeline

```yaml
# .github/workflows/test.yml
name: Test
on: [push, pull_request]
jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm test:unit --coverage
      - uses: codecov/codecov-action@v3

  integration-tests:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: test
    steps:
      - uses: actions/checkout@v3
      - run: pnpm test:integration

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm test:e2e
```

---

## 12. Test Execution Commands

```bash
# Run all tests
pnpm test

# Run with coverage
pnpm test --coverage

# Run specific test file
pnpm test orders.service.spec.ts

# Run tests matching pattern
pnpm test --grep "Order"

# Run in watch mode
pnpm test --watch

# Run E2E tests
pnpm test:e2e

# Run E2E with UI
pnpm test:e2e --ui

# Run load tests
k6 run load-test.js
```
