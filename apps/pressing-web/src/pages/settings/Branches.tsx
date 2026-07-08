import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useBranches, useCreateBranch } from '../../hooks/useBranches';
import { useToast } from '../../components/ui/Toast';
import { LoadingState } from '../../components/ui/States';

export default function Branches() {
  const { user } = useAuth();
  const tenantId = user?.tenantId || '';
  const { data: branches, isLoading } = useBranches(tenantId);
  const createBranch = useCreateBranch();
  const { showToast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', address: '', city: '', phone: '', email: '' });
  const [creating, setCreating] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingState />
      </div>
    );
  }

  const list = Array.isArray(branches) ? branches : [];

  const formatHours = (hours: any) => {
    if (!hours) return '—';
    if (typeof hours === 'object') {
      const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
      for (const day of days) {
        if (hours[day]?.open && hours[day]?.close) {
          return `${hours[day].open} – ${hours[day].close}`;
        }
      }
    }
    return JSON.stringify(hours);
  };

  const handleAdd = async () => {
    if (!form.name) return;
    setCreating(true);
    try {
      await createBranch.mutateAsync({
        tenantId,
        name: form.name,
        address: form.address || undefined,
        city: form.city || undefined,
        phone: form.phone || undefined,
        email: form.email || undefined,
      });
      showToast(`Branch "${form.name}" created`, 'success');
      setShowModal(false);
      setForm({ name: '', address: '', city: '', phone: '', email: '' });
    } catch {
      showToast('Failed to create branch', 'error');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div>
      <div className="page-chrome">
        <h1 className="page-title">Branches</h1>
        <button onClick={() => setShowModal(true)} className="bg-primary text-white px-4 py-2 rounded text-sm font-bold border-none cursor-pointer hover:bg-primary-dark">+ Add Branch</button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => !creating && setShowModal(false)}>
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-neutral-800 mb-4">Add Branch</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-600 mb-1">Name *</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border border-neutral-300 rounded text-sm" placeholder="Main Branch" />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-600 mb-1">Address</label>
                <input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="w-full px-3 py-2 border border-neutral-300 rounded text-sm" placeholder="123 Main St" />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-600 mb-1">City</label>
                <input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} className="w-full px-3 py-2 border border-neutral-300 rounded text-sm" placeholder="Douala" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-600 mb-1">Phone</label>
                  <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full px-3 py-2 border border-neutral-300 rounded text-sm" placeholder="+237" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-600 mb-1">Email</label>
                  <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2 border border-neutral-300 rounded text-sm" placeholder="branch@example.com" />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowModal(false)} disabled={creating} className="px-4 py-2 border border-neutral-300 rounded text-sm cursor-pointer hover:bg-neutral-50 disabled:opacity-50">Cancel</button>
              <button onClick={handleAdd} disabled={creating || !form.name} className="px-4 py-2 bg-primary text-white rounded text-sm font-bold border-none cursor-pointer hover:bg-primary-dark disabled:opacity-50">{creating ? 'Creating...' : 'Create Branch'}</button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-5 mt-6">
        {list.length === 0 ? (
          <div className="col-span-2 text-center text-sm text-neutral-400 py-12">No branches yet</div>
        ) : (
          list.map((b: any) => (
            <div key={b.id} className="bg-white border border-neutral-200 rounded-lg p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-base font-bold text-neutral-800">{b.name}</h3>
                  <p className="text-xs text-neutral-400">{b.city || ''}</p>
                </div>
                <span className={`status-pill text-xs ${b.isActive !== false ? 'bg-success-100 text-success-700' : 'bg-neutral-100 text-neutral-500'}`}>
                  {b.isActive !== false ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="space-y-1.5 text-xs text-neutral-600">
                <p><span className="font-medium text-neutral-700">Address:</span> {b.address || '—'}</p>
                <p><span className="font-medium text-neutral-700">Phone:</span> {b.phone || '—'}</p>
                <p><span className="font-medium text-neutral-700">Email:</span> {b.email || '—'}</p>
                <p><span className="font-medium text-neutral-700">Hours:</span> {formatHours(b.operatingHours)}</p>
              </div>
              <div className="mt-4 flex justify-end">
                <button className="px-3 py-1 border border-primary rounded bg-white text-primary cursor-pointer text-xs hover:bg-primary-50">Edit</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
