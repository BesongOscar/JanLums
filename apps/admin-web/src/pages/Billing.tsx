import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download, Star, Check, DollarSign } from 'lucide-react';
import { adminApiService } from '../api/adminApi';

interface SubscriptionPlan {
  id: string;
  slug: string;
  name: string;
  price: number;
  maxTenants: number;
  maxBranches: number;
  maxUsers: number;
  isActive: boolean;
  isPopular: boolean;
  isDefault: boolean;
}



export default function Billing() {
  const queryClient = useQueryClient();

  const { data: plans } = useQuery({
    queryKey: ['billing-plans'],
    queryFn: () => adminApiService.listPlans(),
    staleTime: 60000,
  });

  const { data: invoices } = useQuery({
    queryKey: ['billing-invoices'],
    queryFn: () => adminApiService.listInvoices(),
    staleTime: 30000,
  });

  const { data: revenue } = useQuery({
    queryKey: ['billing-revenue'],
    queryFn: () => adminApiService.getRevenueRecognition(),
    staleTime: 60000,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SubscriptionPlan> }) =>
      adminApiService.updatePlan(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['billing-plans'] }),
  });

  const setDefault = (id: string) => {
    if (plans) {
      plans.forEach((p) => {
        if (p.id !== id && p.isDefault) {
          updateMutation.mutate({ id: p.id, data: { isDefault: false } });
        }
      });
    }
    updateMutation.mutate({ id, data: { isDefault: true } });
  };

  const togglePopular = (id: string, current: boolean) => {
    updateMutation.mutate({ id, data: { isPopular: !current } });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(plans || []).map((plan) => (
          <div
            key={plan.id}
            className={`bg-white rounded-lg shadow-sm border p-6 relative ${plan.isPopular ? 'ring-2 ring-primary-500' : ''}`}
          >
            {plan.isPopular && (
              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-primary-600 text-white text-xs font-medium rounded-full flex items-center gap-1">
                <Star className="w-3 h-3" />
                Popular
              </span>
            )}
            {plan.isDefault && (
              <span className="absolute top-3 right-3 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full flex items-center gap-1">
                <Check className="w-3 h-3" />
                Default
              </span>
            )}
            <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
            <p className="mt-2">
              <span className="text-3xl font-bold text-gray-900">${plan.price}</span>
              <span className="text-gray-500 text-sm">/month</span>
            </p>
            <ul className="mt-4 space-y-2 text-sm text-gray-600">
              <li>{plan.maxTenants >= 100 ? 'Unlimited' : plan.maxTenants} tenant{plan.maxTenants !== 1 ? 's' : ''}</li>
              <li>{plan.maxBranches >= 100 ? 'Unlimited' : plan.maxBranches} branch{plan.maxBranches !== 1 ? 'es' : ''}</li>
              <li>{plan.maxUsers >= 100 ? 'Unlimited' : plan.maxUsers} users</li>
            </ul>
            <div className="mt-4 flex flex-col gap-2">
              <button
                onClick={() => setDefault(plan.id)}
                disabled={plan.isDefault || updateMutation.isPending}
                className="w-full py-2 rounded-lg text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {plan.isDefault ? 'Default Plan' : 'Set as Default'}
              </button>
              <button
                onClick={() => togglePopular(plan.id, plan.isPopular)}
                disabled={updateMutation.isPending}
                className={`w-full py-2 rounded-lg text-sm font-medium ${
                  plan.isPopular
                    ? 'bg-primary-600 text-white hover:bg-primary-700'
                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                } disabled:opacity-50`}
              >
                {plan.isPopular ? 'Remove Popular' : 'Mark Popular'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {revenue && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-50 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Revenue Recognition</h3>
              <p className="text-2xl font-bold text-green-700">${revenue.totalRecognized.toFixed(2)}</p>
            </div>
          </div>
          {revenue.byMonth?.length > 0 && (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenue.byMonth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="amount" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
          {revenue.byTenant?.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-500 mb-2">By Tenant</h4>
              <div className="space-y-2">
                {revenue.byTenant.map((t: any) => (
                  <div key={t.name} className="flex items-center justify-between text-sm bg-gray-50 rounded-lg px-4 py-2">
                    <span className="text-gray-700">{t.name}</span>
                    <span className="font-medium text-gray-900">${t.amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Invoices</h3>
          <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Invoice</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Tenant</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Plan</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {!invoices || invoices.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500">No invoices yet</td></tr>
            ) : (
              invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">#{inv.id.slice(0, 8)}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{inv.tenant?.name || 'Unknown'}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{inv.plan?.name || '-'}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">${Number(inv.amount).toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      inv.status === 'paid' ? 'bg-green-100 text-green-800' :
                      inv.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(inv.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
