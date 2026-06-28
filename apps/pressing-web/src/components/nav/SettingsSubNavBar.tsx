import { Link, useLocation } from 'react-router-dom';

const tabs = [
  { label: 'Website', path: '/website' },
  { label: 'Services', path: '/settings/services' },
  { label: 'Pricing', path: '/settings/pricing' },
  { label: 'Promotions', path: '/settings/promotions' },
  { label: 'Garment Types', path: '/settings/garment-types' },
  { label: 'Fabric Types', path: '/settings/fabric-types' },
  { label: 'Branches', path: '/settings/branches' },
  { label: 'Employees', path: '/settings/employees' },
  { label: 'Delivery', path: '/settings/delivery' },
  { label: 'Financial', path: '/settings/financial' },
  { label: 'Users', path: '/settings/users' },
  { label: 'System', path: '/settings/system' },
];

function isActive(pathname: string, tabPath: string): boolean {
  if (tabPath === '/website') return pathname === '/website';
  return pathname === tabPath || pathname.startsWith(tabPath + '/');
}

export default function SettingsSubNavBar() {
  const location = useLocation();
  const show = location.pathname === '/website' || location.pathname.startsWith('/settings');

  if (!show) return null;

  return (
    <div className="h-12 bg-primary-100 flex items-center px-6 gap-4 sticky top-12 z-40 overflow-x-auto">
      {tabs.map((tab) => (
        <Link
          key={tab.path}
          to={tab.path}
          className={`text-sm font-bold no-underline py-1 whitespace-nowrap ${
            isActive(location.pathname, tab.path) ? 'text-primary underline underline-offset-4' : 'text-neutral-800'
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
