import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { adminApiService } from '../api/adminApi';

const tenantSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(50)
    .regex(/^[a-z0-9-]+$/, 'Only lowercase letters, numbers, and hyphens'),
  primaryColor: z.string().optional(),
});

type TenantFormData = z.infer<typeof tenantSchema>;

interface CreateTenantModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateTenantModal({ open, onClose }: CreateTenantModalProps) {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TenantFormData>({
    resolver: zodResolver(tenantSchema),
    defaultValues: { name: '', slug: '', primaryColor: '#3b82f6' },
  });

  const createMutation = useMutation({
    mutationFn: (data: TenantFormData) => adminApiService.createTenant(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants-summary'] });
      reset();
      onClose();
    },
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Add Tenant</h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit((data) => createMutation.mutate(data))} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Tenant Name</label>
            <input
              id="name"
              {...register('name')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              placeholder="My Laundry"
            />
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
            <input
              id="slug"
              {...register('slug')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              placeholder="my-laundry"
            />
            {errors.slug && <p className="mt-1 text-xs text-red-600">{errors.slug.message}</p>}
          </div>

          <div>
            <label htmlFor="primaryColor" className="block text-sm font-medium text-gray-700 mb-1">Brand Color</label>
            <div className="flex items-center gap-3">
              <input
                id="primaryColor"
                type="color"
                {...register('primaryColor')}
                className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
              />
              <span className="text-sm text-gray-500">Pick a brand color</span>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50"
            >
              {createMutation.isPending ? 'Creating...' : 'Create Tenant'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
