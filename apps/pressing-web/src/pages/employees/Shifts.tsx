import { useState } from 'react';

const shifts = [
  { id: 'SFT-001', employee: 'Alice Nkwi', role: 'Counter Agent', date: '2024-01-15', start: '06:00', end: '14:00', type: 'Morning', status: 'Checked In' },
  { id: 'SFT-002', employee: 'David Kamga', role: 'Washer', date: '2024-01-15', start: '06:00', end: '14:00', type: 'Morning', status: 'Checked In' },
  { id: 'SFT-003', employee: 'Emma Biya', role: 'Presser', date: '2024-01-15', start: '08:00', end: '16:00', type: 'Day', status: 'Checked In' },
  { id: 'SFT-004', employee: 'Paul Ebode', role: 'QC Inspector', date: '2024-01-15', start: '10:00', end: '18:00', type: 'Evening', status: 'Scheduled' },
  { id: 'SFT-005', employee: 'Sarah Mengue', role: 'Branch Manager', date: '2024-01-15', start: '08:00', end: '17:00', type: 'Day', status: 'Checked In' },
  { id: 'SFT-006', employee: 'John Takam', role: 'Driver', date: '2024-01-15', start: '06:00', end: '14:00', type: 'Morning', status: 'Absent' },
];

const shiftTemplates = [
  { name: 'Morning Shift', start: '06:00', end: '14:00' },
  { name: 'Day Shift', start: '08:00', end: '16:00' },
  { name: 'Evening Shift', start: '14:00', end: '22:00' },
];

const statusStyles: Record<string, string> = {
  'Checked In': 'bg-success-100 text-success-700',
  Scheduled: 'bg-info-100 text-info-700',
  Absent: 'bg-danger-100 text-danger-700',
};

export default function Shifts() {
  const [showTemplate, setShowTemplate] = useState(false);

  return (
    <div>
      <div className="page-chrome">
        <h1 className="page-title">Shifts</h1>
        <div className="flex gap-2">
          <button onClick={() => setShowTemplate(true)}
            className="px-4 py-2 border border-primary rounded bg-white text-primary text-sm cursor-pointer hover:bg-primary-50">Manage Templates</button>
          <button className="bg-primary text-white px-4 py-2 rounded text-sm font-bold border-none cursor-pointer hover:bg-primary-dark">+ Assign Shift</button>
        </div>
      </div>

      <div className="bg-white border border-neutral-200 border-t-0 px-6 py-5 mb-6">
        <div className="flex justify-end items-center gap-3">
          <input type="date" className="px-3 py-1.5 border border-neutral-300 rounded text-sm" />
          <select className="px-3 py-1.5 border border-neutral-300 rounded text-sm">
            <option>All Status</option>
            <option>Scheduled</option>
            <option>Checked In</option>
            <option>Absent</option>
          </select>
        </div>
      </div>

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
            {shifts.map((s, i) => (
              <tr key={s.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'} hover:bg-primary-50 transition-colors`}>
                <td className="px-6 py-3 border-b border-neutral-200 font-medium">{s.employee}</td>
                <td className="px-6 py-3 border-b border-neutral-200 text-neutral-600">{s.role}</td>
                <td className="px-6 py-3 border-b border-neutral-200 text-neutral-500">{s.date}</td>
                <td className="px-6 py-3 border-b border-neutral-200">{s.start}</td>
                <td className="px-6 py-3 border-b border-neutral-200">{s.end}</td>
                <td className="px-6 py-3 border-b border-neutral-200">{s.type}</td>
                <td className="px-6 py-3 border-b border-neutral-200">
                  <span className={`status-pill text-xs ${statusStyles[s.status]}`}>{s.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-neutral-800">Shift Templates</h2>
              <button onClick={() => setShowTemplate(false)}
                className="text-neutral-400 hover:text-neutral-600 text-xl leading-none border-none bg-transparent cursor-pointer">&times;</button>
            </div>
            <div className="space-y-3">
              {shiftTemplates.map(t => (
                <div key={t.name} className="flex items-center justify-between p-3 border border-neutral-200 rounded">
                  <div>
                    <div className="text-sm font-medium">{t.name}</div>
                    <div className="text-xs text-neutral-500">{t.start} — {t.end}</div>
                  </div>
                  <button className="px-3 py-1 border border-neutral-300 rounded text-xs bg-white cursor-pointer hover:bg-neutral-50">Edit</button>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <button className="w-full px-4 py-2 border-2 border-dashed border-neutral-300 rounded text-sm text-neutral-500 bg-transparent cursor-pointer hover:border-primary hover:text-primary">
                + Add Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
