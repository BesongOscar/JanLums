# Feature Playbook: Notification Systems

**Version:** 1.0.0  
**Status:** Active  
**Last Updated:** 2026-05-25  
**Related Modules:** notifications  
**Implementation Status:** Planned  
**Dependencies:** 20_NESTJS_MODULE_AND_TABLE_BLUEPRINT, 34_NOTIFICATION_SYSTEM_SPEC  

## 1. Business Flow

### Overview
Send notifications to customers, employees, and admins via SMS, WhatsApp, Email, and Push.

### Notification Types

| Type | Channel | Use Case |
|------|---------|----------|
| Transactional | SMS/Email | Order updates, receipts |
| Promotional | Email/Push | Offers, newsletters |
| Alert | SMS/Push | Urgent, exceptions |
| Reminder | SMS/Email | Payment due, pickup |

---

## 2. UI Flow

### pressing-web: Notification Templates

```
Settings → System → Notification Templates

Template Editor:
- Event trigger dropdown
- Channel selection
- Subject line (email)
- Body editor with variables
- Preview pane
- Test send button
```

---

## 3. API Flow

### Send Notification

```
POST /api/v1/notifications/send
Request:
{
  "templateId": "uuid",
  "recipients": ["customer-uuid"],
  "variables": {
    "customer_name": "John",
    "order_number": "ORD-001"
  },
  "channels": ["sms", "email"]
}
```

### Trigger Event

```
POST /api/v1/notifications/trigger
Request:
{
  "event": "order.ready",
  "payload": {
    "orderId": "uuid",
    "customerId": "uuid"
  }
}
```

---

## 4. Database Entities

### notifications
- id (uuid, PK)
- recipient_type (enum)
- recipient_id (uuid)
- channel (enum)
- template_id (uuid, FK)
- content (text)
- status (enum)
- sent_at (timestamp)

### notification_templates
- id (uuid, PK)
- name (varchar)
- event_trigger (varchar)
- channel (enum)
- body_template (text)
- variables (jsonb)

---

## 5. Validations

- Template exists and is active
- Variables provided for template
- Recipient exists
- Channel enabled for recipient
- Rate limit not exceeded

---

## 6. Retry Logic

| Attempt | Delay | Action |
|---------|-------|--------|
| 1 | Immediate | Primary channel |
| 2 | 5 min | Primary channel |
| 3 | 15 min | Secondary channel |
| 4 | 1 hour | Tertiary channel |

---

## 7. Edge Cases

- **Bounce handling**: Mark email as invalid
- **Unsubscribe**: Honor opt-out immediately
- **Quiet hours**: Delay until window opens
- **Bulk send**: Batch processing, rate limiting
- **Template missing**: Fallback to default

---

## 8. Reporting

- Delivery rate by channel
- Open rate (email/push)
- Click-through rate
- Opt-out rate
- Bounce rate
