import asyncio
import hashlib
import re
from html.parser import HTMLParser
from typing import Any

import httpx

from app.core.database import get_supabase_client
from app.services.embedding_service import EmbeddingService
from app.services.perplexity_service import PerplexityService


class _TextParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.skip = 0
        self.parts: list[str] = []
        self.title = ""
        self.in_title = False

    def handle_starttag(self, tag, attrs):
        if tag in {"script", "style", "noscript", "svg"}:
            self.skip += 1
        if tag == "title":
            self.in_title = True

    def handle_endtag(self, tag):
        if tag in {"script", "style", "noscript", "svg"} and self.skip:
            self.skip -= 1
        if tag == "title":
            self.in_title = False

    def handle_data(self, data):
        if self.skip:
            return
        text = re.sub(r"\s+", " ", data).strip()
        if not text:
            return
        if self.in_title:
            self.title += " " + text
        self.parts.append(text)


class WebResearchService:
    MAX_TEXT = 12000
    CHUNK = 1800
    OVERLAP = 250

    def __init__(self):
        self.db = get_supabase_client()
        self.search = PerplexityService()
        self.embedder = EmbeddingService()

    @staticmethod
    def _chunks(text: str) -> list[str]:
        out = []
        start = 0
        while start < len(text):
            end = min(len(text), start + WebResearchService.CHUNK)
            part = text[start:end].strip()
            if part:
                out.append(part)
            if end >= len(text):
                break
            start = end - WebResearchService.OVERLAP
        return out[:8]

    async def _fetch(self, url: str) -> str:
        try:
            async with httpx.AsyncClient(
                timeout=18,
                follow_redirects=True,
                headers={"User-Agent": "RID-OS Research Bot/1.0"},
            ) as client:
                r = await client.get(url)
                r.raise_for_status()
            if "text/html" not in r.headers.get("content-type", ""):
                return ""
            p = _TextParser()
            p.feed(r.text)
            text = " ".join(p.parts)
            return re.sub(r"\s+", " ", text).strip()[: self.MAX_TEXT]
        except Exception:
            return ""

    async def search_and_index(self, query: str, conversation_id: str, max_results: int = 5, source_hint: str = "web") -> list[dict[str, Any]]:
        search_query = query
        if source_hint == "scholar":
            search_query = f"academic research paper {query}"
        elif source_hint == "ieee":
            search_query = f"IEEE standards conference paper {query}"
        elif source_hint == "patent":
            search_query = f"patent prior art {query}"

        result = await self.search.search(search_query, max_results=max_results)
        rows = result.get("results", [])
        evidence: list[dict[str, Any]] = []

        for item in rows:
            url = item.get("url")
            if not url:
                continue
            full_text = await self._fetch(url)
            text = full_text or item.get("snippet") or ""
            if not text:
                continue

            existing = (
                self.db.table("research_documents")
                .select("id,title,source_url,source_name,source_type")
                .eq("source_url", url)
                .limit(1)
                .execute()
            )
            if existing.data:
                doc = existing.data[0]
                doc_id = doc["id"]
            else:
                doc_resp = self.db.table("research_documents").insert({
                    "title": item.get("title") or url,
                    "conversation_id": conversation_id,
                    "source_name": url.split("/")[2] if "/" in url else url,
                    "source_url": url,
                    "source_type": source_hint,
                    "published_at": item.get("date"),
                    "metadata": {"web_search": True, "snippet": item.get("snippet")},
                }).execute()
                doc = doc_resp.data[0]
                doc_id = doc["id"]

            chunks_resp = (
                self.db.table("research_chunks")
                .select("id,chunk_text,chunk_index,page_number,section_name,content_hash")
                .eq("document_id", doc_id)
                .order("chunk_index")
                .execute()
            )
            chunks = chunks_resp.data or []
            if not chunks:
                parts = self._chunks(text)
                embeddings = await asyncio.gather(*(self.embedder.embed_text(p) for p in parts))
                rows_to_insert = []
                for idx, (part, emb) in enumerate(zip(parts, embeddings)):
                    rows_to_insert.append({
                        "document_id": doc_id,
                        "conversation_id": conversation_id,
                        "chunk_index": idx,
                        "chunk_text": part,
                        "page_number": None,
                        "section_name": None,
                        "content_hash": hashlib.sha256(part.encode("utf-8")).hexdigest(),
                        "embedding": emb,
                        "metadata": {"source_url": url, "web": True},
                    })
                if rows_to_insert:
                    self.db.table("research_chunks").insert(rows_to_insert).execute()
                    chunks = rows_to_insert

            if chunks:
                first = chunks[0]
                evidence.append({
                    "document_id": doc_id,
                    "chunk_id": first.get("id"),
                    "title": doc.get("title") or item.get("title"),
                    "source_name": doc.get("source_name"),
                    "source_url": url,
                    "source_type": source_hint,
                    "chunk_text": first.get("chunk_text") or item.get("snippet"),
                    "content_hash": first.get("content_hash"),
                    "page_number": first.get("page_number"),
                    "section_name": first.get("section_name"),
                    "confidence": 0.82 if full_text else 0.58,
                })
        return evidence
