const types = [
  { id: 'ST-001', name: 'Wash & Fold', unit: 'Per Kilo', price: 1500, minCharge: 3000, sortOrder: 1 },
  { id: 'ST-002', name: 'Wash & Iron', unit: 'Per Kilo', price: 2000, minCharge: 4000, sortOrder: 2 },
  { id: 'ST-003', name: 'Dry Cleaning', unit: 'Per Item', price: 1500, minCharge: 3000, sortOrder: 3 },
  { id: 'ST-004', name: 'Express', unit: 'Per Kilo', price: 2500, minCharge: 5000, sortOrder: 4 },
];

export default function ServiceTypes() {
  return (
    <div>
      <div className="data-table mt-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-neutral-50">
              {['ID', 'Name', 'Unit', 'Unit Price', 'Min Charge', 'Sort Order', ''].map(h => (
                <th key={h} className="px-6 py-3 text-left font-bold text-primary border-b-2 border-neutral-200">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {types.map((t, i) => (
              <tr key={t.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'} hover:bg-primary-50 transition-colors`}>
                <td className="px-6 py-3 border-b border-neutral-200 font-medium">{t.id}</td>
                <td className="px-6 py-3 border-b border-neutral-200 font-medium">{t.name}</td>
                <td className="px-6 py-3 border-b border-neutral-200">{t.unit}</td>
                <td className="px-6 py-3 border-b border-neutral-200 font-bold">{t.price.toLocaleString()} FCFA</td>
                <td className="px-6 py-3 border-b border-neutral-200">{t.minCharge.toLocaleString()} FCFA</td>
                <td className="px-6 py-3 border-b border-neutral-200">{t.sortOrder}</td>
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
