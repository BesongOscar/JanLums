import { useAuth } from '../../contexts/AuthContext';
import { useUsers } from '../../hooks/useUsers';
import { LoadingState } from '../../components/ui/States';

export default function UsersSettings() {
  const { user } = useAuth();
  const tenantId = user?.tenantId || '';
  const { data: users, isLoading } = useUsers(tenantId);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingState />
      </div>
    );
  }

  const list = Array.isArray(users) ? users : [];

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
              {['Name', 'Email', 'Role', 'Last Login', 'Status', ''].map(h => (
                <th key={h} className="px-6 py-3 text-left font-bold text-primary border-b-2 border-neutral-200">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {list.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-sm text-neutral-400">No users yet</td>
              </tr>
            ) : (
              list.map((u: any, i: number) => (
                <tr key={u.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'} hover:bg-primary-50 transition-colors`}>
                  <td className="px-6 py-3 border-b border-neutral-200 font-medium">{u.firstName} {u.lastName}</td>
                  <td className="px-6 py-3 border-b border-neutral-200 text-neutral-600 text-xs">{u.email}</td>
                  <td className="px-6 py-3 border-b border-neutral-200">
                    <span className="text-xs bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded">{u.role?.replace('_', ' ') || '-'}</span>
                  </td>
                  <td className="px-6 py-3 border-b border-neutral-200 text-xs text-neutral-500">
                    {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString() : '—'}
                  </td>
                  <td className="px-6 py-3 border-b border-neutral-200">
                    <span className={`status-pill text-xs ${u.isActive !== false ? 'bg-success-100 text-success-700' : 'bg-danger-100 text-danger-700'}`}>
                      {u.isActive !== false ? 'Active' : 'Suspended'}
                    </span>
                  </td>
                  <td className="px-6 py-3 border-b border-neutral-200">
                    <button className="px-3 py-1 border border-primary rounded bg-white text-primary cursor-pointer text-xs hover:bg-primary-50">Edit</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
