from dotenv import load_dotenv

load_dotenv()

from app.llm import test_llm

print("Testing Groq connection...\n")

response = test_llm()

print(response)