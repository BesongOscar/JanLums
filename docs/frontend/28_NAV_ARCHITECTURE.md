# 28 — Navigation Architecture

**Version:** 1.0.0  
**Status:** Active  
**Last Updated:** 2026-05-25  
**Related Modules:** pressing-web, admin-web  
**Implementation Status:** In Progress  
**Dependencies:** 26_PRESSING_WEB_SPEC, 24_ADMIN_DASHBOARD_SCOPE  

## 1. Purpose

This document defines the three-tier navigation system used in `apps/pressing-web` (pressing237 portal).

It is the authoritative reference for:
- which nav components exist
- which routes each component covers
- how active-state detection works
- the complete routing table

---

## 2. Three-Tier Navigation Hierarchy

```
┌─────────────────────────────────────────────────────────┐
│  Tier 1 — MainNav                                       │
│  Dashboard | Orders | Lots | Garments | Customers |     │
│  Delivery | Employees | Payroll | Inventory | Reports |  │
│  Settings | Website                                     │
└─────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────┐
│  Tier 2 — Domain SubNavBar (one per domain)             │
│  e.g. OrdersSubNavBar: Orders | Processing | Ready      │
└─────────────────────────────────────────────────────────┘
        │
        ▼ (Settings only)
┌─────────────────────────────────────────────────────────┐
│  Tier 3 — SettingsTertiaryNav                           │
│  Services | Pricing | Promotions | Garment Types | ...  │
└─────────────────────────────────────────────────────────┘
```

Every page renders Tier 1. Domain pages render Tier 1 + Tier 2. Settings renders all three tiers.

---

## 3. Tier 1 — MainNav

**File:** `src/components/MainNav.tsx`

**Active tab resolution** — `resolveMainNavActiveLabel(pathname)` maps routes to tab labels:

| Route pattern | Active tab |
|---------------|------------|
| `/dashboard`, `/` | Dashboard |
| `/orders`, `/lots`, `/garments` | Orders |
| `/customers` | Customers |
| `/delivery` | Delivery |
| `/employees` | Employees |
| `/payroll` | Payroll |
| `/inventory` | Inventory |
| `/reports` | Reports |
| `/settings/*`, `/website` | Settings |

**Tab definitions:**

| Label | Path |
|-------|------|
| Dashboard | `/dashboard` |
| Orders | `/orders` |
| Customers | `/customers` |
| Delivery | `/delivery` |
| Employees | `/employees` |
| Payroll | `/payroll` |
| Inventory | `/inventory` |
| Reports | `/reports` |
| Settings | `/settings` |
| Website | `/website` |

---

## 4. Tier 2 — Domain SubNavBar Components

### 4.1 OrdersSubNavBar

**File:** `src/components/OrdersSubNavBar.tsx`
**Used by:** `OrdersPage`, `LotsPage`, `GarmentsPage`
**Active detection:** `useLocation()` + `pathname.startsWith`

| Tab | Link | Active when |
|-----|------|-------------|
| Orders | `/orders` | pathname === '/orders' or startsWith('/orders/') |
| Lots | `/lots` | pathname === '/lots' or startsWith('/lots/') |
| Garments | `/garments` | pathname === '/garments' or startsWith('/garments/') |

---

### 4.2 DeliverySubNavBar

**File:** `src/components/DeliverySubNavBar.tsx`
**Used by:** `DeliveryPage`, `RoutesPage`, `VehiclesPage`, `DriversPage`
**Active detection:** `useLocation()` + `pathname`

| Tab | Link | Active when |
|-----|------|-------------|
| Routes | `/delivery/routes` | pathname.startsWith('/delivery/routes') |
| Vehicles | `/delivery/vehicles` | pathname.startsWith('/delivery/vehicles') |
| Drivers | `/delivery/drivers` | pathname.startsWith('/delivery/drivers') |
| Stops | `/delivery/stops` | pathname.startsWith('/delivery/stops') |

---

### 4.3 EmployeesSubNavBar

**File:** `src/components/EmployeesSubNavBar.tsx`
**Used by:** `EmployeesPage`, `ShiftsPage`, `AttendancePage`
**Active detection:** `useLocation()` + `pathname`

| Tab | Link | Active when |
|-----|------|-------------|
| Staff | `/employees` | pathname === '/employees' |
| Shifts | `/employees/shifts` | pathname.startsWith('/employees/shifts') |
| Attendance | `/employees/attendance` | pathname.startsWith('/employees/attendance') |

---

### 4.4 PayrollSubNavBar

**File:** `src/components/PayrollSubNavBar.tsx`
**Used by:** `PayrollPage`, `WorkEntriesPage`, `PayslipsPage`, `PayrollReportsPage`
**Active detection:** `useLocation()` + `pathname`

