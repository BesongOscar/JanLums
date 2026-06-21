# API Standards

**Version:** 1.0.0  
**Status:** Active  
**Last Updated:** 2026-05-25  
**Related Modules:** api  
**Implementation Status:** In Progress  
**Dependencies:** 03_TECH_ARCHITECTURE  

---

## 1. Endpoint Naming

### REST Conventions

```
GET    /api/v1/{resource}          # List
GET    /api/v1/{resource}/:id       # Detail
POST   /api/v1/{resource}           # Create
PUT    /api/v1/{resource}/:id       # Update
DELETE /api/v1/{resource}/:id       # Delete

# Actions
POST   /api/v1/{resource}/:id/{action}  # Custom action
```

### Examples

```
GET    /api/v1/orders
GET    /api/v1/orders/123
POST   /api/v1/orders
PUT    /api/v1/orders/123
DELETE /api/v1/orders/123
POST   /api/v1/orders/123/cancel
```

---

## 2. DTO Standards

### Naming

```
Create{Resource}Dto
Update{Resource}Dto
{Resource}ResponseDto
{Resource}QueryDto
```

### Example

```typescript
export class CreateOrderDto {
  @IsUUID()
  customerId: string;

  @IsUUID()
  serviceTypeId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsOptional()
  @IsString()
  notes?: string;
}
```

---

## 3. Validation Standards

### Input Validation

- Use `class-validator` decorators
- Validate all inputs
- Sanitize strings
- Validate UUIDs
- Validate enums
- Validate ranges

### Error Format

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "customerId",
      "message": "customerId must be a UUID",
      "value": "invalid"
    }
  ]
}
```

---

## 4. Pagination

### Request

```
GET /api/v1/orders?page=1&limit=20&sort=createdAt&order=desc
```

### Response

```json
{
  "data": [...],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

## 5. Filtering

### Query Parameters

```
GET /api/v1/orders?status=pending&branchId=uuid&createdAfter=2026-05-01
```

### Supported Operators

| Operator | Syntax | Example |
|----------|--------|---------|
| Equals | `field=value` | `status=pending` |
| Not equals | `field_ne=value` | `status_ne=cancelled` |
| Greater than | `field_gt=value` | `amount_gt=1000` |
| Less than | `field_lt=value` | `amount_lt=5000` |
| In | `field_in=v1,v2` | `status_in=pending,ready` |
| Contains | `field_like=value` | `name_like=john` |

---

## 6. Sorting

```
GET /api/v1/orders?sort=createdAt:desc,status:asc
```

---

## 7. Authentication

### JWT Token

```
Authorization: Bearer {token}
```

### Token Payload

```json
{
  "sub": "user-uuid",
  "tenantId": "tenant-uuid",
  "role": "manager",
  "iat": 1716624000,
  "exp": 1716710400
}
```

---

## 8. Authorization

### RBAC

```typescript
@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrdersController {
  @Post()
  @Roles('counter_staff', 'manager')
  create(@Body() dto: CreateOrderDto) { }

  @Delete(':id')
  @Roles('manager')
  delete(@Param('id') id: string) { }
}
```

---

## 9. Tenant Isolation

### Header

```
X-Tenant-ID: tenant-uuid
```

### Middleware

```typescript
@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const tenantId = req.headers['x-tenant-id'];
    req.tenantId = tenantId;
    next();
  }
}
```

---

## 10. Versioning

### URL Versioning

```
/api/v1/orders
/api/v2/orders
```

### Header Versioning (alternative)

```
Accept: application/vnd.janlums.v1+json
```

---

## 11. Error Handling

### Standard Errors

| Status | Code | Meaning |
|--------|------|---------|
| 400 | BAD_REQUEST | Invalid input |
| 401 | UNAUTHORIZED | Not authenticated |
| 403 | FORBIDDEN | No permission |
| 404 | NOT_FOUND | Resource not found |
| 409 | CONFLICT | Resource exists |
| 422 | UNPROCESSABLE | Business rule violation |
| 500 | INTERNAL_ERROR | Server error |

### Error Response

```json
{
  "statusCode": 404,
  "message": "Order not found",
  "error": "NOT_FOUND",
  "path": "/api/v1/orders/123",
  "timestamp": "2026-05-25T10:00:00Z"
}
```

---

## 12. Response Structures

### Success Response

```json
{
  "success": true,
  "data": { ... },
  "meta": { ... }
}
```

### List Response

```json
{
  "success": true,
  "data": [ ... ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150
  }
}
```

---

## 13. API Documentation

### Swagger

```typescript
@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  @ApiOperation({ summary: 'Create order' })
  @ApiResponse({ status: 201, description: 'Order created' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @Post()
  create(@Body() dto: CreateOrderDto) { }
}
```

---

## 14. Rate Limiting

| Endpoint Type | Limit | Window |
|--------------|-------|--------|
| Auth | 5 | 1 minute |
| Public | 100 | 1 minute |
| Authenticated | 1000 | 1 minute |
| Webhooks | 1000 | 1 minute |

---

## 15. Idempotency

### Header

```
Idempotency-Key: unique-key-123
```

### Behavior

- Same key → same response (for 24h)
- Different key → new request
- Key stored with response
