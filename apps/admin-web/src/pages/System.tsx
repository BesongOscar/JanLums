import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CreditCard, MessageSquare, Mail, Bell, ShieldAlert } from 'lucide-react';
import { adminApiService } from '../api/adminApi';

interface SectionDef {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  schema: z.ZodObject<any>;
  keys: string[];
  labels: string[];
  types: string[];
  selectOptions?: string[];
}

const sectionDefs: SectionDef[] = [
  {
    id: 'payment',
    icon: CreditCard,
    title: 'Payment Provider',
    description: 'Configure payment gateway settings',
    keys: ['payment_provider', 'payment_api_key', 'payment_webhook_secret'],
    labels: ['Provider', 'API Key', 'Webhook Secret'],
    types: ['select', 'password', 'password'],
    selectOptions: ['stripe', 'paypal', 'flutterwave'],
    schema: z.object({
      payment_provider: z.string().min(1),
      payment_api_key: z.string().optional().default(''),
      payment_webhook_secret: z.string().optional().default(''),
    }),
  },
  {
    id: 'sms',
    icon: MessageSquare,
    title: 'SMS / WhatsApp Provider',
    description: 'Configure messaging providers',
    keys: ['sms_provider', 'sms_api_key', 'whatsapp_number'],
    labels: ['SMS Provider', 'SMS API Key', 'WhatsApp Number'],
    types: ['select', 'password', 'text'],
    selectOptions: ['twilio', 'africas_talking', 'vonage'],
    schema: z.object({
      sms_provider: z.string().min(1),
      sms_api_key: z.string().optional().default(''),
      whatsapp_number: z.string().optional().default(''),
    }),
  },
  {
    id: 'email',
    icon: Mail,
    title: 'Email SMTP Settings',
    description: 'Configure email delivery',
    keys: ['smtp_host', 'smtp_port', 'smtp_user', 'smtp_pass'],
    labels: ['SMTP Host', 'SMTP Port', 'SMTP Username', 'SMTP Password'],
    types: ['text', 'text', 'text', 'password'],
    schema: z.object({
      smtp_host: z.string().optional().default(''),
      smtp_port: z.string().optional().default('587'),
      smtp_user: z.string().optional().default(''),
      smtp_pass: z.string().optional().default(''),
    }),
  },
  {
    id: 'notifications',
    icon: Bell,
    title: 'Notification Templates',
    description: 'Manage system notification templates',
    keys: ['template_order_confirmed', 'template_order_ready', 'template_order_delivered'],
    labels: ['Order Confirmed', 'Order Ready', 'Order Delivered'],
    types: ['textarea', 'textarea', 'textarea'],
    schema: z.object({
      template_order_confirmed: z.string().optional().default('Your order #{{id}} has been confirmed.'),
      template_order_ready: z.string().optional().default('Your order #{{id}} is ready for pickup.'),
      template_order_delivered: z.string().optional().default('Your order #{{id}} has been delivered.'),
    }),
  },
  {
    id: 'maintenance',
    icon: ShieldAlert,
    title: 'Maintenance Mode',
    description: 'Enable or disable platform-wide maintenance mode',
    keys: ['maintenance_mode'],
    labels: ['Maintenance Mode'],
    types: ['select'],
    selectOptions: ['disabled', 'enabled'],
    schema: z.object({
      maintenance_mode: z.enum(['disabled', 'enabled']),
    }),
  },
];

function ConfigSection({ def }: { def: SectionDef }) {
  const queryClient = useQueryClient();
  const { data: settings } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: adminApiService.getSettings,
  });

  const updateMutation = useMutation({
    mutationFn: ({ key, value }: { key: string; value: string }) =>
      adminApiService.updateSetting(key, value),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-settings'] }),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty, isSubmitting },
  } = useForm({
    resolver: zodResolver(def.schema),
    defaultValues: def.keys.reduce(
      (acc, k) => ({ ...acc, [k]: '' }),
      {} as Record<string, string>,
    ),
  });

  useEffect(() => {
    if (settings) {
      const values: Record<string, string> = {};
      for (const key of def.keys) {
        values[key] = settings[key] || '';
      }
      reset(values);
    }
  }, [settings, def.keys, reset]);

  const onSubmit = async (data: Record<string, unknown>) => {
    for (const key of def.keys) {
      await updateMutation.mutateAsync({ key, value: String(data[key] || '') });
    }
    reset(data as any);
  };

  const Icon = def.icon;

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-start gap-3 mb-4">
        <div className="p-2 bg-primary-50 rounded-lg text-primary-600">
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{def.title}</h3>
          <p className="text-sm text-gray-500">{def.description}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {def.keys.map((key, i) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{def.labels[i]}</label>
            {def.types[i] === 'textarea' ? (
              <textarea
                {...register(key)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              />
            ) : def.types[i] === 'select' ? (
              <select
                {...register(key)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              >
                {def.selectOptions?.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            ) : (
              <input
                type={def.types[i]}
                {...register(key)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              />
            )}
          </div>
        ))}

        <button
          type="submit"
          disabled={!isDirty || isSubmitting}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}

export default function System() {
  return (
    <div className="space-y-6">
      {sectionDefs.map((def) => (
        <ConfigSection key={def.id} def={def} />
      ))}
    </div>
  );
}
