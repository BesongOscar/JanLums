import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useReportsSummary, useTopServices } from '../hooks/useReports';
import { useCustomers } from '../hooks/useCustomers';
import { useEmployees, useShifts, useAttendance } from '../hooks/useEmployees';
import { useInventory, useInventoryTransactions } from '../hooks/useInventory';
import { useVehicles, useDrivers, useRoutes, useStops } from '../hooks/useDelivery';
import { LoadingState } from '../components/ui/States';

export default function Reports() {
  const { user } = useAuth();
  const tenantId = user?.tenantId || '';
  const [reportTab, setReportTab] = useState('revenue');
  const [period, setPeriod] = useState('weekly');

  const { data: summary, isLoading: summaryLoading } = useReportsSummary(tenantId, period);
  const { data: topServices, isLoading: servicesLoading } = useTopServices(tenantId);
  const { data: customersData, isLoading: customersLoading } = useCustomers(tenantId);
  const { data: employeesData, isLoading: employeesLoading } = useEmployees(tenantId);
  const { data: shiftsData } = useShifts(tenantId);
  const { data: attendanceData } = useAttendance(tenantId);
  const { data: inventoryData, isLoading: inventoryLoading } = useInventory(tenantId);
  const { data: transactionsData } = useInventoryTransactions(tenantId);
  const { data: vehicles } = useVehicles(tenantId);
  const { data: drivers } = useDrivers(tenantId);
  const { data: routes } = useRoutes(tenantId);
  const { data: stops } = useStops(tenantId);

  const isLoading = summaryLoading || servicesLoading;

  const summaryRows = Array.isArray(summary) ? summary : [];
  const services = Array.isArray(topServices) ? topServices : [];
  const customers = Array.isArray(customersData) ? customersData : [];
  const employees = Array.isArray(employeesData) ? employeesData : [];
  const shifts = Array.isArray(shiftsData) ? shiftsData : [];
  const attendance = Array.isArray(attendanceData) ? attendanceData : [];
  const inventory = Array.isArray(inventoryData) ? inventoryData : [];
  const transactions = Array.isArray(transactionsData) ? transactionsData : [];
  const vehicleList = Array.isArray(vehicles) ? vehicles : [];
  const driverList = Array.isArray(drivers) ? drivers : [];
  const routeList = Array.isArray(routes) ? routes : [];
  const stopList = Array.isArray(stops) ? stops : [];

  const totals = summaryRows.length > 0 ? {
    revenue: summaryRows.reduce((s: number, r: any) => s + r.revenue, 0),
    orders: summaryRows.reduce((s: number, r: any) => s + r.orders, 0),
    avgOrder: summaryRows.reduce((s: number, r: any) => s + r.avgOrder, 0) / summaryRows.length,
  } : null;

  const today = new Date().toISOString().split('T')[0];
  const todayAttendance = attendance.filter((a: any) => {
    const dateStr = a.date ? new Date(a.date).toISOString().split('T')[0] : '';
    return dateStr === today;
  });
  const presentToday = todayAttendance.filter((a: any) => a.status === 'present' || a.status === 'checked_in').length;

  const lowStockItems = inventory.filter((i: any) => {
    const qty = Number(i.quantity) || 0;
    const reorder = Number(i.reorderLevel) || 0;
    return reorder > 0 && qty <= reorder;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingState />
      </div>
    );
  }

  return (
    <div>
      <div className="page-chrome">
        <h1 className="page-title">Reports & Analytics</h1>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-primary rounded bg-white text-primary text-sm cursor-pointer hover:bg-primary-50">Export Excel</button>
          <button className="px-4 py-2 border border-primary rounded bg-white text-primary text-sm cursor-pointer hover:bg-primary-50">Export PDF</button>
        </div>
      </div>

      <div className="bg-white border border-neutral-200 border-t-0 px-6 py-5 mb-6">
        <div className="flex justify-between items-center">
          <div className="flex gap-3">
            {['revenue', 'services', 'customers', 'productivity', 'inventory', 'delivery'].map(t => (
              <button key={t} onClick={() => setReportTab(t)}
                className={`px-4 py-1.5 rounded text-xs font-bold border-none cursor-pointer capitalize ${reportTab === t ? 'bg-primary text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}>{t}</button>
            ))}
          </div>
          <select value={period} onChange={e => setPeriod(e.target.value)}
            className="px-3 py-1.5 border border-neutral-300 rounded text-xs">
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
      </div>

      {reportTab === 'revenue' && (
        <>
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              { label: `Total Revenue (${period})`, value: totals ? `${totals.revenue.toLocaleString()} FCFA` : '—', color: 'text-primary' },
              { label: 'Total Orders', value: totals ? String(totals.orders) : '—', color: 'text-success' },
              { label: 'Avg Order Value', value: totals ? `${Math.round(totals.avgOrder).toLocaleString()} FCFA` : '—', color: 'text-warning' },
              { label: 'Periods', value: String(summaryRows.length), color: 'text-info' },
            ].map(s => (
              <div key={s.label} className="bg-white border border-neutral-200 rounded p-5 shadow-sm">
                <div className="text-xs text-neutral-500 mb-1">{s.label}</div>
                <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              </div>
            ))}
          </div>

          <div className="data-table">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-neutral-50">
                  {['Period', 'Revenue', 'Orders', 'Avg Order', 'Services Rendered'].map(h => (
                    <th key={h} className="px-6 py-3 text-left font-bold text-primary border-b-2 border-neutral-200">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {summaryRows.length === 0 ? (
                  <tr><td colSpan={5} className="text-center text-sm text-neutral-400 py-12">No data for this period</td></tr>
                ) : (
                  summaryRows.map((r: any, i: number) => (
                    <tr key={r.period} className={`${i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'} hover:bg-primary-50 transition-colors`}>
                      <td className="px-6 py-3 border-b border-neutral-200 font-medium">{r.period}</td>
                      <td className="px-6 py-3 border-b border-neutral-200 font-bold text-primary">{r.revenue.toLocaleString()} FCFA</td>
                      <td className="px-6 py-3 border-b border-neutral-200">{r.orders}</td>
                      <td className="px-6 py-3 border-b border-neutral-200">{r.avgOrder.toLocaleString()} FCFA</td>
                      <td className="px-6 py-3 border-b border-neutral-200">{r.services}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {reportTab === 'services' && (
        <div className="data-table">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-neutral-50">
                {['Service', 'Orders', 'Revenue', 'Share %'].map(h => (
                  <th key={h} className="px-6 py-3 text-left font-bold text-primary border-b-2 border-neutral-200">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {services.length === 0 ? (
                <tr><td colSpan={4} className="text-center text-sm text-neutral-400 py-12">No service data yet</td></tr>
              ) : (
                services.map((s: any, i: number) => (
                  <tr key={s.name} className={`${i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'} hover:bg-primary-50 transition-colors`}>
                    <td className="px-6 py-3 border-b border-neutral-200 font-medium">{s.name}</td>
                    <td className="px-6 py-3 border-b border-neutral-200">{s.orders}</td>
                    <td className="px-6 py-3 border-b border-neutral-200 font-bold">{s.revenue.toLocaleString()} FCFA</td>
                    <td className="px-6 py-3 border-b border-neutral-200">
                      <div className="flex items-center gap-2">
                        <div className="h-2 bg-primary-100 rounded-full w-24">
                          <div className="h-2 bg-primary rounded-full" style={{width: `${s.share}%`}} />
                        </div>
                        <span className="text-xs text-neutral-500">{s.share}%</span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {reportTab === 'customers' && (
        <>
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total Customers', value: customersLoading ? '...' : String(customers.length), color: 'text-primary' },
              { label: 'Active', value: customersLoading ? '...' : String(customers.filter((c: any) => c.isActive !== false).length), color: 'text-success' },
              { label: 'Inactive', value: customersLoading ? '...' : String(customers.filter((c: any) => c.isActive === false).length), color: 'text-danger' },
              { label: 'Total Spent', value: customersLoading ? '...' : `${customers.reduce((s: number, c: any) => s + (Number(c.totalSpent) || 0), 0).toLocaleString()} FCFA`, color: 'text-warning' },
            ].map(s => (
              <div key={s.label} className="bg-white border border-neutral-200 rounded p-5 shadow-sm">
                <div className="text-xs text-neutral-500 mb-1">{s.label}</div>
                <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              </div>
            ))}
          </div>

          <div className="data-table">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-neutral-50">
                  {['Name', 'Phone', 'Email', 'Orders', 'Total Spent'].map(h => (
                    <th key={h} className="px-6 py-3 text-left font-bold text-primary border-b-2 border-neutral-200">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {customers.length === 0 ? (
                  <tr><td colSpan={5} className="text-center text-sm text-neutral-400 py-12">No customers yet</td></tr>
                ) : (
                  customers.map((c: any, i: number) => (
                    <tr key={c.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'} hover:bg-primary-50 transition-colors`}>
                      <td className="px-6 py-3 border-b border-neutral-200 font-medium">{c.firstName} {c.lastName}</td>
                      <td className="px-6 py-3 border-b border-neutral-200">{c.phone || '—'}</td>
                      <td className="px-6 py-3 border-b border-neutral-200">{c.email || '—'}</td>
                      <td className="px-6 py-3 border-b border-neutral-200">{c.totalOrders || 0}</td>
                      <td className="px-6 py-3 border-b border-neutral-200 font-bold">{(Number(c.totalSpent) || 0).toLocaleString()} FCFA</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {reportTab === 'productivity' && (
        <>
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total Employees', value: employeesLoading ? '...' : String(employees.length), color: 'text-primary' },
              { label: 'Present Today', value: String(presentToday), color: 'text-success' },
              { label: 'Active Shifts', value: String(shifts.length), color: 'text-info' },
              { label: 'On Leave', value: employeesLoading ? '...' : String(employees.filter((e: any) => e.status === 'on_leave' || e.status === 'absent').length), color: 'text-warning' },
            ].map(s => (
              <div key={s.label} className="bg-white border border-neutral-200 rounded p-5 shadow-sm">
                <div className="text-xs text-neutral-500 mb-1">{s.label}</div>
                <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              </div>
            ))}
          </div>

          <div className="data-table">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-neutral-50">
                  {['Name', 'Role', 'Phone', 'Status', 'Shifts'].map(h => (
                    <th key={h} className="px-6 py-3 text-left font-bold text-primary border-b-2 border-neutral-200">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {employees.length === 0 ? (
                  <tr><td colSpan={5} className="text-center text-sm text-neutral-400 py-12">No employees yet</td></tr>
                ) : (
                  employees.map((e: any, i: number) => (
                    <tr key={e.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'} hover:bg-primary-50 transition-colors`}>
                      <td className="px-6 py-3 border-b border-neutral-200 font-medium">{e.firstName} {e.lastName}</td>
                      <td className="px-6 py-3 border-b border-neutral-200">{e.role || '—'}</td>
                      <td className="px-6 py-3 border-b border-neutral-200">{e.phone || '—'}</td>
                      <td className="px-6 py-3 border-b border-neutral-200">
                        <span className={`text-xs px-2 py-0.5 rounded ${e.status === 'active' ? 'bg-success-100 text-success-700' : 'bg-neutral-100 text-neutral-500'}`}>
                          {e.status || 'active'}
                        </span>
                      </td>
                      <td className="px-6 py-3 border-b border-neutral-200">{e.shiftCount ?? '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {reportTab === 'inventory' && (
        <>
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total Items', value: inventoryLoading ? '...' : String(inventory.length), color: 'text-primary' },
              { label: 'Low Stock', value: String(lowStockItems.length), color: lowStockItems.length > 0 ? 'text-danger' : 'text-success' },
              { label: 'Transactions', value: String(transactions.length), color: 'text-info' },
              { label: 'Categories', value: inventoryLoading ? '...' : String(new Set(inventory.map((i: any) => i.category).filter(Boolean)).size), color: 'text-warning' },
            ].map(s => (
              <div key={s.label} className="bg-white border border-neutral-200 rounded p-5 shadow-sm">
                <div className="text-xs text-neutral-500 mb-1">{s.label}</div>
                <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              </div>
            ))}
          </div>

          <div className="data-table">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-neutral-50">
                  {['Item', 'Category', 'Quantity', 'Unit', 'Status'].map(h => (
                    <th key={h} className="px-6 py-3 text-left font-bold text-primary border-b-2 border-neutral-200">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {inventory.length === 0 ? (
                  <tr><td colSpan={5} className="text-center text-sm text-neutral-400 py-12">No inventory items yet</td></tr>
                ) : (
                  inventory.map((item: any, i: number) => {
                    const qty = Number(item.quantity) || 0;
                    const reorder = Number(item.reorderLevel) || 0;
                    const isLow = reorder > 0 && qty <= reorder;
                    return (
                      <tr key={item.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'} hover:bg-primary-50 transition-colors`}>
                        <td className="px-6 py-3 border-b border-neutral-200 font-medium">{item.name}</td>
                        <td className="px-6 py-3 border-b border-neutral-200">{item.category || '—'}</td>
                        <td className="px-6 py-3 border-b border-neutral-200">
                          <span className={isLow ? 'text-danger font-bold' : ''}>{qty}</span>
                        </td>
                        <td className="px-6 py-3 border-b border-neutral-200">{item.unit || '—'}</td>
                        <td className="px-6 py-3 border-b border-neutral-200">
                          {isLow ? (
                            <span className="text-xs bg-danger-100 text-danger-700 px-2 py-0.5 rounded">Low Stock</span>
                          ) : (
                            <span className="text-xs bg-success-100 text-success-700 px-2 py-0.5 rounded">In Stock</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {reportTab === 'delivery' && (
        <>
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Vehicles', value: String(vehicleList.length), color: 'text-primary' },
              { label: 'Drivers', value: String(driverList.length), color: 'text-success' },
              { label: 'Routes', value: String(routeList.length), color: 'text-info' },
              { label: 'Stops', value: String(stopList.length), color: 'text-warning' },
            ].map(s => (
              <div key={s.label} className="bg-white border border-neutral-200 rounded p-5 shadow-sm">
                <div className="text-xs text-neutral-500 mb-1">{s.label}</div>
                <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="bg-white border border-neutral-200 rounded shadow-sm">
              <div className="px-5 py-4 border-b border-neutral-200">
                <h3 className="text-base font-bold text-neutral-800">Vehicles</h3>
              </div>
              <div className="divide-y divide-neutral-100">
                {vehicleList.length === 0 ? (
                  <div className="px-5 py-6 text-center text-sm text-neutral-400">No vehicles</div>
                ) : (
                  vehicleList.map((v: any) => (
                    <div key={v.id} className="px-5 py-3 flex items-center justify-between text-sm">
                      <span className="font-medium">{v.name || v.plateNumber || v.id?.slice(0, 8)}</span>
                      <span className="text-neutral-500">{v.type || '—'}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="bg-white border border-neutral-200 rounded shadow-sm">
              <div className="px-5 py-4 border-b border-neutral-200">
                <h3 className="text-base font-bold text-neutral-800">Routes</h3>
              </div>
              <div className="divide-y divide-neutral-100">
                {routeList.length === 0 ? (
                  <div className="px-5 py-6 text-center text-sm text-neutral-400">No routes</div>
                ) : (
                  routeList.map((r: any) => (
                    <div key={r.id} className="px-5 py-3 flex items-center justify-between text-sm">
                      <span className="font-medium">{r.name || r.id?.slice(0, 8)}</span>
                      <span className="text-neutral-500">{r.stops || r.stopCount || 0} stops</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
