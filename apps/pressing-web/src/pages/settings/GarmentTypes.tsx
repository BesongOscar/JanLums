const garments = [
  { id: 'GT-001', name: 'Shirt', category: 'Tops', defaultService: 'Wash & Iron', careInstructions: 'Machine wash warm, tumble dry low, iron medium', avgPrice: 500 },
  { id: 'GT-002', name: 'Trouser', category: 'Bottoms', defaultService: 'Wash & Iron', careInstructions: 'Machine wash cold, hang dry, iron medium', avgPrice: 800 },
  { id: 'GT-003', name: 'Suit Jacket', category: 'Outerwear', defaultService: 'Dry Cleaning', careInstructions: 'Dry clean only, steam press', avgPrice: 2500 },
  { id: 'GT-004', name: 'Dress', category: 'Dresses', defaultService: 'Wash & Iron', careInstructions: 'Hand wash cold, hang dry, iron low', avgPrice: 1500 },
  { id: 'GT-005', name: 'Bed Sheet (King)', category: 'Linens', defaultService: 'Wash & Fold', careInstructions: 'Machine wash warm, tumble dry', avgPrice: 2000 },
  { id: 'GT-006', name: 'Towel (Bath)', category: 'Linens', defaultService: 'Wash & Fold', careInstructions: 'Machine wash warm, tumble dry', avgPrice: 1000 },
  { id: 'GT-007', name: 'Traditional Attire', category: 'Traditional', defaultService: 'Dry Cleaning', careInstructions: 'Hand wash or dry clean, hang dry, iron low', avgPrice: 3000 },
];

export default function GarmentTypes() {
  return (
    <div>
      <div className="page-chrome">
        <h1 className="page-title">Garment Types</h1>
      </div>
      <div className="data-table mt-6">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-neutral-50">
              {['ID', 'Name', 'Category', 'Default Service', 'Care Instructions', 'Avg Price', ''].map(h => (
                <th key={h} className="px-6 py-3 text-left font-bold text-primary border-b-2 border-neutral-200">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {garments.map((g, i) => (
              <tr key={g.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'} hover:bg-primary-50 transition-colors`}>
                <td className="px-6 py-3 border-b border-neutral-200 font-medium">{g.id}</td>
                <td className="px-6 py-3 border-b border-neutral-200 font-medium">{g.name}</td>
                <td className="px-6 py-3 border-b border-neutral-200"><span className="text-xs bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded">{g.category}</span></td>
                <td className="px-6 py-3 border-b border-neutral-200 text-xs text-info">{g.defaultService}</td>
                <td className="px-6 py-3 border-b border-neutral-200 text-xs text-neutral-500 max-w-[250px]">{g.careInstructions}</td>
                <td className="px-6 py-3 border-b border-neutral-200 font-bold">{g.avgPrice.toLocaleString()} FCFA</td>
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
