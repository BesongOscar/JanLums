import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import PageTemplate from './components/PageTemplate';
import Dashboard from './pages/Dashboard';
import Tenants from './pages/Tenants';
import TenantDetail from './pages/TenantDetail';
import Users from './pages/Users';
import Analytics from './pages/Analytics';
import System from './pages/System';
import Billing from './pages/Billing';
import Login from './pages/Login';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isPlatformAdmin } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isPlatformAdmin) return <div className="p-8 text-center text-red-600" role="alert">Access denied. Platform admin only.</div>;
  return <>{children}</>;
}

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<ProtectedRoute><PageTemplate title="Platform Dashboard"><Dashboard /></PageTemplate></ProtectedRoute>} />
      <Route path="/tenants" element={<ProtectedRoute><PageTemplate title="Tenants"><Tenants /></PageTemplate></ProtectedRoute>} />
      <Route path="/tenants/:id" element={<ProtectedRoute><PageTemplate title="Tenant Detail"><TenantDetail /></PageTemplate></ProtectedRoute>} />
      <Route path="/users" element={<ProtectedRoute><PageTemplate title="Users"><Users /></PageTemplate></ProtectedRoute>} />
      <Route path="/analytics" element={<ProtectedRoute><PageTemplate title="Analytics"><Analytics /></PageTemplate></ProtectedRoute>} />
      <Route path="/billing" element={<ProtectedRoute><PageTemplate title="Billing & Subscriptions"><Billing /></PageTemplate></ProtectedRoute>} />
      <Route path="/system" element={<ProtectedRoute><PageTemplate title="System Configuration"><System /></PageTemplate></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
