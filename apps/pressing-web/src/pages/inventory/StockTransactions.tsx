import { useState } from 'react';

const transactions = [
  { id: 'TXN-001', item: 'Laundry Detergent (5L)', type: 'Purchase', qty: 5, unit: 'Bottles', supplier: 'ChemCorp Ltd', date: '2024-01-10', ref: 'PO-2024-001', by: 'Admin' },
  { id: 'TXN-002', item: 'Hangers (50pk)', type: 'Purchase', qty: 5, unit: 'Packs', supplier: 'SupplyPlus', date: '2024-01-12', ref: 'PO-2024-002', by: 'Admin' },
  { id: 'TXN-003', item: 'Laundry Detergent (5L)', type: 'Consumption', qty: 2, unit: 'Bottles', supplier: '—', date: '2024-01-13', ref: 'ORD-001', by: 'Washer: David' },
  { id: 'TXN-004', item: 'Fabric Softener (5L)', type: 'Consumption', qty: 1, unit: 'Bottles', supplier: '—', date: '2024-01-13', ref: 'ORD-001', by: 'Washer: David' },
  { id: 'TXN-005', item: 'QR Tags (roll)', type: 'Consumption', qty: 1, unit: 'Rolls', supplier: '—', date: '2024-01-12', ref: 'ORD-002', by: 'Counter: Alice' },
  { id: 'TXN-006', item: 'Stain Remover (1L)', type: 'Adjustment', qty: 1, unit: 'Bottles', supplier: '—', date: '2024-01-11', ref: 'ADJ-001', by: 'Manager' },
];

export default function StockTransactions() {
  const [typeFilter, setTypeFilter] = useState('All');

  const filtered = typeFilter === 'All' ? transactions : transactions.filter(t => t.type === typeFilter);

  return (
    <div>
      <div className="page-chrome">
        <h1 className="page-title">Stock Transactions</h1>
        <button className="px-4 py-2 bg-primary text-white rounded text-sm font-bold border-none cursor-pointer hover:bg-primary-dark">+ New Transaction</button>
      </div>

      <div className="bg-white border border-neutral-200 border-t-0 px-6 py-5 mb-6">
        <div className="flex justify-end gap-3">
          {['All', 'Purchase', 'Consumption', 'Adjustment'].map(t => (
            <button key={t} onClick={() => setTypeFilter(t)}
              className={`px-4 py-1.5 rounded text-xs font-bold border-none cursor-pointer transition-all ${typeFilter === t ? 'bg-primary text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}>{t}</button>
          ))}
          <input type="date" className="px-3 py-1.5 border border-neutral-300 rounded text-sm ml-4" />
        </div>
      </div>

      <div className="data-table">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-neutral-50">
              {['ID', 'Item', 'Type', 'Qty', 'Unit', 'Supplier', 'Date', 'Reference', 'By'].map(h => (
                <th key={h} className="px-6 py-3 text-left font-bold text-primary border-b-2 border-neutral-200">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((t, i) => (
              <tr key={t.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'} hover:bg-primary-50 transition-colors`}>
                <td className="px-6 py-3 border-b border-neutral-200 font-medium">{t.id}</td>
                <td className="px-6 py-3 border-b border-neutral-200">{t.item}</td>
                <td className="px-6 py-3 border-b border-neutral-200">
                  <span className={`status-pill text-xs ${
                    t.type === 'Purchase' ? 'bg-success-100 text-success-700' :
                    t.type === 'Consumption' ? 'bg-info-100 text-info-700' :
                    'bg-warning-100 text-warning-700'
                  }`}>{t.type}</span>
                </td>
                <td className="px-6 py-3 border-b border-neutral-200 font-bold">{t.type === 'Consumption' ? '-' : '+'}{t.qty}</td>
                <td className="px-6 py-3 border-b border-neutral-200 text-neutral-600">{t.unit}</td>
                <td className="px-6 py-3 border-b border-neutral-200">{t.supplier}</td>
                <td className="px-6 py-3 border-b border-neutral-200 text-neutral-500">{t.date}</td>
                <td className="px-6 py-3 border-b border-neutral-200 text-neutral-600">{t.ref}</td>
                <td className="px-6 py-3 border-b border-neutral-200 text-neutral-600">{t.by}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
