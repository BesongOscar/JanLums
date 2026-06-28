const configs = [
  { id: 'FN-001', name: 'VAT (TVA)', rate: '19.25%', appliesTo: 'All services', type: 'Tax' },
  { id: 'FN-002', name: 'Agent Commission', rate: '2%', appliesTo: 'Counter sales', type: 'Commission' },
  { id: 'FN-003', name: 'Driver Commission', rate: '500 FCFA', appliesTo: 'Per delivery', type: 'Commission' },
  { id: 'FN-004', name: 'Mobile Money', rate: '1.5%', appliesTo: 'Digital payments', type: 'Payment Fee' },
  { id: 'FN-005', name: 'Card Payment', rate: '2.5%', appliesTo: 'Card transactions', type: 'Payment Fee' },
];

const paymentMethods = [
  { method: 'Cash', enabled: true, fee: '0%' },
  { method: 'Mobile Money (MTN)', enabled: true, fee: '1.5%' },
  { method: 'Mobile Money (Orange)', enabled: true, fee: '1.5%' },
  { method: 'Bank Transfer', enabled: false, fee: '0%' },
  { method: 'Card (Visa/MC)', enabled: false, fee: '2.5%' },
];

export default function FinancialSettings() {
  return (
    <div>
      <div className="page-chrome">
        <h1 className="page-title">Financial Settings</h1>
      </div>
      <h3 className="text-base font-bold text-neutral-800 mt-6 mb-3">Tax Rates & Commissions</h3>
      <div className="data-table mb-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-neutral-50">
              {['Name', 'Rate', 'Applies To', 'Type', ''].map(h => (
                <th key={h} className="px-6 py-3 text-left font-bold text-primary border-b-2 border-neutral-200">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {configs.map((c, i) => (
              <tr key={c.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'} hover:bg-primary-50 transition-colors`}>
                <td className="px-6 py-3 border-b border-neutral-200 font-medium">{c.name}</td>
                <td className="px-6 py-3 border-b border-neutral-200 font-bold">{c.rate}</td>
                <td className="px-6 py-3 border-b border-neutral-200 text-xs text-neutral-600">{c.appliesTo}</td>
                <td className="px-6 py-3 border-b border-neutral-200"><span className="text-xs bg-info-100 text-info-700 px-2 py-0.5 rounded">{c.type}</span></td>
                <td className="px-6 py-3 border-b border-neutral-200">
                  <button className="px-3 py-1 border border-primary rounded bg-white text-primary cursor-pointer text-xs hover:bg-primary-50">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="text-base font-bold text-neutral-800 mt-8 mb-3">Payment Methods</h3>
      <div className="data-table">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-neutral-50">
              {['Method', 'Enabled', 'Processing Fee'].map(h => (
                <th key={h} className="px-6 py-3 text-left font-bold text-primary border-b-2 border-neutral-200">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paymentMethods.map((p, i) => (
              <tr key={p.method} className={`${i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'} hover:bg-primary-50 transition-colors`}>
                <td className="px-6 py-3 border-b border-neutral-200 font-medium">{p.method}</td>
                <td className="px-6 py-3 border-b border-neutral-200">
                  <span className={`status-pill text-xs ${p.enabled ? 'bg-success-100 text-success-700' : 'bg-neutral-100 text-neutral-500'}`}>{p.enabled ? 'Yes' : 'No'}</span>
                </td>
                <td className="px-6 py-3 border-b border-neutral-200">{p.fee}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
