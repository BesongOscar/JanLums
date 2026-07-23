import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLotById } from '../hooks/useLots';
import { useToast } from '../components/ui/Toast';

const statusStyles: Record<string, string> = {
  Processing: 'bg-warning-100 text-warning-700',
  Washing: 'bg-info-100 text-info-700',
  Pressing: 'bg-warning-100 text-warning-700',
  Pending: 'bg-neutral-100 text-neutral-600',
  Completed: 'bg-success-100 text-success-700',
  'QC Check': 'bg-warning-100 text-warning-700',
  Rewash: 'bg-danger-100 text-danger-700',
};

export default function LotDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const tenantId = user?.tenantId || '';
  const { showToast } = useToast();

  const { data: lot, isLoading } = useLotById(id || '', tenantId);

  if (isLoading) return <div className="p-6 text-center text-neutral-500">Loading lot...</div>;
  if (!lot) return <div className="p-6 text-center text-neutral-500">Lot not found</div>;

  const garments = lot.garments || [];

  return (
    <div>
      <div className="page-chrome">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/lots')}
            className="text-primary hover:text-primary-dark text-sm no-underline bg-transparent border-none cursor-pointer">&larr; Back to Lots</button>
          <h1 className="page-title">{lot.id.slice(0, 8)}</h1>
          <span className={`status-pill text-xs ${statusStyles[lot.status] || 'bg-neutral-100 text-neutral-600'}`}>{lot.status}</span>
        </div>
        <div className="flex gap-2">
          <button onClick={() => showToast('Printing label', 'success')}
            className="px-4 py-2 border border-primary rounded bg-white text-primary text-sm cursor-pointer hover:bg-primary-50">Print Label</button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mt-6">
        <div className="bg-white border border-neutral-200 rounded shadow-sm">
          <div className="px-6 py-4 border-b border-neutral-200">
            <h2 className="text-base font-bold text-neutral-800">Lot Details</h2>
          </div>
          <div className="p-6 space-y-3 text-sm">
            {[
              ['Order', lot.orderId ? lot.orderId.slice(0, 8) : '\u2014'],
              ['Rack Location', lot.rack],
              ['Assignee', lot.assignee || '\u2014'],
              ['Created', new Date(lot.createdAt).toLocaleDateString()],
              ['Garments', garments.length],
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
                {garments.map((g: any, i: number) => (
                  <tr key={g.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'} hover:bg-primary-50 transition-colors cursor-pointer`}
                    onClick={() => navigate(`/garments/${g.id}`)}>
                    <td className="px-6 py-3 border-b border-neutral-200 font-medium">{g.id.slice(0, 8)}</td>
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
                {garments.length === 0 && (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-neutral-400">No garments in this lot</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
