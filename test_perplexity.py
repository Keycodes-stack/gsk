import asyncio

from app.services.model_comparison_service import ModelComparisonService


async def main():
    service = ModelComparisonService()

    result = await service._perplexity(
        """
Return valid JSON only:

{
  "answer": "AI is artificial intelligence.",
  "claims": [],
  "confidence": 90
}
"""
    )

    print("PERPLEXITY OK")
    print(result)


if __name__ == "__main__":
    asyncio.run(main())