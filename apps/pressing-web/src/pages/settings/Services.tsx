import { useAuth } from '../../contexts/AuthContext';
import { useServices } from '../../hooks/useServices';
import { LoadingState } from '../../components/ui/States';

export default function Services() {
  const { user } = useAuth();
  const tenantId = user?.tenantId || '';
  const { data: services, isLoading } = useServices(tenantId);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingState />
      </div>
    );
  }

  const list = Array.isArray(services) ? services : [];

  return (
    <div>
      <div className="page-chrome">
        <h1 className="page-title">Services Settings</h1>
      </div>
      <div className="data-table mt-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-neutral-50">
              {['Service Name', 'Category', 'Base Price', 'Pricing Unit', 'Est. Hours', 'Active', ''].map(h => (
                <th key={h} className="px-6 py-3 text-left font-bold text-primary border-b-2 border-neutral-200">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {list.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-sm text-neutral-400">No services yet</td>
              </tr>
            ) : (
              list.map((s: any, i: number) => (
                <tr key={s.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'} hover:bg-primary-50 transition-colors`}>
                  <td className="px-6 py-3 border-b border-neutral-200 font-medium">{s.name}</td>
                  <td className="px-6 py-3 border-b border-neutral-200"><span className="tag">{s.category}</span></td>
                  <td className="px-6 py-3 border-b border-neutral-200 font-bold">{Number(s.basePrice ?? 0).toLocaleString()} FCFA</td>
                  <td className="px-6 py-3 border-b border-neutral-200 text-neutral-600">{s.pricingUnit?.replace('_', ' ')}</td>
                  <td className="px-6 py-3 border-b border-neutral-200 text-neutral-500">{s.estimatedHours || '-'}h</td>
                  <td className="px-6 py-3 border-b border-neutral-200">
                    <span className={`status-pill text-xs ${s.isActive !== false ? 'bg-success-100 text-success-700' : 'bg-neutral-100 text-neutral-500'}`}>
                      {s.isActive !== false ? 'Active' : 'Inactive'}
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
