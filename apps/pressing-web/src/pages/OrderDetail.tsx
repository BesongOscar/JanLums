import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useOrderById } from '../hooks/useOrders';
import OrderTimeline from '../components/ui/OrderTimeline';
import { LoadingState } from '../components/ui/States';

const statusStyles: Record<string, string> = {
  processing: 'bg-warning-100 text-warning-700',
  ready: 'bg-success-100 text-success-700',
  pending: 'bg-warning-100 text-warning-700',
  completed: 'bg-success-100 text-success-700',
  paid: 'bg-success-100 text-success-700',
};

export default function OrderDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const tenantId = user?.tenantId || '';
  const { data: order, isLoading, error } = useOrderById(tenantId, id || '');

  const getStatusClass = (status: string) =>
    statusStyles[status] || 'bg-neutral-100 text-neutral-600';

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingState />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-neutral-500 text-sm">Order not found</p>
        <button onClick={() => navigate('/orders')}
          className="px-4 py-2 border border-primary rounded text-primary text-sm bg-transparent cursor-pointer">
          Back to Orders
        </button>
      </div>
    );
  }

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
          <h1 className="page-title">{order.id?.slice(0, 8)}</h1>
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
                {order.items?.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-sm text-neutral-400">No items</td>
                  </tr>
                ) : (
                  order.items?.map((item: any, i: number) => (
                    <tr key={item.id || i} className="border-b border-neutral-100">
                      <td className="px-6 py-3">{item.garmentType}</td>
                      <td className="px-6 py-3 text-neutral-600">{item.serviceId || '-'}</td>
                      <td className="px-6 py-3 text-right">{item.quantity}</td>
                      <td className="px-6 py-3 text-right">{Number(item.unitPrice).toLocaleString()} FCFA</td>
                      <td className="px-6 py-3 text-right font-medium">{Number(item.totalPrice).toLocaleString()} FCFA</td>
                    </tr>
                  ))
                )}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={4} className="px-6 py-3 text-right font-bold text-neutral-800">Total</td>
                  <td className="px-6 py-3 text-right font-bold text-primary text-base">{Number(order.total).toLocaleString()} FCFA</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {order.timeline && order.timeline.length > 0 && (
            <div className="bg-white border border-neutral-200 rounded shadow-sm">
              <div className="px-6 py-4 border-b border-neutral-200">
                <h2 className="text-base font-bold text-neutral-800">Timeline</h2>
              </div>
              <div className="p-6">
                <OrderTimeline entries={order.timeline} />
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-neutral-200 rounded shadow-sm">
            <div className="px-6 py-4 border-b border-neutral-200">
              <h2 className="text-base font-bold text-neutral-800">Customer</h2>
            </div>
            <div className="p-6 space-y-3">
              <div>
                <div className="text-xs text-neutral-500">Name</div>
                <div className="text-sm font-medium text-neutral-800">
                  {order.customer?.firstName} {order.customer?.lastName}
                </div>
              </div>
              <div>
                <div className="text-xs text-neutral-500">Phone</div>
                <div className="text-sm text-neutral-800">{order.customer?.phone}</div>
              </div>
              <div>
                <div className="text-xs text-neutral-500">Email</div>
                <div className="text-sm text-neutral-800">{order.customer?.email}</div>
              </div>
              {order.customer?.id && (
                <button
                  onClick={() => navigate(`/customers/${order.customer.id}`)}
                  className="w-full mt-2 px-4 py-2 border border-primary rounded text-primary text-sm font-medium bg-transparent cursor-pointer hover:bg-primary-50"
                >
                  View Customer Profile
                </button>
              )}
            </div>
          </div>

          <div className="bg-white border border-neutral-200 rounded shadow-sm">
            <div className="px-6 py-4 border-b border-neutral-200">
              <h2 className="text-base font-bold text-neutral-800">Payments</h2>
            </div>
            <div className="p-6 space-y-3">
              {order.amountPaid > 0 ? (
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-neutral-800">Payment</div>
                    <div className="text-xs text-neutral-400">{order.paymentDetails?.method || '-'}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold">{Number(order.amountPaid).toLocaleString()} FCFA</div>
                    <span className="status-pill text-xs bg-success-100 text-success-700">Paid</span>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-neutral-400 text-center py-2">No payments recorded</div>
              )}
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
                <div className="text-sm text-neutral-800">{order.branch?.name || '-'}</div>
              </div>
              <div>
                <div className="text-xs text-neutral-500">Date</div>
                <div className="text-sm text-neutral-800">
                  {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '-'}
                </div>
              </div>
              <div>
                <div className="text-xs text-neutral-500">Express</div>
                <div className="text-sm text-neutral-800">{order.isExpress ? 'Yes' : 'No'}</div>
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
