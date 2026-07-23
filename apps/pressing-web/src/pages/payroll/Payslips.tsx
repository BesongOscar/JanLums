import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { usePayslips, usePayrollPeriods } from '../../hooks/usePayroll';
import { useToast } from '../../components/ui/Toast';

const statusStyles: Record<string, string> = {
  Paid: 'bg-success-100 text-success-700',
  Pending: 'bg-warning-100 text-warning-700',
};

export default function Payslips() {
  const { user } = useAuth();
  const tenantId = user?.tenantId || '';
  const { showToast } = useToast();
  const [periodId, setPeriodId] = useState('');

  const { data: periods = [] } = usePayrollPeriods(tenantId);
  const { data: payslips = [], isLoading } = usePayslips(tenantId, periodId || undefined);

  const safePayslips = Array.isArray(payslips) ? payslips : [];

  return (
    <div>
      <div className="page-chrome">
        <h1 className="page-title">Payslips</h1>
        <select value={periodId} onChange={e => setPeriodId(e.target.value)}
          className="px-3 py-2 border border-neutral-300 rounded text-sm">
          <option value="">All periods</option>
          {periods.map((p: any) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="p-6 text-center text-neutral-500">Loading payslips...</div>
      ) : (
        <div className="data-table mt-6">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-neutral-50">
                {['Employee', 'Role', 'Period', 'Gross', 'Deductions', 'Net Pay', 'Status', 'Paid Date', ''].map(h => (
                  <th key={h} className="px-6 py-3 text-left font-bold text-primary border-b-2 border-neutral-200">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {safePayslips.map((p: any, i: number) => (
                <tr key={p.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'} hover:bg-primary-50 transition-colors`}>
                  <td className="px-6 py-3 border-b border-neutral-200 font-medium">{p.employeeName || '\u2014'}</td>
                  <td className="px-6 py-3 border-b border-neutral-200 text-neutral-600">{p.employeeRole || '\u2014'}</td>
                  <td className="px-6 py-3 border-b border-neutral-200 text-neutral-500">{p.periodName || '\u2014'}</td>
                  <td className="px-6 py-3 border-b border-neutral-200">{Number(p.grossPay).toLocaleString()} FCFA</td>
                  <td className="px-6 py-3 border-b border-neutral-200 text-danger">{Number(p.deductions).toLocaleString()} FCFA</td>
                  <td className="px-6 py-3 border-b border-neutral-200 font-bold text-primary">{Number(p.netPay).toLocaleString()} FCFA</td>
                  <td className="px-6 py-3 border-b border-neutral-200">
                    <span className={`status-pill text-xs ${statusStyles[p.status] || ''}`}>{p.status}</span>
                  </td>
                  <td className="px-6 py-3 border-b border-neutral-200 text-neutral-500">{p.paidDate || '\u2014'}</td>
                  <td className="px-6 py-3 border-b border-neutral-200">
                    <button onClick={() => showToast(`Downloading PDF for ${p.employeeName}`, 'success')}
                      className="px-3 py-1 border border-primary rounded bg-white text-primary cursor-pointer text-xs hover:bg-primary-50">PDF</button>
                  </td>
                </tr>
              ))}
              {safePayslips.length === 0 && (
                <tr><td colSpan={9} className="px-6 py-8 text-center text-neutral-400">No payslips found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
