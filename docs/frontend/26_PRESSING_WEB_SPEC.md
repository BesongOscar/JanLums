# 26 — Pressing Web Spec

**Version:** 1.0.0  
**Status:** Active  
**Last Updated:** 2026-05-25  
**Related Modules:** pressing-web  
**Implementation Status:** In Progress  
**Dependencies:** 28_NAV_ARCHITECTURE, 10_UI_UX_DESIGN_SYSTEM_GUIDE  

## 1. Purpose

Custom operational portal for laundry/branch staff under the pressing237 brand.

This is the primary day-to-day tool for counter agents, branch managers, washers, pressers, QC inspectors, and drivers. It is a custom React UI.

Local dev port: `http://localhost:3025`

---

## 2. Navigation Architecture

See `28_NAV_ARCHITECTURE.md` for full routing map.

---

## 3. Main Navigation Tabs

| Tab | Path | Description |
|-----|------|-------------|
| Dashboard | `/dashboard` | Branch KPI overview |
| Orders | `/orders` | Order intake, processing, tracking |
| Customers | `/customers` | Customer management |
| Delivery | `/delivery` | Routes, vehicles, drivers |
| Employees | `/employees` | Staff records, shifts |
| Payroll | `/payroll` | Timesheets, payslips |
| Inventory | `/inventory` | Stock, supplies |
| Reports | `/reports` | Revenue, efficiency |
| Settings | `/settings` | Reference data, configuration |
| Website | `/website` | Public website content |

---

## 4. Domain Sections

### 4.1 Dashboard Domain

Single section, no subnav.

KPI Cards:
- Orders today
- Revenue today
- Garments in process
- Ready for pickup
- Pending deliveries
- Active customers

Charts:
- Orders by hour
- Revenue trend (7 days)
- Top services
- Garment status distribution

Activity Feed:
- Recent orders
- QC exceptions
- Delivery updates

---

### 4.2 Orders Domain

Secondary nav: **Orders | Lots | Garments**

**Orders (`/orders`)**
- Order list with filters (status, date, customer)
- Quick actions: receive, tag, update status
- Add order modal (walk-in)
- Order detail: timeline, items, payments, notes

**Lots (`/lots`)**
- Lot list with rack locations
- Create lot from order
- Print lot labels
- Lot detail: garments, status, location

**Garments (`/garments`)**
- Individual garment tracking
- QR scan to locate
- Status update per garment
- QC checkpoint
- Rewash handling
- Damage reporting

---

### 4.3 Customers Domain

Single section, no subnav.

**Customers (`/customers`)**
- Customer list with search
- Customer detail: profile, orders, loyalty
- Add customer modal
- Edit customer
- Order history

---

### 4.4 Delivery Domain

Secondary nav: **Routes | Vehicles | Drivers | Stops**

**Routes (`/delivery/routes`)**
- Route list with coverage area
- Create/edit route
- Assign orders to route
- Route optimization

**Vehicles (`/delivery/vehicles`)**
- Vehicle registry
- Status, insurance, maintenance
- Add vehicle modal

**Drivers (`/delivery/drivers`)**
- Driver list
- Assign to routes
- Shift scheduling
- Delivery history

**Stops (`/delivery/stops`)**
- Today's stops
- Status updates
- Delivery confirmation

---

### 4.5 Employees Domain

Secondary nav: **Staff | Shifts | Attendance**

**Staff (`/employees`)**
- Employee list
- Roles, departments, status
- Add employee modal
- Detail: profile, documents, shifts

**Shifts (`/employees/shifts`)**
- Weekly schedule view
- Assign shifts
- Shift templates

**Attendance (`/employees/attendance`)**
- Check-in/check-out tracking
- Missed shifts
- Overtime calculation

---

### 4.6 Payroll Domain

Secondary nav: **Periods | Work Entries | Payslips | Reports**

**Periods (`/payroll`)**
- Payroll period list
- Create new period
- Process payroll
- Close period

**Work Entries (`/payroll/work-entries`)**
- Time tracking per employee
- Regular + overtime hours
- Holiday pay

**Payslips (`/payroll/payslips`)**
- Generated payslips
- Download PDF
- Payment status

**Reports (`/payroll/reports`)**
- Tax summaries
- Deduction reports
- Labor cost analysis

---

### 4.7 Inventory Domain

Secondary nav: **Stock | Transactions | Suppliers**

**Stock (`/inventory`)**
- Inventory list
- Stock levels, alerts
- Reorder recommendations
- Add item modal

**Transactions (`/inventory/transactions`)**
- Stock movements
- Consumption per order
- Purchase orders
- Adjustments

**Suppliers (`/inventory/suppliers`)**
- Supplier directory
- Contact info
- Purchase history

---

### 4.8 Reports Domain

Single section, no subnav.

**Reports (`/reports`)**
- Revenue report (daily/weekly/monthly)
- Service popularity
- Customer analytics
- Employee productivity
- Inventory usage
- Delivery performance
- Export to Excel/PDF

---

### 4.9 Settings Domain

Secondary nav: **Services | Pricing | Promotions | Garment Types | Fabric Types | Branches | Employees | Delivery | Financial | Users | System**

**Services (`/settings/services`)**
- Service type configuration
- Turnaround times
- Service packages

**Pricing (`/settings/pricing`)**
- Pricing rules
- Customer tiers
- Dynamic pricing

**Promotions (`/settings/promotions`)**
- Coupon codes
- Discount rules
- Usage tracking

**Garment Types (`/settings/garment-types`)**
- Garment catalog
- Default services
- Care instructions

**Fabric Types (`/settings/fabric-types`)**
- Fabric catalog
- Care levels
- Handling notes

**Branches (`/settings/branches`)**
- Branch locations
- Operating hours
- Equipment

**Employees (`/settings/employees`)**
- Roles and permissions
- Departments
- Contract types

**Delivery (`/settings/delivery`)**
- Zones
- Vehicle types
- Route templates

**Financial (`/settings/financial`)**
- Tax rates
- Commission rules
- Payment methods

**Users (`/settings/users`)**
- User accounts
- Role assignments
- RBAC configuration

**System (`/settings/system`)**
- Notification templates
- Integration settings
- Backup configuration

---

### 4.10 Website Domain

Single section, no subnav.

**Website (`/website`)**
- Homepage content editor
- Service descriptions
- Pricing display
- FAQ management
- Testimonials
- Contact info
- SEO settings
