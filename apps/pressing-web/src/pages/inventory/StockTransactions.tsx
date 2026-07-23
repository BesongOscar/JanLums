import { useState, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useInventoryTransactions, useInventory } from '../../hooks/useInventory';
import { LoadingState } from '../../components/ui/States';

const typeLabels: Record<string, string> = {
  in: 'Purchase',
  out: 'Consumption',
  adjustment: 'Adjustment',
};

const typeStyles: Record<string, string> = {
  in: 'bg-success-100 text-success-700',
  out: 'bg-info-100 text-info-700',
  adjustment: 'bg-warning-100 text-warning-700',
};

export default function StockTransactions() {
  const { user } = useAuth();
  const tenantId = user?.tenantId || '';
  const { data: transactions, isLoading: txLoading } = useInventoryTransactions(tenantId);
  const { data: inventory } = useInventory(tenantId);
  const [typeFilter, setTypeFilter] = useState('All');

  const itemMap = useMemo(() => {
    const map = new Map<string, string>();
    const items = Array.isArray(inventory) ? inventory : [];
    items.forEach((i: any) => map.set(i.id, i.name));
    return map;
  }, [inventory]);

  const list = useMemo(() => {
    const arr = Array.isArray(transactions) ? transactions : [];
    return typeFilter === 'All' ? arr : arr.filter((t: any) => t.type === typeFilter);
  }, [transactions, typeFilter]);

  if (txLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingState />
      </div>
    );
  }

  return (
    <div>
      <div className="page-chrome">
        <h1 className="page-title">Stock Transactions</h1>
        <button className="px-4 py-2 bg-primary text-white rounded text-sm font-bold border-none cursor-pointer hover:bg-primary-dark">+ New Transaction</button>
      </div>

      <div className="bg-white border border-neutral-200 border-t-0 px-6 py-5 mb-6">
        <div className="flex justify-end gap-3">
          {['All', 'in', 'out', 'adjustment'].map(t => (
            <button key={t} onClick={() => setTypeFilter(t)}
              className={`px-4 py-1.5 rounded text-xs font-bold border-none cursor-pointer transition-all ${typeFilter === t ? 'bg-primary text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}>{t === 'All' ? 'All' : typeLabels[t] || t}</button>
          ))}
          <input type="date" className="px-3 py-1.5 border border-neutral-300 rounded text-sm ml-4" />
        </div>
      </div>

      <div className="data-table">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-neutral-50">
              {['ID', 'Item', 'Type', 'Qty', 'Reason', 'Date', 'Reference'].map(h => (
                <th key={h} className="px-6 py-3 text-left font-bold text-primary border-b-2 border-neutral-200">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {list.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-sm text-neutral-400">No transactions</td>
              </tr>
            ) : (
              list.map((t: any, i: number) => (
                <tr key={t.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'} hover:bg-primary-50 transition-colors`}>
                  <td className="px-6 py-3 border-b border-neutral-200 font-medium">{t.id?.slice(0, 8)}</td>
                  <td className="px-6 py-3 border-b border-neutral-200">{itemMap.get(t.itemId) || t.itemId?.slice(0, 8) || '-'}</td>
                  <td className="px-6 py-3 border-b border-neutral-200">
                    <span className={`status-pill text-xs ${typeStyles[t.type] || 'bg-neutral-100 text-neutral-600'}`}>
                      {typeLabels[t.type] || t.type}
                    </span>
                  </td>
                  <td className="px-6 py-3 border-b border-neutral-200 font-bold">
                    {t.type === 'out' ? '-' : '+'}{Number(t.quantity)}
                  </td>
                  <td className="px-6 py-3 border-b border-neutral-200 text-neutral-600">{t.reason || '—'}</td>
                  <td className="px-6 py-3 border-b border-neutral-200 text-neutral-500">
                    {t.createdAt ? new Date(t.createdAt).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-3 border-b border-neutral-200 text-neutral-600">
                    {t.orderId ? t.orderId.slice(0, 8) : '—'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
