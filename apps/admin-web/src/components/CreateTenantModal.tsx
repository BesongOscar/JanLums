import { useState } from 'react';
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
  adminFirstName: z.string().min(1, 'First name is required').max(50),
  adminLastName: z.string().min(1, 'Last name is required').max(50),
  adminEmail: z.string().email('Valid email is required'),
  adminPassword: z.string().min(6, 'Password must be at least 6 characters'),
});

type TenantFormData = z.infer<typeof tenantSchema>;

interface CreateTenantModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateTenantModal({ open, onClose }: CreateTenantModalProps) {
  const queryClient = useQueryClient();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TenantFormData>({
    resolver: zodResolver(tenantSchema),
    defaultValues: {
      name: '', slug: '', primaryColor: '#3b82f6',
      adminFirstName: '', adminLastName: '', adminEmail: '', adminPassword: '',
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: TenantFormData) => {
      const tenant = await adminApiService.createTenant({
        name: data.name,
        slug: data.slug,
        primaryColor: data.primaryColor,
      });

      await adminApiService.createUser({
        tenantId: tenant.id,
        email: data.adminEmail,
        firstName: data.adminFirstName,
        lastName: data.adminLastName,
        role: 'admin',
        isActive: true,
        password: data.adminPassword,
      } as any);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants-summary'] });
      reset();
      onClose();
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Add Tenant</h2>
          <button onClick={handleClose} className="p-1 text-gray-400 hover:text-gray-600 rounded" aria-label="Close">
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

          <hr className="border-gray-200" />
          <p className="text-sm text-gray-500 font-medium">Tenant Administrator</p>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="adminFirstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                id="adminFirstName"
                {...register('adminFirstName')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                placeholder="John"
              />
              {errors.adminFirstName && <p className="mt-1 text-xs text-red-600">{errors.adminFirstName.message}</p>}
            </div>
            <div>
              <label htmlFor="adminLastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                id="adminLastName"
                {...register('adminLastName')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                placeholder="Doe"
              />
              {errors.adminLastName && <p className="mt-1 text-xs text-red-600">{errors.adminLastName.message}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="adminEmail" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              id="adminEmail"
              type="email"
              {...register('adminEmail')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              placeholder="admin@example.com"
            />
            {errors.adminEmail && <p className="mt-1 text-xs text-red-600">{errors.adminEmail.message}</p>}
          </div>

          <div>
            <label htmlFor="adminPassword" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                id="adminPassword"
                type={showPassword ? 'text' : 'password'}
                {...register('adminPassword')}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                placeholder="Min. 6 characters"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-none border-none cursor-pointer text-gray-500 text-xs"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.adminPassword && <p className="mt-1 text-xs text-red-600">{errors.adminPassword.message}</p>}
          </div>

          {createMutation.isError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
              {(createMutation.error as any)?.response?.data?.message || 'Failed to create tenant.'}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
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
