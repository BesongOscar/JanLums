# Feature Playbook: Delivery Logistics

**Version:** 1.0.0  
**Status:** Active  
**Last Updated:** 2026-05-25  
**Related Modules:** delivery  
**Implementation Status:** Planned  
**Dependencies:** 20_NESTJS_MODULE_AND_TABLE_BLUEPRINT, 32_DELIVERY_LOGISTICS_SPEC  

## 1. Business Flow

### Overview
Pickup and delivery of garments from/to customers via scheduled routes.

### Actors
- **Customer**: Requests pickup/delivery, provides address
- **Counter Staff**: Schedules delivery, assigns routes
- **Driver**: Executes pickup/delivery
- **Manager**: Monitors routes, handles exceptions

### Primary Flow

```
1. Customer requests pickup (via app/phone/walk-in)
2. System creates delivery request
3. Counter staff assigns to route
4. Driver receives route assignment
5. Driver navigates to customer address
6. Driver scans QR or collects signature
7. Garments brought to branch (pickup) or delivered (delivery)
8. Delivery status updated
9. Customer notified
```

---

## 2. UI Flow

### pressing-web: Route Management

```
Delivery Page → Routes Tab → Route Detail

Route Detail:
- Map with stops
- Stop list with status
- Driver assignment
- ETA calculations
- Optimization suggestions
```

### Driver Mobile View

```
Today's Routes → Route Detail → Stop-by-Stop

Per Stop:
- Customer details
- Address with navigation
- Order summary
- QR scan button
- Photo capture
- Signature pad
- Status update buttons
```

---

## 3. API Flow

### Create Route

```
POST /api/v1/delivery/routes
Request:
{
  "name": "Downtown Morning",
  "branchId": "uuid",
  "area": {
    "type": "Polygon",
    "coordinates": [...]
  }
}
```

### Assign Orders to Route

```
POST /api/v1/delivery/routes/:id/assign
Request:
{
  "orderIds": ["uuid1", "uuid2"],
  "driverId": "uuid"
}
```

### Update Stop Status

```
POST /api/v1/delivery/stops/:id/status
Request:
{
  "status": "completed",
  "proof": {
    "photoUrl": "https://...",
    "signature": "base64...",
    "qrScan": "DLV-000123"
  }
}
```

---

## 4. Database Entities

### delivery_routes
- id (uuid, PK)
- tenant_id (uuid, FK)
- branch_id (uuid, FK)
- name (varchar)
- area_coverage (geometry)
- estimated_duration_minutes (int)
- is_active (boolean)

### delivery_stops
- id (uuid, PK)
- route_id (uuid, FK)
- order_id (uuid, FK)
- stop_type (enum: pickup, delivery)
- address (text)
- latitude (decimal)
- longitude (decimal)
- scheduled_time (timestamp)
- actual_time (timestamp)
- status (enum)
- notes (text)

---

## 5. Lifecycle States

```
scheduled → assigned → en_route → arrived → [completed | failed]
```

---

## 6. Validations

- Address valid and geocodable
- Driver assigned and available
- Vehicle capacity sufficient
- Time window respected
- Order status appropriate for stop type

---

## 7. Permissions

| Role | Create Route | Assign Driver | Update Stop | View Routes |
|------|-------------|---------------|-------------|-------------|
| counter_staff | ❌ | ❌ | ❌ | ✅ (own branch) |
| manager | ✅ | ✅ | ✅ | ✅ |
| driver | ❌ | ❌ | ✅ (own stops) | ✅ (own route) |

---

## 8. Failure Handling

| Failure | Handling |
|---------|----------|
| Customer not home | Reschedule, leave note |
| Wrong address | Contact customer, update address |
| Vehicle breakdown | Reassign to another driver |
| Traffic delay | Update ETA, notify customer |
| Access denied | Contact customer, escalate |

---

## 9. Notifications

| Event | Recipient | Channel |
|-------|-----------|---------|
| Route assigned | Driver | Push |
| En route | Customer | SMS |
| Arrived | Customer | SMS |
| Completed | Customer | SMS |
| Failed | Manager | Push |

---

## 10. Edge Cases

- **Express delivery**: <2h, dedicated driver
- **Bulk pickup**: >10 orders, special route
- **Reschedule**: Customer requests different time
- **Missed stop**: Return next day or customer pickup

---

## 11. Audit Requirements

- GPS tracking per stop
- Photo proof of delivery
- Signature capture
- Timestamp of each status change

---

## 12. Reporting Implications

- Delivery success rate
- Average delivery time
- Driver efficiency
- Route optimization savings
- Customer satisfaction by route

---

## 13. Mobile Considerations

- GPS navigation to stops
- Offline mode for rural areas
- Battery optimization
- Photo compression for upload
- Signature capture on screen
