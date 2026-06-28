import { useState } from 'react';

const attendance = [
  { id: 'ATN-001', employee: 'Alice Nkwi', role: 'Counter Agent', date: '2024-01-15', checkIn: '05:55', checkOut: '', status: 'Present', hours: '7.5', overtime: '0' },
  { id: 'ATN-002', employee: 'David Kamga', role: 'Washer', date: '2024-01-15', checkIn: '06:10', checkOut: '', status: 'Present', hours: '7.0', overtime: '0' },
  { id: 'ATN-003', employee: 'Emma Biya', role: 'Presser', date: '2024-01-15', checkIn: '07:50', checkOut: '', status: 'Present', hours: '7.5', overtime: '0' },
  { id: 'ATN-004', employee: 'Paul Ebode', role: 'QC Inspector', date: '2024-01-15', checkIn: '—', checkOut: '—', status: 'Scheduled', hours: '0', overtime: '0' },
  { id: 'ATN-005', employee: 'Sarah Mengue', role: 'Branch Manager', date: '2024-01-15', checkIn: '07:45', checkOut: '', status: 'Present', hours: '8.0', overtime: '0.5' },
  { id: 'ATN-006', employee: 'John Takam', role: 'Driver', date: '2024-01-15', checkIn: '—', checkOut: '—', status: 'Absent', hours: '0', overtime: '0' },
];

const statusStyles: Record<string, string> = {
  Present: 'bg-success-100 text-success-700',
  Scheduled: 'bg-info-100 text-info-700',
  Absent: 'bg-danger-100 text-danger-700',
};

export default function Attendance() {
  const [date, setDate] = useState('2024-01-15');

  const present = attendance.filter(a => a.status === 'Present').length;
  const absent = attendance.filter(a => a.status === 'Absent').length;
  const total = attendance.length;

  return (
    <div>
      <div className="page-chrome">
        <h1 className="page-title">Attendance</h1>
        <input type="date" value={date} onChange={e => setDate(e.target.value)}
          className="px-3 py-2 border border-neutral-300 rounded text-sm" />
      </div>

      <div className="grid grid-cols-4 gap-4 my-6">
        <div className="bg-white border border-neutral-200 rounded p-4 shadow-sm">
          <div className="text-neutral-500 text-xs mb-1">Total Staff</div>
          <div className="text-2xl font-bold text-neutral-900">{total}</div>
        </div>
        <div className="bg-white border border-success rounded p-4 shadow-sm border-2">
          <div className="text-neutral-500 text-xs mb-1">Present</div>
          <div className="text-2xl font-bold text-success">{present}</div>
        </div>
        <div className="bg-white border border-info rounded p-4 shadow-sm border-2">
          <div className="text-neutral-500 text-xs mb-1">Scheduled</div>
          <div className="text-2xl font-bold text-info">{total - present - absent}</div>
        </div>
        <div className="bg-white border border-danger rounded p-4 shadow-sm border-2">
          <div className="text-neutral-500 text-xs mb-1">Absent</div>
          <div className="text-2xl font-bold text-danger">{absent}</div>
        </div>
      </div>

      <div className="data-table">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-neutral-50">
              {['Employee', 'Role', 'Check-In', 'Check-Out', 'Hours', 'Overtime', 'Status'].map(h => (
                <th key={h} className="px-6 py-3 text-left font-bold text-primary border-b-2 border-neutral-200">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {attendance.map((a, i) => (
              <tr key={a.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'} hover:bg-primary-50 transition-colors`}>
                <td className="px-6 py-3 border-b border-neutral-200 font-medium">{a.employee}</td>
                <td className="px-6 py-3 border-b border-neutral-200 text-neutral-600">{a.role}</td>
                <td className="px-6 py-3 border-b border-neutral-200">{a.checkIn}</td>
                <td className="px-6 py-3 border-b border-neutral-200">{a.checkOut || '—'}</td>
                <td className="px-6 py-3 border-b border-neutral-200 font-bold">{a.hours}</td>
                <td className="px-6 py-3 border-b border-neutral-200">
                  {a.overtime !== '0' ? <span className="text-warning font-bold">{a.overtime}h</span> : '—'}
                </td>
                <td className="px-6 py-3 border-b border-neutral-200">
                  <span className={`status-pill text-xs ${statusStyles[a.status]}`}>{a.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
