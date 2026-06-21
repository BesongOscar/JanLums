# 30 — Customer Web Gap Analysis

**Version:** 1.0.0  
**Status:** Active  
**Last Updated:** 2026-05-25  
**Related Modules:** customer-web  
**Implementation Status:** Planned  
**Dependencies:** 25_CUSTOMER_WEB_SPEC, 26_PRESSING_WEB_SPEC  

## 1. Purpose

Compare legacy JanLunMS customer features against the new pressing237 customer web spec, identifying gaps and implementation priority.

---

## 2. Legacy Features (from old prototype)

### 2.1 What Existed
- Single page (`home.html`) with tabs
- Service type display (Wash & Fold, Wash & Iron, Dry Clean)
- Basic order form modal
- Customer list (static data)
- Garment list (static data)
- Lot management (static data)
- No real customer-facing web presence

### 2.2 What Was Broken
- All data hardcoded (John Doe, 13456715)
- No API integration
- No payment processing
- No order tracking
- No customer accounts
- No mobile support
- Mixed transport terminology

---

## 3. New pressing237 Spec Gaps

| Feature | Legacy | New | Gap | Priority |
|---------|--------|-----|-----|----------|
| Service catalog | Static list | Dynamic with pricing | Medium | P1 |
| Online ordering | Modal form | Multi-step wizard | Large | P1 |
| Payment integration | None | MTN/Orange/Card | Large | P1 |
| Order tracking | None | Real-time timeline | Large | P1 |
| Customer accounts | None | Full profile + loyalty | Large | P1 |
| Mobile responsive | None | Full responsive | Large | P1 |
| QR pickup codes | None | QR generation + scan | Large | P1 |
| Push notifications | None | SMS/WhatsApp/Email | Large | P2 |
| Guest checkout | None | Supported | Medium | P2 |
| Address book | None | Multiple addresses | Medium | P2 |
| Photo upload | None | Garment photos | Medium | P2 |
| Reorder | None | One-click reorder | Small | P3 |
| Loyalty program | None | Points + tiers | Medium | P3 |
| Delivery tracking | None | GPS map | Large | P3 |

---

## 4. Implementation Order

### Phase 1 (MVP)
1. Service catalog page
2. Order placement flow
3. Payment integration
4. Order tracking
5. Customer registration/login
6. Basic profile

### Phase 2
7. Guest checkout
8. Address book
9. Photo upload
10. SMS notifications
11. QR pickup codes

### Phase 3
12. Push notifications
13. Loyalty program
14. Delivery tracking
15. Reorder functionality
16. Advanced analytics

---

## 5. Technical Gaps

| Area | Legacy | New | Effort |
|------|--------|-----|--------|
| Frontend framework | jQuery/HTML | React + Vite | Large |
| Styling | Bootstrap 4 | Tailwind CSS | Medium |
| Forms | Plain HTML | RHF + Zod | Medium |
| State management | None | React Context | Medium |
| API client | None | Axios | Small |
| Auth | None | JWT | Medium |
| i18n | Placeholder | useT() hook | Small |
