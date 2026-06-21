# 27 — Customer Mobile Spec

**Version:** 1.0.0  
**Status:** Active  
**Last Updated:** 2026-05-25  
**Related Modules:** customer-mobile  
**Implementation Status:** Planned  
**Dependencies:** 25_CUSTOMER_WEB_SPEC, 29_ORDER_AND_QR_SPEC  

## 1. Purpose

Define the pressing237 customer-facing mobile application for iOS and Android.

Framework: Expo + React Native

---

## 2. Navigation Structure

Bottom tab bar:

| Tab | Icon | Screen |
|-----|------|--------|
| Home | home | `(tabs)/index` |
| Order | plus-circle | `(tabs)/order` |
| Track | search | `(tabs)/track` |
| Account | user | `(tabs)/account` |

---

## 3. Screen Inventory

### 3.1 Home Screen

- Service category carousel
- Quick order button
- Recent orders (if logged in)
- Promotions banner
- Branch locator button

### 3.2 Order Screen

Stack navigator:

1. **ServiceSelectScreen**
   - Horizontal scroll of service cards
   - Tap to select

2. **GarmentEntryScreen**
   - Add garments with type selector
   - Camera icon for photo
   - Swipe to delete

3. **PickupScreen**
   - Toggle: Drop-off / Pickup / Delivery
   - Address book selection
   - Date/time picker
   - Map preview

4. **ReviewScreen**
   - Order summary
   - Price breakdown
   - Estimated ready time

5. **PaymentScreen**
   - Payment method selector
   - MTN/Orange/Card
   - Pay button

6. **ConfirmationScreen**
   - Order number
   - QR code for pickup
   - Share button

### 3.3 Track Screen

- Order number input
- Recent orders list
- Status timeline
- Push notification opt-in
- Delivery map (if out for delivery)

### 3.4 Account Screen

Stack navigator sections:
- **ProfileScreen**
- **OrdersScreen** (list with reorder)
- **AddressesScreen**
- **LoyaltyScreen**
- **SettingsScreen**

---

## 4. Push Notifications

| Event | Title | Body |
|-------|-------|------|
| Order received | "Order Received" | "Your order #1234 has been checked in" |
| Order ready | "Ready for Pickup" | "Your garments are ready! Order #1234" |
| Out for delivery | "Out for Delivery" | "Your order is on its way" |
| Delivery complete | "Delivered" | "Your order has been delivered" |
| Payment reminder | "Payment Due" | "Please complete payment for order #1234" |
| Promotion | "Special Offer" | "20% off dry cleaning this week!" |

---

## 5. QR Code Features

- Display QR on order confirmation
- Scan QR at counter for pickup
- Driver scans QR for delivery confirmation
- Share QR via WhatsApp/SMS

---

## 6. Offline Support

- Cache service catalog
- Draft order saved locally
- Sync when online
- View order history offline
