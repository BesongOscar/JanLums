import { useState } from 'react';
import { useToast } from '../../components/ui/Toast';

const promos = [
  { id: 'PROMO-001', code: 'WELCOME10', discount: '10%', type: 'Percentage', minOrder: 5000, usage: 45, maxUsage: 100, expires: '2024-06-30', active: true },
  { id: 'PROMO-002', code: 'FREEDEL', discount: 'Free Delivery', type: 'Flat', minOrder: 10000, usage: 28, maxUsage: 50, expires: '2024-05-31', active: true },
  { id: 'PROMO-003', code: 'FLAT2000', discount: '2,000 FCFA', type: 'Flat', minOrder: 15000, usage: 12, maxUsage: 30, expires: '2024-04-30', active: false },
];

export default function Promotions() {
  const { showToast } = useToast();
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div>
      <div className="page-chrome">
        <h1 className="page-title">Promotions</h1>
        <button onClick={() => setShowAdd(true)}
          className="bg-primary text-white px-4 py-2 rounded text-sm font-bold border-none cursor-pointer hover:bg-primary-dark">+ Add Promotion</button>
      </div>

      <div className="data-table mt-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-neutral-50">
              {['Code', 'Discount', 'Type', 'Min Order', 'Usage', 'Expires', 'Active', ''].map(h => (
                <th key={h} className="px-6 py-3 text-left font-bold text-primary border-b-2 border-neutral-200">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {promos.map((p, i) => (
              <tr key={p.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'} hover:bg-primary-50 transition-colors`}>
                <td className="px-6 py-3 border-b border-neutral-200 font-medium font-mono">{p.code}</td>
                <td className="px-6 py-3 border-b border-neutral-200 font-bold text-primary">{p.discount}</td>
                <td className="px-6 py-3 border-b border-neutral-200"><span className="text-xs bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded">{p.type}</span></td>
                <td className="px-6 py-3 border-b border-neutral-200">{p.minOrder.toLocaleString()} FCFA</td>
                <td className="px-6 py-3 border-b border-neutral-200">{p.usage}/{p.maxUsage}</td>
                <td className="px-6 py-3 border-b border-neutral-200 text-neutral-500">{p.expires}</td>
                <td className="px-6 py-3 border-b border-neutral-200">
                  <span className={`status-pill text-xs ${p.active ? 'bg-success-100 text-success-700' : 'bg-neutral-100 text-neutral-500'}`}>{p.active ? 'Active' : 'Inactive'}</span>
                </td>
                <td className="px-6 py-3 border-b border-neutral-200">
                  <button className="px-3 py-1 border border-primary rounded bg-white text-primary cursor-pointer text-xs hover:bg-primary-50">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-neutral-800">Add Promotion</h2>
              <button onClick={() => setShowAdd(false)}
                className="text-neutral-400 hover:text-neutral-600 text-xl leading-none border-none bg-transparent cursor-pointer">&times;</button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Code</label>
                  <input className="w-full px-3 py-2 border border-neutral-300 rounded text-sm" placeholder="e.g., SUMMER20" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Type</label>
                  <select className="w-full px-3 py-2 border border-neutral-300 rounded text-sm">
                    <option>Percentage</option>
                    <option>Flat</option>
                    <option>Free Delivery</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Discount Value</label>
                <input className="w-full px-3 py-2 border border-neutral-300 rounded text-sm" placeholder="e.g., 10%" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Min Order</label>
                  <input className="w-full px-3 py-2 border border-neutral-300 rounded text-sm" placeholder="FCFA" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Max Uses</label>
                  <input className="w-full px-3 py-2 border border-neutral-300 rounded text-sm" placeholder="Unlimited" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Expires</label>
                <input type="date" className="w-full px-3 py-2 border border-neutral-300 rounded text-sm" />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowAdd(false)}
                className="px-4 py-2 border border-neutral-300 rounded text-sm bg-white cursor-pointer hover:bg-neutral-50">Cancel</button>
              <button onClick={() => { showToast('Promotion added', 'success'); setShowAdd(false); }}
                className="px-4 py-2 bg-primary text-white rounded text-sm font-bold border-none cursor-pointer hover:bg-primary-dark">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
