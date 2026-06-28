import { Routes, Route } from 'react-router-dom';
import { PrivateRoute } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Login from './pages/Login';
import CreateOrder from './pages/CreateOrder';
import OrderDetail from './pages/OrderDetail';
import Lots from './pages/Lots';
import LotDetail from './pages/LotDetail';
import Garments from './pages/Garments';
import GarmentDetail from './pages/GarmentDetail';
import Customers from './pages/Customers';
import CustomerDetail from './pages/CustomerDetail';
import Stock from './pages/inventory/Stock';
import StockTransactions from './pages/inventory/StockTransactions';
import Suppliers from './pages/inventory/Suppliers';
import DeliveryOverview from './pages/delivery/DeliveryOverview';
import DeliveryRoutes from './pages/delivery/Routes';
import Vehicles from './pages/delivery/Vehicles';
import Drivers from './pages/delivery/Drivers';
import Stops from './pages/delivery/Stops';
import Staff from './pages/employees/Staff';
import Shifts from './pages/employees/Shifts';
import Attendance from './pages/employees/Attendance';
import Periods from './pages/payroll/Periods';
import WorkEntries from './pages/payroll/WorkEntries';
import Payslips from './pages/payroll/Payslips';
import PayrollReports from './pages/payroll/PayrollReports';
import Reports from './pages/Reports';
import Website from './pages/Website';
import SettingsOverview from './pages/settings/SettingsOverview';
import Services from './pages/settings/Services';
import ServiceTypes from './pages/settings/ServiceTypes';
import ServicePackages from './pages/settings/ServicePackages';
import PricingSettings from './pages/settings/Pricing';
import PricingRules from './pages/settings/PricingRules';
import CustomerTiers from './pages/settings/CustomerTiers';
import Promotions from './pages/settings/Promotions';
import GarmentTypes from './pages/settings/GarmentTypes';
import FabricTypes from './pages/settings/FabricTypes';
import Branches from './pages/settings/Branches';
import EmployeeSettings from './pages/settings/EmployeeSettings';
import DeliverySettings from './pages/settings/DeliverySettings';
import DeliveryZones from './pages/settings/DeliveryZones';
import VehicleTypes from './pages/settings/VehicleTypes';
import FinancialSettings from './pages/settings/FinancialSettings';
import UsersSettings from './pages/settings/UsersSettings';
import SystemSettings from './pages/settings/SystemSettings';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="orders" element={<Orders />} />
        <Route path="orders/new" element={<CreateOrder />} />
        <Route path="orders/:id" element={<OrderDetail />} />
        <Route path="lots" element={<Lots />} />
        <Route path="lots/:id" element={<LotDetail />} />
        <Route path="garments" element={<Garments />} />
        <Route path="garments/:id" element={<GarmentDetail />} />
        <Route path="customers" element={<Customers />} />
        <Route path="customers/:id" element={<CustomerDetail />} />
        <Route path="delivery" element={<DeliveryOverview />} />
        <Route path="delivery/routes" element={<DeliveryRoutes />} />
        <Route path="delivery/vehicles" element={<Vehicles />} />
        <Route path="delivery/drivers" element={<Drivers />} />
        <Route path="delivery/stops" element={<Stops />} />
        <Route path="employees" element={<Staff />} />
        <Route path="employees/shifts" element={<Shifts />} />
        <Route path="employees/attendance" element={<Attendance />} />
        <Route path="payroll" element={<Periods />} />
        <Route path="payroll/work-entries" element={<WorkEntries />} />
        <Route path="payroll/payslips" element={<Payslips />} />
        <Route path="payroll/reports" element={<PayrollReports />} />
        <Route path="inventory" element={<Stock />} />
        <Route path="inventory/transactions" element={<StockTransactions />} />
        <Route path="inventory/suppliers" element={<Suppliers />} />
        <Route path="reports" element={<Reports />} />
        <Route path="website" element={<Website />} />
        <Route path="settings" element={<SettingsOverview />} />
        <Route path="settings/services" element={<Services />} />
        <Route path="settings/services/types" element={<ServiceTypes />} />
        <Route path="settings/services/packages" element={<ServicePackages />} />
        <Route path="settings/pricing" element={<PricingSettings />} />
        <Route path="settings/pricing/rules" element={<PricingRules />} />
        <Route path="settings/pricing/tiers" element={<CustomerTiers />} />
        <Route path="settings/promotions" element={<Promotions />} />
        <Route path="settings/garment-types" element={<GarmentTypes />} />
        <Route path="settings/fabric-types" element={<FabricTypes />} />
        <Route path="settings/branches" element={<Branches />} />
        <Route path="settings/employees" element={<EmployeeSettings />} />
        <Route path="settings/delivery" element={<DeliverySettings />} />
        <Route path="settings/delivery/zones" element={<DeliveryZones />} />
        <Route path="settings/delivery/vehicle-types" element={<VehicleTypes />} />
        <Route path="settings/financial" element={<FinancialSettings />} />
        <Route path="settings/users" element={<UsersSettings />} />
        <Route path="settings/system" element={<SystemSettings />} />
      </Route>
    </Routes>
  );
}
