
from google import genai
from app.core.config import settings

client = genai.Client(api_key=settings.GEMINI_API_KEY)

print("\nAVAILABLE GEMINI MODELS\n")

for model in client.models.list():
    name = model.name or ""

    if "generateContent" in (model.supported_actions or []):
        print("Model:", name)
        print("Supported actions:", model.supported_actions)
        print("-" * 50)
