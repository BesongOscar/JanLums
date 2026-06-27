interface StatCardProps {
  label: string;
  value: string | number;
  color?: string;
}

export default function StatCard({ label, value, color = 'bg-blue-50 text-blue-700' }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className={`text-3xl font-bold mt-2 ${color.split(' ')[1] || 'text-gray-900'}`}>{value}</p>
    </div>
  );
}
