import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Building2, MapPin, Phone, Mail, CreditCard, Trash2, AlertTriangle, ShoppingBag, DollarSign, Users, Map } from 'lucide-react';
import { adminApiService } from '../api/adminApi';

export default function TenantDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: () => adminApiService.deleteTenant(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants-summary'] });
      navigate('/tenants');
    },
  });

  const { data: tenant, isLoading: tenantLoading } = useQuery({
    queryKey: ['tenant', id],
    queryFn: () => adminApiService.getTenant(id!),
    enabled: !!id,
    staleTime: 30000,
  });

  const { data: branches } = useQuery({
    queryKey: ['branches', id],
    queryFn: () => adminApiService.listBranches(id!),
    enabled: !!id,
    staleTime: 30000,
  });

  const { data: usersResp } = useQuery({
    queryKey: ['users', id],
    queryFn: () => adminApiService.listUsers(id!),
    enabled: !!id,
    staleTime: 30000,
  });
  const users = usersResp?.data;

  const { data: plans } = useQuery({
    queryKey: ['billing-plans'],
    queryFn: () => adminApiService.listPlans(),
    staleTime: 60000,
  });

  const { data: invoices } = useQuery({
    queryKey: ['billing-invoices-tenant', id],
    queryFn: () => adminApiService.listInvoices(id),
    enabled: !!id,
    staleTime: 15000,
  });

  const assignPlanMutation = useMutation({
    mutationFn: (planId: string) => adminApiService.assignPlan(id!, planId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billing-invoices-tenant', id] });
      setShowPlanModal(false);
    },
  });

  const currentPlanId = invoices?.[0]?.planId;
  const currentPlanName = invoices?.[0]?.plan?.name || 'None';

  const { data: metrics } = useQuery({
    queryKey: ['tenant-metrics', id],
    queryFn: () => adminApiService.getTenantMetrics(id!),
    enabled: !!id,
    staleTime: 15000,
  });

  if (tenantLoading || !tenant) {
    return <div className="text-center text-gray-500 py-12">Loading tenant details...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center shrink-0">
            <Building2 className="w-8 h-8 text-primary-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{tenant.name}</h2>
                <p className="text-sm text-gray-500">@{tenant.slug}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                  title="Delete tenant"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  tenant.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {tenant.status}
                </span>
              </div>
            </div>
            {tenant.primaryColor && (
              <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                <span>Brand color:</span>
                <span className="w-4 h-4 rounded-full border" style={{ backgroundColor: tenant.primaryColor }} />
                <span>{tenant.primaryColor}</span>
              </div>
            )}
            <p className="mt-2 text-xs text-gray-400">Created {new Date(tenant.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Branches ({branches?.length || 0})</h3>
          {branches?.length === 0 ? (
            <p className="text-gray-500 text-sm">No branches</p>
          ) : (
            <div className="space-y-3">
              {branches?.map((b) => (
                <div key={b.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{b.name}</p>
                    {b.address && <p className="text-xs text-gray-500">{b.address}</p>}
                    <div className="flex gap-3 mt-1">
                      {b.phone && <span className="text-xs text-gray-400 flex items-center gap-1"><Phone className="w-3 h-3" />{b.phone}</span>}
                      {b.email && <span className="text-xs text-gray-400 flex items-center gap-1"><Mail className="w-3 h-3" />{b.email}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Accounts ({users?.length || 0})</h3>
          {users?.length === 0 ? (
            <p className="text-gray-500 text-sm">No users</p>
          ) : (
            <div className="space-y-2">
              {users?.map((u) => (
                <div key={u.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{u.firstName} {u.lastName}</p>
                    <p className="text-xs text-gray-500">{u.email}</p>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary-50 text-primary-700">
                    {u.role}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Subscription</h3>
          <button
            onClick={() => setShowPlanModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700"
          >
            <CreditCard className="w-4 h-4" />
            Change Plan
          </button>
        </div>
        <p className="text-sm">
          <span className="text-gray-500">Current plan:</span>{' '}
          <span className="font-medium text-gray-900">{currentPlanName}</span>
        </p>
        {invoices && invoices.length > 0 && (
          <div className="mt-3 space-y-2">
            {invoices.map((inv: any) => (
              <div key={inv.id} className="flex items-center justify-between text-sm bg-gray-50 rounded-lg px-4 py-2">
                <span className="text-gray-600">{inv.plan?.name || 'Plan'} — ${Number(inv.amount).toFixed(2)}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  inv.status === 'paid' ? 'bg-green-100 text-green-800' :
                  inv.status === 'active' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>{inv.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage Metrics</h3>
        {!metrics ? (
          <p className="text-gray-500 text-sm">Loading metrics...</p>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <ShoppingBag className="w-5 h-5 text-blue-600 mb-1" />
                <p className="text-2xl font-bold text-blue-700">{metrics.totalOrders}</p>
                <p className="text-xs text-blue-600">Total Orders</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <DollarSign className="w-5 h-5 text-green-600 mb-1" />
                <p className="text-2xl font-bold text-green-700">${Number(metrics.totalRevenue).toFixed(2)}</p>
                <p className="text-xs text-green-600">Total Revenue</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <Users className="w-5 h-5 text-purple-600 mb-1" />
                <p className="text-2xl font-bold text-purple-700">{metrics.activeUsers}</p>
                <p className="text-xs text-purple-600">Active Users</p>
              </div>
              <div className="bg-amber-50 rounded-lg p-4">
                <Map className="w-5 h-5 text-amber-600 mb-1" />
                <p className="text-2xl font-bold text-amber-700">{metrics.activeBranches}</p>
                <p className="text-xs text-amber-600">Active Branches</p>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {metrics.ordersByDay?.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-3">Orders (30 days)</h4>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={metrics.ordersByDay}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(v) => v?.slice(5) || ''} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Bar dataKey="count" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
              {metrics.popularServices?.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-3">Top Services</h4>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={metrics.popularServices} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis type="number" tick={{ fontSize: 11 }} />
                        <YAxis type="category" dataKey="garmentType" tick={{ fontSize: 11 }} width={90} />
                        <Tooltip />
                        <Bar dataKey="count" fill="#10b981" radius={[0, 2, 2, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowDeleteConfirm(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Delete Tenant</h2>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Are you sure you want to delete <strong>{tenant.name}</strong>?
            </p>
            <p className="text-sm text-red-600 mb-6">
              This will permanently remove all associated data including branches, users, orders, and settings. This action cannot be undone.
            </p>
            {deleteMutation.isError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700 mb-4">
                {(deleteMutation.error as any)?.response?.data?.message || 'Failed to delete tenant.'}
              </div>
            )}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteMutation.mutate()}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50"
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showPlanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowPlanModal(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Select a Plan</h2>
            <div className="space-y-3">
              {(plans || []).map((plan: any) => {
                const isCurrent = plan.id === currentPlanId;
                return (
                  <button
                    key={plan.id}
                    onClick={() => !isCurrent && assignPlanMutation.mutate(plan.id)}
                    disabled={isCurrent || assignPlanMutation.isPending}
                    className={`w-full text-left p-4 rounded-lg border transition-colors ${
                      isCurrent
                        ? 'border-primary-500 bg-primary-50 cursor-default'
                        : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                    } disabled:opacity-60`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{plan.name}</p>
                        <p className="text-sm text-gray-500">${plan.price}/mo — {plan.maxTenants} tenants, {plan.maxBranches} branches, {plan.maxUsers} users</p>
                      </div>
                      {isCurrent && <span className="text-xs font-medium text-primary-600 bg-primary-100 px-2 py-0.5 rounded-full">Current</span>}
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowPlanModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
