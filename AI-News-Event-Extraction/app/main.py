from fastapi import FastAPI

from app.llm import extract_event
from app.schema import (
    ArticleRequest,
    EventResponse,
)

app = FastAPI(
    title="AI News Event Extraction API",
    description="AI service for extracting structured events from news articles.",
    version="1.0.0"
)


@app.get("/")
def root():
    return {
        "status": "running",
        "service": "AI News Event Extraction API"
    }


@app.post(
    "/extract-event",
    response_model=EventResponse
)
def extract(article: ArticleRequest):

    result = extract_event(
        article.title,
        article.content
    )

    return result