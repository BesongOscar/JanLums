const zones = [
  { id: 'ZN-001', name: 'Zone A — Bastos', coverage: 'Bastos, Nlongkak, Mvog Ada', fee: 0, minOrder: 5000, estimatedTime: '30-45 min' },
  { id: 'ZN-002', name: 'Zone B — Centre', coverage: 'Centre Ville, Montée', fee: 500, minOrder: 5000, estimatedTime: '20-30 min' },
  { id: 'ZN-003', name: 'Zone C — Suburbs', coverage: 'Mfandena, Nsam, Mvan', fee: 1000, minOrder: 5000, estimatedTime: '45-60 min' },
];

const vehicleTypes = [
  { id: 'VT-001', name: 'Van', capacity: '500 kg', maxRoutes: 3, fuelType: 'Diesel', maintenanceInterval: '5,000 km' },
  { id: 'VT-002', name: 'Motorcycle', capacity: '50 kg', maxRoutes: 6, fuelType: 'Gasoline', maintenanceInterval: '3,000 km' },
  { id: 'VT-003', name: 'Truck', capacity: '2000 kg', maxRoutes: 1, fuelType: 'Diesel', maintenanceInterval: '10,000 km' },
];

export default function DeliverySettings() {
  return (
    <div>
      <div className="page-chrome">
        <h1 className="page-title">Delivery Settings</h1>
      </div>
      <h3 className="text-base font-bold text-neutral-800 mt-6 mb-3">Delivery Zones</h3>
      <div className="data-table mb-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-neutral-50">
              {['Zone', 'Coverage Area', 'Delivery Fee', 'Min Order', 'Est. Time', ''].map(h => (
                <th key={h} className="px-6 py-3 text-left font-bold text-primary border-b-2 border-neutral-200">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {zones.map((z, i) => (
              <tr key={z.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'} hover:bg-primary-50 transition-colors`}>
                <td className="px-6 py-3 border-b border-neutral-200 font-medium">{z.name}</td>
                <td className="px-6 py-3 border-b border-neutral-200 text-xs text-neutral-600">{z.coverage}</td>
                <td className="px-6 py-3 border-b border-neutral-200 font-bold">{z.fee === 0 ? 'Free' : `${z.fee.toLocaleString()} FCFA`}</td>
                <td className="px-6 py-3 border-b border-neutral-200">{z.minOrder.toLocaleString()} FCFA</td>
                <td className="px-6 py-3 border-b border-neutral-200 text-neutral-500">{z.estimatedTime}</td>
                <td className="px-6 py-3 border-b border-neutral-200">
                  <button className="px-3 py-1 border border-primary rounded bg-white text-primary cursor-pointer text-xs hover:bg-primary-50">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="text-base font-bold text-neutral-800 mt-8 mb-3">Vehicle Types</h3>
      <div className="data-table">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-neutral-50">
              {['Type', 'Capacity', 'Max Routes', 'Fuel Type', 'Maintenance Interval', ''].map(h => (
                <th key={h} className="px-6 py-3 text-left font-bold text-primary border-b-2 border-neutral-200">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {vehicleTypes.map((v, i) => (
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
