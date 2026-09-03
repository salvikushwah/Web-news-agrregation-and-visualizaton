import requests

from app.config import NEWS_API_KEY


BASE_URL = "https://newsapi.org/v2/top-headlines"


def get_latest_news(country="us", category="general", page_size=5):

    params = {
        "country": country,
        "category": category,
        "pageSize": page_size,
        "apiKey": NEWS_API_KEY
    }

    response = requests.get(
        BASE_URL,
        params=params,
        timeout=30
    )

    response.raise_for_status()

    return response.json()