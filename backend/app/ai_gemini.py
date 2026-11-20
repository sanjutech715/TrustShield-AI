"""
Optional Gemini integration layer.

Design intent (please read before wiring this into a real deployment):

  * The RULE-BASED ENGINE is always the authoritative risk score. Gemini,
    when configured, is only used to produce a more natural-language
    explanation layer on top of the signals the rule engine already
    found — it does not get to silently override the score.
  * If GEMINI_API_KEY is not set, or the `google-genai` package
    is not installed, or the call fails for any reason, this module
    returns None and the caller falls back to the rule-based engine
    with `analyzer_used: "rule_based"`. The API NEVER claims
    `analyzer_used: "gemini"` unless a live call actually succeeded —
    see the project brief's instruction not to pretend an AI/threat-intel
    service is connected when it isn't.
"""

from __future__ import annotations

import json
import logging
import os
from typing import Optional

try:
    from google import genai
    from google.genai import errors, types

    _GENAI_AVAILABLE = True
except ImportError:  # package not installed — perfectly fine, we degrade gracefully
    _GENAI_AVAILABLE = False

_LOGGER = logging.getLogger(__name__)
_MODEL_NAME = "gemini-3.5-flash-lite"

_SYSTEM_PROMPT = """You are a cybersecurity literacy assistant for TrustShield AI, \
a prototype scam-message analyzer used in India. You will be given a message and a \
set of rule-based signals that already fired on it. Your ONLY job is to write a short, \
beginner-friendly explanation (2-4 sentences) of why those signals matter, in the \
requested language/style. Do NOT invent a risk score, do NOT claim certainty that the \
message is or isn't fraud, and do NOT contradict the provided signals. Respond with ONLY \
a JSON object: {"explanation": "..."}"""


def is_configured() -> bool:
    return _GENAI_AVAILABLE and bool(os.environ.get("GEMINI_API_KEY"))


def generate_explanation(message: str, signals: list[dict], language: str) -> Optional[str]:
    """Returns a Gemini-written explanation string, or None on any failure/absence."""
    if not is_configured():
        return None

    try:
        client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])
        user_payload = json.dumps(
            {
                "message_preview": message[:500],
                "signals_detected": [s["category"] for s in signals],
                "language": language,
            },
            ensure_ascii=False,
        )
        response = client.models.generate_content(
            model=_MODEL_NAME,
            contents=user_payload,
            config=types.GenerateContentConfig(
                system_instruction=_SYSTEM_PROMPT,
                response_mime_type="application/json",
            ),
        )
        raw = (response.text or "").strip()
        raw = (
            raw.removeprefix("```json")
            .removeprefix("```")
            .removesuffix("```")
            .strip()
        )
        parsed = json.loads(raw)
        explanation = parsed.get("explanation")
        return explanation if isinstance(explanation, str) and explanation.strip() else None
    except (errors.APIError, json.JSONDecodeError) as exc:
        _LOGGER.warning(
            "Gemini explanation failed; using the rule-based explanation: %s",
            exc,
        )
        return None
