const templates = [
  { id: 'NT-001', name: 'Order Received', channel: 'SMS', event: 'order.received', content: 'Your order {order_id} has been received. Est. completion: {eta}.', active: true },
  { id: 'NT-002', name: 'Ready for Pickup', channel: 'SMS', event: 'order.ready', content: 'Your order {order_id} is ready for pickup at {branch}.', active: true },
  { id: 'NT-003', name: 'Out for Delivery', channel: 'SMS', event: 'order.out_for_delivery', content: 'Your order {order_id} is out for delivery. Driver: {driver_name}', active: true },
  { id: 'NT-004', name: 'Welcome Message', channel: 'Email', event: 'customer.created', content: 'Welcome to Pressing237! Your account has been created.', active: false },
];

const integrationSettings = [
  { name: 'SMS Gateway', provider: 'Twilio', status: 'Connected', lastSync: '2024-01-27 08:00' },
  { name: 'Email Service', provider: 'SendGrid', status: 'Connected', lastSync: '2024-01-27 08:00' },
  { name: 'Payment Gateway', provider: 'Stripe', status: 'Connected', lastSync: '2024-01-27 07:55' },
  { name: 'Google Drive Backup', provider: 'Google API', status: 'Disconnected', lastSync: '—' },
];

export default function SystemSettings() {
  return (
    <div>
      <div className="page-chrome">
        <h1 className="page-title">System Settings</h1>
      </div>
      <h3 className="text-base font-bold text-neutral-800 mt-6 mb-3">Notification Templates</h3>
      <div className="data-table mb-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-neutral-50">
              {['Template', 'Channel', 'Event', 'Content', 'Active', ''].map(h => (
                <th key={h} className="px-6 py-3 text-left font-bold text-primary border-b-2 border-neutral-200">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {templates.map((t, i) => (
              <tr key={t.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'} hover:bg-primary-50 transition-colors`}>
                <td className="px-6 py-3 border-b border-neutral-200 font-medium">{t.name}</td>
                <td className="px-6 py-3 border-b border-neutral-200"><span className="text-xs bg-info-100 text-info-700 px-2 py-0.5 rounded">{t.channel}</span></td>
                <td className="px-6 py-3 border-b border-neutral-200 text-xs font-mono text-neutral-500">{t.event}</td>
                <td className="px-6 py-3 border-b border-neutral-200 text-xs text-neutral-600 max-w-[300px]">{t.content}</td>
                <td className="px-6 py-3 border-b border-neutral-200">
                  <span className={`status-pill text-xs ${t.active ? 'bg-success-100 text-success-700' : 'bg-neutral-100 text-neutral-500'}`}>{t.active ? 'Active' : 'Inactive'}</span>
                </td>
                <td className="px-6 py-3 border-b border-neutral-200">
                  <button className="px-3 py-1 border border-primary rounded bg-white text-primary cursor-pointer text-xs hover:bg-primary-50">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="text-base font-bold text-neutral-800 mt-8 mb-3">Integrations</h3>
      <div className="data-table">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-neutral-50">
              {['Service', 'Provider', 'Status', 'Last Sync'].map(h => (
                <th key={h} className="px-6 py-3 text-left font-bold text-primary border-b-2 border-neutral-200">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {integrationSettings.map((i, idx) => (
              <tr key={i.name} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-neutral-50'} hover:bg-primary-50 transition-colors`}>
                <td className="px-6 py-3 border-b border-neutral-200 font-medium">{i.name}</td>
                <td className="px-6 py-3 border-b border-neutral-200 text-neutral-600">{i.provider}</td>
                <td className="px-6 py-3 border-b border-neutral-200">
                  <span className={`status-pill text-xs ${i.status === 'Connected' ? 'bg-success-100 text-success-700' : 'bg-danger-100 text-danger-700'}`}>{i.status}</span>
                </td>
                <td className="px-6 py-3 border-b border-neutral-200 text-xs text-neutral-500">{i.lastSync}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
