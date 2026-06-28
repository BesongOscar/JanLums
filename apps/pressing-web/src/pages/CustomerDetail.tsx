import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OrderTimeline from '../components/ui/OrderTimeline';
import { useToast } from '../components/ui/Toast';

const customer = {
  id: 'CUS-001', name: 'Jean Dupont', phone: '+237 612 345 678', email: 'jean@email.com',
  since: 'June 2023', status: 'Active', totalOrders: 12, totalSpent: 145000,
  address: '42 Rue de la Paix, Yaounde', preferredService: 'Wash & Fold',
  orders: [
    { id: 'ORD-001', date: '2024-01-15', items: 5, total: 12500, status: 'Processing' },
    { id: 'ORD-003', date: '2024-01-10', items: 8, total: 20000, status: 'Completed' },
    { id: 'ORD-005', date: '2024-01-05', items: 6, total: 15000, status: 'Completed' },
    { id: 'ORD-009', date: '2023-12-28', items: 4, total: 9800, status: 'Completed' },
  ],
  recentTimeline: [
    { status: 'received', label: 'Order Received', timestamp: '2024-01-15 08:30', actor: 'Counter: Alice', active: false },
    { status: 'in_wash', label: 'Washing', timestamp: '2024-01-15 09:15', actor: 'Washer: David', active: true },
    { status: 'completed', label: 'Completed (x3 prev orders)', active: false },
  ],
};

const statusStyles: Record<string, string> = {
  Processing: 'bg-warning-100 text-warning-700',
  Completed: 'bg-success-100 text-success-700',
};

export default function CustomerDetail() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [showEdit, setShowEdit] = useState(false);
  const [editForm, setEditForm] = useState({ name: customer.name, phone: customer.phone, email: customer.email });

  const getStatusClass = (s: string) => statusStyles[s] || 'bg-neutral-100 text-neutral-600';

  const handleSave = () => {
    showToast('Customer updated', 'success');
    setShowEdit(false);
  };

  return (
    <div>
      <div className="page-chrome">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/customers')}
            className="text-primary hover:text-primary-dark text-sm no-underline bg-transparent border-none cursor-pointer">&larr; Back to Customers</button>
          <h1 className="page-title">{customer.name}</h1>
          <span className="status-pill text-xs bg-success-100 text-success-700">{customer.status}</span>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowEdit(true)}
            className="px-4 py-2 border border-primary rounded bg-white text-primary text-sm cursor-pointer hover:bg-primary-50">Edit Customer</button>
          <button onClick={() => navigate('/orders/new')}
            className="px-4 py-2 bg-primary text-white rounded text-sm font-bold border-none cursor-pointer hover:bg-primary-dark">+ New Order</button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mt-6">
        <div className="space-y-6">
          <div className="bg-white border border-neutral-200 rounded shadow-sm">
            <div className="px-6 py-4 border-b border-neutral-200">
              <h2 className="text-base font-bold text-neutral-800">Profile</h2>
            </div>
            <div className="p-6 space-y-3 text-sm">
              {[
                ['ID', customer.id], ['Phone', customer.phone], ['Email', customer.email],
                ['Address', customer.address], ['Customer Since', customer.since],
                ['Preferred Service', customer.preferredService],
              ].map(([label, value]) => (
                <div key={label}>
                  <div className="text-xs text-neutral-500">{label}</div>
                  <div className="text-neutral-800">{value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-neutral-200 rounded shadow-sm">
            <div className="px-6 py-4 border-b border-neutral-200">
              <h2 className="text-base font-bold text-neutral-800">Loyalty</h2>
            </div>
            <div className="p-6 space-y-4 text-center">
              <div>
                <div className="text-3xl font-bold text-primary">{customer.totalOrders}</div>
                <div className="text-xs text-neutral-500 mt-1">Total Orders</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-success">{customer.totalSpent.toLocaleString()} FCFA</div>
                <div className="text-xs text-neutral-500 mt-1">Total Spent</div>
              </div>
              <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                <div className="h-full bg-warning rounded-full" style={{ width: '70%' }} />
              </div>
              <p className="text-xs text-neutral-500">70% to next loyalty tier (Gold)</p>
            </div>
          </div>
        </div>

        <div className="col-span-2 space-y-6">
          <div className="bg-white border border-neutral-200 rounded shadow-sm">
            <div className="px-6 py-4 border-b border-neutral-200">
              <h2 className="text-base font-bold text-neutral-800">Recent Activity</h2>
            </div>
            <div className="p-6">
              <OrderTimeline entries={customer.recentTimeline} />
            </div>
          </div>

          <div className="bg-white border border-neutral-200 rounded shadow-sm">
            <div className="px-6 py-4 border-b border-neutral-200">
              <h2 className="text-base font-bold text-neutral-800">Order History</h2>
            </div>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-neutral-50">
                  {['Order ID', 'Date', 'Items', 'Total', 'Status', ''].map(h => (
                    <th key={h} className="px-6 py-3 text-left font-bold text-primary border-b border-neutral-200">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {customer.orders.map((o, i) => (
                  <tr key={o.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'} hover:bg-primary-50 transition-colors cursor-pointer`}
                    onClick={() => navigate(`/orders/${o.id}`)}>
                    <td className="px-6 py-3 border-b border-neutral-200 font-medium">{o.id}</td>
                    <td className="px-6 py-3 border-b border-neutral-200 text-neutral-500">{o.date}</td>
                    <td className="px-6 py-3 border-b border-neutral-200">{o.items}</td>
                    <td className="px-6 py-3 border-b border-neutral-200">{o.total.toLocaleString()} FCFA</td>
                    <td className="px-6 py-3 border-b border-neutral-200">
                      <span className={`status-pill text-xs ${getStatusClass(o.status)}`}>{o.status}</span>
                    </td>
                    <td className="px-6 py-3 border-b border-neutral-200">
                      <button onClick={(e) => { e.stopPropagation(); navigate(`/orders/${o.id}`); }}
                        className="px-3 py-1 border border-primary rounded bg-white text-primary cursor-pointer text-xs">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-neutral-800">Edit Customer</h2>
              <button onClick={() => setShowEdit(false)}
                className="text-neutral-400 hover:text-neutral-600 text-xl leading-none border-none bg-transparent cursor-pointer">&times;</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Name</label>
                <input value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Phone</label>
                <input value={editForm.phone} onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Email</label>
                <input value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded text-sm" />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowEdit(false)}
                className="px-4 py-2 border border-neutral-300 rounded text-sm bg-white cursor-pointer hover:bg-neutral-50">Cancel</button>
              <button onClick={handleSave}
                className="px-4 py-2 bg-primary text-white rounded text-sm font-bold border-none cursor-pointer hover:bg-primary-dark">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
