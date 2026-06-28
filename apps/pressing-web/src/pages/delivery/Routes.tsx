import { useState } from 'react';
import { useToast } from '../../components/ui/Toast';

const routes = [
  { id: 'RT-001', name: 'Yaounde Centre', zone: 'Downtown', stops: 4, driver: 'Paul Biya', vehicle: 'Van-001', distance: '12 km', status: 'Active' },
  { id: 'RT-002', name: 'Mvog-Mbi', zone: 'Residential', stops: 5, driver: 'John Takam', vehicle: 'Truck-002', distance: '18 km', status: 'Active' },
  { id: 'RT-003', name: 'Bastos', zone: 'Commercial', stops: 3, driver: 'Samuel Nkwi', vehicle: 'Van-002', distance: '8 km', status: 'Active' },
  { id: 'RT-004', name: 'Mokolo', zone: 'Market', stops: 6, driver: '—', vehicle: '—', distance: '15 km', status: 'Inactive' },
];

const statusStyles: Record<string, string> = {
  Active: 'bg-success-100 text-success-700',
  Inactive: 'bg-neutral-100 text-neutral-600',
};

export default function Routes() {
  const { showToast } = useToast();
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div>
      <div className="page-chrome">
        <h1 className="page-title">Delivery Routes</h1>
        <button onClick={() => setShowCreate(true)}
          className="bg-primary text-white px-4 py-2 rounded text-sm font-bold border-none cursor-pointer hover:bg-primary-dark">+ Create Route</button>
      </div>

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
            {routes.map((r, i) => (
              <tr key={r.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'} hover:bg-primary-50 transition-colors`}>
                <td className="px-6 py-3 border-b border-neutral-200 font-medium">{r.id}</td>
                <td className="px-6 py-3 border-b border-neutral-200">{r.name}</td>
                <td className="px-6 py-3 border-b border-neutral-200 text-neutral-600">{r.zone}</td>
                <td className="px-6 py-3 border-b border-neutral-200">{r.stops}</td>
                <td className="px-6 py-3 border-b border-neutral-200">{r.driver}</td>
                <td className="px-6 py-3 border-b border-neutral-200 text-neutral-600">{r.vehicle}</td>
                <td className="px-6 py-3 border-b border-neutral-200 text-neutral-500">{r.distance}</td>
                <td className="px-6 py-3 border-b border-neutral-200">
                  <span className={`status-pill text-xs ${statusStyles[r.status]}`}>{r.status}</span>
                </td>
                <td className="px-6 py-3 border-b border-neutral-200">
                  <button className="px-3 py-1 border border-primary rounded bg-white text-primary cursor-pointer text-xs hover:bg-primary-50">Edit</button>
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
              <h2 className="text-lg font-bold text-neutral-800">Create Route</h2>
              <button onClick={() => setShowCreate(false)}
                className="text-neutral-400 hover:text-neutral-600 text-xl leading-none border-none bg-transparent cursor-pointer">&times;</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Route Name</label>
                <input className="w-full px-3 py-2 border border-neutral-300 rounded text-sm" placeholder="e.g., Mfoundi Sector" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Zone</label>
                <select className="w-full px-3 py-2 border border-neutral-300 rounded text-sm">
                  <option>Downtown</option>
                  <option>Residential</option>
                  <option>Commercial</option>
                  <option>Market</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowCreate(false)}
                className="px-4 py-2 border border-neutral-300 rounded text-sm bg-white cursor-pointer hover:bg-neutral-50">Cancel</button>
              <button onClick={() => { showToast('Route created', 'success'); setShowCreate(false); }}
                className="px-4 py-2 bg-primary text-white rounded text-sm font-bold border-none cursor-pointer hover:bg-primary-dark">Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
