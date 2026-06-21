# Offline Sync Strategy

**Version:** 1.0.0  
**Status:** Active  
**Last Updated:** 2026-05-25  
**Related Modules:** customer-mobile  
**Implementation Status:** Planned  
**Dependencies:** 27_CUSTOMER_MOBILE_SPEC  

---

## 1. Sync Architecture

```
┌─────────────────┐     ┌──────────────┐     ┌─────────────────┐
│   Mobile App    │────>│  Sync Queue  │────>│   JanLunMS API  │
│                 │     │              │     │                 │
│ - Local Cache   │<────│ - Retry Logic│<────│ - Conflict Res. │
│ - AsyncStorage  │     │ - Batch Sync │     │ - Validation    │
└─────────────────┘     └──────────────┘     └─────────────────┘
```

---

## 2. Local Caching

### Cache Strategy

| Data Type | Cache Duration | Max Size |
|-----------|---------------|----------|
| Service catalog | 24 hours | 1 MB |
| Order history | 7 days | 5 MB |
| Customer profile | Until logout | 100 KB |
| Draft orders | Until submitted | 500 KB |
| QR codes | Until expired | 200 KB |

### Implementation

```typescript
// cache.service.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

class CacheService {
  async get<T>(key: string): Promise<T | null> {
    const data = await AsyncStorage.getItem(key);
    if (!data) return null;
    
    const parsed = JSON.parse(data);
    if (parsed.expiresAt < Date.now()) {
      await AsyncStorage.removeItem(key);
      return null;
    }
    
    return parsed.value;
  }

  async set<T>(key: string, value: T, ttl: number): Promise<void> {
    await AsyncStorage.setItem(key, JSON.stringify({
      value,
      expiresAt: Date.now() + ttl,
    }));
  }
}
```

---

## 3. Sync Queue

### Queue Structure

```typescript
interface SyncQueueItem {
  id: string;
  type: 'order' | 'profile' | 'payment';
  action: 'create' | 'update' | 'delete';
  data: object;
  timestamp: number;
  retries: number;
  status: 'pending' | 'syncing' | 'failed' | 'completed';
}
```

### Queue Management

```typescript
class SyncQueue {
  async add(item: Omit<SyncQueueItem, 'id' | 'status'>): Promise<void> {
    const queue = await this.getQueue();
    queue.push({
      ...item,
      id: uuid(),
      status: 'pending',
    });
    await this.saveQueue(queue);
  }

  async process(): Promise<void> {
    const queue = await this.getQueue();
    const pending = queue.filter(i => i.status === 'pending');
    
    for (const item of pending) {
      try {
        await this.syncItem(item);
        item.status = 'completed';
      } catch (error) {
        item.retries++;
        if (item.retries >= 3) {
          item.status = 'failed';
        }
      }
    }
    
    await this.saveQueue(queue);
  }
}
```

---

## 4. Conflict Resolution

### Strategies

| Conflict Type | Resolution |
|--------------|------------|
| Order exists on server | Server wins, update local |
| Profile updated on both | Last write wins (timestamp) |
| Payment pending | Retry, never duplicate |
| Draft order stale | Prompt user to review |

### Implementation

```typescript
async resolveConflict(local: Order, server: Order): Promise<Order> {
  // Server always wins for orders
  if (local.id === server.id) {
    return server;
  }
  
  // Last write wins for profile
  if (local.updatedAt > server.updatedAt) {
    return local;
  }
  
  return server;
}
```

---

## 5. Retry Behavior

### Retry Schedule

| Attempt | Delay | Strategy |
|---------|-------|----------|
| 1 | Immediate | Try immediately |
| 2 | 30 seconds | Wait and retry |
| 3 | 5 minutes | Longer delay |
| 4+ | 1 hour | Manual retry required |

### Exponential Backoff

```typescript
function getRetryDelay(attempt: number): number {
  const base = 30; // 30 seconds
  const max = 3600; // 1 hour
  return Math.min(base * Math.pow(2, attempt), max);
}
```

---

## 6. Sync Triggers

### Automatic Sync

| Event | Action |
|-------|--------|
| App comes online | Process queue |
| Order placed | Queue for sync |
| Profile updated | Queue for sync |
| Periodic | Every 15 minutes |
| Background | Every hour |

### Manual Sync

```typescript
// Pull to refresh
const onRefresh = async () => {
  await syncQueue.process();
  await refreshData();
};
```

---

## 7. Error Handling

### Error Types

| Error | Handling |
|-------|----------|
| Network timeout | Retry with backoff |
| Server error (5xx) | Retry later |
| Validation error | Mark as failed, notify user |
| Authentication error | Prompt login |
| Conflict | Resolve per strategy |

### User Notification

```typescript
const syncStatus = {
  pending: 'Changes pending sync...',
  syncing: 'Syncing...',
  completed: 'All changes synced',
  failed: 'Some changes failed to sync. Tap to retry.',
};
```

---

## 8. Performance

### Batch Size

- Max 10 items per sync request
- Max 1 MB per request
- Compress large payloads

### Optimization

- Sync only changed fields
- Use delta sync when possible
- Compress images before upload
- Cache aggressively

---

## 9. Testing

### Offline Scenarios

| Scenario | Test |
|----------|------|
| Place order offline | Queue order, sync when online |
| Modify profile offline | Queue changes, merge on sync |
| View history offline | Show cached data |
| Payment offline | Block, require online |
| Long offline period | Batch sync, handle conflicts |

### Network Conditions

| Condition | Behavior |
|-----------|----------|
| Slow network | Timeout 30s, retry |
| Intermittent | Queue, retry on reconnect |
| Airplane mode | Queue all changes |
| Data saver | Reduce sync frequency |

---

## 10. Implementation Checklist

- [ ] AsyncStorage setup
- [ ] Cache service implementation
- [ ] Sync queue implementation
- [ ] Conflict resolution logic
- [ ] Retry mechanism
- [ ] Background sync (React Native)
- [ ] Network detection
- [ ] User notifications
- [ ] Error handling
- [ ] Testing scenarios
