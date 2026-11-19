from __future__ import annotations

from fastapi import APIRouter

from .. import database, url_inspector
from ..models import URLCheckRequest, URLCheckResponse, URLIndicator

router = APIRouter(prefix="/api", tags=["url-check"])


@router.post("/url-check", response_model=URLCheckResponse)
def check_url(payload: URLCheckRequest) -> URLCheckResponse:
    result = url_inspector.inspect_url(payload.url)

    database.log_analysis(
        input_type="url",
        input_preview=payload.url,
        risk_score=0,  # URL checks use caution_level, not a 0-100 score
        risk_category=result["caution_level"],
        analyzer_used="rule_based",
        language="en",
    )

    return URLCheckResponse(
        submitted_url=result["submitted_url"],
        hostname=result["hostname"],
        scheme=result["scheme"],
        indicators=[URLIndicator(**i) for i in result["indicators"]],
        caution_level=result["caution_level"],
    )
