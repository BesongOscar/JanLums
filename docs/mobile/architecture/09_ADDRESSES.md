# 09 — Address Management

**Version:** 2.0.0
**Status:** Active
**Last Updated:** 2026-06-20
**Revisions Applied:** #9 (Address Management Module)

---

## 1. Data Model

```typescript
interface Address {
  id: string;
  customerId: string;
  label: 'home' | 'work' | 'other';
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postalCode?: string;
  country: string;
  latitude?: number;
  longitude?: number;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}
```

**Note:** Backend does not have an Address entity yet. Addresses will be stored locally in AsyncStorage for MVP. When backend adds the Address module, migrate to API.

---

## 2. Screens

### AddressListScreen

```
┌─────────────────────────────────────┐
│  ← Back     My Addresses    + Add   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 🏠 Home (Default)           │   │
│  │ 123 Main Street             │   │
│  │ Douala, Cameroon            │   │
│  │                     Edit │ ✓ │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 💼 Work                      │   │
│  │ 456 Business Ave            │   │
│  │ Douala, Cameroon            │   │
│  │                     Edit │   │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

### AddAddressScreen

```
┌─────────────────────────────────────┐
│  ← Back     Add Address             │
│                                     │
│  Label                              │
│  ┌──────┐ ┌──────┐ ┌──────┐       │
│  │ Home │ │ Work │ │Other │       │
│  └──────┘ └──────┘ └──────┘       │
│                                     │
│  Address Line 1                     │
│  ┌─────────────────────────────┐   │
│  │                             │   │
│  └─────────────────────────────┘   │
│                                     │
│  Address Line 2 (Optional)          │
│  ┌─────────────────────────────┐   │
│  │                             │   │
│  └─────────────────────────────┘   │
│                                     │
│  City                               │
│  ┌─────────────────────────────┐   │
│  │                             │   │
│  └─────────────────────────────┘   │
│                                     │
│  ☐ Set as default address           │
│                                     │
│  ┌─────────────────────────────┐   │
│  │        SAVE ADDRESS         │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

---

## 3. State Management

### AsyncStorage Keys

| Key | Value | TTL |
|-----|-------|-----|
| `addresses` | `Address[]` JSON | Until logout |

### Store Actions

```typescript
interface AddressState {
  addresses: Address[];
  
  addAddress: (address: Omit<Address, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateAddress: (id: string, updates: Partial<Address>) => void;
  deleteAddress: (id: string) => void;
  setDefault: (id: string) => void;
  getDefault: () => Address | null;
}
```

---

## 4. Validation Schema

```typescript
const addressSchema = z.object({
  label: z.enum(['home', 'work', 'other']),
  addressLine1: z.string().min(1, 'Address is required').max(200),
  addressLine2: z.string().max(200).optional(),
  city: z.string().min(1, 'City is required').max(100),
  state: z.string().max(100).optional(),
  postalCode: z.string().max(20).optional(),
  country: z.string().default('Cameroon'),
  isDefault: z.boolean().default(false),
});
```

---

## 5. Integration with Order Flow

```
PickupDetailsScreen
  → Shows saved addresses
  → "Use saved address" option
  → Select address → auto-fill pickup location
```

---

## 6. Backend Migration Path

When backend adds Address entity:

| Step | Action |
|------|--------|
| 1 | Create `addresses` table with `customer_id` FK |
| 2 | Add `GET /customers/me/addresses` endpoint |
| 3 | Add `POST /customers/me/addresses` endpoint |
| 4 | Add `PUT /customers/me/addresses/:id` endpoint |
| 5 | Add `DELETE /customers/me/addresses/:id` endpoint |
| 6 | Migrate local addresses to backend |
| 7 | Switch from AsyncStorage to React Query |
