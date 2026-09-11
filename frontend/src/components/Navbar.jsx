
export default function Navbar({ search, setSearch }) {
  return (
    <div className="flex justify-between items-center p-4 bg-blue-600 text-white">
      <h1 className="text-xl font-bold">News Dashboard</h1>

      <input
        type="text"
        placeholder="Search news..."
        className="px-3 py-1 rounded text-black"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
}