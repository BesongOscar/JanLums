/* ── Order Status ──────────────────────────────────────────────────────────── */
export enum OrderStatus {
  PENDING = 'pending',
  RECEIVED = 'received',
  TAGGED = 'tagged',
  IN_WASH = 'in_wash',
  IN_DRY = 'in_dry',
  IN_PRESS = 'in_press',
  QUALITY_CHECK = 'quality_check',
  READY = 'ready',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  REWASH = 'rewash',
  DAMAGED = 'damaged',
  COMPENSATED = 'compensated',
  ON_HOLD = 'on_hold',
}

/* ── Payment Status ────────────────────────────────────────────────────────── */
export enum PaymentStatus {
  PENDING = 'pending',
  INITIATED = 'initiated',
  PROCESSING = 'processing',
  SUCCESS = 'success',
  FAILED = 'failed',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
}

/* ── Service Types ─────────────────────────────────────────────────────────── */
export enum ServicePricingType {
  PER_KILO = 'per_kilo',
  PER_ITEM = 'per_item',
  FLAT_RATE = 'flat_rate',
}

/* ── User Roles ────────────────────────────────────────────────────────────── */
export enum UserRole {
  PLATFORM_ADMIN = 'platform_admin',
  TENANT_ADMIN = 'tenant_admin',
  MANAGER = 'manager',
  COUNTER_STAFF = 'counter_staff',
  WASHER = 'washer',
  PRESSER = 'presser',
  QC_INSPECTOR = 'qc_inspector',
  DRIVER = 'driver',
  CUSTOMER = 'customer',
}

/* ── Employee Roles ────────────────────────────────────────────────────────── */
export enum EmployeeRole {
  MANAGER = 'manager',
  COUNTER_STAFF = 'counter_staff',
  WASHER = 'washer',
  PRESSER = 'presser',
  QC_INSPECTOR = 'qc_inspector',
  DRIVER = 'driver',
  ADMIN = 'admin',
}

/* ── Employee Status ───────────────────────────────────────────────────────── */
export enum EmployeeStatus {
  INVITED = 'invited',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

/* ── Delivery Status ───────────────────────────────────────────────────────── */
export enum DeliveryStatus {
  SCHEDULED = 'scheduled',
  ASSIGNED = 'assigned',
  EN_ROUTE = 'en_route',
  ARRIVED = 'arrived',
  COMPLETED = 'completed',
  FAILED = 'failed',
  SKIPPED = 'skipped',
}

/* ── Notification Channel ──────────────────────────────────────────────────── */
export enum NotificationChannel {
  SMS = 'sms',
  WHATSAPP = 'whatsapp',
  EMAIL = 'email',
  PUSH = 'push',
}

/* ── QR Tag Type ───────────────────────────────────────────────────────────── */
export enum QRTagType {
  ORDER = 'order',
  GARMENT = 'garment',
  LOT = 'lot',
  PICKUP = 'pickup',
  DELIVERY = 'delivery',
}

/* ── Transaction Type ──────────────────────────────────────────────────────── */
export enum TransactionType {
  PAYMENT = 'payment',
  REFUND = 'refund',
  TOP_UP = 'top_up',
}

/* ── Payment Provider ──────────────────────────────────────────────────────── */
export enum PaymentProvider {
  MTN = 'mtn',
  ORANGE = 'orange',
  CARD = 'card',
  CASH = 'cash',
  WALLET = 'wallet',
}

/* ── Inventory Transaction Type ────────────────────────────────────────────── */
export enum InventoryTransactionType {
  PURCHASE = 'purchase',
  CONSUMPTION = 'consumption',
  ADJUSTMENT = 'adjustment',
  TRANSFER = 'transfer',
}

/* ── Payroll Period Status ─────────────────────────────────────────────────── */
export enum PayrollPeriodStatus {
  DRAFT = 'draft',
  PROCESSING = 'processing',
  APPROVED = 'approved',
  PAID = 'paid',
  CLOSED = 'closed',
}

/* ── Shift Status ──────────────────────────────────────────────────────────── */
export enum ShiftStatus {
  SCHEDULED = 'scheduled',
  CHECKED_IN = 'checked_in',
  CHECKED_OUT = 'checked_out',
  MISSED = 'missed',
}

/* ── Tenant Status ─────────────────────────────────────────────────────────── */
export enum TenantStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  CANCELLED = 'cancelled',
}

/* ── Vehicle Status ────────────────────────────────────────────────────────── */
export enum VehicleStatus {
  ACTIVE = 'active',
  MAINTENANCE = 'maintenance',
  RETIRED = 'retired',
}

/* ── Customer Tier ─────────────────────────────────────────────────────────── */
export enum CustomerTier {
  BRONZE = 'bronze',
  SILVER = 'silver',
  GOLD = 'gold',
  PLATINUM = 'platinum',
}

/* ── Order Priority ────────────────────────────────────────────────────────── */
export enum OrderPriority {
  STANDARD = 'standard',
  EXPRESS = 'express',
  RUSH = 'rush',
}

/* ── Order Type ────────────────────────────────────────────────────────────── */
export enum OrderType {
  WALK_IN = 'walk_in',
  PICKUP_REQUEST = 'pickup_request',
  DELIVERY_REQUEST = 'delivery_request',
}

/* ── Lot Status ────────────────────────────────────────────────────────────── */
export enum LotStatus {
  OPEN = 'open',
  PROCESSING = 'processing',
  READY = 'ready',
  CLOSED = 'closed',
}
