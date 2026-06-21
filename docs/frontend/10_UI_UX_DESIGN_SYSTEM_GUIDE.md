# 10 — UI/UX and Design System Guide

**Version:** 1.0.0  
**Status:** Active  
**Last Updated:** 2026-05-25  
**Related Modules:** All frontend apps  
**Implementation Status:** In Progress  
**Dependencies:** 03_TECH_ARCHITECTURE, 24.5_FRONTEND_ARCHITECTURE_LOCK  

## 1. Purpose

Define UI/UX expectations and the component design system for JanLunMS web apps.

---

## 2. Design Goals

- Modern but operationally familiar
- Preserve useful legacy workflow structure from `janlums-main`
- Improve spacing, typography, and visual hierarchy
- Support operational efficiency for counter agents and managers
- Avoid generic dashboard look where specialized workflows are needed
- Fast scanning for high-volume environments (garment tags, order lists)

---

## 3. Styling System

Approved direction:
- **Tailwind CSS** for standard page layout, forms, buttons, cards, tables, spacing, modals
- **React Hook Form + Zod** for all complex forms
- **Scoped CSS** for garment tag builders or specialized grid components

Avoid:
- Random inline styles
- Mixing multiple ad-hoc style systems
- Importing old layout CSS that breaks current structure
- Unstructured CSS growth outside the above categories

---

## 4. Color Palette

| Token | Hex | Usage |
|---|---|---|
| `--color-primary` | `#0ea5e9` | Primary buttons, links, active states |
| `--color-primary-dark` | `#0284c7` | Hover states |
| `--color-success` | `#22c55e` | Success, completed, paid |
| `--color-warning` | `#f59e0b` | Warning, pending, hold |
| `--color-danger` | `#ef4444` | Error, cancelled, damage |
| `--color-info` | `#3b82f6` | Info, in-progress |
| `--color-neutral-50` | `#f8fafc` | Page background |
| `--color-neutral-100` | `#f1f5f9` | Card background |
| `--color-neutral-200` | `#e2e8f0` | Borders |
| `--color-neutral-800` | `#1e293b` | Primary text |
| `--color-neutral-900` | `#0f172a` | Headings |

### Status Color Mapping

| Order Status | Color | Badge Style |
|---|---|---|
| `pending` | warning | Yellow pill |
| `received` | info | Blue pill |
| `in_wash` | info | Blue pill |
| `in_dry` | info | Blue pill |
| `in_press` | info | Blue pill |
| `quality_check` | warning | Yellow pill |
| `ready` | success | Green pill |
| `out_for_delivery` | info | Blue pill |
| `completed` | success | Green pill |
| `cancelled` | danger | Red pill |
| `rewash` | warning | Yellow pill |
| `damaged` | danger | Red pill |

---

## 5. Component Library — pressing-web

### 5.1 PageTemplate

**File:** `src/components/PageTemplate.tsx`

The universal page frame for **every list-style page** in the portal.

Assembles in order:
1. `MainNav` (Tier 1 nav)
2. Domain `subNavBar` slot (Tier 2 nav — optional)
3. `TableCard` containing:
   - Filter band (left `filterSlot` + right `filters` pills + `subFilters` row)
   - List head (per-page count | section title | action button)
   - `DataTable`
   - Footer (per-page count + `Pagination`)
4. Modal (render-prop or controlled node)

**Key props:**

| Prop | Purpose |
|------|---------|
| `activeTab` | Highlights the correct MainNav domain tab |
| `subNavBar` | Domain SubNavBar component node |
| `panelTitle` | Green TableCard header title |
| `sectionTitle` | Title in the list head next to per-page selector |
| `filterSlot` | Left side of filter band — search inputs, selects, date pickers |
| `filters` | Right side — colored status/category pill buttons (`FilterDef[]`) |
| `subFilters` | Second row of filters below main band |
| `table` | `DataTable` node |
| `modal` | Modal node (controlled or render prop) |
| `footer` | Pagination node |

**Filter color inference:**

