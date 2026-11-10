from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.core.database import get_supabase_client
from app.services.embedding_service import EmbeddingServiceError
from app.services.perplexity_service import PerplexityService, PerplexityServiceError
from app.services.research_service import ResearchService
from app.services.retrieval_service import ResearchRetrievalService, RetrievalServiceError
from app.services.document_ingestion_service import DocumentIngestionService, DocumentIngestionError
from app.services.model_comparison_service import ModelComparisonService, ModelComparisonError
from app.services.web_research_service import WebResearchService

router = APIRouter(prefix="/research", tags=["Research"])


class SearchRequest(BaseModel):
    query: str = Field(min_length=3, max_length=1000)
    max_results: int = Field(default=10, ge=1, le=20)
    search_context_size: str = "medium"
    country: str | None = None


@router.post("/search")
async def search_research(request: SearchRequest):
    try:
        result = await PerplexityService().search(
            query=request.query,
            max_results=request.max_results,
            search_context_size=request.search_context_size,
            country=request.country,
        )
        return {"success": True, "data": result}
    except (PerplexityServiceError, ValueError) as exc:
        raise HTTPException(status_code=502 if isinstance(exc, PerplexityServiceError) else 400, detail=str(exc)) from exc


class ResearchAskRequest(BaseModel):
    query: str = Field(min_length=3, max_length=2000)
    conversation_id: str | None = None
    source_types: list[str] = Field(default_factory=lambda: ["web", "uploads"])
    max_results: int = Field(default=5, ge=1, le=10)
    match_count: int = Field(default=8, ge=1, le=20)
    similarity_threshold: float = Field(default=0.35, ge=0, le=1)


@router.post("/ask")
async def ask_research(request: ResearchAskRequest):
    """Create a research turn, optionally search live web, retrieve evidence, and compare Perplexity + Gemini."""
    db = get_supabase_client()
    try:
        conversation_id = request.conversation_id
        if conversation_id:
            conv = db.table("research_conversations").select("id").eq("id", conversation_id).limit(1).execute()
            if not conv.data:
                raise HTTPException(status_code=404, detail="Conversation not found.")
        else:
            conv = db.table("research_conversations").insert({"title": request.query[:200]}).execute()
            conversation_id = conv.data[0]["id"]

        db.table("research_messages").insert({
            "conversation_id": conversation_id,
            "role": "user",
            "content": request.query,
            "metadata": {"source_types": request.source_types},
        }).execute()

        source_types = set(request.source_types)
        web_evidence = []
        if source_types.intersection({"web", "scholar", "ieee", "patent"}):
            hint = "web"
            if "scholar" in source_types: hint = "scholar"
            elif "ieee" in source_types: hint = "ieee"
            elif "patent" in source_types: hint = "patent"
            web_evidence = await WebResearchService().search_and_index(
                request.query, conversation_id, request.max_results, hint
            )

        retrieval_scope = conversation_id if web_evidence and "uploads" not in source_types else None
        evidence = await ResearchRetrievalService().retrieve(
            query=request.query,
            conversation_id=retrieval_scope,
            match_count=request.match_count,
            similarity_threshold=request.similarity_threshold,
        )

        # If retrieval returned nothing, use the web materialized evidence directly.
        if not evidence:
            evidence = web_evidence

        # Deduplicate by chunk/document and keep a compact evidence set.
        seen = set()
        clean = []
        for item in evidence + web_evidence:
            key = (str(item.get("document_id")), str(item.get("chunk_id")), item.get("source_url"))
            if key in seen:
                continue
            seen.add(key)
            clean.append(item)
            if len(clean) >= request.match_count:
                break

        comparison = await ModelComparisonService().compare(request.query, clean)
        models = comparison["models"]
        best = next((m for m in models if m["status"] == "completed"), models[0])

        assistant = db.table("research_messages").insert({
            "conversation_id": conversation_id,
            "role": "assistant",
            "content": best.get("answer") or "No answer returned.",
            "metadata": {"agreement": comparison["agreement"], "models": models},
        }).execute()
        message_id = assistant.data[0]["id"] if assistant.data else None

        for rank, item in enumerate(clean, 1):
            if message_id:
                db.table("research_sources").insert({
                    "message_id": message_id,
                    "title": item.get("title"),
                    "url": item.get("source_url"),
                    "snippet": item.get("chunk_text") or item.get("snippet"),
                    "result_rank": rank,
                    "metadata": {
                        "document_id": item.get("document_id"),
                        "chunk_id": item.get("chunk_id"),
                        "source_type": item.get("source_type"),
                        "content_hash": item.get("content_hash"),
                    },
                }).execute()

        return {
            "success": True,
            "conversation_id": conversation_id,
            "message_id": message_id,
            "query": request.query,
            "answer": best.get("answer"),
            "models": models,
            "agreement": comparison["agreement"],
            "evidence": clean,
        }
    except HTTPException:
        raise
    except (ModelComparisonError, PerplexityServiceError, EmbeddingServiceError) as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Research processing failed: {type(exc).__name__}: {str(exc)}") from exc


