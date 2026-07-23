import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useOrders, useOrderStats } from '../hooks/useOrders';
import { LoadingState } from '../components/ui/States';

const statusStyles: Record<string, string> = {
  pending: 'bg-warning-100 text-warning-700',
  processing: 'bg-warning-100 text-warning-700',
  ready: 'bg-success-100 text-success-700',
  completed: 'bg-success-100 text-success-700',
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

export default function Orders() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const tenantId = user?.tenantId || '';
  const { data: ordersData, isLoading: ordersLoading } = useOrders(tenantId);
  const { data: stats, isLoading: statsLoading } = useOrderStats(tenantId);
  const [activePill, setActivePill] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');

  const isLoading = ordersLoading || statsLoading;

  const orders = useMemo(() => {
    const list = Array.isArray(ordersData) ? ordersData : [];
    return list.filter((o: any) => {
      const matchesSearch = !searchTerm || 
        o.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${o.customer?.firstName || ''} ${o.customer?.lastName || ''}`.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All Status' || o.status === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [ordersData, searchTerm, statusFilter]);

  const statusPills = useMemo(() => {
    const counts = stats || {};
    return [
      { label: 'All', count: counts.totalOrders ?? 0, color: 'primary' },
      { label: 'Pending', count: counts.pendingOrders ?? 0, color: 'warning' },
      { label: 'Processing', count: counts.processingOrders ?? 0, color: 'info' },
      { label: 'Ready', count: counts.readyOrders ?? 0, color: 'success' },
      { label: 'Completed', count: counts.completedOrders ?? 0, color: 'danger' },
    ];
  }, [stats]);

  const getStatusClass = (status: string) =>
    statusStyles[status] || 'bg-neutral-100 text-neutral-600';

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
              {['Order ID', 'Customer', 'Items', 'Status', 'Total', 'Date', ''].map((header) => (
                <th key={header} className="px-6 py-3 text-left font-bold text-primary border-b-2 border-neutral-200 text-sm">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-sm text-neutral-400">No orders found</td>
              </tr>
            ) : (
              orders.map((order: any, index: number) => (
                <tr
                  key={order.id}
                  className={`${index % 2 === 0 ? 'bg-white' : 'bg-neutral-50'} hover:bg-primary-50 transition-colors cursor-pointer`}
                  onClick={() => navigate(`/orders/${order.id}`)}
                >
                  <td className="px-6 py-3 border-b border-neutral-200 font-medium">{order.id?.slice(0, 8)}</td>
                  <td className="px-6 py-3 border-b border-neutral-200">
                    <div>{order.customer?.firstName} {order.customer?.lastName}</div>
                    <div className="text-xs text-neutral-400">{order.customer?.phone || order.staff?.phone || ''}</div>
                  </td>
                  <td className="px-6 py-3 border-b border-neutral-200">{order.items?.length || 0}</td>
                  <td className="px-6 py-3 border-b border-neutral-200">
                    <span className={`status-pill ${getStatusClass(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 border-b border-neutral-200">{Number(order.total).toLocaleString()} FCFA</td>
                  <td className="px-6 py-3 border-b border-neutral-200 text-neutral-500">
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ''}
                  </td>
                  <td className="px-6 py-3 border-b border-neutral-200">
                    <button
                      onClick={(e) => { e.stopPropagation(); navigate(`/orders/${order.id}`); }}
                      className="px-3 py-1 border border-primary rounded bg-white text-primary cursor-pointer text-xs hover:bg-primary-50"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="px-6 py-4 border-t border-neutral-200 flex items-center justify-between text-sm text-neutral-500">
          <span>Showing {orders.length} of {statusPills.find(p => p.label === 'All')?.count || orders.length} orders</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-neutral-300 rounded bg-white cursor-pointer text-xs disabled:opacity-40" disabled>Prev</button>
            <button className="px-3 py-1 border border-neutral-300 rounded bg-white cursor-pointer text-xs">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
