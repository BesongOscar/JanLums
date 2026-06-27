import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Shield, User as UserIcon, KeyRound } from 'lucide-react';
import { adminApiService } from '../api/adminApi';

export default function Users() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [tenantFilter, setTenantFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [resetResult, setResetResult] = useState<{ id: string; password: string } | null>(null);

  const { data: allUsers, isLoading: usersLoading } = useQuery({
    queryKey: ['users', tenantFilter || undefined, roleFilter || undefined],
    queryFn: () => adminApiService.listUsers(tenantFilter || undefined, roleFilter || undefined),
  });

  const { data: tenants } = useQuery({
    queryKey: ['tenants-summary'],
    queryFn: () => adminApiService.listTenantsSummary(),
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      adminApiService.updateUser(id, { isActive }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });

  const resetPasswordMutation = useMutation({
    mutationFn: (id: string) => adminApiService.resetPassword(id),
    onSuccess: (data, id) => {
      setResetResult({ id, password: data.newPassword });
      setTimeout(() => setResetResult(null), 10000);
    },
  });

  const filtered = allUsers?.filter(
    (u) =>
      `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      {resetResult && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm">
          <p className="font-medium text-yellow-800">Password reset successful</p>
          <p className="text-yellow-700 mt-1">New password: <code className="bg-yellow-100 px-2 py-0.5 rounded">{resetResult.password}</code></p>
          <p className="text-xs text-yellow-600 mt-1">Share this with the user. This will not be shown again.</p>
        </div>
      )}

      <div className="flex items-center gap-4 mb-6">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
          />
        </div>
        <select
          value={tenantFilter}
          onChange={(e) => setTenantFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
        >
          <option value="">All Tenants</option>
          {(tenants as any[] | undefined)?.map((t: any) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
        >
          <option value="">All Roles</option>
          {['PLATFORM_ADMIN', 'TENANT_ADMIN', 'BRANCH_MANAGER', 'COUNTER_STAFF', 'DELIVERY_STAFF'].map((r) => (
            <option key={r} value={r}>{r.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">User</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {usersLoading ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">Loading...</td></tr>
            ) : filtered?.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No users found</td></tr>
            ) : (
              filtered?.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <UserIcon className="w-4 h-4 text-gray-500" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-primary-50 text-primary-700">
                      <Shield className="w-3 h-3" />
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      user.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => resetPasswordMutation.mutate(user.id)}
                        disabled={resetPasswordMutation.isPending}
                        className="inline-flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                        title="Reset password"
                      >
                        <KeyRound className="w-3.5 h-3.5" />
                        Reset
                      </button>
                      <button
                        onClick={() =>
                          toggleActiveMutation.mutate({ id: user.id, isActive: !user.isActive })
                        }
                        className={`text-sm px-3 py-1.5 rounded-lg ${
                          user.isActive ? 'text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'
                        }`}
                      >
                        {user.isActive ? 'Suspend' : 'Activate'}
                      </button>
                    </div>
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
