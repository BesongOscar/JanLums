# State Machine Definitions

**Version:** 1.0.0  
**Status:** Active  
**Last Updated:** 2026-05-25  
**Related Modules:** All  
**Implementation Status:** In Progress  
**Dependencies:** 20_NESTJS_MODULE_AND_TABLE_BLUEPRINT  

---

## 1. Order States

### States

| State | Code | Description |
|-------|------|-------------|
| `pending` | P | Order created, not yet received |
| `received` | R | Garments checked in at branch |
| `tagged` | T | Tagged and lot assigned |
| `in_wash` | W | Washing in progress |
| `in_dry` | D | Drying in progress |
| `in_press` | P | Pressing/finishing |
| `quality_check` | Q | Quality control gate |
| `ready` | Y | Processing complete |
| `out_for_delivery` | O | On delivery route |
| `completed` | C | Picked up or delivered |
| `cancelled` | X | Order cancelled |
| `rewash` | RW | Return to wash |
| `damaged` | DM | Damage found |
| `compensated` | CP | Damage resolved |
| `on_hold` | H | Holding for customer |

### Valid Transitions

```
pending → received, cancelled
received → tagged, cancelled
tagged → in_wash, cancelled
in_wash → in_dry
in_dry → in_press
in_press → quality_check
quality_check → ready, rewash, damaged
rewash → in_wash
ready → out_for_delivery, completed
out_for_delivery → completed
```

### Invalid Transitions

| From | To | Reason |
|------|-----|--------|
| `pending` | `ready` | Must go through processing |
| `completed` | any | Order is closed |
| `cancelled` | any | Order is cancelled |
| `in_wash` | `ready` | Must complete all stages |

---

## 2. Payment States

### States

| State | Description |
|-------|-------------|
| `pending` | Awaiting payment |
| `initiated` | Payment started |
| `processing` | Provider processing |
| `success` | Payment completed |
| `failed` | Payment failed |
| `expired` | Payment timed out |
| `cancelled` | Payment cancelled |

### Valid Transitions

```
pending → initiated → processing → [success | failed | expired]
pending → cancelled
```

---

## 3. Delivery States

### States

| State | Description |
|-------|-------------|
| `scheduled` | Stop planned |
| `assigned` | Driver assigned |
| `en_route` | Driver on way |
| `arrived` | At location |
| `completed` | Stop completed |
| `failed` | Stop failed |
| `skipped` | Stop skipped |

### Valid Transitions

```
scheduled → assigned → en_route → arrived → [completed | failed]
scheduled → skipped
```

---

## 4. Payroll States

### States

| State | Description |
|-------|-------------|
| `draft` | Period created |
| `processing` | Calculating payslips |
| `approved` | Manager approved |
| `paid` | Payments sent |
| `closed` | Period closed |

### Valid Transitions

```
draft → processing → approved → paid → closed
draft → cancelled
```

---

## 5. Rollback Rules

### Order Rollback

| Current State | Rollback To | Conditions |
|---------------|-------------|------------|
| `received` | `pending` | Before processing starts |
| `tagged` | `received` | Within 1 hour |
| `in_wash` | `tagged` | Machine not started |

### Payment Rollback

| Current State | Action |
|---------------|--------|
| `initiated` | Cancel transaction |
| `processing` | Wait for timeout or query status |
| `success` | Process refund |

---

## 6. Retry Behavior

| State | Max Retries | Retry Interval | Fallback |
|-------|-------------|----------------|----------|
| `processing` (payment) | 3 | 5 min | Mark as failed |
| `en_route` (delivery) | 2 | 30 min | Reschedule |
| `processing` (payroll) | 1 | 1 hour | Manual review |

---

## 7. Cancellation Logic

### Order Cancellation

| State | Can Cancel | Actor | Refund |
|-------|-----------|-------|--------|
| `pending` | ✅ | Customer | Full |
| `received` | ✅ | Manager | Full |
| `tagged` | ✅ | Manager | Full |
| `in_wash` | ❌ | - | - |
| `ready` | ❌ | - | - |

### Payment Cancellation

| State | Can Cancel | Action |
|-------|-----------|--------|
| `pending` | ✅ | Void transaction |
| `initiated` | ✅ | Abort with provider |
| `processing` | ⚠️ | Query status first |
| `success` | ❌ | Process refund instead |

---

## 8. Timeout Handling

| Entity | Timeout | Action |
|--------|---------|--------|
| Payment (pending) | 30 min | Expire, notify customer |
| Payment (processing) | 24 hours | Mark as failed |
| Delivery stop | 15 min at location | Mark as failed |
| QR pickup code | 7 days | Expire, require manual verification |
| Order on hold | 30 days | Manager review |

---

## 9. Audit Requirements

Every state transition must log:
- Timestamp
- From state
- To state
- Actor (user ID)
- Reason/notes
- IP address
- Device info (if mobile)

Retention: 7 years