class ResearchChatRequest(BaseModel):
    query: str = Field(min_length=3, max_length=1000)
    max_results: int = Field(default=5, ge=1, le=20)


@router.post("/chat")
async def research_chat(request: ResearchChatRequest):
    try:
        result = await ResearchService().create_research(query=request.query, max_results=request.max_results)
        return {"success": True, "message": "Research completed and saved successfully.", "data": result}
    except PerplexityServiceError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Research processing failed: {str(exc)}") from exc


@router.get("/conversations")
async def get_conversations():
    try:
        db = get_supabase_client()
        response = db.table("research_conversations").select("*").order("created_at", desc=True).execute()
        return {"success": True, "total": len(response.data), "conversations": response.data}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Could not retrieve conversations: {str(exc)}") from exc


@router.get("/conversations/{conversation_id}")
async def get_conversation(conversation_id: str):
    try:
        db = get_supabase_client()
        conversation_response = db.table("research_conversations").select("*").eq("id", conversation_id).execute()
        if not conversation_response.data:
            raise HTTPException(status_code=404, detail="Conversation not found.")
        messages_response = db.table("research_messages").select("*").eq("conversation_id", conversation_id).order("created_at").execute()
        messages = messages_response.data
        message_ids = [m["id"] for m in messages]
        sources = []
        if message_ids:
            sources = db.table("research_sources").select("*").in_("message_id", message_ids).order("result_rank").execute().data
        return {"success": True, "conversation": conversation_response.data[0], "messages": messages, "sources": sources}
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Could not retrieve conversation: {str(exc)}") from exc


class DocumentIngestionRequest(BaseModel):
    title: str = Field(min_length=3, max_length=500)
    text: str = Field(min_length=50)
    source_name: str | None = None
    source_url: str | None = None
    source_type: str = "article"
    authors: str | None = None
    published_at: str | None = None


@router.post("/documents/ingest")
async def ingest_research_document(request: DocumentIngestionRequest):
    try:
        result = await DocumentIngestionService().ingest_text(
            title=request.title, text=request.text, source_name=request.source_name,
            source_url=request.source_url, source_type=request.source_type,
            authors=request.authors, published_at=request.published_at,
        )
        return {"success": True, "message": "Research document ingested successfully.", "data": result}
    except DocumentIngestionError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Document ingestion failed: {str(exc)}") from exc


class EvidenceRetrievalRequest(BaseModel):
    query: str = Field(min_length=3, max_length=1000)
    conversation_id: str | None = None
    match_count: int = Field(default=8, ge=1, le=20)
    similarity_threshold: float = Field(default=0.45, ge=0, le=1)


@router.post("/evidence/retrieve")
async def retrieve_research_evidence(request: EvidenceRetrievalRequest):
    try:
        results = await ResearchRetrievalService().retrieve(
            query=request.query, conversation_id=request.conversation_id,
            match_count=request.match_count, similarity_threshold=request.similarity_threshold,
        )
        return {"success": True, "total_results": len(results), "evidence": results}
    except RetrievalServiceError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    except EmbeddingServiceError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
