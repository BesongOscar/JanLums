# Feature Playbook: QR Tracking System

**Version:** 1.0.0  
**Status:** Active  
**Last Updated:** 2026-05-25  
**Related Modules:** qr-codes, orders, garments  
**Implementation Status:** Planned  
**Dependencies:** 20_NESTJS_MODULE_AND_TABLE_BLUEPRINT, 29_ORDER_AND_QR_SPEC  

## 1. Business Flow

### Overview
Every order, garment, and lot gets a unique QR code for tracking throughout the processing pipeline.

### QR Types

| Type | Prefix | Format | Usage |
|------|--------|--------|-------|
| Order | ORD- | ORD-000001 | Order header tracking |
| Garment | GAR- | GAR-000001 | Individual garment tracking |
| Lot | LOT- | LOT-000001 | Batch grouping |
| Pickup | PCK- | PCK-000001 | Customer pickup verification |
| Delivery | DLV- | DLV-000001 | Delivery confirmation |

---

## 2. UI Flow

### pressing-web: QR Scanner

```
QR Scan Button → Camera/Scanner Interface → Scan Result

Scan Result:
- Order/Garment details
- Current status
- Action buttons
- Status history
```

### Customer-mobile: QR Display

```
Order Confirmation → QR Code Display
- Large QR code
- Order number
- Instructions: "Show this at counter"
- Share button (WhatsApp/SMS)
```

---

## 3. API Flow

### Generate QR

```
POST /api/v1/qr/generate
Request:
{
  "type": "garment",
  "referenceId": "order-item-uuid",
  "expiresAt": null
}

Response:
{
  "id": "uuid",
  "tagCode": "GAR-000123",
  "qrImageUrl": "https://cdn.pressing237.com/qr/GAR-000123.png",
  "qrData": "JANLUNMS:1:GAR:tenant-id:ref-id:checksum"
}
```

### Validate QR

```
GET /api/v1/qr/:tagCode/validate
Response:
{
  "valid": true,
  "type": "garment",
  "reference": {
    "id": "uuid",
    "entity": "order_item",
    "details": { ... }
  }
}
```

### Scan Event

```
POST /api/v1/qr/scan
Request:
{
  "tagCode": "GAR-000123",
  "scanAction": "stage_transition",
  "metadata": {
    "location": "Branch A",
    "latitude": 3.848,
    "longitude": 11.502,
    "deviceId": "scanner-001"
  }
}
```

---

## 4. Database Entities

### qr_tags
- id (uuid, PK)
- tenant_id (uuid, FK)
- tag_code (varchar, unique per tenant)
- tag_type (enum: order, garment, lot, pickup, delivery)
- reference_id (uuid)
- reference_type (varchar)
- generation_method (enum: system, manual)
- expires_at (timestamp, nullable)
- is_active (boolean)
- created_at (timestamp)

### qr_scans
- id (uuid, PK)
- qr_tag_id (uuid, FK)
- scanned_by (uuid, FK)
- scanned_at (timestamp)
- scan_location (varchar)
- latitude (decimal)
- longitude (decimal)
- scan_action (enum)
- notes (text)

---

## 5. Lifecycle States

```
generated → printed → attached → scanned → [active | expired | voided]
```

---

## 6. Validations

- Tag code unique per tenant
- Reference ID valid and exists
- Expiry date in future (if set)
- Scanner has permission for action

---

## 7. Permissions

| Role | Generate QR | Reprint QR | Void QR | View Scan History |
|------|------------|------------|---------|-------------------|
| counter_staff | ✅ | ✅ | ❌ | ✅ (own branch) |
| manager | ✅ | ✅ | ✅ | ✅ |
| admin | ✅ | ✅ | ✅ | ✅ (all tenants) |

---

## 8. Failure Handling

- **Scan fails**: Manual code entry
- **Tag damaged**: Reprint by code
- **Expired tag**: Renew or create new
- **Duplicate scan**: Warn user, show last scan

---

## 9. Notifications

| Event | Recipient | Channel |
|-------|-----------|---------|
| QR generated | System | Internal log |
| QR scanned | System | Internal log |
| Invalid scan | Scanner user | UI error |
| Expired QR | Customer | SMS reminder |

---

## 10. Edge Cases

- **Lost tag**: Reprint, invalidate old
- **Wrong tag on garment**: Swap tags, log correction
- **Bulk generation**: Generate 100+ tags at once
- **Offline scanning**: Queue scans, sync later

---

## 11. Audit Requirements

- Every scan logged with timestamp, GPS, device
- Tag generation logged
- Tag voiding logged with reason
- Reprint count tracked

---

## 12. Reporting Implications

- Scan frequency by location
- Tag utilization rate
- Reprint rate
- Scan failure rate
- Peak scan times

---

## 13. Mobile Considerations

- Camera-based QR scanning
- Offline scan queue
- Batch scanning mode
- Flash toggle for dark environments
