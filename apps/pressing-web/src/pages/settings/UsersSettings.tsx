const users = [
  { id: 'USR-001', name: 'Alice Nkwi', email: 'alice@press237.com', role: 'Counter Agent', branch: 'Bastos', lastLogin: '2024-01-27 08:15', status: 'Active' },
  { id: 'USR-002', name: 'Sarah Mengue', email: 'sarah@press237.com', role: 'Branch Manager', branch: 'Bastos', lastLogin: '2024-01-27 07:45', status: 'Active' },
  { id: 'USR-003', name: 'David Kamga', email: 'david@press237.com', role: 'Washer', branch: 'Bastos', lastLogin: '2024-01-26 14:30', status: 'Active' },
  { id: 'USR-004', name: 'Emma Biya', email: 'emma@press237.com', role: 'Presser', branch: 'Bastos', lastLogin: '2024-01-26 12:00', status: 'Active' },
  { id: 'USR-005', name: 'Paul Ebode', email: 'paul@press237.com', role: 'QC Inspector', branch: 'Bastos', lastLogin: '2024-01-25 16:45', status: 'Suspended' },
];

export default function UsersSettings() {
  return (
    <div>
      <div className="page-chrome">
        <h1 className="page-title">User Management</h1>
        <button className="px-4 py-2 bg-primary text-white rounded text-sm font-bold border-none cursor-pointer hover:bg-primary-dark">+ Add User</button>
      </div>
      <div className="data-table mt-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-neutral-50">
              {['Name', 'Email', 'Role', 'Branch', 'Last Login', 'Status', ''].map(h => (
                <th key={h} className="px-6 py-3 text-left font-bold text-primary border-b-2 border-neutral-200">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={u.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'} hover:bg-primary-50 transition-colors`}>
                <td className="px-6 py-3 border-b border-neutral-200 font-medium">{u.name}</td>
                <td className="px-6 py-3 border-b border-neutral-200 text-neutral-600 text-xs">{u.email}</td>
                <td className="px-6 py-3 border-b border-neutral-200"><span className="text-xs bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded">{u.role}</span></td>
                <td className="px-6 py-3 border-b border-neutral-200">{u.branch}</td>
                <td className="px-6 py-3 border-b border-neutral-200 text-xs text-neutral-500">{u.lastLogin}</td>
                <td className="px-6 py-3 border-b border-neutral-200">
                  <span className={`status-pill text-xs ${u.status === 'Active' ? 'bg-success-100 text-success-700' : 'bg-danger-100 text-danger-700'}`}>{u.status}</span>
                </td>
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
