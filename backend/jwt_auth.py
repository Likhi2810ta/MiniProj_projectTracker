"""
JWT authentication + coordinator-role checks.
Validates Supabase-issued JWTs and resolves coordinator status against the DB.
"""

import os
import jwt
from fastapi import Header, HTTPException, status

_SECRET = os.getenv("SUPABASE_JWT_SECRET")


def verify_token(authorization: str = Header(...)) -> dict:
    """Decode + verify a Supabase JWT. Raises 401 on missing/expired/invalid."""
    if not _SECRET:
        raise RuntimeError("SUPABASE_JWT_SECRET must be set in the environment.")

    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header must use the Bearer scheme.",
        )

    token = authorization[len("Bearer "):]
    try:
        payload = jwt.decode(
            token, _SECRET, algorithms=["HS256"],
            options={"verify_aud": False},
        )
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(401, "Token has expired.")
    except jwt.InvalidTokenError as exc:
        raise HTTPException(401, f"Invalid token: {exc}")


def require_coordinator_for_course(course_id: str, user: dict) -> None:
    """Raise 403 unless the JWT user is registered as a coordinator for course_id."""
    from project_tracker import db   # late import to avoid circular dep
    user_id = user.get("sub")
    if not user_id:
        raise HTTPException(401, "Token has no subject claim.")
    hit = db.table("coordinator").select("course_id") \
        .eq("user_id", user_id).eq("course_id", course_id).execute()
    if not hit.data:
        raise HTTPException(403, "Only the course coordinator may perform this action.")


def require_coordinator_for_project(project_id: str, user: dict) -> None:
    """Same check, but resolves the course_id from the project first."""
    from project_tracker import db
    user_id = user.get("sub")
    if not user_id:
        raise HTTPException(401, "Token has no subject claim.")
    proj = db.table("project").select("course_id").eq("project_id", project_id).execute()
    if not proj.data:
        raise HTTPException(404, "Project not found.")
    course_id = proj.data[0]["course_id"]
    hit = db.table("coordinator").select("course_id") \
        .eq("user_id", user_id).eq("course_id", course_id).execute()
    if not hit.data:
        raise HTTPException(403, "Only the course coordinator may perform this action.")
