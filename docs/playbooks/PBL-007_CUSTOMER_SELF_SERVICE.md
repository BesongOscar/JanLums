# Feature Playbook: Customer Self-Service

**Version:** 1.0.0  
**Status:** Active  
**Last Updated:** 2026-05-25  
**Related Modules:** customer-web, customer-mobile  
**Implementation Status:** Planned  
**Dependencies:** 25_CUSTOMER_WEB_SPEC, 27_CUSTOMER_MOBILE_SPEC  

## 1. Business Flow

### Overview
Customers can place orders, track status, manage profile, view history, and make payments via web and mobile apps.

### Primary Flow

```
1. Customer visits pressing237 website or opens mobile app
2. Browses service catalog
3. Selects service and adds garments
4. Chooses pickup or drop-off
5. Reviews order and pricing
6. Makes payment
7. Receives order confirmation with QR code
8. Tracks order status in real-time
9. Receives notification when ready
10. Shows QR at counter for pickup or receives delivery
```

---

## 2. UI Flow

### customer-web: Order Placement

```
Home → Services → Order Form → Review → Payment → Confirmation

Order Form Steps:
1. Service Selection
   - Service cards with pricing
   - Turnaround time
   - Description

2. Garment Details
   - Add garment rows
   - Type, color, fabric
   - Photo upload
   - Special instructions

3. Pickup/Delivery
   - Drop-off at branch
   - Schedule pickup
   - Address selection
   - Date/time picker

4. Review
   - Order summary
   - Price breakdown
   - Estimated ready date

5. Payment
   - Payment method
   - Card/mobile money form
   - Confirm payment
```

### customer-web: Order Tracking

```
Track Page → Enter Order Number → Status Timeline

Status Timeline:
- Visual timeline with icons
- Current status highlighted
- Completed steps checked
- Upcoming steps grayed
- Exception alerts
- Map for delivery tracking
```

---

## 3. API Flow

### Place Order

```
POST /api/v1/orders
Request:
{
  "serviceTypeId": "uuid",
  "items": [
    {
      "garmentTypeId": "uuid",
      "color": "blue",
      "quantity": 2,
      "specialInstructions": "Delicate"
    }
  ],
  "orderType": "pickup",
  "addressId": "uuid",
  "scheduledDate": "2026-05-26T10:00:00Z",
  "paymentMethod": "mtn_momo"
}
```

### Track Order

```
GET /api/v1/orders/:id/track
Response:
{
  "orderNumber": "ORD-000001",
  "status": "in_wash",
  "estimatedReady": "2026-05-26T18:00:00Z",
  "timeline": [
    {
      "status": "received",
      "completedAt": "2026-05-25T10:00:00Z",
      "completed": true
    },
    {
      "status": "in_wash",
      "completedAt": null,
      "completed": false,
      "current": true
    }
  ]
}
```

---

## 4. Database Entities

See `20_NESTJS_MODULE_AND_TABLE_BLUEPRINT.md` for full schema.

---

## 5. Lifecycle States

Order states: `pending → received → tagged → in_wash → in_dry → in_press → quality_check → ready → completed`

---

## 6. Validations

- Phone number valid
- Address complete
- Payment method valid
- Service available at selected branch
- Scheduled time in business hours

---

## 7. Permissions

| Action | Guest | Customer | Admin |
|--------|-------|----------|-------|
| Browse catalog | ✅ | ✅ | ✅ |
| Place order | ❌ | ✅ | ✅ |
| Track order | ✅ (with number) | ✅ | ✅ |
| View history | ❌ | ✅ | ✅ |
| Manage profile | ❌ | ✅ | ✅ |

---

## 8. Failure Handling

| Failure | Handling |
|---------|----------|
| Payment fails | Save order, retry payment |
| Address not found | Manual entry, geocode later |
| Service unavailable | Suggest alternatives |
| Time slot full | Suggest next available |
| Session expired | Save draft, prompt login |

---

## 9. Notifications

| Event | Channel | Timing |
|-------|---------|--------|
| Order confirmed | Email | Immediate |
| Order received | SMS | Immediate |
| Status update | Push | Real-time |
| Ready for pickup | SMS + Push | Immediate |
| Delivery en route | Push + SMS | 30 min before |
| Payment receipt | Email | Immediate |

---

## 10. Edge Cases

- **Guest checkout**: Allow order without account
- **Reorder**: One-click repeat previous order
- **Split order**: Separate express vs standard items
- **Subscription**: Weekly/monthly recurring orders
- **Gift order**: Send to different address

---

## 11. Audit Requirements

- Order history retained 7 years
- Payment records immutable
- Status changes logged
- Customer communications archived

---

## 12. Reporting Implications

- Customer lifetime value
- Order frequency
- Average order value
- Churn rate
- Channel preference (web vs mobile)

---

## 13. Mobile Considerations

- Push notifications for status updates
- QR code for quick pickup
- GPS for address auto-fill
- Camera for garment photos
- Biometric login
- Offline order draft
