"""
PowerLeave Email Service
Sends transactional emails via SendGrid.
If SENDGRID_API_KEY is not configured, emails are skipped silently.
"""

import os
import logging
from typing import Optional

logger = logging.getLogger(__name__)

# SendGrid configuration
SENDGRID_API_KEY = os.environ.get("SENDGRID_API_KEY")
FROM_EMAIL = os.environ.get("SENDGRID_FROM_EMAIL", "noreply@powerleave.app")
FROM_NAME = os.environ.get("SENDGRID_FROM_NAME", "PowerLeave")

# Check if email is enabled
EMAIL_ENABLED = bool(SENDGRID_API_KEY)

if EMAIL_ENABLED:
    try:
        from sendgrid import SendGridAPIClient
        from sendgrid.helpers.mail import Mail, Email, To, Content
        logger.info("SendGrid email service initialized")
    except ImportError:
        EMAIL_ENABLED = False
        logger.warning("sendgrid package not installed - email disabled")
else:
    logger.info("SENDGRID_API_KEY not configured - email service disabled")


def _send_email(to_email: str, subject: str, html_content: str) -> bool:
    """
    Internal function to send an email via SendGrid.
    Returns True if sent successfully, False otherwise.
    """
    if not EMAIL_ENABLED:
        logger.debug(f"Email skipped (disabled): {subject} -> {to_email}")
        return False
    
    try:
        message = Mail(
            from_email=Email(FROM_EMAIL, FROM_NAME),
            to_emails=To(to_email),
            subject=subject,
            html_content=Content("text/html", html_content)
        )
        
        sg = SendGridAPIClient(SENDGRID_API_KEY)
        response = sg.send(message)
        
        if response.status_code in (200, 201, 202):
            logger.info(f"Email sent successfully: {subject} -> {to_email}")
            return True
        else:
            logger.warning(f"Email send returned status {response.status_code}: {subject} -> {to_email}")
            return False
            
    except Exception as e:
        logger.error(f"Failed to send email: {subject} -> {to_email}: {str(e)}")
        return False


def send_invite_email(
    to_email: str,
    user_name: str,
    temp_password: str,
    org_name: str,
    login_url: str = "https://app.powerleave.app/login"
) -> bool:
    """
    Send invitation email with temporary password to new user.
    Called when an admin invites a new team member.
    """
    subject = f"Benvenuto in {org_name} - Il tuo accesso a PowerLeave"
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background: linear-gradient(135deg, #3B82F6, #8B5CF6); color: white; padding: 30px; border-radius: 12px 12px 0 0; text-align: center; }}
            .content {{ background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; border-top: none; }}
            .password-box {{ background: white; border: 2px dashed #3B82F6; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }}
            .password {{ font-size: 24px; font-weight: bold; color: #1e40af; letter-spacing: 2px; font-family: monospace; }}
            .btn {{ display: inline-block; background: #3B82F6; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }}
            .footer {{ text-align: center; padding: 20px; color: #64748b; font-size: 12px; }}
            .warning {{ background: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px 16px; margin: 20px 0; font-size: 14px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1 style="margin: 0;">🚀 Benvenuto in PowerLeave!</h1>
            </div>
            <div class="content">
                <p>Ciao <strong>{user_name}</strong>,</p>
                <p>Sei stato invitato a far parte di <strong>{org_name}</strong> su PowerLeave, il sistema di gestione ferie e assenze.</p>
                
                <div class="password-box">
                    <p style="margin: 0 0 10px; color: #64748b; font-size: 14px;">La tua password temporanea è:</p>
                    <div class="password">{temp_password}</div>
                </div>
                
                <div class="warning">
                    ⚠️ <strong>Importante:</strong> Al primo accesso ti verrà chiesto di impostare una nuova password sicura.
                </div>
                
                <div style="text-align: center;">
                    <a href="{login_url}" class="btn">Accedi a PowerLeave</a>
                </div>
                
                <p>Se hai domande, contatta il tuo amministratore.</p>
                <p>Buon lavoro!<br>Il team PowerLeave</p>
            </div>
            <div class="footer">
                <p>PowerLeave - Workforce Intelligence</p>
                <p>Questa email è stata inviata automaticamente. Non rispondere a questo indirizzo.</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    return _send_email(to_email, subject, html_content)


def send_leave_status_email(
    to_email: str,
    user_name: str,
    leave_type: str,
    start_date: str,
    end_date: str,
    days: int,
    status: str,  # 'approved' or 'rejected'
    reviewer_name: Optional[str] = None,
    rejection_reason: Optional[str] = None
) -> bool:
    """
    Send notification email when a leave request is approved or rejected.
    """
    is_approved = status == 'approved'
    status_text = "APPROVATA ✅" if is_approved else "RIFIUTATA ❌"
    status_color = "#22c55e" if is_approved else "#ef4444"
    
    subject = f"Richiesta {leave_type} {status_text}"
    
    rejection_section = ""
    if not is_approved and rejection_reason:
        rejection_section = f"""
        <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 12px 16px; margin: 20px 0;">
            <strong>Motivo del rifiuto:</strong><br>
            {rejection_reason}
        </div>
        """
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background: {status_color}; color: white; padding: 30px; border-radius: 12px 12px 0 0; text-align: center; }}
            .content {{ background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; border-top: none; }}
            .details {{ background: white; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; margin: 20px 0; }}
            .detail-row {{ display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f1f5f9; }}
            .detail-row:last-child {{ border-bottom: none; }}
            .label {{ color: #64748b; }}
            .value {{ font-weight: 600; }}
            .footer {{ text-align: center; padding: 20px; color: #64748b; font-size: 12px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1 style="margin: 0;">Richiesta {status_text}</h1>
            </div>
            <div class="content">
                <p>Ciao <strong>{user_name}</strong>,</p>
                <p>La tua richiesta di <strong>{leave_type}</strong> è stata <strong style="color: {status_color}">{"approvata" if is_approved else "rifiutata"}</strong>.</p>
                
                <div class="details">
                    <div class="detail-row">
                        <span class="label">Tipo assenza</span>
                        <span class="value">{leave_type}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Periodo</span>
                        <span class="value">{start_date} → {end_date}</span>
                    </div>
                    <div class="detail-row">
                        <span class="label">Giorni</span>
                        <span class="value">{days}</span>
                    </div>
                    {f'<div class="detail-row"><span class="label">Approvato da</span><span class="value">{reviewer_name}</span></div>' if reviewer_name else ''}
                </div>
                
                {rejection_section}
                
                <p>{"Buone vacanze!" if is_approved else "Per qualsiasi chiarimento, contatta il tuo responsabile."}</p>
                <p>Saluti,<br>Il team PowerLeave</p>
            </div>
            <div class="footer">
                <p>PowerLeave - Workforce Intelligence</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    return _send_email(to_email, subject, html_content)


# Background task wrappers for FastAPI
async def send_invite_email_background(
    to_email: str,
    user_name: str,
    temp_password: str,
    org_name: str,
    login_url: str = "https://app.powerleave.app/login"
):
    """Background task wrapper for invite email."""
    send_invite_email(to_email, user_name, temp_password, org_name, login_url)


async def send_leave_status_email_background(
    to_email: str,
    user_name: str,
    leave_type: str,
    start_date: str,
    end_date: str,
    days: int,
    status: str,
    reviewer_name: Optional[str] = None,
    rejection_reason: Optional[str] = None
):
    """Background task wrapper for leave status email."""
    send_leave_status_email(
        to_email, user_name, leave_type, start_date, end_date,
        days, status, reviewer_name, rejection_reason
    )
