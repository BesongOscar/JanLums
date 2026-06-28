import { Link, useLocation } from 'react-router-dom';

const tabs = [
  { label: 'Periods', path: '/payroll' },
  { label: 'Work Entries', path: '/payroll/work-entries' },
  { label: 'Payslips', path: '/payroll/payslips' },
  { label: 'Reports', path: '/payroll/reports' },
];

export default function PayrollSubNavBar() {
  const location = useLocation();

  return (
    <div className="h-12 bg-primary-100 flex items-center px-6 gap-6 sticky top-12 z-40">
      {tabs.map((tab) => (
        <Link
          key={tab.path}
          to={tab.path}
          className={`text-base font-bold no-underline py-1 ${
            location.pathname === tab.path || (tab.path !== '/payroll' && location.pathname.startsWith(tab.path))
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
