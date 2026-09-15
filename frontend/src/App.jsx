import React, { useState } from "react";

const VisualizationPage = React.lazy(() =>
  import("./visualization/VisualizationPage")
);
const newsData = [
  {
    category: "Technology",
    title: "AI is reshaping newsrooms fast",
    source: "BBC",
    time: "2 hrs ago",
    isToday: true,
  },
  {
    category: "Health",
    title: "New study links sleep to memory",
    source: "Reuters",
    time: "5 hrs ago",
    isToday: true,
  },
  {
    category: "Sports",
    title: "Champions League delivers another surprise",
    source: "ESPN",
    time: "6 hrs ago",
    isToday: true,
  },
  {
    category: "Politics",
    title: "Global leaders meet for major summit",
    source: "BBC",
    time: "8 hrs ago",
    isToday: true,
  },
  {
    category: "Finance",
    title: "Markets show positive growth this week",
    source: "Reuters",
    time: "10 hrs ago",
    isToday: true,
  },
  {
    category: "Technology",
    title: "New technology is changing daily life",
    source: "TechCrunch",
    time: "12 hrs ago",
    isToday: true,
  },
  {
    category: "Health",
    title: "Experts share new health recommendations",
    source: "BBC",
    time: "1 day ago",
    isToday: false,
  },
  {
    category: "Sports",
    title: "Major sports event begins this weekend",
    source: "ESPN",
    time: "1 day ago",
    isToday: false,
  },
  {
    category: "Politics",
    title: "New policy discussions continue globally",
    source: "Reuters",
    time: "2 days ago",
    isToday: false,
  },
  {
    category: "Finance",
    title: "Global financial trends to watch",
    source: "BBC",

    time: "2 days ago",
    isToday: false,
  },
  {
    category: "Technology",
    title: "New AI tools are changing the way people work",
    source: "Wired",
    time: "3 hrs ago",
    isToday: true,
  },
  {
    category: "Health",
    title: "Researchers discover new benefits of regular exercise",
    source: "CNN",
    time: "7 hrs ago",
    isToday: true,
  },
  {
    category: "Sports",
    title: "Young players make a strong impact this season",
    source: "ESPN",
    time: "9 hrs ago",
    isToday: true,
  },
];

const allCategories = [
  "All",
  ...new Set(newsData.map((item) => item.category)),
];

function App() {
  const [route, setRoute] = useState(() => window.location.pathname);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");


  const filteredNews = newsData.filter((item) => {
    const searchMatch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase()) ||
      item.source.toLowerCase().includes(search.toLowerCase());

    const categoryMatch =
      category === "All" || item.category === category;

    return searchMatch && categoryMatch;
  });
  const totalArticles = filteredNews.length;

  const todaysArticles = filteredNews.filter(
    (item) => item.isToday
  ).length;

  const categoryCounts = allCategories.map((name) => {
    if (name === "All") {
      return [name, filteredNews.length];
    }

    const count = filteredNews.filter(
      (item) => item.category === name
    ).length;

    return [name, count];
  });

  const sourceCounts = {};

  filteredNews.forEach((item) => {
    sourceCounts[item.source] =
      (sourceCounts[item.source] || 0) + 1;
  });

  const topSource =
    Object.entries(sourceCounts).sort(
      (a, b) => b[1] - a[1]
    )[0]?.[0] || "—";

  const navigate = (path) => {
    window.history.pushState({}, "", path);
    setRoute(path);
  };

  React.useEffect(() => {
    const handlePopState = () => {
      setRoute(window.location.pathname);
    };

    window.addEventListener("popstate", handlePopState);

    return () =>
      window.removeEventListener("popstate", handlePopState);
  }, []);

  if (route === "/visualization") {
    return (
      <React.Suspense
        fallback={
          <div className="route-loading">
            Loading visualizations...
          </div>
        }
      >
        <VisualizationPage
          onNavigateHome={() => navigate("/")}
        />
      </React.Suspense>
    );
  }

  return (
    <div className="page">

      {/* HEADER */}
      <header className="header">

        <div className="logo">
          <span className="logo-icon">▤</span>
          <span>NewsBoard</span>
        </div>

        <div className="header-right">

          <button
            className="visualization-btn"
            onClick={() => navigate("/visualization")}
          >
            Visualizations
          </button>

          <input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button className="filter-btn">
            Filter
          </button>

          <button className="bookmark-btn">
            Bookmarks
          </button>

        </div>

      </header>
      {/* STAT CARDS */}
      <div className="stats">

        <div className="stat-card">
          <div className="stat-title">
            Total articles
          </div>

          <div className="stat-number">
            {totalArticles}
          </div>
        </div>


        <div className="stat-card">
          <div className="stat-title">
            Categories
          </div>

          <div className="stat-number">
            {
              new Set(
                filteredNews.map(
                  (item) => item.category
                )
              ).size
            }
          </div>
        </div>


        <div className="stat-card">
          <div className="stat-title">
            Today's articles
          </div>

          <div className="stat-number">
            {todaysArticles}
          </div>
        </div>


        <div className="stat-card">
          <div className="stat-title">
            Top source
          </div>

          <div className="stat-source">
            {topSource}
          </div>
        </div>

      </div>

      {/* THREE COLUMN AREA */}
      <div className="content">


        {/* LEFT - CATEGORIES */}
        <aside className="categories-box">

          <h3>CATEGORIES</h3>

          {categoryCounts.map(([name, count]) => (

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

            <div
              className="news-card"
              key={index}
            >

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


        {/* RIGHT - DYNAMIC CATEGORY CHART */}
        <aside className="chart-box">

          <h3>ARTICLES BY CATEGORY</h3>

          {categoryCounts
            .filter(([name]) => name !== "All")
            .map(([name, count]) => {

              const maxCount = Math.max(
                ...categoryCounts
                  .filter(([name]) => name !== "All")
                  .map(([, count]) => count),
                1
              );

              return (

                <div
                  className="chart-item"
                  key={name}
                >

                  <div className="chart-label">

                    <span>{name}</span>

                    <span>{count}</span>

                  </div>

                  <div className="bar-background">

                    <div
                      className="bar-fill"
                      style={{
                        width: `${
                          (count / maxCount) * 100
                        }%`,
                      }}
                    ></div>

                  </div>

                </div>

              );

            })}

        </aside>

      </div>

    </div>
  );
}

export default App;