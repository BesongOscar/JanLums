import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/ui/Toast';

const garments = [
  { id: 'GRM-001', lotId: 'LOT-001', orderId: 'ORD-002', item: 'Shirt', service: 'Wash & Fold', status: 'Washing', location: 'Washer 2', rack: 'A-12' },
  { id: 'GRM-002', lotId: 'LOT-001', orderId: 'ORD-002', item: 'Blouse', service: 'Dry Cleaning', status: 'Pressing', location: 'Press Station 3', rack: 'A-12' },
  { id: 'GRM-003', lotId: 'LOT-001', orderId: 'ORD-002', item: 'Skirt', service: 'Ironing / Pressing', status: 'Pending', location: 'Rack A-12', rack: 'A-12' },
  { id: 'GRM-004', lotId: 'LOT-002', orderId: 'ORD-001', item: 'Shirt', service: 'Wash & Fold', status: 'Washing', location: 'Washer 1', rack: 'B-04' },
  { id: 'GRM-005', lotId: 'LOT-002', orderId: 'ORD-001', item: 'Suit', service: 'Dry Cleaning', status: 'QC Check', location: 'QC Station', rack: 'B-04' },
  { id: 'GRM-006', lotId: 'LOT-003', orderId: 'ORD-003', item: 'Jacket', service: 'Stain Removal', status: 'Rewash', location: 'Rewash Bin', rack: 'A-07' },
];

const statusStyles: Record<string, string> = {
  Washing: 'bg-info-100 text-info-700',
  Pressing: 'bg-warning-100 text-warning-700',
  Pending: 'bg-neutral-100 text-neutral-600',
  'QC Check': 'bg-warning-100 text-warning-700',
  Rewash: 'bg-danger-100 text-danger-700',
};

export default function Garments() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [qrScan, setQrScan] = useState('');

  const filtered = garments.filter(g =>
    g.id.toLowerCase().includes(search.toLowerCase()) ||
    g.item.toLowerCase().includes(search.toLowerCase()) ||
    g.orderId.toLowerCase().includes(search.toLowerCase()) ||
    g.rack.toLowerCase().includes(search.toLowerCase())
  );

  const handleQrLookup = () => {
    if (!qrScan.trim()) return;
    const found = garments.find(g => g.id === qrScan.trim().toUpperCase());
    if (found) navigate(`/garments/${found.id}`);
    else showToast(`Garment not found: ${qrScan}`, 'error');
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
          <select className="px-3 py-1.5 border border-neutral-300 rounded text-sm">
            <option>All Status</option>
            <option>Pending</option>
            <option>Washing</option>
            <option>Pressing</option>
            <option>QC Check</option>
            <option>Rewash</option>
          </select>
        </div>
      </div>

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
            {filtered.map((g, i) => (
              <tr key={g.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'} hover:bg-primary-50 transition-colors cursor-pointer`}
                onClick={() => navigate(`/garments/${g.id}`)}>
                <td className="px-6 py-3 border-b border-neutral-200 font-medium">{g.id}</td>
                <td className="px-6 py-3 border-b border-neutral-200">{g.item}</td>
                <td className="px-6 py-3 border-b border-neutral-200 text-neutral-600">{g.orderId}</td>
                <td className="px-6 py-3 border-b border-neutral-200">{g.lotId}</td>
                <td className="px-6 py-3 border-b border-neutral-200 text-neutral-600">{g.service}</td>
                <td className="px-6 py-3 border-b border-neutral-200">
                  <span className={`status-pill text-xs ${statusStyles[g.status] || 'bg-neutral-100 text-neutral-600'}`}>{g.status}</span>
                </td>
                <td className="px-6 py-3 border-b border-neutral-200 text-neutral-600">{g.location}</td>
                <td className="px-6 py-3 border-b border-neutral-200">
                  <span className="font-mono text-xs bg-neutral-100 px-2 py-0.5 rounded">{g.rack}</span>
                </td>
                <td className="px-6 py-3 border-b border-neutral-200">
                  <button onClick={(e) => { e.stopPropagation(); navigate(`/garments/${g.id}`); }}
                    className="px-3 py-1 border border-primary rounded bg-white text-primary cursor-pointer text-xs hover:bg-primary-50">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
