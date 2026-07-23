import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface NavItem {
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Orders', path: '/orders' },
  { label: 'Customers', path: '/customers' },
  { label: 'Delivery', path: '/delivery' },
  { label: 'Employees', path: '/employees' },
  { label: 'Payroll', path: '/payroll' },
  { label: 'Inventory', path: '/inventory' },
  { label: 'Reports', path: '/reports' },
  { label: 'Settings', path: '/settings' },
  { label: 'Website', path: '/website' },
];

function resolveMainNavActiveLabel(pathname: string): string {
  if (pathname === '/' || pathname.startsWith('/dashboard')) return 'Dashboard';
  if (pathname.startsWith('/orders') || pathname.startsWith('/lots') || pathname.startsWith('/garments')) return 'Orders';
  if (pathname.startsWith('/customers')) return 'Customers';
  if (pathname.startsWith('/delivery')) return 'Delivery';
  if (pathname.startsWith('/employees')) return 'Employees';
  if (pathname.startsWith('/payroll')) return 'Payroll';
  if (pathname.startsWith('/inventory')) return 'Inventory';
  if (pathname.startsWith('/reports')) return 'Reports';
  if (pathname.startsWith('/settings') || pathname.startsWith('/website')) return 'Settings';
  return 'Dashboard';
}

export default function MainNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const activeLabel = resolveMainNavActiveLabel(location.pathname);

  return (
    <nav className="h-12 bg-primary flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex items-center gap-8">
        <Link to="/" className="text-white font-bold text-lg no-underline">
          {user?.tenantName || 'JanLums'}
        </Link>

        <div className="flex h-12">
          {navItems.map((item) => {
            const isActive = activeLabel === item.label;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 no-underline text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-primary-100 text-neutral-900 h-3/4 self-end rounded-t'
                    : 'text-white h-full self-center hover:bg-primary-600'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="relative">
        <button
          onClick={() => setUserMenuOpen(!userMenuOpen)}
          className="flex items-center gap-2 text-white bg-transparent border-none cursor-pointer text-sm"
        >
          <span>{user?.firstName || 'Admin'}</span>
          <span className="text-xs">{userMenuOpen ? '\u25B2' : '\u25BC'}</span>
        </button>

        {userMenuOpen && (
          <div className="absolute right-0 top-full mt-2 bg-white border border-neutral-200 rounded shadow-lg min-w-[160px] z-50">
            <div className="py-2">
              <Link to="/settings" className="block px-4 py-2 text-sm text-primary no-underline hover:bg-neutral-50">
                Settings
              </Link>
              <button onClick={() => { logout(); navigate('/login'); }}
                className="block w-full text-left px-4 py-2 text-sm text-danger bg-transparent border-none cursor-pointer hover:bg-neutral-50">
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
