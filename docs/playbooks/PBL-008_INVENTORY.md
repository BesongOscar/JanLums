# Feature Playbook: Inventory Management

**Version:** 1.0.0  
**Status:** Active  
**Last Updated:** 2026-05-25  
**Related Modules:** inventory  
**Implementation Status:** Planned  
**Dependencies:** 20_NESTJS_MODULE_AND_TABLE_BLUEPRINT  

## 1. Business Flow

### Overview
Track inventory of detergents, softeners, packaging materials, and equipment across branches.

### Actors
- **Branch Manager**: Monitors stock, approves orders
- **Counter Staff**: Consumes stock for orders
- **Purchasing Manager**: Places supplier orders

### Primary Flow

```
1. Stock received from supplier
2. Stock added to inventory system
3. Stock consumed during order processing
4. System monitors levels
5. Low stock alert triggered
6. Reorder suggested or auto-ordered
7. Stock replenished
```

---

## 2. UI Flow

### pressing-web: Inventory

```
Inventory Page → Stock Tab → Item Detail

Stock Tab:
- Item list with current levels
- Status indicators (green/yellow/red)
- Quick actions (add stock, adjust)
- Filter by category

Item Detail:
- Current quantity
- Min/max levels
- Reorder point
- Transaction history
- Supplier info
```

---

## 3. API Flow

### Add Stock

```
POST /api/v1/inventory/transactions
Request:
{
  "itemId": "uuid",
  "type": "purchase",
  "quantity": 100,
  "unitCost": 2500,
  "supplierId": "uuid",
  "reference": "PO-0001"
}
```

### Consume Stock

```
POST /api/v1/inventory/transactions
Request:
{
  "itemId": "uuid",
  "type": "consumption",
  "quantity": -5,
  "referenceType": "order",
  "referenceId": "order-uuid"
}
```

---

## 4. Database Entities

### inventory_items
- id (uuid, PK)
- sku (varchar)
- name (varchar)
- category (enum)
- current_quantity (decimal)
- min_stock_level (decimal)
- reorder_point (decimal)

### inventory_transactions
- id (uuid, PK)
- item_id (uuid, FK)
- type (enum: purchase, consumption, adjustment)
- quantity (decimal)
- reference_type (varchar)
- reference_id (uuid)

---

## 5. Lifecycle States

```
in_stock → low_stock → out_of_stock → reordered → in_stock
```

---

## 6. Validations

- Quantity > 0 for purchases
- Quantity < 0 for consumption
- Current quantity never < 0
- Adjustment requires manager approval

---

## 7. Permissions

| Role | View Stock | Add Stock | Consume Stock | Adjust Stock |
|------|-----------|-----------|---------------|--------------|
| counter_staff | ✅ | ❌ | ✅ | ❌ |
| manager | ✅ | ✅ | ✅ | ✅ |
| admin | ✅ | ✅ | ✅ | ✅ |

---

## 8. Notifications

| Event | Recipient | Channel |
|-------|-----------|---------|
| Low stock | Manager | Email + Push |
| Out of stock | Manager | SMS |
| Stock received | System | Internal |

---

## 9. Reporting

- Stock levels by branch
- Consumption trends
- Reorder frequency
- Supplier performance
- Cost analysis

---

## 10. Edge Cases

- **Spoilage**: Mark as damaged, adjust stock
- **Transfer**: Move between branches
- **Bulk order**: Volume discount
- **Seasonal demand**: Adjust reorder points
