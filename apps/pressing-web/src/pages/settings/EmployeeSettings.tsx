const roles = [
  { id: 'RL-001', name: 'Counter Agent', department: 'Front Desk', permissions: ['Create Orders', 'Receive Payments', 'Update Customer Info'], type: 'Full-Time' },
  { id: 'RL-002', name: 'Washer', department: 'Production', permissions: ['View Garments', 'Update Garment Status'], type: 'Full-Time' },
  { id: 'RL-003', name: 'Presser', department: 'Production', permissions: ['View Garments', 'Update Garment Status'], type: 'Full-Time' },
  { id: 'RL-004', name: 'QC Inspector', department: 'Quality', permissions: ['QC Check', 'Mark Damages', 'Approve Rewash'], type: 'Full-Time' },
  { id: 'RL-005', name: 'Branch Manager', department: 'Management', permissions: ['All'], type: 'Full-Time' },
  { id: 'RL-006', name: 'Driver', department: 'Logistics', permissions: ['View Routes', 'Update Delivery Status'], type: 'Part-Time' },
];

export default function EmployeeSettings() {
  return (
    <div>
      <div className="page-chrome">
        <h1 className="page-title">Employee Settings</h1>
      </div>
      <div className="data-table mt-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-neutral-50">
              {['Role', 'Department', 'Permissions', 'Contract Type', ''].map(h => (
                <th key={h} className="px-6 py-3 text-left font-bold text-primary border-b-2 border-neutral-200">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {roles.map((r, i) => (
              <tr key={r.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'} hover:bg-primary-50 transition-colors`}>
                <td className="px-6 py-3 border-b border-neutral-200 font-medium">{r.name}</td>
                <td className="px-6 py-3 border-b border-neutral-200"><span className="text-xs bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded">{r.department}</span></td>
                <td className="px-6 py-3 border-b border-neutral-200">
                  <div className="flex flex-wrap gap-1">
                    {r.permissions.map(p => (
                      <span key={p} className="text-xs bg-primary-50 text-primary px-1.5 py-0.5 rounded">{p}</span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-3 border-b border-neutral-200"><span className={`text-xs px-2 py-0.5 rounded ${r.type === 'Full-Time' ? 'bg-info-100 text-info-700' : 'bg-warning-100 text-warning-700'}`}>{r.type}</span></td>
                <td className="px-6 py-3 border-b border-neutral-200">
                  <button className="px-3 py-1 border border-primary rounded bg-white text-primary cursor-pointer text-xs hover:bg-primary-50">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
