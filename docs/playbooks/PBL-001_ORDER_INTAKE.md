# Feature Playbook: Order Intake & Processing

**Version:** 1.0.0  
**Status:** Active  
**Last Updated:** 2026-05-25  
**Related Modules:** orders, customers, services, payments  
**Implementation Status:** In Progress  
**Dependencies:** 20_NESTJS_MODULE_AND_TABLE_BLUEPRINT, 29_ORDER_AND_QR_SPEC  

---

## 1. Business Flow

### Overview
Customer brings garments to branch (or requests pickup) → Staff creates order → Garments tagged → Order enters processing pipeline.

### Actors
- **Customer**: Provides garments, selects services
- **Counter Staff**: Creates order, tags garments, handles payment
- **System**: Generates order number, calculates pricing, tracks status

### Primary Flow

```
1. Customer arrives at branch (or requests pickup)
2. Staff identifies customer (search/create)
3. Staff selects service type(s)
4. Staff adds garment items
5. System calculates price
6. Customer confirms order
7. System generates order number
8. Staff prints tags, assigns lot
9. Order status = "received"
10. Payment processed (now or later)
```

### Alternative Flows

**Walk-in vs. Pickup Request**
- Walk-in: Customer brings garments to counter
- Pickup: Customer requests via app/phone → Driver collects

**Payment Timing**
- Pay now: Full payment at intake
- Pay later: Payment on pickup
- Partial: Deposit at intake, balance on pickup

---

## 2. UI Flow

### pressing-web: Order Creation

```
Orders Page → Add Order Button → Order Modal (5 steps)

Step 1: Customer
- Search existing customer
- Or create new customer
- Show customer details

Step 2: Service Selection
- Service type cards (Wash & Fold, Dry Clean, etc.)
- Pricing display
- Turnaround time estimate

Step 3: Garment Entry
- Add garment rows
- Type dropdown (Shirt, Trousers, etc.)
- Color, fabric, brand fields
- Observed issues text area
- Quantity field
- Photo upload (optional)

Step 4: Review
- Order summary table
- Price breakdown
- Total calculation
- Notes field

Step 5: Confirmation
- Order number display
- Print tags button
- Assign to lot button
- Payment button
```

### Customer-web: Order Placement

```
Services Page → Select Service → Order Flow (5 steps)

Step 1: Service
- Browse service catalog
- View pricing
- Select service

Step 2: Garments
- Add items
- Specify details
- Upload photos

Step 3: Pickup/Delivery
- Choose drop-off or pickup
- Select address
- Schedule date/time

Step 4: Review
- Order summary
- Price breakdown
- ETA

Step 5: Payment
- Select payment method
- Complete payment
- Order confirmation + QR code
```

---

## 3. API Flow

### Order Creation

```
POST /api/v1/orders
Request:
{
  "customerId": "uuid",
  "branchId": "uuid",
  "serviceTypeId": "uuid",
  "orderType": "walk_in",
  "items": [
    {
      "garmentTypeId": "uuid",
      "fabricTypeId": "uuid",
      "color": "blue",
      "quantity": 2,
      "observedIssue": "stain on collar"
    }
  ],
  "pricingType": "per_item",
  "notes": "Rush order"
}

Response:
{
  "id": "uuid",
  "orderNumber": "ORD-000001",
  "status": "pending",
  "totalAmount": 5000,
  "items": [...],
  "createdAt": "2026-05-25T10:00:00Z"
}
```

### Order Status Update

```
PUT /api/v1/orders/:id/status
Request:
{
  "status": "received",
  "notes": "Garments checked in"
}

Response:
{
  "id": "uuid",
  "status": "received",
  "previousStatus": "pending",
  "updatedAt": "2026-05-25T10:05:00Z"
}
```

---

## 4. Database Entities

### orders
- id (uuid, PK)
- tenant_id (uuid, FK)
- branch_id (uuid, FK)
- customer_id (uuid, FK)
- order_number (varchar)
- status (enum)
- service_type_id (uuid, FK)
- total_amount (decimal)
- payment_status (enum)
- created_at (timestamp)

### order_items
- id (uuid, PK)
- order_id (uuid, FK)
- garment_type_id (uuid, FK)
- fabric_type_id (uuid, FK)
- color (varchar)
- quantity (int)
- unit_price (decimal)
- line_total (decimal)
- status (enum)

---

## 5. Lifecycle States

```
pending → received → tagged → in_wash → in_dry → in_press → quality_check → ready → completed
```

See `31_GARMENT_LIFECYCLE_SRD.md` for full state machine.

---

## 6. Validations

### Order Creation
- [ ] Customer exists or is created
- [ ] Branch is active
- [ ] Service type is active
- [ ] At least 1 item
- [ ] Quantity > 0
- [ ] Pricing calculates correctly

### Status Transitions
- [ ] Valid transition from current state
- [ ] User has permission
- [ ] Required fields for new state

---

## 7. Permissions

| Role | Create Order | Update Status | View All Orders | Cancel Order |
|------|-------------|---------------|-----------------|--------------|
| counter_staff | ✅ | ✅ (own branch) | ✅ (own branch) | ✅ (before processing) |
| manager | ✅ | ✅ | ✅ | ✅ |
| admin | ✅ | ✅ | ✅ (all tenants) | ✅ (all tenants) |
| driver | ❌ | ❌ | ❌ | ❌ |

---

## 8. Failure Handling

| Failure | Handling |
|---------|----------|
| Customer not found | Prompt to create new customer |
| Service unavailable | Show error, suggest alternatives |
| Pricing calculation error | Log error, use default pricing |
| Payment failed | Order saved, payment status = "pending" |
| Printer error | Allow manual tag writing |

---

## 9. Notifications

| Event | Recipient | Channel | Timing |
|-------|-----------|---------|--------|
| Order created | Customer | Email/SMS | Immediate |
| Order received | Customer | SMS | Immediate |
| Order ready | Customer | SMS/WhatsApp | Immediate |
| Payment received | Customer | Email | Immediate |
| Payment failed | Customer | SMS | Immediate |

---

## 10. Edge Cases

- **Rush order**: Flag for priority processing, surcharge applied
- **Bulk order**: >50 items, special handling, potential discount
- **Damaged item**: Photo taken, customer notified before processing
- **Missing item**: Order marked incomplete, customer contacted
- **Price dispute**: Manager override, discount applied

---

## 11. Audit Requirements

- Order creation timestamp
- Status change history
- User who made changes
- Price calculation details
- Payment transaction IDs

---

## 12. Reporting Implications

- Orders by day/hour
- Revenue by service type
- Average order value
- Customer acquisition
- Conversion rate (inquiry → order)

---

## 13. Mobile Considerations

- Customer can place order via mobile app
- QR code for order tracking
- Push notification when ready
- Mobile payment integration
- Photo upload for garment condition
