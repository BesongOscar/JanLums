import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Building2, Users, BarChart3, CreditCard, Settings, X } from 'lucide-react';

const menuItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/tenants', icon: Building2, label: 'Tenants' },
  { path: '/users', icon: Users, label: 'Users' },
  { path: '/analytics', icon: BarChart3, label: 'Analytics' },
  { path: '/billing', icon: CreditCard, label: 'Billing' },
  { path: '/system', icon: Settings, label: 'System' },
];

interface AdminNavProps {
  open: boolean;
  onClose: () => void;
}

export default function AdminNav({ open, onClose }: AdminNavProps) {
  const location = useLocation();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-gray-900 shadow-lg z-50 transform transition-transform duration-200 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Admin navigation"
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-800">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">LOS</span>
            </div>
            <span className="text-lg font-semibold text-white">LaundryOS</span>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-1 text-gray-400 hover:text-white rounded"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="mt-6 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path ||
              (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                aria-current={isActive ? 'page' : undefined}
                className={`flex items-center px-3 py-2.5 rounded-lg mb-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 ${
                  isActive
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                }`}
              >
                <Icon className="w-5 h-5 mr-3 shrink-0" aria-hidden="true" />
                <span className="font-medium text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
