
import asyncio
from typing import Any

import pymupdf as fitz


class PDFExtractionError(Exception):
    """Raised when PDF text extraction fails."""


class PDFExtractionService:
    @staticmethod
    def _extract_sync(pdf_bytes: bytes) -> dict[str, Any]:
        if not pdf_bytes:
            raise PDFExtractionError("PDF file is empty.")

        if not pdf_bytes.startswith(b"%PDF-"):
            raise PDFExtractionError("Invalid PDF file format.")

        try:
            pages = []
            extracted_text = []

            with fitz.open(
                stream=pdf_bytes,
                filetype="pdf"
            ) as document:

                if document.is_encrypted:
                    raise PDFExtractionError(
                        "Password-protected PDFs are not supported yet."
                    )

                total_pages = len(document)

                if total_pages == 0:
                    raise PDFExtractionError(
                        "PDF contains no pages."
                    )

                for page_number, page in enumerate(document, start=1):
                    page_text = page.get_text("text").strip()

                    if page_text:
                        pages.append({
                            "page_number": page_number,
                            "text": page_text,
                        })

                        extracted_text.append(page_text)

            full_text = "\n\n".join(extracted_text).strip()

            if not full_text:
                raise PDFExtractionError(
                    "No selectable text found. "
                    "This may be a scanned PDF requiring OCR."
                )

            return {
                "total_pages": total_pages,
                "extracted_pages": len(pages),
                "pages": pages,
                "full_text": full_text,
                "total_characters": len(full_text),
            }

        except PDFExtractionError:
            raise

        except Exception as exc:
            raise PDFExtractionError(
                f"PDF extraction failed: {type(exc).__name__}"
            ) from exc

    async def extract_text(
        self,
        pdf_bytes: bytes
    ) -> dict[str, Any]:

        return await asyncio.to_thread(
            self._extract_sync,
            pdf_bytes
        )
