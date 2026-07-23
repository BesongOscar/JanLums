import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useEmployees, useCreateEmployee } from '../../hooks/useEmployees';
import { useToast } from '../../components/ui/Toast';

const statusStyles: Record<string, string> = {
  Active: 'bg-success-100 text-success-700',
  Inactive: 'bg-neutral-100 text-neutral-500',
};

export default function Staff() {
  const { user } = useAuth();
  const tenantId = user?.tenantId || '';
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  const { data: employees = [], isLoading } = useEmployees(tenantId);
  const createEmployee = useCreateEmployee();

  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '', role: '', department: '', branch: '' });

  const filtered = employees.filter((e: any) =>
    `${e.firstName} ${e.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    e.role.toLowerCase().includes(search.toLowerCase()) ||
    e.department.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = async () => {
    try {
      await createEmployee.mutateAsync({ ...form, tenantId, status: 'Active' });
      showToast('Employee added', 'success');
      setShowAdd(false);
      setForm({ firstName: '', lastName: '', phone: '', role: '', department: '', branch: '' });
    } catch {
      showToast('Failed to add employee', 'error');
    }
  };

  return (
    <div>
      <div className="page-chrome">
        <h1 className="page-title">Employees</h1>
        <button onClick={() => setShowAdd(true)}
          className="bg-primary text-white px-4 py-2 rounded text-sm font-bold border-none cursor-pointer hover:bg-primary-dark">+ Add Employee</button>
      </div>

      <div className="bg-white border border-neutral-200 border-t-0 px-6 py-5 mb-6">
        <div className="flex justify-end">
          <input type="text" placeholder="Search by name, role or department..." value={search} onChange={e => setSearch(e.target.value)}
            className="px-3 py-1.5 border border-neutral-300 rounded text-sm w-60" />
        </div>
      </div>

      {isLoading ? (
        <div className="p-6 text-center text-neutral-500">Loading employees...</div>
      ) : (
        <div className="data-table">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-neutral-50">
                {['ID', 'Name', 'Role', 'Department', 'Branch', 'Phone', 'Since', 'Status'].map(h => (
                  <th key={h} className="px-6 py-3 text-left font-bold text-primary border-b-2 border-neutral-200">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((e: any, i: number) => (
                <tr key={e.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'} hover:bg-primary-50 transition-colors`}>
                  <td className="px-6 py-3 border-b border-neutral-200 font-medium">{e.id.slice(0, 8)}</td>
                  <td className="px-6 py-3 border-b border-neutral-200 font-medium">{e.firstName} {e.lastName}</td>
                  <td className="px-6 py-3 border-b border-neutral-200">{e.role}</td>
                  <td className="px-6 py-3 border-b border-neutral-200 text-neutral-600">{e.department}</td>
                  <td className="px-6 py-3 border-b border-neutral-200">{e.branch}</td>
                  <td className="px-6 py-3 border-b border-neutral-200 text-neutral-600">{e.phone}</td>
                  <td className="px-6 py-3 border-b border-neutral-200 text-neutral-500">{e.startDate || '\u2014'}</td>
                  <td className="px-6 py-3 border-b border-neutral-200">
                    <span className={`status-pill text-xs ${statusStyles[e.status] || ''}`}>{e.status}</span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="px-6 py-8 text-center text-neutral-400">No employees found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-neutral-800">Add Employee</h2>
              <button onClick={() => setShowAdd(false)}
                className="text-neutral-400 hover:text-neutral-600 text-xl leading-none border-none bg-transparent cursor-pointer">&times;</button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">First Name</label>
                  <input className="w-full px-3 py-2 border border-neutral-300 rounded text-sm" placeholder="First name"
                    value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Last Name</label>
                  <input className="w-full px-3 py-2 border border-neutral-300 rounded text-sm" placeholder="Last name"
                    value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Phone</label>
                <input className="w-full px-3 py-2 border border-neutral-300 rounded text-sm" placeholder="+237 6XX XXX XXX"
                  value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Role</label>
                  <input className="w-full px-3 py-2 border border-neutral-300 rounded text-sm" placeholder="e.g., Washer"
                    value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Department</label>
                  <input className="w-full px-3 py-2 border border-neutral-300 rounded text-sm" placeholder="e.g., Processing"
                    value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Branch</label>
                <input className="w-full px-3 py-2 border border-neutral-300 rounded text-sm" placeholder="e.g., Yaounde Main"
                  value={form.branch} onChange={e => setForm({ ...form, branch: e.target.value })} />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowAdd(false)}
                className="px-4 py-2 border border-neutral-300 rounded text-sm bg-white cursor-pointer hover:bg-neutral-50">Cancel</button>
              <button onClick={handleCreate}
                className="px-4 py-2 bg-primary text-white rounded text-sm font-bold border-none cursor-pointer hover:bg-primary-dark">Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
