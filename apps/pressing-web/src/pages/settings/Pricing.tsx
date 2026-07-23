import { useAuth } from '../../contexts/AuthContext';
import { usePricingRules } from '../../hooks/useSettings';
import { LoadingState } from '../../components/ui/States';

export default function Pricing() {
  const { user } = useAuth();
  const tenantId = user?.tenantId || '';
  const { data, isLoading } = usePricingRules(tenantId);
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
        <h1 className="page-title">Pricing Rules</h1>
      </div>
      <div className="data-table mt-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-neutral-50">
              {['Name', 'Service', 'Base Price', 'Unit Type', 'Min Order', ''].map(h => (
                <th key={h} className="px-6 py-3 text-left font-bold text-primary border-b-2 border-neutral-200">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {list.length === 0 ? (
              <tr><td colSpan={6} className="text-center text-sm text-neutral-400 py-12">No pricing rules yet</td></tr>
            ) : (
              list.map((r: any, i: number) => (
                <tr key={r.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'} hover:bg-primary-50 transition-colors`}>
                  <td className="px-6 py-3 border-b border-neutral-200 font-medium">{r.name}</td>
                  <td className="px-6 py-3 border-b border-neutral-200 text-xs text-info">{r.service}</td>
                  <td className="px-6 py-3 border-b border-neutral-200 font-bold">{r.basePrice.toLocaleString()} FCFA</td>
                  <td className="px-6 py-3 border-b border-neutral-200"><span className="text-xs bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded">{r.unitType}</span></td>
                  <td className="px-6 py-3 border-b border-neutral-200">{r.minOrder}</td>
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
