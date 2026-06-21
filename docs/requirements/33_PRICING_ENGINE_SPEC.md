# 33 — Pricing Engine Spec

**Version:** 1.0.0  
**Status:** Active  
**Last Updated:** 2026-05-25  
**Related Modules:** services, payments  
**Implementation Status:** Planned  
**Dependencies:** 20_NESTJS_MODULE_AND_TABLE_BLUEPRINT, 26_PRESSING_WEB_SPEC  

## 1. Purpose

Define service pricing models, rules, and dynamic pricing for JanLunMS.

---

## 2. Pricing Models

### 2.1 Per-Kilo Pricing

| Service | Standard | Express | Rush |
|---------|----------|---------|------|
| Wash & Fold | 1,500 XAF/kg | +50% | +100% |
| Wash & Iron | 2,000 XAF/kg | +50% | +100% |

Calculation:
```
base_price = weight_kg * price_per_kg
express_price = base_price * 1.5
rush_price = base_price * 2.0
```

### 2.2 Per-Item Pricing

| Garment Type | Service | Price |
|--------------|---------|-------|
| Shirt | Wash & Iron | 500 XAF |
| Shirt | Dry Clean | 800 XAF |
| Trousers | Wash & Iron | 700 XAF |
| Trousers | Dry Clean | 1,000 XAF |
| Dress | Dry Clean | 1,500 XAF |
| Suit (2pc) | Dry Clean | 3,000 XAF |

Calculation:
```
total = sum(item_price * quantity)
```

### 2.3 Flat Rate Pricing

| Package | Contents | Price |
|---------|----------|-------|
| Basic Bundle | 5 shirts + 2 trousers | 3,500 XAF |
| Family Bundle | 10kg mixed | 12,000 XAF |
| Business Bundle | 20 shirts pressed | 8,000 XAF |

---

## 3. Pricing Rules Engine

### Rule Structure

```typescript
interface PricingRule {
  id: uuid;
  tenant_id: uuid;
  service_type_id: uuid;
  garment_type_id?: uuid;
  fabric_type_id?: uuid;
  customer_tier?: string;
  price_per_kg?: number;
  price_per_item?: number;
  flat_rate?: number;
  min_price: number;
  max_price?: number;
  effective_from: Date;
  effective_until?: Date;
  is_active: boolean;
}
```

### Rule Priority

1. Customer tier-specific rule
2. Garment + fabric specific rule
3. Garment-specific rule
4. Service base rule
5. Default fallback

---

## 4. Customer Tiers

| Tier | Threshold | Discount |
|------|-----------|----------|
| Bronze | 0 XAF | 0% |
| Silver | 50,000 XAF | 5% |
| Gold | 150,000 XAF | 10% |
| Platinum | 500,000 XAF | 15% |

Benefits:
- Priority processing
- Free delivery
- Birthday discount
- Early access to promotions

---

## 5. Promotions

### Promotion Types

| Type | Description | Example |
|------|-------------|---------|
| Percentage | % off total | 20% off |
| Fixed Amount | Fixed discount | 5,000 XAF off |
| Free Item | Free service | Free dry clean |
| Bundle | Combined discount | Wash 10, get 2 free |

### Promotion Rules

```typescript
interface Promotion {
  id: uuid;
  tenant_id: uuid;
  code: string;
  name: string;
  type: 'percentage' | 'fixed' | 'free_item' | 'bundle';
  value: number;
  min_order_amount?: number;
  max_discount_amount?: number;
  usage_limit?: number;
  usage_count: number;
  valid_from: Date;
  valid_until: Date;
  applicable_services?: uuid[];
  applicable_customer_tiers?: string[];
  is_active: boolean;
}
```

---

## 6. Dynamic Pricing

### Demand-Based

| Demand Level | Multiplier |
|--------------|------------|
| Low | 0.9 |
| Normal | 1.0 |
| High | 1.2 |
| Peak | 1.5 |

### Time-Based

| Time | Multiplier |
|------|------------|
| Weekday | 1.0 |
| Weekend | 1.1 |
| Holiday | 1.3 |

---

## 7. Price Calculation Flow

```
1. Get base price (service + items)
2. Apply customer tier discount
3. Apply promotion code
4. Apply dynamic pricing
5. Add delivery fee
6. Add tax
7. Round to nearest 50 XAF
```

---

## 8. API Endpoints

```
POST /api/v1/pricing/calculate
Body: {
  service_type_id,
  items: [{ garment_type_id, quantity, weight? }],
  customer_tier?,
  promotion_code?,
  delivery_zone?
}
Response: {
  subtotal,
  discount,
  delivery_fee,
  tax,
  total
}
```

---

## 9. Display Requirements

- Show original price strikethrough if discounted
- Show savings amount
- Show price breakdown on hover
- Show "From X XAF" for variable pricing
- Show per-item price in catalog
