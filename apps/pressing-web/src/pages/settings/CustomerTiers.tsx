const tiers = [
  { id: 'T-001', name: 'Standard', minSpend: 0, discount: 0, color: '#6b7280' },
  { id: 'T-002', name: 'Silver', minSpend: 50000, discount: 5, color: '#9ca3af' },
  { id: 'T-003', name: 'Gold', minSpend: 150000, discount: 10, color: '#f59e0b' },
  { id: 'T-004', name: 'Platinum', minSpend: 500000, discount: 15, color: '#6366f1' },
];

export default function CustomerTiers() {
  return (
    <div>
      <div className="data-table mt-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-neutral-50">
              {['Tier', 'Min Lifetime Spend', 'Discount %', ''].map(h => (
                <th key={h} className="px-6 py-3 text-left font-bold text-primary border-b-2 border-neutral-200">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tiers.map((t, i) => (
              <tr key={t.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'} hover:bg-primary-50 transition-colors`}>
                <td className="px-6 py-3 border-b border-neutral-200 font-medium flex items-center gap-2">
                  <span className="inline-block w-3 h-3 rounded-full" style={{backgroundColor: t.color}} />
                  {t.name}
                </td>
                <td className="px-6 py-3 border-b border-neutral-200 font-bold">{t.minSpend.toLocaleString()} FCFA</td>
                <td className="px-6 py-3 border-b border-neutral-200">{t.discount}%</td>
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
