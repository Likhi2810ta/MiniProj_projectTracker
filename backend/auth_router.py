"""
Custom registration flow:
  POST /api/auth/request-otp   — email + password → sends 6-digit OTP via SMTP
  POST /api/auth/verify-otp    — OTP → creates Supabase account + pending profile
  POST /api/auth/login         — email + password → Supabase JWT + checks approval

OTPs are stored in-memory (5-minute TTL).
Account creation calls the Supabase Admin API so email confirmation is skipped.
"""

from __future__ import annotations

import os
import random
import re
import smtplib
import time
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

import requests
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/api/auth", tags=["auth"])

# ── Config ────────────────────────────────────────────────────────────────────
_SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
_SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
_SMTP_USER = os.getenv("SMTP_USER", "")
_SMTP_PASS = os.getenv("SMTP_PASS", "")
_SMTP_FROM = os.getenv("SMTP_FROM") or _SMTP_USER

# Normalise Supabase URL — strip /rest/v1 if caller put it there
_RAW_URL = os.getenv("SUPABASE_URL", "").rstrip("/")
_SUPA_BASE = _RAW_URL[: -len("/rest/v1")] if _RAW_URL.endswith("/rest/v1") else _RAW_URL
_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY", "")

_STUDENT_RE = re.compile(r"^[a-zA-Z0-9]+@dsce\.edu\.in$", re.IGNORECASE)
_OTP_STORE: dict[str, dict] = {}   # email → {otp, expires_at, password}
_OTP_TTL = 300                      # 5 minutes


# ── Helpers ───────────────────────────────────────────────────────────────────

def _send_otp_email(to: str, otp: str) -> None:
    if not (_SMTP_USER and _SMTP_PASS):
        raise HTTPException(503, "SMTP is not configured on the server (SMTP_USER / SMTP_PASS missing).")
    msg = MIMEMultipart("alternative")
    msg["Subject"] = "Project Tracker – Email Verification"
    msg["From"]    = _SMTP_FROM
    msg["To"]      = to
    msg.attach(MIMEText(f"""
    <div style="font-family:monospace;background:#0D1B2A;color:#F0F0F0;
                padding:32px;border-radius:8px;max-width:480px">
      <div style="color:#F5A623;font-size:11px;letter-spacing:2px;margin-bottom:8px">
        PROJECT TRACKER
      </div>
      <h2 style="color:#FFFFFF;margin:0 0 24px">Email Verification</h2>
      <p style="margin-bottom:16px">Your one-time password:</p>
      <div style="font-size:36px;font-weight:bold;color:#F5A623;letter-spacing:8px;
                  padding:16px;background:#162030;border-radius:6px;
                  text-align:center;margin-bottom:24px">{otp}</div>
      <p style="color:#888;font-size:12px">Valid for 5 minutes. Do not share this code.</p>
    </div>
    """, "html"))
    try:
        with smtplib.SMTP(_SMTP_HOST, _SMTP_PORT, timeout=10) as s:
            s.ehlo(); s.starttls(); s.login(_SMTP_USER, _SMTP_PASS)
            s.sendmail(_SMTP_FROM, to, msg.as_string())
    except smtplib.SMTPAuthenticationError:
        raise HTTPException(502, "SMTP authentication failed. Check SMTP_USER / SMTP_PASS.")
    except Exception as exc:
        raise HTTPException(502, f"Failed to send email: {exc}")


def _supa_create_user(email: str, password: str) -> str:
    """Create a confirmed Supabase auth user via Admin API. Returns user UUID."""
    if not (_SUPA_BASE and _SERVICE_KEY):
        raise HTTPException(503, "Supabase credentials not configured.")
    res = requests.post(
        f"{_SUPA_BASE}/auth/v1/admin/users",
        json={"email": email, "password": password, "email_confirm": True},
        headers={
            "apikey": _SERVICE_KEY,
            "Authorization": f"Bearer {_SERVICE_KEY}",
            "Content-Type": "application/json",
        },
        timeout=10,
    )
    data = res.json()
    if not res.ok:
        msg = data.get("message") or data.get("msg") or str(data)
        if "already been registered" in msg or "already exists" in msg:
            raise HTTPException(409, "An account with this email already exists.")
        raise HTTPException(res.status_code, f"Could not create account: {msg}")
    return data["id"]


