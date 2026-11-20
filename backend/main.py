"""
TrustShield AI — backend entry point.

Run locally with:
    uvicorn main:app --reload --port 8000

Interactive API docs (useful for the Postman/demo step) are then at:
    http://localhost:8000/docs
"""

from __future__ import annotations

import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

from app import ai_gemini, database  # noqa: E402  (import after load_dotenv)
from app.routers import analyze, history, url_check  # noqa: E402

app = FastAPI(
    title="TrustShield AI API",
    description="Rule-based + optional-Gemini scam message and URL risk analyzer.",
    version="0.1.0",
)

origins = [
    o.strip()
    for o in os.environ.get(
        "CORS_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173",
    ).split(",")
    if o.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup() -> None:
    database.init_db()


@app.get("/api/health", tags=["health"])
def health() -> dict:
    return {
        "status": "ok",
        "ai_configured": ai_gemini.is_configured(),
        "note": (
            "ai_configured indicates that the Gemini package and API key "
            "are present; it does not verify connectivity or key validity. "
            "An analysis reports analyzer_used='gemini' only after a live "
            "Gemini call succeeds; otherwise it uses the rule-based engine."
        ),
    }


app.include_router(analyze.router)
app.include_router(url_check.router)
app.include_router(history.router)
