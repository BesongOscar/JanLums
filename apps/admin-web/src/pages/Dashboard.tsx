import { LayoutDashboard, Building2, Users, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const menuItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/tenants', icon: Building2, label: 'Tenants' },
  { path: '/users', icon: Users, label: 'Users' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

export default function Dashboard() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
        <div className="flex items-center h-16 px-6 border-b">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">LOS</span>
            </div>
            <span className="text-lg font-semibold">LaundryOS</span>
          </div>
        </div>

        <nav className="mt-6 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-2.5 rounded-lg mb-1 transition-colors ${
                  isActive 
                    ? 'bg-primary-50 text-primary-700' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        <header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between h-16 px-8">
            <h1 className="text-xl font-semibold">Platform Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Platform Admin</span>
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-700 font-medium">A</span>
              </div>
            </div>
          </div>
        </header>

        <main className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'Total Tenants', value: '3', color: 'bg-blue-50 text-blue-700' },
              { label: 'Active Users', value: '12', color: 'bg-green-50 text-green-700' },
              { label: 'Total Orders', value: '156', color: 'bg-purple-50 text-purple-700' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-lg shadow-sm border p-6">
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
            <p className="text-gray-500">Activity feed will be displayed here...</p>
          </div>
        </main>
      </div>
    </div>
  );
}
