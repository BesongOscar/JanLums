import { useNavigate } from 'react-router-dom';
import OrderTimeline from '../components/ui/OrderTimeline';

const mockOrder = {
  id: 'ORD-001',
  customer: 'Jean Dupont',
  phone: '+237 612 345 678',
  email: 'jean.dupont@email.com',
  status: 'Processing',
  total: 12500,
  date: '2024-01-15',
  branch: 'Yaounde Main',
  paymentMethod: 'Cash',
  notes: 'Delicate fabrics — handle with care',
  items: [
    { garment: 'Shirt', service: 'Wash & Fold', qty: 3, price: 500 },
    { garment: 'Suit', service: 'Dry Cleaning', qty: 1, price: 1500 },
    { garment: 'Trouser', service: 'Ironing / Pressing', qty: 1, price: 300 },
  ],
  timeline: [
    { status: 'received', label: 'Order Received', timestamp: '2024-01-15 08:30', actor: 'Counter: Alice', active: false },
    { status: 'in_wash', label: 'Washing Started', timestamp: '2024-01-15 09:15', actor: 'Washer: David', active: false },
    { status: 'in_press', label: 'Pressing Started', timestamp: '2024-01-15 10:30', actor: 'Presser: Emma', active: true },
    { status: 'quality_check', label: 'Quality Check', active: false },
    { status: 'ready', label: 'Ready for Pickup', active: false },
  ],
  payments: [
    { method: 'Cash', amount: 12500, status: 'Paid', date: '2024-01-15 08:30' },
  ],
};

const statusStyles: Record<string, string> = {
  Processing: 'bg-warning-100 text-warning-700',
  Ready: 'bg-success-100 text-success-700',
  Pending: 'bg-warning-100 text-warning-700',
  Completed: 'bg-success-100 text-success-700',
  Paid: 'bg-success-100 text-success-700',
  Cash: 'bg-info-100 text-info-700',
};

export default function OrderDetail() {
  const navigate = useNavigate();
  const order = mockOrder;

  const getStatusClass = (status: string) =>
    statusStyles[status] || 'bg-neutral-100 text-neutral-600';

  return (
    <div>
      <div className="page-chrome">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/orders')}
            className="text-primary hover:text-primary-dark text-sm no-underline bg-transparent border-none cursor-pointer"
          >
            &larr; Back to Orders
          </button>
          <h1 className="page-title">{order.id}</h1>
          <span className={`status-pill ${getStatusClass(order.status)}`}>{order.status}</span>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-primary text-white rounded text-sm font-bold border-none cursor-pointer hover:bg-primary-dark">
            Update Status
          </button>
          <button className="px-4 py-2 border border-neutral-300 rounded bg-white text-sm cursor-pointer hover:bg-neutral-50">
            Print Label
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mt-6">
        <div className="col-span-2 space-y-6">
          <div className="bg-white border border-neutral-200 rounded shadow-sm">
            <div className="px-6 py-4 border-b border-neutral-200">
              <h2 className="text-base font-bold text-neutral-800">Order Items</h2>
            </div>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-neutral-50">
                  <th className="px-6 py-3 text-left text-primary font-bold border-b border-neutral-200">Garment</th>
                  <th className="px-6 py-3 text-left text-primary font-bold border-b border-neutral-200">Service</th>
                  <th className="px-6 py-3 text-right text-primary font-bold border-b border-neutral-200">Qty</th>
                  <th className="px-6 py-3 text-right text-primary font-bold border-b border-neutral-200">Unit Price</th>
                  <th className="px-6 py-3 text-right text-primary font-bold border-b border-neutral-200">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, i) => (
                  <tr key={i} className="border-b border-neutral-100">
                    <td className="px-6 py-3">{item.garment}</td>
                    <td className="px-6 py-3 text-neutral-600">{item.service}</td>
                    <td className="px-6 py-3 text-right">{item.qty}</td>
                    <td className="px-6 py-3 text-right">{item.price.toLocaleString()} FCFA</td>
                    <td className="px-6 py-3 text-right font-medium">{(item.qty * item.price).toLocaleString()} FCFA</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={4} className="px-6 py-3 text-right font-bold text-neutral-800">Total</td>
                  <td className="px-6 py-3 text-right font-bold text-primary text-base">{order.total.toLocaleString()} FCFA</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="bg-white border border-neutral-200 rounded shadow-sm">
            <div className="px-6 py-4 border-b border-neutral-200">
              <h2 className="text-base font-bold text-neutral-800">Timeline</h2>
            </div>
            <div className="p-6">
              <OrderTimeline entries={order.timeline} />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-neutral-200 rounded shadow-sm">
            <div className="px-6 py-4 border-b border-neutral-200">
              <h2 className="text-base font-bold text-neutral-800">Customer</h2>
            </div>
            <div className="p-6 space-y-3">
              <div>
                <div className="text-xs text-neutral-500">Name</div>
                <div className="text-sm font-medium text-neutral-800">{order.customer}</div>
              </div>
              <div>
                <div className="text-xs text-neutral-500">Phone</div>
                <div className="text-sm text-neutral-800">{order.phone}</div>
              </div>
              <div>
                <div className="text-xs text-neutral-500">Email</div>
                <div className="text-sm text-neutral-800">{order.email}</div>
              </div>
              <button className="w-full mt-2 px-4 py-2 border border-primary rounded text-primary text-sm font-medium bg-transparent cursor-pointer hover:bg-primary-50">
                View Customer Profile
              </button>
            </div>
          </div>

          <div className="bg-white border border-neutral-200 rounded shadow-sm">
            <div className="px-6 py-4 border-b border-neutral-200">
              <h2 className="text-base font-bold text-neutral-800">Payments</h2>
            </div>
            <div className="p-6 space-y-3">
              {order.payments.map((pmt, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-neutral-800">{pmt.method}</div>
                    <div className="text-xs text-neutral-400">{pmt.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold">{pmt.amount.toLocaleString()} FCFA</div>
                    <span className={`status-pill text-xs ${getStatusClass(pmt.status)}`}>{pmt.status}</span>
                  </div>
                </div>
              ))}
              <button className="w-full mt-2 px-4 py-2 bg-primary text-white rounded text-sm font-bold border-none cursor-pointer hover:bg-primary-dark">
                Record Payment
              </button>
            </div>
          </div>

          <div className="bg-white border border-neutral-200 rounded shadow-sm">
            <div className="px-6 py-4 border-b border-neutral-200">
              <h2 className="text-base font-bold text-neutral-800">Details</h2>
            </div>
            <div className="p-6 space-y-3">
              <div>
                <div className="text-xs text-neutral-500">Branch</div>
                <div className="text-sm text-neutral-800">{order.branch}</div>
              </div>
              <div>
                <div className="text-xs text-neutral-500">Date</div>
                <div className="text-sm text-neutral-800">{order.date}</div>
              </div>
              <div>
                <div className="text-xs text-neutral-500">Payment Method</div>
                <div className="text-sm text-neutral-800">{order.paymentMethod}</div>
              </div>
              {order.notes && (
                <div>
                  <div className="text-xs text-neutral-500">Notes</div>
                  <div className="text-sm text-neutral-600 italic">{order.notes}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
