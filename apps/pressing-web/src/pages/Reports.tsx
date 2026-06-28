import { useState } from 'react';

const revenue = [
  { period: 'Jan 21-27', revenue: 485000, orders: 142, avgOrder: 3415, services: 198, labor: 120000, margin: 42 },
  { period: 'Jan 14-20', revenue: 512000, orders: 148, avgOrder: 3459, services: 205, labor: 125000, margin: 43 },
  { period: 'Jan 7-13', revenue: 468000, orders: 135, avgOrder: 3467, services: 189, labor: 118000, margin: 41 },
  { period: 'Dec 31-Jan 6', revenue: 395000, orders: 112, avgOrder: 3527, services: 158, labor: 105000, margin: 40 },
];

const topServices = [
  { name: 'Wash & Fold (Per Kilo)', orders: 284, revenue: 426000, share: 24 },
  { name: 'Shirt W&I', orders: 198, revenue: 99000, share: 18 },
  { name: 'Wash & Iron (Per Kilo)', orders: 156, revenue: 312000, share: 17 },
  { name: 'Dry Cleaning', orders: 98, revenue: 147000, share: 8 },
  { name: 'Bulk Corporate', orders: 12, revenue: 240000, share: 6 },
];

export default function Reports() {
  const [reportTab, setReportTab] = useState('revenue');
  const [period, setPeriod] = useState('weekly');

  return (
    <div>
      <div className="page-chrome">
        <h1 className="page-title">Reports & Analytics</h1>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-primary rounded bg-white text-primary text-sm cursor-pointer hover:bg-primary-50">Export Excel</button>
          <button className="px-4 py-2 border border-primary rounded bg-white text-primary text-sm cursor-pointer hover:bg-primary-50">Export PDF</button>
        </div>
      </div>

      <div className="bg-white border border-neutral-200 border-t-0 px-6 py-5 mb-6">
        <div className="flex justify-between items-center">
          <div className="flex gap-3">
            {['revenue', 'services', 'customers', 'productivity', 'inventory', 'delivery'].map(t => (
              <button key={t} onClick={() => setReportTab(t)}
                className={`px-4 py-1.5 rounded text-xs font-bold border-none cursor-pointer capitalize ${reportTab === t ? 'bg-primary text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}>{t}</button>
            ))}
          </div>
          <select value={period} onChange={e => setPeriod(e.target.value)}
            className="px-3 py-1.5 border border-neutral-300 rounded text-xs">
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
      </div>

      {reportTab === 'revenue' && (
        <>
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total Revenue (Week)', value: '1,860,000 FCFA', color: 'text-primary' },
              { label: 'Total Orders', value: '537', color: 'text-success' },
              { label: 'Avg Order Value', value: '3,464 FCFA', color: 'text-warning' },
              { label: 'Avg Margin', value: '41.5%', color: 'text-info' },
            ].map(s => (
              <div key={s.label} className="bg-white border border-neutral-200 rounded p-5 shadow-sm">
                <div className="text-xs text-neutral-500 mb-1">{s.label}</div>
                <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              </div>
            ))}
          </div>

          <div className="data-table">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-neutral-50">
                  {['Period', 'Revenue', 'Orders', 'Avg Order', 'Services Rendered', 'Labor Cost', 'Margin %'].map(h => (
                    <th key={h} className="px-6 py-3 text-left font-bold text-primary border-b-2 border-neutral-200">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {revenue.map((r, i) => (
                  <tr key={r.period} className={`${i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'} hover:bg-primary-50 transition-colors`}>
                    <td className="px-6 py-3 border-b border-neutral-200 font-medium">{r.period}</td>
                    <td className="px-6 py-3 border-b border-neutral-200 font-bold text-primary">{r.revenue.toLocaleString()} FCFA</td>
                    <td className="px-6 py-3 border-b border-neutral-200">{r.orders}</td>
                    <td className="px-6 py-3 border-b border-neutral-200">{r.avgOrder.toLocaleString()} FCFA</td>
                    <td className="px-6 py-3 border-b border-neutral-200">{r.services}</td>
                    <td className="px-6 py-3 border-b border-neutral-200">{r.labor.toLocaleString()} FCFA</td>
                    <td className="px-6 py-3 border-b border-neutral-200">
                      <span className="text-success font-bold">{r.margin}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {reportTab === 'services' && (
        <div className="data-table">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-neutral-50">
                {['Service', 'Orders', 'Revenue', 'Share %'].map(h => (
                  <th key={h} className="px-6 py-3 text-left font-bold text-primary border-b-2 border-neutral-200">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {topServices.map((s, i) => (
                <tr key={s.name} className={`${i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'} hover:bg-primary-50 transition-colors`}>
                  <td className="px-6 py-3 border-b border-neutral-200 font-medium">{s.name}</td>
                  <td className="px-6 py-3 border-b border-neutral-200">{s.orders}</td>
                  <td className="px-6 py-3 border-b border-neutral-200 font-bold">{s.revenue.toLocaleString()} FCFA</td>
                  <td className="px-6 py-3 border-b border-neutral-200">
                    <div className="flex items-center gap-2">
                      <div className="h-2 bg-primary-100 rounded-full w-24">
                        <div className="h-2 bg-primary rounded-full" style={{width: `${s.share}%`}} />
                      </div>
                      <span className="text-xs text-neutral-500">{s.share}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {reportTab === 'customers' && (
        <div className="bg-white border border-neutral-200 rounded p-6 shadow-sm text-center text-neutral-400">
          <p className="text-lg font-medium">Customer Analytics — Coming Soon</p>
        </div>
      )}

      {reportTab === 'productivity' && (
        <div className="bg-white border border-neutral-200 rounded p-6 shadow-sm text-center text-neutral-400">
          <p className="text-lg font-medium">Employee Productivity — Coming Soon</p>
        </div>
      )}

      {reportTab === 'inventory' && (
        <div className="bg-white border border-neutral-200 rounded p-6 shadow-sm text-center text-neutral-400">
          <p className="text-lg font-medium">Inventory Usage — Coming Soon</p>
        </div>
      )}

      {reportTab === 'delivery' && (
        <div className="bg-white border border-neutral-200 rounded p-6 shadow-sm text-center text-neutral-400">
          <p className="text-lg font-medium">Delivery Performance — Coming Soon</p>
        </div>
      )}
    </div>
  );
}
