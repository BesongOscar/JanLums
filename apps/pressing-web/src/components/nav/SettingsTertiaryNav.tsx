import { Link, useLocation } from 'react-router-dom';

interface TertiarySection {
  path: string;
  tabs: { label: string; path: string }[];
}

const sections: TertiarySection[] = [
  {
    path: '/settings/services',
    tabs: [
      { label: 'Service Types', path: '/settings/services/types' },
      { label: 'Service Packages', path: '/settings/services/packages' },
    ],
  },
  {
    path: '/settings/pricing',
    tabs: [
      { label: 'Pricing Rules', path: '/settings/pricing/rules' },
      { label: 'Customer Tiers', path: '/settings/pricing/tiers' },
    ],
  },
  {
    path: '/settings/delivery',
    tabs: [
      { label: 'Zones', path: '/settings/delivery/zones' },
      { label: 'Vehicle Types', path: '/settings/delivery/vehicle-types' },
    ],
  },
];

export default function SettingsTertiaryNav() {
  const location = useLocation();
  const section = sections.find((s) => location.pathname.startsWith(s.path));

  if (!section) return null;

  return (
    <div className="h-10 bg-white flex items-center px-6 gap-4 border-b border-neutral-200 sticky top-24 z-30">
      {section.tabs.map((tab) => (
        <Link
          key={tab.path}
          to={tab.path}
          className={`text-xs font-medium no-underline py-1 ${
            location.pathname === tab.path ? 'text-primary font-bold' : 'text-neutral-500'
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
