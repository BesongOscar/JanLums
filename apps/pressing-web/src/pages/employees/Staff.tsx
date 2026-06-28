import { useState } from 'react';
import { useToast } from '../../components/ui/Toast';

const staff = [
  { id: 'EMP-001', name: 'Alice Nkwi', role: 'Counter Agent', department: 'Front Desk', branch: 'Yaounde Main', status: 'Active', phone: '+237 612 345 678', startDate: '2023-06' },
  { id: 'EMP-002', name: 'David Kamga', role: 'Washer', department: 'Processing', branch: 'Yaounde Main', status: 'Active', phone: '+237 623 456 789', startDate: '2023-06' },
  { id: 'EMP-003', name: 'Emma Biya', role: 'Presser', department: 'Finishing', branch: 'Yaounde Main', status: 'Active', phone: '+237 634 567 890', startDate: '2023-08' },
  { id: 'EMP-004', name: 'Paul Ebode', role: 'QC Inspector', department: 'Quality', branch: 'Yaounde Main', status: 'Active', phone: '+237 645 678 901', startDate: '2023-09' },
  { id: 'EMP-005', name: 'Sarah Mengue', role: 'Branch Manager', department: 'Management', branch: 'Yaounde Main', status: 'Active', phone: '+237 656 789 012', startDate: '2023-01' },
  { id: 'EMP-006', name: 'John Takam', role: 'Driver', department: 'Delivery', branch: 'Douala Central', status: 'Active', phone: '+237 667 890 123', startDate: '2023-11' },
  { id: 'EMP-007', name: 'Rose Atangana', role: 'Counter Agent', department: 'Front Desk', branch: 'Douala Central', status: 'Inactive', phone: '+237 678 901 234', startDate: '2024-01' },
];

const statusStyles: Record<string, string> = {
  Active: 'bg-success-100 text-success-700',
  Inactive: 'bg-neutral-100 text-neutral-500',
};

export default function Staff() {
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  const filtered = staff.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.role.toLowerCase().includes(search.toLowerCase()) ||
    s.department.toLowerCase().includes(search.toLowerCase())
  );

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
            {filtered.map((e, i) => (
              <tr key={e.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'} hover:bg-primary-50 transition-colors`}>
                <td className="px-6 py-3 border-b border-neutral-200 font-medium">{e.id}</td>
                <td className="px-6 py-3 border-b border-neutral-200 font-medium">{e.name}</td>
                <td className="px-6 py-3 border-b border-neutral-200">{e.role}</td>
                <td className="px-6 py-3 border-b border-neutral-200 text-neutral-600">{e.department}</td>
                <td className="px-6 py-3 border-b border-neutral-200">{e.branch}</td>
                <td className="px-6 py-3 border-b border-neutral-200 text-neutral-600">{e.phone}</td>
                <td className="px-6 py-3 border-b border-neutral-200 text-neutral-500">{e.startDate}</td>
                <td className="px-6 py-3 border-b border-neutral-200">
                  <span className={`status-pill text-xs ${statusStyles[e.status]}`}>{e.status}</span>
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
              <h2 className="text-lg font-bold text-neutral-800">Add Employee</h2>
              <button onClick={() => setShowAdd(false)}
                className="text-neutral-400 hover:text-neutral-600 text-xl leading-none border-none bg-transparent cursor-pointer">&times;</button>
            </div>
            <div className="space-y-4">
              {['Full Name', 'Phone', 'Role', 'Department', 'Branch'].map(f => (
                <div key={f}>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">{f}</label>
                  <input className="w-full px-3 py-2 border border-neutral-300 rounded text-sm" placeholder={f} />
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowAdd(false)}
                className="px-4 py-2 border border-neutral-300 rounded text-sm bg-white cursor-pointer hover:bg-neutral-50">Cancel</button>
              <button onClick={() => { showToast('Employee added', 'success'); setShowAdd(false); }}
                className="px-4 py-2 bg-primary text-white rounded text-sm font-bold border-none cursor-pointer hover:bg-primary-dark">Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
