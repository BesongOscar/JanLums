import axios from 'axios';

const adminApi = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export interface DashboardStats {
  totalTenants: number;
  activeUsers: number;
  totalBranches: number;
  totalOrdersToday: number;
  revenueToday: number;
  revenueTrend: { date: string; revenue: number }[];
  orderVolumeByTenant: { tenantId: string; tenantName: string; count: number }[];
  tenantSignups: { date: string; count: number }[];
  recentActivity: { id: string; type: string; description: string; tenantName: string; timestamp: string }[];
}

export interface Tenant {
  id: string;
  slug: string;
  name: string;
  logoUrl?: string;
  primaryColor?: string;
  status: string;
  settings?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  tenantId: string;
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Branch {
  id: string;
  tenantId: string;
  name: string;
  address?: string;
  city?: string;
  phone?: string;
  email?: string;
  isActive: boolean;
  operatingHours?: Record<string, any>;
  createdAt: string;
}

export const adminApiService = {
  getDashboard: () =>
    adminApi.get<DashboardStats>('/admin/dashboard').then((r) => r.data),

  listTenants: () =>
    adminApi.get<Tenant[]>('/tenants').then((r) => r.data),

  getTenant: (id: string) =>
    adminApi.get<Tenant>(`/tenants/${id}`).then((r) => r.data),

  createTenant: (data: Partial<Tenant>) =>
    adminApi.post<Tenant>('/tenants', data).then((r) => r.data),

  updateTenant: (id: string, data: Partial<Tenant>) =>
    adminApi.put<Tenant>(`/tenants/${id}`, data).then((r) => r.data),

  deleteTenant: (id: string) =>
    adminApi.delete(`/tenants/${id}`),

  listTenantsSummary: () =>
    adminApi.get<any[]>('/admin/tenants').then((r) => r.data),

  getSettings: () =>
    adminApi.get<Record<string, string>>('/admin/settings').then((r) => r.data),

  updateSetting: (key: string, value: string) =>
    adminApi.post('/admin/settings', { key, value }).then((r) => r.data),

  resetPassword: (userId: string) =>
    adminApi.post<{ newPassword: string }>(`/admin/users/${userId}/reset-password`).then((r) => r.data),

  listUsers: (tenantId?: string, role?: string, page?: number, limit?: number) =>
    adminApi.get<{ data: User[]; total: number; page: number; limit: number }>('/users', { params: { tenantId, role, page, limit } }).then((r) => r.data),

  getUser: (id: string) =>
    adminApi.get<User>(`/users/${id}`).then((r) => r.data),

  createUser: (data: Partial<User>) =>
    adminApi.post<User>('/users', data).then((r) => r.data),

  updateUser: (id: string, data: Partial<User>) =>
    adminApi.put<User>(`/users/${id}`, data).then((r) => r.data),

  deleteUser: (id: string) =>
    adminApi.delete(`/users/${id}`),

  listBranches: (tenantId: string) =>
    adminApi.get<Branch[]>('/branches', { params: { tenantId } }).then((r) => r.data),

  listPlans: () =>
    adminApi.get<any[]>('/billing/plans').then((r) => r.data),

  updatePlan: (id: string, data: any) =>
    adminApi.put<any>(`/billing/plans/${id}`, data).then((r) => r.data),

  listInvoices: (tenantId?: string) =>
    adminApi.get<any[]>('/billing/invoices', { params: { tenantId } }).then((r) => r.data),

  assignPlan: (tenantId: string, planId: string) =>
    adminApi.post(`/admin/tenants/${tenantId}/plan`, { planId }).then((r) => r.data),

  getGeographicDistribution: () =>
    adminApi.get<{ city: string; count: number }[]>('/admin/analytics/geographic').then((r) => r.data),

  getTenantMetrics: (tenantId: string) =>
    adminApi.get<any>(`/admin/tenants/${tenantId}/metrics`).then((r) => r.data),

  getRevenueRecognition: () =>
    adminApi.get<any>('/billing/revenue').then((r) => r.data),
};

export default adminApi;
