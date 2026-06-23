export type OrderStatus =
  | 'pending'
  | 'received'
  | 'tagged'
  | 'in_wash'
  | 'in_dry'
  | 'in_press'
  | 'quality_check'
  | 'ready'
  | 'out_for_delivery'
  | 'completed'
  | 'cancelled'
  | 'rewash'
  | 'damaged'
  | 'on_hold';

export type PaymentProvider = 'mtn' | 'orange' | 'cash' | 'card';

export type AddressLabel = 'home' | 'work' | 'other';

export type NotificationType =
  | 'order_received'
  | 'order_status_update'
  | 'order_ready'
  | 'order_completed'
  | 'order_cancelled'
  | 'order_issue'
  | 'payment_reminder'
  | 'promotion'
  | 'system';

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  tenantId: string;
}

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface Service extends BaseEntity {
  tenantId: string;
  name: string;
  description?: string;
  category: string;
  basePrice: number;
  expressPrice?: number;
  pricingUnit: string;
  estimatedHours: number;
  fabricTypes?: string[];
  isActive: boolean;
}

export interface Branch extends BaseEntity {
  tenantId: string;
  name: string;
  address?: string;
  city?: string;
  phone?: string;
  email?: string;
  isActive: boolean;
  operatingHours?: Record<string, any>;
}

export interface Order extends BaseEntity {
  tenantId: string;
  branchId: string;
  customerId?: string;
  staffId?: string;
  status: OrderStatus;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  amountPaid: number;
  paymentDetails?: Record<string, any>;
  notes?: string;
  pickupDate?: string;
  deliveryDate?: string;
  isExpress: boolean;
  qrCode?: string;
  items?: OrderItem[];
  staff?: { id: string; firstName: string; lastName: string };
  branch?: { id: string; name: string; address?: string; phone?: string };
}

export interface OrderItem extends BaseEntity {
  orderId: string;
  garmentType: string;
  fabricType?: string;
  color?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  specialInstructions?: string;
  status: OrderStatus;
  qrCode?: string;
}

export interface Customer extends BaseEntity {
  tenantId: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  preferences?: Record<string, any>;
  totalSpent: number;
  totalOrders: number;
  isActive: boolean;
}

export interface User extends BaseEntity {
  tenantId: string;
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  lastLoginAt?: string;
}

export interface Address {
  id: string;
  customerId: string;
  label: AddressLabel;
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

export interface Notification {
  id: string;
  title: string;
  body: string;
  type: NotificationType;
  orderId?: string;
  deepLink?: string;
  read: boolean;
  createdAt: string;
  metadata?: Record<string, any>;
}

export interface OrderDraftItem {
  garmentType: string;
  fabricType?: string;
  color?: string;
  quantity: number;
  unitPrice: number;
  specialInstructions?: string;
}

export interface ServiceDraftItem {
  serviceId: string;
  serviceName: string;
  quantity: number;
  estimatedPrice: number;
  notes?: string;
}

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
