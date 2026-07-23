import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useWorkEntries, usePayrollPeriods } from '../../hooks/usePayroll';

export default function WorkEntries() {
  const { user } = useAuth();
  const tenantId = user?.tenantId || '';
  const [periodId, setPeriodId] = useState('');

  const { data: periods = [] } = usePayrollPeriods(tenantId);
  const { data: entries = [], isLoading } = useWorkEntries(tenantId, periodId || undefined);

  const safeEntries = Array.isArray(entries) ? entries : [];

  return (
    <div>
      <div className="page-chrome">
        <h1 className="page-title">Work Entries</h1>
        <select value={periodId} onChange={e => setPeriodId(e.target.value)}
          className="px-3 py-2 border border-neutral-300 rounded text-sm">
          <option value="">All periods</option>
          {periods.map((p: any) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="p-6 text-center text-neutral-500">Loading entries...</div>
      ) : (
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
              {safeEntries.map((e: any, i: number) => (
                <tr key={e.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'} hover:bg-primary-50 transition-colors`}>
                  <td className="px-6 py-3 border-b border-neutral-200 font-medium">{e.employeeName || '\u2014'}</td>
                  <td className="px-6 py-3 border-b border-neutral-200 text-neutral-600">{e.employeeRole || '\u2014'}</td>
                  <td className="px-6 py-3 border-b border-neutral-200 text-neutral-500">{e.date}</td>
                  <td className="px-6 py-3 border-b border-neutral-200">{e.regularHours}</td>
                  <td className="px-6 py-3 border-b border-neutral-200">
                    {Number(e.overtimeHours) > 0 ? <span className="text-warning font-bold">{e.overtimeHours}</span> : e.overtimeHours}
                  </td>
                  <td className="px-6 py-3 border-b border-neutral-200">{e.holidayHours}</td>
                  <td className="px-6 py-3 border-b border-neutral-200 font-bold">{e.totalHours}</td>
                  <td className="px-6 py-3 border-b border-neutral-200">{Number(e.amount).toLocaleString()} FCFA</td>
                </tr>
              ))}
              {safeEntries.length === 0 && (
                <tr><td colSpan={8} className="px-6 py-8 text-center text-neutral-400">No work entries found</td></tr>
              )}
            </tbody>
          </table>
          {safeEntries.length > 0 && (
            <div className="px-6 py-4 border-t border-neutral-200 flex justify-between text-sm font-bold">
              <span>Total Hours: {safeEntries.reduce((s: number, e: any) => s + Number(e.totalHours), 0)}h</span>
              <span className="text-primary">Total: {safeEntries.reduce((s: number, e: any) => s + Number(e.amount), 0).toLocaleString()} FCFA</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
