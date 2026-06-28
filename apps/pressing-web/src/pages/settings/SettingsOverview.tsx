const categories = [
  { label: 'Services', path: '/settings/services', desc: 'Service types, turnaround times, packages', icon: '🔧' },
  { label: 'Pricing', path: '/settings/pricing', desc: 'Pricing rules, customer tiers, dynamic pricing', icon: '💰' },
  { label: 'Promotions', path: '/settings/promotions', desc: 'Coupon codes, discount rules, usage tracking', icon: '🏷️' },
  { label: 'Garment Types', path: '/settings/garment-types', desc: 'Garment catalog, default services, care instructions', icon: '👔' },
  { label: 'Fabric Types', path: '/settings/fabric-types', desc: 'Fabric catalog, care levels, handling notes', icon: '🧵' },
  { label: 'Branches', path: '/settings/branches', desc: 'Branch locations, operating hours, equipment', icon: '🏪' },
  { label: 'Employees', path: '/settings/employees', desc: 'Roles, departments, contract types', icon: '👥' },
  { label: 'Delivery', path: '/settings/delivery', desc: 'Zones, vehicle types, route templates', icon: '🚚' },
  { label: 'Financial', path: '/settings/financial', desc: 'Tax rates, commission rules, payment methods', icon: '📊' },
  { label: 'Users', path: '/settings/users', desc: 'User accounts, role assignments, RBAC', icon: '🔐' },
  { label: 'System', path: '/settings/system', desc: 'Notification templates, integrations, backup', icon: '⚙️' },
];

export default function SettingsOverview() {
  return (
    <div>
      <div className="page-chrome">
        <h1 className="page-title">Settings</h1>
      </div>
      <div className="grid grid-cols-3 gap-5 mt-6">
        {categories.map(c => (
          <a key={c.path} href={c.path}
            className="block bg-white border border-neutral-200 rounded-lg p-5 shadow-sm no-underline hover:border-primary-300 hover:shadow-md transition-all">
            <div className="text-2xl mb-2">{c.icon}</div>
            <h3 className="text-base font-bold text-neutral-800 mb-1">{c.label}</h3>
            <p className="text-xs text-neutral-500">{c.desc}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
