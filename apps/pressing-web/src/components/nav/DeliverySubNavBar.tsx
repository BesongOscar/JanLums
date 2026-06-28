import { Link, useLocation } from 'react-router-dom';

const tabs = [
  { label: 'Routes', path: '/delivery/routes' },
  { label: 'Vehicles', path: '/delivery/vehicles' },
  { label: 'Drivers', path: '/delivery/drivers' },
  { label: 'Stops', path: '/delivery/stops' },
];

export default function DeliverySubNavBar() {
  const location = useLocation();

  return (
    <div className="h-12 bg-primary-100 flex items-center px-6 gap-6 sticky top-12 z-40">
      <Link
        to="/delivery"
        className={`text-base font-bold no-underline py-1 ${
          location.pathname === '/delivery' ? 'text-primary underline underline-offset-4' : 'text-neutral-800'
        }`}
      >
        Overview
      </Link>
      {tabs.map((tab) => (
        <Link
          key={tab.path}
          to={tab.path}
          className={`text-base font-bold no-underline py-1 ${
            location.pathname.startsWith(tab.path) ? 'text-primary underline underline-offset-4' : 'text-neutral-800'
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
