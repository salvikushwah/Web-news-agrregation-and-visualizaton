from fastapi import FastAPI

from mock_backend.news_api import get_latest_news
from mock_backend.services import extract_event

app = FastAPI(
    title="Mock Backend",
    version="1.0.0"
)


@app.get("/")
def root():
    return {
        "status": "Mock Backend Running"
    }


@app.get("/news")
def news():
    return get_latest_news()


@app.get("/process-news")
def process_news():

    news = get_latest_news(page_size=5)

    articles = news.get("articles", [])

    if not articles:
        return {
            "message": "No articles found."
        }

    results = []

    for index, article in enumerate(articles, start=1):

        try:

            ai_result = extract_event(article)

            results.append({
                "article_number": index,
                "title": article.get("title"),
                "source": article.get("source", {}).get("name"),
                "publishedAt": article.get("publishedAt"),
                "ai_result": ai_result
            })

        except Exception as e:

            results.append({
                "article_number": index,
                "title": article.get("title"),
                "error": str(e)
            })

    return {
        "total_articles": len(results),
        "results": results
    }