import { useAuth } from '../../contexts/AuthContext';
import { useVehicles } from '../../hooks/useDelivery';

const statusStyles: Record<string, string> = {
  Available: 'bg-success-100 text-success-700',
  'On Route': 'bg-info-100 text-info-700',
  Maintenance: 'bg-warning-100 text-warning-700',
};

export default function Vehicles() {
  const { user } = useAuth();
  const tenantId = user?.tenantId || '';

  const { data: vehicles = [], isLoading } = useVehicles(tenantId);

  return (
    <div>
      <div className="page-chrome">
        <h1 className="page-title">Delivery Vehicles</h1>
      </div>

      {isLoading ? (
        <div className="p-6 text-center text-neutral-500">Loading vehicles...</div>
      ) : (
        <div className="data-table mt-6">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-neutral-50">
                {['ID', 'Type', 'Plate', 'Model', 'Year', 'Status', 'Insurance Exp', 'Last Maintenance'].map(h => (
                  <th key={h} className="px-6 py-3 text-left font-bold text-primary border-b-2 border-neutral-200">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v: any, i: number) => (
                <tr key={v.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'} hover:bg-primary-50 transition-colors`}>
                  <td className="px-6 py-3 border-b border-neutral-200 font-medium">{v.name}</td>
                  <td className="px-6 py-3 border-b border-neutral-200">{v.type}</td>
                  <td className="px-6 py-3 border-b border-neutral-200 font-mono">{v.plateNumber}</td>
                  <td className="px-6 py-3 border-b border-neutral-200">{v.model || '\u2014'}</td>
                  <td className="px-6 py-3 border-b border-neutral-200">{v.year || '\u2014'}</td>
                  <td className="px-6 py-3 border-b border-neutral-200">
                    <span className={`status-pill text-xs ${statusStyles[v.status] || ''}`}>{v.status}</span>
                  </td>
                  <td className="px-6 py-3 border-b border-neutral-200 text-neutral-500">
                    {v.insuranceExpiry ? new Date(v.insuranceExpiry).toLocaleDateString() : '\u2014'}
                  </td>
                  <td className="px-6 py-3 border-b border-neutral-200 text-neutral-500">
                    {v.lastMaintenance ? new Date(v.lastMaintenance).toLocaleDateString() : '\u2014'}
                  </td>
                </tr>
              ))}
              {vehicles.length === 0 && (
                <tr><td colSpan={8} className="px-6 py-8 text-center text-neutral-400">No vehicles found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
