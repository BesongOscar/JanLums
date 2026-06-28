const fabrics = [
  { id: 'FB-001', name: 'Cotton', careLevel: 'Easy', careInstructions: 'Machine wash warm, tumble dry, iron high', notes: 'Most common fabric, durable' },
  { id: 'FB-002', name: 'Polyester', careLevel: 'Easy', careInstructions: 'Machine wash cold, tumble dry low, iron low', notes: 'Wrinkle resistant, quick dry' },
  { id: 'FB-003', name: 'Silk', careLevel: 'Delicate', careInstructions: 'Hand wash cold or dry clean, hang dry, iron low', notes: 'Fragile, avoid bleach' },
  { id: 'FB-004', name: 'Wool', careLevel: 'Delicate', careInstructions: 'Dry clean or hand wash cold, lay flat to dry', notes: 'Can shrink in hot water' },
  { id: 'FB-005', name: 'Linen', careLevel: 'Medium', careInstructions: 'Machine wash warm, hang dry, iron high', notes: 'Wrinkles easily, best ironed damp' },
  { id: 'FB-006', name: 'Denim', careLevel: 'Medium', careInstructions: 'Machine wash cold, hang dry, iron medium', notes: 'May shrink, turn inside out' },
];

const careLevelStyles: Record<string, string> = {
  Easy: 'bg-success-100 text-success-700',
  Medium: 'bg-warning-100 text-warning-700',
  Delicate: 'bg-danger-100 text-danger-700',
};

export default function FabricTypes() {
  return (
    <div>
      <div className="page-chrome">
        <h1 className="page-title">Fabric Types</h1>
      </div>
      <div className="data-table mt-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-neutral-50">
              {['ID', 'Fabric', 'Care Level', 'Care Instructions', 'Notes', ''].map(h => (
                <th key={h} className="px-6 py-3 text-left font-bold text-primary border-b-2 border-neutral-200">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {fabrics.map((f, i) => (
              <tr key={f.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'} hover:bg-primary-50 transition-colors`}>
                <td className="px-6 py-3 border-b border-neutral-200 font-medium">{f.id}</td>
                <td className="px-6 py-3 border-b border-neutral-200 font-medium">{f.name}</td>
                <td className="px-6 py-3 border-b border-neutral-200">
                  <span className={`status-pill text-xs ${careLevelStyles[f.careLevel]}`}>{f.careLevel}</span>
                </td>
                <td className="px-6 py-3 border-b border-neutral-200 text-xs text-neutral-600 max-w-[250px]">{f.careInstructions}</td>
                <td className="px-6 py-3 border-b border-neutral-200 text-xs text-neutral-500 max-w-[200px]">{f.notes}</td>
                <td className="px-6 py-3 border-b border-neutral-200">
                  <button className="px-3 py-1 border border-primary rounded bg-white text-primary cursor-pointer text-xs hover:bg-primary-50">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
