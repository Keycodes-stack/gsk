
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from pydantic import BaseModel
from uuid import UUID

from app.core.database import get_supabase_client
from app.services.document_storage_service import (
    DocumentStorageService,
    DocumentStorageError,
)
from app.services.pdf_indexing_service import (
    PDFIndexingService,
    PDFIndexingError,
)
from app.services.embedding_service import EmbeddingServiceError


router = APIRouter(tags=["Research Documents"])


class PDFIndexRequest(BaseModel):
    document_id: UUID


@router.get("/documents")
async def list_research_documents():
    try:
        db = get_supabase_client()
        response = (
            db.table("research_documents")
            .select("id,title,conversation_id,source_name,source_url,source_type,authors,published_at,file_path,metadata,created_at")
            .order("created_at", desc=True)
            .execute()
        )
        return {"success": True, "total": len(response.data or []), "documents": response.data or []}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Could not retrieve documents: {type(exc).__name__}: {str(exc)}") from exc


@router.post("/documents/upload")
async def upload_research_pdf(
    file: UploadFile = File(...),
    title: str = Form(...),
    conversation_id: str | None = Form(default=None),
    source_name: str | None = Form(default=None),
    source_url: str | None = Form(default=None),
    authors: str | None = Form(default=None),
    published_at: str | None = Form(default=None),
):
    storage_service = DocumentStorageService()
    db = get_supabase_client()

    try:
        file_bytes = await file.read()

        uploaded = await storage_service.upload_pdf(
            file_bytes=file_bytes,
            filename=file.filename or "research.pdf",
            conversation_id=conversation_id,
        )

        document_payload = {
            "title": title.strip(),
            "conversation_id": conversation_id,
            "source_name": source_name,
            "source_url": source_url,
            "source_type": "research_paper",
            "authors": authors,
            "published_at": published_at,
            "file_path": uploaded["file_path"],
            "metadata": {
                "original_filename": uploaded["original_filename"],
                "file_size": uploaded["file_size"],
                "content_type": "application/pdf",
                "storage_bucket": uploaded["bucket"],
            },
        }

        response = (
            db.table("research_documents")
            .insert(document_payload)
            .execute()
        )

        if not response.data:
            raise Exception("Document metadata was not saved.")

        return {
            "success": True,
            "message": "Research PDF uploaded successfully.",
            "document": response.data[0],
        }

    except (DocumentStorageError, ValueError) as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        ) from exc

    except Exception as exc:
        print(f"PDF UPLOAD ERROR: {type(exc).__name__}: {str(exc)}")
        raise HTTPException(
            status_code=500,
            detail=f"PDF upload failed: {type(exc).__name__}: {str(exc)}",
        ) from exc

    finally:
        await file.close()


@router.post("/documents/index")
async def index_research_pdf(request: PDFIndexRequest):
    try:
        service = PDFIndexingService()

        result = await service.index_document(
            document_id=str(request.document_id)
        )

        return result

    except PDFIndexingError as exc:
        raise HTTPException(
            status_code=500,
            detail=str(exc),
        ) from exc

    except EmbeddingServiceError as exc:
        raise HTTPException(
            status_code=502,
            detail=str(exc),
        ) from exc
