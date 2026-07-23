import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { usePayrollPeriods } from '../../hooks/usePayroll';
import { useToast } from '../../components/ui/Toast';

const statusStyles: Record<string, string> = {
  Finalized: 'bg-success-100 text-success-700',
  Draft: 'bg-warning-100 text-warning-700',
};

export default function PayrollReports() {
  const { user } = useAuth();
  const tenantId = user?.tenantId || '';
  const { showToast } = useToast();
  const [reportType, setReportType] = useState('summary');

  const { data: periods = [], isLoading } = usePayrollPeriods(tenantId);

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

      {isLoading ? (
        <div className="p-6 text-center text-neutral-500">Loading reports...</div>
      ) : (
        <div className="data-table">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-neutral-50">
                {['Period', 'Start', 'End', 'Status', ''].map(h => (
                  <th key={h} className="px-6 py-3 text-left font-bold text-primary border-b-2 border-neutral-200">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {periods.map((r: any, i: number) => (
                <tr key={r.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'} hover:bg-primary-50 transition-colors`}>
                  <td className="px-6 py-3 border-b border-neutral-200 font-medium">{r.name}</td>
                  <td className="px-6 py-3 border-b border-neutral-200 text-neutral-500">{r.startDate}</td>
                  <td className="px-6 py-3 border-b border-neutral-200 text-neutral-500">{r.endDate}</td>
                  <td className="px-6 py-3 border-b border-neutral-200">
                    <span className={`status-pill text-xs ${statusStyles[r.status === 'Closed' ? 'Finalized' : 'Draft'] || ''}`}>
                      {r.status === 'Closed' ? 'Finalized' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-3 border-b border-neutral-200">
                    <button className="px-3 py-1 border border-primary rounded bg-white text-primary cursor-pointer text-xs hover:bg-primary-50">View</button>
                  </td>
                </tr>
              ))}
              {periods.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-neutral-400">No payroll periods found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
