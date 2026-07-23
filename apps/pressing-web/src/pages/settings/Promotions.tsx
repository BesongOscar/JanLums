import { useAuth } from '../../contexts/AuthContext';
import { usePromotions } from '../../hooks/useSettings';
import { LoadingState } from '../../components/ui/States';

export default function Promotions() {
  const { user } = useAuth();
  const tenantId = user?.tenantId || '';
  const { data, isLoading } = usePromotions(tenantId);
  const list = Array.isArray(data) ? data : [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingState />
      </div>
    );
  }

  return (
    <div>
      <div className="page-chrome">
        <h1 className="page-title">Promotions</h1>
      </div>
      <div className="data-table mt-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-neutral-50">
              {['Code', 'Discount', 'Type', 'Min Order', 'Usage', 'Max Usage', 'Expires', 'Status', ''].map(h => (
                <th key={h} className="px-6 py-3 text-left font-bold text-primary border-b-2 border-neutral-200">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {list.length === 0 ? (
              <tr><td colSpan={9} className="text-center text-sm text-neutral-400 py-12">No promotions yet</td></tr>
            ) : (
              list.map((p: any, i: number) => (
                <tr key={p.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'} hover:bg-primary-50 transition-colors`}>
                  <td className="px-6 py-3 border-b border-neutral-200 font-medium">{p.code}</td>
                  <td className="px-6 py-3 border-b border-neutral-200 font-bold text-success-600">{p.discount}{p.type === 'Percentage' ? '%' : ' FCFA'}</td>
                  <td className="px-6 py-3 border-b border-neutral-200"><span className="text-xs bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded">{p.type}</span></td>
                  <td className="px-6 py-3 border-b border-neutral-200">{p.minOrder.toLocaleString()} FCFA</td>
                  <td className="px-6 py-3 border-b border-neutral-200">{p.usage}/{p.maxUsage || '∞'}</td>
                  <td className="px-6 py-3 border-b border-neutral-200">{p.maxUsage || 'Unlimited'}</td>
                  <td className="px-6 py-3 border-b border-neutral-200 text-xs">{p.expires ? new Date(p.expires).toLocaleDateString() : '—'}</td>
                  <td className="px-6 py-3 border-b border-neutral-200">
                    <span className={`status-pill text-xs ${p.active ? 'bg-success-100 text-success-700' : 'bg-neutral-100 text-neutral-500'}`}>
                      {p.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-3 border-b border-neutral-200">
                    <button className="px-3 py-1 border border-primary rounded bg-white text-primary cursor-pointer text-xs hover:bg-primary-50">Edit</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
