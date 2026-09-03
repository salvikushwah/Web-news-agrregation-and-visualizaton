import requests

AI_API_URL = "http://127.0.0.1:8000/extract-event"


def extract_event(article):

    payload = {
        "title": article.get("title", "Unknown Title"),
        "content": f"""
    Description:
    {article.get("description", "")}

    Content:
    {article.get("content", "")}
    """.strip()
    }

    response = requests.post(
        AI_API_URL,
        json=payload,
        timeout=60
    )

    response.raise_for_status()

    return response.json()