import { useState, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useInventory } from '../../hooks/useInventory';
import { LoadingState } from '../../components/ui/States';

export default function Suppliers() {
  const { user } = useAuth();
  const tenantId = user?.tenantId || '';
  const { data: inventory, isLoading } = useInventory(tenantId);
  const [search, setSearch] = useState('');

  const suppliers = useMemo(() => {
    const items = Array.isArray(inventory) ? inventory : [];
    const map = new Map<string, { name: string; category: string; lastSeen: string }>();
    items.forEach((item: any) => {
      if (item.supplier) {
        const existing = map.get(item.supplier);
        const updated = item.updatedAt || item.createdAt || '';
        if (!existing || updated > existing.lastSeen) {
          map.set(item.supplier, { name: item.supplier, category: item.category || '', lastSeen: updated });
        }
      }
    });
    return Array.from(map.values());
  }, [inventory]);

  const filtered = suppliers.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.category.toLowerCase().includes(search.toLowerCase())
  );

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
        <h1 className="page-title">Suppliers</h1>
        <button className="bg-primary text-white px-4 py-2 rounded text-sm font-bold border-none cursor-pointer hover:bg-primary-dark">+ Add Supplier</button>
      </div>

      <div className="bg-white border border-neutral-200 border-t-0 px-6 py-5 mb-6">
        <div className="flex justify-end">
          <input type="text" placeholder="Search suppliers..." value={search} onChange={e => setSearch(e.target.value)}
            className="px-3 py-1.5 border border-neutral-300 rounded text-sm w-60" />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center text-sm text-neutral-400 py-12">No suppliers found</div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {filtered.map((s, i) => (
            <div key={i} className="bg-white border border-neutral-200 rounded p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-neutral-800">{s.name}</h3>
                  {s.category && <span className="text-xs text-neutral-500">{s.category}</span>}
                </div>
              </div>
              <div className="text-xs text-neutral-500">
                Last active: {s.lastSeen ? new Date(s.lastSeen).toLocaleDateString() : '—'}
              </div>
              <div className="flex gap-2 mt-4">
                <button className="px-3 py-1.5 border border-primary rounded text-primary text-xs bg-white cursor-pointer hover:bg-primary-50">Place Order</button>
                <button className="px-3 py-1.5 border border-neutral-300 rounded text-neutral-600 text-xs bg-white cursor-pointer hover:bg-neutral-50">View History</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