def _supa_delete_user(user_id: str) -> None:
    requests.delete(
        f"{_SUPA_BASE}/auth/v1/admin/users/{user_id}",
        headers={
            "apikey": _SERVICE_KEY,
            "Authorization": f"Bearer {_SERVICE_KEY}",
        },
        timeout=10,
    )


def _supa_login(email: str, password: str) -> dict:
    """Call Supabase password grant, return token payload."""
    res = requests.post(
        f"{_SUPA_BASE}/auth/v1/token?grant_type=password",
        json={"email": email, "password": password},
        headers={
            "apikey": _SERVICE_KEY,
            "Content-Type": "application/json",
        },
        timeout=10,
    )
    data = res.json()
    if not res.ok:
        raise HTTPException(401, data.get("error_description") or data.get("msg") or "Invalid credentials.")
    return data


# ── Schemas ───────────────────────────────────────────────────────────────────

class OTPRequest(BaseModel):
    email: str
    password: str

class OTPVerify(BaseModel):
    email: str
    otp: str

class LoginRequest(BaseModel):
    email: str
    password: str


# ── Endpoints ─────────────────────────────────────────────────────────────────

@router.post("/request-otp")
def request_otp(body: OTPRequest):
    """Step 1 of registration: send OTP to email."""
    email = body.email.strip().lower()
    if len(body.password) < 6:
        raise HTTPException(400, "Password must be at least 6 characters.")

    otp = str(random.randint(100000, 999999))
    _OTP_STORE[email] = {
        "otp": otp,
        "expires_at": time.time() + _OTP_TTL,
        "password": body.password,
    }
    _send_otp_email(email, otp)
    return {"message": "OTP sent. Check your inbox (and spam folder)."}


@router.post("/verify-otp")
def verify_otp(body: OTPVerify):
    """Step 2 of registration: verify OTP, create account (pending approval)."""
    from project_tracker import db

    email = body.email.strip().lower()
    entry = _OTP_STORE.get(email)

    if not entry:
        raise HTTPException(400, "No OTP found for this email. Please request one first.")
    if time.time() > entry["expires_at"]:
        _OTP_STORE.pop(email, None)
        raise HTTPException(400, "OTP expired. Please request a new one.")
    if entry["otp"] != body.otp.strip():
        raise HTTPException(400, "Incorrect OTP. Please try again.")

    password = entry.pop("password")  # consume immediately
    _OTP_STORE.pop(email, None)

    user_id = _supa_create_user(email, password)

    role = "student" if _STUDENT_RE.match(email) else "lecturer"
    try:
        db.table("profiles").insert({
            "id": user_id,
            "email": email,
            "role": role,
            "approved": False,
        }).execute()
    except Exception as exc:
        _supa_delete_user(user_id)   # rollback
        raise HTTPException(500, f"Profile setup failed: {exc}")

    return {
        "message": (
            "Account created! Your request has been sent to the admin for approval. "
            "You'll be able to sign in once approved."
        ),
        "role": role,
        "pending": True,
    }


@router.post("/login")
def login(body: LoginRequest):
    """Login: Supabase auth + approval check."""
    from project_tracker import db

    email = body.email.strip().lower()
    token_data = _supa_login(email, body.password)

    # Decode sub from JWT to look up profile
    import base64, json as _json
    try:
        payload_b64 = token_data["access_token"].split(".")[1]
        payload_b64 += "=" * (-len(payload_b64) % 4)
        uid = _json.loads(base64.b64decode(payload_b64)).get("sub")
    except Exception:
        uid = None

    if uid:
        prof = db.table("profiles").select("role, approved").eq("id", uid).execute()
        if prof.data:
            p = prof.data[0]
            if p.get("role") != "admin" and not p.get("approved", False):
                raise HTTPException(403, "Your account is pending admin approval.")

    return token_data
