import { useState } from 'react';
import { useToast } from '../../components/ui/Toast';

const items = [
  { id: 'INV-001', name: 'Laundry Detergent (5L)', category: 'Chemicals', stock: 12, minLevel: 5, unit: 'Bottles', status: 'In Stock', lastRestocked: '2024-01-10' },
  { id: 'INV-002', name: 'Fabric Softener (5L)', category: 'Chemicals', stock: 8, minLevel: 5, unit: 'Bottles', status: 'In Stock', lastRestocked: '2024-01-08' },
  { id: 'INV-003', name: 'Stain Remover (1L)', category: 'Chemicals', stock: 3, minLevel: 5, unit: 'Bottles', status: 'Low Stock', lastRestocked: '2023-12-20' },
  { id: 'INV-004', name: 'Hangers (50pk)', category: 'Supplies', stock: 25, minLevel: 10, unit: 'Packs', status: 'In Stock', lastRestocked: '2024-01-12' },
  { id: 'INV-005', name: 'Plastic Bags (100pk)', category: 'Supplies', stock: 40, minLevel: 20, unit: 'Packs', status: 'In Stock', lastRestocked: '2024-01-05' },
  { id: 'INV-006', name: 'QR Tags (roll)', category: 'Tags', stock: 2, minLevel: 5, unit: 'Rolls', status: 'Low Stock', lastRestocked: '2023-12-15' },
  { id: 'INV-007', name: 'Thermal Labels (500pk)', category: 'Tags', stock: 0, minLevel: 5, unit: 'Packs', status: 'Out of Stock', lastRestocked: '2023-11-30' },
  { id: 'INV-008', name: 'Bleach (5L)', category: 'Chemicals', stock: 6, minLevel: 4, unit: 'Bottles', status: 'In Stock', lastRestocked: '2024-01-02' },
];

const statusStyles: Record<string, string> = {
  'In Stock': 'bg-success-100 text-success-700',
  'Low Stock': 'bg-warning-100 text-warning-700',
  'Out of Stock': 'bg-danger-100 text-danger-700',
};

export default function Stock() {
  const { showToast } = useToast();
  const [search, setSearch] = useState('');

  const filtered = items.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.category.toLowerCase().includes(search.toLowerCase()) ||
    i.id.toLowerCase().includes(search.toLowerCase())
  );

  const lowStock = items.filter(i => i.stock <= i.minLevel);

  return (
    <div>
      <div className="page-chrome">
        <h1 className="page-title">Inventory Stock</h1>
        <button onClick={() => showToast('Add item form coming soon', 'success')}
          className="bg-primary text-white px-4 py-2 rounded text-sm font-bold border-none cursor-pointer hover:bg-primary-dark">+ Add Item</button>
      </div>

      <div className="grid grid-cols-4 gap-4 my-6">
        <div className="bg-white border border-neutral-200 rounded p-4 shadow-sm">
          <div className="text-neutral-500 text-xs mb-1">Total Items</div>
          <div className="text-2xl font-bold text-neutral-900">{items.length}</div>
        </div>
        <div className="bg-white border border-neutral-200 rounded p-4 shadow-sm">
          <div className="text-neutral-500 text-xs mb-1">Categories</div>
          <div className="text-2xl font-bold text-neutral-900">{new Set(items.map(i => i.category)).size}</div>
        </div>
        <div className="bg-white border border-warning rounded p-4 shadow-sm border-2">
          <div className="text-neutral-500 text-xs mb-1">Low Stock Alerts</div>
          <div className="text-2xl font-bold text-warning">{lowStock.filter(i => i.stock > 0).length}</div>
        </div>
        <div className="bg-white border border-danger rounded p-4 shadow-sm border-2">
          <div className="text-neutral-500 text-xs mb-1">Out of Stock</div>
          <div className="text-2xl font-bold text-danger">{lowStock.filter(i => i.stock === 0).length}</div>
        </div>
      </div>

      <div className="bg-white border border-neutral-200 border-t-0 px-6 py-5 mb-6">
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            {['All Categories', 'Chemicals', 'Supplies', 'Tags'].map(c => (
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
              {['ID', 'Item', 'Category', 'Stock', 'Min Level', 'Unit', 'Status', 'Last Restocked'].map(h => (
                <th key={h} className="px-6 py-3 text-left font-bold text-primary border-b-2 border-neutral-200">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((item, i) => (
              <tr key={item.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'} hover:bg-primary-50 transition-colors`}>
                <td className="px-6 py-3 border-b border-neutral-200 font-medium">{item.id}</td>
                <td className="px-6 py-3 border-b border-neutral-200">{item.name}</td>
                <td className="px-6 py-3 border-b border-neutral-200 text-neutral-600">{item.category}</td>
                <td className="px-6 py-3 border-b border-neutral-200">
                  <span className={`font-bold ${item.stock <= item.minLevel ? 'text-danger' : 'text-neutral-800'}`}>{item.stock}</span>
                </td>
                <td className="px-6 py-3 border-b border-neutral-200">{item.minLevel}</td>
                <td className="px-6 py-3 border-b border-neutral-200 text-neutral-600">{item.unit}</td>
                <td className="px-6 py-3 border-b border-neutral-200">
                  <span className={`status-pill text-xs ${statusStyles[item.status] || 'bg-neutral-100 text-neutral-600'}`}>{item.status}</span>
                </td>
                <td className="px-6 py-3 border-b border-neutral-200 text-neutral-500">{item.lastRestocked}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
