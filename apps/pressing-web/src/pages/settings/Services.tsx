const services = [
  { id: 'SRV-001', name: 'Wash & Fold (Per Kilo)', type: 'Per-Kilo', turnaround: '48h', basePrice: 1500, active: true },
  { id: 'SRV-002', name: 'Wash & Iron (Per Kilo)', type: 'Per-Kilo', turnaround: '48h', basePrice: 2000, active: true },
  { id: 'SRV-003', name: 'Shirt Wash & Iron', type: 'Per-Item', turnaround: '24h', basePrice: 500, active: true },
  { id: 'SRV-004', name: 'Dry Cleaning', type: 'Per-Item', turnaround: '72h', basePrice: 1500, active: true },
  { id: 'SRV-005', name: 'Express Wash (6hr)', type: 'Per-Kilo', turnaround: '6h', basePrice: 2500, active: true },
  { id: 'SRV-006', name: 'Bulk Corporate', type: 'Flat Rate', turnaround: '48h', basePrice: 20000, active: false },
];

export default function Services() {
  return (
    <div>
      <div className="page-chrome">
        <h1 className="page-title">Services Settings</h1>
      </div>
      <div className="data-table mt-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-neutral-50">
              {['ID', 'Service Name', 'Type', 'Turnaround', 'Base Price', 'Active', ''].map(h => (
                <th key={h} className="px-6 py-3 text-left font-bold text-primary border-b-2 border-neutral-200">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {services.map((s, i) => (
              <tr key={s.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'} hover:bg-primary-50 transition-colors`}>
                <td className="px-6 py-3 border-b border-neutral-200 font-medium">{s.id}</td>
                <td className="px-6 py-3 border-b border-neutral-200 font-medium">{s.name}</td>
                <td className="px-6 py-3 border-b border-neutral-200"><span className="tag">{s.type}</span></td>
                <td className="px-6 py-3 border-b border-neutral-200 text-neutral-500">{s.turnaround}</td>
                <td className="px-6 py-3 border-b border-neutral-200 font-bold">{s.basePrice.toLocaleString()} FCFA</td>
                <td className="px-6 py-3 border-b border-neutral-200">
                  <span className={`status-pill text-xs ${s.active ? 'bg-success-100 text-success-700' : 'bg-neutral-100 text-neutral-500'}`}>{s.active ? 'Active' : 'Inactive'}</span>
                </td>
                <td className="px-6 py-3 border-b border-neutral-200">
                  <button className="px-3 py-1 border border-primary rounded bg-white text-primary cursor-pointer text-xs hover:bg-primary-50">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
