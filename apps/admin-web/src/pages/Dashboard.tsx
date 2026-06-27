import { useQuery } from '@tanstack/react-query';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { adminApiService } from '../api/adminApi';
import StatCard from '../components/StatCard';

export default function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: adminApiService.getDashboard,
  });

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Tenants" value={isLoading ? '...' : data?.totalTenants ?? 0} color="bg-blue-50 text-blue-700" />
        <StatCard label="Active Users" value={isLoading ? '...' : data?.activeUsers ?? 0} color="bg-green-50 text-green-700" />
        <StatCard label="Orders Today" value={isLoading ? '...' : data?.totalOrdersToday ?? 0} color="bg-purple-50 text-purple-700" />
        <StatCard label="Revenue Today" value={isLoading ? '...' : `$${data?.revenueToday ?? 0}`} color="bg-amber-50 text-amber-700" />
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend (30 days)</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data?.revenueTrend || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} tickFormatter={(v) => v?.slice(5) || ''} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Volume by Tenant</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.orderVolumeByTenant || []} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis type="category" dataKey="tenantName" tick={{ fontSize: 12 }} width={100} />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">New Tenant Signups</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.tenantSignups || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} tickFormatter={(v) => v?.slice(5) || ''} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        {isLoading ? (
          <p className="text-gray-500">Loading...</p>
        ) : data?.recentActivity?.length ? (
          <div className="divide-y">
            {data.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm text-gray-900">{activity.description}</p>
                  <p className="text-xs text-gray-500">{activity.tenantName}</p>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(activity.timestamp).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No recent activity</p>
        )}
      </div>
    </>
  );
}
