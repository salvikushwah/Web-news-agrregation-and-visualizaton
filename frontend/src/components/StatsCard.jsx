
export default function StatsCard({ title, value }) {
  return (
    <div className="bg-white shadow p-4 rounded">
      <h2 className="text-gray-500">{title}</h2>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}