"""
AI Routes for PowerLeave
"""

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, timezone

from database import db
from auth import get_current_user
from ai_service import (
    suggest_leave_type, 
    generate_monthly_report, 
    analyze_team_insights,
    is_ai_enabled
)

router = APIRouter(prefix="/api/ai", tags=["AI"])


class SuggestLeaveTypeRequest(BaseModel):
    notes: str


class SuggestLeaveTypeResponse(BaseModel):
    enabled: bool
    suggestion: Optional[dict] = None


class TeamInsightsResponse(BaseModel):
    enabled: bool
    conflicts: List[dict] = []
    week_capacity: dict = {}
    risk_employees: List[dict] = []
    recommendations: List[dict] = []


class MonthlyReportResponse(BaseModel):
    enabled: bool
    year: int
    month: int
    report: Optional[str] = None


@router.post("/suggest-leave-type", response_model=SuggestLeaveTypeResponse)
async def api_suggest_leave_type(
    request: SuggestLeaveTypeRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    AI-powered leave type suggestion based on user notes.
    Returns suggested type with confidence score.
    """
    if not is_ai_enabled():
        return SuggestLeaveTypeResponse(enabled=False, suggestion=None)
    
    # Get available leave types
    leave_types = await db.leave_types.find({}).to_list(100)
    leave_types_clean = [{"id": lt["id"], "name": lt["name"]} for lt in leave_types]
    
    suggestion = await suggest_leave_type(request.notes, leave_types_clean)
    
    return SuggestLeaveTypeResponse(
        enabled=True,
        suggestion=suggestion
    )


@router.get("/team-insights", response_model=TeamInsightsResponse)
async def api_team_insights(
    current_user: dict = Depends(get_current_user)
):
    """
    Local analysis of team leave patterns.
    Returns conflicts, capacity, and at-risk employees.
    Admin only.
    """
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Solo gli admin possono accedere agli insights")
    
    org_id = current_user.get("org_id")
    
    # Fetch data
    users = await db.users.find(
        {"org_id": org_id},
        {"_id": 0, "user_id": 1, "name": 1, "role": 1}
    ).to_list(500)
    
    requests = await db.leave_requests.find(
        {"org_id": org_id},
        {"_id": 0}
    ).to_list(1000)
    
    year = datetime.now(timezone.utc).year
    balances = await db.leave_balances.find(
        {"org_id": org_id, "year": year},
        {"_id": 0}
    ).to_list(500)
    
    closures = await db.company_closures.find(
        {"$or": [{"org_id": org_id}, {"org_id": None}]},
        {"_id": 0}
    ).to_list(100)
    
    insights = analyze_team_insights(users, requests, balances, closures)
    
    return TeamInsightsResponse(**insights)


@router.get("/monthly-report/{year}/{month}", response_model=MonthlyReportResponse)
async def api_monthly_report(
    year: int,
    month: int,
    current_user: dict = Depends(get_current_user)
):
    """
    AI-generated narrative monthly report.
    Admin only.
    """
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Solo gli admin possono generare report")
    
    if not 1 <= month <= 12:
        raise HTTPException(status_code=400, detail="Mese non valido")
    
    if not is_ai_enabled():
        return MonthlyReportResponse(enabled=False, year=year, month=month, report=None)
    
    org_id = current_user.get("org_id")
    
    # Get stats
    stats_doc = await db.stats.find_one({"org_id": org_id}, {"_id": 0})
    stats = stats_doc or {"utilization_rate": 0}
    
    # Get requests for the month
    month_start = f"{year}-{month:02d}-01"
    if month == 12:
        month_end = f"{year + 1}-01-01"
    else:
        month_end = f"{year}-{month + 1:02d}-01"
    
    requests = await db.leave_requests.find({
        "org_id": org_id,
        "start_date": {"$gte": month_start, "$lt": month_end}
    }, {"_id": 0}).to_list(500)
    
    # Get org name
    org = await db.organizations.find_one({"org_id": org_id}, {"_id": 0, "name": 1})
    org_name = org.get("name", "L'azienda") if org else "L'azienda"
    
    report = await generate_monthly_report(year, month, stats, requests, org_name)
    
    return MonthlyReportResponse(
        enabled=True,
        year=year,
        month=month,
        report=report
    )


@router.get("/status")
async def api_ai_status(current_user: dict = Depends(get_current_user)):
    """Check if AI features are enabled."""
    return {"enabled": is_ai_enabled()}
