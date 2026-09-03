import json

from fastapi import HTTPException
from openai import OpenAI

from app.config import (
    GROQ_API_KEY,
    MODEL_NAME,
    TEMPERATURE,
    MAX_TOKENS,
    MAX_RETRIES,
)

from app.prompt import SYSTEM_PROMPT
from app.schema import EventResponse


client = OpenAI(
    api_key=GROQ_API_KEY,
    base_url="https://api.groq.com/openai/v1",
)


def test_llm():
    response = client.chat.completions.create(
        model=MODEL_NAME,
        temperature=0,
        max_tokens=64,
        reasoning_effort="none",
        messages=[
            {
                "role": "user",
                "content": "Return exactly: Hello Yash"
            }
        ]
    )

    return response.choices[0].message.content


def extract_event(article_title: str, article_content: str):

    user_prompt = f"""
Extract the SINGLE PRIMARY news event from this article.

Article Title:
{article_title}

Article Content:
{article_content}

Return ONLY one JSON object matching this exact structure:

{{
    "event": "string",
    "category": "string",
    "location": "string",
    "summary": "string",
    "tags": ["string", "string", "string"]
}}

Do not include reasoning.
Do not include <think> tags.
Do not include Markdown.
Do not include code fences.
Do not include any text before or after the JSON object.
"""

    last_error = None

    for attempt in range(1, MAX_RETRIES + 1):

        try:

            response = client.chat.completions.create(
                model=MODEL_NAME,
                temperature=0,
                max_tokens=256,
                reasoning_effort="none",
                response_format={"type": "json_object"},
                messages=[
                    {
                        "role": "system",
                        "content": SYSTEM_PROMPT
                    },
                    {
                        "role": "user",
                        "content": user_prompt
                    }
                ]
            )

            raw_response = response.choices[0].message.content

            print(
                f"\n========== LLM RESPONSE (Attempt {attempt}) =========="
            )
            print(raw_response)
            print("=====================================================\n")

            if not raw_response:
                raise ValueError("LLM returned an empty response")

            result = json.loads(raw_response.strip())

            validated = EventResponse(**result)

            return validated.model_dump()

        except Exception as e:
            last_error = e

            print(f"Attempt {attempt} failed.")
            print(e)

            if "rate_limit_exceeded" in str(e):
                import time
                time.sleep(5)

    raise HTTPException(
        status_code=500,
        detail=f"LLM failed after {MAX_RETRIES} attempts. Last error: {last_error}"
    )