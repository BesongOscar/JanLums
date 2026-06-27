import { Link } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react';

interface TenantRow {
  id: string;
  name: string;
  slug: string;
  status: string;
  branchCount?: number;
  userCount?: number;
  orderCount?: number;
  planName?: string | null;
  createdAt: string;
}

interface TenantTableProps {
  tenants: TenantRow[];
  isLoading: boolean;
  onToggleStatus: (id: string, status: string) => void;
}

export default function TenantTable({ tenants, isLoading, onToggleStatus }: TenantTableProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Slug</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Plan</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Branches</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Users</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Orders</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Created</th>
              <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr><td colSpan={9} className="px-6 py-8 text-center text-gray-500">Loading...</td></tr>
          </tbody>
        </table>
      </div>
    );
  }

  if (tenants.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Slug</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Plan</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Branches</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Users</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Orders</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Created</th>
              <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr><td colSpan={9} className="px-6 py-8 text-center text-gray-500">No tenants found</td></tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-gray-50">
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Slug</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Plan</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Branches</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Users</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Orders</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Created</th>
              <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {tenants.map((tenant) => (
            <tr key={tenant.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <Link to={`/tenants/${tenant.id}`} className="text-sm font-medium text-primary-600 hover:text-primary-800">
                  {tenant.name}
                </Link>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">{tenant.slug}</td>
              <td className="px-6 py-4">
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  tenant.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {tenant.status === 'active' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                  {tenant.status}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">{tenant.planName || '-'}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{tenant.branchCount ?? '-'}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{tenant.userCount ?? '-'}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{tenant.orderCount ?? '-'}</td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {new Date(tenant.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 text-right">
                <button
                  onClick={() => onToggleStatus(tenant.id, tenant.status)}
                  className={`text-sm px-3 py-1.5 rounded-lg ${
                    tenant.status === 'active'
                      ? 'text-red-600 hover:bg-red-50'
                      : 'text-green-600 hover:bg-green-50'
                  }`}
                >
                  {tenant.status === 'active' ? 'Suspend' : 'Activate'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
