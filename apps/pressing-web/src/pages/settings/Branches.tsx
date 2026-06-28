const branches = [
  { id: 'BR-001', name: 'Bastos', city: 'Yaoundé', address: '123 Rue Principale, Bastos', phone: '+237 612 345 678', manager: 'Sarah Mengue', openTime: '07:00', closeTime: '20:00', status: 'Active' },
  { id: 'BR-002', name: 'Bonanjo', city: 'Douala', address: '45 Boulevard de la Liberté, Bonanjo', phone: '+237 698 765 432', manager: 'Jean-Pierre Nkwi', openTime: '07:00', closeTime: '20:00', status: 'Active' },
  { id: 'BR-003', name: 'Mvog-Mbi', city: 'Yaoundé', address: '78 Avenue Kennedy, Mvog-Mbi', phone: '+237 677 888 999', manager: 'Marie-Claire Biya', openTime: '08:00', closeTime: '19:00', status: 'Active' },
  { id: 'BR-004', name: 'Akwa', city: 'Douala', address: '12 Rue de l\'Indépendance, Akwa', phone: '+237 655 444 333', manager: '—', openTime: '07:00', closeTime: '20:00', status: 'Inactive' },
];

export default function Branches() {
  return (
    <div>
      <div className="page-chrome">
        <h1 className="page-title">Branches</h1>
      </div>
      <div className="grid grid-cols-2 gap-5 mt-6">
        {branches.map(b => (
          <div key={b.id} className="bg-white border border-neutral-200 rounded-lg p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-base font-bold text-neutral-800">{b.name}</h3>
                <p className="text-xs text-neutral-400">{b.city}</p>
              </div>
              <span className={`status-pill text-xs ${b.status === 'Active' ? 'bg-success-100 text-success-700' : 'bg-neutral-100 text-neutral-500'}`}>{b.status}</span>
            </div>
            <div className="space-y-1.5 text-xs text-neutral-600">
              <p><span className="font-medium text-neutral-700">Address:</span> {b.address}</p>
              <p><span className="font-medium text-neutral-700">Phone:</span> {b.phone}</p>
              <p><span className="font-medium text-neutral-700">Manager:</span> {b.manager}</p>
              <p><span className="font-medium text-neutral-700">Hours:</span> {b.openTime} – {b.closeTime}</p>
            </div>
            <div className="mt-4 flex justify-end">
              <button className="px-3 py-1 border border-primary rounded bg-white text-primary cursor-pointer text-xs hover:bg-primary-50">Edit</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
