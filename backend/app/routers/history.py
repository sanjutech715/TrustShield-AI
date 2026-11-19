from __future__ import annotations

from fastapi import APIRouter

from .. import database
from ..models import DashboardStats

router = APIRouter(prefix="/api", tags=["history"])


@router.get("/dashboard", response_model=DashboardStats)
def dashboard() -> DashboardStats:
    return DashboardStats(**database.get_dashboard_stats())
