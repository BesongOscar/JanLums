import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useGarmentById } from '../hooks/useLots';
import { useToast } from '../components/ui/Toast';

const statusStyles: Record<string, string> = {
  Washing: 'bg-info-100 text-info-700',
  Pressing: 'bg-warning-100 text-warning-700',
  Pending: 'bg-neutral-100 text-neutral-600',
  'QC Check': 'bg-warning-100 text-warning-700',
  Rewash: 'bg-danger-100 text-danger-700',
  Completed: 'bg-success-100 text-success-700',
};

export default function GarmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const tenantId = user?.tenantId || '';
  const { showToast } = useToast();
  const [showQc, setShowQc] = useState(false);
  const [qcResult, setQcResult] = useState<'pass' | 'fail' | null>(null);
  const [damageNote, setDamageNote] = useState('');

  const { data: garment, isLoading } = useGarmentById(id || '', tenantId);

  if (isLoading) return <div className="p-6 text-center text-neutral-500">Loading garment...</div>;
  if (!garment) return <div className="p-6 text-center text-neutral-500">Garment not found</div>;

  const handleQcSubmit = () => {
    if (qcResult === 'pass') showToast('QC passed', 'success');
    else if (qcResult === 'fail') showToast(`QC failed — rewash initiated. Note: ${damageNote || 'None'}`, 'error');
    setShowQc(false);
    setQcResult(null);
    setDamageNote('');
  };

  const timeline = [
    { status: 'received', label: 'Received', timestamp: new Date(garment.createdAt).toLocaleString(), actor: 'System', active: true },
  ];

  return (
    <div>
      <div className="page-chrome">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/garments')}
            className="text-primary hover:text-primary-dark text-sm no-underline bg-transparent border-none cursor-pointer">&larr; Back to Garments</button>
          <h1 className="page-title">{garment.id.slice(0, 8)} — {garment.name}</h1>
          <span className={`status-pill text-xs ${statusStyles[garment.status] || 'bg-neutral-100 text-neutral-600'}`}>{garment.status}</span>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowQc(true)}
            className="px-4 py-2 bg-primary text-white rounded text-sm font-bold border-none cursor-pointer hover:bg-primary-dark">QC Checkpoint</button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mt-6">
        <div className="space-y-6">
          <div className="bg-white border border-neutral-200 rounded shadow-sm">
            <div className="px-6 py-4 border-b border-neutral-200">
              <h2 className="text-base font-bold text-neutral-800">Garment Info</h2>
            </div>
            <div className="p-6 space-y-3 text-sm">
              {[
                ['Item', garment.name],
                ['Service', garment.service],
                ['Order', garment.orderId ? garment.orderId.slice(0, 8) : '\u2014'],
                ['Lot', garment.lotId.slice(0, 8)],
                ['Location', garment.location || '\u2014'],
                ['Rack', garment.lotRack || garment.rack || '\u2014'],
                ['QR Code', garment.qrCode || '\u2014'],
              ].map(([l, v]) => (
                <div key={l}>
                  <div className="text-xs text-neutral-500">{l}</div>
                  <div className="text-neutral-800">{v}</div>
                </div>
              ))}
              {garment.notes && (
                <div>
                  <div className="text-xs text-neutral-500">Notes</div>
                  <div className="text-sm text-warning-700 italic">{garment.notes}</div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-span-2">
          <div className="bg-white border border-neutral-200 rounded shadow-sm">
            <div className="px-6 py-4 border-b border-neutral-200">
              <h2 className="text-base font-bold text-neutral-800">Processing History</h2>
            </div>
            <div className="p-6">
              <div className="relative pl-8">
                {timeline.map((entry, i) => (
                  <div key={i} className="relative pb-6 last:pb-0">
                    <div className={`absolute left-0 top-1 w-5 h-5 rounded-full flex items-center justify-center text-xs border-2 ${
                      entry.active ? 'bg-primary border-primary text-white' : 'bg-white border-neutral-300 text-neutral-400'
                    }`}>
                      {i + 1}
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center gap-3">
                        <span className={`font-semibold text-sm ${entry.active ? 'text-primary' : 'text-neutral-700'}`}>{entry.label}</span>
                        <span className="text-xs text-neutral-400">{entry.timestamp}</span>
                      </div>
                      <p className="text-xs text-neutral-500 mt-0.5">{entry.actor}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showQc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-neutral-800">QC Checkpoint — {garment.id.slice(0, 8)}</h2>
              <button onClick={() => setShowQc(false)}
                className="text-neutral-400 hover:text-neutral-600 text-xl leading-none border-none bg-transparent cursor-pointer">&times;</button>
            </div>
            <div className="space-y-4">
              <p className="text-sm text-neutral-600">Inspect {garment.name} ({garment.service})</p>
              <div className="flex gap-3">
                <button onClick={() => setQcResult('pass')}
                  className={`flex-1 py-3 rounded text-sm font-bold border-2 cursor-pointer ${qcResult === 'pass' ? 'border-success bg-success-50 text-success' : 'border-neutral-200 bg-white text-neutral-500 hover:border-success'}`}>Pass QC</button>
                <button onClick={() => setQcResult('fail')}
                  className={`flex-1 py-3 rounded text-sm font-bold border-2 cursor-pointer ${qcResult === 'fail' ? 'border-danger bg-danger-50 text-danger' : 'border-neutral-200 bg-white text-neutral-500 hover:border-danger'}`}>Fail QC</button>
              </div>
              {qcResult === 'fail' && (
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Damage / Issue Notes</label>
                  <textarea value={damageNote} onChange={e => setDamageNote(e.target.value)} rows={3}
                    placeholder="Describe the issue..."
                    className="w-full px-3 py-2 border border-neutral-300 rounded text-sm resize-y" />
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowQc(false)}
                className="px-4 py-2 border border-neutral-300 rounded text-sm bg-white cursor-pointer hover:bg-neutral-50">Cancel</button>
              <button onClick={handleQcSubmit} disabled={!qcResult}
                className="px-4 py-2 bg-primary text-white rounded text-sm font-bold border-none cursor-pointer hover:bg-primary-dark disabled:opacity-40">Submit QC</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
