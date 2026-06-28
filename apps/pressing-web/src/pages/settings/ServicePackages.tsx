const packages = [
  { id: 'PKG-001', name: 'Starter', services: 'Wash & Fold (5kg)', price: 7500, savings: 0, popular: false },
  { id: 'PKG-002', name: 'Standard', services: 'Wash & Fold (10kg) + 2 Shirts W&I', price: 16000, savings: 10, popular: true },
  { id: 'PKG-003', name: 'Premium', services: 'Wash & Fold (15kg) + 5 Shirts W&I + 2 Dry Clean', price: 28000, savings: 15, popular: false },
  { id: 'PKG-004', name: 'Corporate', services: 'Wash & Fold (50kg) + 20 Shirts W&I + 10 Dry Clean', price: 85000, savings: 20, popular: false },
];

export default function ServicePackages() {
  return (
    <div>
      <div className="data-table mt-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-neutral-50">
              {['ID', 'Package Name', 'Services Included', 'Price', 'Savings', '', ''].map(h => (
                <th key={h} className="px-6 py-3 text-left font-bold text-primary border-b-2 border-neutral-200">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {packages.map((p, i) => (
              <tr key={p.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'} hover:bg-primary-50 transition-colors`}>
                <td className="px-6 py-3 border-b border-neutral-200 font-medium">{p.id}</td>
                <td className="px-6 py-3 border-b border-neutral-200 font-medium">
                  {p.popular && <span className="text-xs bg-warning-100 text-warning-700 px-2 py-0.5 rounded mr-2">Popular</span>}
                  {p.name}
                </td>
                <td className="px-6 py-3 border-b border-neutral-200 text-neutral-600 text-xs">{p.services}</td>
                <td className="px-6 py-3 border-b border-neutral-200 font-bold">{p.price.toLocaleString()} FCFA</td>
                <td className="px-6 py-3 border-b border-neutral-200"><span className="text-success text-xs">{p.savings > 0 ? `${p.savings}% off` : '—'}</span></td>
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
