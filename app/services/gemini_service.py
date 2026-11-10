
from google import genai
from app.core.config import settings


class GeminiServiceError(Exception):
    """Raised when Gemini research generation fails."""


class GeminiService:

    def __init__(self):
        if not settings.GEMINI_API_KEY:
            raise GeminiServiceError(
                "GEMINI_API_KEY is not configured."
            )

        self.client = genai.Client(
            api_key=settings.GEMINI_API_KEY
        )

        self.model = settings.GEMINI_MODEL

    async def generate_answer(self, query: str) -> dict:

        if not query or not query.strip():
            raise ValueError("Research query cannot be empty.")

        prompt = f"""
You are an independent pharmaceutical and scientific research analyst.

Research question:
{query}

Requirements:
1. Provide a detailed, structured research answer.
2. Use Google Search for relevant external research.
3. Include source references for factual claims.
4. Distinguish established facts from uncertainty.
5. Never invent studies, statistics, or references.
6. Identify limitations and insufficient evidence.
7. Do not compare your answer with another AI model.
8. Do not claim that agreement between sources proves scientific truth.
"""

        try:
            interaction = await self.client.aio.interactions.create(
                model=self.model,
                input=prompt,
                tools=[
                    {"type": "google_search"}
                ],
            )

            answer = (interaction.output_text or "").strip()

            if not answer:
                raise GeminiServiceError(
                    "Gemini returned an empty research answer."
                )

            return {
                "model_provider": "Google",
                "model": self.model,
                "response_id": interaction.id,
                "answer": answer,
                "status": "completed",
            }

        except GeminiServiceError:
            raise

        except Exception as exc:
            raise GeminiServiceError(
                f"Gemini research generation failed: "
                f"{type(exc).__name__}: {str(exc)}"
            ) from exc
