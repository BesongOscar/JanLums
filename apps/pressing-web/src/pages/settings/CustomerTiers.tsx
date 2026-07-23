import { useAuth } from '../../contexts/AuthContext';
import { useCustomerTiers } from '../../hooks/useSettings';
import { LoadingState } from '../../components/ui/States';

export default function CustomerTiers() {
  const { user } = useAuth();
  const tenantId = user?.tenantId || '';
  const { data, isLoading } = useCustomerTiers(tenantId);
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
        <h1 className="page-title">Customer Tiers</h1>
      </div>
      <div className="data-table mt-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-neutral-50">
              {['Tier', 'Min Lifetime Spend', 'Discount %', ''].map(h => (
                <th key={h} className="px-6 py-3 text-left font-bold text-primary border-b-2 border-neutral-200">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {list.length === 0 ? (
              <tr><td colSpan={4} className="text-center text-sm text-neutral-400 py-12">No customer tiers yet</td></tr>
            ) : (
              list.map((t: any, i: number) => (
                <tr key={t.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'} hover:bg-primary-50 transition-colors`}>
                  <td className="px-6 py-3 border-b border-neutral-200 font-medium flex items-center gap-2">
                    <span className="inline-block w-3 h-3 rounded-full" style={{backgroundColor: t.color}} />
                    {t.name}
                  </td>
                  <td className="px-6 py-3 border-b border-neutral-200 font-bold">{t.minSpend.toLocaleString()} FCFA</td>
                  <td className="px-6 py-3 border-b border-neutral-200">{t.discount}%</td>
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
