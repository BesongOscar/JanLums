import { useAuth } from '../../contexts/AuthContext';
import { useGarmentTypes } from '../../hooks/useSettings';
import { LoadingState } from '../../components/ui/States';

export default function GarmentTypes() {
  const { user } = useAuth();
  const tenantId = user?.tenantId || '';
  const { data, isLoading } = useGarmentTypes(tenantId);
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
        <h1 className="page-title">Garment Types</h1>
      </div>
      <div className="data-table mt-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-neutral-50">
              {['ID', 'Name', 'Category', 'Default Service', 'Care Instructions', 'Avg Price', ''].map(h => (
                <th key={h} className="px-6 py-3 text-left font-bold text-primary border-b-2 border-neutral-200">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {list.length === 0 ? (
              <tr><td colSpan={7} className="text-center text-sm text-neutral-400 py-12">No garment types yet</td></tr>
            ) : (
              list.map((g: any, i: number) => (
                <tr key={g.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'} hover:bg-primary-50 transition-colors`}>
                  <td className="px-6 py-3 border-b border-neutral-200 font-medium">{g.id?.slice(0, 8)}</td>
                  <td className="px-6 py-3 border-b border-neutral-200 font-medium">{g.name}</td>
                  <td className="px-6 py-3 border-b border-neutral-200"><span className="text-xs bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded">{g.category}</span></td>
                  <td className="px-6 py-3 border-b border-neutral-200 text-xs text-info">{g.defaultService}</td>
                  <td className="px-6 py-3 border-b border-neutral-200 text-xs text-neutral-500 max-w-[250px]">{g.careInstructions || '—'}</td>
                  <td className="px-6 py-3 border-b border-neutral-200 font-bold">{g.avgPrice.toLocaleString()} FCFA</td>
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
