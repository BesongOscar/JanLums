import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLots, useCreateLot } from '../hooks/useLots';
import { useToast } from '../components/ui/Toast';

const statusStyles: Record<string, string> = {
  Processing: 'bg-warning-100 text-warning-700',
  Pending: 'bg-neutral-100 text-neutral-600',
  'In Progress': 'bg-info-100 text-info-700',
  'QC Check': 'bg-warning-100 text-warning-700',
  Completed: 'bg-success-100 text-success-700',
};

export default function Lots() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const tenantId = user?.tenantId || '';
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);

  const { data: lots = [], isLoading } = useLots(tenantId);
  const createLot = useCreateLot();

  const [form, setForm] = useState({ orderId: '', rack: '' });

  const filtered = lots.filter((l: any) =>
    l.id.toLowerCase().includes(search.toLowerCase()) ||
    (l.orderId || '').toLowerCase().includes(search.toLowerCase()) ||
    l.rack.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = async () => {
    try {
      await createLot.mutateAsync({ ...form, tenantId });
      showToast('Lot created', 'success');
      setShowCreate(false);
      setForm({ orderId: '', rack: '' });
    } catch {
      showToast('Failed to create lot', 'error');
    }
  };

  return (
    <div>
      <div className="page-chrome">
        <h1 className="page-title">Lots</h1>
        <button onClick={() => setShowCreate(true)}
          className="bg-primary text-white px-4 py-2 rounded text-sm font-bold border-none cursor-pointer hover:bg-primary-dark">+ Create Lot</button>
      </div>

      <div className="bg-white border border-neutral-200 border-t-0 px-6 py-5 mb-6">
        <div className="flex justify-end items-center gap-3">
          <input type="text" placeholder="Search lots, orders or racks..." value={search} onChange={e => setSearch(e.target.value)}
            className="px-3 py-1.5 border border-neutral-300 rounded text-sm w-60" />
        </div>
      </div>

      {isLoading ? (
        <div className="p-6 text-center text-neutral-500">Loading lots...</div>
      ) : (
        <div className="data-table">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-neutral-50">
                {['Lot ID', 'Order', 'Rack', 'Status', 'Assignee', 'Created', ''].map(h => (
                  <th key={h} className="px-6 py-3 text-left font-bold text-primary border-b-2 border-neutral-200">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((lot: any, i: number) => (
                <tr key={lot.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'} hover:bg-primary-50 transition-colors cursor-pointer`}
                  onClick={() => navigate(`/lots/${lot.id}`)}>
                  <td className="px-6 py-3 border-b border-neutral-200 font-medium">{lot.id.slice(0, 8)}</td>
                  <td className="px-6 py-3 border-b border-neutral-200">{lot.orderId ? lot.orderId.slice(0, 8) : '\u2014'}</td>
                  <td className="px-6 py-3 border-b border-neutral-200">
                    <span className="font-mono text-xs bg-neutral-100 px-2 py-0.5 rounded">{lot.rack}</span>
                  </td>
                  <td className="px-6 py-3 border-b border-neutral-200">
                    <span className={`status-pill text-xs ${statusStyles[lot.status] || 'bg-neutral-100 text-neutral-600'}`}>{lot.status}</span>
                  </td>
                  <td className="px-6 py-3 border-b border-neutral-200 text-neutral-600">{lot.assignee || '\u2014'}</td>
                  <td className="px-6 py-3 border-b border-neutral-200 text-neutral-500">{new Date(lot.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-3 border-b border-neutral-200">
                    <button onClick={(e) => { e.stopPropagation(); navigate(`/lots/${lot.id}`); }}
                      className="px-2 py-1 text-xs border border-primary rounded bg-white text-primary cursor-pointer hover:bg-primary-50">View</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-6 py-8 text-center text-neutral-400">No lots found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-neutral-800">Create Lot</h2>
              <button onClick={() => setShowCreate(false)}
                className="text-neutral-400 hover:text-neutral-600 text-xl leading-none border-none bg-transparent cursor-pointer">&times;</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Order ID</label>
                <input className="w-full px-3 py-2 border border-neutral-300 rounded text-sm" placeholder="e.g., ORD-002"
                  value={form.orderId} onChange={e => setForm({ ...form, orderId: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Rack Location *</label>
                <input className="w-full px-3 py-2 border border-neutral-300 rounded text-sm" placeholder="e.g., A-12"
                  value={form.rack} onChange={e => setForm({ ...form, rack: e.target.value })} />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowCreate(false)}
                className="px-4 py-2 border border-neutral-300 rounded text-sm bg-white cursor-pointer hover:bg-neutral-50">Cancel</button>
              <button onClick={handleCreate} disabled={!form.rack}
                className="px-4 py-2 bg-primary text-white rounded text-sm font-bold border-none cursor-pointer hover:bg-primary-dark disabled:opacity-40">Create Lot</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