- No `color` prop → neutral gray
- `color: 'green'` → success actions (e.g., "Ready" filter)
- `color: 'red'` → danger actions (e.g., "Cancelled" filter)
- `color: 'blue'` → info actions (e.g., "In Progress" filter)
- `color: 'yellow'` → warning actions (e.g., "Pending" filter)

### 5.2 TableCard

**File:** `src/components/TableCard.tsx`

Wrapper for list content with consistent padding, border-radius, shadow, and background.

Contains:
- Header band (green title bar)
- Filter band
- List head
- Table area
- Footer

### 5.3 DataTable

**File:** `src/components/DataTable.tsx`

Sortable, paginated table with:
- Column headers with sort indicators
- Row hover states
- Action buttons per row
- Empty state
- Loading skeleton

### 5.4 StepModal

**File:** `src/components/StepModal.tsx`

Multi-step modal wizard for complex flows (e.g., Add Order, Employee Onboarding).

Contains:
- Step indicator header
- Navigation buttons (Back/Next/Finish)
- Content area per step
- Validation per step

### 5.5 OrderTimeline

**File:** `src/components/OrderTimeline.tsx`

Vertical timeline showing order status history:
- Status nodes with icons
- Timestamp and actor
- Current status highlighted
- Exception paths visible

---

## 6. Layout Patterns

### List Page Pattern

Used for: Orders, Customers, Employees, Inventory, etc.

```text
┌─────────────────────────────────────────┐
│  MainNav                                │
├─────────────────────────────────────────┤
│  SubNavBar (domain-specific)            │
├─────────────────────────────────────────┤
│  ┌───────────────────────────────────┐  │
│  │  TableCard                        │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │ Filter Band                 │  │  │
│  │  │ [Search] [Date]    [Status] │  │  │
│  │  └─────────────────────────────┘  │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │ List Head                   │  │  │
│  │  │ 25/page | Orders    [+ Add] │  │  │
│  │  └─────────────────────────────┘  │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │ DataTable                   │  │  │
│  │  │ ID  Customer  Status  ...   │  │  │
│  │  └─────────────────────────────┘  │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │ Footer                      │  │  │
│  │  │ 25/page          < 1 2 3 > │  │  │
│  │  └─────────────────────────────┘  │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### Detail Page Pattern

Used for: Order Detail, Customer Profile, Employee Profile

```text
┌─────────────────────────────────────────┐
│  MainNav                                │
├─────────────────────────────────────────┤
│  ┌───────────────────────────────────┐  │
│  │  Breadcrumb | Action Buttons      │  │
│  ├───────────────────────────────────┤  │
│  │  Profile Header + Status Badge    │  │
│  ├───────────────────────────────────┤  │
│  │  Tab: Overview | Items | History  │  │
│  ├───────────────────────────────────┤  │
│  │  Tab Content                      │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

---

## 7. Form Patterns

### Add Order Form

Steps:
1. Customer selection (search or new)
2. Service type and pricing
3. Garment items (with tag scan)
4. Pickup/delivery preference
5. Payment method
6. Review and confirm

### Add Employee Form

Steps:
1. Personal details
2. Role and department
3. Branch assignment
4. Salary configuration
5. Documents upload
6. Review and confirm

---

## 8. Responsive Behavior

### Desktop (≥1280px)
- Full three-tier navigation
- Side-by-side filter bands
- Full DataTable with all columns

### Tablet (768-1279px)
- Collapsed MainNav (hamburger)
- Stacked filter bands
- DataTable with horizontal scroll

### Mobile (<768px)
- Bottom tab nav (pressing-web)
- Card list instead of table
- Full-screen modals

---

## 9. Accessibility Requirements

- WCAG 2.1 AA compliance
- Keyboard navigation for all forms
- Screen reader labels for status badges
- Color not sole indicator (icons + text)
- Focus management in modals

---

## 10. Legacy UI References

### pressing-web

Use old `janlums` Laravel app for:
- Menu grouping and operational workflow concepts
- Forms and table layout structure
- Order processing workflow sequencing

Do not copy backend or legacy architecture — visual/workflow reference only.

### customer-web

Use old `eazyVoyages` passenger web for:
- Homepage structure
- Service catalog placement
- Customer marketing tone

Modernize: spacing, typography, cards, responsiveness.
