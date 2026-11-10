
import asyncio

from app.services.document_storage_service import DocumentStorageService
from app.services.pdf_extraction_service import PDFExtractionService


async def main():
    file_path = (
        "unassigned/"
        "1b18fa231d30444d93de87aac4a6ac19_S1.pdf"
    )

    storage = DocumentStorageService()
    extractor = PDFExtractionService()

    print("Downloading PDF from Supabase...")

    pdf_bytes = await storage.download_pdf(file_path)

    print(f"Downloaded size: {len(pdf_bytes):,} bytes")

    print("Extracting PDF text...")

    result = await extractor.extract_text(pdf_bytes)

    print("\n========== EXTRACTION RESULT ==========")
    print("Total pages:", result["total_pages"])
    print("Extracted pages:", result["extracted_pages"])
    print("Total characters:", result["total_characters"])

    print("\n========== FIRST 1500 CHARACTERS ==========")
    print(result["full_text"][:1500])


if __name__ == "__main__":
    asyncio.run(main())
