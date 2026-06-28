const vehicleTypes = [
  { id: 'VT-001', name: 'Van', capacity: '500 kg', maxRoutes: 3, fuelType: 'Diesel', maintenanceInterval: '5,000 km' },
  { id: 'VT-002', name: 'Motorcycle', capacity: '50 kg', maxRoutes: 6, fuelType: 'Gasoline', maintenanceInterval: '3,000 km' },
  { id: 'VT-003', name: 'Truck', capacity: '2000 kg', maxRoutes: 1, fuelType: 'Diesel', maintenanceInterval: '10,000 km' },
];

export default function VehicleTypes() {
  return (
    <div>
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
