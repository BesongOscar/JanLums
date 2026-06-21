# 08 — Notification Center

**Version:** 2.0.0
**Status:** Active
**Last Updated:** 2026-06-20
**Revisions Applied:** #8 (Notification Architecture)

---

## 1. Notification Center Architecture

### Data Model

```typescript
interface Notification {
  id: string;
  title: string;
  body: string;
  type: NotificationType;
  orderId?: string;
  deepLink?: string;
  read: boolean;
  createdAt: string;
  metadata?: Record<string, any>;
}

type NotificationType = 
  | 'order_received'
  | 'order_status_update'
  | 'order_ready'
  | 'order_delivered'
  | 'order_completed'
  | 'order_cancelled'
  | 'order_issue'
  | 'payment_reminder'
  | 'promotion'
  | 'system';
```

### Notification Types

| Type | Trigger | Title Template | Body Template |
|------|---------|---------------|---------------|
| `order_received` | `POST /orders` (201) | "Order Received" | "Your order #{orderId} has been received" |
| `order_status_update` | Status change | "Order Update" | "Order #{orderId} is now: {statusLabel}" |
| `order_ready` | Status → `ready` | "Ready for Pickup" | "Your order #{orderId} is ready at {branch}" |
| `order_delivered` | Status → `completed` | "Order Complete" | "Thank you! Order #{orderId} is complete" |
| `order_cancelled` | Status → `cancelled` | "Order Cancelled" | "Order #{orderId} has been cancelled" |
| `order_issue` | Status → `damaged` | "Issue Reported" | "We found an issue with order #{orderId}" |
| `payment_reminder` | Amount due > 0 | "Payment Due" | "Please complete payment for order #{orderId}" |
| `promotion` | Admin-triggered | "Special Offer" | "{promoMessage}" |
| `system` | System event | "System Notice" | "{message}" |

---

## 2. Screens

### NotificationsScreen

```
┌─────────────────────────────────────┐
│  ← Back    Notifications    Mark all│
│                                     │
│  ● Order Ready for Pickup          │
│    Your order #ORD-a1b2 is ready   │
│    2 minutes ago                    │
│                                     │
│  ● Order Update                     │
│    Order #ORD-c3d4 is now: Washing │
│    1 hour ago                       │
│                                     │
│  ○ Special Offer                    │
│    20% off dry cleaning this week!  │
│    Yesterday                        │
│                                     │
│  ○ Payment Due                      │
│    Please complete payment          │
│    2 days ago                       │
│                                     │
└─────────────────────────────────────┘

● = Unread
○ = Read
```

### NotificationDetailScreen

```
┌─────────────────────────────────────┐
│  ← Back                            │
│                                     │
│  Ready for Pickup                  │
│                                     │
│  Your order #ORD-a1b2c3d4 is ready │
│  for pickup at Main Branch.        │
│                                     │
│  Please bring your QR code for     │
│  collection.                       │
│                                     │
│  ─────────────────────────────     │
│                                     │
│  Received: Jun 20, 2026 14:30      │
│  Order: #ORD-a1b2c3d4              │
│                                     │
│  [ View Order ]                     │
│                                     │
└─────────────────────────────────────┘
```

---

## 3. Badge System

### Tab Badge (Account)

| State | Badge | Display |
|-------|-------|---------|
| Unread count = 0 | No badge | — |
| Unread count = 1-99 | Number | `{count}` |
| Unread count > 99 | "99+" | `99+` |

### Home Screen Badge

| State | Badge | Display |
|-------|-------|---------|
| No active orders | No badge | — |
| Active orders | Count | `{count}` |

---

## 4. Notification Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Backend     │     │  Mobile App  │     │  User        │
│  (API)       │     │  (React)     │     │              │
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │                    │                    │
       │  Order status      │                    │
       │  changes           │                    │
       │───────────────────>│                    │
       │                    │                    │
       │                    │  Poll GET /orders   │
       │                    │  (detect change)    │
       │                    │──────┐             │
       │                    │      │             │
       │                    │<─────┘             │
       │                    │                    │
       │                    │  Create in-app     │
       │                    │  notification       │
       │                    │──────┐             │
       │                    │      │             │
       │                    │<─────┘             │
       │                    │                    │
       │                    │  Update badge count │
       │                    │───────────────────>│
       │                    │                    │
       │                    │  Show toast/banner  │
       │                    │───────────────────>│
       │                    │                    │
```

---

## 5. Backend Integration

### Existing Endpoints

| Endpoint | Purpose | Mobile Use |
|----------|---------|------------|
| `POST /notifications/send` | Send notification | Server-side trigger |
| `POST /notifications/order-status` | Order status notification | Triggered on status change |
| `POST /notifications/ready-pickup` | Ready notification | Triggered when order ready |

### Mobile Detection Strategy

Since the backend notification service is a stub (console.log only), the mobile app must:

1. **Poll** `/orders` every 30 seconds for status changes
2. **Compare** with previous status stored locally
3. **Create** in-app notification on status change
4. **Store** notification in AsyncStorage

```typescript
// Polling hook
export function useOrderPolling(tenantId: string) {
  const { data: orders } = useQuery({
    queryKey: ['orders', tenantId],
    queryFn: () => fetchOrders(tenantId),
    refetchInterval: 30000, // Poll every 30s
  });

  useEffect(() => {
    // Compare with previous state
    // Create notification on change
  }, [orders]);
}
```

---

## 6. Future: Push Notifications

| Step | Implementation |
|------|---------------|
| 1 | Register device with Expo Push Token |
| 2 | Send token to backend |
| 3 | Backend sends push on status change |
| 4 | Mobile handles push → create in-app notification |

**Prerequisites:** Backend must integrate with Expo Push Notification service.
