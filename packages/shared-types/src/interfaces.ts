import {
  OrderStatus,
  PaymentStatus,
  ServicePricingType,
  UserRole,
  EmployeeRole,
  EmployeeStatus,
  DeliveryStatus,
  NotificationChannel,
  QRTagType,
  TransactionType,
  PaymentProvider,
  InventoryTransactionType,
  PayrollPeriodStatus,
  ShiftStatus,
  TenantStatus,
  VehicleStatus,
  CustomerTier,
  OrderPriority,
  OrderType,
  LotStatus,
} from './enums';

/* ── Base Entity ───────────────────────────────────────────────────────────── */
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

/* ── Tenant ────────────────────────────────────────────────────────────────── */
export interface Tenant extends BaseEntity {
  name: string;
  slug: string;
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  status: TenantStatus;
  subscriptionPlan: string;
  maxBranches: number;
  maxUsers: number;
}

/* ── Branch ────────────────────────────────────────────────────────────────── */
export interface Branch extends BaseEntity {
  tenantId: string;
  name: string;
  code: string;
  address: string;
  city: string;
  phone?: string;
  email?: string;
  managerId?: string;
  openingHours?: Record<string, { open: string; close: string }>;
  latitude?: number;
  longitude?: number;
  isActive: boolean;
}

/* ── User ──────────────────────────────────────────────────────────────────── */
export interface User extends BaseEntity {
  tenantId: string;
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  lastLoginAt?: Date;
}

/* ── Customer ──────────────────────────────────────────────────────────────── */
export interface Customer extends BaseEntity {
  tenantId: string;
  userId?: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  phoneVerified: boolean;
  dateOfBirth?: Date;
  gender?: string;
  loyaltyTier: CustomerTier;
  loyaltyPoints: number;
  totalOrders: number;
  totalSpent: number;
  preferredBranchId?: string;
  notes?: string;
}

/* ── Customer Address ──────────────────────────────────────────────────────── */
export interface CustomerAddress extends BaseEntity {
  customerId: string;
  addressType: 'home' | 'work' | 'other';
  label?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postalCode?: string;
  country: string;
  latitude?: number;
  longitude?: number;
  isDefault: boolean;
}

/* ── Service Type ──────────────────────────────────────────────────────────── */
export interface ServiceType extends BaseEntity {
  tenantId: string;
  name: string;
  code: string;
  description?: string;
  pricingType: ServicePricingType;
  basePrice: number;
  minOrderAmount?: number;
  turnaroundHours: number;
  expressSurchargePct: number;
  rushSurchargePct: number;
  isActive: boolean;
}

/* ── Garment Type ──────────────────────────────────────────────────────────── */
export interface GarmentType extends BaseEntity {
  tenantId: string;
  name: string;
  category: string;
  defaultServiceId?: string;
  careInstructions?: string;
  handlingNotes?: string;
  isActive: boolean;
}

/* ── Fabric Type ───────────────────────────────────────────────────────────── */
export interface FabricType extends BaseEntity {
  tenantId: string;
  name: string;
  careLevel: string;
  washingTempMax?: number;
  dryingMethod?: string;
  isActive: boolean;
}

/* ── Order ─────────────────────────────────────────────────────────────────── */
export interface Order extends BaseEntity {
  tenantId: string;
  branchId: string;
  customerId: string;
  orderNumber: string;
  orderType: OrderType;
  status: OrderStatus;
  priority: OrderPriority;
  serviceTypeId: string;
  pricingType: ServicePricingType;
  totalItems: number;
  totalWeightKg?: number;
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  amountPaid: number;
  amountDue: number;
  paymentStatus: PaymentStatus;
  pickupScheduledAt?: Date;
  deliveryScheduledAt?: Date;
  readyByEstimated?: Date;
  completedAt?: Date;
  notes?: string;
  createdBy: string;
}

/* ── Order Item ────────────────────────────────────────────────────────────── */
export interface OrderItem extends BaseEntity {
  orderId: string;
  lotId?: string;
  garmentTypeId: string;
  fabricTypeId?: string;
  color?: string;
  size?: string;
  brand?: string;
  observedIssue?: string;
  customerDeclaredValue?: number;
  serviceTypeId: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  status: OrderStatus;
  qrTagId?: string;
  beforePhotoUrl?: string;
  afterPhotoUrl?: string;
  notes?: string;
}

/* ── Lot ───────────────────────────────────────────────────────────────────── */
export interface Lot extends BaseEntity {
  tenantId: string;
  branchId: string;
  lotNumber: string;
  orderId: string;
  customerId: string;
  status: LotStatus;
  rackLocation?: string;
  totalGarments: number;
}

/* ── QR Tag ────────────────────────────────────────────────────────────────── */
export interface QRTag extends BaseEntity {
  tenantId: string;
  tagCode: string;
  tagType: QRTagType;
  referenceId: string;
  referenceType: string;
  generationMethod: 'system' | 'manual';
  expiresAt?: Date;
  isActive: boolean;
}

/* ── Payment Transaction ───────────────────────────────────────────────────── */
export interface Transaction extends BaseEntity {
  tenantId: string;
  orderId: string;
  customerId: string;
  transactionCode: string;
  amount: number;
  currency: string;
  paymentProvider: PaymentProvider;
  paymentMethod: string;
  status: PaymentStatus;
  transactionType: TransactionType;
  providerReference?: string;
  processedAt?: Date;
  metadata?: Record<string, any>;
}

/* ── Employee ──────────────────────────────────────────────────────────────── */
export interface Employee extends BaseEntity {
  tenantId: string;
  branchId: string;
  userId?: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  role: EmployeeRole;
  status: EmployeeStatus;
  hireDate: Date;
  terminationDate?: Date;
  baseSalary?: number;
  salaryType?: 'monthly' | 'hourly';
  department?: string;
}

/* ── Delivery Route ────────────────────────────────────────────────────────── */
export interface DeliveryRoute extends BaseEntity {
  tenantId: string;
  branchId: string;
  name: string;
  code: string;
  areaCoverage?: any; // PostGIS geometry
  estimatedDurationMinutes: number;
  isActive: boolean;
}

/* ── Vehicle ───────────────────────────────────────────────────────────────── */
export interface Vehicle extends BaseEntity {
  tenantId: string;
  branchId: string;
  registrationNumber: string;
  vehicleType: string;
  capacityKg?: number;
  status: VehicleStatus;
  insuranceExpires?: Date;
  lastMaintenanceAt?: Date;
}

/* ── API Response ──────────────────────────────────────────────────────────── */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
    hasNextPage?: boolean;
    hasPrevPage?: boolean;
  };
  message?: string;
}

/* ── API Error ─────────────────────────────────────────────────────────────── */
export interface ApiError {
  statusCode: number;
  message: string;
  error: string;
  path: string;
  timestamp: string;
  details?: Array<{
    field: string;
    message: string;
    value?: any;
  }>;
}

/* ── Pagination Query ──────────────────────────────────────────────────────── */
export interface PaginationQuery {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

/* ── Date Range Filter ─────────────────────────────────────────────────────── */
export interface DateRangeFilter {
  startDate?: Date;
  endDate?: Date;
}
