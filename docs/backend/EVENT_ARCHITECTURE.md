# Event Architecture

**Version:** 1.0.0  
**Status:** Active  
**Last Updated:** 2026-05-25  
**Related Modules:** All  
**Implementation Status:** Planned  
**Dependencies:** 03_TECH_ARCHITECTURE  

---

## 1. Event Bus Strategy

### Architecture

```
App Event → Event Bus → Handlers
                    → Queue (Redis)
                    → Webhooks
                    → Notifications
```

### Implementation

Use NestJS EventEmitter for internal events.
Use Redis for persistent queues.

---

## 2. Event Types

### Domain Events

| Event | Payload | Handlers |
|-------|---------|----------|
| `order.created` | Order data | Notification, Analytics |
| `order.status_changed` | Order, oldStatus, newStatus | Notification, QR update |
| `payment.received` | Transaction data | Notification, Order update |
| `payment.failed` | Transaction, error | Notification, Retry |
| `garment.qc_failed` | Garment, reason | Notification, Rewash |
| `delivery.completed` | Stop data | Notification, Order update |

### System Events

| Event | Payload | Handlers |
|-------|---------|----------|
| `user.login` | User, IP, device | Audit log |
| `tenant.created` | Tenant data | Provisioning |
| `error.occurred` | Error, context | Sentry, Alert |

---

## 3. Event Structure

```typescript
interface DomainEvent {
  id: string;           // UUID
  type: string;         // Event type
  timestamp: Date;      // When occurred
  tenantId: string;     // Tenant context
  payload: object;      // Event data
  metadata: {
    userId?: string;
    ipAddress?: string;
    correlationId?: string;
  };
}
```

---

## 4. Event Handlers

### Example: Order Created Handler

```typescript
@EventsHandler(OrderCreatedEvent)
export class OrderCreatedHandler implements IEventHandler<OrderCreatedEvent> {
  constructor(
    private notificationService: NotificationService,
    private analyticsService: AnalyticsService,
  ) {}

  async handle(event: OrderCreatedEvent) {
    await this.notificationService.sendOrderConfirmation(event.payload);
    await this.analyticsService.trackOrderCreated(event.payload);
  }
}
```

---

## 5. Queues

### Redis Queue Configuration

```typescript
// queue.module.ts
BullModule.forRoot({
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT),
  },
});

BullModule.registerQueue(
  { name: 'notifications' },
  { name: 'webhooks' },
  { name: 'reports' },
);
```

### Queue Consumers

```typescript
@Processor('notifications')
export class NotificationConsumer {
  @Process('send-sms')
  async sendSms(job: Job<SendSmsData>) {
    await this.smsService.send(job.data);
  }

  @Process('send-email')
  async sendEmail(job: Job<SendEmailData>) {
    await this.emailService.send(job.data);
  }
}
```

---

## 6. Retries

### Retry Strategy

```typescript
@Processor('notifications')
export class NotificationConsumer {
  @Process('send-sms')
  @OnQueueFailed()
  async onFailed(job: Job, error: Error) {
    if (job.attemptsMade < 3) {
      await job.retry();
    } else {
      await this.deadLetterQueue.add(job.data);
    }
  }
}
```

### Retry Delays

| Attempt | Delay |
|---------|-------|
| 1 | 5 seconds |
| 2 | 30 seconds |
| 3 | 5 minutes |

---

## 7. Webhook Handling

### Webhook Registration

```typescript
POST /api/v1/webhooks
Request:
{
  "url": "https://partner.com/webhook",
  "events": ["order.created", "payment.received"],
  "secret": "webhook-secret"
}
```

### Webhook Delivery

```typescript
async deliverWebhook(webhook: Webhook, event: DomainEvent) {
  const payload = JSON.stringify(event);
  const signature = crypto
    .createHmac('sha256', webhook.secret)
    .update(payload)
    .digest('hex');

  await fetch(webhook.url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Webhook-Signature': signature,
    },
    body: payload,
  });
}
```

---

## 8. Async Workflows

### Order Processing Workflow

```
1. Order Created
   → Save order
   → Emit `order.created`
   
2. Payment Received
   → Update order status
   → Emit `payment.received`
   → Queue: Send receipt email
   
3. Garment Ready
   → Update order status
   → Emit `order.status_changed`
   → Queue: Send ready notification
   
4. Delivery Completed
   → Update order status
   → Emit `delivery.completed`
   → Queue: Send delivery confirmation
```

---

## 9. Delivery Guarantees

### At-Least-Once Delivery

- Events persisted before emission
- Retry on failure
- Idempotency keys for handlers

### Event Ordering

- Same entity events ordered
- Timestamp-based sorting
- Sequence numbers for critical events

---

## 10. Monitoring

### Metrics

| Metric | Description |
|--------|-------------|
| `events.emitted` | Total events emitted |
| `events.processed` | Total events processed |
| `events.failed` | Failed event processing |
| `queue.depth` | Current queue depth |
| `queue.latency` | Time in queue |

### Alerts

- Queue depth > 1000
- Failed events > 5% in 1 hour
- Latency > 30 seconds
