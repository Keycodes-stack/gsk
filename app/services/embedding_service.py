
import asyncio

from google import genai
from google.genai import types

from app.core.config import settings


class EmbeddingServiceError(Exception):
    """Raised when embedding generation fails."""


class EmbeddingService:
    DIMENSIONS = 768

    def __init__(self):
        if not settings.GEMINI_API_KEY:
            raise EmbeddingServiceError(
                "GEMINI_API_KEY is missing from backend/.env"
            )

        self.client = genai.Client(
            api_key=settings.GEMINI_API_KEY
        )

        self.model = settings.GEMINI_EMBEDDING_MODEL

    def _embed_sync(self, text: str) -> list[float]:
        try:
            response = self.client.models.embed_content(
                model=self.model,
                contents=text,
                config=types.EmbedContentConfig(
                    output_dimensionality=self.DIMENSIONS
                ),
            )

            if not response.embeddings:
                raise EmbeddingServiceError(
                    "Gemini returned an empty embedding."
                )

            values = response.embeddings[0].values

            if not values or len(values) != self.DIMENSIONS:
                raise EmbeddingServiceError(
                    f"Expected {self.DIMENSIONS} dimensions, "
                    f"received {len(values) if values else 0}."
                )

            return [float(value) for value in values]

        except EmbeddingServiceError:
            raise
        except Exception as exc:
            raise EmbeddingServiceError(
                f"Embedding generation failed: {type(exc).__name__}"
            ) from exc

    async def embed_text(self, text: str) -> list[float]:
        if not isinstance(text, str) or not text.strip():
            raise ValueError("Text cannot be empty.")

        return await asyncio.to_thread(
            self._embed_sync,
            text.strip()
        )
