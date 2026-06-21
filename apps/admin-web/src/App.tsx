import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/tenants" element={<div>Tenants Management</div>} />
      <Route path="/users" element={<div>Users Management</div>} />
      <Route path="/settings" element={<div>Platform Settings</div>} />
    </Routes>
  );
}

export default App;
