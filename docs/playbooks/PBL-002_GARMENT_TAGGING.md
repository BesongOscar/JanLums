# Feature Playbook: Garment Tagging & QC

**Version:** 1.0.0  
**Status:** Active  
**Last Updated:** 2026-05-25  
**Related Modules:** garments, orders, qr-codes  
**Implementation Status:** In Progress  
**Dependencies:** 20_NESTJS_MODULE_AND_TABLE_BLUEPRINT, 31_GARMENT_LIFECYCLE_SRD  

## 1. Business Flow

### Overview
Garments are tagged with unique QR codes at intake, tracked through processing, and quality-checked before release.

### Actors
- **Counter Staff**: Tags garments, assigns lots
- **Washer**: Loads/unloads machines
- **Dryer**: Transfers to drying
- **Presser**: Finishes garments
- **QC Inspector**: Quality control gate
- **Manager**: Handles exceptions, damage claims

### Primary Flow

```
1. Garments received at counter
2. Counter staff prints QR tags
3. Tags attached to each garment
4. Garments grouped into lots
5. Lot assigned to wash cycle
6. Washer scans QR, loads machine
7. Wash complete → scan → transfer to dry
8. Dry complete → scan → transfer to press
9. Press complete → scan → transfer to QC
10. QC inspector scans → inspects → passes or fails
11. If pass: garments packaged, marked ready
12. If fail: returned to wash (rewash) or damage logged
```

---

## 2. UI Flow

### pressing-web: Garment Tracking

```
Garments Page → Scan QR or Search → Garment Detail

Garment Detail View:
- QR code image
- Garment photo (before/after)
- Current status
- Status history timeline
- Order details
- Customer info
- Action buttons (status update)
```

### pressing-web: QC Interface

```
Quality Check Page → Scan Garment QR → QC Form

QC Form:
- Garment details
- Photos (before processing)
- Cleanliness check ✓/✗
- Press quality check ✓/✗
- Damage check ✓/✗
- Color fastness check ✓/✗
- Decision: PASS / REWASH / DAMAGE
- Notes field
- Photo upload (if damage)
```

---

## 3. API Flow

### Generate QR Tag

```
POST /api/v1/qr/generate
Request:
{
  "type": "garment",
  "referenceId": "order-item-uuid"
}

Response:
{
  "tagCode": "GAR-000123",
  "qrImageUrl": "https://.../qr/GAR-000123.png"
}
```

### Scan QR Tag

```
POST /api/v1/qr/scan
Request:
{
  "tagCode": "GAR-000123",
  "scanAction": "stage_transition",
  "newStatus": "in_wash",
  "location": "Branch A - Wash Floor",
  "scannedBy": "user-uuid"
}

Response:
{
  "success": true,
  "garment": {
    "id": "uuid",
    "status": "in_wash",
    "previousStatus": "tagged"
  },
  "allowedActions": ["in_dry", "damaged"]
}
```

### QC Decision

```
POST /api/v1/garments/:id/qc
Request:
{
  "decision": "pass",
  "checks": {
    "cleanliness": true,
    "pressQuality": true,
    "damage": false,
    "colorFastness": true
  },
  "notes": "Good quality"
}
```

---

## 4. Database Entities

### order_items (garment tracking)
- id (uuid, PK)
- order_id (uuid, FK)
- garment_type_id (uuid, FK)
- fabric_type_id (uuid, FK)
- color (varchar)
- status (enum)
- qr_tag_id (uuid, FK)
- before_photo_url (varchar)
- after_photo_url (varchar)
- qc_notes (text)
- rewash_count (int)

### qr_tags
- id (uuid, PK)
- tag_code (varchar)
- tag_type (enum)
- reference_id (uuid)
- is_active (boolean)

---

## 5. Lifecycle States

```
tagged → in_wash → in_dry → in_press → quality_check → [ready | rewash | damaged]
```

**Rewash loop:**
```
quality_check → rewash → in_wash → ... → quality_check
```

**Max 3 rewashes, then manager review.**

---

## 6. Validations

### Tag Generation
- [ ] Unique tag code per tenant
- [ ] Valid reference ID
- [ ] Type matches reference

### Scan
- [ ] Tag exists and is active
- [ ] Valid transition from current status
- [ ] Scanner has permission
- [ ] Location provided

### QC
- [ ] All checkboxes completed
- [ ] Notes provided for fail
- [ ] Photo uploaded for damage

---

## 7. Permissions

| Role | Tag Garment | Scan QR | Update Status | QC Decision |
|------|------------|---------|---------------|-------------|
| counter_staff | ✅ | ✅ | ✅ (initial) | ❌ |
| washer | ❌ | ✅ | ✅ (wash→dry) | ❌ |
| presser | ❌ | ✅ | ✅ (press→QC) | ❌ |
| qc_inspector | ❌ | ✅ | ❌ | ✅ |
| manager | ✅ | ✅ | ✅ (override) | ✅ |

---

## 8. Failure Handling

| Failure | Handling |
|---------|----------|
| QR scan fails | Manual entry by tag code |
| Tag lost/damaged | Reprint tag, link to garment |
| Wrong status transition | Error message, show valid transitions |
| QC device offline | Paper form, sync later |
| Garment damaged in process | Photo, notify customer, manager review |

---

## 9. Notifications

| Event | Recipient | Channel |
|-------|-----------|---------|
| Garment tagged | System | Internal |
| Rewash required | Washer | Push notification |
| Damage found | Customer | SMS/WhatsApp |
| QC passed | System | Internal |
| Ready for pickup | Customer | SMS/WhatsApp |

---

## 10. Edge Cases

- **Missing tag**: Search by order number, reprint
- **Wrong garment scanned**: Undo scan, rescan correct garment
- **Partial lot**: Some garments pass QC, some rewash
- **Customer refuses rewash**: Offer discount or compensation
- **Express order**: Skip queue, priority processing

---

## 11. Audit Requirements

- Every scan logged with timestamp, user, location
- QC decisions recorded with photos
- Rewash count tracked
- Damage reports with customer communication

---

## 12. Reporting Implications

- Garments processed per hour
- QC pass/fail rate
- Rewash rate by service type
- Damage rate by fabric type
- Employee productivity

---

## 13. Mobile Considerations

- Staff mobile app for QR scanning
- Offline scan queue (sync when online)
- Photo capture for QC
- Push notifications for rewash assignments
