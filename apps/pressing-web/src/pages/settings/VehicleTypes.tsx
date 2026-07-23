import { useAuth } from '../../contexts/AuthContext';
import { useVehicleTypes } from '../../hooks/useSettings';
import { LoadingState } from '../../components/ui/States';

export default function VehicleTypes() {
  const { user } = useAuth();
  const tenantId = user?.tenantId || '';
  const { data, isLoading } = useVehicleTypes(tenantId);
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
        <h1 className="page-title">Vehicle Types</h1>
      </div>
      <div className="data-table mt-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-neutral-50">
              {['Type', 'Capacity', 'Max Routes', 'Fuel Type', 'Maintenance Interval', ''].map(h => (
                <th key={h} className="px-6 py-3 text-left font-bold text-primary border-b-2 border-neutral-200">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {list.length === 0 ? (
              <tr><td colSpan={6} className="text-center text-sm text-neutral-400 py-12">No vehicle types yet</td></tr>
            ) : (
              list.map((v: any, i: number) => (
                <tr key={v.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'} hover:bg-primary-50 transition-colors`}>
                  <td className="px-6 py-3 border-b border-neutral-200 font-medium">{v.name}</td>
                  <td className="px-6 py-3 border-b border-neutral-200">{v.capacity}</td>
                  <td className="px-6 py-3 border-b border-neutral-200">{v.maxRoutes}</td>
                  <td className="px-6 py-3 border-b border-neutral-200">{v.fuelType}</td>
                  <td className="px-6 py-3 border-b border-neutral-200 text-neutral-500">{v.maintenanceInterval}</td>
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
