import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/ui/Toast';

const lot = {
  id: 'LOT-001', orderId: 'ORD-002', rack: 'A-12', status: 'Processing',
  created: '2024-01-15', assignee: 'Emma (Presser)',
  customer: 'Marie Claire', phone: '+237 623 456 789',
  garments: [
    { id: 'GRM-001', name: 'Shirt', service: 'Wash & Fold', status: 'Washing' },
    { id: 'GRM-002', name: 'Blouse', service: 'Dry Cleaning', status: 'Pressing' },
    { id: 'GRM-003', name: 'Skirt', service: 'Ironing / Pressing', status: 'Pending' },
  ],
};

const statusStyles: Record<string, string> = {
  Processing: 'bg-warning-100 text-warning-700',
  Washing: 'bg-info-100 text-info-700',
  Pressing: 'bg-warning-100 text-warning-700',
  Pending: 'bg-neutral-100 text-neutral-600',
};

export default function LotDetail() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  return (
    <div>
      <div className="page-chrome">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/lots')}
            className="text-primary hover:text-primary-dark text-sm no-underline bg-transparent border-none cursor-pointer">&larr; Back to Lots</button>
          <h1 className="page-title">{lot.id}</h1>
          <span className="status-pill text-xs bg-warning-100 text-warning-700">{lot.status}</span>
        </div>
        <div className="flex gap-2">
          <button onClick={() => showToast('Printing label for ' + lot.id, 'success')}
            className="px-4 py-2 border border-primary rounded bg-white text-primary text-sm cursor-pointer hover:bg-primary-50">Print Label</button>
          <button className="px-4 py-2 bg-primary text-white rounded text-sm font-bold border-none cursor-pointer hover:bg-primary-dark">Update Status</button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mt-6">
        <div className="bg-white border border-neutral-200 rounded shadow-sm">
          <div className="px-6 py-4 border-b border-neutral-200">
            <h2 className="text-base font-bold text-neutral-800">Lot Details</h2>
          </div>
          <div className="p-6 space-y-3 text-sm">
            {[
              ['Order', lot.orderId], ['Customer', lot.customer], ['Phone', lot.phone],
              ['Rack Location', lot.rack], ['Assignee', lot.assignee], ['Created', lot.created],
            ].map(([l, v]) => (
              <div key={l}>
                <div className="text-xs text-neutral-500">{l}</div>
                <div className="text-neutral-800">{v}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-2">
          <div className="bg-white border border-neutral-200 rounded shadow-sm">
            <div className="px-6 py-4 border-b border-neutral-200">
              <h2 className="text-base font-bold text-neutral-800">Garments in Lot</h2>
            </div>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-neutral-50">
                  {['Garment ID', 'Item', 'Service', 'Status', ''].map(h => (
                    <th key={h} className="px-6 py-3 text-left font-bold text-primary border-b border-neutral-200">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {lot.garments.map((g, i) => (
                  <tr key={g.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'} hover:bg-primary-50 transition-colors cursor-pointer`}
                    onClick={() => navigate(`/garments/${g.id}`)}>
                    <td className="px-6 py-3 border-b border-neutral-200 font-medium">{g.id}</td>
                    <td className="px-6 py-3 border-b border-neutral-200">{g.name}</td>
                    <td className="px-6 py-3 border-b border-neutral-200 text-neutral-600">{g.service}</td>
                    <td className="px-6 py-3 border-b border-neutral-200">
                      <span className={`status-pill text-xs ${statusStyles[g.status] || 'bg-neutral-100 text-neutral-600'}`}>{g.status}</span>
                    </td>
                    <td className="px-6 py-3 border-b border-neutral-200">
                      <button onClick={(e) => { e.stopPropagation(); navigate(`/garments/${g.id}`); }}
                        className="px-3 py-1 border border-primary rounded bg-white text-primary cursor-pointer text-xs">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
