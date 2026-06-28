import { useState } from 'react';
import { useToast } from '../../components/ui/Toast';

const vehicles = [
  { id: 'VAN-001', type: 'Van', plate: 'LT 123 AB', model: 'Toyota Hiace', year: 2022, status: 'Available', insurance: '2025-06', lastMaintenance: '2024-01-05' },
  { id: 'VAN-002', type: 'Van', plate: 'LT 456 CD', model: 'Mercedes Sprinter', year: 2023, status: 'On Route', insurance: '2025-08', lastMaintenance: '2024-01-10' },
  { id: 'TRK-001', type: 'Truck', plate: 'LT 789 EF', model: 'Isuzu N-Series', year: 2021, status: 'On Route', insurance: '2025-03', lastMaintenance: '2024-01-02' },
  { id: 'MOT-001', type: 'Motorcycle', plate: 'LT 012 GH', model: 'Bajaj Boxer', year: 2023, status: 'Maintenance', insurance: '2025-01', lastMaintenance: '2023-12-15' },
];

const statusStyles: Record<string, string> = {
  Available: 'bg-success-100 text-success-700',
  'On Route': 'bg-info-100 text-info-700',
  Maintenance: 'bg-warning-100 text-warning-700',
};

export default function Vehicles() {
  const { showToast } = useToast();
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div>
      <div className="page-chrome">
        <h1 className="page-title">Delivery Vehicles</h1>
        <button onClick={() => setShowAdd(true)}
          className="bg-primary text-white px-4 py-2 rounded text-sm font-bold border-none cursor-pointer hover:bg-primary-dark">+ Add Vehicle</button>
      </div>

      <div className="data-table mt-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-neutral-50">
              {['ID', 'Type', 'Plate', 'Model', 'Year', 'Status', 'Insurance Exp', 'Last Maintenance', ''].map(h => (
                <th key={h} className="px-6 py-3 text-left font-bold text-primary border-b-2 border-neutral-200">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {vehicles.map((v, i) => (
              <tr key={v.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'} hover:bg-primary-50 transition-colors`}>
                <td className="px-6 py-3 border-b border-neutral-200 font-medium">{v.id}</td>
                <td className="px-6 py-3 border-b border-neutral-200">{v.type}</td>
                <td className="px-6 py-3 border-b border-neutral-200 font-mono">{v.plate}</td>
                <td className="px-6 py-3 border-b border-neutral-200">{v.model}</td>
                <td className="px-6 py-3 border-b border-neutral-200">{v.year}</td>
                <td className="px-6 py-3 border-b border-neutral-200">
                  <span className={`status-pill text-xs ${statusStyles[v.status]}`}>{v.status}</span>
                </td>
                <td className="px-6 py-3 border-b border-neutral-200 text-neutral-500">{v.insurance}</td>
                <td className="px-6 py-3 border-b border-neutral-200 text-neutral-500">{v.lastMaintenance}</td>
                <td className="px-6 py-3 border-b border-neutral-200">
                  <button className="px-3 py-1 border border-primary rounded bg-white text-primary cursor-pointer text-xs hover:bg-primary-50">Edit</button>
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
              <h2 className="text-lg font-bold text-neutral-800">Add Vehicle</h2>
              <button onClick={() => setShowAdd(false)}
                className="text-neutral-400 hover:text-neutral-600 text-xl leading-none border-none bg-transparent cursor-pointer">&times;</button>
            </div>
            <div className="space-y-4">
              {['Type', 'Plate Number', 'Model', 'Year'].map(f => (
                <div key={f}>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">{f}</label>
                  <input className="w-full px-3 py-2 border border-neutral-300 rounded text-sm" placeholder={`Enter ${f.toLowerCase()}`} />
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowAdd(false)}
                className="px-4 py-2 border border-neutral-300 rounded text-sm bg-white cursor-pointer hover:bg-neutral-50">Cancel</button>
              <button onClick={() => { showToast('Vehicle added', 'success'); setShowAdd(false); }}
                className="px-4 py-2 bg-primary text-white rounded text-sm font-bold border-none cursor-pointer hover:bg-primary-dark">Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
