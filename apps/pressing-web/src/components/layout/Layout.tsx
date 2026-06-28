import { Outlet, useLocation } from 'react-router-dom';
import MainNav from '../nav/MainNav';
import OrdersSubNavBar from '../nav/OrdersSubNavBar';
import DeliverySubNavBar from '../nav/DeliverySubNavBar';
import EmployeesSubNavBar from '../nav/EmployeesSubNavBar';
import PayrollSubNavBar from '../nav/PayrollSubNavBar';
import InventorySubNavBar from '../nav/InventorySubNavBar';
import SettingsSubNavBar from '../nav/SettingsSubNavBar';
import SettingsTertiaryNav from '../nav/SettingsTertiaryNav';

const SUB_NAV_PATHS: { prefix: string; component: 'orders' | 'delivery' | 'employees' | 'payroll' | 'inventory' | 'settings' }[] = [
  { prefix: '/orders', component: 'orders' },
  { prefix: '/lots', component: 'orders' },
  { prefix: '/garments', component: 'orders' },
  { prefix: '/delivery', component: 'delivery' },
  { prefix: '/employees', component: 'employees' },
  { prefix: '/payroll', component: 'payroll' },
  { prefix: '/inventory', component: 'inventory' },
  { prefix: '/website', component: 'settings' },
  { prefix: '/settings', component: 'settings' },
];

const subNavComponents = {
  orders: OrdersSubNavBar,
  delivery: DeliverySubNavBar,
  employees: EmployeesSubNavBar,
  payroll: PayrollSubNavBar,
  inventory: InventorySubNavBar,
  settings: SettingsSubNavBar,
};

export default function Layout() {
  const path = useLocation().pathname;
  const match = SUB_NAV_PATHS.find((p) => path.startsWith(p.prefix));
  const SubNav = match ? subNavComponents[match.component] : null;

  return (
    <div className="min-h-screen bg-neutral-50 font-sans">
      <MainNav />
      {SubNav && <SubNav />}
      {path.startsWith('/settings') && path !== '/settings' && <SettingsTertiaryNav />}
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}
