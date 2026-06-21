# 05 — Order Status Translation Layer

**Version:** 2.0.0
**Status:** Active
**Last Updated:** 2026-06-20
**Revisions Applied:** #5 (Status Translation)

---

## 1. Purpose

Backend order statuses are implementation details. Customers should never see raw database values like `in_wash` or `quality_check`. This document defines the translation system.

---

## 2. Status Translation Map

```typescript
// src/utils/statusMapper.ts

export interface StatusTranslation {
  label: string;           // Customer-facing label
  description: string;     // Detailed explanation
  color: string;           // Badge/timeline color
  backgroundColor: string; // Badge background
  icon: string;            // Icon name
  showInTimeline: boolean; // Show in order timeline
  timelinePosition: number; // Order in timeline (1-9)
  isTerminal: boolean;     // Is this a final state?
}

export const STATUS_MAP: Record<string, StatusTranslation> = {
  pending: {
    label: 'Order Placed',
    description: 'Your order has been received and is awaiting confirmation.',
    color: '#D97706',
    backgroundColor: '#FEF3C7',
    icon: 'clock-outline',
    showInTimeline: true,
    timelinePosition: 1,
    isTerminal: false,
  },
  received: {
    label: 'Received at Branch',
    description: 'Your garments have been received at our branch.',
    color: '#2563EB',
    backgroundColor: '#DBEAFE',
    icon: 'home-check',
    showInTimeline: true,
    timelinePosition: 2,
    isTerminal: false,
  },
  tagged: {
    label: 'Garments Tagged',
    description: 'Your garments have been tagged and are ready for processing.',
    color: '#4F46E5',
    backgroundColor: '#E0E7FF',
    icon: 'tag',
    showInTimeline: false,
    timelinePosition: 0,
    isTerminal: false,
  },
  in_wash: {
    label: 'Washing in Progress',
    description: 'Your garments are being washed.',
    color: '#0891B2',
    backgroundColor: '#CFFAFE',
    icon: 'water',
    showInTimeline: true,
    timelinePosition: 3,
    isTerminal: false,
  },
  in_dry: {
    label: 'Drying',
    description: 'Your garments are being dried.',
    color: '#0D9488',
    backgroundColor: '#CCFBF1',
    icon: 'weather-windy',
    showInTimeline: true,
    timelinePosition: 4,
    isTerminal: false,
  },
  in_press: {
    label: 'Ironing',
    description: 'Your garments are being ironed.',
    color: '#EA580C',
    backgroundColor: '#FED7AA',
    icon: 'iron',
    showInTimeline: true,
    timelinePosition: 5,
    isTerminal: false,
  },
  quality_check: {
    label: 'Quality Inspection',
    description: 'Your garments are undergoing quality inspection.',
    color: '#7C3AED',
    backgroundColor: '#EDE9FE',
    icon: 'check-circle',
    showInTimeline: true,
    timelinePosition: 6,
    isTerminal: false,
  },
  ready: {
    label: 'Ready for Pickup',
    description: 'Your garments are ready! Please pick them up at your branch.',
    color: '#059669',
    backgroundColor: '#D1FAE5',
    icon: 'check-circle',
    showInTimeline: true,
    timelinePosition: 7,
    isTerminal: false,
  },
  out_for_delivery: {
    label: 'Out for Delivery',
    description: 'Your garments are on the way to you.',
    color: '#0284C7',
    backgroundColor: '#E0F2FE',
    icon: 'truck-delivery',
    showInTimeline: true,
    timelinePosition: 8,
    isTerminal: false,
  },
  completed: {
    label: 'Completed',
    description: 'Your order has been completed. Thank you!',
    color: '#047857',
    backgroundColor: '#D1FAE5',
    icon: 'check-all',
    showInTimeline: true,
    timelinePosition: 9,
    isTerminal: true,
  },
  cancelled: {
    label: 'Cancelled',
    description: 'Your order has been cancelled.',
    color: '#DC2626',
    backgroundColor: '#FEE2E2',
    icon: 'close-circle',
    showInTimeline: false,
    timelinePosition: 0,
    isTerminal: true,
  },
  rewash: {
    label: 'Being Rewashed',
    description: 'Your garments need additional cleaning. No extra charge.',
    color: '#E11D48',
    backgroundColor: '#FFE4E6',
    icon: 'refresh',
    showInTimeline: false,
    timelinePosition: 0,
    isTerminal: false,
  },
  damaged: {
    label: 'Issue Reported',
    description: 'An issue was found with your garment. Our team will contact you.',
    color: '#BE123C',
    backgroundColor: '#FECDD3',
    icon: 'alert',
    showInTimeline: false,
    timelinePosition: 0,
    isTerminal: true,
  },
  on_hold: {
    label: 'On Hold',
    description: 'Your order is on hold. Our team will contact you shortly.',
    color: '#CA8A04',
    backgroundColor: '#FEF9C3',
    icon: 'pause-circle',
    showInTimeline: false,
    timelinePosition: 0,
    isTerminal: false,
  },
};
```

