import { useState } from 'react';
import { useToast } from '../../components/ui/Toast';

const periods = [
  { id: 'PRD-001', name: 'January 2024', start: '2024-01-01', end: '2024-01-31', status: 'Open', employees: 7, totalPay: 2850000, processed: '—' },
  { id: 'PRD-002', name: 'December 2023', start: '2023-12-01', end: '2023-12-31', status: 'Closed', employees: 7, totalPay: 2720000, processed: '2024-01-05' },
  { id: 'PRD-003', name: 'November 2023', start: '2023-11-01', end: '2023-11-30', status: 'Closed', employees: 6, totalPay: 2480000, processed: '2023-12-05' },
];

const statusStyles: Record<string, string> = {
  Open: 'bg-warning-100 text-warning-700',
  Closed: 'bg-success-100 text-success-700',
};

export default function Periods() {
  const { showToast } = useToast();
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div>
      <div className="page-chrome">
        <h1 className="page-title">Payroll Periods</h1>
        <button onClick={() => setShowCreate(true)}
          className="bg-primary text-white px-4 py-2 rounded text-sm font-bold border-none cursor-pointer hover:bg-primary-dark">+ New Period</button>
      </div>

      <div className="data-table mt-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-neutral-50">
              {['Period', 'Start', 'End', 'Status', 'Employees', 'Total Pay', 'Processed', ''].map(h => (
                <th key={h} className="px-6 py-3 text-left font-bold text-primary border-b-2 border-neutral-200">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {periods.map((p, i) => (
              <tr key={p.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'} hover:bg-primary-50 transition-colors`}>
                <td className="px-6 py-3 border-b border-neutral-200 font-medium">{p.name}</td>
                <td className="px-6 py-3 border-b border-neutral-200 text-neutral-500">{p.start}</td>
                <td className="px-6 py-3 border-b border-neutral-200 text-neutral-500">{p.end}</td>
                <td className="px-6 py-3 border-b border-neutral-200">
                  <span className={`status-pill text-xs ${statusStyles[p.status]}`}>{p.status}</span>
                </td>
                <td className="px-6 py-3 border-b border-neutral-200">{p.employees}</td>
                <td className="px-6 py-3 border-b border-neutral-200 font-bold">{p.totalPay.toLocaleString()} FCFA</td>
                <td className="px-6 py-3 border-b border-neutral-200 text-neutral-500">{p.processed}</td>
                <td className="px-6 py-3 border-b border-neutral-200">
                  {p.status === 'Open' && (
                    <button onClick={() => showToast(`Processing ${p.name}`, 'success')}
                      className="px-3 py-1 bg-primary text-white rounded text-xs border-none cursor-pointer hover:bg-primary-dark">Process</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-neutral-800">New Payroll Period</h2>
              <button onClick={() => setShowCreate(false)}
                className="text-neutral-400 hover:text-neutral-600 text-xl leading-none border-none bg-transparent cursor-pointer">&times;</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Period Name</label>
                <input className="w-full px-3 py-2 border border-neutral-300 rounded text-sm" placeholder="e.g., February 2024" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Start Date</label>
                  <input type="date" className="w-full px-3 py-2 border border-neutral-300 rounded text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">End Date</label>
                  <input type="date" className="w-full px-3 py-2 border border-neutral-300 rounded text-sm" />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowCreate(false)}
                className="px-4 py-2 border border-neutral-300 rounded text-sm bg-white cursor-pointer hover:bg-neutral-50">Cancel</button>
              <button onClick={() => { showToast('Period created', 'success'); setShowCreate(false); }}
                className="px-4 py-2 bg-primary text-white rounded text-sm font-bold border-none cursor-pointer hover:bg-primary-dark">Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
