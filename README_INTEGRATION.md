# Halden R&D Intelligence — Approved Frontend + RID-OS Backend

This package keeps the approved Halden R&D Intelligence visual design and connects the research workflow to the existing FastAPI/Supabase backend.

## Live EOD scope

- Approved frontend split into `frontend/index.html`, `frontend/css/halden.css`, `frontend/js/app.js`, and `frontend/js/integration.js`.
- PDF upload -> Supabase Storage -> text extraction -> chunking -> Gemini embeddings -> pgvector retrieval.
- Live Web / Scholar / IEEE / Patent search through Perplexity Search when those source groups are selected.
- Perplexity Sonar + Gemini comparison against the same retrieved evidence.
- Evidence IDs, document/chunk IDs, source URL, content hash and citation validation.
- Dynamic source library sync from the backend.
- Existing portfolio, lenses, model panel, claims, evidence and business-case UI remain available.

## Setup

1. Copy your existing `.env` into the `backend` folder. Never commit or share API keys.
2. Run `supabase/001_rid_os.sql` in Supabase SQL Editor. If your existing database already has `match_research_chunks`, the migration deliberately drops and recreates that function because PostgreSQL does not allow changing its OUT return type in-place.
3. Run `supabase/002_storage_bucket.sql` if the `research-documents` Storage bucket does not already exist.
4. Install dependencies:

```powershell
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
```

5. Start:

```powershell
uvicorn app.main:app --reload
```

6. Open:
   - `http://127.0.0.1:8000/`
   - `http://127.0.0.1:8000/docs`
   - `http://127.0.0.1:8000/health`

## Models for this EOD build

- Perplexity: `sonar-pro`
- Gemini: `gemini-2.5-flash`

These are configuration values only. They can be changed later in `.env` without redesigning the frontend.

## Upload scope

The reliable EOD upload path is PDF. The approved UI may mention broader file types for the product concept, but this backend intentionally does not pretend to parse unsupported formats. Add dedicated DOCX/PPTX/XLSX/CSV parsers before enabling those types.
