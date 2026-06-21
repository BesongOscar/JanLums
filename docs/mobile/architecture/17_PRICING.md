# 17 — Pricing Authority

**Version:** 2.0.0
**Status:** Active
**Last Updated:** 2026-06-20
**Revisions Applied:** #6 (Pricing Authority)

---

## 1. Pricing Authority Matrix

| Calculation | Authority | Source | Mobile Role |
|-------------|-----------|--------|-------------|
| Service base price | Backend | `Service.basePrice` | Display only |
| Express surcharge | Backend | `Service.expressPrice` | Display only |
| Item quantity × unit price | Client (estimated) | `OrderDraftStore` | Display only |
| Subtotal | **Backend** | Calculated on `POST /orders` | Read only |
| Tax (TVA 19.25%) | **Backend** | Business rules | Read only |
| Discounts | **Backend** | Promotion engine | Read only |
| Final total | **Backend** | Returned in order response | Read only |

---

## 2. Mobile Pricing Display

### ServiceSelectScreen

```
┌─────────────────────────────────────┐
│  Service: Wash & Fold               │
│  Starting from 1,500 XAF/item       │
│                                     │
│  ⓘ Final price calculated at checkout│
└─────────────────────────────────────┘
```

### OrderReviewScreen

```
┌─────────────────────────────────────┐
│  Order Summary                      │
│                                     │
│  3x Shirt    @ 1,500 XAF  4,500 XAF│
│  1x Trouser  @ 2,000 XAF  2,000 XAF│
│  ─────────────────────────────     │
│  Subtotal (estimated):     6,500 XAF│
│  Tax (estimated):          ~1,252 XAF│
│  ─────────────────────────────     │
│  Total (estimated):        ~7,752 XAF│
│                                     │
│  ⓘ Final price confirmed by backend │
│     when order is placed            │
│                                     │
│  [ Place Order ]                    │
└─────────────────────────────────────┘
```

### ConfirmationScreen (After Order Created)

```
┌─────────────────────────────────────┐
│  ✓ Order Confirmed                  │
│                                     │
│  Order #ORD-a1b2c3d4                │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  3x Shirt          4,500 XAF│   │
│  │  1x Trouser        2,000 XAF│   │
│  │  ──────────────────────     │   │
│  │  Subtotal          6,500 XAF│   │
│  │  Tax (TVA)         1,252 XAF│   │
│  │  ──────────────────────     │   │
│  │  Total             7,752 XAF│   │
│  └─────────────────────────────┘   │
│                                     │
│  Payment: Pay at branch             │
│                                     │
└─────────────────────────────────────┘
```

---

## 3. OrderDraftStore Revised

```typescript
interface OrderDraftState {
  // ... other fields ...

  // ESTIMATES ONLY — not authoritative
  getEstimatedSubtotal: () => number;
  getEstimatedTax: () => number;
  getEstimatedTotal: () => number;
}

// Implementation:
getEstimatedSubtotal: () => {
  return items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
}

getEstimatedTax: () => {
  // Display only — backend calculates actual tax
  return Math.round(getEstimatedSubtotal() * 0.1925);
}

getEstimatedTotal: () => {
  const subtotal = getEstimatedSubtotal();
  const tax = getEstimatedTax();
  const express = isExpress ? subtotal * 0.5 : 0;
  return subtotal + tax + express;
}
```

---

## 4. Backend Price Confirmation

After `POST /orders`, the response contains authoritative prices:

```typescript
// API response from POST /orders
const response = await api.post('/orders', orderPayload);
const order = response.data;

// Backend-computed values:
order.subtotal    // Authoritative
order.tax         // Authoritative
order.discount    // Authoritative
order.total       // Authoritative

// Mobile must update UI to show backend prices, not estimates
```

---

## 5. Currency Display

```typescript
// packages/utils/src/index.ts
export function formatCurrency(amount: number, currency: string = 'XAF'): string {
  return new Intl.NumberFormat('fr-CM', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Examples:
formatCurrency(1500)    // "1 500 XAF"
formatCurrency(7752)    // "7 752 XAF"
```
