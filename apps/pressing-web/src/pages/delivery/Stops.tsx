import { useState } from 'react';
import { useToast } from '../../components/ui/Toast';

const stops = [
  { id: 'STP-001', route: 'Route B — Mvog-Mbi', customer: 'Jean Dupont', address: '42 Rue de la Paix', order: 'ORD-001', status: 'Pending', eta: '11:30', notes: 'Leave at gate' },
  { id: 'STP-002', route: 'Route B — Mvog-Mbi', customer: 'Marie Claire', address: '15 Avenue Kennedy', order: 'ORD-002', status: 'In Progress', eta: '11:45', notes: '' },
  { id: 'STP-003', route: 'Route B — Mvog-Mbi', customer: 'Paul Martin', address: '8 Rue Charles de Gaulle', order: 'ORD-003', status: 'Pending', eta: '12:15', notes: 'Call before arrival' },
  { id: 'STP-004', route: 'Route A — Yaounde Centre', customer: 'Sarah Johnson', address: '23 Boulevard de la Liberte', order: 'ORD-004', status: 'Completed', eta: '—', notes: 'Signed by S. Johnson' },
  { id: 'STP-005', route: 'Route A — Yaounde Centre', customer: 'Alice Kamga', address: '5 Rue de l\'Independance', order: 'ORD-006', status: 'Completed', eta: '—', notes: 'Left with guard' },
];

const statusStyles: Record<string, string> = {
  Pending: 'bg-neutral-100 text-neutral-600',
  'In Progress': 'bg-info-100 text-info-700',
  Completed: 'bg-success-100 text-success-700',
};

export default function Stops() {
  const { showToast } = useToast();
  const [routeFilter, setRouteFilter] = useState('All');

  const filtered = routeFilter === 'All' ? stops : stops.filter(s => s.route.includes(routeFilter));

  return (
    <div>
      <div className="page-chrome">
        <h1 className="page-title">Today's Stops</h1>
      </div>

      <div className="bg-white border border-neutral-200 border-t-0 px-6 py-5 mb-6">
        <div className="flex justify-end gap-3">
          {['All', 'Route A', 'Route B', 'Route C'].map(r => (
            <button key={r} onClick={() => setRouteFilter(r)}
              className={`px-4 py-1.5 rounded text-xs font-bold border-none cursor-pointer ${routeFilter === r ? 'bg-primary text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}>{r}</button>
          ))}
        </div>
      </div>

      <div className="data-table">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-neutral-50">
              {['Stop ID', 'Route', 'Customer', 'Address', 'Order', 'Status', 'ETA', 'Notes', ''].map(h => (
                <th key={h} className="px-6 py-3 text-left font-bold text-primary border-b-2 border-neutral-200">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((s, i) => (
              <tr key={s.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'} hover:bg-primary-50 transition-colors`}>
                <td className="px-6 py-3 border-b border-neutral-200 font-medium">{s.id}</td>
                <td className="px-6 py-3 border-b border-neutral-200 text-xs">{s.route}</td>
                <td className="px-6 py-3 border-b border-neutral-200">{s.customer}</td>
                <td className="px-6 py-3 border-b border-neutral-200 text-neutral-600 text-xs">{s.address}</td>
                <td className="px-6 py-3 border-b border-neutral-200">{s.order}</td>
                <td className="px-6 py-3 border-b border-neutral-200">
                  <span className={`status-pill text-xs ${statusStyles[s.status]}`}>{s.status}</span>
                </td>
                <td className="px-6 py-3 border-b border-neutral-200 text-neutral-500">{s.eta}</td>
                <td className="px-6 py-3 border-b border-neutral-200 text-neutral-500 text-xs max-w-[120px] truncate">{s.notes || '—'}</td>
                <td className="px-6 py-3 border-b border-neutral-200">
                  {s.status !== 'Completed' && (
                    <button onClick={() => showToast(`Marking ${s.id} as delivered`, 'success')}
                      className="px-3 py-1 bg-success text-white rounded text-xs border-none cursor-pointer hover:bg-success-dark">Complete</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
