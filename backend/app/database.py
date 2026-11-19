"""
Minimal SQLite persistence for TrustShield AI.

We deliberately keep this to the standard library (sqlite3) rather than an
ORM, since the prototype only needs one table: a rolling log of analyses
used to power the "Security Status Dashboard" counters on the frontend.

No message content is ever stored in full — only a short, truncated
preview — since this is a security tool and the raw text may contain
sensitive data the user pasted in (OTPs, account numbers, etc).
"""

from __future__ import annotations

import os
import sqlite3
from contextlib import contextmanager
from datetime import datetime, timezone
from typing import Iterator

DB_PATH = os.environ.get("DATABASE_PATH", "trustshield.db")

SCHEMA = """
CREATE TABLE IF NOT EXISTS analysis_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at TEXT NOT NULL,
    input_type TEXT NOT NULL,          -- 'message' | 'url'
    input_preview TEXT NOT NULL,       -- truncated, non-sensitive preview
    risk_score INTEGER NOT NULL,
    risk_category TEXT NOT NULL,
    analyzer_used TEXT NOT NULL,       -- 'rule_based' | 'gemini'
    language TEXT NOT NULL
);
"""


@contextmanager
def get_connection() -> Iterator[sqlite3.Connection]:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
        conn.commit()
    finally:
        conn.close()


def init_db() -> None:
    with get_connection() as conn:
        conn.execute(SCHEMA)


def log_analysis(
    input_type: str,
    input_preview: str,
    risk_score: int,
    risk_category: str,
    analyzer_used: str,
    language: str,
) -> None:
    with get_connection() as conn:
        conn.execute(
            """
            INSERT INTO analysis_log
                (created_at, input_type, input_preview, risk_score,
                 risk_category, analyzer_used, language)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (
                datetime.now(timezone.utc).isoformat(),
                input_type,
                input_preview[:80],
                risk_score,
                risk_category,
                analyzer_used,
                language,
            ),
        )


def get_dashboard_stats() -> dict:
    with get_connection() as conn:
        total = conn.execute("SELECT COUNT(*) AS c FROM analysis_log").fetchone()["c"]
        by_category = conn.execute(
            "SELECT risk_category, COUNT(*) AS c FROM analysis_log GROUP BY risk_category"
        ).fetchall()
        recent = conn.execute(
            """
            SELECT created_at, input_type, input_preview, risk_score, risk_category
            FROM analysis_log
            ORDER BY id DESC
            LIMIT 8
            """
        ).fetchall()

        counts = {"Low": 0, "Medium": 0, "High": 0, "Critical": 0}
        for row in by_category:
            if row["risk_category"] in counts:
                counts[row["risk_category"]] = row["c"]

        return {
            "total_scanned": total,
            "category_counts": counts,
            "recent": [dict(r) for r in recent],
        }
