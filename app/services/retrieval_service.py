from typing import Any

from app.core.database import get_supabase_client
from app.services.embedding_service import (
    EmbeddingService,
    EmbeddingServiceError,
)


class RetrievalServiceError(Exception):
    """Raised when evidence retrieval fails."""


class ResearchRetrievalService:

    def __init__(self):
        self.db = get_supabase_client()
        self.embedding_service = EmbeddingService()

    async def retrieve(
        self,
        query: str,
        *,
        conversation_id: str | None = None,
        match_count: int = 8,
        similarity_threshold: float = 0.45,
    ) -> list[dict[str, Any]]:

        if not query or not query.strip():
            raise ValueError("Research query cannot be empty.")

        if match_count < 1 or match_count > 20:
            raise ValueError(
                "match_count must be between 1 and 20."
            )

        if not 0 <= similarity_threshold <= 1:
            raise ValueError(
                "similarity_threshold must be between 0 and 1."
            )

        try:
            query_embedding = (
                await self.embedding_service.embed_text(
                    query.strip()
                )
            )

            response = (
                self.db
                .rpc(
                    "match_research_chunks",
                    {
                        "query_embedding": query_embedding,
                        "match_conversation_id": conversation_id,
                        "match_count": match_count,
                        "similarity_threshold": similarity_threshold,
                    },
                )
                .execute()
            )

            return response.data or []

        except EmbeddingServiceError:
            raise

        except Exception as exc:
            raise RetrievalServiceError(
                f"Evidence retrieval failed: {type(exc).__name__}"
            ) from exc