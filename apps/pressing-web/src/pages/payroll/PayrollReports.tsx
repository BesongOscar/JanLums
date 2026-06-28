import { useState } from 'react';
import { useToast } from '../../components/ui/Toast';

const summaries = [
  { id: 'RPT-001', period: 'December 2023', employees: 6, grossTotal: 2380000, deductionsTotal: 253000, netTotal: 2127000, status: 'Finalized' },
  { id: 'RPT-002', period: 'November 2023', employees: 6, grossTotal: 2250000, deductionsTotal: 240000, netTotal: 2010000, status: 'Finalized' },
  { id: 'RPT-003', period: 'January 2024', employees: 7, grossTotal: 0, deductionsTotal: 0, netTotal: 0, status: 'Draft' },
];

const statusStyles: Record<string, string> = {
  Finalized: 'bg-success-100 text-success-700',
  Draft: 'bg-warning-100 text-warning-700',
};

export default function PayrollReports() {
  const { showToast } = useToast();
  const [reportType, setReportType] = useState('summary');

  return (
    <div>
      <div className="page-chrome">
        <h1 className="page-title">Payroll Reports</h1>
        <div className="flex gap-2">
          <button onClick={() => showToast('Exporting to Excel', 'success')}
            className="px-4 py-2 border border-primary rounded bg-white text-primary text-sm cursor-pointer hover:bg-primary-50">Export Excel</button>
          <button onClick={() => showToast('Exporting to PDF', 'success')}
            className="px-4 py-2 border border-primary rounded bg-white text-primary text-sm cursor-pointer hover:bg-primary-50">Export PDF</button>
        </div>
      </div>

      <div className="bg-white border border-neutral-200 border-t-0 px-6 py-5 mb-6">
        <div className="flex justify-start gap-3">
          {[
            { value: 'summary', label: 'Summary' },
            { value: 'tax', label: 'Tax Summary' },
            { value: 'deductions', label: 'Deductions' },
            { value: 'labor', label: 'Labor Cost' },
          ].map(t => (
            <button key={t.value} onClick={() => setReportType(t.value)}
              className={`px-4 py-1.5 rounded text-xs font-bold border-none cursor-pointer ${reportType === t.value ? 'bg-primary text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}>{t.label}</button>
          ))}
        </div>
      </div>

      <div className="data-table">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-neutral-50">
              {['Period', 'Employees', 'Gross Total', 'Deductions', 'Net Total', 'Status', ''].map(h => (
                <th key={h} className="px-6 py-3 text-left font-bold text-primary border-b-2 border-neutral-200">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {summaries.map((r, i) => (
              <tr key={r.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'} hover:bg-primary-50 transition-colors`}>
                <td className="px-6 py-3 border-b border-neutral-200 font-medium">{r.period}</td>
                <td className="px-6 py-3 border-b border-neutral-200">{r.employees}</td>
                <td className="px-6 py-3 border-b border-neutral-200">{r.grossTotal.toLocaleString()} FCFA</td>
                <td className="px-6 py-3 border-b border-neutral-200 text-danger">{r.deductionsTotal.toLocaleString()} FCFA</td>
                <td className="px-6 py-3 border-b border-neutral-200 font-bold text-primary">{r.netTotal.toLocaleString()} FCFA</td>
                <td className="px-6 py-3 border-b border-neutral-200">
                  <span className={`status-pill text-xs ${statusStyles[r.status]}`}>{r.status}</span>
                </td>
                <td className="px-6 py-3 border-b border-neutral-200">
                  <button className="px-3 py-1 border border-primary rounded bg-white text-primary cursor-pointer text-xs hover:bg-primary-50">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {reportType === 'labor' && (
        <div className="mt-6 bg-white border border-neutral-200 rounded p-6 shadow-sm">
          <h3 className="text-base font-bold text-neutral-800 mb-4">Labor Cost Analysis</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="text-xs text-neutral-500 mb-1">Total Labor Cost (Dec 2023)</div>
              <div className="text-2xl font-bold text-primary">2,127,000 FCFA</div>
            </div>
            <div>
              <div className="text-xs text-neutral-500 mb-1">Avg Cost per Employee</div>
              <div className="text-2xl font-bold text-primary">354,500 FCFA</div>
            </div>
            <div>
              <div className="text-xs text-neutral-500 mb-1">YoY Change</div>
              <div className="text-2xl font-bold text-success">+5.8%</div>
            </div>
            <div>
              <div className="text-xs text-neutral-500 mb-1">Labor as % of Revenue</div>
              <div className="text-2xl font-bold text-warning">32.4%</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
