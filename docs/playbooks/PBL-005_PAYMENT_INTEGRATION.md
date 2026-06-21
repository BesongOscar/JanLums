# Feature Playbook: Payment Integration

**Version:** 1.0.0  
**Status:** Active  
**Last Updated:** 2026-05-25  
**Related Modules:** payments  
**Implementation Status:** Planned  
**Dependencies:** 20_NESTJS_MODULE_AND_TABLE_BLUEPRINT, 33_PRICING_ENGINE_SPEC  

## 1. Business Flow

### Overview
Process payments via MTN Mobile Money, Orange Money, credit/debit cards, or cash.

### Payment Types

| Type | Provider | Fee | Settlement |
|------|----------|-----|------------|
| MTN MoMo | MTN | 1.5% | Next day |
| Orange Money | Orange | 1.5% | Next day |
| Card | Stripe/PayPal | 2.9% + 0.30 | 2-3 days |
| Cash | N/A | 0% | Immediate |
| Wallet | Internal | 0% | Immediate |

---

## 2. UI Flow

### pressing-web: Payment Modal

```
Order Detail → Payment Button → Payment Modal

Payment Modal:
- Amount due
- Payment method selection
- Provider-specific form
- Processing indicator
- Success/failure message
- Receipt download
```

### customer-web: Checkout

```
Order Review → Payment Page → Confirmation

Payment Page:
- Order summary
- Saved payment methods
- Add new method
- Secure payment form
- Processing animation
- Success redirect
```

---

## 3. API Flow

### Initiate Payment

```
POST /api/v1/payments/initiate
Request:
{
  "orderId": "uuid",
  "amount": 5000,
  "currency": "XAF",
  "provider": "mtn",
  "method": "mobile_money",
  "phoneNumber": "+237612345678"
}

Response:
{
  "transactionId": "uuid",
  "status": "initiated",
  "reference": "TXN-000001",
  "providerReference": "mtn-ref-123"
}
```

### Webhook Handler

```
POST /api/v1/payments/webhook/:provider
Headers:
  X-Webhook-Signature: signature

Body:
{
  "event": "payment.success",
  "data": {
    "reference": "TXN-000001",
    "amount": 5000,
    "status": "success"
  }
}
```

### Refund

```
POST /api/v1/payments/:id/refund
Request:
{
  "amount": 5000,
  "reason": "Customer cancellation"
}

Response:
{
  "refundId": "uuid",
  "status": "processing",
  "estimatedCompletion": "2026-05-26T10:00:00Z"
}
```

---

## 4. Database Entities

### transactions
- id (uuid, PK)
- tenant_id (uuid, FK)
- order_id (uuid, FK)
- transaction_code (varchar)
- amount (decimal)
- currency (varchar)
- provider (enum)
- status (enum)
- provider_reference (varchar)
- processed_at (timestamp)
- metadata (jsonb)

---

## 5. Lifecycle States

```
pending → initiated → processing → [success | failed | expired]
```

**Refund states:**
```
requested → processing → [completed | failed]
```

---

## 6. Validations

- Amount matches order total
- Currency valid
- Provider active
- Phone number valid (for mobile money)
- Card details valid (for card payments)
- Sufficient funds (checked by provider)

---

## 7. Permissions

| Role | Process Payment | Refund | View Transactions | Configure Providers |
|------|----------------|--------|-------------------|---------------------|
| counter_staff | ✅ | ❌ | ✅ (own branch) | ❌ |
| manager | ✅ | ✅ (≤100,000) | ✅ | ❌ |
| admin | ✅ | ✅ | ✅ (all tenants) | ✅ |

---

## 8. Failure Handling

| Failure | Handling |
|---------|----------|
| Insufficient funds | Notify customer, retry or change method |
| Network error | Queue for retry (3 attempts) |
| Provider outage | Fallback to alternative provider |
| Timeout | Query provider status, update accordingly |
| Duplicate payment | Idempotency check, prevent double charge |

---

## 9. Notifications

| Event | Recipient | Channel |
|-------|-----------|---------|
| Payment initiated | Customer | SMS |
| Payment successful | Customer | Email + SMS |
| Payment failed | Customer | SMS |
| Refund processed | Customer | Email |
| Daily settlement | Manager | Email |

---

## 10. Edge Cases

- **Partial payment**: Accept deposit, balance due later
- **Overpayment**: Refund excess or store as credit
- **Split payment**: Multiple methods for one order
- **Currency conversion**: Auto-convert if needed
- **Dispute**: Hold funds, investigate, resolve

---

## 11. Audit Requirements

- All transactions logged
- Webhook payloads stored
- Refund reasons recorded
- Settlement reports generated
- Reconciliation with provider statements

---

## 12. Reporting Implications

- Revenue by payment method
- Transaction success rate
- Average transaction value
- Refund rate
- Settlement timing

---

## 13. Mobile Considerations

- Mobile-optimized payment forms
- Provider app deep linking (MTN/Orange)
- Apple Pay / Google Pay integration
- Biometric authentication
- One-click payments for returning customers
