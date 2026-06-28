import { useState } from 'react';
import { useToast } from '../../components/ui/Toast';

const drivers = [
  { id: 'DRV-001', name: 'Paul Biya', phone: '+237 612 111 222', license: 'LIC-001', vehicle: 'Van-001', route: 'Route A', status: 'On Route', shift: '6:00 - 14:00', deliveries: 12 },
  { id: 'DRV-002', name: 'John Takam', phone: '+237 623 333 444', license: 'LIC-002', vehicle: 'Truck-002', route: 'Route B', status: 'On Route', shift: '8:00 - 16:00', deliveries: 8 },
  { id: 'DRV-003', name: 'Samuel Nkwi', phone: '+237 634 555 666', license: 'LIC-003', vehicle: 'Van-002', route: 'Route C', status: 'On Route', shift: '10:00 - 18:00', deliveries: 5 },
  { id: 'DRV-004', name: 'Esther Mengue', phone: '+237 645 777 888', license: 'LIC-004', vehicle: '—', route: '—', status: 'Off Duty', shift: '6:00 - 14:00', deliveries: 0 },
  { id: 'DRV-005', name: 'Robert Eboue', phone: '+237 656 999 000', license: 'LIC-005', vehicle: '—', route: '—', status: 'Off Duty', shift: '14:00 - 22:00', deliveries: 0 },
];

const statusStyles: Record<string, string> = {
  'On Route': 'bg-info-100 text-info-700',
  'Off Duty': 'bg-neutral-100 text-neutral-600',
};

export default function Drivers() {
  const { showToast } = useToast();
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div>
      <div className="page-chrome">
        <h1 className="page-title">Delivery Drivers</h1>
        <button onClick={() => setShowAdd(true)}
          className="bg-primary text-white px-4 py-2 rounded text-sm font-bold border-none cursor-pointer hover:bg-primary-dark">+ Add Driver</button>
      </div>

      <div className="data-table mt-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-neutral-50">
              {['ID', 'Name', 'Phone', 'License', 'Vehicle', 'Route', 'Status', 'Shift', 'Deliveries'].map(h => (
                <th key={h} className="px-6 py-3 text-left font-bold text-primary border-b-2 border-neutral-200">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {drivers.map((d, i) => (
              <tr key={d.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'} hover:bg-primary-50 transition-colors`}>
                <td className="px-6 py-3 border-b border-neutral-200 font-medium">{d.id}</td>
                <td className="px-6 py-3 border-b border-neutral-200 font-medium">{d.name}</td>
                <td className="px-6 py-3 border-b border-neutral-200 text-neutral-600">{d.phone}</td>
                <td className="px-6 py-3 border-b border-neutral-200 text-xs font-mono">{d.license}</td>
                <td className="px-6 py-3 border-b border-neutral-200">{d.vehicle}</td>
                <td className="px-6 py-3 border-b border-neutral-200">{d.route}</td>
                <td className="px-6 py-3 border-b border-neutral-200">
                  <span className={`status-pill text-xs ${statusStyles[d.status]}`}>{d.status}</span>
                </td>
                <td className="px-6 py-3 border-b border-neutral-200 text-neutral-500">{d.shift}</td>
                <td className="px-6 py-3 border-b border-neutral-200 font-bold">{d.deliveries}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-neutral-800">Add Driver</h2>
              <button onClick={() => setShowAdd(false)}
                className="text-neutral-400 hover:text-neutral-600 text-xl leading-none border-none bg-transparent cursor-pointer">&times;</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Full Name</label>
                <input className="w-full px-3 py-2 border border-neutral-300 rounded text-sm" placeholder="Enter driver name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Phone</label>
                <input className="w-full px-3 py-2 border border-neutral-300 rounded text-sm" placeholder="+237 6XX XXX XXX" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">License #</label>
                  <input className="w-full px-3 py-2 border border-neutral-300 rounded text-sm" placeholder="LIC-XXX" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Vehicle</label>
                  <select className="w-full px-3 py-2 border border-neutral-300 rounded text-sm">
                    <option>Assign later</option>
                    <option>Van-001</option>
                    <option>Van-002</option>
                    <option>Truck-002</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Route</label>
                <select className="w-full px-3 py-2 border border-neutral-300 rounded text-sm">
                  <option>Assign later</option>
                  <option>Route A</option>
                  <option>Route B</option>
                  <option>Route C</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowAdd(false)}
                className="px-4 py-2 border border-neutral-300 rounded text-sm bg-white cursor-pointer hover:bg-neutral-50">Cancel</button>
              <button onClick={() => { showToast('Driver added', 'success'); setShowAdd(false); }}
                className="px-4 py-2 bg-primary text-white rounded text-sm font-bold border-none cursor-pointer hover:bg-primary-dark">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
