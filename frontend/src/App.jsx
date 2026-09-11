import React, { useState } from "react";


const newsData = [
  {
    category: "Technology",
    title: "AI is reshaping newsrooms fast",
    source: "BBC",
    time: "2 hrs ago",
  },
  {
    category: "Health",
    title: "New study links sleep to memory",
    source: "Reuters",
    time: "5 hrs ago",
  },
  {
    category: "Sports",
    title: "Champions League delivers another surprise",
    source: "ESPN",
    time: "6 hrs ago",
  },
  {
    category: "Politics",
    title: "Global leaders meet for major summit",
    source: "BBC",
    time: "8 hrs ago",
  },
];

const categories = [
  ["All", 248],
  ["Technology", 54],
  ["Politics", 43],
  ["Sports", 38],
  ["Health", 31],
  ["Finance", 28],
];

function App() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filteredNews = newsData.filter((item) => {
    const searchMatch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase());

    const categoryMatch =
      category === "All" || item.category === category;

    return searchMatch && categoryMatch;
  });

  return (
    <div className="page">

      {/* HEADER */}
      <header className="header">
        <div className="logo">
          <span className="logo-icon">▤</span>
          <span>NewsBoard</span>
        </div>

        <div className="header-right">
          <input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button className="filter-btn">Filter</button>
          <button className="bookmark-btn">Bookmarks</button>
        </div>
      </header>

      {/* STAT CARDS */}
      <div className="stats">

        <div className="stat-card">
          <div className="stat-title">Total articles</div>
          <div className="stat-number">248</div>
        </div>

        <div className="stat-card">
          <div className="stat-title">Categories</div>
          <div className="stat-number">12</div>
        </div>

        <div className="stat-card">
          <div className="stat-title">Today's articles</div>
          <div className="stat-number">17</div>
        </div>

        <div className="stat-card">
          <div className="stat-title">Top source</div>
          <div className="stat-source">BBC News</div>
        </div>

      </div>

      {/* THREE COLUMN AREA */}
      <div className="content">

        {/* LEFT - CATEGORIES */}
        <aside className="categories-box">
          <h3>CATEGORIES</h3>

          {categories.map(([name, count]) => (
            <div
              key={name}
              className={`category-row ${
                category === name ? "selected" : ""
              }`}
              onClick={() => setCategory(name)}
            >
              <span>{name}</span>
              <span>{count}</span>
            </div>
          ))}
        </aside>

        {/* CENTER - LATEST NEWS */}
        <section className="news-section">
          <h3>LATEST NEWS</h3>

          {filteredNews.map((item, index) => (
            <div className="news-card" key={index}>

              <span className="news-tag">
                {item.category}
              </span>

              <div className="news-title">
                {item.title}
              </div>

              <div className="news-info">
                {item.source} • {item.time}
              </div>

            </div>
          ))}

          {filteredNews.length === 0 && (
            <div className="no-result">
              No articles found
            </div>
          )}
        </section>

        {/* RIGHT - CATEGORY CHART */}
        <aside className="chart-box">
          <h3>ARTICLES BY CATEGORY</h3>

          {categories.slice(1).map(([name, count]) => (
            <div className="chart-item" key={name}>

              <div className="chart-label">
                <span>{name}</span>
                <span>{count}</span>
              </div>

              <div className="bar-background">
                <div
                  className="bar-fill"
                  style={{
                    width: `${(count / 54) * 100}%`,
                  }}
                ></div>
              </div>

            </div>
          ))}
        </aside>

      </div>

    </div>
  );
}

export default App;