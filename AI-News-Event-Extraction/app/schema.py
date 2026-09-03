from pydantic import BaseModel, Field
from typing import List


class ArticleRequest(BaseModel):
    title: str
    content: str


class EventResponse(BaseModel):
    event: str = Field(..., min_length=1)
    category: str = Field(..., min_length=1)
    location: str = Field(..., min_length=1)
    summary: str = Field(..., min_length=10)
    tags: List[str] = Field(..., min_length=3)