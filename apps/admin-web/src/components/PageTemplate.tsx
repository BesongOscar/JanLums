import { useState, useRef, useEffect, type ReactNode } from 'react';
import { Menu } from 'lucide-react';
import AdminNav from './AdminNav';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface PageTemplateProps {
  title: string;
  children: ReactNode;
}

export default function PageTemplate({ title, children }: PageTemplateProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:ml-64 min-h-screen flex flex-col">
        <header className="bg-white shadow-sm border-b sticky top-0 z-30">
          <div className="flex items-center justify-between h-16 px-4 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                aria-label="Open sidebar"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="text-lg lg:text-xl font-semibold text-gray-900">{title}</h1>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500 hidden sm:block">
                {user?.firstName} {user?.lastName}
              </span>
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center hover:bg-primary-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                  aria-label="User menu"
                  aria-expanded={userMenuOpen}
                >
                  <span className="text-primary-700 font-medium text-sm">
                    {user?.firstName?.charAt(0)?.toUpperCase() || 'A'}
                  </span>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50 py-1">
                    <div className="px-4 py-2 border-b">
                      <p className="text-sm font-medium text-gray-900">{user?.firstName} {user?.lastName}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8" id="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}