| Tab | Link | Active when |
|-----|------|-------------|
| Periods | `/payroll` | pathname === '/payroll' |
| Work Entries | `/payroll/work-entries` | pathname.startsWith('/payroll/work-entries') |
| Payslips | `/payroll/payslips` | pathname.startsWith('/payroll/payslips') |
| Reports | `/payroll/reports` | pathname.startsWith('/payroll/reports') |

---

### 4.5 InventorySubNavBar

**File:** `src/components/InventorySubNavBar.tsx`
**Used by:** `InventoryPage`, `StockTransactionsPage`, `SuppliersPage`
**Active detection:** `useLocation()` + `pathname`

| Tab | Link | Active when |
|-----|------|-------------|
| Stock | `/inventory` | pathname === '/inventory' |
| Transactions | `/inventory/transactions` | pathname.startsWith('/inventory/transactions') |
| Suppliers | `/inventory/suppliers` | pathname.startsWith('/inventory/suppliers') |

---

### 4.6 SettingsSubNavBar

**File:** `src/components/SettingsSubNavBar.tsx`
**Used by:** All Settings pages and `SettingsStubPage`
**Visibility:** Only renders when pathname is `/website`, `/settings`, or starts with `/settings/`
**Active detection:** `is(path)` helper — `pathname === path || pathname.startsWith(path + '/')`

| Tab | Link | Active when |
|-----|------|-------------|
| Website | `/website` | pathname === '/website' |
| Services | `/settings/services` | is('/settings/services') |
| Pricing | `/settings/pricing` | is('/settings/pricing') |
| Promotions | `/settings/promotions` | is('/settings/promotions') |
| Garment Types | `/settings/garment-types` | is('/settings/garment-types') |
| Fabric Types | `/settings/fabric-types` | is('/settings/fabric-types') |
| Branches | `/settings/branches` | is('/settings/branches') |
| Employees | `/settings/employees` | is('/settings/employees') |
| Delivery | `/settings/delivery` | is('/settings/delivery') |
| Financial | `/settings/financial` | is('/settings/financial') |
| Users | `/settings/users` | is('/settings/users') |
| System | `/settings/system` | is('/settings/system') |

---

## 5. Tier 3 — SettingsTertiaryNav

**File:** `src/pages/settings/SettingsTertiaryNav.tsx`
**Used by:** `SettingsLayout` (wraps all `/settings/*` routes)
**Active detection:** `useLocation()` + pathname

### 5.1 Services Settings

| Tab | Link | Active when |
|-----|------|-------------|
| Service Types | `/settings/services/types` | pathname === '/settings/services/types' |
| Service Packages | `/settings/services/packages` | pathname === '/settings/services/packages' |

### 5.2 Pricing Settings

| Tab | Link | Active when |
|-----|------|-------------|
| Pricing Rules | `/settings/pricing/rules` | pathname === '/settings/pricing/rules' |
| Customer Tiers | `/settings/pricing/tiers` | pathname === '/settings/pricing/tiers' |

### 5.3 Delivery Settings

| Tab | Link | Active when |
|-----|------|-------------|
| Zones | `/settings/delivery/zones` | pathname === '/settings/delivery/zones' |
| Vehicle Types | `/settings/delivery/vehicle-types` | pathname === '/settings/delivery/vehicle-types' |

---

## 6. Complete Route Table

### pressing-web Routes

