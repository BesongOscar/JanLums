import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useStops, useRoutes } from '../../hooks/useDelivery';
import { useToast } from '../../components/ui/Toast';

const statusStyles: Record<string, string> = {
  Pending: 'bg-neutral-100 text-neutral-600',
  'In Progress': 'bg-info-100 text-info-700',
  Completed: 'bg-success-100 text-success-700',
};

export default function Stops() {
  const { user } = useAuth();
  const tenantId = user?.tenantId || '';
  const { showToast } = useToast();
  const [routeFilter, setRouteFilter] = useState('All');

  const { data: routes = [] } = useRoutes(tenantId);
  const { data: stops = [], isLoading } = useStops(tenantId);

  const filtered = routeFilter === 'All'
    ? stops
    : stops.filter((s: any) => {
        const route = routes.find((r: any) => r.id === s.routeId);
        return route && (route.name.includes(routeFilter) || route.id === routeFilter);
      });

  return (
    <div>
      <div className="page-chrome">
        <h1 className="page-title">Today's Stops</h1>
      </div>

      <div className="bg-white border border-neutral-200 border-t-0 px-6 py-5 mb-6">
        <div className="flex justify-end gap-3">
          {['All', ...routes.slice(0, 5).map((r: any) => r.name)].map(r => (
            <button key={r} onClick={() => setRouteFilter(r)}
              className={`px-4 py-1.5 rounded text-xs font-bold border-none cursor-pointer ${routeFilter === r ? 'bg-primary text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}>{r}</button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="p-6 text-center text-neutral-500">Loading stops...</div>
      ) : (
        <div className="data-table">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-neutral-50">
                {['Stop ID', 'Route', 'Customer', 'Address', 'Order', 'Status', 'Notes', ''].map(h => (
                  <th key={h} className="px-6 py-3 text-left font-bold text-primary border-b-2 border-neutral-200">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((s: any, i: number) => {
                const route = routes.find((r: any) => r.id === s.routeId);
                return (
                  <tr key={s.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'} hover:bg-primary-50 transition-colors`}>
                    <td className="px-6 py-3 border-b border-neutral-200 font-medium">{s.id.slice(0, 8)}</td>
                    <td className="px-6 py-3 border-b border-neutral-200 text-xs">{route?.name || '\u2014'}</td>
                    <td className="px-6 py-3 border-b border-neutral-200">{s.customerName}</td>
                    <td className="px-6 py-3 border-b border-neutral-200 text-neutral-600 text-xs">{s.address}</td>
                    <td className="px-6 py-3 border-b border-neutral-200">{s.orderId ? s.orderId.slice(0, 8) : '\u2014'}</td>
                    <td className="px-6 py-3 border-b border-neutral-200">
                      <span className={`status-pill text-xs ${statusStyles[s.status] || ''}`}>{s.status}</span>
                    </td>
                    <td className="px-6 py-3 border-b border-neutral-200 text-neutral-500 text-xs max-w-[120px] truncate">{s.notes || '\u2014'}</td>
                    <td className="px-6 py-3 border-b border-neutral-200">
                      {s.status !== 'Completed' && (
                        <button onClick={() => showToast(`Stop ${s.id.slice(0, 8)} marked as delivered`, 'success')}
                          className="px-3 py-1 bg-success text-white rounded text-xs border-none cursor-pointer hover:bg-success-dark">Complete</button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="px-6 py-8 text-center text-neutral-400">No stops found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
