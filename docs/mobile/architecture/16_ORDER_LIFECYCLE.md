# 16 — Order Lifecycle Diagram

**Version:** 2.0.0
**Status:** Active
**Last Updated:** 2026-06-20
**Revisions Applied:** #5 (Status Translation), #6 (Pricing Authority)

---

## 1. Status State Machine

```
                                    ┌──────────────┐
                                    │   pending     │
                                    └──────┬───────┘
                                           │
                                   Staff receives order
                                           │
                                           ▼
                                    ┌──────────────┐
                                    │   received    │
                                    └──────┬───────┘
                                           │
                                   Staff tags garments
                                           │
                                           ▼
                                    ┌──────────────┐
                                    │   tagged      │
                                    └──────┬───────┘
                                           │
                                   Garments enter wash
                                           │
                                           ▼
                                    ┌──────────────┐
                                    │   in_wash     │
                                    └──────┬───────┘
                                           │
                                   Move to dryer
                                           │
                                           ▼
                                    ┌──────────────┐
                                    │   in_dry      │
                                    └──────┬───────┘
                                           │
                                   Move to press
                                           │
                                           ▼
                                    ┌──────────────┐
                                    │   in_press    │
                                    └──────┬───────┘
                                           │
                                   QC inspection
                                           │
                              ┌────────────┴────────────┐
                              │                         │
                              ▼                         ▼
                       ┌──────────────┐         ┌──────────────┐
                       │quality_check │         │   rewash      │
                       └──────┬───────┘         └──────┬───────┘
                              │                         │
                     Pass     │    Fail                 │
                     ┌────────┘    │                    │
                     │             └───────────────────>│
                     ▼                                  │ back to in_wash
              ┌──────────────┐                          │
              │    ready      │<─────────────────────────┘
              └──────┬───────┘
                     │
          ┌──────────┴──────────┐
          │                     │
     Pickup order          Delivery order
          │                     │
          │              ┌──────┴───────┐
          │              │out_for_      │
          │              │delivery      │
          │              └──────┬───────┘
          │                     │
          │              Delivery complete
          │                     │
          └──────────┬──────────┘
                     │
                     ▼
              ┌──────────────┐
              │  completed    │
              └──────────────┘

        SPECIAL STATES:
        ┌──────────────┐     ┌──────────────┐
        │  on_hold      │     │  damaged     │
        └──────────────┘     └──────┬───────┘
                                    │
                                    ▼
                             ┌──────────────┐
                             │ compensated   │
                             └──────────────┘

        CANCELLATION (from any state except completed):
        ┌──────────────┐
        │  cancelled    │
        └──────────────┘
```

---

## 2. Customer-Facing Status Labels

| Backend Status | Customer Label | Timeline |
|---------------|---------------|----------|
| `pending` | Order Placed | Step 1 |
| `received` | Received at Branch | Step 2 |
| `tagged` | Garments Tagged | Hidden |
| `in_wash` | Washing in Progress | Step 3 |
| `in_dry` | Drying | Step 4 |
| `in_press` | Ironing | Step 5 |
| `quality_check` | Quality Inspection | Step 6 |
| `ready` | Ready for Pickup | Step 7 |
| `out_for_delivery` | Out for Delivery | Step 8 |
| `completed` | Completed | Step 9 |
| `cancelled` | Cancelled | Banner |
| `rewash` | Being Rewashed | Banner |
| `damaged` | Issue Reported | Banner |
| `on_hold` | On Hold | Banner |

---

## 3. Mobile App Order Flow

### Phase 1: Order Creation

```
ServiceSelectScreen → GarmentEntryScreen → PickupDetailsScreen → OrderReviewScreen
       │                      │                    │                    │
  GET /services          Local state          GET /branches      Compute estimates
  Select service         Add items            Select branch      Display disclaimer
```

### Phase 2: Order Submission

```
PaymentScreen → ConfirmationScreen
      │              │
  Select method   POST /orders
  (cash/MTN)      + items[]
                       │
                       ▼
                 Order created
                 status = "pending"
                       │
                       ▼
                 POST /qr-code/generate/order
                       │
                       ▼
                 Display QR + order number
```

### Phase 3: Tracking

```
TrackScreen → OrderDetailScreen
      │              │
  GET /orders     GET /orders/:id
  Poll every 30s  StatusTimeline
```

### Phase 4: Pickup

```
Customer arrives → Shows QR → Staff scans → Order complete
                                        PUT /orders/:id/status {completed}
```

---

## 4. Order Creation Payload

```typescript
POST /api/v1/orders
{
  "tenantId": "uuid",
  "branchId": "uuid",
  "customerId": "uuid",
  "status": "pending",
  "isExpress": false,
  "notes": "Handle with care",
  "pickupDate": "2026-06-20T10:00:00Z",
  "items": [
    {
      "garmentType": "Shirt",
      "fabricType": "Cotton",
      "color": "White",
      "quantity": 3,
      "unitPrice": 1500,
      "totalPrice": 4500,
      "specialInstructions": "Remove collar stain",
      "status": "pending"
    }
  ]
}
```

**Note:** Backend computes `subtotal`, `tax`, `total`. Frontend sends estimated `unitPrice` and `totalPrice` per item for display, but backend is authoritative.

---

## 5. Order Response

```typescript
GET /api/v1/orders/:id
{
  "id": "uuid",
  "tenantId": "uuid",
  "branchId": "uuid",
  "customerId": "uuid",
  "staffId": "uuid",
  "status": "ready",
  "subtotal": 6500,
  "tax": 0,
  "discount": 0,
  "total": 6500,
  "amountPaid": 0,
  "notes": "Handle with care",
  "pickupDate": "2026-06-20T10:00:00Z",
  "isExpress": false,
  "qrCode": "{...}",
  "createdAt": "2026-06-18T08:30:00Z",
  "updatedAt": "2026-06-19T14:20:00Z",
  "items": [...],
  "staff": { "id": "uuid", "firstName": "Counter", "lastName": "Staff" },
  "branch": { "id": "uuid", "name": "Main Branch", "address": "123 Street" }
}
```
