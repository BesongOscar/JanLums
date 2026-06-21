# 06 — Screen Map & Navigation

**Version:** 2.0.0
**Status:** Active
**Last Updated:** 2026-06-20
**Revisions Applied:** #8 (Notification Center), #9 (Address Management)

---

## 1. Navigation Architecture

```
Root (_layout.tsx)
├── Auth Stack (if !isAuthenticated)
│   ├── (auth)/_layout.tsx          ── Stack Navigator
│   │   ├── login.tsx               ── LoginScreen
│   │   ├── register.tsx            ── RegisterScreen
│   │   └── onboarding.tsx          ── OnboardingScreen
│
└── Main Tabs (if isAuthenticated)
    ├── (tabs)/_layout.tsx          ── Bottom Tab Navigator
    │   │
    │   ├── (tabs)/index.tsx        ── HomeTab
    │   │
    │   ├── (tabs)/order/
    │   │   ├── services.tsx        ── ServiceSelectScreen
    │   │   ├── garments.tsx        ── GarmentEntryScreen
    │   │   ├── pickup.tsx          ── PickupDetailsScreen
    │   │   ├── review.tsx          ── OrderReviewScreen
    │   │   ├── payment.tsx         ── PaymentScreen
    │   │   └── confirmation.tsx    ── ConfirmationScreen
    │   │
    │   ├── (tabs)/track/
    │   │   ├── index.tsx           ── TrackScreen
    │   │   ├── [id].tsx            ── OrderDetailScreen
    │   │   └── scan.tsx            ── QRScanScreen
    │   │
    │   └── (tabs)/account/
    │       ├── profile.tsx         ── ProfileScreen
    │       ├── orders.tsx          ── OrderHistoryScreen
    │       ├── addresses.tsx       ── AddressListScreen
    │       ├── address-new.tsx     ── AddAddressScreen
    │       ├── address-edit.tsx    ── EditAddressScreen
    │       ├── notifications.tsx   ── NotificationsScreen
    │       ├── notification-detail.tsx ── NotificationDetailScreen
    │       └── settings.tsx        ── SettingsScreen
    │
    └── Deep Links
        └── order/[id].tsx          ── Direct order link
```

---

## 2. Complete Screen Inventory

### Auth Screens

| Screen | Route | Description | Auth Required |
|--------|-------|-------------|---------------|
| `LoginScreen` | `(auth)/login` | Email/password login | No |
| `RegisterScreen` | `(auth)/register` | New account creation | No |
| `OnboardingScreen` | `(auth)/onboarding` | First-time user intro | No |

### Home Tab

| Screen | Route | Description | Auth Required |
|--------|-------|-------------|---------------|
| `HomeScreen` | `(tabs)/` | Dashboard, services carousel, recent orders, notifications badge | Yes |

### Order Tab (Stack Navigator)

| Screen | Route | Description | Auth Required |
|--------|-------|-------------|---------------|
| `ServiceSelectScreen` | `(tabs)/order/services` | Browse and select services | Yes |
| `GarmentEntryScreen` | `(tabs)/order/garments` | Add garments with details | Yes |
| `PickupDetailsScreen` | `(tabs)/order/pickup` | Choose branch, date, time | Yes |
| `OrderReviewScreen` | `(tabs)/order/review` | Review order summary | Yes |
| `PaymentScreen` | `(tabs)/order/payment` | Select payment method | Yes |
| `ConfirmationScreen` | `(tabs)/order/confirmation` | Order confirmed, QR code | Yes |

### Track Tab (Stack Navigator)

| Screen | Route | Description | Auth Required |
|--------|-------|-------------|---------------|
| `TrackScreen` | `(tabs)/track` | Search orders, recent list | Yes |
| `OrderDetailScreen` | `(tabs)/track/[id]` | Order detail with timeline | Yes |
| `QRScanScreen` | `(tabs)/track/scan` | Camera QR scanner | Yes |

