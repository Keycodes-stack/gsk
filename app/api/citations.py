from uuid import UUID

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.services.citation_validation_service import (
    CitationValidationError,
    CitationValidationService,
)


router = APIRouter(
    prefix="/citations",
    tags=["Citation Validation"],
)


class CitationValidationRequest(BaseModel):
    document_id: UUID
    chunk_id: UUID
    quoted_text: str = Field(
        min_length=3,
        max_length=5000,
    )
    expected_content_hash: str | None = None


@router.post("/validate")
async def validate_citation(
    request: CitationValidationRequest,
):
    service = CitationValidationService()

    try:
        result = await service.validate_citation(
            document_id=str(request.document_id),
            chunk_id=str(request.chunk_id),
            quoted_text=request.quoted_text,
            expected_content_hash=request.expected_content_hash,
        )

        return result

    except CitationValidationError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        ) from exc

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=(
                f"Citation validation failed: "
                f"{type(exc).__name__}: {str(exc)}"
            ),
        ) from exc