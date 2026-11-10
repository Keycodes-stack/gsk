
import hashlib
from typing import Any

from app.core.database import get_supabase_client
from app.services.document_storage_service import (
    DocumentStorageService,
)
from app.services.pdf_extraction_service import (
    PDFExtractionService,
)
from app.services.embedding_service import (
    EmbeddingService,
    EmbeddingServiceError,
)


class PDFIndexingError(Exception):
    """Raised when PDF vector indexing fails."""


class PDFIndexingService:
    CHUNK_SIZE = 1800
    CHUNK_OVERLAP = 250

    def __init__(self):
        self.db = get_supabase_client()
        self.storage = DocumentStorageService()
        self.extractor = PDFExtractionService()
        self.embedding_service = EmbeddingService()

    @staticmethod
    def _create_hash(text: str) -> str:
        return hashlib.sha256(
            text.encode("utf-8")
        ).hexdigest()

    def _create_chunks(self, text: str) -> list[str]:
        chunks = []
        start = 0

        while start < len(text):
            end = min(
                start + self.CHUNK_SIZE,
                len(text),
            )

            chunk = text[start:end].strip()

            if chunk:
                chunks.append(chunk)

            if end >= len(text):
                break

            start = end - self.CHUNK_OVERLAP

        return chunks

    async def index_document(
        self,
        document_id: str,
    ) -> dict[str, Any]:

        try:
            # 1. Fetch existing document metadata
            response = (
                self.db.table("research_documents")
                .select("*")
                .eq("id", document_id)
                .limit(1)
                .execute()
            )

            if not response.data:
                raise PDFIndexingError(
                    "Research document was not found."
                )

            document = response.data[0]

            file_path = document.get("file_path")

            if not file_path:
                raise PDFIndexingError(
                    "Document has no stored PDF file path."
                )

            # 2. Prevent accidental duplicate indexing
            existing_chunks = (
                self.db.table("research_chunks")
                .select("id")
                .eq("document_id", document_id)
                .limit(1)
                .execute()
            )

            if existing_chunks.data:
                raise PDFIndexingError(
                    "This document already has indexed chunks."
                )

            # 3. Download PDF from private Supabase Storage
            pdf_bytes = await self.storage.download_pdf(
                file_path
            )

            # 4. Extract page-wise text
            extraction = await self.extractor.extract_text(
                pdf_bytes
            )

            # 5. Create page-aware chunks and embeddings
            chunk_rows = []
            chunk_index = 0

            for page in extraction["pages"]:
                page_number = page["page_number"]
                page_text = page["text"]

                page_chunks = self._create_chunks(page_text)

                for chunk_text in page_chunks:
                    embedding = (
                        await self.embedding_service.embed_text(
                            chunk_text
                        )
                    )

                    chunk_rows.append({
                        "document_id": document_id,
                        "conversation_id": document.get(
                            "conversation_id"
                        ),
                        "chunk_index": chunk_index,
                        "chunk_text": chunk_text,
                        "page_number": page_number,
                        "content_hash": self._create_hash(
                            chunk_text
                        ),
                        "embedding": embedding,
                        "metadata": {
                            "document_title": document["title"],
                            "source_name": document.get(
                                "source_name"
                            ),
                            "source_url": document.get(
                                "source_url"
                            ),
                            "storage_file_path": file_path,
                        },
                    })

                    chunk_index += 1

            if not chunk_rows:
                raise PDFIndexingError(
                    "No chunks were generated from this PDF."
                )

            # 6. Save all chunks and vectors in Supabase
            insert_response = (
                self.db.table("research_chunks")
                .insert(chunk_rows)
                .execute()
            )

            if not insert_response.data:
                raise PDFIndexingError(
                    "Supabase did not save the vector chunks."
                )

            return {
                "success": True,
                "document_id": document_id,
                "document_title": document["title"],
                "total_pages": extraction["total_pages"],
                "extracted_pages": extraction["extracted_pages"],
                "total_chunks": len(insert_response.data),
                "embedding_dimensions": 768,
                "message": "PDF successfully indexed.",
            }

        except (
            PDFIndexingError,
            EmbeddingServiceError,
        ):
            raise

        except Exception as exc:
            raise PDFIndexingError(
                f"PDF indexing failed: {type(exc).__name__}: {str(exc)}"
            ) from exc
