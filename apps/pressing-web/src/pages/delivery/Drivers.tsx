import { useAuth } from '../../contexts/AuthContext';
import { useDrivers } from '../../hooks/useDelivery';

export default function Drivers() {
  const { user } = useAuth();
  const tenantId = user?.tenantId || '';

  const { data: drivers = [], isLoading } = useDrivers(tenantId);

  return (
    <div>
      <div className="page-chrome">
        <h1 className="page-title">Delivery Drivers</h1>
      </div>

      {isLoading ? (
        <div className="p-6 text-center text-neutral-500">Loading drivers...</div>
      ) : (
        <div className="data-table mt-6">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-neutral-50">
                {['ID', 'Name', 'Phone', 'License', 'Status'].map(h => (
                  <th key={h} className="px-6 py-3 text-left font-bold text-primary border-b-2 border-neutral-200">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {drivers.map((d: any, i: number) => (
                <tr key={d.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'} hover:bg-primary-50 transition-colors`}>
                  <td className="px-6 py-3 border-b border-neutral-200 font-medium">{d.id.slice(0, 8)}</td>
                  <td className="px-6 py-3 border-b border-neutral-200 font-medium">{d.firstName} {d.lastName}</td>
                  <td className="px-6 py-3 border-b border-neutral-200 text-neutral-600">{d.phone}</td>
                  <td className="px-6 py-3 border-b border-neutral-200 text-xs font-mono">{d.licenseNumber}</td>
                  <td className="px-6 py-3 border-b border-neutral-200">
                    <span className={`status-pill text-xs ${d.isActive ? 'bg-success-100 text-success-700' : 'bg-neutral-100 text-neutral-600'}`}>
                      {d.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
              {drivers.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-neutral-400">No drivers found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
