"""
PowerLeave AI Service
Provides AI-powered features using OpenAI GPT-4o-mini.
If EMERGENT_LLM_KEY is not configured, features are disabled silently.
"""

import os
import logging
from datetime import datetime, timezone, timedelta
from typing import Optional, Dict, Any, List

logger = logging.getLogger(__name__)

# Check if AI is enabled
EMERGENT_LLM_KEY = os.environ.get("EMERGENT_LLM_KEY")
AI_ENABLED = bool(EMERGENT_LLM_KEY)

if AI_ENABLED:
    try:
        from emergentintegrations.llm.chat import LlmChat, UserMessage
        logger.info("AI service initialized with Emergent LLM key")
    except ImportError:
        AI_ENABLED = False
        logger.warning("emergentintegrations not installed - AI features disabled")
else:
    logger.info("EMERGENT_LLM_KEY not configured - AI features disabled")


async def suggest_leave_type(notes: str, leave_types: List[Dict]) -> Optional[Dict[str, Any]]:
    """
    Analyze user notes and suggest the most appropriate leave type.
    Returns dict with suggested_type, confidence, reason.
    """
    if not AI_ENABLED or not notes or len(notes.strip()) < 3:
        return None
    
    try:
        # Format leave types for the prompt
        types_list = ", ".join([t.get("name", t.get("id")) for t in leave_types])
        
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=f"leave-suggest-{datetime.now().timestamp()}",
            system_message="""Sei un assistente HR italiano. Analizza le note di una richiesta di assenza e suggerisci il tipo più appropriato.
Rispondi SOLO in formato JSON con questa struttura esatta:
{"tipo": "nome_tipo", "confidence": 0.0-1.0, "motivo": "breve spiegazione"}
Non aggiungere altro testo."""
        ).with_model("openai", "gpt-4.1-mini")
        
        user_message = UserMessage(
            text=f"""Tipi di assenza disponibili: {types_list}

Note dell'utente: "{notes}"

Quale tipo di assenza è più appropriato?"""
        )
        
        response = await chat.send_message(user_message)
        
        # Parse JSON response
        import json
        # Clean response - remove markdown if present
        response_text = response.strip()
        if response_text.startswith("```"):
            response_text = response_text.split("```")[1]
            if response_text.startswith("json"):
                response_text = response_text[4:]
        response_text = response_text.strip()
        
        result = json.loads(response_text)
        
        # Map back to leave type ID
        suggested_name = result.get("tipo", "").lower()
        suggested_type = None
        for lt in leave_types:
            if lt.get("name", "").lower() == suggested_name or lt.get("id", "").lower() == suggested_name:
                suggested_type = lt
                break
        
        if not suggested_type:
            # Default to first matching word
            for lt in leave_types:
                if lt.get("name", "").lower() in suggested_name or suggested_name in lt.get("name", "").lower():
                    suggested_type = lt
                    break
        
        if suggested_type:
            return {
                "suggested_type_id": suggested_type.get("id"),
                "suggested_type_name": suggested_type.get("name"),
                "confidence": min(1.0, max(0.0, float(result.get("confidence", 0.7)))),
                "reason": result.get("motivo", "Basato sull'analisi delle note")
            }
        
        return None
        
    except Exception as e:
        logger.error(f"AI suggest_leave_type error: {str(e)}")
        return None


async def generate_monthly_report(
    year: int, 
    month: int, 
    stats: Dict[str, Any],
    requests: List[Dict],
    org_name: str = "L'azienda"
) -> Optional[str]:
    """
    Generate a narrative monthly report using AI.
    Returns a paragraph summarizing the month's leave activity.
    """
    if not AI_ENABLED:
        return None
    
    try:
        # Prepare stats summary
        total_requests = len(requests)
        approved = len([r for r in requests if r.get("status") == "approved"])
        pending = len([r for r in requests if r.get("status") == "pending"])
        rejected = len([r for r in requests if r.get("status") == "rejected"])
        
        # Group by type
        type_counts = {}
        total_days = 0
        for r in requests:
            lt = r.get("leave_type_name", "Altro")
            type_counts[lt] = type_counts.get(lt, 0) + 1
            if r.get("status") == "approved":
                total_days += r.get("days", 0)
        
        types_summary = ", ".join([f"{count} {tipo}" for tipo, count in type_counts.items()])
        
        month_names = ["", "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
                       "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"]
        month_name = month_names[month] if 1 <= month <= 12 else str(month)
        
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=f"monthly-report-{year}-{month}",
            system_message="""Sei un analista HR italiano. Scrivi un breve paragrafo (3-4 frasi) che riassume l'attività mensile delle assenze.
Tono professionale ma accessibile. Non usare elenchi puntati, solo prosa fluida."""
        ).with_model("openai", "gpt-4.1-mini")
        
        user_message = UserMessage(
            text=f"""Mese: {month_name} {year}
Totale richieste: {total_requests}
Approvate: {approved}, In attesa: {pending}, Rifiutate: {rejected}
Giorni totali approvati: {total_days}
Distribuzione: {types_summary if types_summary else "nessuna richiesta"}
Tasso utilizzo ferie: {stats.get('utilization_rate', 0)}%

Scrivi un breve riepilogo narrativo del mese."""
        )
        
        response = await chat.send_message(user_message)
        return response.strip()
        
    except Exception as e:
        logger.error(f"AI generate_monthly_report error: {str(e)}")
        return None


