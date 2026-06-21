# 25 — Customer Web Spec

**Version:** 1.0.0  
**Status:** Active  
**Last Updated:** 2026-05-25  
**Related Modules:** customer-web  
**Implementation Status:** Planned  
**Dependencies:** 26_PRESSING_WEB_SPEC, 30_CUSTOMER_WEB_GAP_ANALYSIS  

## 1. Purpose

Define the pressing237 customer-facing web application for order placement, tracking, and account management.

Local dev port: `http://localhost:3035`

---

## 2. Navigation

Simple top navigation (no tiers):

| Label | Path |
|-------|------|
| Services | `/services` |
| Order | `/order` |
| Track | `/track` |
| Account | `/account` |

Mobile: Bottom tab bar with icons.

---

## 3. Page Inventory

### 3.1 Home (`/`)

Hero section with:
- Brand headline
- Service category cards (Wash & Fold, Dry Clean, Wash & Iron)
- Quick order CTA
- Trust indicators (reviews, stats)
- Footer with branch locator

### 3.2 Services (`/services`)

Service catalog:
- Grid of service cards
- Each card: icon, name, description, starting price, turnaround time
- Filter by category (Clothing, Household, Specialty)
- Detail modal on click

### 3.3 Order (`/order`)

Multi-step order form:

**Step 1: Service Selection**
- Service type selection
- Pricing display (per-kilo or per-item)

**Step 2: Garment Details**
- Add garments (type, color, fabric, issues)
- Photo upload for delicate items
- Quantity per type

**Step 3: Pickup/Delivery**
- Option: Drop-off at branch or Schedule pickup
- Address selection (saved or new)
- Date/time picker
- Delivery preference (return delivery or pickup at branch)

**Step 4: Review**
- Order summary
- Price breakdown
- Estimated ready date

**Step 5: Payment**
- Payment method selection
- MTN/Orange/Card/Cash
- Pay now or pay on pickup

### 3.4 Track (`/track`)

Order tracking:
- Order number input (prominent)
- Status timeline display
- Current stage highlighted
- Exception alerts (delay, damage)
- Map view for delivery tracking
- Download receipt

### 3.5 Account (`/account`)

**Profile Tab**
- Personal info
- Phone verification
- Password change

**Orders Tab**
- Order history list
- Filter by status
- Reorder button
- View details

**Addresses Tab**
- Saved addresses
- Add/edit/delete
- Set default

**Loyalty Tab**
- Points balance
- Tier status
- Redemption history

---

## 4. API Consumption

| Endpoint | Page | Purpose |
|----------|------|---------|
| `GET /api/v1/services` | Services | Catalog |
| `POST /api/v1/orders` | Order | Create order |
| `GET /api/v1/orders/:id` | Track | Order status |
| `GET /api/v1/customers/orders` | Account | Order history |
| `POST /api/v1/payments` | Order | Process payment |
| `GET /api/v1/customers/profile` | Account | Profile |
| `PUT /api/v1/customers/profile` | Account | Update profile |

---

## 5. Design Notes

- Clean, minimal UI (opposite of operational portal)
- Large touch targets for mobile
- Progress indicators on order form
- Real-time price calculation
- Guest checkout supported (no account required)
- QR code generation for pickup verification
