from datetime import date
from app.core.database import get_supabase_client
from app.services.perplexity_service import PerplexityService


class ResearchService:

    def __init__(self):
        self.db = get_supabase_client()
        self.perplexity = PerplexityService()

    async def create_research(self, query: str, max_results: int = 5):

        # 1. Search using Perplexity
        search_data = await self.perplexity.search(
            query=query,
            max_results=max_results,
        )

        # 2. Create conversation
        conversation_response = self.db.table(
            "research_conversations"
        ).insert({
            "title": query[:200]
        }).execute()

        conversation = conversation_response.data[0]
        conversation_id = conversation["id"]

        # 3. Save user's question
        user_response = self.db.table(
            "research_messages"
        ).insert({
            "conversation_id": conversation_id,
            "role": "user",
            "content": query,
        }).execute()

        # 4. Prepare assistant message
        results = search_data["results"]

        assistant_content = (
            f"Research completed. Found {len(results)} sources "
            f"for your query: {query}"
        )

        assistant_response = self.db.table(
            "research_messages"
        ).insert({
            "conversation_id": conversation_id,
            "role": "assistant",
            "content": assistant_content,
        }).execute()

        assistant_message = assistant_response.data[0]

        # 5. Save research sources
        for index, source in enumerate(results, start=1):

            self.db.table("research_sources").insert({
                "message_id": assistant_message["id"],
                "title": source["title"],
                "url": source["url"],
                "snippet": source["snippet"],
                "source_date": self._parse_date(source.get("date")),
                "last_updated": self._parse_date(
                    source.get("last_updated")
                ),
                "result_rank": index,
            }).execute()

        # 6. Return saved research
        return {
            "conversation_id": conversation_id,
            "query": query,
            "assistant_message": assistant_content,
            "total_sources": len(results),
            "sources": results,
        }

    @staticmethod
    def _parse_date(value):

        if not value:
            return None

        try:
            return date.fromisoformat(value).isoformat()
        except (ValueError, TypeError):
            return None


research_service = ResearchService