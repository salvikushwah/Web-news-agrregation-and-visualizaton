
export default function CategoryFilter({ categories, setCategory }) {
  return (
    <select
      onChange={(e) => setCategory(e.target.value)}
      className="p-2 border rounded"
    >
      <option value="">All</option>
      {categories.map((c, i) => (
        <option key={i}>{c}</option>
      ))}
    </select>
  );
}