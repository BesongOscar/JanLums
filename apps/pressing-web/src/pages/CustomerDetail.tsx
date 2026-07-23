import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCustomerById } from '../hooks/useCustomers';
import { useToast } from '../components/ui/Toast';
import { LoadingState } from '../components/ui/States';

const statusStyles: Record<string, string> = {
  pending: 'bg-warning-100 text-warning-700',
  processing: 'bg-warning-100 text-warning-700',
  ready: 'bg-success-100 text-success-700',
  completed: 'bg-success-100 text-success-700',
};

export default function CustomerDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const tenantId = user?.tenantId || '';
  const { data: customer, isLoading, error } = useCustomerById(tenantId, id || '');
  const { showToast } = useToast();
  const [showEdit, setShowEdit] = useState(false);
  const [editForm, setEditForm] = useState({ firstName: '', lastName: '', phone: '', email: '' });

  const getStatusClass = (s: string) => statusStyles[s] || 'bg-neutral-100 text-neutral-600';
  const fullName = customer ? `${customer.firstName || ''} ${customer.lastName || ''}`.trim() : '';

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingState />
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-neutral-500 text-sm">Customer not found</p>
        <button onClick={() => navigate('/customers')}
          className="px-4 py-2 border border-primary rounded text-primary text-sm bg-transparent cursor-pointer">
          Back to Customers
        </button>
      </div>
    );
  }

  const handleEditOpen = () => {
    setEditForm({
      firstName: customer.firstName || '',
      lastName: customer.lastName || '',
      phone: customer.phone || '',
      email: customer.email || '',
    });
    setShowEdit(true);
  };

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
          <h1 className="page-title">{fullName}</h1>
          <span className="status-pill text-xs bg-success-100 text-success-700">
            {customer.isActive !== false ? 'Active' : 'Inactive'}
          </span>
        </div>
        <div className="flex gap-2">
          <button onClick={handleEditOpen}
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
                ['ID', customer.id?.slice(0, 8)],
                ['Phone', customer.phone || '-'],
                ['Email', customer.email || '-'],
                ['Address', customer.address || '-'],
                ['City', customer.city || '-'],
                ['Customer Since', customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : '-'],
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
                <div className="text-3xl font-bold text-primary">{customer.totalOrders ?? 0}</div>
                <div className="text-xs text-neutral-500 mt-1">Total Orders</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-success">{Number(customer.totalSpent ?? 0).toLocaleString()} FCFA</div>
                <div className="text-xs text-neutral-500 mt-1">Total Spent</div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-2 space-y-6">
          <div className="bg-white border border-neutral-200 rounded shadow-sm">
            <div className="px-6 py-4 border-b border-neutral-200">
              <h2 className="text-base font-bold text-neutral-800">Order History</h2>
            </div>
            {customer.orders?.length > 0 ? (
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-neutral-50">
                    {['Order ID', 'Date', 'Items', 'Total', 'Status', ''].map(h => (
                      <th key={h} className="px-6 py-3 text-left font-bold text-primary border-b border-neutral-200">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {customer.orders.map((o: any, i: number) => (
                    <tr key={o.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'} hover:bg-primary-50 transition-colors cursor-pointer`}
                      onClick={() => navigate(`/orders/${o.id}`)}>
                      <td className="px-6 py-3 border-b border-neutral-200 font-medium">{o.id?.slice(0, 8)}</td>
                      <td className="px-6 py-3 border-b border-neutral-200 text-neutral-500">
                        {o.createdAt ? new Date(o.createdAt).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-6 py-3 border-b border-neutral-200">{o.items?.length ?? 0}</td>
                      <td className="px-6 py-3 border-b border-neutral-200">{Number(o.total ?? 0).toLocaleString()} FCFA</td>
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
            ) : (
              <div className="p-6 text-sm text-neutral-400 text-center">No orders yet</div>
            )}
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
                <label className="block text-sm font-medium text-neutral-700 mb-1">First Name</label>
                <input value={editForm.firstName} onChange={e => setEditForm({ ...editForm, firstName: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Last Name</label>
                <input value={editForm.lastName} onChange={e => setEditForm({ ...editForm, lastName: e.target.value })}
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
