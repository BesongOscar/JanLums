import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Download, FileSpreadsheet } from 'lucide-react';
import { adminApiService } from '../api/adminApi';
import * as XLSX from 'xlsx';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'];

export default function Analytics() {
  const { data } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: adminApiService.getDashboard,
  });

  const exportCSV = () => {
    if (!data?.revenueTrend) return;
    const csv = 'date,revenue\n' + data.revenueTrend.map((r) => `${r.date},${r.revenue}`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'revenue-trend.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportExcel = () => {
    if (!data) return;
    const wb = XLSX.utils.book_new();
    if (data.revenueTrend.length) {
      const ws = XLSX.utils.json_to_sheet(data.revenueTrend);
      XLSX.utils.book_append_sheet(wb, ws, 'Revenue Trend');
    }
    if (data.orderVolumeByTenant.length) {
      const ws = XLSX.utils.json_to_sheet(data.orderVolumeByTenant);
      XLSX.utils.book_append_sheet(wb, ws, 'Order Volume');
    }
    if (data.tenantSignups.length) {
      const ws = XLSX.utils.json_to_sheet(data.tenantSignups);
      XLSX.utils.book_append_sheet(wb, ws, 'Tenant Signups');
    }
    if (data.recentActivity.length) {
      const ws = XLSX.utils.json_to_sheet(data.recentActivity);
      XLSX.utils.book_append_sheet(wb, ws, 'Recent Activity');
    }
    XLSX.writeFile(wb, 'platform-analytics.xlsx', { bookType: 'xlsx' });
  };

  return (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Platform Reports</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
          >
            <Download className="w-4 h-4" />
            CSV
          </button>
          <button
            onClick={exportExcel}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Excel
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-4">Revenue by Tenant</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data?.orderVolumeByTenant || []}
                  dataKey="count"
                  nameKey="tenantName"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ tenantName, count }) => `${tenantName} (${count})`}
                >
                  {(data?.orderVolumeByTenant || []).map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-4">Order Volume Trends</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.revenueTrend || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} tickFormatter={(v) => v?.slice(5) || ''} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-4">Customer Acquisition</h3>
          <div className="h-72">
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

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-4">Geographic Distribution</h3>
          <div className="h-72 flex items-center justify-center text-gray-400">
            Geographic map will be available here.
          </div>
        </div>
      </div>
    </div>
  );
}
