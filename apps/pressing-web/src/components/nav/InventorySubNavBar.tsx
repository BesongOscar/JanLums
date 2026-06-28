import { Link, useLocation } from 'react-router-dom';

const tabs = [
  { label: 'Stock', path: '/inventory' },
  { label: 'Transactions', path: '/inventory/transactions' },
  { label: 'Suppliers', path: '/inventory/suppliers' },
];

export default function InventorySubNavBar() {
  const location = useLocation();

  return (
    <div className="h-12 bg-primary-100 flex items-center px-6 gap-6 sticky top-12 z-40">
      {tabs.map((tab) => (
        <Link
          key={tab.path}
          to={tab.path}
          className={`text-base font-bold no-underline py-1 ${
            location.pathname === tab.path || (tab.path !== '/inventory' && location.pathname.startsWith(tab.path))
              ? 'text-primary underline underline-offset-4'
              : 'text-neutral-800'
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
