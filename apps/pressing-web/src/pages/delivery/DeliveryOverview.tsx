import { useAuth } from '../../contexts/AuthContext';
import { useRoutes, useVehicles, useDrivers } from '../../hooks/useDelivery';

const statusStyles: Record<string, string> = {
  Completed: 'bg-success-100 text-success-700',
  'In Progress': 'bg-info-100 text-info-700',
  Pending: 'bg-neutral-100 text-neutral-600',
};

export default function DeliveryOverview() {
  const { user } = useAuth();
  const tenantId = user?.tenantId || '';

  const { data: routes = [], isLoading: routesLoading } = useRoutes(tenantId);
  const { data: vehicles = [] } = useVehicles(tenantId);
  const { data: drivers = [] } = useDrivers(tenantId);

  const activeRoutes = routes.filter((r: any) => r.status === 'Active');
  const inProgressRoutes = activeRoutes.filter((r: any) => r.status === 'In Progress');
  const availableVehicles = vehicles.filter((v: any) => v.status === 'Available');
  const onDutyDrivers = drivers.filter((d: any) => d.isActive);

  const stats = [
    { label: 'Active Routes', value: String(activeRoutes.length), icon: '\uD83D\uDEE4\uFE0F' },
    { label: 'Pending Deliveries', value: String(inProgressRoutes.length), icon: '\uD83D\uDCE6' },
    { label: 'Vehicles Available', value: `${availableVehicles.length}/${vehicles.length}`, icon: '\uD83D\uDE9A' },
    { label: 'Drivers on Duty', value: `${onDutyDrivers.length}/${drivers.length}`, icon: '\uD83D\uDC68\u200D\uD83D\uDE80' },
  ];

  return (
    <div>
      <div className="page-chrome">
        <h1 className="page-title">Delivery Overview</h1>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-primary text-white rounded text-sm font-bold border-none cursor-pointer hover:bg-primary-dark">Schedule Delivery</button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 my-6">
        {stats.map(s => (
          <div key={s.label} className="bg-white border border-neutral-200 rounded p-4 shadow-sm">
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className="text-neutral-500 text-xs mb-1">{s.label}</div>
            <div className="text-2xl font-bold text-neutral-900">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-neutral-200 rounded shadow-sm">
        <div className="px-6 py-4 border-b border-neutral-200">
          <h2 className="text-base font-bold text-neutral-800">Today's Routes</h2>
        </div>
        {routesLoading ? (
          <div className="p-6 text-center text-neutral-500">Loading routes...</div>
        ) : (
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-neutral-50">
                {['Route', 'Driver', 'Vehicle', 'Stops', 'Status', 'ETA'].map(h => (
                  <th key={h} className="px-6 py-3 text-left font-bold text-primary border-b-2 border-neutral-200">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {routes.slice(0, 10).map((r: any, i: number) => (
                <tr key={r.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'} hover:bg-primary-50 transition-colors`}>
                  <td className="px-6 py-3 border-b border-neutral-200 font-medium">{r.name}</td>
                  <td className="px-6 py-3 border-b border-neutral-200">{r.driverName || '\u2014'}</td>
                  <td className="px-6 py-3 border-b border-neutral-200 text-neutral-600">{r.vehicleName || '\u2014'}</td>
                  <td className="px-6 py-3 border-b border-neutral-200">{r.stopCount || '\u2014'}</td>
                  <td className="px-6 py-3 border-b border-neutral-200">
                    <span className={`status-pill text-xs ${statusStyles[r.status] || ''}`}>{r.status}</span>
                  </td>
                  <td className="px-6 py-3 border-b border-neutral-200 text-neutral-500">{r.scheduledDate ? new Date(r.scheduledDate).toLocaleDateString() : '\u2014'}</td>
                </tr>
              ))}
              {routes.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-neutral-400">No routes found</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
