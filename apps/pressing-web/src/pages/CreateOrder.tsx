import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/ui/Toast';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const serviceOptions = [
  { name: 'Wash & Fold', price: 500 },
  { name: 'Dry Cleaning', price: 1500 },
  { name: 'Ironing / Pressing', price: 300 },
  { name: 'Stain Removal', price: 1000 },
];

const garmentOptions = ['Shirt', 'Trouser', 'Suit', 'Dress', 'Jacket', 'Blouse', 'Skirt', ' coat', 'Uniform', 'Other'];

const orderSchema = z.object({
  customerName: z.string().min(1, 'Customer name is required'),
  customerPhone: z.string().min(1, 'Phone number is required'),
  customerEmail: z.string().email('Invalid email').optional().or(z.literal('')),
  branch: z.string().min(1, 'Branch is required'),
  items: z.array(z.object({
    garmentType: z.string().min(1, 'Garment type is required'),
    service: z.string().min(1, 'Service is required'),
    quantity: z.coerce.number().min(1, 'Min 1'),
    unitPrice: z.coerce.number().min(0),
  })).min(1, 'Add at least one item'),
  isExpress: z.boolean().optional(),
  notes: z.string().optional(),
  deliveryMethod: z.string().min(1, 'Select delivery method'),
  paymentMethod: z.string().min(1, 'Select payment method'),
});

type OrderFormData = z.infer<typeof orderSchema>;

const defaultItem = { garmentType: '', service: '', quantity: 1, unitPrice: 0 };

