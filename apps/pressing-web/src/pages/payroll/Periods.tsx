import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { usePayrollPeriods, useCreatePayrollPeriod } from '../../hooks/usePayroll';
import { useToast } from '../../components/ui/Toast';

const statusStyles: Record<string, string> = {
  Open: 'bg-warning-100 text-warning-700',
  Closed: 'bg-success-100 text-success-700',
};

export default function Periods() {
  const { user } = useAuth();
  const tenantId = user?.tenantId || '';
  const { showToast } = useToast();
  const [showCreate, setShowCreate] = useState(false);

  const { data: periods = [], isLoading } = usePayrollPeriods(tenantId);
  const createPeriod = useCreatePayrollPeriod();

  const [form, setForm] = useState({ name: '', startDate: '', endDate: '' });

  const handleCreate = async () => {
    try {
      await createPeriod.mutateAsync({ ...form, tenantId, status: 'Open' });
      showToast('Period created', 'success');
      setShowCreate(false);
      setForm({ name: '', startDate: '', endDate: '' });
    } catch {
      showToast('Failed to create period', 'error');
    }
  };

  return (
    <div>
      <div className="page-chrome">
        <h1 className="page-title">Payroll Periods</h1>
        <button onClick={() => setShowCreate(true)}
          className="bg-primary text-white px-4 py-2 rounded text-sm font-bold border-none cursor-pointer hover:bg-primary-dark">+ New Period</button>
      </div>

      {isLoading ? (
        <div className="p-6 text-center text-neutral-500">Loading periods...</div>
      ) : (
        <div className="data-table mt-6">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-neutral-50">
                {['Period', 'Start', 'End', 'Status', ''].map(h => (
                  <th key={h} className="px-6 py-3 text-left font-bold text-primary border-b-2 border-neutral-200">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {periods.map((p: any, i: number) => (
                <tr key={p.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'} hover:bg-primary-50 transition-colors`}>
                  <td className="px-6 py-3 border-b border-neutral-200 font-medium">{p.name}</td>
                  <td className="px-6 py-3 border-b border-neutral-200 text-neutral-500">{p.startDate}</td>
                  <td className="px-6 py-3 border-b border-neutral-200 text-neutral-500">{p.endDate}</td>
                  <td className="px-6 py-3 border-b border-neutral-200">
                    <span className={`status-pill text-xs ${statusStyles[p.status] || ''}`}>{p.status}</span>
                  </td>
                  <td className="px-6 py-3 border-b border-neutral-200">
                    {p.status === 'Open' && (
                      <button onClick={() => showToast(`Processing ${p.name}`, 'success')}
                        className="px-3 py-1 bg-primary text-white rounded text-xs border-none cursor-pointer hover:bg-primary-dark">Process</button>
                    )}
                  </td>
                </tr>
              ))}
              {periods.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-neutral-400">No payroll periods found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

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
                <input className="w-full px-3 py-2 border border-neutral-300 rounded text-sm" placeholder="e.g., February 2024"
                  value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Start Date</label>
                  <input type="date" className="w-full px-3 py-2 border border-neutral-300 rounded text-sm"
                    value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">End Date</label>
                  <input type="date" className="w-full px-3 py-2 border border-neutral-300 rounded text-sm"
                    value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowCreate(false)}
                className="px-4 py-2 border border-neutral-300 rounded text-sm bg-white cursor-pointer hover:bg-neutral-50">Cancel</button>
              <button onClick={handleCreate}
                className="px-4 py-2 bg-primary text-white rounded text-sm font-bold border-none cursor-pointer hover:bg-primary-dark">Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
