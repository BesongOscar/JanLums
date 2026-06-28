import { useState } from 'react';
import { useToast } from '../../components/ui/Toast';

const payslips = [
  { id: 'PS-001', employee: 'Alice Nkwi', role: 'Counter Agent', period: 'December 2023', gross: 350000, deductions: 35000, net: 315000, status: 'Paid', date: '2024-01-05' },
  { id: 'PS-002', employee: 'David Kamga', role: 'Washer', period: 'December 2023', gross: 400000, deductions: 40000, net: 360000, status: 'Paid', date: '2024-01-05' },
  { id: 'PS-003', employee: 'Emma Biya', role: 'Presser', period: 'December 2023', gross: 350000, deductions: 35000, net: 315000, status: 'Paid', date: '2024-01-05' },
  { id: 'PS-004', employee: 'Paul Ebode', role: 'QC Inspector', period: 'December 2023', gross: 380000, deductions: 38000, net: 342000, status: 'Paid', date: '2024-01-05' },
  { id: 'PS-005', employee: 'Sarah Mengue', role: 'Branch Manager', period: 'December 2023', gross: 600000, deductions: 75000, net: 525000, status: 'Paid', date: '2024-01-05' },
  { id: 'PS-006', employee: 'John Takam', role: 'Driver', period: 'December 2023', gross: 300000, deductions: 30000, net: 270000, status: 'Paid', date: '2024-01-05' },
];

const statusStyles: Record<string, string> = {
  Paid: 'bg-success-100 text-success-700',
  Pending: 'bg-warning-100 text-warning-700',
};

export default function Payslips() {
  const { showToast } = useToast();
  const [period, setPeriod] = useState('December 2023');

  return (
    <div>
      <div className="page-chrome">
        <h1 className="page-title">Payslips</h1>
        <select value={period} onChange={e => setPeriod(e.target.value)}
          className="px-3 py-2 border border-neutral-300 rounded text-sm">
          <option>December 2023</option>
          <option>November 2023</option>
        </select>
      </div>

      <div className="data-table mt-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-neutral-50">
              {['Employee', 'Role', 'Gross', 'Deductions', 'Net Pay', 'Status', 'Paid Date', ''].map(h => (
                <th key={h} className="px-6 py-3 text-left font-bold text-primary border-b-2 border-neutral-200">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {payslips.map((p, i) => (
              <tr key={p.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'} hover:bg-primary-50 transition-colors`}>
                <td className="px-6 py-3 border-b border-neutral-200 font-medium">{p.employee}</td>
                <td className="px-6 py-3 border-b border-neutral-200 text-neutral-600">{p.role}</td>
                <td className="px-6 py-3 border-b border-neutral-200">{p.gross.toLocaleString()} FCFA</td>
                <td className="px-6 py-3 border-b border-neutral-200 text-danger">{p.deductions.toLocaleString()} FCFA</td>
                <td className="px-6 py-3 border-b border-neutral-200 font-bold text-primary">{p.net.toLocaleString()} FCFA</td>
                <td className="px-6 py-3 border-b border-neutral-200">
                  <span className={`status-pill text-xs ${statusStyles[p.status]}`}>{p.status}</span>
                </td>
                <td className="px-6 py-3 border-b border-neutral-200 text-neutral-500">{p.date}</td>
                <td className="px-6 py-3 border-b border-neutral-200">
                  <button onClick={() => showToast(`Downloading PDF for ${p.employee}`, 'success')}
                    className="px-3 py-1 border border-primary rounded bg-white text-primary cursor-pointer text-xs hover:bg-primary-50">PDF</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
