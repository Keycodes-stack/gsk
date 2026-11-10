
import uuid
from pathlib import Path
from typing import Any

from app.core.database import get_supabase_client


class DocumentStorageError(Exception):
    """Raised when PDF storage operations fail."""


class DocumentStorageService:
    BUCKET_NAME = "research-documents"
    MAX_FILE_SIZE = 25 * 1024 * 1024  # 25 MB

    def __init__(self):
        self.db = get_supabase_client()
        self.storage = self.db.storage.from_(self.BUCKET_NAME)

    async def upload_pdf(
        self,
        file_bytes: bytes,
        filename: str,
        conversation_id: str | None = None,
    ) -> dict[str, Any]:

        if not filename.lower().endswith(".pdf"):
            raise ValueError("Only PDF files are allowed.")

        if not file_bytes:
            raise ValueError("PDF file is empty.")

        if len(file_bytes) > self.MAX_FILE_SIZE:
            raise ValueError("PDF size cannot exceed 25 MB.")

        if not file_bytes.startswith(b"%PDF-"):
            raise ValueError("Invalid PDF file format.")

        safe_filename = Path(filename).name
        unique_filename = f"{uuid.uuid4().hex}_{safe_filename}"

        folder = conversation_id or "unassigned"
        file_path = f"{folder}/{unique_filename}"

        try:
            self.storage.upload(
                path=file_path,
                file=file_bytes,
                file_options={
                    "content-type": "application/pdf",
                    "upsert": "false",
                },
            )

            return {
                "success": True,
                "bucket": self.BUCKET_NAME,
                "file_path": file_path,
                "original_filename": safe_filename,
                "file_size": len(file_bytes),
                "content_type": "application/pdf",
            }

        except Exception as exc:
            raise DocumentStorageError(
                f"PDF upload failed: {type(exc).__name__}: {str(exc)}"
            ) from exc

    async def download_pdf(self, file_path: str) -> bytes:
        if not file_path or not file_path.strip():
            raise ValueError("PDF file path cannot be empty.")

        try:
            file_bytes = self.storage.download(file_path)

            if not file_bytes:
                raise DocumentStorageError(
                    "Downloaded PDF is empty."
                )

            if not file_bytes.startswith(b"%PDF-"):
                raise DocumentStorageError(
                    "Stored file is not a valid PDF."
                )

            return file_bytes

        except DocumentStorageError:
            raise

        except Exception as exc:
            raise DocumentStorageError(
                f"PDF download failed: {type(exc).__name__}: {str(exc)}"
            ) from exc
