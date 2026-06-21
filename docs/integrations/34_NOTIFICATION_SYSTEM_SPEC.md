# 34 — Notification System Spec

**Version:** 1.0.0  
**Status:** Active  
**Last Updated:** 2026-05-25  
**Related Modules:** notifications  
**Implementation Status:** Planned  
**Dependencies:** 20_NESTJS_MODULE_AND_TABLE_BLUEPRINT, 31_GARMENT_LIFECYCLE_SRD  

## 1. Purpose

Define SMS, WhatsApp, Email, and Push notification triggers, templates, and delivery.

---

## 2. Notification Channels

| Channel | Use Case | Provider | Cost |
|---------|----------|----------|------|
| SMS | Urgent alerts, OTP | Twilio / Africa's Talking | Medium |
| WhatsApp | Rich messages, images | WhatsApp Business API | Low |
| Email | Receipts, newsletters | SendGrid / AWS SES | Low |
| Push | Real-time updates | Firebase / OneSignal | Low |

---

## 3. Event Triggers

### Order Events

| Event | Channels | Recipients | Priority |
|-------|----------|------------|----------|
| Order created | Email, Push | Customer | Low |
| Order received | SMS, Push | Customer | Medium |
| Order ready | SMS, WhatsApp, Push | Customer | High |
| Out for delivery | SMS, Push | Customer | High |
| Delivered | SMS, Push | Customer | Medium |
| Payment received | Email | Customer | Low |
| Payment reminder | SMS, Email | Customer | High |
| Order cancelled | SMS, Email | Customer | Medium |
| Rewash required | SMS | Customer | Medium |
| Damage found | SMS, WhatsApp | Customer | High |

### Employee Events

| Event | Channels | Recipients | Priority |
|-------|----------|------------|----------|
| Shift reminder | Push | Employee | Medium |
| Payroll processed | Email, SMS | Employee | High |
| New assignment | Push | Employee | Medium |

### System Events

| Event | Channels | Recipients | Priority |
|-------|----------|------------|----------|
| Low stock alert | Email, Push | Manager | High |
| Vehicle maintenance | Email | Manager | Medium |
| Payment failure | SMS, Email | Admin | High |

---

## 4. Notification Templates

### Template Structure

```typescript
interface NotificationTemplate {
  id: uuid;
  tenant_id: uuid;
  name: string;
  event: string;
  channel: 'sms' | 'whatsapp' | 'email' | 'push';
  subject?: string;
  body: string;
  variables: string[];
  language: string;
  is_active: boolean;
}
```

### Example Templates

**Order Ready (SMS)**
```
Hello {{customer_name}}, your order #{{order_number}} is ready for pickup at {{branch_name}}. Total: {{total_amount}} XAF. Thank you!
```

**Order Ready (WhatsApp)**
```
Hi {{customer_name}}! 👋

Your order #{{order_number}} is ready! 🎉

📍 Pickup at: {{branch_name}}
💰 Total: {{total_amount}} XAF
⏰ Open until: {{closing_time}}

See you soon! 🧺
```

**Payment Receipt (Email)**
```
Subject: Payment Confirmation - Order #{{order_number}}

Dear {{customer_name}},

Thank you for your payment of {{amount}} XAF for order #{{order_number}}.

Payment Method: {{payment_method}}
Date: {{payment_date}}

You can track your order at: {{tracking_url}}

Best regards,
{{tenant_name}}
```

---

## 5. Delivery Logic

### Retry Strategy

| Attempt | Delay | Channel Fallback |
|---------|-------|------------------|
| 1 | Immediate | Primary |
| 2 | 5 min | Primary |
| 3 | 15 min | Secondary |
| 4 | 1 hour | Tertiary |

### Rate Limiting

| Channel | Max per minute | Max per hour |
|---------|----------------|--------------|
| SMS | 10 | 100 |
| WhatsApp | 20 | 200 |
| Email | 50 | 500 |
| Push | 100 | 1000 |

---

## 6. Customer Preferences

```typescript
interface NotificationPreference {
  customer_id: uuid;
  order_updates: boolean;
  promotions: boolean;
  payment_reminders: boolean;
  channels: {
    sms: boolean;
    whatsapp: boolean;
    email: boolean;
    push: boolean;
  };
  quiet_hours_start?: Time;
  quiet_hours_end?: Time;
}
```

---

## 7. Analytics

| Metric | Definition |
|--------|------------|
| Delivery Rate | Sent / Total |
| Open Rate | Opened / Delivered (email/push) |
| Click Rate | Clicked / Opened |
| Response Rate | Replied / Delivered (SMS/WhatsApp) |
| Opt-out Rate | Unsubscribed / Total |

---

## 8. Compliance

- GDPR compliance for EU customers
- Opt-in required for marketing
- Unsubscribe link in all emails
- Data retention: 2 years
- No PII in notification logs
