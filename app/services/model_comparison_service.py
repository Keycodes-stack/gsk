import asyncio
import json
import re
from typing import Any

import httpx
from google import genai
from google.genai import types

from app.core.config import settings


class ModelComparisonError(Exception):
    pass


class ModelComparisonService:
    """Run Perplexity and Gemini against the same evidence set."""

    def __init__(self):
        if not settings.PERPLEXITY_API_KEY:
            raise ModelComparisonError("PERPLEXITY_API_KEY is not configured.")

        if not settings.GEMINI_API_KEY:
            raise ModelComparisonError("GEMINI_API_KEY is not configured.")

        self.perplexity_model = settings.PERPLEXITY_MODEL
        self.gemini_model = settings.GEMINI_MODEL

        self.gemini = genai.Client(
            api_key=settings.GEMINI_API_KEY
        )

    @staticmethod
    def _evidence_text(evidence: list[dict[str, Any]]) -> str:
        blocks = []

        for i, item in enumerate(evidence, 1):
            blocks.append(
                f"[E{i}]\n"
                f"Title: {item.get('title') or 'Untitled'}\n"
                f"Source type: {item.get('source_type') or 'unknown'}\n"
                f"Publisher/source: {item.get('source_name') or ''}\n"
                f"URL: {item.get('source_url') or ''}\n"
                f"Passage:\n"
                f"{item.get('chunk_text') or item.get('snippet') or ''}"
            )

        return "\n\n".join(blocks)

    @staticmethod
    def _prompt(query: str, evidence_text: str) -> str:
        return f"""You are an R&D research analyst.

Answer the user's research question using ONLY the evidence blocks below.

Question:
{query}

Evidence:
{evidence_text}

Rules:
- Do not invent facts, studies, numbers, or sources.
- Every material factual claim must cite one or more evidence IDs such as [E1] or [E2].
- If the evidence is insufficient, explicitly say so.
- Separate evidence-backed findings from uncertainty.
- Return valid JSON only.

Required JSON shape:
{{
  "answer": "concise but useful answer with inline [E#] citations",
  "claims": [
    {{
      "text": "claim",
      "evidence": ["E1"]
    }}
  ],
  "confidence": 0
}}

confidence must be a 0-100 evidence-confidence score, not a probability of truth.
"""

    @staticmethod
    def _parse_json(text: str) -> dict[str, Any]:
        text = (text or "").strip()

        if not text:
            raise ValueError("Empty model response")

        # Direct JSON
        try:
            return json.loads(text)
        except json.JSONDecodeError:
            pass

        # Remove markdown code fences if model returns them
        cleaned = re.sub(
            r"^```(?:json)?\s*",
            "",
            text,
            flags=re.IGNORECASE,
        )
        cleaned = re.sub(
            r"\s*```$",
            "",
            cleaned,
        ).strip()

        try:
            return json.loads(cleaned)
        except json.JSONDecodeError:
            pass

        # Try extracting the outer JSON object
        start = cleaned.find("{")
        end = cleaned.rfind("}")

        if start == -1 or end == -1 or end <= start:
            raise ValueError("Model response does not contain valid JSON.")

        return json.loads(cleaned[start : end + 1])

    @staticmethod
    def _sanitize(
        result: dict[str, Any],
        allowed: set[str],
    ) -> dict[str, Any]:

        answer = str(
            result.get("answer") or ""
        ).strip()

        def citation_filter(match):
            ref = f"E{match.group(1)}"

            if ref in allowed:
                return match.group(0)

            return ""

        answer = re.sub(
            r"\[E(\d+)\]",
            citation_filter,
            answer,
        )

        claims = []

        for claim in result.get("claims") or []:
            if not isinstance(claim, dict):
                continue

            refs = [
                str(ref)
                for ref in (claim.get("evidence") or [])
                if str(ref) in allowed
            ]

            claim_text = str(
                claim.get("text") or ""
            ).strip()

            if claim_text and refs:
                claims.append(
                    {
                        "text": claim_text,
                        "evidence": refs,
                    }
                )

        confidence = result.get("confidence", 0)

        try:
            confidence = max(
                0,
                min(
                    100,
                    int(float(confidence)),
                ),
            )
        except Exception:
            confidence = 0

        return {
            "answer": answer,
            "claims": claims,
            "confidence": confidence,
        }

    async def _perplexity(
        self,
        prompt: str,
    ) -> dict[str, Any]:

        headers = {
            "Authorization": (
                f"Bearer {settings.PERPLEXITY_API_KEY}"
            ),
            "Content-Type": "application/json",
        }

        # Perplexity Responses / Agent API
        payload = {
            "model": self.perplexity_model,
            "input": prompt,
        }

        async with httpx.AsyncClient(
            timeout=120.0
        ) as client:

            response = await client.post(
                "https://api.perplexity.ai/v1/responses",
                headers=headers,
                json=payload,
            )

            response.raise_for_status()

            data = response.json()

        # The Responses API may expose the generated text
        # through output / content structures.
        content = self._extract_perplexity_text(data)

        return self._parse_json(content)

    @staticmethod
    def _extract_perplexity_text(
        data: dict[str, Any],
    ) -> str:

        # Common direct text field
        if isinstance(data.get("output_text"), str):
            return data["output_text"]

        # Some Responses API responses expose output
        # as a list of items.
        output = data.get("output")

        if isinstance(output, list):
            collected = []

            for item in output:
                if not isinstance(item, dict):
                    continue

                # Direct text
                if isinstance(item.get("text"), str):
                    collected.append(item["text"])

                # Nested content
                content = item.get("content")

                if isinstance(content, list):
                    for part in content:
                        if not isinstance(part, dict):
                            continue

                        if isinstance(part.get("text"), str):
                            collected.append(part["text"])

            if collected:
                return "\n".join(collected)

        # Fallback for response formats exposing choices
        choices = data.get("choices")

        if isinstance(choices, list) and choices:
            first = choices[0]

            if isinstance(first, dict):
                message = first.get("message")

                if isinstance(message, dict):
                    content = message.get("content")

                    if isinstance(content, str):
                        return content

        raise ValueError(
            "Unable to extract text from Perplexity Responses API."
        )

    async def _gemini(
        self,
        prompt: str,
    ) -> dict[str, Any]:

        response = await self.gemini.aio.models.generate_content(
            model=self.gemini_model,
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=0.1,
                response_mime_type="application/json",
            ),
        )

        return self._parse_json(
            response.text or ""
        )

    async def compare(
        self,
        query: str,
        evidence: list[dict[str, Any]],
    ) -> dict[str, Any]:

        if not evidence:
            raise ModelComparisonError(
                "No evidence is available for model comparison."
            )

        prompt = self._prompt(
            query,
            self._evidence_text(evidence),
        )

        allowed = {
            f"E{i}"
            for i in range(1, len(evidence) + 1)
        }

        async def run(name, fn):
            try:
                raw = await fn(prompt)

                return {
                    "name": name,
                    "status": "completed",
                    **self._sanitize(
                        raw,
                        allowed,
                    ),
                }

            except Exception as exc:
                return {
                    "name": name,
                    "status": "unavailable",
                    "answer": "",
                    "claims": [],
                    "confidence": 0,
                    "error": (
                        f"{type(exc).__name__}: "
                        f"{str(exc)[:500]}"
                    ),
                }

        perplexity, gemini = await asyncio.gather(
            run(
                "Perplexity Sonar",
                self._perplexity,
            ),
            run(
                "Gemini",
                self._gemini,
            ),
        )

        completed = [
            model
            for model in (perplexity, gemini)
            if model["status"] == "completed"
        ]

        if not completed:
            raise ModelComparisonError(
                "Both research models failed to return an answer."
            )

        # ---------------------------------------------------------
        # Agreement calculation
        # ---------------------------------------------------------
        #
        # IMPORTANT:
        # If only one model completed, we DO NOT report
        # an artificial agreement percentage.
        #
        # This fixes the previous "overall": 100 problem.
        # ---------------------------------------------------------

        if len(completed) < 2:

            agreement = {
                "evidence_agreement": None,
                "answer_overlap": None,
                "overall": None,
                "interpretation": (
                    "Model comparison unavailable: "
                    "only one model returned a response."
                ),
            }

        else:

            p_refs = {
                ref
                for claim in perplexity.get("claims", [])
                for ref in claim.get("evidence", [])
            }

            g_refs = {
                ref
                for claim in gemini.get("claims", [])
                for ref in claim.get("evidence", [])
            }

            if p_refs or g_refs:

                union = p_refs | g_refs

                evidence_agreement = round(
                    100
                    * len(p_refs & g_refs)
                    / max(1, len(union))
                )

            else:
                evidence_agreement = 0

            def words(text: str) -> set[str]:
                return set(
                    re.findall(
                        r"[a-zA-Z0-9]{4,}",
                        (text or "").lower(),
                    )
                )

            perplexity_words = words(
                perplexity.get("answer")
            )

            gemini_words = words(
                gemini.get("answer")
            )

            if perplexity_words and gemini_words:

                lexical = round(
                    100
                    * len(
                        perplexity_words
                        & gemini_words
                    )
                    / max(
                        1,
                        len(
                            perplexity_words
                            | gemini_words
                        ),
                    )
                )

            else:
                lexical = 0

            overall = round(
                0.7 * evidence_agreement
                + 0.3 * lexical
            )

            agreement = {
                "evidence_agreement": evidence_agreement,
                "answer_overlap": lexical,
                "overall": overall,
                "interpretation": (
                    "Consistency signal, "
                    "not a truth probability."
                ),
            }

        return {
            "models": [
                perplexity,
                gemini,
            ],
            "agreement": agreement,
        }