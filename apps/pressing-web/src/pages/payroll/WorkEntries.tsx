import { useState } from 'react';

const entries = [
  { id: 'WE-001', employee: 'Alice Nkwi', role: 'Counter Agent', date: '2024-01-15', regular: 7.5, overtime: 0, holiday: 0, total: 7.5, amount: 15000 },
  { id: 'WE-002', employee: 'David Kamga', role: 'Washer', date: '2024-01-15', regular: 7.0, overtime: 1.5, holiday: 0, total: 8.5, amount: 21250 },
  { id: 'WE-003', employee: 'Emma Biya', role: 'Presser', date: '2024-01-15', regular: 7.5, overtime: 0, holiday: 0, total: 7.5, amount: 15000 },
  { id: 'WE-004', employee: 'Paul Ebode', role: 'QC Inspector', date: '2024-01-15', regular: 0, overtime: 0, holiday: 0, total: 0, amount: 0 },
  { id: 'WE-005', employee: 'Sarah Mengue', role: 'Branch Manager', date: '2024-01-15', regular: 8.0, overtime: 0.5, holiday: 0, total: 8.5, amount: 21250 },
  { id: 'WE-006', employee: 'John Takam', role: 'Driver', date: '2024-01-15', regular: 0, overtime: 0, holiday: 0, total: 0, amount: 0 },
];

export default function WorkEntries() {
  const [period, setPeriod] = useState('January 2024');

  return (
    <div>
      <div className="page-chrome">
        <h1 className="page-title">Work Entries</h1>
        <select value={period} onChange={e => setPeriod(e.target.value)}
          className="px-3 py-2 border border-neutral-300 rounded text-sm">
          <option>January 2024</option>
          <option>December 2023</option>
          <option>November 2023</option>
        </select>
      </div>

      <div className="data-table mt-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-neutral-50">
              {['Employee', 'Role', 'Date', 'Regular (h)', 'Overtime (h)', 'Holiday (h)', 'Total (h)', 'Amount'].map(h => (
                <th key={h} className="px-6 py-3 text-left font-bold text-primary border-b-2 border-neutral-200">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {entries.map((e, i) => (
              <tr key={e.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'} hover:bg-primary-50 transition-colors`}>
                <td className="px-6 py-3 border-b border-neutral-200 font-medium">{e.employee}</td>
                <td className="px-6 py-3 border-b border-neutral-200 text-neutral-600">{e.role}</td>
                <td className="px-6 py-3 border-b border-neutral-200 text-neutral-500">{e.date}</td>
                <td className="px-6 py-3 border-b border-neutral-200">{e.regular}</td>
                <td className="px-6 py-3 border-b border-neutral-200">
                  {e.overtime > 0 ? <span className="text-warning font-bold">{e.overtime}</span> : e.overtime}
                </td>
                <td className="px-6 py-3 border-b border-neutral-200">{e.holiday}</td>
                <td className="px-6 py-3 border-b border-neutral-200 font-bold">{e.total}</td>
                <td className="px-6 py-3 border-b border-neutral-200">{e.amount.toLocaleString()} FCFA</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-6 py-4 border-t border-neutral-200 flex justify-between text-sm font-bold">
          <span>Total Hours: {entries.reduce((s, e) => s + e.total, 0)}h</span>
          <span className="text-primary">Total: {entries.reduce((s, e) => s + e.amount, 0).toLocaleString()} FCFA</span>
        </div>
      </div>
    </div>
  );
}
