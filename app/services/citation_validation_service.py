import hashlib
from typing import Any

from app.core.database import get_supabase_client


class CitationValidationError(Exception):
    """Raised when citation validation fails."""


class CitationValidationService:
    """
    Validates research citations against the exact evidence stored
    in Supabase research_documents and research_chunks.
    """

    def __init__(self):
        self.db = get_supabase_client()

    @staticmethod
    def _create_hash(text: str) -> str:
        return hashlib.sha256(
            text.encode("utf-8")
        ).hexdigest()

    async def validate_citation(
        self,
        document_id: str,
        chunk_id: str,
        quoted_text: str,
        expected_content_hash: str | None = None,
    ) -> dict[str, Any]:

        if not document_id:
            raise CitationValidationError(
                "Document ID is required."
            )

        if not chunk_id:
            raise CitationValidationError(
                "Chunk ID is required."
            )

        if not quoted_text or not quoted_text.strip():
            raise CitationValidationError(
                "Quoted text is required."
            )

        # ---------------------------------------------------------
        # 1. Verify document exists
        # ---------------------------------------------------------
        document_response = (
            self.db
            .table("research_documents")
            .select(
                "id, title, source_name, source_url, "
                "source_type, authors, published_at"
            )
            .eq("id", document_id)
            .limit(1)
            .execute()
        )

        if not document_response.data:
            return {
                "valid": False,
                "reason": "Source document was not found.",
            }

        document = document_response.data[0]

        # ---------------------------------------------------------
        # 2. Verify chunk exists and belongs to document
        # ---------------------------------------------------------
        chunk_response = (
            self.db
            .table("research_chunks")
            .select(
                "id, document_id, chunk_index, chunk_text, "
                "page_number, section_name, content_hash"
            )
            .eq("id", chunk_id)
            .eq("document_id", document_id)
            .limit(1)
            .execute()
        )

        if not chunk_response.data:
            return {
                "valid": False,
                "reason": (
                    "Evidence chunk was not found or does not "
                    "belong to the cited document."
                ),
                "document_id": document_id,
                "chunk_id": chunk_id,
            }

        chunk = chunk_response.data[0]

        stored_chunk_text = chunk["chunk_text"]
        stored_hash = chunk["content_hash"]

        # ---------------------------------------------------------
        # 3. Verify stored chunk integrity
        # ---------------------------------------------------------
        calculated_hash = self._create_hash(stored_chunk_text)

        hash_integrity_valid = (
            calculated_hash == stored_hash
        )

        if not hash_integrity_valid:
            return {
                "valid": False,
                "reason": (
                    "Stored evidence integrity check failed. "
                    "The chunk hash does not match its stored text."
                ),
                "document_id": document_id,
                "chunk_id": chunk_id,
                "stored_hash": stored_hash,
                "calculated_hash": calculated_hash,
            }

        # ---------------------------------------------------------
        # 4. Verify expected hash if supplied
        # ---------------------------------------------------------
        if (
            expected_content_hash
            and expected_content_hash != stored_hash
        ):
            return {
                "valid": False,
                "reason": (
                    "Provided citation hash does not match "
                    "the stored evidence hash."
                ),
                "document_id": document_id,
                "chunk_id": chunk_id,
                "stored_hash": stored_hash,
                "provided_hash": expected_content_hash,
            }

        # ---------------------------------------------------------
        # 5. Exact quote verification
        # ---------------------------------------------------------
        quote = quoted_text.strip()

        quote_found = quote in stored_chunk_text

        if not quote_found:
            return {
                "valid": False,
                "reason": (
                    "The quoted text was not found exactly "
                    "inside the cited evidence chunk."
                ),
                "document_id": document_id,
                "chunk_id": chunk_id,
                "page_number": chunk.get("page_number"),
                "quote_verified": False,
                "hash_verified": True,
            }

        # ---------------------------------------------------------
        # 6. Calculate hash of quoted evidence
        # ---------------------------------------------------------
        quote_hash = self._create_hash(quote)

        # ---------------------------------------------------------
        # 7. Citation is valid
        # ---------------------------------------------------------
        return {
            "valid": True,
            "reason": "Citation successfully validated.",

            "document": {
                "id": document["id"],
                "title": document.get("title"),
                "source_name": document.get("source_name"),
                "source_url": document.get("source_url"),
                "source_type": document.get("source_type"),
                "authors": document.get("authors"),
                "published_at": document.get("published_at"),
            },

            "evidence": {
                "chunk_id": chunk["id"],
                "document_id": chunk["document_id"],
                "chunk_index": chunk.get("chunk_index"),
                "page_number": chunk.get("page_number"),
                "section_name": chunk.get("section_name"),
                "content_hash": stored_hash,
                "quote_hash": quote_hash,
            },

            "validation": {
                "document_verified": True,
                "chunk_verified": True,
                "quote_verified": True,
                "hash_verified": True,
                "citation_verified": True,
            },
        }