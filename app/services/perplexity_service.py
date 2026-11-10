
import httpx

from app.core.config import settings


PERPLEXITY_SEARCH_URL = "https://api.perplexity.ai/search"


class PerplexityServiceError(Exception):
    """Raised when the Perplexity Search API request fails."""


class PerplexityService:

    def __init__(self):
        if not settings.PERPLEXITY_API_KEY:
            raise PerplexityServiceError(
                "PERPLEXITY_API_KEY is not configured."
            )

        self.api_key = settings.PERPLEXITY_API_KEY

    async def search(
        self,
        query: str | list[str],
        max_results: int = 10,
        search_context_size: str = "medium",
        country: str | None = None,
    ) -> dict:

        if not isinstance(query, (str, list)):
            raise ValueError("Query must be a string or list.")

        if isinstance(query, list):
            if not 1 <= len(query) <= 5:
                raise ValueError("Provide between 1 and 5 queries.")

        if not 1 <= max_results <= 20:
            raise ValueError("max_results must be between 1 and 20.")

        payload = {
            "query": query,
            "max_results": max_results,
            "search_context_size": search_context_size,
        }

        if country:
            payload["country"] = country

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

        try:
            async with httpx.AsyncClient(timeout=45.0) as client:
                response = await client.post(
                    PERPLEXITY_SEARCH_URL,
                    headers=headers,
                    json=payload,
                )

            if response.status_code == 401:
                raise PerplexityServiceError(
                    "Authentication failed. Check your API key."
                )

            if response.status_code == 429:
                raise PerplexityServiceError(
                    "Perplexity rate limit reached. Retry later."
                )

            response.raise_for_status()
            data = response.json()

            results = data.get("results", [])

            return {
                "query": query,
                "total_results": len(results),
                "results": [
                    {
                        "title": item["title"],
                        "url": item["url"],
                        "snippet": item["snippet"],
                        "date": item.get("date"),
                        "last_updated": item.get("last_updated"),
                    }
                    for item in results
                ],
            }

        except httpx.TimeoutException as exc:
            raise PerplexityServiceError(
                "Perplexity request timed out."
            ) from exc

        except httpx.HTTPStatusError as exc:
            raise PerplexityServiceError(
                f"Perplexity API returned HTTP {exc.response.status_code}."
            ) from exc

        except httpx.RequestError as exc:
            raise PerplexityServiceError(
                "Could not connect to Perplexity API."
            ) from exc
    async def generate_answer(
        self,
        query: str,
        effort: str = "high",
    ) -> dict:

        if not query or not query.strip():
            raise ValueError("Research query cannot be empty.")

        if effort not in {"fast", "low", "medium", "high", "xhigh"}:
            raise ValueError("Invalid Perplexity effort level.")

        payload = {
            "effort": effort,
            "input": (
                "Conduct independent research on the following question.\n\n"
                f"Research question: {query}\n\n"
                "Requirements:\n"
                "1. Provide a detailed, structured research answer.\n"
                "2. Use reliable sources and web search where relevant.\n"
                "3. Include citations or source references for factual claims.\n"
                "4. Clearly distinguish established facts from uncertainty.\n"
                "5. Never invent studies, statistics, references, or findings.\n"
                "6. Explicitly state when reliable evidence is insufficient.\n"
                "7. Do not compare your answer with another AI model.\n"
            ),
            "tools": [
                {"type": "web_search"}
            ],
        }

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

        try:
            async with httpx.AsyncClient(timeout=180.0) as client:
                response = await client.post(
                    "https://api.perplexity.ai/v1/agent",
                    headers=headers,
                    json=payload,
                )

            response.raise_for_status()
            data = response.json()

            answer_parts = []

            for item in data.get("output", []):
                if item.get("type") == "message":
                    for content in item.get("content", []):
                        if content.get("type") == "output_text":
                            answer_parts.append(content.get("text", ""))

            answer = "\n".join(
                part for part in answer_parts if part
            ).strip()

            if data.get("status") != "completed":
                raise PerplexityServiceError(
                    f"Perplexity research did not complete. "
                    f"Status: {data.get('status')}"
                )

            if not answer:
                raise PerplexityServiceError(
                    "Perplexity returned an empty research answer."
                )

            return {
                "model_provider": "Perplexity",
                "model": data.get("model"),
                "response_id": data.get("id"),
                "status": data.get("status"),
                "answer": answer,
                "sources": [
                    {
                        "title": item.get("title"),
                        "url": item.get("url"),
                        "snippet": item.get("snippet"),
                        "date": item.get("date"),
                    }
                    for item in data.get("output", [])
                    if item.get("type") == "search_results"
                    for item in item.get("results", [])
                ],
                "usage": data.get("usage"),
            }

        except httpx.TimeoutException as exc:
            raise PerplexityServiceError(
                "Perplexity research request timed out."
            ) from exc

        except httpx.HTTPStatusError as exc:
            raise PerplexityServiceError(
                f"Perplexity API returned HTTP "
                f"{exc.response.status_code}: "
                f"{exc.response.text[:500]}"
            ) from exc

        except httpx.RequestError as exc:
            raise PerplexityServiceError(
                "Could not connect to Perplexity API."
            ) from exc

perplexity_service = PerplexityService
