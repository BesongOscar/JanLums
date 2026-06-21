import { Outlet, Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

const mainNavItems = [
  { path: '/', label: 'Dashboard' },
  { path: '/orders', label: 'Orders' },
  { path: '/customers', label: 'Customers' },
  { path: '/inventory', label: 'Inventory' },
  { path: '/reports', label: 'Reports' },
  { path: '/settings', label: 'Settings' },
];

const subNavItems = [
  { path: '/', label: 'Overview' },
  { path: '/orders', label: 'All Orders' },
  { path: '/orders/new', label: 'New Order' },
];

export default function Layout() {
  const location = useLocation();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F0F3F8', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      {/* Main Navigation - Agencies Style: Blue bar with sky-blue active tab */}
      <nav style={{
        height: '48px',
        backgroundColor: '#0000EE',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
      }}>
        {/* Left: Logo + Nav Items */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <Link to="/" style={{ color: 'white', fontWeight: 'bold', fontSize: '18px', textDecoration: 'none' }}>
            P237
          </Link>
          
          <div style={{ display: 'flex', height: '48px' }}>
            {mainNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 16px',
                  color: isActive(item.path) ? '#000000' : 'white',
                  backgroundColor: isActive(item.path) ? '#C1E4F7' : 'transparent',
                  textDecoration: 'none',
                  fontSize: '15px',
                  fontWeight: 'bold',
                  height: isActive(item.path) ? '75%' : '100%',
                  alignSelf: isActive(item.path) ? 'flex-end' : 'center',
                  borderRadius: isActive(item.path) ? '4px 4px 0 0' : '0',
                  transition: 'all 0.2s',
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Right: User dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: 'white',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            <span>Admin User</span>
            <span>▼</span>
          </button>
          
          {userMenuOpen && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: '100%',
              backgroundColor: 'white',
              border: '1px solid #dee2e6',
              borderRadius: '4px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
              marginTop: '8px',
              minWidth: '160px',
              zIndex: 1001,
            }}>
              <div style={{ padding: '8px 0' }}>
                <Link to="/settings" style={{
                  display: 'block',
                  padding: '8px 16px',
                  color: '#0000EE',
                  textDecoration: 'none',
                  fontSize: '14px',
                }}>
                  Settings
                </Link>
                <button style={{
                  display: 'block',
                  width: '100%',
                  padding: '8px 16px',
                  color: '#0000EE',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '14px',
                }}>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Sub Navigation - Light blue bar */}
      <div style={{
        height: '48px',
        backgroundColor: '#C1E4F7',
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        gap: '24px',
        position: 'sticky',
        top: '48px',
        zIndex: 999,
      }}>
        {subNavItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            style={{
              color: location.pathname === item.path ? '#0000EE' : '#000000',
              textDecoration: location.pathname === item.path ? 'underline' : 'none',
              textUnderlineOffset: '3px',
              fontSize: '18.75px',
              fontWeight: 'bold',
              padding: '4px 0',
            }}
          >
            {item.label}
          </Link>
        ))}
      </div>

      {/* Main Content */}
      <main style={{ padding: '24px' }}>
        <Outlet />
      </main>
    </div>
  );
}
