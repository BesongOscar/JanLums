import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRoutes, useCreateRoute } from '../../hooks/useDelivery';
import { useToast } from '../../components/ui/Toast';

const statusStyles: Record<string, string> = {
  Active: 'bg-success-100 text-success-700',
  Inactive: 'bg-neutral-100 text-neutral-600',
};

export default function Routes() {
  const { user } = useAuth();
  const tenantId = user?.tenantId || '';
  const { showToast } = useToast();
  const [showCreate, setShowCreate] = useState(false);

  const { data: routes = [], isLoading } = useRoutes(tenantId);
  const createRoute = useCreateRoute();

  const [form, setForm] = useState({ name: '', zone: '', description: '' });

  const handleCreate = async () => {
    try {
      await createRoute.mutateAsync({ ...form, tenantId });
      showToast('Route created', 'success');
      setShowCreate(false);
      setForm({ name: '', zone: '', description: '' });
    } catch {
      showToast('Failed to create route', 'error');
    }
  };

  return (
    <div>
      <div className="page-chrome">
        <h1 className="page-title">Delivery Routes</h1>
        <button onClick={() => setShowCreate(true)}
          className="bg-primary text-white px-4 py-2 rounded text-sm font-bold border-none cursor-pointer hover:bg-primary-dark">+ Create Route</button>
      </div>

      {isLoading ? (
        <div className="p-6 text-center text-neutral-500">Loading routes...</div>
      ) : (
        <div className="data-table mt-6">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-neutral-50">
                {['Route ID', 'Name', 'Zone', 'Stops', 'Driver', 'Vehicle', 'Distance', 'Status', ''].map(h => (
                  <th key={h} className="px-6 py-3 text-left font-bold text-primary border-b-2 border-neutral-200">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {routes.map((r: any, i: number) => (
                <tr key={r.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'} hover:bg-primary-50 transition-colors`}>
                  <td className="px-6 py-3 border-b border-neutral-200 font-medium">{r.id.slice(0, 8)}</td>
                  <td className="px-6 py-3 border-b border-neutral-200">{r.name}</td>
                  <td className="px-6 py-3 border-b border-neutral-200 text-neutral-600">{r.zone || '\u2014'}</td>
                  <td className="px-6 py-3 border-b border-neutral-200">{r.stopCount || '\u2014'}</td>
                  <td className="px-6 py-3 border-b border-neutral-200">{r.driverName || '\u2014'}</td>
                  <td className="px-6 py-3 border-b border-neutral-200 text-neutral-600">{r.vehicleName || '\u2014'}</td>
                  <td className="px-6 py-3 border-b border-neutral-200 text-neutral-500">{r.distance || '\u2014'}</td>
                  <td className="px-6 py-3 border-b border-neutral-200">
                    <span className={`status-pill text-xs ${statusStyles[r.status] || ''}`}>{r.status}</span>
                  </td>
                  <td className="px-6 py-3 border-b border-neutral-200">
                    <button className="px-3 py-1 border border-primary rounded bg-white text-primary cursor-pointer text-xs hover:bg-primary-50">Edit</button>
                  </td>
                </tr>
              ))}
              {routes.length === 0 && (
                <tr><td colSpan={9} className="px-6 py-8 text-center text-neutral-400">No routes found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-neutral-800">Create Route</h2>
              <button onClick={() => setShowCreate(false)}
                className="text-neutral-400 hover:text-neutral-600 text-xl leading-none border-none bg-transparent cursor-pointer">&times;</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Route Name</label>
                <input className="w-full px-3 py-2 border border-neutral-300 rounded text-sm" placeholder="e.g., Mfoundi Sector"
                  value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Zone</label>
                <input className="w-full px-3 py-2 border border-neutral-300 rounded text-sm" placeholder="e.g., Downtown"
                  value={form.zone} onChange={e => setForm({ ...form, zone: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Description</label>
                <textarea className="w-full px-3 py-2 border border-neutral-300 rounded text-sm" placeholder="Optional description"
                  value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} />
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