export default function CreateOrder() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [step, setStep] = useState(1);
  const [customerSearch, setCustomerSearch] = useState('');

  const { register, control, handleSubmit, watch, setValue, formState: { errors } } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      customerName: '',
      customerPhone: '',
      customerEmail: '',
      branch: 'Yaounde Main',
      items: [{ ...defaultItem }],
      isExpress: false,
      notes: '',
      deliveryMethod: 'pickup',
      paymentMethod: 'cash',
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'items' });
  const items = watch('items');
  const isExpress = watch('isExpress');

  const calculateItemPrice = (service: string): number => {
    const svc = serviceOptions.find(s => s.name === service);
    const base = svc?.price || 0;
    return isExpress ? base * 2 : base;
  };

  const total = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);

  const totalItems = items.reduce((sum, item) => sum + (item.quantity || 0), 0);

  const onSubmit = (data: OrderFormData) => {
    showToast(`Order created for ${data.customerName} — ${total.toLocaleString()} FCFA`, 'success');
    navigate('/orders');
  };

  const totalSteps = 4;

  const canProceed = () => {
    if (step === 1) return watch('customerName') && watch('customerPhone');
    if (step === 2) return items.length > 0 && items.every(i => i.garmentType && i.service);
    if (step === 3) return watch('deliveryMethod') && watch('paymentMethod');
    return true;
  };

  return (
    <div>
      <div className="page-chrome">
        <h1 className="page-title">Create New Order</h1>
        <button
          onClick={() => navigate('/orders')}
          className="px-4 py-2 border border-neutral-300 rounded bg-white cursor-pointer text-sm hover:bg-neutral-50"
        >
          Cancel
        </button>
      </div>

      <div className="flex items-center gap-3 px-6 py-4 bg-neutral-50 border-b border-neutral-200">
        {['Customer', 'Items & Services', 'Delivery & Payment', 'Review'].map((label, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              i + 1 === step ? 'bg-primary text-white' :
              i + 1 < step ? 'bg-success text-white' :
              'bg-neutral-200 text-neutral-500'
            }`}>
              {i + 1 < step ? '\u2713' : i + 1}
            </div>
            <span className={`text-sm ${i + 1 === step ? 'font-semibold text-primary' : 'text-neutral-500'}`}>
              {label}
            </span>
            {i < totalSteps - 1 && <div className="w-6 h-px bg-neutral-300" />}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
        {step === 1 && (
          <div className="bg-white border border-neutral-200 rounded p-6 shadow-sm">
            <h2 className="text-lg font-bold text-neutral-800 mb-5">Customer Information</h2>

            <div className="mb-5">
              <label className="block text-sm font-medium text-neutral-600 mb-2">Search existing customer</label>
              <input
                type="text"
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
                placeholder="Type name or phone..."
                className="w-full px-3 py-2 border border-neutral-300 rounded text-sm"
              />
              {customerSearch && (
                <div className="mt-2 border border-neutral-200 rounded bg-white shadow-sm">
                  <div className="px-4 py-3 cursor-pointer hover:bg-primary-50 border-b border-neutral-100">
                    <div className="text-sm font-medium">Jean Dupont</div>
                    <div className="text-xs text-neutral-500">+237 612 345 678</div>
                  </div>
                  <div className="px-4 py-3 cursor-pointer hover:bg-primary-50">
                    <div className="text-sm font-medium">Marie Claire</div>
                    <div className="text-xs text-neutral-500">+237 623 456 789</div>
                  </div>
                </div>
              )}
            </div>

            <div className="text-sm text-neutral-400 mb-4">Or add a new customer:</div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Customer Name *</label>
                <input
                  {...register('customerName')}
                  placeholder="Enter customer name"
                  className={`w-full px-3 py-2 border rounded text-sm ${errors.customerName ? 'border-danger' : 'border-neutral-300'}`}
                />
                {errors.customerName && <p className="text-xs text-danger mt-1">{errors.customerName.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Phone Number *</label>
                <input
                  {...register('customerPhone')}
                  placeholder="+237 6XX XXX XXX"
                  className={`w-full px-3 py-2 border rounded text-sm ${errors.customerPhone ? 'border-danger' : 'border-neutral-300'}`}
                />
                {errors.customerPhone && <p className="text-xs text-danger mt-1">{errors.customerPhone.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Email</label>
                <input
                  {...register('customerEmail')}
                  placeholder="email@example.com"
                  className="w-full px-3 py-2 border border-neutral-300 rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Branch</label>
                <select
                  {...register('branch')}
                  className="w-full px-3 py-2 border border-neutral-300 rounded text-sm"
                >
                  <option>Yaounde Main</option>
                  <option>Douala Central</option>
                  <option>Buea Town</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white border border-neutral-200 rounded p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-neutral-800">Items & Services</h2>
              <button
                type="button"
                onClick={() => append({ ...defaultItem })}
                className="bg-primary text-white px-4 py-2 rounded text-sm font-bold border-none cursor-pointer hover:bg-primary-dark"
              >
                + Add Item
              </button>
            </div>

            {errors.items && <p className="text-xs text-danger mb-3">{errors.items.message || errors.items.root?.message}</p>}

            <div className="space-y-4">
              {fields.map((_, index) => (
                <div key={index} className="border border-neutral-200 rounded p-4 bg-neutral-50">
                  <div className="grid grid-cols-5 gap-3 items-end">
                    <div>
                      <label className="block text-xs font-medium text-neutral-500 mb-1">Service</label>
                      <select
                        {...register(`items.${index}.service`)}
                        onChange={(e) => {
                          register(`items.${index}.service`).onChange(e);
                          setValue(`items.${index}.unitPrice`, calculateItemPrice(e.target.value));
                        }}
                        className={`w-full px-2 py-1.5 border rounded text-sm ${errors.items?.[index]?.service ? 'border-danger' : 'border-neutral-300'}`}
                      >
                        <option value="">Select...</option>
                        {serviceOptions.map(s => (
                          <option key={s.name} value={s.name}>{s.name} — {s.price} FCFA</option>
                        ))}
                      </select>
                      {errors.items?.[index]?.service && <p className="text-xs text-danger mt-1">{errors.items[index]?.service?.message}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-neutral-500 mb-1">Garment</label>
                      <select
                        {...register(`items.${index}.garmentType`)}
                        className={`w-full px-2 py-1.5 border rounded text-sm ${errors.items?.[index]?.garmentType ? 'border-danger' : 'border-neutral-300'}`}
                      >
                        <option value="">Select...</option>
                        {garmentOptions.map(g => <option key={g} value={g}>{g}</option>)}
                      </select>
                      {errors.items?.[index]?.garmentType && <p className="text-xs text-danger mt-1">{errors.items[index]?.garmentType?.message}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-neutral-500 mb-1">Qty</label>
                      <input
                        type="number"
                        {...register(`items.${index}.quantity`)}
                        min={1}
                        className="w-full px-2 py-1.5 border border-neutral-300 rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-neutral-500 mb-1">Price</label>
                      <Controller
                        control={control}
                        name={`items.${index}.unitPrice`}
                        render={() => (
                          <div className="font-bold text-primary text-sm py-1.5">
                            {(items[index]?.quantity || 0) * (items[index]?.unitPrice || 0)} FCFA
                          </div>
                        )}
                      />
                    </div>
                    <div>
                      {fields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="px-3 py-1.5 border border-danger rounded text-danger text-xs bg-white cursor-pointer hover:bg-danger-50"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('isExpress')}
                  className="w-4 h-4"
                />
                <span className="text-sm text-neutral-700">Express Service (2x price — same-day delivery)</span>
              </label>
            </div>

            <div className="mt-4 pt-4 border-t border-neutral-200">
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Notes</label>
              <textarea
                {...register('notes')}
                rows={2}
                placeholder="Any special instructions..."
                className="w-full px-3 py-2 border border-neutral-300 rounded text-sm resize-y"
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="bg-white border border-neutral-200 rounded p-6 shadow-sm">
            <h2 className="text-lg font-bold text-neutral-800 mb-5">Delivery & Payment</h2>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Delivery Method</label>
                <div className="space-y-3">
                  {[
                    { value: 'pickup', label: 'Customer Pickup', desc: 'Customer collects at branch' },
                    { value: 'delivery', label: 'Home Delivery', desc: 'Deliver to customer address' },
                  ].map((opt) => (
                    <label key={opt.value} className={`flex items-start gap-3 p-3 border rounded cursor-pointer ${
                      watch('deliveryMethod') === opt.value ? 'border-primary bg-primary-50' : 'border-neutral-200'
                    }`}>
                      <input
                        type="radio"
                        value={opt.value}
                        {...register('deliveryMethod')}
                        className="mt-0.5"
                      />
                      <div>
                        <div className="text-sm font-medium text-neutral-800">{opt.label}</div>
                        <div className="text-xs text-neutral-500">{opt.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Payment Method</label>
                <div className="space-y-3">
                  {[
                    { value: 'cash', label: 'Cash', desc: 'Pay at branch' },
                    { value: 'mtn', label: 'MTN Mobile Money', desc: '+237 6XX XXX XXX' },
                    { value: 'orange', label: 'Orange Money', desc: '+237 6XX XXX XXX' },
                    { value: 'card', label: 'Card', desc: 'Credit / Debit card' },
                  ].map((opt) => (
                    <label key={opt.value} className={`flex items-start gap-3 p-3 border rounded cursor-pointer ${
                      watch('paymentMethod') === opt.value ? 'border-primary bg-primary-50' : 'border-neutral-200'
                    }`}>
                      <input
                        type="radio"
                        value={opt.value}
                        {...register('paymentMethod')}
                        className="mt-0.5"
                      />
                      <div>
                        <div className="text-sm font-medium text-neutral-800">{opt.label}</div>
                        <div className="text-xs text-neutral-500">{opt.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="bg-white border border-neutral-200 rounded p-6 shadow-sm">
            <h2 className="text-lg font-bold text-neutral-800 mb-5">Review Order</h2>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-sm font-bold text-neutral-700 mb-3">Customer</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="text-neutral-500">Name:</span> {watch('customerName')}</p>
                  <p><span className="text-neutral-500">Phone:</span> {watch('customerPhone')}</p>
                  <p><span className="text-neutral-500">Email:</span> {watch('customerEmail') || '—'}</p>
                  <p><span className="text-neutral-500">Branch:</span> {watch('branch')}</p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold text-neutral-700 mb-3">Delivery & Payment</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="text-neutral-500">Delivery:</span> {watch('deliveryMethod') === 'pickup' ? 'Customer Pickup' : 'Home Delivery'}</p>
                  <p><span className="text-neutral-500">Payment:</span> {watch('paymentMethod') === 'cash' ? 'Cash' : watch('paymentMethod') === 'mtn' ? 'MTN Mobile Money' : watch('paymentMethod') === 'orange' ? 'Orange Money' : 'Card'}</p>
                  <p><span className="text-neutral-500">Express:</span> {watch('isExpress') ? 'Yes' : 'No'}</p>
                </div>
              </div>
            </div>

            <div className="border border-neutral-200 rounded overflow-hidden mb-6">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-neutral-50">
                    <th className="px-4 py-2 text-left text-primary font-bold border-b border-neutral-200">Garment</th>
                    <th className="px-4 py-2 text-left text-primary font-bold border-b border-neutral-200">Service</th>
                    <th className="px-4 py-2 text-right text-primary font-bold border-b border-neutral-200">Qty</th>
                    <th className="px-4 py-2 text-right text-primary font-bold border-b border-neutral-200">Price</th>
                    <th className="px-4 py-2 text-right text-primary font-bold border-b border-neutral-200">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, i) => (
                    <tr key={i} className="border-b border-neutral-100">
                      <td className="px-4 py-2">{item.garmentType}</td>
                      <td className="px-4 py-2 text-neutral-600">{item.service}</td>
                      <td className="px-4 py-2 text-right">{item.quantity}</td>
                      <td className="px-4 py-2 text-right">{item.unitPrice.toLocaleString()} FCFA</td>
                      <td className="px-4 py-2 text-right font-medium">{(item.quantity * item.unitPrice).toLocaleString()} FCFA</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-neutral-200">
              <div className="text-sm text-neutral-500">Total Items: {totalItems}</div>
              <div className="text-right">
                <div className="text-sm text-neutral-500">Total Amount</div>
                <div className="text-3xl font-bold text-primary">{total.toLocaleString()} FCFA</div>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-6">
          <button
            type="button"
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
            className="px-6 py-2 text-sm font-medium text-neutral-600 bg-white border border-neutral-300 rounded hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Back
          </button>

          <div className="flex gap-3">
            {step < totalSteps ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
                className="px-6 py-2 text-sm font-bold text-white bg-primary rounded hover:bg-primary-dark disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="px-8 py-2 text-sm font-bold text-white bg-success rounded hover:bg-success-dark border-none cursor-pointer"
              >
                Create Order
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
