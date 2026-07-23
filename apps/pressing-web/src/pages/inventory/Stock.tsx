import { useState, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useInventory } from '../../hooks/useInventory';
import { LoadingState } from '../../components/ui/States';

const statusStyles: Record<string, string> = {
  'In Stock': 'bg-success-100 text-success-700',
  'Low Stock': 'bg-warning-100 text-warning-700',
  'Out of Stock': 'bg-danger-100 text-danger-700',
};

export default function Stock() {
  const { user } = useAuth();
  const tenantId = user?.tenantId || '';
  const { data: inventory, isLoading } = useInventory(tenantId);
  const [search, setSearch] = useState('');

  const list = useMemo(() => {
    const arr = Array.isArray(inventory) ? inventory : [];
    return arr.filter((i: any) =>
      i.name?.toLowerCase().includes(search.toLowerCase()) ||
      i.category?.toLowerCase().includes(search.toLowerCase()) ||
      i.id?.toLowerCase().includes(search.toLowerCase())
    );
  }, [inventory, search]);

  const getStatus = (item: any) => {
    const qty = Number(item.quantity ?? 0);
    const min = Number(item.minStockLevel ?? 0);
    if (qty === 0) return 'Out of Stock';
    if (qty <= min) return 'Low Stock';
    return 'In Stock';
  };

  const categories = useMemo(() => {
    const arr = Array.isArray(inventory) ? inventory : [];
    return [...new Set(arr.map((i: any) => i.category))];
  }, [inventory]);

  const lowStockItems = useMemo(() => {
    const arr = Array.isArray(inventory) ? inventory : [];
    return arr.filter((i: any) => Number(i.quantity ?? 0) <= Number(i.minStockLevel ?? 0));
  }, [inventory]);

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
        <h1 className="page-title">Inventory Stock</h1>
        <button className="bg-primary text-white px-4 py-2 rounded text-sm font-bold border-none cursor-pointer hover:bg-primary-dark">+ Add Item</button>
      </div>

      <div className="grid grid-cols-4 gap-4 my-6">
        <div className="bg-white border border-neutral-200 rounded p-4 shadow-sm">
          <div className="text-neutral-500 text-xs mb-1">Total Items</div>
          <div className="text-2xl font-bold text-neutral-900">{list.length}</div>
        </div>
        <div className="bg-white border border-neutral-200 rounded p-4 shadow-sm">
          <div className="text-neutral-500 text-xs mb-1">Categories</div>
          <div className="text-2xl font-bold text-neutral-900">{categories.length}</div>
        </div>
        <div className="bg-white border border-warning rounded p-4 shadow-sm border-2">
          <div className="text-neutral-500 text-xs mb-1">Low Stock Alerts</div>
          <div className="text-2xl font-bold text-warning">{lowStockItems.filter(i => Number(i.quantity) > 0).length}</div>
        </div>
        <div className="bg-white border border-danger rounded p-4 shadow-sm border-2">
          <div className="text-neutral-500 text-xs mb-1">Out of Stock</div>
          <div className="text-2xl font-bold text-danger">{lowStockItems.filter(i => Number(i.quantity) === 0).length}</div>
        </div>
      </div>

      <div className="bg-white border border-neutral-200 border-t-0 px-6 py-5 mb-6">
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            {['All Categories', ...categories].map(c => (
              <button key={c} className={`text-sm font-medium px-3 py-1 rounded-full border-none cursor-pointer ${c === 'All Categories' ? 'bg-primary text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}>{c}</button>
            ))}
          </div>
          <input type="text" placeholder="Search inventory..." value={search} onChange={e => setSearch(e.target.value)}
            className="px-3 py-1.5 border border-neutral-300 rounded text-sm w-60" />
        </div>
      </div>

      <div className="data-table">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-neutral-50">
              {['ID', 'Item', 'Category', 'Stock', 'Min Level', 'Unit', 'Status', 'Last Updated'].map(h => (
                <th key={h} className="px-6 py-3 text-left font-bold text-primary border-b-2 border-neutral-200">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {list.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-sm text-neutral-400">No inventory items</td>
              </tr>
            ) : (
              list.map((item: any, i: number) => {
                const status = getStatus(item);
                return (
                  <tr key={item.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'} hover:bg-primary-50 transition-colors`}>
                    <td className="px-6 py-3 border-b border-neutral-200 font-medium">{item.id?.slice(0, 8)}</td>
                    <td className="px-6 py-3 border-b border-neutral-200">{item.name}</td>
                    <td className="px-6 py-3 border-b border-neutral-200 text-neutral-600">{item.category}</td>
                    <td className="px-6 py-3 border-b border-neutral-200">
                      <span className={`font-bold ${status !== 'In Stock' ? 'text-danger' : 'text-neutral-800'}`}>{Number(item.quantity)}</span>
                    </td>
                    <td className="px-6 py-3 border-b border-neutral-200">{Number(item.minStockLevel)}</td>
                    <td className="px-6 py-3 border-b border-neutral-200 text-neutral-600">{item.unit}</td>
                    <td className="px-6 py-3 border-b border-neutral-200">
                      <span className={`status-pill text-xs ${statusStyles[status] || 'bg-neutral-100 text-neutral-600'}`}>{status}</span>
                    </td>
                    <td className="px-6 py-3 border-b border-neutral-200 text-neutral-500">
                      {item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : '-'}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
