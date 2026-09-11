
export default function NewsCard({ news }) {
  return (
    <div className="bg-white shadow rounded overflow-hidden">
      <img src={news.image} className="h-40 w-full object-cover" />
      <div className="p-3">
        <h2 className="font-bold">{news.title}</h2>
        <p className="text-sm text-gray-500">{news.category}</p>
      </div>
    </div>
  );
}