def analyze_team_insights(
    users: List[Dict],
    requests: List[Dict],
    balances: List[Dict],
    closures: List[Dict]
) -> Dict[str, Any]:
    """
    Analyze team data locally (no LLM) to generate insights.
    Returns conflicts, capacity, and employees at risk.
    """
    insights = {
        "enabled": True,
        "conflicts": [],
        "week_capacity": {"available": 0, "absent": 0, "total": 0},
        "risk_employees": [],
        "recommendations": []
    }
    
    today = datetime.now(timezone.utc).date()
    week_start = today - timedelta(days=today.weekday())
    week_end = week_start + timedelta(days=6)
    
    # Get approved requests
    approved_requests = [r for r in requests if r.get("status") == "approved"]
    pending_requests = [r for r in requests if r.get("status") == "pending"]
    
    # Analyze week capacity
    total_users = len(users)
    absent_this_week = set()
    
    for req in approved_requests:
        try:
            start = datetime.strptime(req.get("start_date", ""), "%Y-%m-%d").date()
            end = datetime.strptime(req.get("end_date", ""), "%Y-%m-%d").date()
            
            # Check if overlaps with current week
            if start <= week_end and end >= week_start:
                absent_this_week.add(req.get("user_id"))
        except:
            pass
    
    insights["week_capacity"] = {
        "available": total_users - len(absent_this_week),
        "absent": len(absent_this_week),
        "total": total_users,
        "percentage": round((total_users - len(absent_this_week)) / max(1, total_users) * 100)
    }
    
    # Check for conflicts (overlapping requests from multiple users)
    conflicts = []
    date_coverage = {}
    
    for req in approved_requests + pending_requests:
        try:
            start = datetime.strptime(req.get("start_date", ""), "%Y-%m-%d").date()
            end = datetime.strptime(req.get("end_date", ""), "%Y-%m-%d").date()
            
            current = start
            while current <= end:
                date_str = current.strftime("%Y-%m-%d")
                if date_str not in date_coverage:
                    date_coverage[date_str] = []
                date_coverage[date_str].append({
                    "user_name": req.get("user_name"),
                    "user_id": req.get("user_id"),
                    "type": req.get("leave_type_name"),
                    "status": req.get("status")
                })
                current += timedelta(days=1)
        except:
            pass
    
    # Find dates with high absence
    for date_str, users_absent in date_coverage.items():
        if len(users_absent) >= max(2, total_users // 2):  # 50% or more absent
            try:
                date_obj = datetime.strptime(date_str, "%Y-%m-%d").date()
                if date_obj >= today:  # Only future conflicts
                    conflicts.append({
                        "date": date_str,
                        "count": len(users_absent),
                        "users": [u["user_name"] for u in users_absent][:5],
                        "severity": "high" if len(users_absent) >= total_users * 0.7 else "medium"
                    })
            except:
                pass
    
    # Sort and limit conflicts
    conflicts.sort(key=lambda x: x["date"])
    insights["conflicts"] = conflicts[:5]
    
    # Analyze employees at risk of exhausting leave
    year = today.year
    for user in users:
        user_id = user.get("user_id")
        user_balances = [b for b in balances if b.get("user_id") == user_id and b.get("year") == year]
        
        for bal in user_balances:
            if bal.get("leave_type_id") == "ferie":
                total = bal.get("total_days", 26)
                used = bal.get("used_days", 0)
                remaining = total - used
                usage_percent = (used / max(1, total)) * 100
                
                # Calculate pending days for this user
                pending_days = sum([
                    r.get("days", 0) for r in pending_requests 
                    if r.get("user_id") == user_id and r.get("leave_type_id") == "ferie"
                ])
                
                # Risk if less than 20% remaining or will exhaust with pending
                if remaining <= total * 0.2 or remaining - pending_days <= 0:
                    insights["risk_employees"].append({
                        "user_name": user.get("name"),
                        "remaining_days": remaining,
                        "pending_days": pending_days,
                        "total_days": total,
                        "risk_level": "high" if remaining <= 3 else "medium"
                    })
    
    # Sort by risk
    insights["risk_employees"].sort(key=lambda x: x["remaining_days"])
    insights["risk_employees"] = insights["risk_employees"][:5]
    
    # Generate recommendations
    if insights["week_capacity"]["percentage"] < 50:
        insights["recommendations"].append({
            "type": "capacity",
            "message": f"Questa settimana il {100 - insights['week_capacity']['percentage']}% del team è assente. Valuta di posticipare nuove approvazioni."
        })
    
    if len(insights["conflicts"]) > 0:
        insights["recommendations"].append({
            "type": "conflict",
            "message": f"Ci sono {len(insights['conflicts'])} date con alta concentrazione di assenze. Verifica la copertura."
        })
    
    if len(insights["risk_employees"]) > 0:
        insights["recommendations"].append({
            "type": "balance",
            "message": f"{len(insights['risk_employees'])} dipendenti hanno poche ferie residue. Potrebbero aver bisogno di pianificare."
        })
    
    return insights


def is_ai_enabled() -> bool:
    """Check if AI features are enabled."""
    return AI_ENABLED
