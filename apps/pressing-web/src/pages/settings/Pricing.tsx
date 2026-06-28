const rules = [
  { id: 'PR-001', name: 'Standard Per-Kilo', type: 'Per-Kilo', min: 1, max: 999, price: 1500, appliesTo: 'Wash & Fold' },
  { id: 'PR-002', name: 'Bulk Discount 10kg+', type: 'Per-Kilo', min: 10, max: 999, price: 1200, appliesTo: 'Wash & Fold' },
  { id: 'PR-003', name: 'Shirt Standard', type: 'Per-Item', min: 1, max: 999, price: 500, appliesTo: 'Shirt W&I' },
  { id: 'PR-004', name: 'Shirt Bulk (10+)', type: 'Per-Item', min: 10, max: 999, price: 400, appliesTo: 'Shirt W&I' },
  { id: 'PR-005', name: 'Dry Cleaning', type: 'Per-Item', min: 1, max: 999, price: 1500, appliesTo: 'Dry Cleaning' },
];

export default function PricingSettings() {
  return (
    <div>
      <div className="page-chrome">
        <h1 className="page-title">Pricing Settings</h1>
        <button className="px-4 py-2 bg-primary text-white rounded text-sm font-bold border-none cursor-pointer hover:bg-primary-dark">+ Add Rule</button>
      </div>
      <div className="data-table mt-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-neutral-50">
              {['ID', 'Rule Name', 'Type', 'Min Qty', 'Max Qty', 'Price', 'Applies To', ''].map(h => (
                <th key={h} className="px-6 py-3 text-left font-bold text-primary border-b-2 border-neutral-200">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rules.map((r, i) => (
              <tr key={r.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'} hover:bg-primary-50 transition-colors`}>
                <td className="px-6 py-3 border-b border-neutral-200 font-medium">{r.id}</td>
                <td className="px-6 py-3 border-b border-neutral-200">{r.name}</td>
                <td className="px-6 py-3 border-b border-neutral-200"><span className="text-xs bg-info-100 text-info-700 px-2 py-0.5 rounded">{r.type}</span></td>
                <td className="px-6 py-3 border-b border-neutral-200">{r.min}</td>
                <td className="px-6 py-3 border-b border-neutral-200">{r.max === 999 ? '∞' : r.max}</td>
                <td className="px-6 py-3 border-b border-neutral-200 font-bold">{r.price.toLocaleString()} FCFA</td>
                <td className="px-6 py-3 border-b border-neutral-200 text-neutral-600 text-xs">{r.appliesTo}</td>
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
