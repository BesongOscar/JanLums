import { Link, useLocation } from 'react-router-dom';

const tabs = [
  { label: 'Orders', path: '/orders' },
  { label: 'Lots', path: '/lots' },
  { label: 'Garments', path: '/garments' },
];

export default function OrdersSubNavBar() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/orders') return location.pathname === '/orders' || location.pathname.startsWith('/orders/');
    return location.pathname.startsWith(path);
  };

  return (
    <div className="h-12 bg-primary-100 flex items-center px-6 gap-6 sticky top-12 z-40">
      {tabs.map((tab) => (
        <Link
          key={tab.path}
          to={tab.path}
          className={`text-base font-bold no-underline py-1 ${
            isActive(tab.path) ? 'text-primary underline underline-offset-4' : 'text-neutral-800'
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