| Route | Page | SubNavBar | Auth |
|-------|------|-----------|------|
| `/` | Dashboard | none | Private |
| `/dashboard` | DashboardPage | none | Private |
| `/orders` | OrdersPage | OrdersSubNavBar | Private |
| `/orders/:id` | OrderDetailPage | OrdersSubNavBar | Private |
| `/lots` | LotsPage | OrdersSubNavBar | Private |
| `/lots/:id` | LotDetailPage | OrdersSubNavBar | Private |
| `/garments` | GarmentsPage | OrdersSubNavBar | Private |
| `/garments/:id` | GarmentDetailPage | OrdersSubNavBar | Private |
| `/customers` | CustomersPage | none | Private |
| `/customers/:id` | CustomerDetailPage | none | Private |
| `/delivery` | DeliveryPage | DeliverySubNavBar | Private |
| `/delivery/routes` | RoutesPage | DeliverySubNavBar | Private |
| `/delivery/vehicles` | VehiclesPage | DeliverySubNavBar | Private |
| `/delivery/drivers` | DriversPage | DeliverySubNavBar | Private |
| `/delivery/stops` | StopsPage | DeliverySubNavBar | Private |
| `/employees` | EmployeesPage | EmployeesSubNavBar | Private |
| `/employees/shifts` | ShiftsPage | EmployeesSubNavBar | Private |
| `/employees/attendance` | AttendancePage | EmployeesSubNavBar | Private |
| `/payroll` | PayrollPage | PayrollSubNavBar | Private |
| `/payroll/work-entries` | WorkEntriesPage | PayrollSubNavBar | Private |
| `/payroll/payslips` | PayslipsPage | PayrollSubNavBar | Private |
| `/payroll/reports` | PayrollReportsPage | PayrollSubNavBar | Private |
| `/inventory` | InventoryPage | InventorySubNavBar | Private |
| `/inventory/transactions` | StockTransactionsPage | InventorySubNavBar | Private |
| `/inventory/suppliers` | SuppliersPage | InventorySubNavBar | Private |
| `/reports` | ReportsPage | none | Private |
| `/website` | WebsitePage | SettingsSubNavBar | Private |
| `/settings` | SettingsPage | SettingsSubNavBar | Private |
| `/settings/services` | ServicesSettingsPage | SettingsSubNavBar + Tertiary | Private |
| `/settings/services/types` | ServiceTypesPage | SettingsSubNavBar + Tertiary | Private |
| `/settings/services/packages` | ServicePackagesPage | SettingsSubNavBar + Tertiary | Private |
| `/settings/pricing` | PricingSettingsPage | SettingsSubNavBar + Tertiary | Private |
| `/settings/pricing/rules` | PricingRulesPage | SettingsSubNavBar + Tertiary | Private |
| `/settings/pricing/tiers` | CustomerTiersPage | SettingsSubNavBar + Tertiary | Private |
| `/settings/promotions` | PromotionsPage | SettingsSubNavBar | Private |
| `/settings/garment-types` | GarmentTypesPage | SettingsSubNavBar | Private |
| `/settings/fabric-types` | FabricTypesPage | SettingsSubNavBar | Private |
| `/settings/branches` | BranchesSettingsPage | SettingsSubNavBar | Private |
| `/settings/employees` | EmployeeSettingsPage | SettingsSubNavBar | Private |
| `/settings/delivery` | DeliverySettingsPage | SettingsSubNavBar + Tertiary | Private |
| `/settings/delivery/zones` | DeliveryZonesPage | SettingsSubNavBar + Tertiary | Private |
| `/settings/delivery/vehicle-types` | VehicleTypesPage | SettingsSubNavBar + Tertiary | Private |
| `/settings/financial` | FinancialSettingsPage | SettingsSubNavBar | Private |
| `/settings/users` | UsersSettingsPage | SettingsSubNavBar | Private |
| `/settings/system` | SystemSettingsPage | SettingsSubNavBar | Private |
| `/login` | LoginPage | none | Public |
| `/profile` | ProfilePage | none | Private |

### Stub Page Pattern

For routes not yet implemented:

```tsx
// SettingsStubPage.tsx
export default function SettingsStubPage({ title }: { title: string }) {
  return (
    <PageTemplate activeTab="settings" subNavBar={<SettingsSubNavBar />}>
      <div className="p-8 text-center text-gray-500">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p>This feature is coming soon.</p>
      </div>
    </PageTemplate>
  );
}
```

---

## 7. Active State Detection

### MainNav Active Label

```typescript
function resolveMainNavActiveLabel(pathname: string): string {
  if (pathname === '/' || pathname.startsWith('/dashboard')) return 'Dashboard';
  if (pathname.startsWith('/orders') || pathname.startsWith('/lots') || pathname.startsWith('/garments')) return 'Orders';
  if (pathname.startsWith('/customers')) return 'Customers';
  if (pathname.startsWith('/delivery')) return 'Delivery';
  if (pathname.startsWith('/employees')) return 'Employees';
  if (pathname.startsWith('/payroll')) return 'Payroll';
  if (pathname.startsWith('/inventory')) return 'Inventory';
  if (pathname.startsWith('/reports')) return 'Reports';
  if (pathname.startsWith('/settings') || pathname.startsWith('/website')) return 'Settings';
  return 'Dashboard';
}
```

### SubNav Active Detection

Each SubNavBar uses `useLocation()` and checks:
- Exact match: `pathname === link`
- Prefix match: `pathname.startsWith(link + '/')`
- Query params: `new URLSearchParams(location.search).get('tab') === expected`

---

## 8. Navigation Rules

1. **Every page** renders MainNav
2. **Domain pages** render MainNav + SubNavBar
3. **Settings pages** render MainNav + SettingsSubNavBar (+ TertiaryNav if applicable)
4. **Login page** renders no nav (full-screen)
5. **Active tab** must be visually distinct (primary color underline)
6. **Inactive tabs** are neutral gray
7. **Mobile**: MainNav collapses to hamburger menu, SubNavBar becomes horizontal scroll

---

## 9. customer-web Navigation

Simple top nav (no tiers):

| Label | Path |
|-------|------|
| Services | `/services` |
| Order | `/order` |
| Track | `/track` |
| Account | `/account` |

Mobile: Bottom tab bar with icons.

---

## 10. admin-web Navigation

Single-tier sidebar nav:

| Label | Path |
|-------|------|
| Dashboard | `/dashboard` |
| Tenants | `/tenants` |
| Users | `/users` |
| Analytics | `/analytics` |
| Billing | `/billing` |
| System | `/system` |