### Account Tab (Stack Navigator)

| Screen | Route | Description | Auth Required |
|--------|-------|-------------|---------------|
| `ProfileScreen` | `(tabs)/account/profile` | View/edit profile | Yes |
| `OrderHistoryScreen` | `(tabs)/account/orders` | All past orders | Yes |
| `AddressListScreen` | `(tabs)/account/addresses` | Saved addresses | Yes |
| `AddAddressScreen` | `(tabs)/account/address-new` | Add new address | Yes |
| `EditAddressScreen` | `(tabs)/account/address-edit` | Edit saved address | Yes |
| `NotificationsScreen` | `(tabs)/account/notifications` | Notification center | Yes |
| `NotificationDetailScreen` | `(tabs)/account/notification-detail` | Single notification | Yes |
| `SettingsScreen` | `(tabs)/account/settings` | App settings | Yes |

---

## 3. Tab Bar Configuration

| Tab | Label | Icon (inactive) | Icon (active) | Badge |
|-----|-------|-----------------|---------------|-------|
| Home | Home | `home-outline` | `home` | — |
| Order | Order | `plus-circle-outline` | `plus-circle` | — |
| Track | Track | `search-outline` | `search` | Active orders count |
| Account | Account | `person-outline` | `person` | Unread notifications count |

---

## 4. Navigation Actions

### Order Flow (Forward)

```
HomeScreen
  → Tap "New Order" or service card
  → ServiceSelectScreen

ServiceSelectScreen
  → Select service
  → setService(id, name, price)
  → GarmentEntryScreen

GarmentEntryScreen
  → Add garments
  → addItem() for each
  → PickupDetailsScreen

PickupDetailsScreen
  → Select branch, date, time
  → setBranch(), setPickupType()
  → OrderReviewScreen

OrderReviewScreen
  → Review estimated totals
  → PaymentScreen

PaymentScreen
  → Select payment method
  → ConfirmationScreen

ConfirmationScreen
  → POST /orders
  → POST /qr-code/generate/order
  → Display QR + order number
  → reset() draft
  → Navigate to Track tab
```

### Back Navigation Rules

| Screen | Back Behavior |
|--------|---------------|
| `ServiceSelectScreen` | None (tab root) |
| `GarmentEntryScreen` | Pop to ServiceSelectScreen |
| `PickupDetailsScreen` | Pop to GarmentEntryScreen |
| `OrderReviewScreen` | Pop to PickupDetailsScreen |
| `PaymentScreen` | Pop to OrderReviewScreen |
| `ConfirmationScreen` | Replace with Track tab (no back) |
| `OrderDetailScreen` | Pop to TrackScreen |
| `QRScanScreen` | Pop to TrackScreen |
| `AddressListScreen` | Pop to ProfileScreen |
| `AddAddressScreen` | Pop to AddressListScreen |
| `EditAddressScreen` | Pop to AddressListScreen |

---

## 5. Deep Linking

| URL Pattern | Screen | Params |
|-------------|--------|--------|
| `janlums://order/:id` | OrderDetailScreen | `id: string` |
| `janlums://track` | TrackScreen | — |
| `janlums://services` | ServiceSelectScreen | — |
| `janlums://addresses` | AddressListScreen | — |
| `janlums://notifications` | NotificationsScreen | — |

---

## 6. Screen Count Summary

| Category | Count | Screens |
|----------|-------|---------|
| Auth | 3 | Login, Register, Onboarding |
| Home | 1 | HomeScreen |
| Order | 6 | ServiceSelect, GarmentEntry, Pickup, Review, Payment, Confirmation |
| Track | 3 | Track, OrderDetail, QRScan |
| Account | 7 | Profile, OrderHistory, AddressList, AddressNew, AddressEdit, Notifications, NotificationDetail, Settings |
| Deep Link | 1 | OrderDetail (alias) |
| **Total** | **21** | |
