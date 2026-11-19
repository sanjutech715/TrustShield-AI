from __future__ import annotations

from fastapi import APIRouter

from .. import ai_gemini, database, risk_engine
from ..models import AnalyzeRequest, AnalyzeResponse, WarningSignal

router = APIRouter(prefix="/api", tags=["analyze"])


@router.post("/analyze", response_model=AnalyzeResponse)
def analyze_message(payload: AnalyzeRequest) -> AnalyzeResponse:
    result = risk_engine.analyze_message(payload.message, payload.language)

    # Gemini, if configured, only ever rewrites the `summary` text — the
    # score, category and signal list always come from the rule engine.
    gemini_text = ai_gemini.generate_explanation(
        payload.message, result["signals"], result["language_detected"]
    )
    if gemini_text:
        result["summary"] = gemini_text
        result["analyzer_used"] = "gemini"

    database.log_analysis(
        input_type="message",
        input_preview=payload.message,
        risk_score=result["risk_score"],
        risk_category=result["risk_category"],
        analyzer_used=result["analyzer_used"],
        language=result["language_detected"],
    )

    return AnalyzeResponse(
        risk_score=result["risk_score"],
        risk_category=result["risk_category"],
        signals=[WarningSignal(**s) for s in result["signals"]],
        summary=result["summary"],
        recommended_actions=result["recommended_actions"],
        analyzer_used=result["analyzer_used"],
        language_detected=result["language_detected"],
    )
