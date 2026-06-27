import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search } from 'lucide-react';
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
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      adminApiService.updateTenant(id, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tenants-summary'] }),
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
      />

      <CreateTenantModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
