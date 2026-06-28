import { Link } from 'react-router-dom';

const kpiCards = [
  { label: 'Orders Today', value: '24', change: '+8%', icon: '\uD83D\uDCCB' },
  { label: 'Revenue Today', value: '45,600 FCFA', change: '+18%', icon: '\uD83D\uDCB0' },
  { label: 'Garments in Process', value: '187', change: '+5%', icon: '\uD83D\uDEC3' },
  { label: 'Ready for Pickup', value: '38', change: '-2%', icon: '\u2705' },
  { label: 'Pending Deliveries', value: '12', change: '+3%', icon: '\uD83D\uDE9A' },
  { label: 'Active Customers', value: '89', change: '+12%', icon: '\uD83D\uDC65' },
];

const ordersByHour = [
  { hour: '6a', count: 2 }, { hour: '7a', count: 5 }, { hour: '8a', count: 8 },
  { hour: '9a', count: 12 }, { hour: '10a', count: 15 }, { hour: '11a', count: 14 },
  { hour: '12p', count: 10 }, { hour: '1p', count: 7 }, { hour: '2p', count: 9 },
  { hour: '3p', count: 11 }, { hour: '4p', count: 6 }, { hour: '5p', count: 3 },
];

const revenueTrend = [
  { day: 'Mon', amount: 32000 },
  { day: 'Tue', amount: 28000 },
  { day: 'Wed', amount: 35000 },
  { day: 'Thu', amount: 41000 },
  { day: 'Fri', amount: 38000 },
  { day: 'Sat', amount: 45600 },
  { day: 'Sun', amount: 22000 },
];

const topServices = [
  { name: 'Wash & Fold', count: 89, pct: 100 },
  { name: 'Dry Cleaning', count: 54, pct: 61 },
  { name: 'Ironing / Pressing', count: 42, pct: 47 },
  { name: 'Stain Removal', count: 28, pct: 31 },
  { name: 'Express Service', count: 15, pct: 17 },
];

const garmentStatusDist = [
  { label: 'Received', count: 45, color: 'bg-info' },
  { label: 'In Wash', count: 62, color: 'bg-primary' },
  { label: 'In Press', count: 38, color: 'bg-warning' },
  { label: 'QC Check', count: 25, color: 'bg-warning' },
  { label: 'Ready', count: 38, color: 'bg-success' },
  { label: 'Out for Delivery', count: 12, color: 'bg-info' },
];

const orders = [
  { id: 'ORD-001', customer: 'Jean Dupont', items: 5, status: 'Processing', total: 12500, date: '2024-01-15' },
  { id: 'ORD-002', customer: 'Marie Claire', items: 3, status: 'Ready', total: 8000, date: '2024-01-15' },
  { id: 'ORD-003', customer: 'Paul Martin', items: 8, status: 'Pending', total: 20000, date: '2024-01-14' },
  { id: 'ORD-004', customer: 'Sarah Johnson', items: 2, status: 'Completed', total: 5500, date: '2024-01-14' },
  { id: 'ORD-005', customer: 'Michel Brown', items: 6, status: 'Processing', total: 15000, date: '2024-01-13' },
];

const statusStyles: Record<string, string> = {
  Processing: 'bg-warning-100 text-warning-700',
  Ready: 'bg-success-100 text-success-700',
  Pending: 'bg-warning-100 text-warning-700',
  Completed: 'bg-success-100 text-success-700',
};

const activities = [
  { type: 'order', text: 'ORD-004 marked as Ready for pickup', time: '2 min ago', icon: '\u2705', color: 'text-success' },
  { type: 'qc', text: 'ORD-003 failed QC — 2 garments sent to rewash', time: '15 min ago', icon: '\u26A0\uFE0F', color: 'text-danger' },
  { type: 'delivery', text: 'Driver Paul started Route B — 5 stops', time: '32 min ago', icon: '\uD83D\uDE9A', color: 'text-info' },
  { type: 'order', text: 'New order ORD-006 received (Marie Claire)', time: '1 hour ago', icon: '\uD83D\uDCE5', color: 'text-primary' },
  { type: 'qc', text: 'QC passed for ORD-002 — ready for delivery', time: '1.5 hours ago', icon: '\u2705', color: 'text-success' },
  { type: 'delivery', text: 'Delivery completed — Route A all stops delivered', time: '2 hours ago', icon: '\uD83C\uDF89', color: 'text-success' },
];

const maxOrderCount = Math.max(...ordersByHour.map(o => o.count));
const maxRevenue = Math.max(...revenueTrend.map(r => r.amount));

