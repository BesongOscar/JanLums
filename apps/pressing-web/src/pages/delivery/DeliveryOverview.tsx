const stats = [
  { label: 'Active Routes', value: '3', icon: '\uD83D\uDEE4\uFE0F' },
  { label: 'Pending Deliveries', value: '12', icon: '\uD83D\uDCE6' },
  { label: 'Vehicles Available', value: '2/4', icon: '\uD83D\uDE9A' },
  { label: 'Drivers on Duty', value: '3/5', icon: '\uD83D\uDC68\u200D\uD83D\uDE80' },
];

const activeRoutes = [
  { id: 'RT-001', name: 'Route A — Yaounde Centre', driver: 'Paul Biya', vehicle: 'Van-001', stops: 4, completed: 4, status: 'Completed', eta: '—' },
  { id: 'RT-002', name: 'Route B — Mvog-Mbi', driver: 'John Takam', vehicle: 'Truck-002', stops: 5, completed: 3, status: 'In Progress', eta: '1.5 hrs' },
  { id: 'RT-003', name: 'Route C — Bastos', driver: 'Samuel Nkwi', vehicle: 'Van-002', stops: 3, completed: 0, status: 'Pending', eta: '—' },
];

const statusStyles: Record<string, string> = {
  Completed: 'bg-success-100 text-success-700',
  'In Progress': 'bg-info-100 text-info-700',
  Pending: 'bg-neutral-100 text-neutral-600',
};

export default function DeliveryOverview() {
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
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-neutral-50">
              {['Route', 'Driver', 'Vehicle', 'Stops', 'Completed', 'Status', 'ETA'].map(h => (
                <th key={h} className="px-6 py-3 text-left font-bold text-primary border-b-2 border-neutral-200">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {activeRoutes.map((r, i) => (
              <tr key={r.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'} hover:bg-primary-50 transition-colors`}>
                <td className="px-6 py-3 border-b border-neutral-200 font-medium">{r.name}</td>
                <td className="px-6 py-3 border-b border-neutral-200">{r.driver}</td>
                <td className="px-6 py-3 border-b border-neutral-200 text-neutral-600">{r.vehicle}</td>
                <td className="px-6 py-3 border-b border-neutral-200">{r.stops}</td>
                <td className="px-6 py-3 border-b border-neutral-200">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                      <div className="h-full bg-success rounded-full" style={{ width: `${(r.completed / r.stops) * 100}%` }} />
                    </div>
                    <span className="text-xs text-neutral-500">{r.completed}/{r.stops}</span>
                  </div>
                </td>
                <td className="px-6 py-3 border-b border-neutral-200">
                  <span className={`status-pill text-xs ${statusStyles[r.status]}`}>{r.status}</span>
                </td>
                <td className="px-6 py-3 border-b border-neutral-200 text-neutral-500">{r.eta || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
