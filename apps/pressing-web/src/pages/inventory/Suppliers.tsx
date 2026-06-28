import { useState } from 'react';

const suppliers = [
  { id: 'SUP-001', name: 'ChemCorp Ltd', contact: '+237 612 345 678', email: 'orders@chemcorp.com', category: 'Chemicals', lastOrder: '2024-01-10', status: 'Active' },
  { id: 'SUP-002', name: 'SupplyPlus', contact: '+237 623 456 789', email: 'info@supplyplus.cm', category: 'Supplies', lastOrder: '2024-01-12', status: 'Active' },
  { id: 'SUP-003', name: 'TagMaster', contact: '+237 634 567 890', email: 'sales@tagmaster.cm', category: 'Tags', lastOrder: '2023-12-15', status: 'Inactive' },
  { id: 'SUP-004', name: 'CleanPro Distributors', contact: '+237 645 678 901', email: 'info@cleanpro.cm', category: 'Chemicals', lastOrder: '2024-01-02', status: 'Active' },
];

export default function Suppliers() {
  const [search, setSearch] = useState('');

  const filtered = suppliers.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.category.toLowerCase().includes(search.toLowerCase())
  );

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

      <div className="grid grid-cols-2 gap-4">
        {filtered.map((s) => (
          <div key={s.id} className="bg-white border border-neutral-200 rounded p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-neutral-800">{s.name}</h3>
                <span className="text-xs text-neutral-500">{s.category}</span>
              </div>
              <span className={`status-pill text-xs ${s.status === 'Active' ? 'bg-success-100 text-success-700' : 'bg-neutral-100 text-neutral-500'}`}>{s.status}</span>
            </div>
            <div className="space-y-1 text-sm">
              <p className="text-neutral-600">{s.contact}</p>
              <p className="text-neutral-600">{s.email}</p>
              <p className="text-neutral-500 text-xs mt-2">Last order: {s.lastOrder}</p>
            </div>
            <div className="flex gap-2 mt-4">
              <button className="px-3 py-1.5 border border-primary rounded text-primary text-xs bg-white cursor-pointer hover:bg-primary-50">Place Order</button>
              <button className="px-3 py-1.5 border border-neutral-300 rounded text-neutral-600 text-xs bg-white cursor-pointer hover:bg-neutral-50">View History</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
