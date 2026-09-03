from dotenv import load_dotenv
import os

load_dotenv()

# API Keys
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
NEWS_API_KEY = os.getenv("NEWS_API_KEY")

# Model Configuration
MODEL_NAME = "qwen/qwen3.6-27b"

# LLM Parameters
TEMPERATURE = 0.3
MAX_TOKENS = 1024
MAX_RETRIES = 2
