import hashlib
import re
from typing import Any

from app.core.database import get_supabase_client
from app.services.embedding_service import (
    EmbeddingService,
    EmbeddingServiceError,
)


class DocumentIngestionError(Exception):
    """Raised when document ingestion fails."""


class DocumentIngestionService:
    """
    Converts approved research text into bounded evidence chunks
    and stores them in Supabase with Gemini embeddings.
    """

    def __init__(self):
        self.db = get_supabase_client()
        self.embedding_service = EmbeddingService()

    @staticmethod
    def _normalize_text(text: str) -> str:
        text = text.replace("\x00", " ")
        text = re.sub(r"[ \t]+", " ", text)
        text = re.sub(r"\n{3,}", "\n\n", text)
        return text.strip()

    @staticmethod
    def _create_hash(text: str) -> str:
        return hashlib.sha256(
            text.encode("utf-8")
        ).hexdigest()

    @staticmethod
    def _create_chunks(
        text: str,
        chunk_size: int = 1800,
        overlap: int = 250,
    ) -> list[str]:
        """
        Creates bounded chunks while preserving overlap.

        chunk_size and overlap are character-based for now.
        We will improve this later with page/section-aware
        document parsing.
        """

        if not text.strip():
            return []

        if overlap >= chunk_size:
            raise ValueError(
                "overlap must be smaller than chunk_size."
            )

        chunks = []
        start = 0
        text_length = len(text)

        while start < text_length:
            end = min(
                start + chunk_size,
                text_length,
            )

            chunk = text[start:end].strip()

            if chunk:
                chunks.append(chunk)

            if end >= text_length:
                break

            start = end - overlap

        return chunks

    async def ingest_text(
        self,
        *,
        title: str,
        text: str,
        conversation_id: str | None = None,
        source_name: str | None = None,
        source_url: str | None = None,
        source_type: str = "article",
        authors: str | None = None,
        published_at: str | None = None,
        metadata: dict[str, Any] | None = None,
        chunk_size: int = 1800,
        overlap: int = 250,
    ) -> dict[str, Any]:

        normalized_text = self._normalize_text(text)

        if not normalized_text:
            raise DocumentIngestionError(
                "Document contains no usable text."
            )

        if not title.strip():
            raise ValueError("Document title cannot be empty.")

        try:
            # -----------------------------------------
            # 1. Create document record
            # -----------------------------------------
            document_payload = {
                "title": title.strip(),
                "conversation_id": conversation_id,
                "source_name": source_name,
                "source_url": source_url,
                "source_type": source_type,
                "authors": authors,
                "published_at": published_at,
                "metadata": metadata or {},
            }

            document_response = (
                self.db
                .table("research_documents")
                .insert(document_payload)
                .execute()
            )

            if not document_response.data:
                raise DocumentIngestionError(
                    "Supabase did not create the research document."
                )

            document = document_response.data[0]
            document_id = document["id"]

            # -----------------------------------------
            # 2. Split document into bounded chunks
            # -----------------------------------------
            chunks = self._create_chunks(
                normalized_text,
                chunk_size=chunk_size,
                overlap=overlap,
            )

            if not chunks:
                raise DocumentIngestionError(
                    "No chunks were created from the document."
                )

            # -----------------------------------------
            # 3. Generate embeddings + prepare rows
            # -----------------------------------------
            chunk_rows = []

            for index, chunk_text in enumerate(chunks):

                embedding = (
                    await self.embedding_service.embed_text(
                        chunk_text
                    )
                )

                chunk_rows.append(
                    {
                        "document_id": document_id,
                        "conversation_id": conversation_id,
                        "chunk_index": index,
                        "chunk_text": chunk_text,
                        "content_hash": self._create_hash(
                            chunk_text
                        ),
                        "embedding": embedding,
                        "metadata": {
                            "source_name": source_name,
                            "source_url": source_url,
                            "title": title,
                        },
                    }
                )

            # -----------------------------------------
            # 4. Save evidence chunks
            # -----------------------------------------
            chunks_response = (
                self.db
                .table("research_chunks")
                .insert(chunk_rows)
                .execute()
            )

            if not chunks_response.data:
                raise DocumentIngestionError(
                    "Supabase did not save the research chunks."
                )

            return {
                "document_id": document_id,
                "title": title,
                "total_chunks": len(chunks_response.data),
                "source_type": source_type,
            }

        except EmbeddingServiceError:
            raise

        except DocumentIngestionError:
            raise

        except Exception as exc:
            raise DocumentIngestionError(
                f"Document ingestion failed: {type(exc).__name__}"
            ) from exc