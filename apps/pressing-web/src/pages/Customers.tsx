import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/ui/Toast';

const customers = [
  { id: 'CUS-001', name: 'Jean Dupont', phone: '+237 612 345 678', email: 'jean@email.com', orders: 12, totalSpent: 145000, since: '2023-06', status: 'Active' },
  { id: 'CUS-002', name: 'Marie Claire', phone: '+237 623 456 789', email: 'marie@email.com', orders: 8, totalSpent: 92000, since: '2023-08', status: 'Active' },
  { id: 'CUS-003', name: 'Paul Martin', phone: '+237 634 567 890', email: 'paul@email.com', orders: 5, totalSpent: 58000, since: '2024-01', status: 'Active' },
  { id: 'CUS-004', name: 'Sarah Johnson', phone: '+237 645 678 901', email: 'sarah@email.com', orders: 3, totalSpent: 18500, since: '2024-03', status: 'Inactive' },
  { id: 'CUS-005', name: 'Michel Brown', phone: '+237 656 789 012', email: 'michel@email.com', orders: 15, totalSpent: 210000, since: '2023-01', status: 'Active' },
  { id: 'CUS-006', name: 'Alice Kamga', phone: '+237 667 890 123', email: 'alice@email.com', orders: 2, totalSpent: 12500, since: '2024-05', status: 'Active' },
  { id: 'CUS-007', name: 'Bob Nkwi', phone: '+237 678 901 234', email: 'bob@email.com', orders: 7, totalSpent: 89000, since: '2023-11', status: 'Active' },
];

export default function Customers() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '' });

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search) ||
    c.id.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    showToast(`Customer "${form.name}" created`, 'success');
    setShowModal(false);
    setForm({ name: '', phone: '', email: '' });
  };

  return (
    <div>
      <div className="page-chrome">
        <h1 className="page-title">Customers</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-primary text-white px-4 py-2 rounded text-sm font-bold border-none cursor-pointer hover:bg-primary-dark"
        >
          + Add Customer
        </button>
      </div>

      <div className="bg-white border border-neutral-200 border-t-0 px-6 py-5 mb-6">
        <div className="flex justify-end items-center gap-3">
          <input
            type="text"
            placeholder="Search by name, phone or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-1.5 border border-neutral-300 rounded text-sm w-60"
          />
          <select className="px-3 py-1.5 border border-neutral-300 rounded text-sm">
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>
      </div>

      <div className="data-table">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-neutral-50">
              {['ID', 'Name', 'Phone', 'Email', 'Orders', 'Total Spent', 'Since', 'Status', ''].map(h => (
                <th key={h} className="px-6 py-3 text-left font-bold text-primary border-b-2 border-neutral-200">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((c, i) => (
              <tr key={c.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'} hover:bg-primary-50 transition-colors cursor-pointer`}
                onClick={() => navigate(`/customers/${c.id}`)}>
                <td className="px-6 py-3 border-b border-neutral-200 font-medium">{c.id}</td>
                <td className="px-6 py-3 border-b border-neutral-200">{c.name}</td>
                <td className="px-6 py-3 border-b border-neutral-200 text-neutral-600">{c.phone}</td>
                <td className="px-6 py-3 border-b border-neutral-200 text-neutral-600">{c.email}</td>
                <td className="px-6 py-3 border-b border-neutral-200">{c.orders}</td>
                <td className="px-6 py-3 border-b border-neutral-200">{c.totalSpent.toLocaleString()} FCFA</td>
                <td className="px-6 py-3 border-b border-neutral-200 text-neutral-500">{c.since}</td>
                <td className="px-6 py-3 border-b border-neutral-200">
                  <span className={`status-pill text-xs ${c.status === 'Active' ? 'bg-success-100 text-success-700' : 'bg-neutral-100 text-neutral-500'}`}>
                    {c.status}
                  </span>
                </td>
                <td className="px-6 py-3 border-b border-neutral-200">
                  <button className="px-3 py-1 border border-primary rounded bg-white text-primary cursor-pointer text-xs hover:bg-primary-50"
                    onClick={(e) => { e.stopPropagation(); navigate(`/customers/${c.id}`); }}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-6 py-4 border-t border-neutral-200 flex items-center justify-between text-sm text-neutral-500">
          <span>Showing {filtered.length} of {customers.length} customers</span>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-neutral-800">Add Customer</h2>
              <button onClick={() => setShowModal(false)} className="text-neutral-400 hover:text-neutral-600 text-xl leading-none border-none bg-transparent cursor-pointer">&times;</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Name *</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded text-sm" placeholder="Full name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Phone *</label>
                <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded text-sm" placeholder="+237 6XX XXX XXX" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Email</label>
                <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded text-sm" placeholder="email@example.com" />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-neutral-300 rounded text-sm bg-white cursor-pointer hover:bg-neutral-50">Cancel</button>
              <button onClick={handleAdd} disabled={!form.name || !form.phone}
                className="px-4 py-2 bg-primary text-white rounded text-sm font-bold border-none cursor-pointer hover:bg-primary-dark disabled:opacity-40">Add Customer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
