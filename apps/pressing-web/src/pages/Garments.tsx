import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useGarments } from '../hooks/useLots';
import { useToast } from '../components/ui/Toast';

const statusStyles: Record<string, string> = {
  Washing: 'bg-info-100 text-info-700',
  Pressing: 'bg-warning-100 text-warning-700',
  Pending: 'bg-neutral-100 text-neutral-600',
  'QC Check': 'bg-warning-100 text-warning-700',
  Rewash: 'bg-danger-100 text-danger-700',
  Completed: 'bg-success-100 text-success-700',
};

export default function Garments() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const tenantId = user?.tenantId || '';
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [qrScan, setQrScan] = useState('');

  const { data: garments = [], isLoading } = useGarments(tenantId);

  const filtered = garments.filter((g: any) =>
    g.id.toLowerCase().includes(search.toLowerCase()) ||
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    (g.orderId || '').toLowerCase().includes(search.toLowerCase()) ||
    (g.rack || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleQrLookup = () => {
    if (!qrScan.trim()) return;
    const found = garments.find((g: any) => g.id === qrScan.trim().toUpperCase());
    if (found) navigate(`/garments/${found.id}`);
    else showToast('Garment not found', 'error');
  };

  return (
    <div>
      <div className="page-chrome">
        <h1 className="page-title">Garments</h1>
        <div className="flex gap-2">
          <input type="text" placeholder="Scan QR code..." value={qrScan} onChange={e => setQrScan(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleQrLookup()}
            className="px-3 py-2 border border-neutral-300 rounded text-sm w-40" />
          <button onClick={handleQrLookup}
            className="px-4 py-2 bg-primary text-white rounded text-sm font-bold border-none cursor-pointer hover:bg-primary-dark">Scan</button>
        </div>
      </div>

      <div className="bg-white border border-neutral-200 border-t-0 px-6 py-5 mb-6">
        <div className="flex justify-end items-center gap-3">
          <input type="text" placeholder="Search garments..." value={search} onChange={e => setSearch(e.target.value)}
            className="px-3 py-1.5 border border-neutral-300 rounded text-sm w-60" />
        </div>
      </div>

      {isLoading ? (
        <div className="p-6 text-center text-neutral-500">Loading garments...</div>
      ) : (
        <div className="data-table">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-neutral-50">
                {['ID', 'Item', 'Order', 'Lot', 'Service', 'Status', 'Location', 'Rack', ''].map(h => (
                  <th key={h} className="px-6 py-3 text-left font-bold text-primary border-b-2 border-neutral-200">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((g: any, i: number) => (
                <tr key={g.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'} hover:bg-primary-50 transition-colors cursor-pointer`}
                  onClick={() => navigate(`/garments/${g.id}`)}>
                  <td className="px-6 py-3 border-b border-neutral-200 font-medium">{g.id.slice(0, 8)}</td>
                  <td className="px-6 py-3 border-b border-neutral-200">{g.name}</td>
                  <td className="px-6 py-3 border-b border-neutral-200 text-neutral-600">{g.orderId ? g.orderId.slice(0, 8) : '\u2014'}</td>
                  <td className="px-6 py-3 border-b border-neutral-200">{g.lotId.slice(0, 8)}</td>
                  <td className="px-6 py-3 border-b border-neutral-200 text-neutral-600">{g.service}</td>
                  <td className="px-6 py-3 border-b border-neutral-200">
                    <span className={`status-pill text-xs ${statusStyles[g.status] || 'bg-neutral-100 text-neutral-600'}`}>{g.status}</span>
                  </td>
                  <td className="px-6 py-3 border-b border-neutral-200 text-neutral-600">{g.location || '\u2014'}</td>
                  <td className="px-6 py-3 border-b border-neutral-200">
                    <span className="font-mono text-xs bg-neutral-100 px-2 py-0.5 rounded">{g.rack || '\u2014'}</span>
                  </td>
                  <td className="px-6 py-3 border-b border-neutral-200">
                    <button onClick={(e) => { e.stopPropagation(); navigate(`/garments/${g.id}`); }}
                      className="px-3 py-1 border border-primary rounded bg-white text-primary cursor-pointer text-xs hover:bg-primary-50">View</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={9} className="px-6 py-8 text-center text-neutral-400">No garments found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
