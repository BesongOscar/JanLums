import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../components/ui/Toast';

const orders = [
  { id: 'ORD-001', customer: 'Jean Dupont', items: 5, status: 'Processing', total: 12500, date: '2024-01-15', phone: '+237 612 345 678' },
  { id: 'ORD-002', customer: 'Marie Claire', items: 3, status: 'Ready', total: 8000, date: '2024-01-15', phone: '+237 623 456 789' },
  { id: 'ORD-003', customer: 'Paul Martin', items: 8, status: 'Pending', total: 20000, date: '2024-01-14', phone: '+237 634 567 890' },
  { id: 'ORD-004', customer: 'Sarah Johnson', items: 2, status: 'Completed', total: 5500, date: '2024-01-14', phone: '+237 645 678 901' },
  { id: 'ORD-005', customer: 'Michel Brown', items: 6, status: 'Processing', total: 15000, date: '2024-01-13', phone: '+237 656 789 012' },
  { id: 'ORD-006', customer: 'Alice Kamga', items: 4, status: 'Pending', total: 9800, date: '2024-01-13', phone: '+237 667 890 123' },
  { id: 'ORD-007', customer: 'Bob Nkwi', items: 7, status: 'Ready', total: 18200, date: '2024-01-12', phone: '+237 678 901 234' },
  { id: 'ORD-008', customer: 'Claire Atangana', items: 3, status: 'Completed', total: 7200, date: '2024-01-12', phone: '+237 689 012 345' },
];

const statusPills = [
  { label: 'All', count: 156, color: 'primary' },
  { label: 'Pending', count: 23, color: 'warning' },
  { label: 'Processing', count: 45, color: 'info' },
  { label: 'Ready', count: 38, color: 'success' },
  { label: 'Completed', count: 50, color: 'danger' },
];

const statusStyles: Record<string, string> = {
  Processing: 'bg-warning-100 text-warning-700',
  Ready: 'bg-success-100 text-success-700',
  Pending: 'bg-warning-100 text-warning-700',
  Completed: 'bg-success-100 text-success-700',
};

const colorMap: Record<string, string> = {
  primary: 'bg-primary text-white',
  warning: 'bg-warning text-white',
  info: 'bg-info text-white',
  success: 'bg-success text-white',
  danger: 'bg-danger text-white',
};

const dimMap: Record<string, string> = {
  primary: 'bg-primary/60 text-primary',
  warning: 'bg-warning/60 text-warning',
  info: 'bg-info/60 text-info',
  success: 'bg-success/60 text-success',
  danger: 'bg-danger/60 text-danger',
};

type QuickAction = 'receive' | 'tag' | 'status' | null;

export default function Orders() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [activePill, setActivePill] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [activeAction, setActiveAction] = useState<QuickAction>(null);

  const getStatusClass = (status: string) =>
    statusStyles[status] || 'bg-neutral-100 text-neutral-600';

  const handleQuickAction = (orderId: string, action: QuickAction) => {
    setActiveAction(action);
    setTimeout(() => {
      showToast(`${action === 'receive' ? 'Received' : action === 'tag' ? 'Tagged' : 'Status updated'} — ${orderId}`, 'success');
      setActiveAction(null);
    }, 300);
  };

  return (
    <div>
      <div className="page-chrome">
        <h1 className="page-title">Orders</h1>
        <Link
          to="/orders/new"
          className="bg-primary text-white px-4 py-2 rounded text-sm font-bold no-underline hover:bg-primary-dark"
        >
          + New Order
        </Link>
      </div>

      <div className="bg-white border border-neutral-200 border-t-0 px-6 py-5 mb-6">
        <div className="flex justify-end items-center gap-3 mb-3">
          <input
            type="text"
            placeholder="Search by order ID or customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-1.5 border border-neutral-300 rounded text-sm w-60"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 border border-neutral-300 rounded text-sm"
          >
            <option>All Status</option>
            <option>Pending</option>
            <option>Processing</option>
            <option>Ready</option>
            <option>Completed</option>
          </select>
          <input type="date" className="px-3 py-1.5 border border-neutral-300 rounded text-sm" />
          <button className="px-4 py-1.5 border border-neutral-300 rounded bg-white cursor-pointer text-sm hover:bg-neutral-50">
            Export
          </button>
        </div>

        <div className="flex justify-end gap-2">
          {statusPills.map((pill) => (
            <button
              key={pill.label}
              onClick={() => setActivePill(pill.label)}
              className={`px-4 py-1.5 rounded border-none cursor-pointer text-xs font-bold transition-all ${
                activePill === pill.label ? colorMap[pill.color] : dimMap[pill.color]
              }`}
            >
              {pill.label} ({pill.count})
            </button>
          ))}
        </div>
      </div>

      <div className="data-table">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-neutral-50">
              {['Order ID', 'Customer', 'Items', 'Status', 'Total', 'Date', 'Quick Actions', ''].map((header) => (
                <th key={header} className="px-6 py-3 text-left font-bold text-primary border-b-2 border-neutral-200 text-sm">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr
                key={order.id}
                className={`${index % 2 === 0 ? 'bg-white' : 'bg-neutral-50'} hover:bg-primary-50 transition-colors`}
              >
                <td className="px-6 py-3 border-b border-neutral-200 font-medium">{order.id}</td>
                <td className="px-6 py-3 border-b border-neutral-200">
                  <div>{order.customer}</div>
                  <div className="text-xs text-neutral-400">{order.phone}</div>
                </td>
                <td className="px-6 py-3 border-b border-neutral-200">{order.items}</td>
                <td className="px-6 py-3 border-b border-neutral-200">
                  <span className={`status-pill ${getStatusClass(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-3 border-b border-neutral-200">{order.total.toLocaleString()} FCFA</td>
                <td className="px-6 py-3 border-b border-neutral-200 text-neutral-500">{order.date}</td>
                <td className="px-6 py-3 border-b border-neutral-200">
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleQuickAction(order.id, 'receive')}
                      disabled={activeAction !== null}
                      className="px-2 py-1 text-xs border border-info rounded bg-info/10 text-info cursor-pointer hover:bg-info/20 disabled:opacity-40"
                      title="Receive order"
                    >
                      Receive
                    </button>
                    <button
                      onClick={() => handleQuickAction(order.id, 'tag')}
                      disabled={activeAction !== null}
                      className="px-2 py-1 text-xs border border-warning rounded bg-warning/10 text-warning cursor-pointer hover:bg-warning/20 disabled:opacity-40"
                      title="Tag garments"
                    >
                      Tag
                    </button>
                    <button
                      onClick={() => handleQuickAction(order.id, 'status')}
                      disabled={activeAction !== null}
                      className="px-2 py-1 text-xs border border-primary rounded bg-primary/10 text-primary cursor-pointer hover:bg-primary/20 disabled:opacity-40"
                      title="Update status"
                    >
                      Status
                    </button>
                  </div>
                </td>
                <td className="px-6 py-3 border-b border-neutral-200">
                  <button
                    onClick={() => navigate(`/orders/${order.id}`)}
                    className="px-3 py-1 border border-primary rounded bg-white text-primary cursor-pointer text-xs hover:bg-primary-50"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-6 py-4 border-t border-neutral-200 flex items-center justify-between text-sm text-neutral-500">
          <span>Showing 1–8 of 156 orders</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-neutral-300 rounded bg-white cursor-pointer text-xs disabled:opacity-40" disabled>Prev</button>
            <button className="px-3 py-1 border border-neutral-300 rounded bg-white cursor-pointer text-xs">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