---

## 3. Timeline Display Rules

### Standard Timeline (Happy Path)

Only statuses with `showInTimeline: true` appear:

```
┌─────────────────────────────────────────────┐
│  Order #ORD-a1b2c3d4                         │
│                                              │
│  ● Order Placed              Jun 18, 08:30   │
│  │                                           │
│  ● Received at Branch        Jun 18, 14:00   │
│  │                                           │
│  ● Washing in Progress       Jun 19, 09:00   │
│  │                                           │
│  ● Drying                    Jun 19, 11:00   │
│  │                                           │
│  ○ Ironing                                  │ ← current
│  │                                           │
│  ○ Quality Inspection                       │
│  │                                           │
│  ○ Ready for Pickup                          │
│  │                                           │
│  ○ Completed                                 │
│                                              │
└─────────────────────────────────────────────┘

Legend:
● = Completed step
○ = Upcoming step
◐ = In progress (current)
```

### Non-Timeline Statuses

These statuses are shown as banners, not timeline steps:

| Status | Banner Style |
|--------|-------------|
| `cancelled` | Red banner at top |
| `rewash` | Orange banner: "Being reprocessed" |
| `damaged` | Red banner: "Issue reported" |
| `on_hold` | Yellow banner: "Order on hold" |

---

## 4. Color System

```typescript
// Status colors by category
const STATUS_COLORS = {
  // Progress (blues/greens)
  progress: {
    pending:     '#D97706', // Amber
    received:    '#2563EB', // Blue
    tagged:      '#4F46E5', // Indigo
    in_wash:     '#0891B2', // Cyan
    in_dry:      '#0D9488', // Teal
    in_press:    '#EA580C', // Orange
    quality_check: '#7C3AED', // Purple
    ready:       '#059669', // Emerald
    out_for_delivery: '#0284C7', // Sky
    completed:   '#047857', // Green
  },
  // Exception (reds/yellows)
  exception: {
    cancelled:   '#DC2626', // Red
    rewash:      '#E11D48', // Rose
    damaged:     '#BE123C', // Pink
    on_hold:     '#CA8A04', // Yellow
  },
};
```

### Badge Component

```typescript
// Usage in React Native Paper
<Badge style={{ backgroundColor: status.backgroundColor, color: status.color }}>
  {status.label}
</Badge>
```

---

## 5. Status Progress Calculation

```typescript
export function getProgressPercent(status: string): number {
  const timelineStatuses = [
    'pending', 'received', 'tagged', 'in_wash',
    'in_dry', 'in_press', 'quality_check', 'ready', 'completed'
  ];
  
  const index = timelineStatuses.indexOf(status);
  if (index === -1) return 0;
  
  return Math.round((index / (timelineStatuses.length - 1)) * 100);
}

// Examples:
// pending → 0%
// in_wash → 38%
// ready → 88%
// completed → 100%
```

---

## 6. Push Notification Mapping

| Backend Status | Notification Title | Notification Body |
|---------------|-------------------|-------------------|
| `received` | "Order Received" | "Your order #{orderId} has been checked in at {branch}" |
| `in_wash` | "Washing Started" | "Your garments are being washed" |
| `ready` | "Ready for Pickup" | "Your order #{orderId} is ready! Visit {branch}" |
| `out_for_delivery` | "Out for Delivery" | "Your order is on its way" |
| `completed` | "Order Complete" | "Thank you! Your order #{orderId} is complete" |
| `cancelled` | "Order Cancelled" | "Your order #{orderId} has been cancelled" |
| `damaged` | "Issue Reported" | "We found an issue with your order. Please contact us" |

---

## 7. Time Estimation Display

```typescript
export function getEstimatedTime(status: string, estimatedHours: number): string {
  const now = new Date();
  const estimated = new Date(now.getTime() + estimatedHours * 60 * 60 * 1000);
  
  return `Estimated ready by ${formatDate(estimated, 'time')} today`;
}
```

### Status → Time Mapping

| Status | Estimated Remaining |
|--------|-------------------|
| `pending` | Full processing time |
| `received` | ~4-6 hours |
| `in_wash` | ~3-4 hours |
| `in_dry` | ~2-3 hours |
| `in_press` | ~1-2 hours |
| `quality_check` | ~30 minutes |
| `ready` | Ready now |
| `completed` | Done |
