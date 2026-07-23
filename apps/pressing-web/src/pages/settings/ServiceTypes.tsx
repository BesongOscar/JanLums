import { useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useServices } from '../../hooks/useServices';
import { LoadingState } from '../../components/ui/States';

export default function ServiceTypes() {
  const { user } = useAuth();
  const tenantId = user?.tenantId || '';
  const { data: services, isLoading } = useServices(tenantId);

  const categories = useMemo(() => {
    const list = Array.isArray(services) ? services : [];
    const map = new Map<string, { count: number; minPrice: number; avgPrice: number }>();
    list.forEach((s: any) => {
      const cat = s.category || 'Other';
      const existing = map.get(cat) || { count: 0, minPrice: Infinity, avgPrice: 0 };
      existing.count++;
      existing.minPrice = Math.min(existing.minPrice, Number(s.basePrice ?? 0));
      existing.avgPrice = existing.count === 1 ? Number(s.basePrice ?? 0) : (existing.avgPrice + Number(s.basePrice ?? 0));
      map.set(cat, existing);
    });
    map.forEach((v) => { v.avgPrice = Math.round(v.avgPrice / v.count); });
    return Array.from(map.entries()).map(([name, stats]) => ({
      name, count: stats.count, minPrice: stats.minPrice, avgPrice: stats.avgPrice,
    }));
  }, [services]);

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
        <h1 className="page-title">Service Categories</h1>
      </div>
      <div className="data-table mt-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-neutral-50">
              {['Category', 'Services', 'Min Price', 'Avg Price', ''].map(h => (
                <th key={h} className="px-6 py-3 text-left font-bold text-primary border-b-2 border-neutral-200">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-sm text-neutral-400">No service categories yet</td>
              </tr>
            ) : (
              categories.map((c: any, i: number) => (
                <tr key={c.name} className={`${i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'} hover:bg-primary-50 transition-colors`}>
                  <td className="px-6 py-3 border-b border-neutral-200 font-medium">{c.name}</td>
                  <td className="px-6 py-3 border-b border-neutral-200">{c.count}</td>
                  <td className="px-6 py-3 border-b border-neutral-200 font-bold">{c.minPrice.toLocaleString()} FCFA</td>
                  <td className="px-6 py-3 border-b border-neutral-200">{c.avgPrice.toLocaleString()} FCFA</td>
                  <td className="px-6 py-3 border-b border-neutral-200">
                    <button className="px-3 py-1 border border-primary rounded bg-white text-primary cursor-pointer text-xs hover:bg-primary-50">View Services</button>
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
