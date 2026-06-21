# 32 — Delivery Logistics Spec

**Version:** 1.0.0  
**Status:** Active  
**Last Updated:** 2026-05-25  
**Related Modules:** delivery  
**Implementation Status:** Planned  
**Dependencies:** 20_NESTJS_MODULE_AND_TABLE_BLUEPRINT, 26_PRESSING_WEB_SPEC  

## 1. Purpose

Define pickup and delivery logistics for JanLunMS.

---

## 2. Delivery Types

| Type | Description | Actor |
|------|-------------|-------|
| Customer Drop-off | Customer brings to branch | Customer |
| Scheduled Pickup | Driver collects from customer | Driver |
| Scheduled Delivery | Driver delivers to customer | Driver |
| Express Delivery | Rush delivery (< 2h) | Driver |

---

## 3. Route Management

### Route Definition

```typescript
interface DeliveryRoute {
  id: uuid;
  tenant_id: uuid;
  branch_id: uuid;
  name: string;           // e.g. "Downtown Loop"
  code: string;           // e.g. "DT-01"
  area: Polygon;          // PostGIS geometry
  stops: DeliveryStop[];
  estimated_duration: number; // minutes
  is_active: boolean;
}
```

### Route Optimization

- Cluster orders by proximity
- Minimize total distance
- Respect time windows
- Balance load across drivers
- Consider traffic patterns

### Route Schedule

| Route | Frequency | Time Window |
|-------|-----------|-------------|
| Morning Pickup | Daily | 08:00 - 11:00 |
| Afternoon Delivery | Daily | 14:00 - 18:00 |
| Express | On-demand | Within 2 hours |

---

## 4. Driver Management

### Driver Profile

```typescript
interface Driver {
  id: uuid;
  employee_id: uuid;
  license_number: string;
  license_expiry: Date;
  vehicle_assignment: Vehicle;
  route_assignment: DeliveryRoute;
  shift_start: Time;
  shift_end: Time;
  max_stops_per_shift: number;
  current_status: 'available' | 'on_route' | 'break' | 'off_duty';
}
```

### Driver App Features

- Route list for today
- Stop-by-stop navigation
- Order details per stop
- QR scan for pickup/delivery
- Photo capture for proof
- Customer signature
- Status updates
- GPS tracking

---

## 5. Stop Management

### Stop Lifecycle

```
SCHEDULED → DRIVER_ASSIGNED → EN_ROUTE → ARRIVED → COMPLETED/FAILED
```

### Stop Types

| Type | Action | Proof Required |
|------|--------|----------------|
| Pickup | Collect garments | Photo of garments, QR scan |
| Delivery | Deliver garments | Photo of delivery, signature/QR |

### Failed Stop Reasons

- Customer not home
- Wrong address
- Access denied
- Customer refused
- Vehicle breakdown

---

## 6. Vehicle Management

### Vehicle Types

| Type | Capacity | Use Case |
|------|----------|----------|
| Motorcycle | 20kg | Express, single stops |
| Van | 200kg | Regular routes |
| Truck | 500kg | Bulk pickup/delivery |

### Vehicle Tracking

- GPS location every 30 seconds
- Speed monitoring
- Route deviation alerts
- Maintenance scheduling

---

## 7. Zone Management

### Zone Definition

```typescript
interface DeliveryZone {
  id: uuid;
  tenant_id: uuid;
  name: string;
  boundary: Polygon;
  pricing_multiplier: number;
  delivery_fee: number;
  min_order_amount: number;
  is_active: boolean;
}
```

### Zone Rules

- Customer address determines zone
- Zone affects delivery fee
- Zone affects minimum order
- Zone affects ETA

---

## 8. API Endpoints

```
GET    /api/v1/delivery/routes
POST   /api/v1/delivery/routes
GET    /api/v1/delivery/routes/:id
PUT    /api/v1/delivery/routes/:id
DELETE /api/v1/delivery/routes/:id

GET    /api/v1/delivery/stops
POST   /api/v1/delivery/stops/:id/complete
POST   /api/v1/delivery/stops/:id/fail

GET    /api/v1/delivery/vehicles
POST   /api/v1/delivery/vehicles

GET    /api/v1/delivery/drivers/assignments
POST   /api/v1/delivery/drivers/assign

GET    /api/v1/delivery/zones
POST   /api/v1/delivery/zones
```

---

## 9. Real-Time Features

- Driver location on map
- Stop status updates
- Route progress
- Delay alerts
- Customer notifications
