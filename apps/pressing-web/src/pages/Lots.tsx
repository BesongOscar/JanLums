import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/ui/Toast';

const lots = [
  { id: 'LOT-001', orderId: 'ORD-002', garmentCount: 3, rack: 'A-12', status: 'Processing', created: '2024-01-15', assignee: 'Emma (Presser)' },
  { id: 'LOT-002', orderId: 'ORD-001', garmentCount: 5, rack: 'B-04', status: 'Pending', created: '2024-01-15', assignee: '—' },
  { id: 'LOT-003', orderId: 'ORD-003', garmentCount: 8, rack: 'A-07', status: 'In Progress', created: '2024-01-14', assignee: 'David (Washer)' },
  { id: 'LOT-004', orderId: 'ORD-005', garmentCount: 6, rack: 'C-01', status: 'QC Check', created: '2024-01-13', assignee: 'QC: Paul' },
  { id: 'LOT-005', orderId: 'ORD-004', garmentCount: 2, rack: 'B-09', status: 'Completed', created: '2024-01-13', assignee: 'Emma (Presser)' },
];

const statusStyles: Record<string, string> = {
  Processing: 'bg-warning-100 text-warning-700',
  Pending: 'bg-neutral-100 text-neutral-600',
  'In Progress': 'bg-info-100 text-info-700',
  'QC Check': 'bg-warning-100 text-warning-700',
  Completed: 'bg-success-100 text-success-700',
};

export default function Lots() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [newLot, setNewLot] = useState({ orderId: '', rack: '' });

  const filtered = lots.filter(l =>
    l.id.toLowerCase().includes(search.toLowerCase()) ||
    l.orderId.toLowerCase().includes(search.toLowerCase()) ||
    l.rack.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = () => {
    showToast(`Lot created for ${newLot.orderId} at rack ${newLot.rack}`, 'success');
    setShowCreate(false);
    setNewLot({ orderId: '', rack: '' });
  };

  return (
    <div>
      <div className="page-chrome">
        <h1 className="page-title">Lots</h1>
        <button onClick={() => setShowCreate(true)}
          className="bg-primary text-white px-4 py-2 rounded text-sm font-bold border-none cursor-pointer hover:bg-primary-dark">
          + Create Lot
        </button>
      </div>

      <div className="bg-white border border-neutral-200 border-t-0 px-6 py-5 mb-6">
        <div className="flex justify-end items-center gap-3">
          <input type="text" placeholder="Search lots, orders or racks..." value={search} onChange={e => setSearch(e.target.value)}
            className="px-3 py-1.5 border border-neutral-300 rounded text-sm w-60" />
          <select className="px-3 py-1.5 border border-neutral-300 rounded text-sm">
            <option>All Status</option>
            <option>Pending</option>
            <option>In Progress</option>
            <option>QC Check</option>
            <option>Completed</option>
          </select>
        </div>
      </div>

      <div className="data-table">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-neutral-50">
              {['Lot ID', 'Order', 'Garments', 'Rack', 'Status', 'Assignee', 'Created', ''].map(h => (
                <th key={h} className="px-6 py-3 text-left font-bold text-primary border-b-2 border-neutral-200">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((lot, i) => (
              <tr key={lot.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'} hover:bg-primary-50 transition-colors cursor-pointer`}
                onClick={() => navigate(`/lots/${lot.id}`)}>
                <td className="px-6 py-3 border-b border-neutral-200 font-medium">{lot.id}</td>
                <td className="px-6 py-3 border-b border-neutral-200">{lot.orderId}</td>
                <td className="px-6 py-3 border-b border-neutral-200">{lot.garmentCount}</td>
                <td className="px-6 py-3 border-b border-neutral-200">
                  <span className="font-mono text-xs bg-neutral-100 px-2 py-0.5 rounded">{lot.rack}</span>
                </td>
                <td className="px-6 py-3 border-b border-neutral-200">
                  <span className={`status-pill text-xs ${statusStyles[lot.status] || 'bg-neutral-100 text-neutral-600'}`}>{lot.status}</span>
                </td>
                <td className="px-6 py-3 border-b border-neutral-200 text-neutral-600">{lot.assignee}</td>
                <td className="px-6 py-3 border-b border-neutral-200 text-neutral-500">{lot.created}</td>
                <td className="px-6 py-3 border-b border-neutral-200">
                  <div className="flex gap-1">
                    <button onClick={(e) => { e.stopPropagation(); showToast(`Printing label for ${lot.id}`, 'success'); }}
                      className="px-2 py-1 text-xs border border-neutral-300 rounded bg-white cursor-pointer hover:bg-neutral-50">Print Label</button>
                    <button onClick={(e) => { e.stopPropagation(); navigate(`/lots/${lot.id}`); }}
                      className="px-2 py-1 text-xs border border-primary rounded bg-white text-primary cursor-pointer hover:bg-primary-50">View</button>
                  </div>
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
              <h2 className="text-lg font-bold text-neutral-800">Create Lot from Order</h2>
              <button onClick={() => setShowCreate(false)}
                className="text-neutral-400 hover:text-neutral-600 text-xl leading-none border-none bg-transparent cursor-pointer">&times;</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Order ID *</label>
                <select value={newLot.orderId} onChange={e => setNewLot({ ...newLot, orderId: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 rounded text-sm">
                  <option value="">Select order...</option>
                  <option value="ORD-001">ORD-001 — Jean Dupont</option>
                  <option value="ORD-002">ORD-002 — Marie Claire</option>
                  <option value="ORD-003">ORD-003 — Paul Martin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Rack Location *</label>
                <input value={newLot.rack} onChange={e => setNewLot({ ...newLot, rack: e.target.value })}
                  placeholder="e.g., A-12"
                  className="w-full px-3 py-2 border border-neutral-300 rounded text-sm" />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowCreate(false)}
                className="px-4 py-2 border border-neutral-300 rounded text-sm bg-white cursor-pointer hover:bg-neutral-50">Cancel</button>
              <button onClick={handleCreate} disabled={!newLot.orderId || !newLot.rack}
                className="px-4 py-2 bg-primary text-white rounded text-sm font-bold border-none cursor-pointer hover:bg-primary-dark disabled:opacity-40">Create Lot</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
