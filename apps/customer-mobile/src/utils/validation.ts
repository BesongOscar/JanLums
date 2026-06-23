import { z } from 'zod';

export { loginSchema, registerSchema } from '../features/auth/validation';
export type { LoginFormData, RegisterFormData } from '../features/auth/validation';

export const profileUpdateSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  phone: z.string().min(9, 'Invalid phone number').max(15).optional(),
  address: z.string().max(200).optional(),
  city: z.string().max(100).optional(),
});

export const addressSchema = z.object({
  label: z.enum(['home', 'work', 'other']),
  addressLine1: z.string().min(1, 'Address is required').max(200),
  addressLine2: z.string().max(200).optional(),
  city: z.string().min(1, 'City is required').max(100),
  state: z.string().max(100).optional(),
  postalCode: z.string().max(20).optional(),
  country: z.string().default('Cameroon'),
  isDefault: z.boolean().default(false),
});

export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;
export type AddressFormData = z.infer<typeof addressSchema>;
