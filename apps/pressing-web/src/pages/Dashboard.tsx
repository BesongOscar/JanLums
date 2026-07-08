import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useOrderStats, useOrders } from '../hooks/useOrders';
import { useReportsSummary, useTopServices } from '../hooks/useReports';
import { useVehicles, useDrivers, useRoutes } from '../hooks/useDelivery';
import { LoadingState } from '../components/ui/States';

const statusStyles: Record<string, string> = {
  pending: 'bg-warning-100 text-warning-700',
  processing: 'bg-warning-100 text-warning-700',
  ready: 'bg-success-100 text-success-700',
  completed: 'bg-success-100 text-success-700',
};

export default function Dashboard() {
  const { user } = useAuth();
  const tenantId = user?.tenantId || '';
  const { data: stats, isLoading: statsLoading } = useOrderStats(tenantId);
  const { data: ordersData, isLoading: ordersLoading } = useOrders(tenantId);
  const { data: summary, isLoading: summaryLoading } = useReportsSummary(tenantId, 'weekly');
  const { data: topServices, isLoading: servicesLoading } = useTopServices(tenantId);
  const { data: vehicles } = useVehicles(tenantId);
  const { data: drivers } = useDrivers(tenantId);
  const { data: routes } = useRoutes(tenantId);

  const isLoading = statsLoading || ordersLoading || summaryLoading || servicesLoading;

  const kpis = stats ? [
    { label: 'Total Orders', value: String(stats.totalOrders ?? 0), color: 'text-primary' },
    { label: 'Pending', value: String(stats.pendingOrders ?? 0), color: 'text-warning' },
    { label: 'Processing', value: String(stats.processingOrders ?? 0), color: 'text-info' },
    { label: 'Ready for Pickup', value: String(stats.readyOrders ?? 0), color: 'text-success' },
    { label: 'Completed', value: String(stats.completedOrders ?? 0), color: 'text-success' },
  ] : [];

  const orders = Array.isArray(ordersData) ? ordersData : [];
  const recentOrders = orders.slice(0, 3);
  const qcOrders = orders.filter((o: any) => o.status === 'quality_check');
  const activities = orders.slice(0, 5);
  const summaryRows = Array.isArray(summary) ? summary : [];
  const services = Array.isArray(topServices) ? topServices : [];
  const vehicleList = Array.isArray(vehicles) ? vehicles : [];
  const driverList = Array.isArray(drivers) ? drivers : [];
  const routeList = Array.isArray(routes) ? routes : [];

  const totals = summaryRows.length > 0 ? {
    revenue: summaryRows.reduce((s: number, r: any) => s + r.revenue, 0),
    orders: summaryRows.reduce((s: number, r: any) => s + r.orders, 0),
  } : null;

  const getStatusClass = (status: string) => statusStyles[status] || 'bg-neutral-100 text-neutral-600';

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingState />
      </div>
    );
  }

  return (
    <div>
      <div className="page-chrome">
        <h1 className="page-title">Dashboard</h1>
        <div className="flex items-center gap-3">
          <Link to="/orders/new" className="bg-primary text-white px-4 py-2 rounded text-sm font-bold no-underline hover:bg-primary-dark">+ New Order</Link>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4 my-6">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="bg-white border border-neutral-200 rounded p-4 shadow-sm">
            <div className="text-neutral-500 text-xs mb-1">{kpi.label}</div>
            <div className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-white border border-neutral-200 rounded shadow-sm">
          <div className="px-5 py-4 border-b border-neutral-200">
            <h3 className="text-base font-bold text-neutral-800">Revenue Trends</h3>
          </div>
          <div className="p-5">
            {totals ? (
              <div className="text-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-neutral-500">This Week</span>
                  <span className="text-lg font-bold text-primary">{totals.revenue.toLocaleString()} FCFA</span>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-neutral-500">Orders</span>
                  <span className="text-lg font-bold text-neutral-800">{totals.orders}</span>
                </div>
                <div className="space-y-2 mt-4">
                  {summaryRows.slice(0, 5).map((r: any) => (
                    <div key={r.period} className="flex items-center justify-between text-xs">
                      <span className="text-neutral-500">{r.period}</span>
                      <span className="font-medium">{r.revenue.toLocaleString()} FCFA</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-sm text-neutral-400 text-center py-4">No revenue data yet</div>
            )}
          </div>
        </div>
        <div className="bg-white border border-neutral-200 rounded shadow-sm">
          <div className="px-5 py-4 border-b border-neutral-200">
            <h3 className="text-base font-bold text-neutral-800">Top Services</h3>
          </div>
          <div className="p-5">
            {services.length > 0 ? (
              <div className="space-y-3">
                {services.slice(0, 5).map((s: any) => (
                  <div key={s.name}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-neutral-800 font-medium">{s.name}</span>
                      <span className="text-primary font-bold">{s.revenue.toLocaleString()} FCFA</span>
                    </div>
                    <div className="h-1.5 bg-neutral-100 rounded-full">
                      <div className="h-1.5 bg-primary rounded-full" style={{ width: `${s.share}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-neutral-400 text-center py-4">No service data yet</div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="bg-white border border-neutral-200 rounded shadow-sm">
          <div className="px-5 py-4 border-b border-neutral-200">
            <h3 className="text-base font-bold text-neutral-800">Recent Orders</h3>
          </div>
          <div className="divide-y divide-neutral-100">
            {recentOrders.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-neutral-400">No orders yet</div>
            ) : (
              recentOrders.map((order: any) => (
                <div key={order.id} className="px-5 py-3 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-neutral-800">{order.id?.slice(0, 8)}</div>
                    <div className="text-xs text-neutral-500">
                      {order.customer?.firstName} {order.customer?.lastName}
                    </div>
                  </div>
                  <span className={`status-pill text-xs ${getStatusClass(order.status)}`}>{order.status}</span>
                </div>
              ))
            )}
          </div>
          <div className="px-5 py-3 border-t border-neutral-100">
            <Link to="/orders" className="text-sm text-primary no-underline hover:underline">View all orders →</Link>
          </div>
        </div>
        <div className="bg-white border border-neutral-200 rounded shadow-sm">
          <div className="px-5 py-4 border-b border-neutral-200">
            <h3 className="text-base font-bold text-neutral-800">QC Exceptions</h3>
          </div>
          <div className="p-5">
            {qcOrders.length > 0 ? (
              <div className="divide-y divide-neutral-100">
                {qcOrders.map((order: any) => (
                  <div key={order.id} className="py-2 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-neutral-800">{order.id?.slice(0, 8)}</div>
                      <div className="text-xs text-neutral-500">{order.customer?.firstName} {order.customer?.lastName}</div>
                    </div>
                    <span className="text-xs bg-danger-100 text-danger-700 px-2 py-0.5 rounded">QC</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-neutral-400 text-center py-4">No QC exceptions</div>
            )}
          </div>
        </div>
        <div className="bg-white border border-neutral-200 rounded shadow-sm">
          <div className="px-5 py-4 border-b border-neutral-200">
            <h3 className="text-base font-bold text-neutral-800">Delivery Updates</h3>
          </div>
          <div className="p-5 text-sm">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Vehicles</span>
                <span className="font-bold text-neutral-800">{vehicleList.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Drivers</span>
                <span className="font-bold text-neutral-800">{driverList.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">Active Routes</span>
                <span className="font-bold text-neutral-800">{routeList.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-neutral-200 rounded shadow-sm mb-6">
        <div className="px-5 py-4 border-b border-neutral-200">
          <h3 className="text-base font-bold text-neutral-800">Activity Feed</h3>
        </div>
        <div className="divide-y divide-neutral-100">
          {activities.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-neutral-400">No activity yet</div>
          ) : (
            activities.map((order: any) => (
              <div key={order.id} className="px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <div>
                    <div className="text-sm text-neutral-800">
                      Order <span className="font-mono font-medium">{order.id?.slice(0, 8)}</span> — {order.status}
                    </div>
                    <div className="text-xs text-neutral-500">
                      {order.customer?.firstName} {order.customer?.lastName}
                      {order.createdAt && ` · ${new Date(order.createdAt).toLocaleDateString()}`}
                    </div>
                  </div>
                </div>
                <span className={`status-pill text-xs ${getStatusClass(order.status)}`}>{order.status}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