export default function Dashboard() {
  const getStatusClass = (status: string) =>
    statusStyles[status] || 'bg-neutral-100 text-neutral-600';

  return (
    <div>
      <div className="page-chrome">
        <h1 className="page-title">Dashboard</h1>
        <Link
          to="/orders/new"
          className="bg-primary text-white px-4 py-2 rounded text-sm font-bold no-underline hover:bg-primary-dark"
        >
          + New Order
        </Link>
      </div>

      <div className="grid grid-cols-6 gap-4 my-6">
        {kpiCards.map((kpi) => (
          <div key={kpi.label} className="bg-white border border-neutral-200 rounded p-4 shadow-sm">
            <div className="text-2xl mb-2">{kpi.icon}</div>
            <div className="text-neutral-500 text-xs mb-1">{kpi.label}</div>
            <div className="text-xl font-bold text-neutral-900">{kpi.value}</div>
            <div className={`text-xs mt-1 ${kpi.change.startsWith('+') ? 'text-success' : 'text-danger'}`}>
              {kpi.change} vs yesterday
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-white border border-neutral-200 rounded shadow-sm">
          <div className="px-5 py-4 border-b border-neutral-200">
            <h3 className="text-base font-bold text-neutral-800">Orders by Hour (Today)</h3>
          </div>
          <div className="p-5">
            <div className="flex items-end gap-2 h-32">
              {ordersByHour.map((item) => (
                <div key={item.hour} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-primary rounded-t"
                    style={{ height: `${(item.count / maxOrderCount) * 100}%`, minHeight: '4px' }}
                  />
                  <span className="text-xs text-neutral-500">{item.hour}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded shadow-sm">
          <div className="px-5 py-4 border-b border-neutral-200">
            <h3 className="text-base font-bold text-neutral-800">Revenue Trend (7 Days)</h3>
          </div>
          <div className="p-5">
            <div className="flex items-end gap-2 h-32">
              {revenueTrend.map((item) => (
                <div key={item.day} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-success rounded-t"
                    style={{ height: `${(item.amount / maxRevenue) * 100}%`, minHeight: '4px' }}
                  />
                  <span className="text-xs text-neutral-500">{item.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-white border border-neutral-200 rounded shadow-sm">
          <div className="px-5 py-4 border-b border-neutral-200">
            <h3 className="text-base font-bold text-neutral-800">Top Services</h3>
          </div>
          <div className="p-5 space-y-3">
            {topServices.map((svc) => (
              <div key={svc.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-neutral-700">{svc.name}</span>
                  <span className="text-neutral-500 font-medium">{svc.count}</span>
                </div>
                <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${svc.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded shadow-sm">
          <div className="px-5 py-4 border-b border-neutral-200">
            <h3 className="text-base font-bold text-neutral-800">Garment Status Distribution</h3>
          </div>
          <div className="p-5 space-y-3">
            {garmentStatusDist.map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-neutral-700">{item.label}</span>
                  <span className="text-neutral-500 font-medium">{item.count}</span>
                </div>
                <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${item.color}`}
                    style={{ width: `${(item.count / garmentStatusDist.reduce((s, g) => s + g.count, 0)) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="bg-white border border-neutral-200 rounded shadow-sm">
          <div className="px-5 py-4 border-b border-neutral-200">
            <h3 className="text-base font-bold text-neutral-800">Recent Orders</h3>
          </div>
          <div className="divide-y divide-neutral-100">
            {orders.slice(0, 3).map((order) => (
              <div key={order.id} className="px-5 py-3 flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-neutral-800">{order.id}</div>
                  <div className="text-xs text-neutral-500">{order.customer}</div>
                </div>
                <span className={`status-pill text-xs ${getStatusClass(order.status)}`}>
                  {order.status}
                </span>
              </div>
            ))}
          </div>
          <div className="px-5 py-3 border-t border-neutral-100">
            <Link to="/orders" className="text-sm text-primary no-underline hover:underline">
              View all orders →
            </Link>
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded shadow-sm">
          <div className="px-5 py-4 border-b border-neutral-200">
            <h3 className="text-base font-bold text-neutral-800">QC Exceptions</h3>
          </div>
          <div className="divide-y divide-neutral-100">
            <div className="px-5 py-3">
              <div className="text-sm font-medium text-neutral-800">ORD-003 — Jean Dupont</div>
              <div className="text-xs text-danger mt-1">2 garments failed QC — rewash initiated</div>
              <div className="text-xs text-neutral-400 mt-0.5">15 min ago</div>
            </div>
          </div>
          <div className="px-5 py-3 text-center text-sm text-neutral-400 border-t border-neutral-100">
            No other exceptions
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded shadow-sm">
          <div className="px-5 py-4 border-b border-neutral-200">
            <h3 className="text-base font-bold text-neutral-800">Delivery Updates</h3>
          </div>
          <div className="divide-y divide-neutral-100">
            <div className="px-5 py-3">
              <div className="text-sm font-medium text-neutral-800">Route B — In Progress</div>
              <div className="text-xs text-neutral-500 mt-1">Driver: Paul — 3/5 stops completed</div>
              <div className="text-xs text-neutral-400 mt-0.5">Started 32 min ago</div>
            </div>
            <div className="px-5 py-3">
              <div className="text-sm font-medium text-neutral-800">Route A — Completed</div>
              <div className="text-xs text-success mt-1">All 4 stops delivered successfully</div>
              <div className="text-xs text-neutral-400 mt-0.5">2 hours ago</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-neutral-200 rounded shadow-sm mb-6">
        <div className="px-5 py-4 border-b border-neutral-200">
          <h3 className="text-base font-bold text-neutral-800">Activity Feed</h3>
        </div>
        <div className="divide-y divide-neutral-100">
          {activities.map((act, i) => (
            <div key={i} className="px-5 py-3 flex items-start gap-3">
              <span className={`text-base mt-0.5 ${act.color}`}>{act.icon}</span>
              <div className="flex-1">
                <p className="text-sm text-neutral-700">{act.text}</p>
                <p className="text-xs text-neutral-400 mt-0.5">{act.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
