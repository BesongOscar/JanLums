# 31 — Garment Lifecycle SRD

**Version:** 1.0.0  
**Status:** Active  
**Last Updated:** 2026-05-25  
**Related Modules:** orders, garments, qr-codes  
**Implementation Status:** In Progress  
**Dependencies:** 20_NESTJS_MODULE_AND_TABLE_BLUEPRINT, 29_ORDER_AND_QR_SPEC  

## 1. Purpose

Software Requirements Document for the garment processing lifecycle.

---

## 2. Overview

Every garment in the system flows through a defined pipeline from drop-off to return. This SRD defines:

- State machine
- Actor responsibilities
- Exception handling
- Quality gates
- Audit requirements

---

## 3. Actors

| Actor | Role | Actions |
|-------|------|---------|
| Customer | Drops off / requests pickup | Create order, approve rewash, pickup |
| Counter Staff | Front desk | Receive, tag, checkout, handle complaints |
| Washer | Machine operator | Load, wash, transfer |
| Dryer | Drying operator | Load, dry, transfer |
| Presser | Finishing operator | Press, fold, package |
| QC Inspector | Quality control | Inspect, pass/fail, damage assessment |
| Driver | Pickup/delivery | Collect, deliver, confirm |
| Manager | Branch manager | Override, compensation, reporting |

---

## 4. State Machine

### Normal Flow

```
DROP_OFF → CHECK_IN → TAGGING → WASHING → DRYING → PRESSING → QC → READY → RETURN
```

### State Definitions

| State | Duration | Location | Actor |
|-------|----------|----------|-------|
| DROP_OFF | 0-5 min | Counter | Customer/Counter Staff |
| CHECK_IN | 5-10 min | Counter | Counter Staff |
| TAGGING | 10-15 min | Tagging station | Counter Staff |
| WASHING | 30-60 min | Wash floor | Washer |
| DRYING | 20-40 min | Dry floor | Dryer |
| PRESSING | 15-30 min | Press station | Presser |
| QC | 5-10 min | QC station | QC Inspector |
| READY | Variable | Shelf | System |
| RETURN | 5-10 min | Counter | Customer/Driver |

---

## 5. Exception Handling

### 5.1 Rewash Required

**Trigger:** QC finds garment not clean
**Flow:**
1. QC marks `QC_FAIL - REWASH`
2. System notifies washer
3. Garment returns to WASHING
4. Priority: Express → top of queue
5. Re-wash count incremented
6. Max 3 rewashes, then manager review

### 5.2 Damage Found

**Trigger:** QC finds damage (tear, discoloration, missing button)
**Flow:**
1. QC marks `QC_FAIL - DAMAGE`
2. Photo taken
3. Customer notified (SMS/WhatsApp)
4. Manager assesses:
   - Repairable → send to repair
   - Not repairable → compensation
5. Resolution logged
6. Order status updated

### 5.3 Lost Garment

**Trigger:** Garment cannot be located
**Flow:**
1. Staff marks `MISSING`
2. Search protocol (30 min)
3. If found → resume flow
4. If not found:
   - Customer notified
   - Compensation calculation
   - Insurance claim (if applicable)

### 5.4 Customer No-Show

**Trigger:** Order ready, customer doesn't pickup
**Flow:**
1. Day 1: Notification sent
2. Day 3: Reminder
3. Day 7: Final notice
4. Day 14: Order moved to `ON_HOLD`
5. Day 30: Manager review, disposal protocol

---

## 6. Quality Gates

### QC Checklist

- [ ] Cleanliness (no stains, odors)
- [ ] Press quality (no wrinkles, proper creases)
- [ ] Damage check (tears, holes, missing parts)
- [ ] Color fastness (no bleeding)
- [ ] Packaging (proper fold, bag, tag)

### QC Decision Matrix

| Clean | Press | Damage | Decision | Next State |
|-------|-------|--------|----------|------------|
| Pass | Pass | None | PASS | READY |
| Fail | Pass | None | REWASH | WASHING |
| Pass | Fail | None | REPRESS | PRESSING |
| Pass | Pass | Minor | DAMAGE | MANAGER |
| Pass | Pass | Major | DAMAGE | MANAGER |

---

## 7. Audit Requirements

Every state transition logged:
- Timestamp
- Actor
- From state
- To state
- Reason/notes
- GPS location (if mobile scan)

Retention: 7 years

---

## 8. Performance Requirements

| Metric | Target |
|--------|--------|
| Check-in time | < 5 min per order |
| Tagging time | < 2 min per garment |
| Wash cycle | Per care label |
| QC time | < 1 min per garment |
| Ready notification | Within 5 min of QC pass |
| Total turnaround | Per service type SLA |

---

## 9. SLA by Service Type

| Service | Standard | Express | Rush |
|---------|----------|---------|------|
| Wash & Fold | 24h | 8h | 4h |
| Wash & Iron | 48h | 24h | 12h |
| Dry Clean | 72h | 48h | 24h |
