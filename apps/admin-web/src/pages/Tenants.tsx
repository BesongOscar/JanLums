import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, AlertTriangle } from 'lucide-react';
import { adminApiService } from '../api/adminApi';
import TenantTable from '../components/TenantTable';
import CreateTenantModal from '../components/CreateTenantModal';

interface TenantSummary {
  id: string;
  name: string;
  slug: string;
  status: string;
  branchCount: number;
  userCount: number;
  orderCount: number;
  createdAt: string;
}

export default function Tenants() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const { data: tenants, isLoading } = useQuery({
    queryKey: ['tenants-summary'],
    queryFn: () => adminApiService.listTenantsSummary(),
    staleTime: 30000,
  });

  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const toggleMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      adminApiService.updateTenant(id, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tenants-summary'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApiService.deleteTenant(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants-summary'] });
      setDeleteTarget(null);
    },
  });

  const filtered = (tenants as TenantSummary[] | undefined)?.filter(
    (t) => t.name.toLowerCase().includes(search.toLowerCase()) || t.slug.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search tenants..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
          />
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700"
        >
          <Plus className="w-4 h-4" />
          Add Tenant
        </button>
      </div>

      <TenantTable
        tenants={filtered || []}
        isLoading={isLoading}
        onToggleStatus={(id, currentStatus) =>
          toggleMutation.mutate({ id, status: currentStatus === 'active' ? 'suspended' : 'active' })
        }
        onDelete={(id, name) => setDeleteTarget({ id, name })}
      />

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Delete Tenant</h2>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Are you sure you want to delete <strong>{deleteTarget.name}</strong>?
            </p>
            <p className="text-sm text-red-600 mb-6">
              This will permanently remove all associated data including branches, users, orders, and settings. This action cannot be undone.
            </p>
            {deleteMutation.isError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700 mb-4">
                {(deleteMutation.error as any)?.response?.data?.message || 'Failed to delete tenant.'}
              </div>
            )}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteMutation.mutate(deleteTarget.id)}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50"
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      <CreateTenantModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
