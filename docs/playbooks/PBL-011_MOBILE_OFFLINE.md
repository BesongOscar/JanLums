# Feature Playbook: Mobile Offline Sync

**Version:** 1.0.0  
**Status:** Active  
**Last Updated:** 2026-05-25  
**Related Modules:** customer-mobile  
**Implementation Status:** Planned  
**Dependencies:** 27_CUSTOMER_MOBILE_SPEC  

## 1. Business Flow

### Overview
Allow customer mobile app to function offline and sync data when connectivity returns.

### Offline Capabilities

| Feature | Offline Support | Sync Priority |
|---------|----------------|---------------|
| Browse catalog | ✅ (cached) | Low |
| Place order | ✅ (queued) | High |
| View order history | ✅ (cached) | Low |
| Track order | ✅ (cached) | Medium |
| View QR code | ✅ (cached) | High |
| Make payment | ❌ (requires online) | N/A |

---

## 2. Sync Architecture

```
Mobile App
├── Local Cache (AsyncStorage)
│   ├── Service catalog
│   ├── Order history
│   ├── Customer profile
│   └── Draft orders
├── Sync Queue
│   ├── Pending orders
│   ├── Status updates
│   └── Profile changes
└── Sync Engine
    ├── Detect connectivity
    ├── Batch sync
    ├── Conflict resolution
    └── Error retry
```

---

## 3. Conflict Resolution

### Strategies

| Conflict | Resolution |
|----------|------------|
| Order exists on server | Use server version |
| Profile updated on both | Use most recent timestamp |
| Order modified offline | Merge changes, flag for review |
| Duplicate order | Detect by timestamp + items |

---

## 4. API Flow

### Sync Request

```
POST /api/v1/sync
Request:
{
  "lastSyncAt": "2026-05-25T10:00:00Z",
  "changes": [
    {
      "type": "order",
      "action": "create",
      "data": { ... },
      "clientTimestamp": "2026-05-25T10:05:00Z"
    }
  ]
}

Response:
{
  "serverTimestamp": "2026-05-25T10:10:00Z",
  "changes": [
    {
      "type": "order",
      "action": "update",
      "data": { ... }
    }
  ],
  "conflicts": []
}
```

---

## 5. Queue Management

### Queue Types

| Queue | Items | Retry | Max Age |
|-------|-------|-------|---------|
| Critical | Orders, payments | Immediate | 24h |
| Standard | Profile updates | Every 15 min | 7 days |
| Background | Analytics | Daily | 30 days |

---

## 6. Edge Cases

- **Long offline period**: Sync in batches
- **Large queue**: Prioritize, show progress
- **Sync failure**: Retry with backoff
- **Data corruption**: Validate checksums
- **App update**: Migrate local data

---

## 7. Performance

- Max queue size: 100 items
- Batch size: 10 items per request
- Sync interval: 30 seconds when online
- Background sync: Every 15 minutes
