import { useAuth } from '../../contexts/AuthContext';
import { useShifts } from '../../hooks/useEmployees';

const statusStyles: Record<string, string> = {
  'Checked In': 'bg-success-100 text-success-700',
  Scheduled: 'bg-info-100 text-info-700',
  Absent: 'bg-danger-100 text-danger-700',
};

export default function Shifts() {
  const { user } = useAuth();
  const tenantId = user?.tenantId || '';

  const { data: shifts = [], isLoading } = useShifts(tenantId);

  return (
    <div>
      <div className="page-chrome">
        <h1 className="page-title">Shifts</h1>
      </div>

      {isLoading ? (
        <div className="p-6 text-center text-neutral-500">Loading shifts...</div>
      ) : (
        <div className="data-table">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-neutral-50">
                {['Employee', 'Role', 'Date', 'Start', 'End', 'Type', 'Status'].map(h => (
                  <th key={h} className="px-6 py-3 text-left font-bold text-primary border-b-2 border-neutral-200">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {shifts.map((s: any, i: number) => (
                <tr key={s.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'} hover:bg-primary-50 transition-colors`}>
                  <td className="px-6 py-3 border-b border-neutral-200 font-medium">{s.employeeName || '\u2014'}</td>
                  <td className="px-6 py-3 border-b border-neutral-200 text-neutral-600">{s.employeeRole || '\u2014'}</td>
                  <td className="px-6 py-3 border-b border-neutral-200 text-neutral-500">{s.date}</td>
                  <td className="px-6 py-3 border-b border-neutral-200">{s.startTime}</td>
                  <td className="px-6 py-3 border-b border-neutral-200">{s.endTime}</td>
                  <td className="px-6 py-3 border-b border-neutral-200">{s.type}</td>
                  <td className="px-6 py-3 border-b border-neutral-200">
                    <span className={`status-pill text-xs ${statusStyles[s.status] || ''}`}>{s.status}</span>
                  </td>
                </tr>
              ))}
              {shifts.length === 0 && (
                <tr><td colSpan={7} className="px-6 py-8 text-center text-neutral-400">No shifts found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
