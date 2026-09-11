
import { useState } from "react";

import Navbar from "../components/Navbar";
import StatsCard from "../components/StatsCard";
import NewsCard from "../components/NewsCard";
import CategoryFilter from "../components/CategoryFilter";
import ChartSection from "../components/ChartSection";
import newsData from "../data/newsData";

export default function Dashboard() {
  const [news, setNews] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/news").then((res) => {
      setNews(res.data);
    });
  }, []);

  const filtered = news.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) &&
      (category ? n.category === category : true)
  );

  const categories = [...new Set(news.map((n) => n.category))];

  const chartData = categories.map((c) => ({
    name: c,
    value: news.filter((n) => n.category === c).length,
  }));

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar search={search} setSearch={setSearch} />

      <div className="p-4 grid grid-cols-3 gap-4">
        <StatsCard title="Total News" value={news.length} />
        <StatsCard title="Categories" value={categories.length} />
        <StatsCard title="Filtered" value={filtered.length} />
      </div>

      <div className="p-4 flex justify-between">
        <CategoryFilter categories={categories} setCategory={setCategory} />
      </div>

      <div className="p-4 grid grid-cols-3 gap-4">
        {filtered.map((n, i) => (
          <NewsCard key={i} news={n} />
        ))}
      </div>

      <div className="p-4">
        <ChartSection data={chartData} />
      </div>
    </div>
  );
}